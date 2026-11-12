# Integrations — Data Sources & Third-Party Services

**Status:** Draft v1 · **Date:** 2026-11-12

> ⚠️ **All costs below are planning placeholders, not quotes.** Market-data and wire pricing
> is negotiated, tiered and changes often. Every row marked 💰 must be replaced with a real
> quote during Phase 0 (work order L2/L3 in [compliance.md](../01-requirements/compliance.md)).
> **Do not build a budget on this table.** It exists to scope the procurement work.

---

## Part A — Data sources (the product's raw material)

### A1. News & wires
| Source | Kind | Tier | Latency | Licence posture | Notes |
|---|---|---|---|---|---|
| Reuters / AFP / AP | wire | T1 | seconds | 💰 **commercial licence required** | The quality anchor. Price scales with usage rights. Start with one. |
| PTI / ANI / IANS | wire | T1 | seconds | 💰 commercial | India-specific coverage |
| Publisher RSS (ET, Mint, BQ, Business Standard, MC) | rss | T2 | 1–15 min | headline + link-out only | Free to poll; **never republish body text** |
| Global publisher RSS (FT, WSJ, Bloomberg, CNBC) | rss | T2 | 1–15 min | headline + link-out only | Paywalled bodies are not accessible and not needed |
| Company IR / press-release feeds | rss/api | T0 | seconds | public | Primary source — highest value per item |
| X/Twitter lists, Telegram public | social | T4 | seconds | 💰 API cost | **Rumour tracking only. Never produces a published Impact.** |

### A2. Exchange & market data 🔴 *Gate G1*
| Source | Kind | Latency need | Licence |
|---|---|---|---|
| **NSE** — prices, indices, derivatives, OI, bhavcopy, participant-wise OI, bulk/block, ban list, corporate actions | exchange | realtime → EOD | 💰 **Licence required for real-time and for any redistribution.** MVP runs on EOD files |
| **BSE** — equivalent | exchange | realtime → EOD | 💰 same |
| **NSE IX / GIFT Nifty** | exchange | realtime | 💰 **Critical for the Overnight Bridge** |
| US (NYSE/NASDAQ), consolidated tape | exchange/vendor | delayed ok at MVP | 💰 via vendor |
| ADR quotes (INFY, HDB, IBN, WIT, RDY…) | vendor | delayed ok | 💰 Bridge input |
| FX spot + USDINR NDF/forwards | vendor | realtime desirable | 💰 |
| Commodities (Brent, WTI, gold, copper), MCX | vendor | delayed ok | 💰 |
| Rates — UST curve, India G-sec (CCIL), OIS | vendor/public | EOD ok | mixed |
| Crypto (Binance/Coinbase public APIs) | api | realtime | public, free |

**Enquiry pack ready to send:** [`procurement/`](procurement/) — six enquiries against one
specification, plus the break-even arithmetic and decision framework.

**Vendor shortlist to price in Phase 0:** a licensed Indian market-data redistributor; a
broker's licensed API (often the cheapest legitimate real-time path for a small player);
and one global vendor for non-Indian instruments. **Decision recorded as ADR-004.**

### A3. Filings & regulatory
NSE/BSE corporate announcements · SEBI (orders, circulars, SAST/PIT) · MCA (India) ·
SEC EDGAR (free, excellent) · UK RNS · RBI (circulars, policy, bulletins, WSS) ·
AMFI (MF/SIP flows) · CDSL/NSDL (demat/FPI stats). Mostly public; parsing effort is the
cost, not licensing.

### A4. Macro & calendars
MoSPI (CPI/IIP/GDP), GST Council, Commerce Ministry (trade), IMD (monsoon), CMIE (💰),
US BLS/BEA/Census (free), Eurostat/ECB SDW (free), FRED (free, excellent), China NBS,
S&P Global PMI (💰), **consensus forecasts** (💰 — *required for `surprise_z`, which is the
single most predictive field in the model; budget for it explicitly*).

### A5. Derived/alternative *(Phase 6+)* — shipping & freight, satellite, app downloads, job postings, Google Trends, power demand (POSOCO), e-way bills. **Deliberately deferred** — high cost, unproven marginal lift.

### A6. Source registry (how all of this is governed)
Every source is a **row in `sources`**, never a hardcoded constant: parser, cadence, tier,
`licence_status`, `licence_ref`, `redistributable`, `latency_class`, ToS URL and review date.
Consequences: a licence change is a config change; the serialiser enforces redistribution
rights per field; the "source silent" alert is automatic; and a quarterly licence audit is a
query, not an archaeology project.

---

## Part B — Platform integrations

| Concern | Choice | Why | Notes |
|---|---|---|---|
| **Payments — India** | **Razorpay** | UPI is non-negotiable for Indian conversion; GST-compliant invoicing; subscriptions + mandates | Webhooks → `subscriptions`; reconcile daily |
| **Payments — global** | **Stripe** | Cards, SCA, tax handling | Route by billing country |
| **Email** | **Resend** (→ SES at volume) | 07:30 digests are a core delivery channel, not marketing | Separate transactional and marketing streams + domains to protect deliverability |
| **Push** | Web Push (VAPID) → FCM/APNs with native apps | PWA push works on iOS 16.4+ | |
| **WhatsApp** | Meta Cloud API via an Indian BSP | **The highest-engagement channel for P0.** Template approval needed for the 07:30 digest | 💰 per-conversation pricing; model it in unit economics |
| **SMS** | MSG91 / Twilio | OTP only — too expensive for content | DLT registration required in India |
| **Auth** | Own (email/phone OTP) + Google OAuth | Avoids vendor lock-in on the identity layer; OTP suits India | MFA for staff via TOTP |
| **Object storage** | **Cloudflare R2** | Zero egress; raw signals are written constantly and read on replay | |
| **CDN / WAF** | **Cloudflare** | DDoS, bot management, cache segmentation by entitlement | Cache keys **must** include entitlement class |
| **LLM** | **Anthropic Claude** — Haiku 5.5 bulk, Opus 5 for high-impact | Tiered routing is the core cost lever (C4) | Prompt caching + content-hash caching; strict JSON schemas |
| **Embeddings** | Self-hosted small model | Volume makes API embeddings uneconomic | Batched |
| **Product analytics** | **PostHog** (self-host option) | Analytics + feature flags + session replay in one | Replay off for any PII surface |
| **Error tracking** | **Sentry** | | Scrub PII in beforeSend |
| **Observability** | **OpenTelemetry → Grafana Cloud** | One trace across all 8 pipeline stages | |
| **Orchestration** | **Temporal Cloud** | Durable settle/backfill workflows | |
| **Event bus** | **Redpanda Cloud** | Kafka semantics, replay | |
| **Search** | **Typesense Cloud** | | |
| **Status page** | Instatus / Better Stack | Public `/status` with per-source health | |
| **Support** | Plain / Crisp | | |

---

## Part C — Integration risk register

| # | Risk | Impact | Mitigation |
|---|---|---|---|
| I1 | **Wire licence too expensive at seed stage** | Thin T1 coverage at launch | Launch on T0 primary sources (exchange, filings, IR, central banks) + RSS headline/link-out. **T0 is the highest-value tier anyway** — this is a survivable constraint |
| I2 | **Real-time exchange licence delayed or unaffordable** | M4 real-time slips | MVP is specified EOD-first; latency class is a config value ([ADR-004](../04-architecture/adr/004-market-data-abstraction.md)) |
| I3 | **Consensus-forecast data unaffordable** | `surprise_z` degrades → the model's best feature is lost | Build an internal consensus from multiple public forecast sources; accept wider bands; flag affected event classes on the Ledger |
| I4 | A source changes format silently | Pipeline breaks quietly | Schema validation per parser + "source silent/shape changed" alerts within 5 min (FR-M10-01) |
| I5 | LLM cost escalates with volume | Margin erosion | Cluster-level inference, tiered routing, content-hash cache, per-stage cost alerts (NFR-COST-01) |
| I6 | WhatsApp per-message cost at scale | Delivery cost exceeds ARPU on free tier | WhatsApp is a **Pro-only** channel; free tier gets email + web push |
| I7 | Vendor lock-in on a managed service | Migration cost later | Kafka API (portable), Postgres (portable), OTel (portable). Temporal and R2 are the two deliberate exceptions |
| I8 | A source's ToS forbids our use and we miss it | Legal exposure | `tos_reviewed_at` is mandatory on every source row; sources without a review cannot be enabled |
