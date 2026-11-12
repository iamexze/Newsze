#!/usr/bin/env python3
"""
Harness validation across many random draws.

The question is NOT "does the product work" -- synthetic data cannot answer that.
The question is "can this harness be trusted to tell us the truth when we point it
at real data." A harness with a high false-positive rate would green-light a dead
product; one with a high false-negative rate would kill a live one.
"""
import sys
import synth
from analog import AnalogEngine
from backtest import evaluate, per_fold_stability
from run_spike import score_classes, verdict, MIN_N

N = int(sys.argv[1]) if len(sys.argv) > 1 else 12
fp = fn = 0
verdicts = {}
rows = []
for seed in range(1, N + 1):
    ev = synth.generate(2600, seed=seed)
    f = lambda: AnalogEngine(k=25, min_n=12)
    res = evaluate(ev, f, "1d", 5)
    stab = {t: per_fold_stability(ev, f, t, "1d", 5)
            for t in res if res[t].get("n", 0) >= MIN_N}
    score_classes(res, stab)
    v, strong, weak = verdict(res, stab)
    truth = {t for t in res if synth.truth_label(t) == "SIGNAL"}
    found = set(strong)
    seed_fp = sorted(found - truth)
    seed_fn = sorted(truth - (found | set(weak)))
    fp += len(seed_fp); fn += len(seed_fn)
    verdicts[v] = verdicts.get(v, 0) + 1
    rows.append((seed, v, sorted(strong), sorted(weak), seed_fp, seed_fn))

print(f"{'seed':>5}{'verdict':>14}  {'credible':<22}{'suggestive':<14}{'FP':<10}{'FN'}")
print("-" * 86)
for s, v, st, wk, p, n in rows:
    print(f"{s:>5}{v:>14}  {str(st):<22}{str(wk):<14}{str(p) if p else '-':<10}{n if n else '-'}")

print("\n" + "=" * 86)
print(f"  {N} independent draws")
print(f"  FALSE POSITIVES (noise class declared credible) : {fp}   <- must be ~0")
print(f"  false negatives (planted signal missed entirely): {fn}")
print(f"  verdict distribution: {verdicts}")
print("=" * 86)
print("""
  Interpretation
  --------------
  Zero false positives means: if this harness says a class has signal on REAL
  data, that is evidence, not noise. That is the only property that makes the
  S3 go/no-go decision meaningful.

  Some false negatives are expected and ACCEPTABLE -- the planted CPI effect is
  faint (-0.22%) against 1.1% daily vol. A harness tuned to catch every faint
  effect would also catch imaginary ones. We would rather miss a weak real class
  in Phase 0 and find it later with more data, than build a product on a mirage.
""")
