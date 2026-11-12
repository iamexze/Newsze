#!/usr/bin/env python3
"""Spike S4 -- entity resolution precision. Bar: >=97% precision."""
from resolve import Resolver
from golden_set import GOLDEN, HARD
import sys

def evaluate(cases, r):
    tp = fp = fn = tn = 0
    errors, llm = [], 0
    stages = {}
    for text, expected in cases:
        got, stage, conf = r.resolve(text)
        stages[stage] = stages.get(stage, 0) + 1
        if "llm" in stage:
            llm += 1
        if expected is None:
            if got is None: tn += 1
            else:
                fp += 1; errors.append((text, expected, got, stage, conf, "FALSE POSITIVE"))
        else:
            if got == expected: tp += 1
            elif got is None:
                fn += 1; errors.append((text, expected, got, stage, conf, "missed"))
            else:
                fp += 1; errors.append((text, expected, got, stage, conf, "WRONG ENTITY"))
    prec = tp / (tp + fp) if tp + fp else 0
    rec = tp / (tp + fn) if tp + fn else 0
    return dict(tp=tp, fp=fp, fn=fn, tn=tn, prec=prec, rec=rec,
                errors=errors, llm=llm, stages=stages, n=len(cases))


def report(name, m, note=""):
    bar = "PASS" if m["prec"] >= 0.97 else "FAIL"
    print(f"\n  {name}  ({m['n']} cases){note}")
    print(f"    precision {m['prec']*100:>6.1f}%   recall {m['rec']*100:>6.1f}%   "
          f"tp={m['tp']} fp={m['fp']} fn={m['fn']} tn={m['tn']}   [{bar}]")
    print(f"    reaches LLM stage: {m['llm']}/{m['n']} ({m['llm']/m['n']*100:.0f}%)")
    if m["errors"]:
        print(f"    errors:")
        for t, e, g, st, c, k in m["errors"]:
            print(f"      {t[:30]:<32}exp={str(e)[:16]:<18}got={str(g)[:16]:<18}{k}")


def main():
    r = Resolver()
    seeded = evaluate(GOLDEN, r)
    hard = evaluate(HARD, r)
    allm = evaluate(GOLDEN + HARD, r)
    print("=" * 84)
    print("  SPIKE S4 -- ENTITY RESOLUTION")
    print("=" * 84)
    report("SEEDED SET", seeded, "   <- drawn from the dictionary; NOT a real test")
    report("HARD SET", hard, "   <- unseen surface forms; THIS is the honest number")
    report("COMBINED", allm)
    llm_pct = allm["llm"] / allm["n"]
    print(f"""
  COST IMPLICATION
    {llm_pct*100:.0f}% of mentions reach the LLM stage. At 20k signals/day x ~2 entities,
    that is ~{int(20000*2*llm_pct):,} LLM calls/day. Every alias learned from a
    resolved case removes future calls -- which is why the console feeds
    corrections back into the dictionary (FR-M10-04). The dictionary is not a
    static seed file; it is an asset that compounds.

  WHY PRECISION, NOT RECALL, IS THE BAR
    A missed entity costs one link. A WRONG entity publishes an impact against
    the wrong company -- a correction event, and corrections are what our
    credibility cannot spend. The cascade hands off rather than guesses: 'HDFC',
    'Tata' and 'Adani' alone must resolve to nothing, because post-merger 'HDFC'
    genuinely is ambiguous, and a confident guess there is the worst outcome.

  PHASE 0 BAR is measured on the HARD SET. The seeded number is diagnostic only.
""")
    return 0 if hard["prec"] >= 0.97 else 1


if __name__ == "__main__":
    raise SystemExit(main())
