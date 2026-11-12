# Multi-Tenancy Model

**Status:** Draft v1 · **Date:** 2026-11-12

---

## 1. What is and isn't tenant data

Newze is **not** a classic SaaS where each tenant has its own data. The expensive 95% —
signals, stories, events, impacts, outcomes, prices, the ledger — is **shared global
content**, identical for every customer. Only the thin personal layer is tenant-scoped.

```
┌──────────────────── SHARED GLOBAL CONTENT (single copy) ────────────────────┐
│ sources · signals · stories · events · impacts · outcomes · ledger_entries  │
│ entities · instruments · prices · OI · flows · macro · market_states        │
│ ► read-only for every customer · no tenant column · cached aggressively     │
│ ► differentiated only by ENTITLEMENT (what you may see) and                 │
│   LATENCY CLASS (how fresh the version you may see is)                      │
└─────────────────────────────────────────────────────────────────────────────┘
┌──────────────────── TENANT-SCOPED DATA (per user / org) ────────────────────┐
│ users · organisations · watchlists · alert_rules · alert_deliveries         │
│ saved_views · subscriptions · api_keys · usage_counters · preferences       │
│ ► row-level isolation on org_id / user_id                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Consequence:** we get SaaS economics (one pipeline serves everyone; marginal cost per user
is serving cost only) with a much smaller isolation surface than a typical B2B SaaS. This
is a significant structural advantage and should be protected — never let a feature require
per-tenant content processing.

---

## 2. Isolation model: shared database, row-level security

| Tier | Approach | Why |
|---|---|---|
| Free / Pro (individuals) | Shared DB, shared schema, RLS on `user_id` | Millions of small rows; anything else is waste |
| Terminal (orgs) | Shared DB, shared schema, RLS on `org_id` | Team sharing of watchlists/views requires org scoping |
| API Business | Shared DB + per-org API keys, quotas, usage attribution | |
| Enterprise / white-label *(Phase 7, if demanded)* | Dedicated schema or dedicated cluster | Only if contractually required — **do not build speculatively** |

### Postgres RLS
```sql
ALTER TABLE watchlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY watchlist_tenant_isolation ON watchlists
  USING (
    user_id = current_setting('app.user_id')::uuid
    OR (is_shared AND org_id = current_setting('app.org_id')::uuid)
  );
```
Every request sets `app.user_id` / `app.org_id` / `app.tier` in a transaction-scoped
`SET LOCAL` at the connection-pool boundary. **The application role has no BYPASSRLS.**
Only migration and `system` roles do.

---

## 3. Entitlement, not isolation, is the hard part

Because content is shared, the real risk is not "tenant A reads tenant B's data" — it's
**"a Free user receives real-time licensed data they aren't entitled to."** That is a
licensing breach (Gate G1), which is a far more expensive failure than a privacy leak.

**Defence in depth:**
1. **Serialiser-level field filtering.** Every price-bearing DTO passes through a filter
   taking `(user_tier, source.redistributable, source.latency_class)`. A field the tier
   isn't entitled to is **removed from the payload**, not hidden in the UI.
2. **Separate cache keys per entitlement class.** `cache:ohlcv:NSE:HDFCBANK:eod` vs
   `:realtime`. **A cache key that omits the entitlement class is a critical bug** — it is
   the single most likely way this fails in production, via a CDN or Redis hit crossing tiers.
3. **CDN segmentation.** Anonymous/EOD content is CDN-cacheable; entitled content is
   `private, no-store` and never touches a shared edge cache.
4. **API serialiser tests** asserting that every tier's response contains only permitted fields.
5. **Quarterly licence audit**: for each source, what we display, to whom, at what latency,
   under which clause.

---

## 4. Usage metering & quotas
Counters in Redis keyed `usage:{org|user}:{metric}:{period}`, flushed to Postgres hourly.
Metrics: impact card views, analog queries, Ask questions, API calls, exports. Limits
resolved as `max(org_limit, user_limit)`. Breach → HTTP 402 with a machine-readable
upgrade hint, never a silent truncation.

---

## 5. Data residency
Primary region **ap-south-1 (Mumbai)**. Indian user PII stays in India (DPDP-aligned, and
simpler if the regulator tightens localisation). Global read replicas carry **content only,
never PII**. EU users: standard contractual clauses + a documented transfer basis before any
EU marketing push.

---

## 6. Deletion & export
- Self-serve export: all tenant-scoped rows as JSON + CSV, generated async, delivered as a signed URL (24h TTL).
- Self-serve delete: soft-delete immediately, hard purge within 30 days, including backups beyond the backup retention window.
- **Shared content is never deleted** by a user deletion — nothing in the global corpus is personal data.
- Legal hold flag blocks purge and is settable only by `staff_admin` / `staff_compliance`, with an audit entry.
