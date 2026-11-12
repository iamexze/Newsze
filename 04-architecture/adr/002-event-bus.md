# ADR-002 — Redpanda (Kafka API) as the event bus

**Status:** Accepted · **Date:** 2026-11-12

## Context
Architectural commitment C1 requires that **reprocessing is a replay over raw storage**. We
need ordered, durable, replayable streams between the 8 pipeline stages, with the ability to
re-run history through a new model version without re-fetching from sources.

## Options
1. **Postgres as a queue** (`SELECT … FOR UPDATE SKIP LOCKED`) — simplest, no new system; but
   replay and fan-out to multiple independent consumers are awkward, and it couples pipeline
   throughput to the primary database.
2. **Redis Streams** — fast and simple; weaker durability guarantees; retention management is manual.
3. **Kafka (MSK/Confluent)** — the standard; heavy to operate; costly at small scale.
4. **Redpanda** — Kafka API compatible, single binary, no ZooKeeper/JVM, far lighter to run.
5. **NATS JetStream** — excellent, but a different mental model and a smaller ecosystem for replay tooling.

## Decision
**Redpanda**, using the Kafka API. Topics per pipeline stage, keyed by entity for ordering,
7-day retention, DLQ per stage.

## Consequences
**Positive:** replay is a first-class operation; consumers scale independently; **the Kafka
API means we can move to any Kafka-compatible provider without rewriting consumers.**
**Negative:** one more stateful system; the team must learn partitioning and consumer-group
semantics.
**Deliberate accepted risk:** we start on Redpanda Cloud (managed) and would move to
self-hosted only if cost demands it. The Kafka API is the portability hedge.
