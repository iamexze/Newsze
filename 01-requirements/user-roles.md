# User Roles & Permissions Matrix

**Status:** Draft v1 · **Date:** 2026-11-12
Permissions are enforced **at the API/serialiser layer**, never only in the UI
(architectural commitment C5). A hidden button is not a permission.

---

## 1. Role taxonomy

### External roles (customers)
| Role | Code | Who | Billing |
|---|---|---|---|
| **Anonymous** | `anon` | Not signed in. SEO/landing traffic. | — |
| **Free** | `free` | Registered, no subscription | ₹0 |
| **Pro** | `pro` | Individual paying subscriber | ₹799/mo (see [quote](../09-client/quote.md)) |
| **Terminal** | `terminal` | Professional seat (analyst/RIA/family office) | ₹9,999/seat/mo |
| **API — Dev** | `api_dev` | Indie developer / evaluation | $49/mo |
| **API — Business** | `api_biz` | Broker / fintech integration | Contracted |
| **Org Admin** | `org_admin` | Manages seats + billing for a Terminal/API org | — |

### Internal roles (staff)
| Role | Code | Who |
|---|---|---|
| **Viewer** | `staff_viewer` | Read-only internal access (investors, advisors, new joiners) |
| **Editor** | `staff_editor` | Reviews the publish queue, approves/suppresses, triggers corrections |
| **Analyst** | `staff_analyst` | Editor + model evaluation, golden-set curation, taxonomy edits |
| **Engineer** | `staff_eng` | Pipeline operation, replay, source registry, deploys |
| **Admin** | `staff_admin` | User/billing administration, role assignment, legal holds |
| **Compliance Officer** | `staff_compliance` | Kill switch, withdrawal authority, audit-log access, disclaimer control |
| **System** | `system` | Automated pipeline identity (no human login) |

> **`staff_compliance` exists from day one, even if it's the founder wearing a second hat.**
> Separating the authority to withdraw from the authority to publish is both a safety
> control and a prerequisite if SEBI RA registration is ever pursued.

---

## 2. Customer permissions matrix

| Capability | anon | free | pro | terminal | api_dev | api_biz |
|---|:--:|:--:|:--:|:--:|:--:|:--:|
| Read live wire (EOD/delayed data) | ✅ | ✅ | ✅ | ✅ | — | — |
| Read story pages + timelines | ✅ | ✅ | ✅ | ✅ | — | — |
| View Impact Cards | 3/day | 6/day | ∞ | ∞ | — | — |
| View analogs (full list + fan chart) | ❌ | 1/day | ✅ | ✅ | — | — |
| **Overnight Bridge (today)** | ✅ | ✅ | ✅ | ✅ | — | — |
| Bridge archive (past dates) | 7d | 30d | ∞ | ∞ | — | — |
| **Accuracy Ledger (public)** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Ledger slicing/filtering | basic | basic | full | full | full | full |
| Global analytics — core | ✅ | ✅ | ✅ | ✅ | — | — |
| Global analytics — depth (regime, correlations, positioning) | ❌ | ❌ | ✅ | ✅ | — | — |
| India analytics — EOD | ✅ | ✅ | ✅ | ✅ | — | — |
| **India analytics — real-time** *(post Gate G1)* | ❌ | ❌ | ✅ | ✅ | — | — |
| Participant-wise OI, IV surface, rollover | ❌ | ❌ | ✅ | ✅ | — | — |
| Watchlists | ❌ | 1 (10 syms) | 10 (∞ syms) | ∞ | — | — |
| Alert rules | ❌ | 3 | 50 | ∞ | — | — |
| Alert channels | — | email | email, web push, WhatsApp | all | — | — |
| Digests | ❌ | daily 07:30 | all | all | — | — |
| Radar (impact-threshold filtering) | ❌ | ❌ | ✅ | ✅ | — | — |
| Search | basic | basic | semantic | semantic | — | — |
| Ask Newze (RAG Q&A) | ❌ | 3/day | 50/day | 300/day | — | — |
| Analog Engine query UI | ❌ | ❌ | 20/day | ∞ | — | — |
| Narrative Tracker | ❌ | ❌ | ✅ | ✅ | — | — |
| CSV / PDF export | ❌ | ❌ | ✅ | ✅ | — | — |
| Multi-pane workspace (Phase 7) | ❌ | ❌ | ❌ | ✅ | — | — |
| API — events + impacts (REST) | ❌ | ❌ | ❌ | ❌ | 10k/mo | contracted |
| API — webhooks | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| API — streaming (SSE/WS) | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| API — historical backfill | ❌ | ❌ | ❌ | ❌ | 1y | ∞ |
| **Redistribution of licensed price data** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ *(unless licence permits — per-field serialiser check)* |
| Self-serve data export + account delete | — | ✅ | ✅ | ✅ | ✅ | ✅ |

**Metering rules:** daily counters reset at 00:00 IST. A metered limit returns HTTP 402 with
a machine-readable upgrade hint, never a silent empty response. Anonymous counters are
cookie+IP based and deliberately generous — the top of the funnel is content.

---

## 3. Staff permissions matrix

| Capability | viewer | editor | analyst | engineer | admin | compliance |
|---|:--:|:--:|:--:|:--:|:--:|:--:|
| View all customer-facing content | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View pipeline monitor | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View internal (shadow-mode) ledger | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Approve / reject items in the review queue | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Edit a generated headline/summary pre-publish | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Issue a correction on published content | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ |
| **Withdraw a published Impact (kill switch)** | ❌ | ✅¹ | ✅¹ | ❌ | ❌ | ✅ |
| Suppress an entire event class | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Edit the event taxonomy | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Curate golden sets / fix entity resolution | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Promote a model version to production | ❌ | ❌ | ✅² | ✅² | ❌ | ❌ |
| Edit the source registry (add/remove sources) | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ |
| Replay the bus / reprocess history | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Deploy to production | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ |
| View customer PII | ❌ | ❌ | ❌ | ❌ | ✅ | ✅³ |
| Manage subscriptions / refunds | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Assign staff roles | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Read the audit log | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Place a legal hold on data | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |

¹ Any withdrawal is immediately visible to `staff_compliance` and published publicly.
² Promotion requires **two** distinct approvers (analyst + engineer). Enforced in CI, not by trust.
³ Compliance may access PII only under a logged, reason-coded request.

---

## 4. Hard invariants (true regardless of role)

| # | Invariant |
|---|---|
| I1 | **No role can delete a published Impact or its Outcome.** Only withdraw (append-only). There is no DELETE path in the schema or the API. |
| I2 | **No role can hide an individual entry from the Accuracy Ledger.** Only whole-class suppression, which is itself published. |
| I3 | **No role can edit a scored Outcome.** Outcomes are computed by `system` from market data and are immutable. |
| I4 | **No role can add an `action`/recommendation field** to any published payload — it does not exist in the schema. (Compliance boundary, [compliance.md](compliance.md).) |
| I5 | **No role can disable the disclaimer block** on Impact Cards, the Bridge, or digests. |
| I6 | **No human role has standing write access to production data stores.** Changes go through code, migrations, or the console — all audited. |
| I7 | **Every staff action is written to an append-only audit log** with actor, timestamp, before/after, and reason where required. |

---

## 5. Org / team model (Terminal + API tiers)

```
Organisation
 ├── org_admin (≥1, billing + seats)
 ├── members[] → each holds a customer role (terminal / api_*)
 ├── shared resources: watchlists, saved views, alert rules (optional sharing flag)
 └── entitlement = max(org entitlement, member entitlement)
```
Seat assignment, SSO (SAML/OIDC, Phase 7), usage attribution per member, and per-org API
keys with independent quotas. Tenant isolation detail in
[`../05-data-model/multi-tenancy.md`](../05-data-model/multi-tenancy.md).

---

## 6. Auth implementation notes
- Email OTP + Google OAuth; phone OTP for India (highest-conversion path for P0).
- Sessions: short-lived JWT access + rotating refresh token, httpOnly cookies, device list in account settings.
- **MFA mandatory for every staff role**; step-up re-auth for kill switch, role assignment, PII access and refunds.
- API auth: key + secret with per-key scopes and IP allowlisting on `api_biz`.
- Rate limits applied per role at the gateway, before application code.
