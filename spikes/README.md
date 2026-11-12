# Phase 0 Technical Spikes

Four throwaway experiments that answer "is this possible?" before anyone writes production
code. **No dependencies — Python 3.9+ standard library only.** A spike that needs an
environment is a spike nobody re-runs.

| Spike | Question | Bar | Status |
|---|---|---|---|
| [`s3_analog_signal/`](s3_analog_signal/) | 🔴 **Does analog retrieval produce out-of-sample signal?** | ≥2 credible classes | ⚠️ **Harness validated; real verdict blocked on G1 data** |
| [`s4_entity_resolution/`](s4_entity_resolution/) | Can we link names to tickers precisely enough? | ≥97% precision | ✅ **100% precision / 85% recall on unseen forms** |
| [`s1_eod_ingest/`](s1_eod_ingest/) | Can we ingest exchange EOD files reliably, unattended? | <1% gap rate | ✅ **All 4 injected fault classes caught** |
| [`s2_latency_cost/`](s2_latency_cost/) | Can we hit 45s end-to-end at an affordable cost? | p95 ≤45s, ≤₹18/MAU | ✅ **11.9s p95 · ₹2.65/MAU at 50k** |

```bash
cd s3_analog_signal && python3 run_spike.py && python3 validate_harness.py 12 && python3 power.py
cd s4_entity_resolution && python3 run_spike.py
cd s1_eod_ingest && python3 make_fixtures.py && python3 run_spike.py
cd s2_latency_cost && python3 run_spike.py
```

---

## What the spikes actually changed in the plan

Spikes are only worth running if they can change a decision. These did:

### 1. 🔴 The S3 decision rule was wrong, in two ways
- **It passed pure noise.** The first run gave a noise class +8.9pp lift and a pass. Six classes tested at ~50% accuracy manufacture a winner. Fixed with an honest null, an exact binomial test, and Bonferroni correction. False-positive rate is now **0 / 12 draws**.
- **It could not distinguish "no signal" from "not enough data."** 8 of 12 validation draws returned NO-GO on data that genuinely contained signal. A fourth verdict — `INSUFFICIENT POWER` — now exists, because the v1 rule would have killed a working product.

→ [`../07-planning/phase-0-execution.md`](../07-planning/phase-0-execution.md) §7, amended.

### 2. 🔴 The 15-year backfill moved from "scope item" to "protected scope"
Detecting a realistic 3–6pp edge needs 700–4,000 test events per class. Ten years of rate
decisions gives ~150. **Without the full backfill, the Phase 4 gate is unanswerable** — and
that would not have been discovered until Phase 4.

### 3. S3 should target high-frequency classes first
`EARNINGS`, `FII_DII_FLOW`, `BULK_BLOCK_DEAL`, `INSIDER_TRADE` yield thousands of events.
`RATE_DECISION` is the most interesting and the least testable. Counter-intuitive, and it
reorders the spike's work.

### 4. Entity resolution's real bar is the *unseen* forms
The original golden set scored 100% because it was drawn from the seed dictionary — a rigged
test. A hard set of unseen surface forms (possessives, truncations, headline caps,
ampersands) gives the honest number: **100% precision, 85% recall, zero wrong-entity errors**,
with 45% of unseen mentions handed off to the LLM stage. That handoff rate is the production
inference bill.

### 5. Two architecture decisions were quantified, not assumed
ADR-008's tiered routing plus cluster-level inference is **26× cheaper** than the naive path
(₹5,676 → ₹221 per 1k events). Without both, inference alone breaks NFR-COST-01 before a
single user is served. The ADR is now backed by a number.

---

## Spike rules
1. **Throwaway by charter.** Spike code never becomes production code. It exists to answer a question and then to be deleted.
2. **Pre-register the decision rule** before looking at results.
3. **Measure the instrument before trusting it.** `validate_harness.py` exists because the first version of S3 lied.
4. **A spike that cannot change a decision should not be run.**
5. **No production code in Phase 0.** If a spike starts growing an interface, stop.
