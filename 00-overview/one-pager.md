# Newze — One Pager

**Status:** Draft v1 · **Owner:** Product · **Date:** 2026-11-12 · **Phase:** 0 (Planning)

---

## The problem
A trader's day is decided by information they cannot assemble in time. News tells them *what
happened*. Charts tell them *what prices did*. **Nothing credible tells them what this kind of
event has historically done to these instruments, with what hit rate.** Indian traders have
it worst: the single biggest driver of their day — everything that happened globally between
15:30 and 09:15 IST — is summarised by one lazy line, *"GIFT Nifty up 40 points."* So 4+ crore
Indian traders fill the gap with Telegram tipsters who are unaccountable, often illegal under
SEBI's finfluencer rules, and wrong at an unmeasured rate.

## The product
A news platform where every story carries a **measured market consequence**:

1. **Live global newswire** — deduplicated into *stories*, not 40 copies of one article, with
   source-tier labels and a running timeline.
2. **Impact Cards** — for every significant event: expected move on named instruments, over
   named horizons, with a confidence band and *"here are the 34 times this happened before and
   what followed."*
3. **Global market analytics** — cross-asset dashboards, macro surprise tracking, central-bank
   path pricing, regime detection, positioning and flows.
4. **Indian market analytics** — Nifty/Bank Nifty, full F&O microstructure (OI build-up, PCR,
   max pain, IV surface, rollovers, participant-wise OI), FII/DII flows, delivery %, filings,
   IPO tracker, RBI/CPI/GST macro.
5. **The Overnight Bridge** — published 07:30 IST daily: expected open, probability cone,
   gap-fill odds, and an **attribution waterfall** (*"+38 pts from US close, −12 from crude,
   +9 from USDINR, −6 from ADR drag"*). Scored against the actual open, every day, in public.
6. **The Accuracy Ledger** — every prediction we have ever published, scored, permanent, public.

## Why it wins (the moat)
| | |
|---|---|
| **1. The Event→Outcome Corpus** | Every event we ingest is joined to what prices actually did. In 24 months this is a labelled dataset that cannot be bought — only accumulated. **Time is the barrier to entry.** |
| **2. The Accuracy Ledger** | No financial media property publishes its own hit rate, because it's embarrassing. A moat made of institutional reluctance. |
| **3. The India↔Global transmission model** | GIFT basis, ADR dislocation, USDINR pass-through, crude-in-INR, flow regimes. Domain IP global players don't have and Indian media can't engineer. |
| **4. Structured-from-minute-zero** | We emit machine-readable payloads in seconds, not 600-word articles in 20 minutes. Impossible to retrofit onto a CMS newsroom — and every incumbent is a CMS newsroom. |

## Target users
| | Who | Why they pay |
|---|---|---|
| **P0** | Serious Indian retail trader (F&O + delivery), ~45–60 lakh people | Loses money to information asymmetry every single day |
| **P1** | Global macro-curious investor | Wants Bloomberg-grade context at a non-Bloomberg price |
| **P2** | Analysts, RIAs, family offices, small funds | Needs defensible, citable, exportable research |
| **P3** | Brokers, fintechs, builders | Needs structured news+event data via API |

## Success metrics
**North Star — Weekly Decision Sessions (WDS):** sessions where a user viewed ≥1 Impact Card
*and* ≥1 analytics surface, ≥90s, on ≥4 distinct days per 28.

| Horizon | MAU | Paying | NSM | Quality gate |
|---|---|---|---|---|
| Launch + 3mo | 15,000 | 400 | 6,000 WDS/wk | Headline→publish p95 < 60s |
| Launch + 12mo | 50,000 | 2,500 | 28,000 WDS/wk | 12 months of public scored calls; direction hit-rate > 57% on published classes |
| Launch + 24mo | 400,000 | 25,000 | 240,000 WDS/wk | API revenue > 15% of total |

## Non-goals (v1–v3)
No brokerage or execution · no portfolio accounting · **no buy/sell/target-price calls until
SEBI RA registration** · no UGC forum · not a crypto site · no in-house charting engine · no
native apps before Phase 6 · no on-ground newsroom.

## The three gates that can kill this (Phase 0, before any production code)
| Gate | Question | Owner | Status |
|---|---|---|---|
| **G1 — Market data licence** | Can we legally display/redistribute NSE/BSE and global price data at our intended latency, and at what cost? | Founder + legal | ⬜ Open |
| **G2 — SEBI posture** | Does a quantified Impact estimate constitute "research" requiring RA registration? What exact framing is safe? | Securities counsel | ⬜ Open |
| **G3 — News content rights** | Headline + link + our own analysis — licensed or fair dealing? Which wire deal? | Media counsel | ⬜ Open |

→ Detail: [`01-requirements/compliance.md`](../01-requirements/compliance.md)

## Ask / next step
Approve Phase 0 (4 weeks, planning + legal gates + technical spikes) per
[`07-planning/roadmap.md`](../07-planning/roadmap.md).
