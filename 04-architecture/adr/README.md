# Architecture Decision Records

One file per decision that is **expensive to reverse**. Cheap, reversible choices don't get
an ADR — they get a line in [`../../decisions.md`](../../decisions.md).

**Format:** Context → Options → Decision → Consequences → Status.
**Status:** `Proposed` · `Accepted` · `Superseded by ADR-NNN` · `Deprecated`.
**Rule:** an ADR is never edited after acceptance. To change the decision, write a new ADR
that supersedes it. The record of what we believed and why is the point.

| # | Decision | Status |
|---|---|---|
| [001](001-nextjs-app-router.md) | Next.js App Router for the web application | Accepted |
| [002](002-event-bus.md) | Redpanda (Kafka API) as the event bus | Accepted |
| [003](003-orchestration.md) | Temporal for durable workflow orchestration | Accepted |
| [004](004-market-data-abstraction.md) | Latency class as a first-class data attribute | Accepted |
| [005](005-timeseries-store.md) | TimescaleDB now, ClickHouse later if needed | Accepted |
| [006](006-realtime-transport.md) | SSE as the primary realtime transport | Accepted |
| [007](007-charting.md) | lightweight-charts + visx, not a charting vendor | Accepted |
| [008](008-llm-routing.md) | Tiered LLM routing; no LLM-generated numbers | Accepted |
| [009](009-append-only-ledger.md) | Append-only ledger with no delete path | Accepted |
| [010](010-india-first-region.md) | ap-south-1 (Mumbai) as the primary region | Accepted |
