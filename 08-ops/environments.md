# Environments

**Status:** Draft v1 · **Date:** 2026-11-12

---

## 1. The four environments

| | **local** | **dev** | **staging** | **production** |
|---|---|---|---|---|
| Purpose | Individual development | Shared integration | Pre-prod rehearsal | Live |
| Web URL | `localhost:3000` | `dev.newze.internal` | `staging.newze.com` | `newze.com` |
| API | `localhost:4000` | `api.dev.newze.internal` | `api.staging.newze.com` | `api.newze.com` |
| Console | `localhost:3001` | `console.dev…` | `console.staging…` | `console.newze.com` |
| Region | — | ap-south-1 | ap-south-1 | **ap-south-1 (Mumbai)** + global read later |
| Postgres | Docker | Neon branch | Neon (prod-sized) | Neon/RDS, HA, PITR |
| Timescale | Docker | shared small | prod-shaped | dedicated |
| Redis | Docker | shared | dedicated | clustered |
| Bus | Redpanda (Docker) | shared cluster | dedicated | dedicated, 3 brokers |
| Object store | MinIO | R2 bucket `dev-` | R2 `staging-` | R2 `prod-` |
| **Data sources** | **Recorded fixtures** | 5 live free sources + fixtures | **Full live sources, EOD only** | Full live sources |
| **Data content** | Synthetic | Synthetic + public | **Anonymised/derived, no PII** | Real |
| LLM | Mocked by default | Haiku only, low quota | Real routing, capped spend | Full |
| Payments | Mocked | Razorpay/Stripe test | test mode | live |
| Alerts/email | Logged to console | Mailpit | Sent to staff only | Real |
| Auth | Dev bypass + seeded users | Real flow, test accounts | Real flow | Real + MFA |
| Deploys | — | on merge to `main` | on merge to `main` | **manual promote** |
| Access | Developer | Team | Team | Break-glass + audited |

---

## 2. Hard rules

1. 🔴 **No production PII leaves production.** Ever. Staging uses synthetic users. Debugging a
   user issue happens through the console with a logged, reason-coded access — never by
   copying a database.
2. 🔴 **No real-time licensed market data in dev or staging** unless the licence explicitly
   covers non-production use. Most do not. Fixtures and EOD only. *(Gate G1 — a licence
   breach in staging is still a licence breach.)*
3. **Production is never modified by hand.** Changes go through code, migration, or the
   console. No `psql` on prod outside a break-glass incident, which is logged and reviewed.
4. **Every environment is created by Terraform.** If it isn't in IaC, it doesn't exist.
5. **Secrets never live in a repo, a `.env` committed anywhere, or a CI log.** Secret manager
   only; CI injects at runtime; rotation quarterly and on any staff departure.
6. **Staging runs the full pipeline continuously** — ingesting real public sources. It is the
   rehearsal stage for the Bridge, which must be proven on 20 consecutive mornings before
   launch.

---

## 3. Local setup
```bash
git clone … && cd newze
pnpm install
cp .env.example .env.local          # points at Docker services; no real credentials
docker compose up -d                # postgres+timescale+pgvector, redis, redpanda, minio, typesense
pnpm db:migrate && pnpm db:seed     # synthetic entities, instruments, 30 days of fixture signals
pnpm dev                            # web :3000, api :4000, console :3001
pnpm pipeline:replay --days 7       # replay fixtures through all 8 stages
```
**The fixture corpus is a first-class artifact**: ~2,000 signals spanning every source kind,
every event family, and the awkward cases (rumour→denial, corrections, mis-resolved
entities, thin-analog suppression). It is versioned in the repo and is what the test suite
runs against.

---

## 4. Configuration
Three layers: **IaC** (Terraform, infrastructure) → **env vars** (per-environment, from the
secret manager) → **database config** (the `sources` registry, feature flags, model versions,
publication-gate thresholds).

> **Deliberate choice:** anything an operator might need to change at 09:14 IST on a Tuesday
> lives in the **database**, not in env vars — because changing it must not require a deploy.
> That includes source enablement, gate thresholds, alert caps and the kill switch.

## 5. Feature flags
PostHog. Kinds: release (trunk-based, incomplete work dark), ops (kill switches for
subsystems), experiment, and permission (tier gating — *though entitlements are enforced at
the serialiser, never only by a flag*). Flags are cleaned up within 2 sprints of full
rollout; a stale-flag report runs weekly.

## 6. Domains & mail
`newze.com` (web) · `api.newze.com` · `console.newze.com` (IP-allowlisted + MFA) ·
`status.newze.com` · `cdn.newze.com`. Separate mail subdomains for transactional
(`mail.newze.com`) and marketing (`news.newze.com`) with their own SPF/DKIM/DMARC, so a
marketing deliverability problem can never take down the 07:30 digest.
