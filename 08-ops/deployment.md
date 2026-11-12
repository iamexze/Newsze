# Deployment & CI/CD

**Status:** Draft v1 · **Date:** 2026-11-12

---

## 1. Branching
Trunk-based. `main` is always releasable. Short-lived branches (<2 days), squash-merged.
Incomplete work hides behind release flags. No long-running release branches.

## 2. The pipeline

```
PR opened
   ├─ lint (Biome/ESLint + Ruff)                      ~40s
   ├─ typecheck (tsc --strict, mypy)                  ~60s
   ├─ unit tests (Vitest, pytest)                     ~3m
   ├─ 🔴 COMPLIANCE GATES                             ~30s
   │    ├─ advice-language scan (deny-list over all generated + static strings)
   │    ├─ schema assertion: no action/recommendation/target_price column
   │    ├─ licensing lint: no source body text in any render path; quote ≤200 chars
   │    └─ PIT lint: no direct table reads from model/backtest code
   ├─ migration check (up + down, against a prod-shaped snapshot)
   ├─ contract tests (API responses vs OpenAPI; per-tier field filtering)
   ├─ a11y tests (axe on key routes, both themes)
   ├─ web vitals budget (LCP/INP/CLS — **build fails on regression**)
   ├─ security scan (deps, containers, secrets)
   └─ preview deploy (ephemeral URL + seeded fixture data)
        ↓ review + approve
merge to main
   ├─ build + sign images → registry
   ├─ auto-deploy → dev          (full pipeline running on live free sources)
   ├─ auto-deploy → staging      (full pipeline, EOD data, real traffic shape)
   ├─ smoke tests + synthetic journeys on staging
   └─ ⏸ MANUAL PROMOTE → production
        ├─ migrations first (expand/contract, always backward-compatible)
        ├─ canary 5% → 25% → 100%, 10 min between steps
        ├─ auto-rollback on error-rate, latency, or pipeline-lag regression
        └─ post-deploy: smoke, Bridge dry-run, source-health check
```

## 3. Deployment windows 🔴

| Window (IST) | Rule |
|---|---|
| **07:00–09:30** | 🚫 **Frozen.** The Bridge publishes at 07:30 and the market opens at 09:15. Nothing deploys. |
| 09:30–15:45 | ⚠️ Emergency fixes only, with a second approver |
| 15:45–18:00 | ✅ Normal window |
| 18:00–01:30 | ⚠️ US session active — avoid pipeline changes |
| 01:30–07:00 | ✅ Best window for risky changes |
| **Expiry days (Tue/Thu)** | ⚠️ Derivatives services frozen 09:00–15:45 |
| **Union Budget day (Feb 1)** | 🚫 **Full freeze.** Highest-traffic day of the Indian market year |
| Fri after 18:00 | ⚠️ No non-critical production deploys into a weekend |

## 4. Migrations
Expand/contract only — every migration is backward-compatible with the previous app version.
Add column → backfill async → start writing → start reading → drop old (next release).
**Never** a destructive migration in the same deploy as the code that needs it.
Append-only tables (`signals`, `outcomes`, `ledger_entries`) have no destructive migration
path at all — enforced by a CI check on migration files.

## 5. Rollback
| Layer | Mechanism | Target |
|---|---|---|
| Web | Redeploy previous build (Vercel instant rollback) | <2 min |
| Services | Previous image tag | <5 min |
| Config | Revert DB config / flip the flag | <30s |
| **Model version** | Flip `active_model_version` in config — **no deploy** | <30s |
| Migration | Contract step reverted; data migrations are forward-only + compensating | varies |
| **Kill switch** | Console, any time, by editor or compliance | instant |

> **Model rollback is a config change, not a deploy.** This is deliberate: a mis-calibrated
> model must be stoppable in seconds by someone who is not an engineer.

## 6. Release checklist (production promote)
- [ ] Staging green ≥2h, including one full pipeline cycle
- [ ] Migrations tested forward and backward on a prod-shaped snapshot
- [ ] Compliance gates passed
- [ ] Deploy window respected
- [ ] Rollback plan written in the PR
- [ ] Runbook updated if operational behaviour changed
- [ ] Someone is actually watching dashboards for 30 min post-deploy

## 7. Special pipelines
**Model promotion** — requires two approvers (analyst + engineer), ≥90 days shadow data,
calibration report attached, canary on 10% of event classes for 7 days, auto-revert on
calibration breach.
**Backfill/replay** — run as a Temporal workflow against a shadow table, diffed against
current output, promoted only after review. **Never replays directly over production
published data.**
**Taxonomy change** — version bump, never in-place edit; golden-set additions (≥20 labelled
examples per new type) required before a new type may publish.
