# Research Plan

**Status:** Draft v1 · **Date:** 2026-11-12 · **Runs during Phase 0**

---

## 1. What we're trying to learn (and the decision each answer changes)

| # | Question | Hypothesis | Decision it changes | Method |
|---|---|---|---|---|
| RQ1 | Is the 07:30 pre-open window a real, felt pain — or are we projecting? | H1: traders spend 45–90 min assembling a morning view | **Whether M5 is the MVP at all.** If false, the whole sequencing is wrong | 20 interviews + diary study |
| RQ2 | Will traders trust a quantified estimate more than a confident human? | H2: yes, *if* the track record is public | Whether M6 is a fast-follow or a launch requirement | Interviews + concept test |
| RQ3 | Does "we don't know" build or destroy trust? | H12: builds it with P0/P2, confuses casual users | FR-M2-05 presentation design | Prototype A/B in concept test |
| RQ4 | Is the attribution waterfall understood by a median retail trader? | H13: yes with ≤6 components, no with 10 | M5 UI complexity | Usability test on a static prototype |
| RQ5 | What will they actually pay, and what's the trigger to pay? | H14: ₹499–999/mo; trigger = the alert that saved/made them money | Pricing + paywall placement | Van Westendorp + behavioural signal |
| RQ6 | Which analytics do they use daily vs. admire and never open? | H15: OI build-up + PCR daily; correlation matrices never | P1 vs P2 prioritisation in M3/M4 | Interviews + competitor usage probing |
| RQ7 | How do they consume — app, desktop, WhatsApp? | H16: phone at 07:30, desktop at 09:15 | PWA-first decision, delivery channels | Diary study |
| RQ8 | Would a broker/fintech pay for a structured event API? | H11 | Whether M11 moves earlier | 6 B2B conversations |

---

## 2. Method plan

### 2.1 Interviews — 20 users, Phase 0 weeks 1–3
- **12 × P0** (serious Indian retail traders): 6 options-heavy, 4 cash/delivery, 2 both. Mix of 1–3y and 5y+ experience. Mix of metro/non-metro.
- **4 × P1** (global macro investors)
- **4 × P2** (analysts/RIAs/family office)
- 45 minutes, semi-structured. **Recruit from:** trading communities, broker referrals, X/Twitter, r/IndianStreetBets, local trading meetups.
- **Rule:** never pitch the product in the first 25 minutes. Ask about last Tuesday morning, concretely. Past behaviour, not stated preference.

**Core script spine:**
1. Walk me through this morning, from waking up to 09:15. (→ RQ1, RQ7)
2. Where did each piece of information come from? How long did it take? (→ RQ1)
3. Tell me about the last time news surprised you mid-position. What did you do? (→ RQ2, L2)
4. Who do you trust for market information, and how did they earn that? (→ RQ2)
5. Show me the last thing you paid for. Why that one? When did you nearly cancel? (→ RQ5)
6. Open your phone — which of these tools did you actually open this week? (→ RQ6)
7. *(Only now)* Concept reaction: a static Overnight Bridge mock + an Impact Card mock. (→ RQ3, RQ4)

### 2.2 Diary study — 8 traders × 10 trading days
Twice daily (07:45 and 15:45) one-tap WhatsApp log: *what did you check, how long, what did
you still not know?* → gives frequency and gap data that interviews systematically distort.

### 2.3 Concept test — 150 respondents
Three variants of the Impact Card: (a) point estimate only, (b) estimate + confidence band,
(c) estimate + band + analogs + "not enough history" states. Measure comprehension, trust,
and stated willingness to pay. → settles RQ3.

### 2.4 Competitive instrumentation (continuous)
Weekly log of what Moneycontrol / Sensibull / StockEdge / TradingView / Zerodha ship.
Maintained in [`competitive-watch.md`](competitive-watch.md).

### 2.5 Data feasibility spikes (run in parallel — these are research too)
| Spike | Question | Output |
|---|---|---|
| S1 | Can we reliably obtain and parse NSE EOD + derivatives files daily? | Working ingester + reliability log |
| S2 | What's the realistic latency wire→structured Event with an LLM in the loop? | Measured p50/p95 + cost/1k events |
| S3 | Does analog retrieval produce *anything* with signal on 5 years of backfilled data? | Honest backtest. **If this fails, the Impact Engine thesis is dead and we pivot to news+analytics only** |
| S4 | Entity resolution precision on NSE-500 with a dictionary + LLM fallback | Precision/recall on a golden set |

> **S3 is the highest-risk item in the entire plan.** It is scheduled in Phase 0, not Phase 4,
> specifically so that it can fail early and cheaply.

---

## 3. Synthesis & outputs

- Affinity mapping after every 5 interviews (not at the end — early patterns steer later scripts)
- Updated personas with evidence, replacing hypotheses
- A ranked pain list with frequency × severity
- **A written kill/confirm verdict on each RQ**, logged in [`../decisions.md`](../decisions.md)
- Jobs-to-be-done statements used verbatim in UI copy

## 4. Ethics & logistics
Informed consent, recordings only with permission, anonymised transcripts, no financial
details collected, ₹1,000 voucher per interview, no advice given or implied during sessions.
