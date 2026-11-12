# The Product Model — How The Machine Works

**Status:** Draft v1 · **Date:** 2026-11-12
**This is the core document.** Architecture (`04`) implements this. Features (`03`) are
surfaces onto this. If a proposed feature cannot be expressed in terms of the objects and
stages below, it does not belong in the product.

---

## 1. The single idea

Everything in Newze is one of **five objects** and one **loop**:

| Object | Definition | Example |
|---|---|---|
| **Signal** | A raw, timestamped input from the outside world | A Reuters headline; an NSE bhavcopy row; a CPI print; an SEC 8-K |
| **Event** | A typed, deduplicated, entity-linked thing that *happened* | `RATE_DECISION{Fed, −25bp, vs consensus −25bp, surprise=0}` |
| **Story** | A living cluster of Events + Signals on one developing subject | "Fed easing cycle, Nov 2026" — a thread, not an article |
| **Impact** | A *prediction*: expected effect of an Event on named Instruments over named horizons, with confidence and historical basis | `NIFTY_BANK, +0.4% ±0.9%, 1d, conf 0.61, n=34 analogs` |
| **Outcome** | What actually happened, measured, joined back to the Impact | `NIFTY_BANK realised +0.22% @1d → Impact scored HIT` |

```
   Signal ──▶ Event ──▶ Impact ──▶ (time passes) ──▶ Outcome
                │                                       │
                └──────────▶ Story ◀────────────────────┘
                                │
                                ▼
                     ┌──────────────────────┐
                     │   EVENT CORPUS       │ ← Moat 1. Grows daily. Never resets.
                     │  (event × context ×  │
                     │   realised outcome)  │
                     └──────────┬───────────┘
                                │ trains / retrieves
                                ▼
                        better Impacts  ──▶ better product ──▶ more users
                                ▲                                   │
                                └──── more coverage, more data ◀────┘
```

**That loop is the company.** Every engineering decision either makes the loop spin faster,
make it more accurate, or it is not a priority.

---

## 2. The pipeline — 8 stages

```
 ①INGEST → ②NORMALISE → ③RESOLVE → ④CLUSTER → ⑤CLASSIFY → ⑥SCORE → ⑦PUBLISH → ⑧SETTLE
   wires      canonical    entities   stories    event type   impact   surfaces   outcome
   exchanges  schema       tickers    dedupe     + surprise   + conf   + alerts   scoring
   filings    timestamps   people     threads    + novelty    + analog           ↓
   macro      TZ/currency  orgs                                                  └──▶ ①
```

### ① INGEST — get everything, lose nothing
- **Inputs:** news wires, RSS/Atom, exchange feeds (NSE/BSE/NYSE/NASDAQ/LSE), corporate
  filings (SEBI/EDGAR/RNS), macro calendars + prints, central bank channels, commodity &
  FX feeds, ETF/fund flows, on-chain (later). Full inventory in `../06-api/integrations.md`.
- **Rules:** every Signal is persisted **raw and immutable** to object storage before any
  processing, with `source_id`, `fetched_at`, `published_at`, `checksum`. Reprocessing is a
  replay over raw storage — never a re-fetch. This makes the whole model re-trainable.
- **Latency budget:** wire → persisted ≤ **2s** (p95).

### ② NORMALISE — one schema to rule them all
Every Signal becomes a canonical record: UTC + IST + source-local timestamps; currency
tagged and never implicitly converted; numeric units explicit (`bp`, `pct`, `INR_cr`,
`USD_mn`); source tier assigned (T0 primary/exchange, T1 wire, T2 major outlet, T3 aggregator,
T4 social/unverified).
> **Rule:** Nothing of tier T4 can ever produce a published Impact. It can only produce a
> `RUMOUR` Event, visibly labelled, with `confirmed: false`.

### ③ RESOLVE — entity linking (the quiet hard part)
Map free text to canonical IDs. "HDFC Bank", "HDFCBANK", "HDB" (NYSE ADR), "एचडीएफसी बैंक"
→ one `org_id`, with its NSE symbol, BSE code, ISIN, ADR ticker, index memberships, sector
(GICS + NSE sector), supply-chain tags and peer set.
- Pipeline: dictionary/alias match → fuzzy → LLM disambiguation only on misses (cost control).
- Entity types: `org`, `person`, `instrument`, `index`, `commodity`, `currency_pair`,
  `country`, `policy_body`, `sector`, `theme`.
- **Target:** ≥97% precision on NSE-500 + S&P-500 names. Measured weekly against a golden set.

### ④ CLUSTER — stories, not articles
40 outlets report the same RBI decision. The user must see **one** object.
- Embed → ANN search within a sliding time window → cluster → pick a canonical representation.
- A cluster is a **Story** with: a timeline, a source list (with tier badges), a stance
  spectrum, a "what's new since you last looked" diff, and a confirmation state.
- **This is a visible feature, not just hygiene.** "47 outlets, 1 story, here's the timeline"
  is a core UX promise.

### ⑤ CLASSIFY — turn a Story into a typed Event
An LLM + rules ensemble emits a strict JSON payload. The **event taxonomy** (~120 types,
versioned in `05-data-model/event-taxonomy.yaml`) includes:

| Family | Example types |
|---|---|
| Monetary | `RATE_DECISION`, `CB_SPEECH`, `QT_CHANGE`, `FX_INTERVENTION`, `CRR_SLR_CHANGE` |
| Macro print | `CPI`, `WPI`, `GDP`, `IIP`, `PMI`, `NFP`, `JOBLESS_CLAIMS`, `GST_COLLECTION`, `TRADE_BALANCE` |
| Corporate | `EARNINGS`, `GUIDANCE_CHANGE`, `MNA`, `BUYBACK`, `DIVIDEND`, `SPLIT`, `CAPEX`, `ORDER_WIN`, `MGMT_CHANGE`, `AUDITOR_RESIGN` |
| Regulatory | `SEBI_ACTION`, `RBI_CIRCULAR`, `TARIFF`, `ANTITRUST`, `SANCTION`, `TAX_CHANGE` |
| Flows | `FII_DII_FLOW`, `BULK_BLOCK_DEAL`, `INSIDER_TRADE`, `INDEX_REBALANCE`, `MF_FLOW` |
| Geopolitical | `CONFLICT`, `ELECTION`, `COUP`, `DISASTER`, `SUPPLY_DISRUPTION`, `OPEC_DECISION` |
| Market structure | `CIRCUIT`, `HALT`, `EXPIRY`, `LOT_SIZE_CHANGE`, `BAN_PERIOD`, `MARGIN_CHANGE` |

Each Event carries:
```jsonc
{
  "event_id": "evt_01JC...",
  "type": "RATE_DECISION",
  "subtype": "CUT",
  "actors": ["policy_body:US_FED"],
  "affected": ["index:NIFTY_BANK", "ccy:USDINR", "index:SPX", "cmdty:XAU"],
  "magnitude": { "value": -25, "unit": "bp" },
  "consensus": { "value": -25, "unit": "bp", "source": "poll:reuters" },
  "surprise":  { "z": 0.0, "direction": "inline" },   // ← the single most predictive field
  "novelty":   0.12,          // 0=fully anticipated/already priced, 1=unprecedented
  "certainty": "confirmed",   // confirmed | reported | rumoured | denied
  "scope":     "global",      // global | region | country | sector | single_name
  "as_of":     "2026-11-12T18:30:00Z",
  "sources":   [{ "tier":"T1","id":"reuters:...","url":"..." }],
  "story_id":  "sty_01JC..."
}
```
> **`surprise` is the product's most important field.** Markets price expectations, not
> events. An in-line rate cut moves nothing; a 25bp miss moves everything. Any system that
> scores "news sentiment" without a consensus baseline is noise, and that is precisely what
> every existing sentiment product does.

### ⑥ SCORE — the Impact Engine
Given `(Event, MarketContext)` produce an **Impact** per instrument per horizon. Three
estimators, ensembled with learned weights:

1. **Analog retrieval (primary, explainable).** Build a context vector — event type,
   subtype, surprise z, novelty, plus regime features (VIX level & term structure, trend
   state, breadth, DXY, crude, FII flow regime, days-to-expiry, IV percentile, seasonality).
   ANN-search the Event Corpus for the *k* nearest historical analogs. Output the empirical
   distribution of their realised returns.
   **Why primary:** it is inherently explainable — "here are the 34 times this happened and
   what followed." That is the entire user-facing promise, and it is unfakeable.
2. **Statistical baseline.** Per `(event_type × instrument × horizon)`: event-study
   abnormal-return estimation with a market model, plus a GARCH volatility-response term.
   Keeps us honest when analogs are sparse.
3. **Learned model.** Gradient-boosted trees / small sequence model over the same features,
   trained on the corpus. Used only where it beats 1 & 2 out-of-sample on a rolling window.

Impact record:
```jsonc
{
  "impact_id": "imp_01JC...", "event_id": "evt_01JC...",
  "instrument": "index:NIFTY_BANK",
  "horizon": "1d",                      // 15m | 1h | 1d | 5d | 20d
  "expected_move_pct": 0.41,
  "band_68": [-0.5, 1.3], "band_95": [-1.7, 2.5],
  "direction_prob": { "up": 0.61, "down": 0.39 },
  "vol_response": { "iv_change_pts": 1.4 },
  "confidence": 0.61,                   // calibrated, NOT a vibe
  "analogs": { "n": 34, "hit_rate": 0.62, "median_move": 0.35,
               "nearest": ["evt_...","evt_...","evt_..."] },
  "method": "ensemble:analog0.6|stat0.25|ml0.15",
  "model_version": "impact-v1.4.2",
  "published": true
}
```
**Publication gate (non-negotiable):** an Impact is only shown to users if
`n_analogs ≥ 12` **and** the model version's rolling 90-day calibration error for that
`(event_type × horizon)` is within tolerance. Otherwise the UI shows
*"Not enough history to call this — here's the raw context."* **Shipping "we don't know" is
a feature, and it is the reason the Ledger will look good.**

### ⑦ PUBLISH — render into surfaces
One Event fans out into: the live wire, the Story thread, the Impact Card, instrument pages,
dashboards, alerts, the daily briefs, the API. **All from the same payload** — never
re-authored per surface. (Surfaces enumerated in `../01-requirements/prd.md`.)

### ⑧ SETTLE — the feedback loop that makes it compound
A scheduled job joins every published Impact to realised market data at each horizon:
- Computes realised move, abnormal (market-adjusted) move, direction hit/miss, whether the
  realised value fell inside the 68%/95% bands.
- Writes an **Outcome** record. Updates the Accuracy Ledger. Feeds model retraining.
- **Never deletes or revises a published Impact.** Corrections are append-only events.

---

## 3. The four engines built on the pipeline

### Engine A — Impact Engine
Covered above (stage ⑥). Surface: the **Impact Card**, the product's atomic unit of value.

### Engine B — Analog Engine ("when did this happen before?")
Beyond single events: encode the **whole market state** of a day into a vector (~80
features across trend, vol, breadth, flows, rates, FX, commodities, positioning, valuation,
seasonality) and let users ask *"which historical days most resemble today, and what
happened next?"*
- Output: ranked analogs with dates, similarity scores, a forward-return fan chart, and the
  honest caveat (`n`, regime dissimilarity warnings, overlapping-sample adjustment).
- **Anti-overfit guard:** explicit warnings when analogs cluster in a single regime (e.g.
  "28 of 31 analogs fall in Mar–Jun 2020 — treat as one observation, not 28").

### Engine C — Narrative Tracker ("what is the market actually arguing about?")
Track **themes** (not tickers) over time: share-of-voice, velocity, sentiment, and
crucially **narrative-vs-price divergence** — when a narrative intensifies while the
related basket stops responding, that is information.
- Output: narrative momentum charts, emergence alerts ("'Yen carry unwind' mentions +340%
  w/w, first time above threshold since Aug 2024"), narrative→instrument heat.

### Engine D — Overnight Bridge (India's killer feature)
A dedicated model that answers one question with discipline, every trading morning:
> **"Given everything that happened globally since 15:30 IST yesterday, what is the
> expected Nifty / Bank Nifty open, and what is the realistic range for the first hour?"**

Inputs: GIFT Nifty level **and basis**, US close + after-hours, Asian session (Nikkei,
Hang Seng, KOSPI), ADR/GDR dislocation vs local close (INFY, HDB, IBN, WIT, RDY, MMYT…),
DXY & USDINR NDF, Brent in INR, UST 10y & India 10y G-sec, overnight global Events and
their Impacts, FII/DII prior-day flows, prior-day F&O OI structure and PCR, days-to-expiry,
India VIX, and gap-fill statistics conditioned on gap size and regime.

Output, published at **07:30 IST daily**:
- Expected open with a probability cone
- Gap-fill probability (conditioned on gap size, direction, regime, expiry proximity)
- The **attribution waterfall**: "+38 pts from US close, −12 from crude, +9 from USDINR,
  −6 from ADR drag, +4 residual" — *nobody in Indian retail media does this*
- Key levels: prior-day OI-derived support/resistance, max pain, high-OI strikes
- The three Events that matter for today, with their Impact Cards
- **Scored against the actual open every single day, publicly.**

> If we build nothing else well, build this. It is a daily 7:30am habit, a shareable
> artifact, and an unambiguous accuracy claim — the perfect growth loop.

---

## 4. The canonical data model

```
signals ──┐
          ├──▶ stories ──▶ events ──▶ impacts ──▶ outcomes ──▶ ledger_entries
entities ─┘        │           │          │
                   │           │          └──▶ alerts ──▶ deliveries
                   │           └──▶ event_instruments (m:n)
                   └──▶ story_sources (m:n, with tier + stance)

instruments ──▶ prices_tick / prices_ohlcv / fundamentals / derivatives_oi / flows
narratives ──▶ narrative_mentions ──▶ narrative_timeseries
users ──▶ watchlists ──▶ watchlist_items ──▶ alert_rules
market_states (daily feature vectors, for Engine B)
```
Field-level spec: [`05-data-model/entities.md`](../05-data-model/entities.md). Executable DDL is produced in Phase 1. Core invariants:

1. **Raw is immutable.** `signals` is append-only; reprocessing writes new derived rows.
2. **Everything derived is versioned.** Every `impact` carries `model_version`; we can
   always answer "what did we believe on date X with model Y."
3. **Every published number is traceable** to ≥1 `signal.source_id`. Enforced by a
   constraint, not by convention.
4. **Time is tri-coded**: `event_time` (when it happened), `publish_time` (when the source
   said it), `ingest_time` (when we got it). Backtests use `ingest_time` only — this is how
   we avoid look-ahead bias, which is the single most common way products like this lie.

---

## 5. The three user loops (what actually creates habit)

| Loop | Trigger | Action | Reward | Frequency |
|---|---|---|---|---|
| **L1 — The Morning Ritual** 🇮🇳 | 07:30 IST push: "Your open is set up" | Open Overnight Bridge, read waterfall + 3 events + levels | Walks into 09:15 informed; checks at 09:20 whether we were right | Daily, 250x/yr — **the core habit** |
| **L2 — The Interrupt** | Breaking Event hits a watchlist symbol above impact threshold | Open Impact Card → analogs → act | Knows *before* the Telegram group does | 3–15x/week |
| **L3 — The Study** | Weekend / evening | Analog Engine, Narrative Tracker, Accuracy Ledger, deep dives | Gets better at their own process | 1–3x/week, drives Pro conversion |

**L1 is the retention engine. L2 is the virality engine. L3 is the monetisation engine.**
Every roadmap item should name which loop it serves. Items that serve none get cut.

---

## 6. Model governance (how we avoid becoming a tipster with extra steps)

| Control | Rule |
|---|---|
| **Shadow period** | Every model version runs ≥90 days publishing to an internal ledger only, before anything is user-visible |
| **Calibration bar** | Published classes must hold Brier ≤ 0.22 and |calibration error| ≤ 0.08 on a rolling 90d window, else auto-suppressed |
| **Auto-suppression** | A degrading `(event_type × horizon)` class is pulled from the UI automatically, and the pull is itself shown on the Ledger |
| **No look-ahead, ever** | Training and backtests use `ingest_time`; point-in-time index membership; survivorship-bias-free universe (delisted names retained) |
| **Human kill switch** | Any Impact can be withdrawn by a human; withdrawal is a public, append-only record with a reason |
| **No advice boundary** | The engine outputs *distributions*, never actions. No "buy", no "target", no position sizing. Enforced in the prompt layer, the schema (there is no `action` field), **and** the review checklist. See `../01-requirements/compliance.md` |
