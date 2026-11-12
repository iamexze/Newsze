# System Design

**Status:** Draft v1 · **Date:** 2026-11-12
Implements the 8-stage pipeline in [`../01-requirements/product-model.md`](../01-requirements/product-model.md).

---

## 1. System context

```
┌──────────────────────── EXTERNAL WORLD ────────────────────────┐
│ wires · RSS · exchange feeds (NSE/BSE/NYSE…) · filings (SEBI/  │
│ EDGAR/RNS) · macro calendars · central banks · FX/commodities  │
│ · fund-flow data · ADR quotes · GIFT Nifty                      │
└───────────────────────────┬────────────────────────────────────┘
                            │ pull (poll/RSS) + push (webhook/WS)
                            ▼
┌──────────────────────── NEWZE PLATFORM ────────────────────────┐
│                                                                 │
│  INGEST ─▶ EVENT BUS ─▶ ENRICH ─▶ SCORE ─▶ PUBLISH ─▶ SETTLE   │
│     │          │           │         │         │         │     │
│     └──────────┴───────────┴─────────┴─────────┴─────────┘     │
│                    all stages observable, replayable            │
└───────────┬────────────────────────────────┬────────────────────┘
            │                                │
            ▼                                ▼
   ┌─────────────────┐              ┌──────────────────┐
   │  WEB (Next.js)  │              │  PUBLIC API/WS   │
   │  PWA · SEO      │              │  B2B (Phase 7)   │
   └─────────────────┘              └──────────────────┘
            │                                │
            ▼                                ▼
      end users (web/mobile)           broker/fintech integrators
```

---

## 2. Component architecture

```
                         ┌───────────────────────────────┐
                         │      SOURCE REGISTRY (DB)     │
                         │ url · cadence · licence · tier│
                         │ parser · auth · health · ToS  │
                         └───────────────┬───────────────┘
                                         │ config-driven
┌────────────────────────────────────────▼─────────────────────────────────────┐
│ ① INGEST WORKERS (Python)                                                    │
│   rss-poller · wire-client · exchange-file-fetcher · filing-crawler          │
│   macro-calendar-sync · price-feed-client · websocket-listeners              │
│   ├─ writes RAW immutable → OBJECT STORE (R2/S3)  ← source of truth, replayable│
│   └─ emits  signal.received → BUS                                            │
└────────────────────────────────────────┬─────────────────────────────────────┘
                                         ▼
┌──────────────────────────── EVENT BUS (Redpanda/Kafka) ──────────────────────┐
│ topics: signal.received · signal.normalised · story.updated · event.classified│
│         impact.published · outcome.settled · alert.requested · dlq.*          │
│ ordering per entity key · 7-day retention · replay = reprocessing             │
└──────────────┬───────────────────────────────────────────────────────────────┘
               ▼
┌──────────────────────────── ② NORMALISE (Python) ────────────────────────────┐
│ canonical schema · tri-coded time (event/publish/ingest) · units · currency   │
│ source tier · dedupe by checksum · language detect                            │
└──────────────┬───────────────────────────────────────────────────────────────┘
               ▼
┌──────────────────────────── ③ RESOLVE (Python) ──────────────────────────────┐
│ alias dictionary (Redis) → fuzzy → LLM fallback (Haiku, cached by text hash)  │
│ writes entity links; unresolved → OPS queue                                   │
│ TARGET ≥97% precision on NSE-500 + S&P-500                                    │
└──────────────┬───────────────────────────────────────────────────────────────┘
               ▼
┌──────────────────────────── ④ CLUSTER (Python) ──────────────────────────────┐
│ embed (small model, batched) → pgvector ANN within time window → cluster      │
│ assign/extend story_id · pick canonical · compute stance spread               │
└──────────────┬───────────────────────────────────────────────────────────────┘
               ▼
┌──────────────────────────── ⑤ CLASSIFY (Python + LLM) ───────────────────────┐
│ rules first (templated macro prints, exchange files = deterministic parsers)  │
│ LLM only for unstructured text · strict JSON schema · taxonomy v{n}           │
│ consensus join → surprise z · novelty · certainty                             │
│ MODEL ROUTING: Haiku 5.5 bulk tagging → Opus 5 for high-impact/ambiguous      │
└──────────────┬───────────────────────────────────────────────────────────────┘
               ▼
┌──────────────────────────── ⑥ SCORE — Impact Engine (Python) ────────────────┐
│  ┌ context vector builder ─ event features + market regime features ┐         │
│  │ ANALOG RETRIEVAL   → vector store (pgvector/Qdrant) over corpus  │         │
│  │ STATISTICAL        → event-study abnormal returns + GARCH        │         │
│  │ LEARNED            → GBDT (Phase 5+, only if it beats baseline)  │         │
│  └ ensemble + calibration layer + PUBLICATION GATE ─────────────────┘         │
│  gate: n_analogs ≥ 12 AND class calibration within tolerance                  │
└──────────────┬───────────────────────────────────────────────────────────────┘
               ▼
┌──────────────────────────── ⑦ PUBLISH ───────────────────────────────────────┐
│ risk rules → REVIEW QUEUE (impact>X or conf<Y or tier=T4) → human approve     │
│ → write to Postgres → invalidate cache → fan out:                             │
│   • SSE/WS gateway → open clients      • ISR revalidate → Next.js             │
│   • alert matcher → delivery workers   • search index → Typesense/ES          │
│   • OG image generation                • API/webhook fan-out                  │
└──────────────┬───────────────────────────────────────────────────────────────┘
               ▼
┌──────────────────────────── ⑧ SETTLE (scheduled, Temporal) ──────────────────┐
│ at each horizon: join impact → realised prices → abnormal return →            │
│ hit/miss · band coverage · write outcome · update ledger · feed retraining    │
│ APPEND-ONLY. No delete path exists in the schema or the code.                 │
└──────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────── SERVING LAYER ────────────────────────────────────────┐
│ Next.js (App Router, RSC) ── BFF/tRPC ── API gateway (Fastify) ── Redis cache │
│ SSE/WebSocket gateway · CDN (Cloudflare) · ISR for SEO surfaces               │
└──────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────── DATA STORES ──────────────────────────────────────────┐
│ Postgres     core relational: signals, stories, events, impacts, outcomes,    │
│              users, watchlists, alerts, ledger                                │
│ + pgvector   embeddings for clustering + analog retrieval                     │
│ TimescaleDB  OHLCV, ticks, OI, IV, flows (hypertables, compression)           │
│  or ClickHouse if tick volume demands it (ADR-005)                           │
│ Redis        hot cache, alias dictionary, rate limits, dedupe windows, locks  │
│ Object store raw signals (immutable), transcripts, generated images           │
│ Typesense/ES full-text search                                                 │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. The five architectural commitments

### C1 — Raw is immutable; everything else is derived and replayable
Every Signal is written to object storage before processing. Reprocessing is a **bus replay
over raw storage**. This gives us: model upgrades without re-fetching, bug fixes applied
retroactively, point-in-time reconstruction of what we believed on any date, and a corpus
that survives every refactor. *Non-negotiable.*

### C2 — Graceful degradation by design
```
Impact Engine down  → stories still publish, without Impacts
Price feed down     → analytics show last good value + StalenessBadge
LLM provider down   → rules-based classification continues for structured sources
                      (macro prints, exchange files) — these are the highest-value items anyway
Cluster service down→ items publish unclustered with a "grouping delayed" note
Postgres primary down→ read replicas serve; writes queue on the bus and drain
```
**No single subsystem can cause a total outage.** Tested quarterly with game days.

### C3 — Point-in-time correctness is enforced, not remembered
Every query used for training or backtesting goes through a PIT-safe data access layer that
filters on `ingest_time ≤ as_of`. Index membership, consensus figures and fundamentals are
all stored as slowly-changing dimensions with validity ranges. **Direct table access from
model code is blocked in CI.** Look-ahead bias is the most common way products like this
quietly lie, and it is an architectural problem, not a discipline problem.

### C4 — Cost is a design constraint, tracked per stage
LLM inference at 20k signals/day will dominate the bill if done naively.
- **Cluster-level inference**: classify a *story* once, not 40 articles.
- **Model routing**: deterministic parsers → Haiku 5.5 → Opus 5, in that order. ~85% of
  volume should never reach the expensive tier.
- **Cache by content hash** on every LLM call; prompt caching for shared system prompts.
- **Batch embeddings**; small embedding models.
- Per-stage cost is a first-class metric (FR-M10-06) with alerts.

### C5 — Entitlements at the data layer
Tier checks live in the API/serialiser, not the UI. Market-data latency class is attached to
every price-bearing field and **filtered per the user's entitlement and the source's licence**
(Gate G1). A field the licence forbids redistributing cannot leave the serialiser, regardless
of caller.

---

## 4. Latency budget (p95, wire → user's screen)

| Stage | Budget |
|---|---|
| Source → ingest persisted | 2s |
| Normalise + resolve | 1s |
| Cluster | 2s |
| Classify (LLM path) | 8s |
| Score (analog retrieval) | 3s |
| Review queue *(only if triggered)* | +240s |
| Publish + cache invalidation | 1s |
| Push to open client | 3s |
| **Total, unreviewed path** | **≈20s** (budget 45s) |

Structured sources (macro prints, exchange files) bypass the LLM path entirely:
**target ≤ 8s end to end.**

---

## 5. Scaling plan

| Stage | Users | Shape |
|---|---|---|
| **Phase 1–3** | <5k | Single region (ap-south-1 / Mumbai). Managed Postgres + Redis. Workers on one box. Vercel for web. Monolith-ish services. |
| **Phase 4–5** | <50k | Read replicas. Bus → managed Redpanda. Workers autoscale per stage. CDN caching aggressive. Timescale separated. |
| **Phase 6–7** | 500k+ | Multi-region read (Mumbai primary, Singapore/Virginia read). ClickHouse for ticks. Dedicated SSE fleet. Tiered storage. |

**Why Mumbai primary:** P0 users are in India; the 07:30 and 09:15 traffic spikes are Indian;
exchange data sources are Indian. Global read replicas serve P1 later. This is a deliberate
inversion of the usual "us-east-1 by default."

---

## 6. Predictable load spikes (design for these explicitly)
| Spike | Pattern |
|---|---|
| 07:25–07:45 IST | Bridge push → **the single largest spike of the day**. Pre-generate and cache the Bridge at 07:28; serve from CDN. |
| 09:10–09:25 IST | Market open |
| 15:25–15:35 IST | Close |
| 18:30 / 19:00 IST | US data + open |
| Fed/RBI decision days | 10–20x news volume for ~30 min |
| Weekly expiry (Tue/Thu) | 3–5x derivatives analytics load |
| Union Budget day (Feb 1) | **50x+ on everything.** Treat as an annual load-test target. |

---

## 7. Security architecture
Perimeter: Cloudflare (WAF, DDoS, bot management, rate limiting). Zero trust between
services (mTLS or signed service tokens). Secrets in a manager, never in env files or
images. Least-privilege DB roles per service — the ingest worker cannot read `users`.
Audit log on every console action. MFA + RBAC on the console. No production data in dev;
synthetic fixtures only. Dependency and container scanning in CI. Details in
[`../08-ops/security-privacy.md`](../08-ops/security-privacy.md).
