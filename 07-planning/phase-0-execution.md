# Phase 0 — Execution Plan

**Status:** Active · **Window:** 17 Nov – 12 Dec 2026 (4 weeks) · **Date:** 2026-11-12
**Parent:** [roadmap.md](roadmap.md) · **Milestone:** M0 in [milestones.md](milestones.md)

> **What Phase 0 is for:** to find out, as cheaply as possible, whether this product is
> legal, wanted, and technically possible. It is the only phase where cancelling is cheap.
> Everything here is designed so that a *no* arrives in week 3 rather than month 10.

---

## 1. The four gates this phase must close

| Gate | Question | Fails if | Owner |
|---|---|---|---|
| **G1** Market data | Can we legally display and redistribute exchange data, at what latency, for what cost? | Cost exceeds the business model at realistic subscriber counts | Founder + counsel |
| **G2** SEBI posture | Does a quantified impact estimate constitute "research" under the RA Regulations? | Counsel says yes **and** registration is not viable | Securities counsel |
| **G3** Content rights | Headline + link + our own analysis — licensed or fair dealing? | We cannot publish without a wire licence we can't afford | Media counsel |
| **S3** Feasibility | Does analog retrieval produce out-of-sample signal? | No signal on any event class | Data eng |

**Any gate failing changes the plan. S3 failing changes the product.** Responses are
pre-written in [roadmap.md](roadmap.md) §"The three ways this plan fails" — so a bad result
produces a decision, not a panic.

---

## 2. Week-by-week

### Week 1 · 17–21 Nov — *Start every long-lead item on day one*
| # | Task | Owner | Output |
|---|---|---|---|
| W1.1 | Send the three counsel briefs; book engagements | Founder | Signed engagement letters |
| W1.2 | Send the data-licence enquiry pack — [`06-api/procurement/`](../06-api/procurement/), 6 enquiries against one spec | Founder | 6 quote requests out |
| W1.3 | Open research recruitment (target 20 + 8 diary) | Product | Screener live, 40+ responses |
| W1.4 | Stand up repo, CI, Docker compose, fixtures | Eng | `pnpm dev` works for the team |
| W1.5 | **Start S3** — assemble the backtest dataset | Data | Price + event history loaded |
| W1.6 | Start S1 — EOD file ingestion against a licensed/permitted source | Eng | First file parsed |
| W1.7 | Build the concept-test prototype (Bridge + Impact Card) | Design | Clickable prototype |

> **W1.1, W1.2 and W1.3 are long-lead.** Counsel takes 2–3 weeks to respond, vendors take
> 2–4 weeks to quote, recruitment takes a week to fill. **Started on day one or Phase 0
> overruns** — this is the single most common way a discovery phase slips.

### Week 2 · 24–28 Nov — *Interviews + spikes run in parallel*
| # | Task | Owner | Output |
|---|---|---|---|
| W2.1 | Interviews 1–10 (8× P0, 1× P1, 1× P2) | Product | Transcripts + notes |
| W2.2 | Affinity map after interview 5 — **adjust the script** | Product | Revised guide |
| W2.3 | Diary study launches (8 traders × 10 trading days) | Product | Daily logs flowing |
| W2.4 | **S3 first result** — baseline vs analog, one event class | Data | Preliminary verdict |
| W2.5 | S4 — entity resolution on the NSE-500 golden set | Eng | Precision/recall report |
| W2.6 | S2 — wire→Event latency and cost per 1k | Eng | Measured p50/p95 + ₹/1k |
| W2.7 | Chase counsel and vendors | Founder | Status log |

### Week 3 · 1–5 Dec — *The decision week*
| # | Task | Owner | Output |
|---|---|---|---|
| W3.1 | Interviews 11–20 | Product | Transcripts |
| W3.2 | Concept test, 150 respondents (3 Impact Card variants) | Product | RQ3 verdict |
| W3.3 | **S3 full result across ≥4 event classes** | Data | 🔴 **S3 GO/NO-GO** |
| W3.4 | **G2 opinion received** | Counsel | 🔴 Written memo |
| W3.5 | Data-licence quotes in; build the cost model | Founder | 🔴 G1 cost model |
| W3.6 | S1 reliability log — 14 days of unattended runs | Eng | Gap rate |
| W3.7 | Interim readout to the client | Product | Deck + written summary |

### Week 4 · 8–12 Dec — *Synthesise, decide, re-plan*
| # | Task | Owner | Output |
|---|---|---|---|
| W4.1 | Research synthesis; verdict written per RQ1–RQ8 | Product | Findings report |
| W4.2 | Personas rewritten from evidence, replacing hypotheses | Product | Updated `personas.md` |
| W4.3 | G3 memo received; wire partner shortlisted | Counsel | 🔴 Written memo |
| W4.4 | Entity + registration decision (Plan A vs Plan B) | Founder | Decision in `decisions.md` |
| W4.5 | **Re-estimate M1–M3 against actuals and spike results** | Eng + Product | Revised `estimates.md` |
| W4.6 | Firm fixed-price proposal for M1–M3 | Builder | Quote |
| W4.7 | **M0 sign-off meeting** | All | 🚦 GO / NO-GO / RE-SCOPE |

---

## 3. What is being produced, and where it lives

| Deliverable | Location | Status |
|---|---|---|
| Counsel brief — G1 market data | [`01-requirements/legal/brief-g1-market-data.md`](../01-requirements/legal/brief-g1-market-data.md) | ✅ Drafted |
| Counsel brief — G2 SEBI posture | [`01-requirements/legal/brief-g2-sebi-posture.md`](../01-requirements/legal/brief-g2-sebi-posture.md) | ✅ Drafted |
| Counsel brief — G3 content rights | [`01-requirements/legal/brief-g3-content-rights.md`](../01-requirements/legal/brief-g3-content-rights.md) | ✅ Drafted |
| Recruitment screener | [`02-research/kit/screener.md`](../02-research/kit/screener.md) | ✅ Drafted |
| Interview guide | [`02-research/kit/interview-guide.md`](../02-research/kit/interview-guide.md) | ✅ Drafted |
| Diary study protocol | [`02-research/kit/diary-protocol.md`](../02-research/kit/diary-protocol.md) | ✅ Drafted |
| Concept test | [`02-research/kit/concept-test.md`](../02-research/kit/concept-test.md) | ✅ Drafted |
| Synthesis template | [`02-research/kit/synthesis-template.md`](../02-research/kit/synthesis-template.md) | ✅ Drafted |
| **Spike S3 — analog signal harness** | [`spikes/s3_analog_signal/`](../spikes/s3_analog_signal/) | ✅ Runnable |
| Spike S4 — entity resolution | [`spikes/s4_entity_resolution/`](../spikes/s4_entity_resolution/) | ✅ Runnable |
| Spike S1 — EOD ingestion | [`spikes/s1_eod_ingest/`](../spikes/s1_eod_ingest/) | ✅ Runnable |
| Spike S2 — latency & cost model | [`spikes/s2_latency_cost/`](../spikes/s2_latency_cost/) | ✅ Runnable |
| Concept-test prototype | [`03-design/prototype/concept-test.html`](../03-design/prototype/concept-test.html) → [live](https://claude.ai/artifact/KrmtF5SKKdp1jqWGqj1FV7) | ✅ Built |
| Findings report | `02-research/findings-m0.md` | ⬜ Week 4 |

---

## 4. Budget for Phase 0

| Item | Estimate |
|---|---|
| Engineering + product (118 loaded pd) | per [quote.md](../09-client/quote.md) |
| Securities counsel (G2 opinion) | ₹2–6 L |
| Media/IP counsel (G3 memo) | ₹1–3 L |
| Research incentives (20 × ₹1,000 + 8 diary × ₹2,000) | ₹36,000 |
| Concept-test panel (150 respondents) | ₹15,000–40,000 |
| Cloud + LLM for spikes | ₹15,000 |
| **Non-engineering total** | **≈₹3.7–9.9 L** |

Data-licence *fees* are not spent in Phase 0 — only quoted.

---

## 5. Exit criteria (restated — these are the commitments)

- [ ] G1, G2, G3 answered **in writing** by counsel, each with a costed path
- [ ] **S3 shows measurable out-of-sample signal on ≥1 event class**
- [ ] RQ1 confirmed: the pre-open pain is real, with quantified time cost
- [ ] S2 proves end-to-end latency ≤60s at acceptable cost per 1k events
- [ ] S1 shows <1% gap rate over 14 unattended days
- [ ] S4 shows ≥95% entity precision on the NSE-500 golden set
- [ ] Budget approved for M1–M3 with real licensing numbers
- [ ] `decisions.md` open questions O1–O9 closed or explicitly deferred with an owner

🚦 **M0 sign-off: GO / NO-GO / RE-SCOPE.**

---

## 6. Phase 0 risks

| # | Risk | Likelihood | Mitigation |
|---|---|---|---|
| P1 | Counsel takes >3 weeks | **High** | Briefs sent day 1; two firms approached in parallel; a conditional go-ahead on G2 is acceptable if the direction is clear |
| P2 | Vendors won't quote a pre-revenue startup | Med | Approach broker APIs too — often the cheapest legitimate real-time path for a small player |
| P3 | Recruitment under-fills | Med | Over-recruit 40 for 20; incentive is meaningful; broker and community referral channels in parallel |
| P4 | **S3 is inconclusive rather than yes/no** | **High** | Pre-register the decision rule (§7) *before* seeing results. An inconclusive S3 is a *conditional* go with a re-test gate in M1 — never a quiet assumption that it worked |
| P5 | Scope creep into building the product | Med | **No production code in Phase 0.** Spikes are throwaway by charter |

---

## 7. 🔴 Pre-registered decision rule for S3 — **v2, amended 2026-11-12**

*Written before results exist, so the result cannot be rationalised after the fact.*

> **Amendment note.** v1 of this rule was written before the harness was built. Building it
> exposed two flaws, both now corrected. The amendment is recorded here rather than silently
> applied — see [`decisions.md`](../decisions.md) D020, D021.
>
> **Flaw 1 — lift alone is not evidence.** v1 passed a class on "beats baseline by ≥4pp".
> On the first run, a **pure-noise class passed at +8.9pp.** Six classes tested at ~50%
> accuracy will throw up a winner by chance, and the train-majority baseline is itself a
> noisy estimator that can point the wrong way.
>
> **Flaw 2 — v1 could not tell "no signal" from "not enough data".** Harness validation
> across 12 draws returned **NO-GO on 8 of them, on data that genuinely contained signal.**
> A rule that conflates these two outcomes will kill a working product.

### The amended rule

Let **null** = `max(50%, train-derived baseline accuracy)` and **model** = analog-retrieval
direction accuracy, both **out-of-sample** under purged, embargoed, walk-forward validation
with point-in-time discipline.

A class is **credible** only if all four hold:
1. lift over null ≥ **4pp**
2. exact one-sided binomial p < **α/k**, where k = number of classes tested *(Bonferroni)*
3. fold sign-test p ≤ 0.35 *(not one lucky fold)*
4. **statistical power ≥ 80%** to detect a 5pp effect at that α — *i.e. the class was
   capable of answering the question at all*

| Outcome | Verdict | Action |
|---|---|---|
| ≥2 credible classes | ✅ **GO** | Impact Engine proceeds as planned |
| 1 credible class, or ≥2 suggestive (lift ≥2pp, p<0.10) | ⚠️ **CONDITIONAL** | Proceed; M4 re-gated on a repeat test with 2× data during M1 |
| 0 credible, **and ≥1 class was adequately powered** | ❌ **NO-GO** | **Drop the Impact Engine.** Re-cut to news + analytics. Moats 3 and 4 survive; 1 and 2 do not. Scope −196 loaded pd |
| 0 credible, **and no class was adequately powered** | 🟡 **INSUFFICIENT POWER** | **Not a no-go.** We could not look properly. Extend the backfill, add high-frequency classes, re-run. Escalate to the client as a schedule item, not a kill |
| Any result that only appears after changing the test | ❌ **NO-GO** | That is overfitting, not a finding |

### 🔴 The power constraint — this reshapes the spike

Measured by [`spikes/s3_analog_signal/power.py`](../spikes/s3_analog_signal/power.py):

| Test events in a class | Smallest lift detectable (80% power, α=0.0083) |
|---:|---:|
| 150 | 13.1pp |
| 500 | 7.2pp |
| 1,000 | 5.1pp |
| 5,000 | 2.3pp |

A realistic Impact Engine edge is **3–6pp**, requiring **700–4,000 test events per class.**
Ten years of rate decisions yields roughly **150**.

**Three consequences, now binding on the plan:**

1. **The 15-year backfill is not a nice-to-have — it is what makes S3 answerable.** It is
   protected scope. Cutting it to save time in M1 would silently make the Phase 4 gate
   unanswerable.
2. **S3 must target high-frequency classes first.** `EARNINGS`, `FII_DII_FLOW`,
   `BULK_BLOCK_DEAL`, `BULK/BLOCK`, `INSIDER_TRADE` produce thousands of events per decade.
   `RATE_DECISION` is the most interesting class and the least testable — test it, but do not
   let the verdict rest on it.
3. **Report power alongside every result.** A class with 18% power that shows no lift has
   told us nothing, and must never be written up as "no signal".

### Guards that make any result trustworthy
No look-ahead (all features from `ingest_time`) · purged + embargoed splits (no overlapping
outcome windows across the train/test boundary) · survivorship-bias-free universe ·
train-only feature scaling · regime-concentration check (analogs clustered in one window
count as ~1 observation, not n) · **harness false-positive rate measured before trusting any
positive result** — currently **0 / 12 draws**.
