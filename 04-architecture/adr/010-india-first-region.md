# ADR-010 — ap-south-1 (Mumbai) as the primary region

**Status:** Accepted · **Date:** 2026-11-12

## Context
Default instinct is `us-east-1`. Our P0 users, our highest-value data sources, our traffic
spikes and our regulatory exposure are all Indian.

## Decision
**ap-south-1 (Mumbai) is the primary region** for compute, primary database and object
storage. Global read replicas (Singapore, Virginia) are added in Phase 7 for P1 users and
**carry content only, never PII**.

## Rationale
- **Latency where it counts:** the 07:30 Bridge spike and the 09:10–09:25 open spike are
  entirely Indian traffic. Serving them from Virginia adds ~200ms to the most important
  10 minutes of our day.
- **Data-source proximity:** NSE/BSE feeds and files originate in India; ingestion latency is
  part of our 45s budget.
- **Regulatory simplicity:** DPDP alignment and any future localisation requirement are
  satisfied by default rather than by migration.
- **Cost:** egress to Indian users is cheaper from within India.

## Consequences
**Positive:** the critical path is fastest for the users who define the product; compliance
posture is simple.
**Negative:** global users see higher latency until read replicas land (acceptable — P1 users
read in 20-minute blocks, not in a 10-minute pre-open window); a slightly smaller managed-service
menu than us-east-1; some vendors price ap-south-1 higher.
**Explicitly rejected:** multi-region active-active at launch. Operational complexity with no
user benefit at our scale.
