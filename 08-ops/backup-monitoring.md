# Backup, Monitoring & Incident Response

**Status:** Draft v1 · **Date:** 2026-11-12

---

## 1. Backup & recovery

| Data | Method | RPO | RTO | Retention | Restore tested |
|---|---|---|---|---|---|
| Postgres (core) | Continuous WAL + PITR, daily full | **5 min** | **1 h** | 35 days PITR, 12 monthly fulls | Monthly |
| TimescaleDB | Daily full + WAL; compressed chunks to R2 | 1 h | 4 h | 90 days + annual archive | Quarterly |
| **R2 raw signals** | Versioned bucket + cross-region replica | **0 (write-once)** | 2 h | **7 years** | Quarterly |
| Redis | Not backed up — **rebuildable by design** | n/a | 15 min | — | Every game day |
| Typesense | Rebuilt from Postgres | n/a | 2 h | — | Quarterly |
| Secrets | Secret-manager native versioning + offline escrow | 0 | 1 h | indefinite | Semi-annual |
| IaC + code | Git, mirrored to a second provider | 0 | 15 min | indefinite | — |

**The asymmetry that matters:** the **raw signal store is the irreplaceable asset.** Prices
can be re-bought; the corpus cannot be re-accumulated. It is write-once, versioned,
cross-region replicated, and has the longest retention of anything we hold. Everything
derived — stories, events, impacts, embeddings, search indexes — is **rebuildable by replay**.

> **Restore drills are scheduled, not aspirational.** A backup that has never been restored
> is a hypothesis. Each drill is logged with its measured RTO.

## 2. Monitoring

### Golden signals, per pipeline stage
Throughput (in/out), **lag** (queue depth + oldest unprocessed age), error rate, duration
p50/p95/p99, cost per 1k items.

### Business-critical monitors
| Monitor | Threshold | Severity |
|---|---|---|
| **Bridge not published by 07:35 IST** | any | **P1 — page immediately** |
| Source silent vs expected cadence | >3× cadence | P2 (P1 for any T0 exchange source) |
| End-to-end latency p95 | >60s for 10 min | P2 |
| Classification confidence distribution shift | >2σ from 7-day baseline | P2 — *the quiet failure mode: the model degrading without erroring* |
| Entity-resolution unresolved rate | >5% | P2 |
| Calibration breach on a published class | gate threshold | P1 — auto-suppress + notify |
| Impact settlement backlog | >200 unsettled past horizon | P2 |
| Payment failure rate | >10% / 1h | P1 |
| Alert delivery failure | >5% | P2 |
| LLM spend | >130% of daily budget | P2 |
| Market-data staleness during a session | >5 min | P1 |
| Error budget burn | >2× | P2 |

### Dashboards
**Pipeline** (stage-by-stage flow and lag) · **Quality** (precision, purity, accuracy,
calibration — the weekly report, live) · **Product** (WDS, Bridge opens, alert CTR) ·
**Cost** (per source, per model, per 1k events, per MAU) · **Business** (signups, revenue,
churn) · **Public `/status`** (per-source health, Bridge on-time record, uptime).

> `/status` is **public and honest**, including the Bridge's on-time record. A product whose
> moat is accountability cannot run a status page that hides outages.

## 3. SLOs & error budget
| Service | SLO |
|---|---|
| Web read surfaces | 99.9% monthly |
| **09:00–15:45 IST and 18:30–01:30 IST** | **99.95%** |
| API (paid tiers) | 99.9%, p95 <250ms |
| Bridge on-time (07:30 IST) | 99% over 30 days |
| Ingestion completeness | ≥99.5% of expected items/day |

Error budget exhausted → **feature work stops, reliability work starts.** Not a suggestion.

## 4. Alerting policy
P1 pages a human 24/7 (Bridge failure, prod down, data breach, payment outage, calibration
breach on a live class). P2 goes to Slack during working hours. P3 goes into the weekly
report. **Every alert must be actionable and must name its runbook** — an alert without a
runbook is deleted, not tolerated. Alert noise is reviewed monthly; a monitor that fires
without action twice is fixed or removed.

## 5. Incident response
**Severity:** SEV1 data loss / breach / prolonged outage / **publishing materially wrong
information at scale** · SEV2 major feature down or Bridge missed · SEV3 degraded ·
SEV4 cosmetic.

```
DETECT → ACK (5m SEV1) → ASSESS → MITIGATE (kill switch / rollback / flag) →
COMMUNICATE (status page within 15m for SEV1/2) → RESOLVE → BLAMELESS POSTMORTEM (72h)
```

**The content-specific incident:** publishing something materially wrong is a **SEV1 even if
every system is healthy.** Response: kill switch → public withdrawal notice with a reason →
push a correction to everyone alerted on the original → recompute and re-settle affected
impacts → record it on the Ledger. **This path is drilled before launch, not discovered
during an incident.**

## 6. Runbooks (to be written in Phase 1, one per monitor)
`bridge-failed-to-publish` · `source-silent` · `pipeline-lag` · `llm-provider-outage` ·
`market-data-stale` · `calibration-breach` · `wrong-information-published` ·
`entity-misresolution` · `payment-outage` · `db-failover` · `bus-backlog` ·
`cache-entitlement-leak` 🔴 · `restore-from-backup` · `break-glass-prod-access`.

## 7. Game days (quarterly)
Kill a subsystem in staging and verify graceful degradation (commitment C2): Impact Engine
down → stories still publish · LLM down → rules-based classification continues · price feed
down → staleness badges appear · Postgres failover · bus backlog + drain · **full restore
from backup, timed**. Each game day produces a written result and at least one fix.
