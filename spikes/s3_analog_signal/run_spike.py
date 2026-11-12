#!/usr/bin/env python3
"""
Spike S3 -- does analog retrieval produce out-of-sample signal?

Decision rule is PRE-REGISTERED in 07-planning/phase-0-execution.md section 7.
It is applied here mechanically so the verdict cannot be argued with after the fact.

  python3 run_spike.py                 # synthetic data (validates the harness)
  python3 run_spike.py --seed 42       # different draw
  python3 run_spike.py --real data.csv # real data (see adapters.py)
"""
import argparse, sys
from statistics import mean
import synth
from analog import AnalogEngine
from backtest import evaluate, per_fold_stability
from stats_tests import test_class, sign_test_folds
from power import achieved_power, min_detectable_effect, required_n

TARGET_EFFECT_PP = 5.0   # the lift a real Impact Engine edge is expected to have

GO_LIFT, COND_LIFT, MIN_N = 4.0, 2.0, 100


def score_classes(results, stability):
    """Attach significance to every class. n_tests drives the Bonferroni correction."""
    testable = [t for t, r in results.items() if r.get("n", 0) >= MIN_N]
    n_tests = len(testable)
    for t in testable:
        r = results[t]
        hits = round(r["model_acc"] * r["n"])
        pval, alpha, passes = test_class(hits, r["n"], r["baseline_acc"], n_tests)
        folds_p = sign_test_folds(stability.get(t, []))
        r["p"] = pval
        r["alpha"] = alpha
        r["sig"] = passes
        r["folds_p"] = folds_p
        # a class is credible only if it beats the honest null AND is fold-stable
        r["credible"] = passes and folds_p <= 0.35 and r["lift_pp"] >= COND_LIFT
        # Can this class even answer the question? Underpowered classes must be
        # reported as "cannot tell", never as "no signal".
        r["power"] = achieved_power(r["n"], TARGET_EFFECT_PP, alpha)
        r["mde_pp"] = min_detectable_effect(r["n"], alpha)
        r["powered"] = r["power"] >= 0.80
    return n_tests


def verdict(results, stability):
    strong = [t for t, r in results.items()
              if r.get("credible") and r.get("lift_pp", 0) >= GO_LIFT]
    weak = [t for t, r in results.items()
            if r.get("n", 0) >= MIN_N and not r.get("credible")
            and r.get("lift_pp", 0) >= COND_LIFT
            and r.get("p", 1) < 0.10]          # suggestive, not significant
    powered = [t for t, r in results.items() if r.get("powered")]
    if len(strong) >= 2:
        return "GO", strong, weak
    if len(strong) == 1 or len(weak) >= 2:
        return "CONDITIONAL", strong, weak
    # Critical distinction: no signal found, vs. not enough data to look.
    if not powered:
        return "INSUFFICIENT POWER", strong, weak
    return "NO-GO", strong, weak


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--seed", type=int, default=7)
    ap.add_argument("--days", type=int, default=2600)
    ap.add_argument("--horizon", default="1d")
    ap.add_argument("--k", type=int, default=25)
    ap.add_argument("--folds", type=int, default=5)
    ap.add_argument("--real", help="CSV of real events (see adapters.py)")
    a = ap.parse_args()

    if a.real:
        from adapters import load_csv
        events, label = load_csv(a.real), "REAL DATA"
    else:
        events, label = synth.generate(a.days, seed=a.seed), "SYNTHETIC (harness validation)"

    print("=" * 78)
    print(f"  SPIKE S3 -- ANALOG SIGNAL TEST          data: {label}")
    print(f"  events={len(events)}  horizon={a.horizon}  k={a.k}  folds={a.folds}")
    print("  guards: walk-forward | purged | embargoed(10d) | train-only scaling")
    print("=" * 78)

    factory = lambda: AnalogEngine(k=a.k, min_n=12)
    res = evaluate(events, factory, a.horizon, a.folds)
    stab = {t: per_fold_stability(events, factory, t, a.horizon, a.folds)
            for t in res if res[t].get("n", 0) >= MIN_N}

    n_tests = score_classes(res, stab)
    hdr = (f"{'EVENT TYPE':<16}{'n':>6}{'model':>8}{'null':>7}{'lift':>8}"
           f"{'p':>9}{'MDE':>7}{'power':>7}{'sig':>5}  truth")
    print("\n" + hdr)
    print("-" * len(hdr))
    for t in sorted(res, key=lambda x: -res[x].get("lift_pp", -99)):
        r = res[t]
        truth = synth.truth_label(t) if not a.real else "?"
        if r.get("verdict") == "INSUFFICIENT":
            print(f"{t:<16}{r['n']:>6}{'--':>8}{'--':>8}{'insufficient':>23}  {truth}")
            continue
        pos = len([x for x in stab.get(t, []) if x > 0])
        tot = len(stab.get(t, []))
        null = max(0.5, r['baseline_acc'])
        mark = "YES" if r.get("credible") else ("~" if r.get("p", 1) < 0.10 else "no")
        pw = r.get('power', 0)
        print(f"{t:<16}{r['n']:>6}{r['model_acc']*100:>7.1f}%{null*100:>6.1f}%"
              f"{(r['model_acc']-null)*100:>+8.1f}{r.get('p',1):>9.4f}"
              f"{r.get('mde_pp',0):>6.1f}p{pw*100:>6.0f}%{mark:>5}  {truth}")

    v, strong, weak = verdict(res, stab)
    print("\n" + "=" * 78)
    print(f"  VERDICT: {v}")
    print("=" * 78)
    print(f"  bar: lift >= {GO_LIFT}pp AND exact-binomial p < alpha (Bonferroni over")
    print(f"       {n_tests} classes) AND fold sign-test p <= 0.35")
    print(f"  credible classes:")
    print(f"    {strong or 'none'}")
    print(f"  classes in conditional band ({COND_LIFT}-{GO_LIFT}pp): {weak or 'none'}")
    under = [t for t, r in res.items() if r.get("n", 0) >= MIN_N and not r.get("powered")]
    if under:
        print(f"\n  UNDERPOWERED (cannot detect a {TARGET_EFFECT_PP}pp edge at 80% power):")
        for t in under:
            r = res[t]
            need = required_n(TARGET_EFFECT_PP, r['alpha'])
            print(f"    {t:<16} n={r['n']:<6} power={r['power']*100:>4.0f}%  "
                  f"MDE={r['mde_pp']}pp  needs n={need:,} ({need/max(1,r['n']):.0f}x more)")
        print("    -> For these, a NO-GO means 'cannot tell', NOT 'no signal'.")

    if not a.real:
        true_sig = {t for t in res if synth.truth_label(t) == "SIGNAL"}
        found = set(strong) | set(weak)
        fp = found - true_sig
        fn = true_sig - found
        print("\n  HARNESS VALIDATION (synthetic only -- ground truth known)")
        print(f"    planted signal classes : {sorted(true_sig)}")
        print(f"    detected               : {sorted(found)}")
        print(f"    FALSE POSITIVES        : {sorted(fp) or 'NONE  <- harness does not invent signal'}")
        print(f"    false negatives        : {sorted(fn) or 'none'}")
        print("\n  Reading this: the synthetic run tests the HARNESS, not the product.")
        print("  It proves the method finds faint planted signal and stays silent on noise.")
        print("  The real verdict needs --real with licensed history. See README.md.")
    print()
    return 0 if v != "NO-GO" else 1


if __name__ == "__main__":
    sys.exit(main())
