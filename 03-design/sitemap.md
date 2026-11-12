# Sitemap & Information Architecture

**Status:** Draft v1 · **Date:** 2026-11-12

---

## 1. Principle: one object, many projections

Per the [product model](../01-requirements/product-model.md), every page is a view onto
Signal / Event / Story / Impact / Outcome. **There is no page that invents its own data
shape.** This is what keeps a feature-dense product from becoming incoherent.

---

## 2. Top-level navigation (5 items, hard cap)

```
NEWZE   [ Today ]  [ Markets ]  [ India ]  [ Global ]  [ Track Record ]      🔍  ⭐  👤
         ↑ default landing for logged-in users
```

Deliberately **not** in the nav: Settings (in avatar), Search (icon + `/` hotkey),
Watchlist (star icon + drawer), Pricing (footer + paywall moments), API (footer).

> Five items because a trader's nav must be muscle-memory. Every additional item costs
> ~0.4s of hesitation on a surface used 250 mornings a year.

---

## 3. Full sitemap

```
/                                   Landing (logged-out) — the pitch + live wire teaser + Ledger proof
/today                              ⭐ THE HOME. Time-aware: Bridge pre-open, Live during session, Wrap after close
│
├── /bridge                         Overnight Bridge (M5)
│   ├── /bridge/[date]              Any past day's Bridge — permanent, scored
│   └── /bridge/method              How the model works + its track record
│
├── /wire                           Live global news wire (M1)
│   ├── ?region= &asset= &sector= &type= &impact= &tier=   (URL-encoded filter state)
│   └── /story/[slug]-[id]          Story page: timeline, sources, Impact Cards, related
│
├── /event/[id]                     Event detail: payload, impacts, analogs, outcome (once settled)
│
├── /markets                        Cross-asset overview (M3)
│   ├── /markets/equities           Indices grid, breadth, sectors
│   ├── /markets/rates              Curves, central-bank path
│   ├── /markets/fx                 Majors, USDINR focus, NDF
│   ├── /markets/commodities        Energy, metals, agri; crude-in-INR
│   ├── /markets/credit             IG/HY spreads
│   ├── /markets/crypto             Major pairs only
│   ├── /markets/calendar           Macro calendar: consensus / actual / surprise
│   ├── /markets/risk               VIX term structure, MOVE, spreads, curve flags
│   └── /markets/regime             Regime detector (P2)
│
├── /india                          India hub (M4)  ← the deep differentiator
│   ├── /india/indices              Nifty, Bank Nifty, Fin Nifty, Midcap, Sensex, sectors
│   │   └── /india/indices/[symbol] Contribution attribution, breadth, constituents
│   ├── /india/derivatives
│   │   ├── /oi                     OI build-up classification, OI change tables
│   │   ├── /chain/[symbol]         Option chain: PCR, max pain, OI by strike
│   │   ├── /iv                     IV rank/percentile, skew, term structure
│   │   ├── /participants           FII/DII/Pro/Client positioning ("smart vs retail")
│   │   ├── /rollover               Expiry rollover analytics
│   │   └── /expiry-lab             Expiry-day behaviour statistics (P2)
│   ├── /india/flows                FII/DII cash + F&O, MF/SIP flows
│   ├── /india/macro                CPI, WPI, IIP, GDP, GST, PMI, trade, monsoon, crude-in-INR
│   ├── /india/currency             USDINR, NDF premium, forwards, intervention proxy
│   ├── /india/valuation            Nifty P/E, P/B, earnings yield vs G-sec
│   ├── /india/corporate
│   │   ├── /results                Results calendar, surprise history, concall summaries
│   │   ├── /deals                  Bulk/block deals
│   │   ├── /insider                SAST / PIT disclosures
│   │   └── /actions                Corporate actions, ban list, margin & lot-size changes
│   └── /india/ipo                  Mainboard + SME tracker
│
├── /global                         Global hub (mirror of /india, shallower in v1)
│   ├── /global/centralbanks        Fed, ECB, BoJ, BoE, PBoC, RBI
│   ├── /global/earnings            Earnings season tracker
│   ├── /global/flows               ETF/fund flows, COT positioning
│   └── /global/geopolitics         Conflict, elections, sanctions, supply disruption
│
├── /ticker/[symbol]                ⭐ ENTITY PAGE — the universal destination
│                                   price · events timeline · impacts · analytics · filings · peers
├── /entity/[type]/[slug]           Person / country / commodity / policy-body / theme pages
│
├── /track-record                   ⭐ ACCURACY LEDGER (M6) — public, permanent
│   ├── ?type= &instrument= &horizon= &version=
│   └── /track-record/method        Methodology, calibration definitions, suppression log
│
├── /analogs                        Analog Engine query UI (P2)
├── /narratives                     Narrative Tracker (P2)
├── /search                         Search results
├── /ask                            Ask Newze — RAG Q&A with citations (P2)
│
├── /watchlist                      Watchlist manager + Radar settings
├── /alerts                         Alert rules, channels, quiet hours, history
├── /digests                        Digest preferences + archive
│
├── /account                        Profile, plan, billing, data export, delete
├── /pricing                        Tiers
├── /api                            Developer docs (M11)
│
└── Legal/meta
    ├── /about  /methodology  /editorial-policy  /corrections
    ├── /disclaimer  /terms  /privacy  /data-sources
    └── /status                     Pipeline + data-source health (public)
```

---

## 4. `/today` — the time-aware home

The single most important IA decision: **the home page changes shape with the clock (IST).**

| Window | Mode | Hero content |
|---|---|---|
| 00:00–07:30 | **Overnight** | Global session so far, events that landed after India closed |
| **07:30–09:15** | **🔔 Bridge** | Overnight Bridge: expected open, waterfall, top-3 events, key levels |
| 09:15–15:30 | **Live** | Live wire + India session dashboard + intraday Impact Cards |
| 15:30–18:30 | **Wrap** | What moved and why, attribution, flows, tomorrow's calendar |
| 18:30–00:00 | **Global** | US session, global events, overnight setup building |
| Weekends | **Review** | Week in review, Ledger update, narratives, next week's calendar |

Non-Indian users get a timezone-appropriate variant driven by their primary market setting.
**This is a core product behaviour, not a nicety** — it is how one page serves loop L1.

---

## 5. Navigation rules

1. **Any instrument mentioned anywhere is a link to `/ticker/[symbol]`.** No exceptions.
2. **Any number is traceable** — hover/tap reveals source + timestamp + latency class.
3. **Every Impact Card links to its Event, its analogs, and (post-settlement) its Outcome.**
4. **Every analytics chart has a "related events" rail** — analytics and news are never siloed.
5. Filter state is always URL-encoded (shareable, bookmarkable, back-button correct).
6. Max depth from `/today` to any content: **3 clicks**.

---

## 6. URL & SEO conventions
- Stories: `/story/rbi-holds-repo-rate-at-X-01jc8f` (slug + short id; slug may change, id never does)
- Tickers: `/ticker/NSE:HDFCBANK`, `/ticker/NASDAQ:AAPL` (exchange-qualified, unambiguous)
- Dated pages are permanent and indexable: `/bridge/2026-11-12`
- Canonical URLs on everything; `NewsArticle` + `Dataset` JSON-LD; ISR revalidation ≤60s on live surfaces
