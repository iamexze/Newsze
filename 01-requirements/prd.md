# Newze — Product Requirements Document

| | |
|---|---|
| **Status** | Draft v1 — *In Review* |
| **Owner** | Product |
| **Date** | 2026-11-12 |
| **Supersedes** | — |
| **Related** | [Product Model](product-model.md) · [Scope](scope.md) · [Compliance](compliance.md) · [Roadmap](../07-planning/roadmap.md) |

---

## 1. Context

Read [`product-model.md`](product-model.md) before this document. It defines the five
core objects (**Signal → Event → Story → Impact → Outcome**) and the eight-stage pipeline
(**Ingest → Normalise → Resolve → Cluster → Classify → Score → Publish → Settle**). Every
requirement below is a surface onto, or a stage of, that model.

**Requirement ID format:** `FR-<module>-<n>` functional · `NFR-<area>-<n>` non-functional.
**Priority:** `P0` = MVP, product is meaningless without it · `P1` = required for paid launch ·
`P2` = v2 · `P3` = backlog/later.

---

## 2. Modules at a glance

| # | Module | Purpose | Serves loop | MVP? |
|---|---|---|---|---|
| M1 | **News Engine** | Ingest → story clusters → live wire | L2 | ✅ P0 |
| M2 | **Impact Cards** | Event → quantified consequence + analogs | L2 | ✅ P0 |
| M3 | **Global Analytics** | Cross-asset, macro, rates, flows, regime | L3 | ✅ P0 (core) / P1 (depth) |
| M4 | **India Analytics** | Indices, F&O microstructure, flows, filings, macro | L1/L3 | ✅ P0 (core) / P1 (depth) |
| M5 | **Overnight Bridge** | 07:30 IST daily open model + attribution | **L1** | ✅ P0 |
| M6 | **Accuracy Ledger** | Public scoring of every published call | trust | P1 |
| M7 | **Personalisation** | Watchlists, alerts, digests, preferences | L1/L2 | P0 (watchlist) / P1 (alerts) |
| M8 | **Search & Ask** | Full-text + semantic search; RAG Q&A with citations | L3 | P1 |
| M9 | **Accounts & Billing** | Auth, tiers, payments (INR + intl), entitlements | business | P1 |
| M10 | **Editorial Console** | Internal: review, override, kill-switch, QA | ops | P0 (minimal) |
| M11 | **Public Data API** | Structured events/impacts for B2B | business | P2 |
| M12 | **Narrative & Analog Engines** | Theme tracking; market-state analog search | L3 | P2 |

---

## 3. M1 — News Engine

### Goal
A user sees everything that matters, **once**, within a minute of it happening, with a
visible chain of custody back to the primary source.

| ID | Requirement | Pri | Acceptance criteria |
|---|---|---|---|
| FR-M1-01 | Ingest from configured sources (wires, RSS, filings, exchange notices, macro calendars) | P0 | ≥60 sources live; raw payload persisted immutably with checksum before processing; ingest→persist p95 ≤ 2s |
| FR-M1-02 | Deduplicate into **Story clusters** | P0 | ≥92% cluster purity on a 500-item golden set; max 1 visible card per story in the wire |
| FR-M1-03 | Each story shows **source tier badges** (T0 exchange/primary → T4 social) | P0 | Tier visible on every card; T4 items carry a persistent "Unverified" label and never render an Impact |
| FR-M1-04 | **Story timeline** — chronological development of a cluster | P0 | Every story page shows all member signals with timestamps, outlet, tier, and link-out |
| FR-M1-05 | "What's new since you last looked" diff on returning to a story | P1 | Items after `user.last_seen_at` are marked; count shown on the story card |
| FR-M1-06 | Headline + dek rendered in our own words; **full source text is never republished** | P0 | Max 200 characters quoted per source; canonical link-out on every source row; enforced by lint in CI |
| FR-M1-07 | Live wire with filters: region, asset class, sector, instrument, event type, impact threshold, tier | P0 | Filters compose; state is URL-encoded and shareable |
| FR-M1-08 | Real-time push to open clients (no refresh) | P0 | New item appears ≤3s after publish; reconnect with backfill on network drop |
| FR-M1-09 | Rumour handling — `certainty` state machine | P1 | `rumoured → reported → confirmed / denied`; state changes are append-only and visible on the timeline |
| FR-M1-10 | Corrections are append-only and publicly visible | P0 | A correction never silently mutates a published item; original remains with a correction banner |
| FR-M1-11 | Hindi rendering of story summaries | P2 | Language toggle; quality-reviewed sample ≥95% acceptable |
| FR-M1-12 | SEO-indexable story pages with structured data | P1 | `NewsArticle` JSON-LD, canonical URLs, sitemap, ISR regeneration ≤60s |

**Latency budget (p95, source publish → visible to user):** wires **≤ 45s** · exchange
filings **≤ 90s** · macro prints **≤ 15s** (pre-scheduled, template-parsed).

---

## 4. M2 — Impact Cards (the atomic unit of value)

### Goal
The user understands, in under 10 seconds, what an event is likely to do, how confident we
are, and *why* we think so.

| ID | Requirement | Pri | Acceptance criteria |
|---|---|---|---|
| FR-M2-01 | Classify each story into a typed **Event** per the taxonomy | P0 | ≥90% type accuracy on golden set; ~120 types versioned in `05-data-model/event-taxonomy.yaml` |
| FR-M2-02 | Compute **surprise vs consensus** where a consensus exists | P0 | Macro prints and earnings carry `consensus`, `surprise.z`, `surprise.direction` |
| FR-M2-03 | Produce **Impacts** per (instrument × horizon) via the ensemble | P0 | Horizons 15m/1h/1d/5d/20d; every Impact carries band_68, band_95, direction_prob, confidence, method, model_version |
| FR-M2-04 | Show **analogs**: n, hit rate, median move, and the nearest historical events as links | P0 | ≥3 nearest analogs clickable to their own story pages |
| FR-M2-05 | **Publication gate** — suppress low-evidence Impacts | P0 | If `n_analogs < 12` or class calibration out of tolerance → render "Not enough history to call this" + raw context. Gate is code, not policy |
| FR-M2-06 | Regime-clustering warning on analogs | P1 | If >60% of analogs fall in one 6-month window, display the concentration warning |
| FR-M2-07 | Impact Card never contains an action, target price, or position sizing | P0 | Schema has no `action` field; prompt-layer guardrail + CI assertion + editorial checklist |
| FR-M2-08 | Every Impact is persisted for settlement | P0 | 100% of published Impacts receive an Outcome row at each horizon within 24h of horizon close |
| FR-M2-09 | "Explain this" expansion — plain-language reasoning with citations | P1 | Every claim links to a signal or a data point; no uncited numbers |
| FR-M2-10 | Shareable Impact Card image/link (growth loop) | P1 | OG image generated per card; includes confidence + n; includes disclaimer |

---

## 5. M3 — Global Analytics

| ID | Requirement | Pri | Acceptance criteria |
|---|---|---|---|
| FR-M3-01 | Cross-asset dashboard: equity indices, rates, FX, commodities, credit, crypto | P0 | ≥60 instruments; 1d/1w/1m/YTD; heatmap + table views |
| FR-M3-02 | Macro calendar with consensus / actual / prior / surprise | P0 | Rolling 30d forward + 90d back; surprise auto-computed; linked to the resulting Event |
| FR-M3-03 | **Economic surprise index** per economy | P1 | Rolling composite of standardised surprises; charted vs index performance |
| FR-M3-04 | Central-bank tracker: Fed, ECB, BoJ, BoE, PBoC, RBI | P1 | Current policy rate, next meeting, market-implied path, dot-plot/guidance summary, speech feed |
| FR-M3-05 | Sector rotation + market breadth | P1 | GICS sector performance grid, adv/dec, % above 50/200DMA, new highs/lows |
| FR-M3-06 | Correlation matrix + rolling correlation explorer | P1 | User-selectable instruments and windows; regime-shift flagging |
| FR-M3-07 | Risk dashboard: VIX term structure, MOVE, credit spreads (IG/HY), yield curves | P1 | Curve inversion flags; spread percentiles vs 5y history |
| FR-M3-08 | **Regime detector** | P2 | Classifies risk-on / risk-off / stagflation / disinflation / crisis with confidence and history |
| FR-M3-09 | Earnings season tracker (US/EU) | P2 | Beat/miss rates, aggregate surprise, guidance direction |
| FR-M3-10 | Positioning & flows: COT, ETF flows, fund flows | P2 | Weekly updates; percentile vs history |

---

## 6. M4 — India Analytics (the differentiator)

| ID | Requirement | Pri | Acceptance criteria |
|---|---|---|---|
| FR-M4-01 | Index dashboards: Nifty 50, Bank Nifty, Fin Nifty, Midcap/Smallcap, Sensex, sector indices | P0 | OHLC, breadth, contribution attribution (which constituents moved the index), advance/decline |
| FR-M4-02 | **F&O open-interest analytics** | P0 | OI build-up classification (long build-up / short build-up / long unwinding / short covering) per symbol; OI change tables |
| FR-M4-03 | Option chain analytics: PCR, max pain, high-OI strikes, OI change by strike | P0 | Per index + top F&O stocks; intraday refresh at licensed latency |
| FR-M4-04 | IV analytics: IV percentile/rank, skew, term structure, India VIX context | P1 | Surface view + historical IV percentile |
| FR-M4-05 | **Participant-wise OI** (FII / DII / Pro / Client) — "smart money vs retail" | P1 | Daily net positions in index futures, index options, stock futures; divergence flagging |
| FR-M4-06 | FII/DII cash + F&O flows | P0 | Daily, with rolling sums and regime classification |
| FR-M4-07 | Rollover analytics around expiry | P1 | Rollover %, cost of carry, vs 3m average |
| FR-M4-08 | Delivery % analytics | P1 | Per symbol, vs 5/20d average, flagged anomalies |
| FR-M4-09 | Bulk/block deals, insider (SAST/PIT) disclosures | P1 | Auto-parsed from exchange files into Events |
| FR-M4-10 | Results calendar + earnings analytics + concall summaries | P1 | Calendar, surprise history, LLM summary of transcripts with citations |
| FR-M4-11 | IPO tracker (mainboard + SME) | P2 | Subscription by category, listing-day stats. **GMP, if shown at all, is labelled unofficial/grey-market with a prominent caveat** — see compliance |
| FR-M4-12 | India macro: CPI, WPI, IIP, GDP, GST collections, PMI, trade, monsoon, crude-in-INR | P0 | Each with history, consensus, surprise, and linkage to affected sectors |
| FR-M4-13 | USDINR dashboard incl. NDF premium, forward curve, RBI intervention proxy | P1 | Daily; intervention proxy clearly marked as an estimate |
| FR-M4-14 | Valuation dashboard: Nifty P/E, P/B, earnings yield vs 10y G-sec | P1 | Percentile bands vs 10y history |
| FR-M4-15 | Expiry Lab — behaviour of expiry days by weekday/index/regime | P2 | Statistical summaries only; explicitly non-advisory |
| FR-M4-16 | F&O ban list, margin changes, lot-size changes, circuit events | P1 | Ingested as Events; alerting supported |
| FR-M4-17 | Mutual fund / SIP flow tracker (AMFI monthly) | P2 | Trend charts, category flows |

> ⚠️ **Every item here depends on Gate G1 (market data licence).** Until G1 closes, all M4
> requirements are specified against **delayed/EOD** data. Real-time variants are a separate
> post-G1 line item. See [`compliance.md`](compliance.md).

---

## 7. M5 — Overnight Bridge (the habit)

| ID | Requirement | Pri | Acceptance criteria |
|---|---|---|---|
| FR-M5-01 | Publish daily at **07:30 IST** on every trading day | P0 | 99% on-time over any 30-day window; failure pages show a status, never stale data |
| FR-M5-02 | Expected open with probability cone for Nifty + Bank Nifty | P0 | Point estimate + 68%/95% cones; method + model version shown |
| FR-M5-03 | **Attribution waterfall** of the expected gap | P0 | Components: US close, after-hours, Asia, GIFT basis, ADR dislocation, DXY/USDINR, crude, rates, overnight events, residual. Components sum to the estimate |
| FR-M5-04 | Gap-fill probability conditioned on gap size, direction, regime, days-to-expiry | P1 | Shown with n and the conditioning set |
| FR-M5-05 | Key levels from prior-day OI structure | P1 | Max pain, high-OI strikes, prior-day VWAP/high/low — labelled as data, not advice |
| FR-M5-06 | Top 3 overnight Events with their Impact Cards | P0 | Ranked by predicted impact on Indian instruments |
| FR-M5-07 | **Auto-scored against the actual open at 09:16 IST**, published | P0 | Error vs estimate; running 30d MAE; feeds the Accuracy Ledger |
| FR-M5-08 | Push/email/WhatsApp delivery at 07:30 IST | P1 | Per-user channel preference; delivery success tracked |
| FR-M5-09 | Pre-market mode 09:00–09:15 IST — live pre-open session data | P2 | Pre-open auction prices/indicative open where licensing permits |

---

## 8. M6 — Accuracy Ledger

| ID | Requirement | Pri | Acceptance criteria |
|---|---|---|---|
| FR-M6-01 | Every published Impact is scored at each horizon and recorded permanently | P1 | Append-only; no deletion path exists in code |
| FR-M6-02 | Public ledger page: hit rate, calibration curve, Brier score, MAE — overall and sliced by event type / instrument / horizon / model version | P1 | Sliceable; shows n for every cell; no cell with n<10 shows a rate |
| FR-M6-03 | Auto-suppression of degrading classes, with the suppression itself shown | P1 | Class pulled from UI when calibration breaches tolerance; a "suppressed" entry appears on the ledger |
| FR-M6-04 | Model version history and changelog | P1 | Every version's performance remains visible after replacement |
| FR-M6-05 | Shadow-mode ledger (internal) for unreleased models | P0 | ≥90 days shadow before any public exposure |
| FR-M6-06 | No cherry-picking controls exist | P0 | There is no admin ability to hide an individual scored call; only whole-class suppression, which is itself published |

---

## 9. M7 — Personalisation, Watchlists & Alerts

| ID | Requirement | Pri | Acceptance criteria |
|---|---|---|---|
| FR-M7-01 | Watchlists (multiple, named) of instruments, sectors, themes, countries | P0 | ≥3 lists free tier, unlimited Pro; CSV/broker import P2 |
| FR-M7-02 | **Radar** — only surface news whose predicted impact on a watched instrument exceeds a threshold | P1 | User-set threshold; default calibrated so a median user gets ≤5 alerts/day |
| FR-M7-03 | Alert rules: event type, instrument, price/OI/IV condition, impact threshold | P1 | Composable conditions; dedupe window; quiet hours; per-rule channel |
| FR-M7-04 | Channels: in-app, web push, email, WhatsApp/Telegram (P2), mobile push (P3) | P1 | Delivery receipts logged; CTR measured per rule |
| FR-M7-05 | Daily digests: 07:30 pre-open, 16:00 post-close, weekend review | P1 | Personalised to watchlist; unsubscribe per digest |
| FR-M7-06 | Saved views and layouts persist across sessions and devices | P2 | Serialised to user profile |
| FR-M7-07 | Reading history + "what I missed" catch-up | P2 | Since-last-visit digest capped at 10 items by impact rank |

---

## 10. M8 — Search & Ask

| ID | Requirement | Pri | Acceptance criteria |
|---|---|---|---|
| FR-M8-01 | Full-text + semantic search over stories, events, filings, transcripts | P1 | p95 < 400ms; filters by date, type, entity, tier |
| FR-M8-02 | Entity pages (company / index / commodity / person / country) as search destinations | P1 | Each page: price, events timeline, impacts, analytics, filings, peers |
| FR-M8-03 | **Ask Newze** — natural-language Q&A over our corpus with inline citations | P2 | Every factual sentence carries a citation; refuses out-of-corpus questions; refuses advice-shaped questions by policy |
| FR-M8-04 | "What happened the last N times…" query builder (Analog Engine UI) | P2 | Returns n, distribution, fan chart, and caveats |

---

## 11. M9 — Accounts, Tiers & Billing

| ID | Requirement | Pri | Acceptance criteria |
|---|---|---|---|
| FR-M9-01 | Auth: email OTP + Google; optional phone for India | P1 | Session security per `08-ops`; no password storage if OTP-only |
| FR-M9-02 | Tiers: Free, Pro, Terminal, API — entitlement-gated at the API layer, not just the UI | P1 | A gated endpoint returns 402/403 regardless of client |
| FR-M9-03 | Payments: Razorpay (INR, UPI/cards/netbanking) + Stripe (intl) | P1 | GST-compliant invoices for India; dunning; proration |
| FR-M9-04 | Free-tier metering with a clear paywall moment | P1 | e.g. 5 Impact Cards/day, 1 watchlist, EOD-only analytics |
| FR-M9-05 | Cancellation and data export are self-serve | P1 | No retention dark patterns (principle #8) |

---

## 12. M10 — Editorial & Ops Console (internal)

| ID | Requirement | Pri | Acceptance criteria |
|---|---|---|---|
| FR-M10-01 | Pipeline monitor: per-stage throughput, lag, error rate, source health | P0 | Source-down alert within 5 min of a feed going silent vs its expected cadence |
| FR-M10-02 | Review queue for high-impact or low-confidence Events before publish | P0 | Configurable rule: `impact > X` or `confidence < Y` → human review |
| FR-M10-03 | **Kill switch** — withdraw any published item or Impact | P0 | Withdrawal is append-only, public, and requires a reason |
| FR-M10-04 | Entity-resolution correction UI | P1 | Corrections feed back into the alias dictionary |
| FR-M10-05 | Golden-set management + weekly automated quality report | P0 | Entity precision, cluster purity, classification accuracy, calibration — trended |
| FR-M10-06 | Cost dashboard: per-source, per-model, per-1k-events inference cost | P1 | Daily; alerts on anomaly |

---

## 13. M11 — Public Data API (B2B)

| ID | Requirement | Pri | Acceptance criteria |
|---|---|---|---|
| FR-M11-01 | REST + webhook delivery of Events and Impacts | P2 | Documented in [`06-api/`](../06-api/endpoints.md); versioned; 99.9% SLA on paid tiers |
| FR-M11-02 | Streaming (SSE/WebSocket) event feed | P2 | ≤2s from internal publish |
| FR-M11-03 | Keys, quotas, usage metering, per-tier rate limits | P2 | Overage billing; usage dashboard |
| FR-M11-04 | **Redistribution terms enforced per data source** | P2 | Licensed price data is not redistributable via API unless the licence permits; enforced per-field at the serialiser |

---

## 14. Non-functional requirements

| ID | Area | Requirement |
|---|---|---|
| NFR-PERF-01 | Latency | Wire→visible p95 ≤45s; API p95 ≤250ms; dashboard TTI ≤2.5s on 4G mid-tier Android |
| NFR-PERF-02 | Realtime | Push delivery ≤3s from publish; client auto-reconnect with gap backfill |
| NFR-PERF-03 | Web vitals | LCP ≤2.5s, INP ≤200ms, CLS ≤0.1 at p75 — **enforced in CI, build fails on regression** |
| NFR-AVAIL-01 | Uptime | 99.9% monthly on read surfaces; **99.95% during 09:00–15:45 IST and 18:30–01:30 IST** (the two sessions that matter) |
| NFR-AVAIL-02 | Degradation | If analytics fail, news still serves; if the Impact Engine fails, stories still publish without Impacts. No total outage from one subsystem |
| NFR-SCALE-01 | Load | 50k concurrent readers at launch+12mo; ingestion 20k signals/day sustained, 10x burst on event days (Fed day, Budget day, expiry) |
| NFR-SEC-01 | Security | OWASP ASVS L2; secrets in a manager not env files; all PII encrypted at rest; audit log on every admin action |
| NFR-SEC-02 | Access | RBAC on the console; no production data in dev; MFA for all internal users |
| NFR-PRIV-01 | Privacy | India DPDP Act + GDPR compliant; consent for marketing; export + delete self-serve; no sale of personal data, ever |
| NFR-DATA-01 | Integrity | Raw signals immutable; derived data versioned; **point-in-time correctness required for all backtests** |
| NFR-DATA-02 | Retention | Raw signals 7y; prices indefinite; user analytics 25mo; logs 90d |
| NFR-A11Y-01 | Accessibility | WCAG 2.2 AA; full keyboard operation; **colour is never the sole encoding of direction** (critical for a red/green product) |
| NFR-I18N-01 | i18n | UTC+IST dual timestamps everywhere; INR/USD explicit; lakh/crore *and* million/billion formats per user preference; Hindi P2 |
| NFR-SEO-01 | SEO | SSR/ISR on all public content; structured data; <60s index freshness on breaking stories |
| NFR-COST-01 | Unit cost | ≤ ₹18 ($0.21) blended infra+inference cost per MAU at 50k MAU. Tracked weekly |
| NFR-OBS-01 | Observability | Distributed tracing across all 8 pipeline stages; every published artifact traceable to its source signals in one query |

---

## 15. Instrumentation requirements (no feature ships un-instrumented)

Mandatory events: `signal_ingested`, `event_published`, `impact_published`,
`impact_settled`, `card_viewed`, `card_expanded`, `analogs_viewed`, `story_opened`,
`source_clicked`, `analytics_surface_viewed`, `watchlist_modified`, `alert_fired`,
`alert_opened`, `bridge_viewed`, `bridge_shared`, `ledger_viewed`, `paywall_hit`,
`checkout_started`, `subscription_created`, `search_performed`, `ask_question`.

Every event carries: `user_id|anon_id`, `session_id`, `surface`, `instrument(s)`,
`event_type`, `model_version`, `latency_ms`, `tier`. Definitions in
[`07-planning/instrumentation.md`](../07-planning/instrumentation.md).

---

## 16. Open questions (owners + due dates in `decisions.md`)

| # | Question | Blocks | Owner |
|---|---|---|---|
| Q1 | Real-time NSE/BSE licence — direct, or via a vendor (and which)? Cost? | All of M4 real-time | Founder |
| Q2 | Does a quantified Impact constitute "research" under SEBI RA Regulations? | M2, M5 public launch | Counsel |
| Q3 | Wire licensing — which partner, what cost, what redistribution rights? | M1 breadth | Founder |
| Q4 | Build vs licence the historical corpus backfill (15y of prices + events)? | Moat 1 bootstrap | Eng + Founder |
| Q5 | Launch geography of the paywall — India-first pricing or global day one? | M9 | Product |
| Q6 | Do we show IPO GMP at all, given it references an unregulated grey market? | FR-M4-11 | Counsel |
| Q7 | Charting: TradingView licence vs lightweight-charts vs ECharts? | M3/M4 UI | Eng |
