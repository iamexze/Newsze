# Newze — Product Vision & Moat Thesis

**Status:** Draft v1 · **Owner:** Product · **Date:** 2026-11-12
**Read this first.** Every other document in `/docs` is downstream of this one.

---

## 1. The one-line product

> **Newze turns world events into measured market consequences — globally, and specifically for the Indian trader — and publishes its own accuracy while doing it.**

Not "a news site with charts bolted on." The news and the analytics are the *same object*
viewed from two sides: an **Event** has a story, and an Event has a **price consequence**.
Every surface in the product is a projection of that single object.

---

## 2. The problem, stated honestly

### 2.1 What exists today

| Category | Examples | What they do well | Where they fail |
|---|---|---|---|
| Global wires | Reuters, Bloomberg, AP | Speed, trust, breadth | Expensive, no retail analytics layer, "what it means" is paywalled or absent |
| Finance portals | Yahoo Finance, Investing.com | Free data breadth | Commodity data, zero editorial intelligence, ad-choked, no memory |
| Terminals | Bloomberg, Refinitiv, Koyfin, Sentieo | Depth, institutional data | $2k–$30k/yr; built for professionals; India coverage is shallow |
| India portals | Moneycontrol, Economic Times, Mint, Livemint | Local reach, brand | Pageview-optimised, slow, weak quant layer, F&O analytics are superficial |
| India analytics | Sensibull, Opstra, StockEdge, Trendlyne, TIJORI | Good F&O / screener tools | Tool-shaped, not narrative-shaped. They tell you *what the data is*, never *why today is different* |
| Social | Telegram, X/Twitter, YouTube | Immediacy, community | Unaccountable, survivorship-biased, often illegal under SEBI finfluencer rules |

### 2.2 The actual gap

Three gaps stack on top of each other, and **nobody occupies all three at once**:

1. **The interpretation gap.** News tells you *what happened*. Data tells you *what prices
   did*. Almost nothing credible tells you *what this event class has historically done to
   these instruments, with what hit rate*. Retail fills this gap with Telegram tipsters.

2. **The India↔Global bridge gap.** India has ~19 crore demat accounts and the world's
   largest derivatives volume by contract count — and the single most important input to an
   Indian trading day (what happened globally between 15:30 and 09:15 IST) is covered by
   one lazy line: *"SGX Nifty up 40 points."* There is no rigorous overnight transmission
   model anywhere in the retail market.

3. **The accountability gap.** No financial media property publishes its own hit rate.
   Not one. Because it's embarrassing. That is exactly why it is defensible.

### 2.3 Who we are for

| Segment | Size (India/global) | Pain | Willingness to pay |
|---|---|---|---|
| **P0 — The serious retail trader (India)** | ~40–60 lakh active F&O + delivery traders | Drowning in noise, loses to information asymmetry | ₹499–₹1,499/mo, proven by Sensibull/StockEdge/TradingView adoption |
| **P1 — The global macro-curious investor** | Millions | Wants Bloomberg-grade context, won't pay Bloomberg prices | $20–$50/mo |
| **P2 — Analysts, RIAs, family offices, small funds** | Tens of thousands | Needs defensible, citable, exportable research | $200–$600/seat/mo |
| **P3 — Builders / brokers / fintechs** | Hundreds | Needs structured news+event data via API | $1k–$25k/mo licences |

**We build for P0 first.** P0 is the hardest, most underserved, highest-frequency user. If
we win the Indian serious retail trader, P1/P2/P3 are downstream distribution problems, not
product problems.

---

## 3. The moat — why this cannot simply be cloned

A competitor can clone our UI in six weeks. They cannot clone these four, and three of them
**get stronger every day we operate**:

### Moat 1 — The Event→Outcome Corpus (compounding, the real one)
Every event we ingest is normalised into a typed **Event** record, linked to instruments,
and then — critically — **joined to what prices actually did over the next 1m / 15m / 1d /
5d / 20d windows**. Within 24 months this is a labelled dataset of millions of
(event-type × context × realised-outcome) tuples that exists nowhere else, because
building it requires having been running the pipeline for 24 months. **Time is the barrier
to entry.** We also backfill 15 years of history at launch so we start with a corpus, not an
empty table.

### Moat 2 — The Accuracy Ledger (trust, hard to copy for cultural reasons)
Every impact estimate we publish is automatically scored against reality and published
forever on a public scorecard, per event class, per instrument, per horizon. Incumbents
*cannot* follow us here without admitting their own track record. It is a moat made of
institutional embarrassment. It also makes our marketing self-generating.

### Moat 3 — The India↔Global transmission model (depth, expensive to replicate)
GIFT Nifty basis, ADR/GDR dislocation, DXY/USDINR pass-through, Brent-in-INR, US close →
Asia → India open chains, FII/DII flow regimes, participant-wise OI. Each one is a research
project. The composite is a genuine piece of IP and needs Indian market domain knowledge
that global players don't have and Indian media companies don't have the engineering for.

### Moat 4 — Speed + structure from minute zero
We publish *structured* output (entities, event type, surprise magnitude, affected
instruments, confidence) within seconds of a headline, not a 600-word article in 20 minutes.
Structured-first is an architectural choice that is painful to retrofit onto a CMS-based
newsroom. Every incumbent is CMS-based.

> **Moat summary:** UI is copyable. Data pipelines are copyable with money. A *scored
> historical corpus of your own published predictions* is copyable only by someone who
> started three years ago.

---

## 4. The product principles (these settle arguments later)

1. **Structure before prose.** Nothing is published as text-only. Every story carries a
   machine-readable payload. Prose is a rendering of the payload, never the source.
2. **Every number is clickable to its source.** No orphan statistics, ever. One tap → the
   filing, the exchange file, the print, the timestamp.
3. **Confidence is a first-class citizen.** We never state an impact without a confidence
   band and a sample size. "We don't know" is a shippable answer and is shipped often.
4. **We are accountable in public.** Every call is scored. The scorecard is never hidden,
   never reset, never cherry-picked.
5. **Analytics, never advice.** We describe, quantify and contextualise. We do not say buy,
   sell, hold, or print target prices unless/until SEBI RA registration is in place. See
   `../01-requirements/compliance.md` — this is a hard product constraint, not a footnote.
6. **Time-to-insight < 10 seconds.** A user opening the app at 09:05 IST must know what
   matters today before 09:15. Every screen is designed against a stopwatch.
7. **Density with hierarchy.** Traders want density; amateurs want hierarchy. We ship both
   through one adaptive layout, not two products.
8. **No dark patterns, no clickbait, no autoplay.** Our monetisation is subscription; our
   incentive is correctness, not pageviews. This is a stated, enforced constraint.

---

## 5. North Star & the metric tree

**North Star Metric: Weekly Decision Sessions (WDS)**
> A session in which a user viewed ≥1 Impact Card *and* ≥1 analytics surface, lasting ≥90s,
> on ≥4 distinct days in a rolling 28-day window.

Why not DAU/pageviews: pageviews reward clickbait and would corrupt the product within a
quarter. WDS only goes up when the product is actually used to make decisions.

```
                     Weekly Decision Sessions (WDS)
                    /              |               \
         Activated users    Sessions/user/wk   Depth per session
            /     \              /    \            /        \
      Signup→   Watchlist    Alert    Habit   Impact Cards  Analytics
      first      created     opens    (open    viewed       surfaces
      Impact     (≥3 syms)            09:00-                 used
      Card <2m                        09:15)
```

**Supporting KPI families** (full definitions in `../07-planning/metrics-monetisation.md`):
- *Quality*: Impact Engine hit rate by horizon; calibration error (Brier score); median
  headline→publish latency; duplicate-cluster purity; correction rate.
- *Engagement*: D1/D7/D30 retention; pre-open session rate (the key Indian habit loop);
  alert→open CTR.
- *Business*: Free→Pro conversion, net revenue retention, CAC payback, API ARR.

---

## 6. What we are explicitly NOT building (v1–v3)

Scope discipline is what makes this shippable. We are **not** building:

- ❌ A brokerage, order routing, or any execution capability (regulatory nightmare, 10x cost)
- ❌ Portfolio management / accounting / tax reporting (crowded, low margin, distracting)
- ❌ Buy/sell signals, tips, target prices, or model portfolios **until SEBI RA is secured**
- ❌ A social network / user-generated forum in v1 (moderation liability under SEBI rules)
- ❌ Crypto-first anything (we cover it as an asset class, we are not a crypto site)
- ❌ Our own charting engine (we integrate a proven one)
- ❌ Native mobile apps before Phase 6 (PWA first; see `../04-architecture/system-diagram.md`)
- ❌ Original on-ground reporting / a newsroom of correspondents (we are an intelligence
  layer over licensed wires, not a wire service)

---

## 7. The 3-year arc

| Horizon | Position | Proof point |
|---|---|---|
| **Year 1** | "The best pre-market 10 minutes in India." | 50k MAU, 2.5k paying, Accuracy Ledger live with 12 months of scored calls |
| **Year 2** | "The interpretation layer for global markets." | 400k MAU, 25k paying, API customers, global macro desk parity |
| **Year 3** | "The cheapest thing that is genuinely terminal-grade." | Institutional tier, broker white-label, the Event Corpus licensed as a product in itself |

---

## 8. The killing risks (named up front)

| # | Risk | Severity | Mitigation | Doc |
|---|---|---|---|---|
| R1 | **Market data licensing** — NSE/BSE real-time data requires a paid licence + agreement; unlicensed redistribution is a hard stop | 🔴 Critical | Launch on delayed/EOD + licensed vendor; budget for licence in Phase 3 | `../06-api/integrations.md` |
| R2 | **SEBI RA regulations** — quantified impact estimates can be construed as research/advice | 🔴 Critical | Analytics-not-advice framing + legal review + RA registration track | `../01-requirements/compliance.md` |
| R3 | **News content licensing** — we cannot republish wire copy; headlines + links + our own analysis only | 🔴 Critical | Licensed wire deal or strict fair-use link-out architecture | `../06-api/integrations.md` |
| R4 | **The Impact Engine is wrong** and the Accuracy Ledger proves it publicly | 🟠 High | Ship it in shadow mode for 90 days before anything is public; publish only classes that clear a calibration bar | `../01-requirements/product-model.md` |
| R5 | **Cost of real-time infra + LLM inference** at scale | 🟠 High | Tiered model routing, aggressive caching, cluster-level (not article-level) inference | `../04-architecture/system-diagram.md` |
| R6 | Incumbent (Moneycontrol/Zerodha/TradingView) ships a lookalike | 🟡 Medium | Moats 1 & 2 are time-based; 18-month head start on the corpus | this doc |

**R1, R2 and R3 are go/no-go gates on Phase 0.** We do not write production ingestion code
before they have owners and written answers.

---

## 9. How to use this repo

| Doc | Question it answers |
|---|---|
| `vision-and-moat.md` | Why this exists and why it wins *(you are here)* |
| `../02-research/competitors.md` | Who else is here and exactly where they're weak |
| `../01-requirements/product-model.md` | **The machine** — how an event becomes an insight, end to end |
| `../01-requirements/prd.md` | Every feature, prioritised, with acceptance criteria |
| `../04-architecture/system-diagram.md` | The system that runs the machine |
| `../06-api/integrations.md` | Every input, its cost, its licence, its latency |
| `../07-planning/roadmap.md` | Phase gates, deliverables, exit criteria |
| `../07-planning/metrics-monetisation.md` | Pricing, packaging, unit economics, instrumentation |
| `../01-requirements/compliance.md` | SEBI, exchange licensing, copyright, disclaimers |
| `../03-design/design-system.md` | Information design, the screens, the visual language |
| `../04-architecture/adr/` | ADRs — one file per irreversible choice |
| `../decisions.md` | Running decision log |
