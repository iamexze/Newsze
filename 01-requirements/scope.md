# Scope — In / Out, MVP vs Later

**Status:** Draft v1 · **Date:** 2026-11-12
This document is the contract that prevents scope creep. Changing it requires an entry in
[`../decisions.md`](../decisions.md).

---

## 1. The MVP thesis

> **MVP = "The best pre-open 10 minutes in India."**

We do **not** launch a broad global news site with shallow analytics. We launch a *narrow,
deep, daily habit* for Indian traders, with enough global news to make the habit work — and
the architecture already general enough to expand globally without a rewrite.

**MVP success criterion:** 1,000 users open the Overnight Bridge on ≥10 of 20 trading days
in a month, and ≥35% of them say they'd be "very disappointed" if it disappeared.

---

## 2. MVP (Phase 1–3) — IN

| Module | What ships | What's deliberately thin |
|---|---|---|
| **M1 News** | 60+ sources, clustering, tiers, timeline, live wire, filters | English only. No Hindi. No rumour state machine. |
| **M2 Impact** | Full taxonomy, surprise vs consensus, analog-retrieval Impacts, publication gate, analog display | Learned-model component off; ensemble = analog + statistical only |
| **M4 India** | Index dashboards, OI build-up, option chain basics (PCR/max pain/OI-by-strike), FII/DII flows, India macro with surprise | **EOD/delayed data** until Gate G1 closes. No participant-wise OI. No concall summaries. |
| **M3 Global** | Cross-asset dashboard, macro calendar with consensus/actual/surprise | No regime detector, no correlation explorer, no positioning/COT |
| **M5 Bridge** | Daily 07:30 IST publication, expected open + cone, attribution waterfall, top-3 events, self-scoring at 09:16 | Nifty + Bank Nifty only. No pre-open auction mode. |
| **M7 Personal** | Watchlists, email digest at 07:30 and 16:00 | No custom alert rules, no WhatsApp, no quiet hours |
| **M10 Console** | Pipeline monitor, review queue, kill switch, golden-set QA report | Minimal UI; internal only |
| **Platform** | Web (desktop + mobile PWA), auth, SEO, analytics instrumentation | No native apps, no payments (MVP is free + waitlist for Pro) |

**MVP explicitly includes** the Accuracy Ledger running in **shadow mode** from day one —
scored internally, not shown publicly — so that when it goes public in Phase 4 it already
has 90+ days of history. *This is the single most important sequencing decision in the plan.*

---

## 3. Fast-follow (Phase 4–5) — after MVP validation

- M6 Accuracy Ledger goes **public** (requires ≥90 days of shadow data)
- M4 depth: participant-wise OI, IV surface, rollovers, delivery %, bulk/block/insider, results calendar + concall summaries
- M3 depth: central-bank tracker, surprise indices, breadth, risk dashboard, correlations
- M2: learned-model component added to the ensemble (only if it beats the baseline OOS)
- M7: full alert rules engine, web push, WhatsApp, quiet hours, Radar thresholds
- M9: payments, Pro tier, paywall
- M8: search + entity pages
- Real-time data tier (post-Gate-G1)

## 4. Later (Phase 6–7)

- M8 "Ask Newze" RAG Q&A; Analog Engine query UI
- M12 Narrative Tracker
- M11 Public Data API + webhooks + streaming
- Hindi, then regional languages
- Native mobile apps
- Terminal tier (multi-pane workspace, exports, PDF research notes)
- Broker white-label / B2B embeds
- US/EU market microstructure depth equivalent to the India layer
- Options strategy analytics (payoff, greeks) — **only if** it can stay non-advisory

---

## 5. OUT — permanently or until explicitly revisited

| Item | Status | Reason |
|---|---|---|
| Brokerage / order placement / execution | ❌ Permanent | Different business, different regulator, 10x capital |
| Buy / sell / hold calls, target prices, model portfolios | ⛔ Blocked | SEBI RA registration required. Revisit only after `compliance.md` Gate G2 resolves and registration is obtained |
| Portfolio accounting, P&L, tax reports | ❌ Out | Crowded, low margin, zero moat contribution |
| User-generated forum / comments | ❌ Out (v1–v3) | Moderation liability; dilutes the trust position |
| Crypto-native features (wallets, DeFi, on-chain) | ❌ Out | We cover crypto as an asset class only |
| Our own charting engine | ❌ Out | Integrate a proven library; zero differentiation in rebuilding one |
| On-ground reporting / correspondent network | ❌ Out | We are an intelligence layer, not a wire service |
| Copy-trading, social trading, leaderboards | ❌ Permanent | Regulatory and ethical minefield; directly contradicts principle #5 |
| Paid promotion of stocks / sponsored "research" | ❌ Permanent | Would destroy Moat 2 instantly |

---

## 6. Scope-change protocol

1. Anyone can propose a change. Proposals name the **loop** (L1/L2/L3) and the **moat** they serve.
2. A change that adds scope must name what it displaces — the plan has no slack by design.
3. P0/P1 changes need Product sign-off and a `decisions.md` entry with the date and why.
4. **No new module may be added before the current phase's exit criteria are met.** Phase gates in [`../07-planning/roadmap.md`](../07-planning/roadmap.md) are hard.
