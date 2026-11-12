# ADR-003 — Temporal for durable workflow orchestration

**Status:** Accepted · **Date:** 2026-11-12

## Context
Several processes are long-running, must survive restarts, and **must not silently skip**:
settlement at 15m/1h/1d/5d/20d horizons (a 20-day workflow), the daily Bridge publication,
the 15-year backfill, scheduled macro-release handling, and model-promotion canaries. Missing
a settlement silently corrupts the Accuracy Ledger — the one thing that must never be wrong.

## Options
1. **Cron + a job table** — familiar; every failure mode (partial execution, retry storms,
   lost state after a deploy) must be hand-built, and will be built badly.
2. **Celery / BullMQ** — good task queues, no durable multi-day workflow semantics.
3. **Airflow / Dagster** — built for batch DAGs, awkward for event-triggered per-entity workflows.
4. **Temporal** — durable execution: workflow state survives process death; retries, timers
   and compensation are primitives.

## Decision
**Temporal** for: settlement workflows, the Bridge daily workflow, backfill/replay, model
promotion, and digest delivery. BullMQ remains for short-lived fan-out work that does not
need durability.

## Consequences
**Positive:** a 20-day settlement timer is trivial and reliable; replay and backfill are
observable and resumable; deploys cannot drop in-flight work.
**Negative:** a significant new concept for the team; workflow code has determinism
constraints that surprise newcomers; Temporal Cloud is a vendor dependency (accepted — the
alternative is self-hosting a non-trivial cluster).
**Why this matters more than usual here:** ledger completeness is a trust guarantee. "We
missed some settlements during a deploy" is not a recoverable statement for this product.
