# Metrics, Pricing & Unit Economics

**Status:** Draft v1 · **Date:** 2026-11-12

---

## 1. The metric tree

**North Star — Weekly Decision Sessions (WDS):** sessions where a user viewed ≥1 Impact Card
**and** ≥1 analytics surface, lasted ≥90s, on ≥4 distinct days per rolling 28.

```
                        WDS
         ┌───────────────┼───────────────┐
    Activated users   Sessions/user   Depth/session
         │                │                │
   signup→first      07:30 open rate   Impact Cards viewed
   Impact <2min      alert→open CTR    analytics surfaces used
   watchlist in      D1/D7/D30         analogs expanded
   session 1
```

**Why not DAU or pageviews:** both reward clickbait and would corrupt the product within a
quarter. WDS only rises when the product is used to make decisions. (Principle #8.)

### Quality KPIs — *these gate the business KPIs*
| Metric | Target | Why it's a gate |
|---|---|---|
| Direction accuracy, 1d, published classes | >57% | Below this, the Ledger argues against us |
| Band-68 coverage | 63–73% | Outside this, we are mis-calibrated, not unlucky |
| Brier score | ≤0.22 | Publication gate threshold |
| Headline→publish latency p95 | ≤45s | The "before Telegram" promise |
| Cluster purity | ≥92% | The "one story, not 40" promise |
| Entity precision (NSE-500/S&P-500) | ≥97% | A mis-linked ticker is a correction event |
| Bridge on-time rate | ≥99% / 30d | The habit dies on a missed morning |
| Bridge open-estimate MAE | < naive GIFT baseline | If we can't beat the baseline, don't publish a number |
| Correction rate | <0.5% of published items | |

### Engagement KPIs
D1 >45% · D7 >30% · D30 >22% (free) / >60% (Pro) · **pre-open session rate >55% of WAU** ·
alert→open CTR >35% · alerts/day/user median ≤5 · unsubscribe <2%/mo.

### Business KPIs
Free→Pro ≥4% @90d · Pro monthly churn <5% · NRR >100% (Terminal) · CAC payback <6mo ·
LTV:CAC >3 · gross margin >75% · API ARR >15% of total by Y2.

---

## 2. Pricing & packaging

> **Pricing hypothesis, not a decision.** Validate with Van Westendorp + behavioural tests in
> Phase 0 (RQ5) and re-price at Phase 6. Indian willingness-to-pay for market tools is well
> established (TradingView, Sensibull, StockEdge) but is price-sensitive and anchored low.

| Tier | India | Global | Who | Core unlock |
|---|---|---|---|---|
| **Free** | ₹0 | $0 | Top of funnel | Wire, stories, today's Bridge, public Ledger, 6 Impact Cards/day, 1 watchlist, EOD analytics |
| **Pro** | **₹249/mo** · ₹2,490/yr (2mo free) | **$9/mo** · $90/yr | P0, P1 | Unlimited Impacts + analogs, real-time analytics (post-G1), India depth, alerts + Radar, all digests, export, Bridge archive |
| **Terminal** | **₹1,999/seat/mo** | **$59/seat/mo** | P2 | Pro + multi-pane workspace, API read access, PDF research export, priority support, team sharing, SSO |
| **API — Dev** | — | **$49/mo** | P3 indie | 10k calls/mo, webhooks, 1y backfill |
| **API — Business** | contracted | contracted | Brokers, fintechs | Streaming, full backfill, SLA, redistribution terms per licence |

**Launch pricing tactics:** founding-member rate (₹149/mo locked for life, first 1,000 Pro
subs) · 14-day Pro trial, no card · annual default-selected · student verification 50% off ·
UPI autopay (the highest-conversion Indian path).

**Deliberately not doing:** usage-based consumer pricing (unpredictable bills kill retention)
· ads on paid tiers (ever) · paid stock promotion (would destroy Moat 2) · a cheaper tier
that removes the disclaimer or the Ledger.

---

## 3. Unit economics (planning model — validate every input)

**Per-MAU cost target: ≤ ₹18 (~$0.21)** blended infra + inference (NFR-COST-01).

| Cost line | Driver | Lever |
|---|---|---|
| LLM inference | signals/day × model tier | Cluster-level inference, tiered routing, content-hash cache → target ≥85% of volume never reaching the expensive tier |
| Market data 🔴 | licence tier, not user count | **Largely fixed** — so it amortises powerfully with scale. This is the strongest argument for growth |
| Wire licence 🔴 | fixed/tiered | same |
| Compute + storage | MAU + corpus size | Caching, CDN, Timescale compression |
| WhatsApp | messages sent | Pro-only channel |
| Payments | 2–3% of revenue | UPI is cheaper than cards in India — push UPI |

**Illustrative Pro economics (India) — repriced 13 Nov 2026:**
```
ARPU                     ₹249/mo      (was ₹799)
Payment fees (UPI ~2%)   ₹  5
Infra + inference        ₹ 25         (heavier than free-tier average)
Support (amortised)      ₹ 20
Gross margin             ₹199  → 80%  (was ₹738 / 92%)
```
**🔴 What the repricing costs us.** Contribution per subscriber falls from ₹738 to ₹199 —
roughly a 73% reduction. Fixed data-licence costs are unchanged, so **break-even subscriber
count rises by about 3.7×**.

| Fixed monthly licence cost | Break-even subs at ₹799 | Break-even subs at ₹249 |
|---|---:|---:|
| ₹5 lakh | ~680 | ~2,500 |
| ₹15 lakh | ~2,030 | ~7,540 |
| ₹40 lakh | ~5,420 | ~20,100 |

**The trade, stated plainly.** A serious Indian retail trader already spends ₹1,200–2,500 a
month across a charting subscription, an options tool and a data service. At ₹799 we compete
for the top of that budget and have to displace something. At ₹249 we sit alongside what they
already use. That should materially raise conversion and lower churn — but it moves break-even
from a few thousand subscribers to five figures, and it makes the Terminal tier and the B2B
API materially more important to the P&L rather than optional.

**This is a bet on volume over margin.** It is defensible, and it is only defensible if
conversion actually improves by more than the 3.7× the maths demands. That assumption should
be tested in the Phase 0 pricing research (RQ5) before the number is treated as settled.

---

## 4. Growth model

| Loop | Mechanism | Measure |
|---|---|---|
| **Content/SEO** | Story pages, ticker pages, dated Bridge archives, `/track-record` — all indexable, all permanent | Organic sessions, indexed pages |
| **The Ledger as PR** | "We publish our hit rate" is a story no competitor can tell | Backlinks, press mentions |
| **Shareable Impact Cards** | Traders share in WhatsApp/Telegram groups — their native behaviour | Share rate, viral coefficient |
| **The Bridge as a daily artifact** | Screenshot-friendly by design | Shares/day |
| **Creator/community** | Partner with *registered* analysts and educators (never unregistered finfluencers — compliance) | Referred signups |
| **Broker partnerships** | Embedded or co-branded Bridge | Partner-sourced MAU |

**Rejected:** paid acquisition before PMF · referral cash incentives (attracts churn) ·
engagement-bait notifications · any growth tactic that conflicts with principle #8.

---

## 5. Reporting cadence
**Daily:** pipeline health, Bridge on-time + error, signups, revenue.
**Weekly:** WDS, retention cohorts, quality report (calibration, purity, precision), cost/MAU, competitive watch.
**Monthly:** full metric tree, cohort LTV, churn reasons, roadmap vs actuals.
**Quarterly:** Ledger public review, licence audit, pricing review, strategy check against [vision-and-moat.md](../00-overview/vision-and-moat.md).
