# Tech Stack

**Status:** Draft v1 · **Date:** 2026-11-12
Each choice carries its *reason* and its *reversal cost*. High-reversal-cost choices have ADRs.

---

## Frontend
| Concern | Choice | Why | Reversal cost |
|---|---|---|---|
| Framework | **Next.js 15 (App Router, RSC)** | SEO is existential for a news product; ISR gives <60s index freshness; RSC keeps data-heavy pages light on the client | High — [ADR-001](adr/001-nextjs-app-router.md) |
| Language | **TypeScript (strict)** | Financial data shapes must be compile-time safe | Low |
| Styling | **Tailwind + CSS custom properties for tokens** | Token-driven theming for light/dark; fast iteration | Low |
| Components | **shadcn/ui (owned, not imported)** + custom data primitives | We own the code; data components (`DataValue`, `ConeChart`) are bespoke anyway | Low |
| Charts | **lightweight-charts** (price/time) + **visx** (everything else) | Lightweight-charts is purpose-built for financial series and tiny; visx composes for bespoke viz | Medium — [ADR-007](adr/007-charting.md) |
| State | **TanStack Query** + Zustand for UI state | Server state ≠ client state; Query handles the realtime-invalidate pattern well | Low |
| Realtime | **SSE** primary, WebSocket where bidirectional | SSE survives proxies, auto-reconnects, is simpler, and our feed is one-directional | Medium — [ADR-006](adr/006-realtime-transport.md) |
| Mobile | **PWA first**, native in Phase 7 (Expo/RN) | 90% of value is content; PWA ships 6 months earlier. Push on iOS PWA is now viable | Medium |

## Backend
| Concern | Choice | Why |
|---|---|---|
| API gateway / BFF | **Node + Fastify** (+ tRPC for the web client) | Type sharing with the frontend; fast; the team's primary language |
| Pipeline & ML services | **Python 3.13 + FastAPI** | The entire quant/ML/NLP ecosystem is Python. Non-negotiable for stages ③–⑥, ⑧ |
| Orchestration | **Temporal** | Durable, replayable workflows with retries — exactly the semantics the settle/backfill jobs need. Cron + a queue would reinvent it badly — [ADR-003](adr/003-orchestration.md) |
| Event bus | **Redpanda** (Kafka API) | Kafka semantics without Kafka ops; replay is a core architectural commitment (C1) — [ADR-002](adr/002-event-bus.md) |
| Light queues | **Redis + BullMQ** | For short-lived fan-out work that doesn't need durability |

## Data
| Store | Choice | Holds |
|---|---|---|
| Primary | **Postgres 17** (Neon or RDS) | signals, stories, events, impacts, outcomes, users, watchlists, alerts, ledger |
| Vectors | **pgvector**, → Qdrant if scale demands | clustering + analog retrieval embeddings — [ADR-005](adr/005-timeseries-store.md) |
| Time series | **TimescaleDB** → ClickHouse at tick scale | OHLCV, OI, IV, flows |
| Cache | **Redis** | hot reads, alias dict, dedupe windows, rate limits |
| Object store | **Cloudflare R2** | raw immutable signals, transcripts, generated images. R2 for zero egress fees |
| Search | **Typesense** → Elasticsearch if needed | full-text + faceted search |

## AI / ML
| Concern | Choice | Why |
|---|---|---|
| Classification, extraction, summarisation | **Claude Haiku 5.5** for bulk, **Claude Opus 5** for high-impact/ambiguous | Tiered routing is the core cost lever (C4). Opus for anything a human will scrutinise |
| Structured output | Strict JSON schemas + validation + repair loop | Schema is the contract; no free-text parsing |
| Embeddings | Small open model, self-hosted, batched | Volume makes API embeddings expensive; quality requirement is modest |
| Quant modelling | numpy / pandas / polars / statsmodels / arch (GARCH) / scikit-learn / LightGBM | Standard, auditable, no exotic dependencies |
| Vector search | pgvector (HNSW) | Co-located with relational data; one less system |
| Experiment tracking | MLflow (self-hosted) | Model versions must be auditable — the Ledger depends on it |

> **Rule:** the LLM never produces a number that goes into an Impact. LLMs classify, extract
> and summarise. **All quantitative output comes from deterministic statistical code.** This
> is the line that keeps the Accuracy Ledger meaningful and is enforced by code review.

## Infrastructure
| Concern | Choice | Why |
|---|---|---|
| Web hosting | **Vercel** (Phase 1–4) → self-hosted Next on AWS/Fly if economics demand | Speed to ship; ISR is first-class |
| Services | **Fly.io** or **AWS ECS Fargate**, **ap-south-1 (Mumbai) primary** | Latency to Indian users and Indian data sources |
| CDN / edge | **Cloudflare** | WAF, DDoS, bot management, R2 egress synergy |
| IaC | **Terraform** | Reproducible environments |
| CI/CD | **GitHub Actions** | Standard; gates for lint, types, tests, web vitals, advice-language check |
| Containers | Docker + distroless base images | |
| Observability | **OpenTelemetry** → Grafana Cloud (traces/metrics/logs) + **Sentry** | One trace per pipeline run across all 8 stages (NFR-OBS-01) |
| Feature flags | **PostHog** or Unleash | Also our product analytics |
| Payments | **Razorpay** (INR/UPI) + **Stripe** (intl) | UPI is non-negotiable for Indian conversion |
| Email | **Resend** or SES | Digests at 07:30 are a core delivery channel |
| Push | Web Push (VAPID) → FCM/APNs with native apps | |

## Developer experience
pnpm workspaces monorepo (apps/web, apps/api, services/*, packages/shared-types) ·
**shared type generation from the DB schema and the event taxonomy — one source of truth
from Postgres → Python → TypeScript** · Biome/ESLint + Ruff · Vitest + Playwright +
pytest · Storybook for the data primitives · preview deploys per PR.

---

## Explicitly rejected (with reasons, so they don't get re-litigated)

| Rejected | Why |
|---|---|
| **A headless CMS (Strapi/Sanity/Contentful)** | We are structured-first (Moat 4). A CMS would force prose-first and quietly destroy the architecture. The one thing every incumbent did wrong. |
| **MongoDB as primary** | Our data is deeply relational (events↔instruments↔impacts↔outcomes) and we need transactional integrity on the ledger. |
| **Microservices from day one** | 3–6 engineers. Modular monolith + a few Python workers. Split along the pipeline-stage seams later, which are already drawn. |
| **Building our own charting library** | Zero differentiation, enormous cost. |
| **Kubernetes at launch** | Operational overhead with no payoff below ~50k users. |
| **GraphQL for the public API** | REST + webhooks + SSE is what B2B data consumers actually want. tRPC covers internal needs. |
| **A pure-LLM "AI analyst"** | Non-reproducible, non-auditable, cannot be calibrated — therefore incompatible with the Accuracy Ledger, which is the moat. |
| **Scraping exchange sites for real-time prices** | Illegal/licence-violating (Gate G1) and a single point of catastrophic failure. |
