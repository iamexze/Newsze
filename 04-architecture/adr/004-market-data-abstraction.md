# ADR-004 — Latency class as a first-class data attribute

**Status:** Accepted · **Date:** 2026-11-12 · **Relates to:** Gate G1

## Context
Real-time exchange data requires a paid licence with specific display and redistribution
terms, and we will not know the terms or cost until Phase 0 closes Gate G1. We cannot block
all development on that answer, and we must never accidentally serve data to a user or a
tier that the licence does not permit.

## Options
1. **Wait for the licence** before building the data layer — blocks Phases 1–3 entirely.
2. **Build for real-time and downgrade later** — guarantees a licence breach during development.
3. **Build for EOD and retrofit real-time later** — a rewrite of every analytics surface.
4. **Make latency class an attribute of every price-bearing field**, with entitlement
   filtering at the serialiser.

## Decision
Option 4. Every market-data row carries `source_id` and `latency_class`
(`realtime | delayed_15m | eod`). Every price-bearing API field passes through a filter
taking `(user_tier, source.redistributable, source.latency_class)`. The UI renders a
`StalenessBadge` from the same attribute. **Upgrading from EOD to real-time is a
configuration change, not a rewrite.**

## Consequences
**Positive:** development proceeds immediately on EOD/free data; licence compliance is
structural rather than procedural; users always see how fresh their data is, which is also
an honesty win.
**Negative:** every data path carries an extra attribute; cache keys **must** include the
entitlement class — this is the single most likely way to leak entitled data, so it is
called out in [security-privacy.md](../../08-ops/security-privacy.md) and
[multi-tenancy.md](../../05-data-model/multi-tenancy.md).
**Non-negotiable:** a field whose source has `redistributable = false` never leaves the
serialiser, for any caller, at any tier.
