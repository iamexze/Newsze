# ADR-009 — Append-only ledger with no delete path

**Status:** Accepted · **Date:** 2026-11-12 · *The most important ADR in this repo.*

## Context
Moat 2 is the public Accuracy Ledger. Its entire value rests on one claim: **we cannot have
removed the embarrassing entries.** If that claim is not structurally guaranteed, the Ledger
is marketing, and a competitor can say so.

## Options
1. **Soft delete with an audit log** — standard practice; still means someone *can* hide an
   entry, and we would be asking users to trust the audit log.
2. **Append-only with no delete capability** — the capability does not exist in the schema,
   the API, or the console.
3. **External notarisation / blockchain anchoring** — strongest possible proof; disproportionate
   complexity for the current stage.

## Decision
**Option 2, enforced at four layers:**
1. **Database** — no DELETE grant on `impacts`, `outcomes`, `ledger_entries` for any
   application role; CI rejects any migration adding a destructive path to those tables.
2. **API** — no delete endpoint exists.
3. **Console** — no UI affordance exists; the only actions are *withdraw* (append-only, public,
   reason required) and *suppress class* (public, itself logged on the Ledger).
4. **Published** — withdrawals and suppressions are displayed on `/track-record`, not hidden.

A withdrawn impact remains in the record with `counted = false` **and its reason shown**.

## Consequences
**Positive:** the trust claim is structural, not a promise. We can state plainly that no
mechanism exists to hide a call, and invite audit.
**Negative:** we will publicly carry our mistakes forever. Bad calls will be visible to
prospects and press. **This is the intended cost.** It is what makes the good record
believable, and no incumbent will follow us into it.
**Operational:** genuine data errors (e.g. an entity mis-resolution) are handled by
withdrawal + recomputation + a public correction — never by deletion.
**Revisit trigger:** external notarisation if a credible accusation of tampering is ever made.
