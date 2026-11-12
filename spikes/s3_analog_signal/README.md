# Spike S3 — Does analog retrieval produce out-of-sample signal?

**The highest-risk assumption in the entire plan.** If the answer is no, Moats 1 and 2 don't
exist and the product becomes a (good) news and analytics site. Scheduled in Phase 0 week 1
so it can fail in week 3 instead of month 10.

Pre-registered decision rule: [`../../07-planning/phase-0-execution.md`](../../07-planning/phase-0-execution.md) §7.

```bash
python3 run_spike.py                    # synthetic -- validates the harness
python3 run_spike.py --seed 42          # a different draw
python3 validate_harness.py 12          # false-positive rate over 12 draws
python3 power.py                        # how much data a real verdict needs
python3 run_spike.py --real events.csv  # the actual Phase 0 run
```
No dependencies. Python 3.9+. Deliberately: a spike that needs an environment is a spike
nobody re-runs.

---

## What each file does

| File | Role |
|---|---|
| `synth.py` | Generates ~10y of synthetic events where **we know which classes carry signal.** Two classes have a faint planted effect; four are pure noise |
| `analog.py` | The engine under test: standardise → k-NN within event type → empirical forward-return distribution. Returns `None` when evidence is thin (the publication gate) |
| `backtest.py` | Walk-forward, **purged**, **embargoed** evaluation. The three guards that separate a real backtest from a self-flattering one |
| `stats_tests.py` | Exact binomial test against an honest null, Bonferroni-corrected across classes; fold sign-test |
| `power.py` | How many events are needed to detect a given edge — and what the available data can actually detect |
| `run_spike.py` | Runs it, applies the pre-registered rule, prints the verdict |
| `validate_harness.py` | Repeats across random draws to measure the **false-positive rate** |
| `adapters.py` | Real-data CSV loader + sanity checks for the three mistakes that silently invalidate a backtest |

---

## Findings so far (synthetic — these are about the *harness*, not the product)

### 1. The first version of this spike produced a **false positive**
A pure-noise class (`SEBI_ACTION`) showed +8.9pp lift and passed the original bar. Cause:
six classes tested at ~50% accuracy will throw up a winner by chance, and the
train-majority baseline is itself a noisy estimator. **Lift alone is not evidence.**

Fixed by: an honest null of `max(50%, baseline)`, an exact binomial test, Bonferroni
correction across classes, and a fold sign-test.

### 2. After the fix: **zero false positives across 12 independent draws**
```
  FALSE POSITIVES (noise class declared credible) : 0
```
This is the property that makes the S3 verdict worth anything. If this harness says a class
has signal on real data, that is evidence rather than noise.

### 3. 🔴 But the harness is badly **underpowered** — and this changes the Phase 0 plan
8 of 12 draws returned NO-GO on data that genuinely contained signal.

| Test events per class | Smallest lift detectable (80% power, α=0.0083) |
|---:|---:|
| 150 | 13.1pp |
| 500 | 7.2pp |
| 1,000 | 5.1pp |
| 5,000 | 2.3pp |

A realistic Impact Engine edge is **3–6pp**, which needs **700–4,000 test events per class**.
A 10-year history of rate decisions gives ~150.

**Three consequences, now reflected in the plan:**
1. **The 15-year backfill is not a nice-to-have** — it is what makes S3 answerable at all. Protect it in scope.
2. **Point S3 at high-frequency classes first** — `EARNINGS`, `FII_DII_FLOW`, `BULK_BLOCK_DEAL` yield thousands of events. Rate decisions are the most interesting and the least testable.
3. **"NO-GO" and "cannot tell" are different verdicts.** The runner now reports `INSUFFICIENT POWER` separately, and the §7 decision rule has been amended. Without this, Phase 0 could kill a product that works.

---

## ⚠️ What this spike does NOT tell us

**Synthetic data cannot tell us whether the product works.** It tells us whether the
*measuring instrument* is trustworthy. The planted effects are our own invention; real
markets may contain nothing like them.

The real verdict requires `--real` with licensed historical data, which is gated on G1. Until
then, S3's status is: **the method is sound and the instrument does not lie. Whether there is
anything to measure is unknown.**

Anyone reporting the synthetic `GO`/`CONDITIONAL` line as evidence the product works has
misread this spike.

---

## Running it on real data

1. Build `events.csv` per the column spec in `adapters.py` — **read that docstring carefully**, it documents the three mistakes (event-time ordering, non-point-in-time features, measuring returns from the pre-event close) that silently invalidate this kind of test.
2. `python3 run_spike.py --real events.csv`
3. Record the verdict in [`../../02-research/kit/synthesis-template.md`](../../02-research/kit/synthesis-template.md) §6 and the decision in [`../../decisions.md`](../../decisions.md).
4. **Do not tune the engine and re-run until it passes.** Any result that only appears after changing the test is overfitting, and the pre-registered rule classes it as NO-GO.
