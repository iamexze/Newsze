# Synthesis Template — M0 Findings Report

Fill this in during week 4. Output goes to `02-research/findings-m0.md`.
**Write the verdict column before writing the narrative.** It stops the report from becoming
a justification of what we already planned.

---

## 1. Verdict table — fill this first

| RQ | Question | Hypothesis | Verdict | Evidence | Changes |
|---|---|---|---|---|---|
| RQ1 | Is the 07:30 pre-open window a real, felt pain? | 45–90 min assembling a morning view | ☐ Confirmed ☐ Partial ☐ **Refuted** | Diary median: `__` min · Interviews: `__`/20 described a routine · Days with zero routine: `__`% | |
| RQ2 | Will traders trust a quantified estimate more than a confident human? | Yes, if the track record is public | ☐ ☐ ☐ | Q19–20 responses · Q8 concept test | |
| RQ3 | Does "we don't know" build or destroy trust? | Builds with P0/P2 | ☐ ☐ ☐ | Concept test Q8: `__`% more / `__`% less | |
| RQ4 | Is the attribution waterfall understood? | Yes at ≤6 bars | ☐ ☐ ☐ | Q12 comprehension: `__`% at 7 bars, `__`% at 11 | |
| RQ5 | What will they pay, and what triggers payment? | ₹499–999; trigger = a save | ☐ ☐ ☐ | VW optimal `₹__` · last-purchase triggers | |
| RQ6 | Which analytics are used daily vs admired? | OI/PCR daily; correlations never | ☐ ☐ ☐ | Q10 app audit · Q25 | |
| RQ7 | How do they consume — phone, desktop, WhatsApp? | Phone at 07:30, desktop at 09:15 | ☐ ☐ ☐ | Diary Q3 · Q10 | |
| RQ8 | Would a broker/fintech pay for an event API? | Yes | ☐ ☐ ☐ | 6 B2B conversations | |

> **If RQ1 is refuted, stop and re-plan.** The entire MVP (and D006) rests on it. A refuted
> RQ1 in week 4 of Phase 0 is a cheap, excellent outcome — it is exactly what this phase is for.

## 2. The numbers
| Metric | Hypothesised | Measured |
|---|---|---|
| Median pre-open routine (minutes) | 45–90 | |
| % of trading days with any pre-open check | >80% | |
| Sources consulted per morning (median) | 4–7 | |
| Surprise events per participant per week | 3–15 | |
| Median discovery lag on a surprise | — | |
| % currently paying for a market tool | 50% | |
| Median current monthly spend | ₹1,200–2,500 | |
| Stated WTP (VW optimal) | ₹499–999 | |

## 3. The "didn't know" corpus
Code all ~80 free-text responses from diary Q4 into themes. Rank by frequency.

| Theme | Count | Representative verbatim | Which feature serves it |
|---|---:|---|---|
| | | | |

> **The top theme becomes the product's headline promise and should appear verbatim in the
> landing-page copy.** If the top theme is not something we build, that is the most important
> finding in the report.

## 4. What contradicted us
*List every instance where evidence contradicted a planning assumption. This section is the
reason the study exists — fill it honestly and at length.*

| # | We assumed | We found | Document to change |
|---|---|---|---|
| | | | |

## 5. Personas — rewritten from evidence
Replace the hypothesis personas in [`../personas.md`](../personas.md). Every "pain" must now
cite an interview or diary observation, not an inference. Delete any persona the research
did not find.

## 6. Spike results

| Spike | Result | Verdict |
|---|---|---|
| **S3 — analog signal** | Best class: `____` · lift over baseline: `__`pp · n=`__` · folds stable? ☐ | ☐ GO ☐ CONDITIONAL ☐ **NO-GO** *(rule pre-registered in [phase-0-execution.md](../../07-planning/phase-0-execution.md) §7)* |
| S1 — EOD ingestion | Gap rate over 14 days: `__`% | ☐ pass ☐ fail |
| S2 — latency & cost | p95 `__`s · ₹`__` per 1k events | ☐ pass ☐ fail |
| S4 — entity resolution | Precision `__`% · recall `__`% | ☐ pass ☐ fail |

## 7. Gate results
| Gate | Outcome | Cost | Blocks |
|---|---|---|---|
| G1 market data | | | |
| G2 SEBI | | | |
| G3 content rights | | | |

## 8. Recommendation
☐ **GO** — proceed to M1 as planned
☐ **GO, RE-SCOPED** — proceed with these changes: `____`
☐ **PIVOT** — the product changes as follows: `____`
☐ **STOP** — because: `____`

**Revised estimates:** `__` pd (was 975 P50). **Revised MVP date:** `____`.

## 9. Decisions to log
Every verdict above that changes a plan gets a row in
[`../../decisions.md`](../../decisions.md) with the date, the decision and the evidence.
