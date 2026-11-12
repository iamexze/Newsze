# ADR-005 — TimescaleDB now, ClickHouse later if needed

**Status:** Accepted · **Date:** 2026-11-12

## Context
We store OHLCV across multiple intervals, open interest, option chains, IV metrics, flows
and macro series — plus, eventually, ticks. Query patterns are heavily time-bucketed and
instrument-scoped, and the Impact Engine joins market data to relational event data
constantly.

## Options
1. **Plain Postgres with partitioning** — one system, but compression and time-bucket
   ergonomics are hand-rolled.
2. **TimescaleDB** — a Postgres extension: hypertables, native compression, continuous
   aggregates, **and joins directly against our relational tables.**
3. **ClickHouse** — far faster on huge analytical scans; a separate system; cross-store joins
   must happen in application code.
4. **InfluxDB / QuestDB** — good at ingest, weaker relational integration.

## Decision
**TimescaleDB** at launch. Revisit ClickHouse when (a) tick-level data is licensed and
stored, or (b) analytical query p95 exceeds 2s on representative dashboards.

## Consequences
**Positive:** one database dialect, one backup strategy, one connection pool; joining prices
to events is plain SQL, which the Impact Engine does constantly.
**Negative:** TimescaleDB will not match ClickHouse on multi-billion-row scans; a later
migration for the tick tables is probable and should be planned for, not resisted.
**Deliberate:** the OHLCV/OI tables are written as hypertables with a clean interface so that
moving only the tick-scale tables later does not disturb the rest.
