# Personas

**Status:** Draft v1 (hypothesis-stage — to be validated by the interviews in
[`research-plan.md`](research-plan.md)) · **Date:** 2026-11-12

> ⚠️ These are **assumption personas**, built from market structure and competitor analysis,
> not yet from interviews. Treat every "pain" below as a hypothesis with a test attached.
> Phase 0 exists partly to kill or confirm them.

---

## P0 — Rohit, 31 · Pune · "The serious retail trader" ⭐ *primary*

| | |
|---|---|
| **Profile** | IT services employee, ₹18L/yr salary. Trades Bank Nifty weekly options + a 12-stock delivery portfolio. ₹6–8L trading capital. 5 years in the market, 2 profitable. |
| **Day** | 07:00 wakes, checks US close on his phone in bed. 07:30–09:00 scrolls 4 Telegram channels, Moneycontrol, TradingView, a YouTube pre-market video. 09:15 trades for 45 min. Checks positions at lunch. 15:20 squares off. Evening: reviews, watches 2 more videos. |
| **Tools** | Zerodha Kite, TradingView (paid), Sensibull (occasionally), 6 Telegram groups, 3 YouTube channels, Moneycontrol app |
| **Spends** | ₹1,200–2,500/mo on tools already |
| **Pain (hypotheses)** | H1: *"I'm assembling my morning view from 7 untrustworthy sources and it takes 90 minutes."* · H2: *"I never know if a tipster is actually right — nobody keeps score."* · H3: *"I react to global news hours after it's already in the price."* · H4: *"I see the OI data but I don't know what it means today vs any other day."* |
| **What would make him switch** | One screen at 07:30 that replaces the 90 minutes — **and** proof, in numbers, that it's been right |
| **What would make him churn** | A single confidently wrong call with no acknowledgment. Or noise: >6 notifications a day. |
| **Quote (hypothesised)** | *"I don't want someone to tell me what to buy. I want to know what usually happens when this happens."* |
| **Serves loops** | L1 (morning), L2 (interrupt) |

## P1 — Ananya, 38 · Bengaluru/Singapore · "The global macro investor"

| | |
|---|---|
| **Profile** | Product leader at a tech firm. ₹2cr+ portfolio across Indian equities, US stocks, gold, bonds. Invests, doesn't trade. Reads macro for fun and for allocation. |
| **Day** | Reads in 20-minute blocks — morning coffee, evening. Not screen-bound. Monthly rebalancing cadence. |
| **Tools** | Zerodha + Vested/IndMoney, Koyfin (trial), Bloomberg via work, 3 Substacks, podcasts |
| **Pain (hypotheses)** | H5: *"I want Bloomberg-quality context without Bloomberg."* · H6: *"Indian coverage of global macro is a translation of a Reuters story, six hours late, with no analysis."* · H7: *"I can't tell which macro story actually matters for my allocation."* |
| **Would switch for** | A genuinely intelligent daily/weekly macro read with data behind it |
| **Would churn from** | Day-trader noise, hype, or anything that feels like a tip service |
| **Serves loops** | L3 (study), weekend digest |

## P2 — Prakash, 44 · Mumbai · "The professional"

| | |
|---|---|
| **Profile** | Analyst / RIA / family-office PM. Produces notes others act on. Reputation is his product. |
| **Pain (hypotheses)** | H8: *"I spend 60% of my time gathering, 40% thinking. I want that inverted."* · H9: *"I can't cite a source I can't verify — most retail tools give me numbers with no provenance."* · H10: *"Covering 40 results days is physically impossible without summarisation I can trust."* |
| **Would pay** | ₹8,000–₹25,000/mo per seat if it is genuinely citable and exportable |
| **Hard requirements** | Provenance on every number · export (PDF/CSV/API) · point-in-time correctness · no black boxes |
| **Serves loops** | L3; drives Terminal tier |

## P3 — Dev, 29 · Bengaluru · "The integrator"

| | |
|---|---|
| **Profile** | Engineer at a broker/fintech, or an indie quant. Wants structured event data as an input to something else. |
| **Pain** | H11: *"There is no clean, structured, India-aware event feed. I'm parsing PDFs from the exchange."* |
| **Would pay** | ₹50k–₹5L/mo at company scale; $49–$199/mo indie |
| **Hard requirements** | Stable schema, versioning, webhooks, backfill, SLA, clear redistribution terms |
| **Serves** | M11 API tier |

## P4 — "OPS" · internal editorial/ops user

| | |
|---|---|
| **Needs** | See pipeline health in one glance · hold risky items before publish · kill anything, fast · know when a source dies · see cost per 1k events |
| **Fear** | Publishing something confidently wrong at scale, automatically, at 3am |
| **Serves** | M10 console — *this persona is routinely forgotten and is the one that prevents catastrophe* |

---

## Anti-persona — who we are NOT for

**"Vikram, 23, wants a tip."** Wants someone to tell him what to buy, wants certainty, wants
a 90% win-rate claim, will churn the first losing week. Serving him would require claims we
won't make, and would destroy the trust position that makes P0/P1/P2 possible.
**We will lose this user to Telegram, deliberately, and that is correct.**

---

## Jobs-to-be-done

| JTBD | Persona | Current solution | Our replacement |
|---|---|---|---|
| "When I wake up, help me understand what changed overnight, so I can act at 09:15 with a view." | P0 | 7 sources, 90 min | Overnight Bridge (M5) |
| "When news breaks on something I own, tell me whether it actually matters." | P0, P1 | Panic-googling, Telegram | Radar + Impact Cards (M2, M7) |
| "When I'm deciding whether to trust an estimate, show me the evidence." | all | Nothing exists | Analogs + Accuracy Ledger (M2, M6) |
| "When I'm forming a macro view, give me the cross-asset picture in one place." | P1, P2 | 6 tabs | Global analytics (M3) |
| "When I need to justify a view to someone else, give me something citable." | P2 | Manual assembly | Provenance + export |
