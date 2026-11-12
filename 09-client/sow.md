# Statement of Work — Newze

**Status:** Draft v1 — **not executed** · **Date:** 2026-11-12
**Parties:** `<Client / Entity>` ("Client") and `<Builder>` ("Builder")

> ⚠️ **Template, not a contract.** Every bracketed field needs filling, and the whole
> document needs review by qualified counsel before signature — particularly §7 (IP), §9
> (regulatory responsibilities) and §11 (liability), which are non-standard for this project
> because of its regulated subject matter.

---

## 1. Background
Client wishes to build **Newze**, a market-intelligence platform delivering global news,
global trading analytics and Indian trading analytics, with a quantified event-impact layer
and a public accuracy record. Scope is defined by the planning repository at
`<repo URL>` as of commit `<hash>`, specifically
[`01-requirements/prd.md`](../01-requirements/prd.md) and
[`01-requirements/scope.md`](../01-requirements/scope.md).

## 2. Scope of work
Phases M0–M6 as defined in [`07-planning/milestones.md`](../07-planning/milestones.md):

| Milestone | Deliverable | Target |
|---|---|---|
| M0 | Discovery, legal gates, research, technical spikes, prototype | 12 Dec 2026 |
| M1 | Pipeline spine + shadow ledger | 13 Feb 2027 |
| M2 | News product (beta) | 27 Mar 2027 |
| M3 | India analytics + Overnight Bridge (**MVP / public launch**) | 15 May 2027 |
| M4 | Impact Engine public + Accuracy Ledger | 26 Jun 2027 |
| M5 | Personalisation & depth | 31 Jul 2027 |
| M6 | Monetisation | 4 Sep 2027 |

Detailed acceptance evidence per milestone is in `07-planning/milestones.md` and forms part
of this SOW by reference.

## 3. Out of scope
As listed in [`01-requirements/scope.md`](../01-requirements/scope.md) §5. In particular, and
without limitation: brokerage or order execution; portfolio accounting or tax reporting;
investment advice, buy/sell/hold calls, target prices or model portfolios; user-generated
forums; native mobile applications (before a separate SOW); original on-ground journalism;
and the Phase 7 public API and expansion work, which is billed under a separate SOW.

## 4. 🔴 Client responsibilities (project-critical)
The following are **Client obligations** and are hard dependencies. Builder cannot proceed
past the stated milestone without them.

| # | Obligation | Needed by |
|---|---|---|
| C1 | Engage and fund qualified **securities counsel** for the SEBI opinion (Gate G2) | M0 wk 1 |
| C2 | Engage **media/IP counsel** for content-rights review (Gate G3) | M0 wk 2 |
| C3 | Execute and fund **market-data licences** (Gate G1) — NSE/BSE and/or vendor | M0 end |
| C4 | Execute and fund any **news-wire licence** | M1 |
| C5 | Fund **consensus-forecast data** (required for the `surprise` feature) | M1 |
| C6 | Provide a single **decision-maker** with ≤2 business-day turnaround on sign-offs | throughout |
| C7 | Fund third-party services (cloud, LLM inference, payments, messaging) **directly** | throughout |
| C8 | Decide on **SEBI RA registration** and, if pursued, fund and staff it | M0 end |
| C9 | Recruit **20 research participants** or fund recruitment | M0 wk 1 |

**Delay in C1–C3 blocks M0 exit and shifts all subsequent dates day-for-day.**

## 5. Builder responsibilities
Deliver the milestones to the stated acceptance evidence; maintain the planning repository as
the single source of truth; provide weekly written progress reports; raise risks within 2
business days of identification; maintain code quality gates (tests, types, compliance scans)
as defined in [`08-ops/deployment.md`](../08-ops/deployment.md).

## 6. Commercials
| Item | Value |
|---|---|
| Total fee | `<₹ ______>` — see [quote.md](quote.md) |
| Payment schedule | Per milestone, [`07-planning/milestones.md`](../07-planning/milestones.md) §payment schedule |
| Payment terms | Net `<15>` days from milestone acceptance |
| Third-party costs | **Billed to and paid by Client directly.** Not included in the fee |
| Rate for change orders | `<₹ ____>` per person-day |
| Taxes | GST extra as applicable |

## 7. Intellectual property
On full payment, Client owns: all bespoke source code, the data model, the event taxonomy,
the documentation in this repository, and the brand. Builder retains ownership of pre-existing
tools and general know-how, licensed to Client perpetually and royalty-free for use in the
deliverables. Third-party open-source components remain under their own licences (an SBOM is
delivered per release). **Licensed market data and news content are owned by their licensors
and are governed solely by Client's licences — no rights pass through this SOW.**

## 8. Change control
Any change to scope, acceptance criteria or dates requires a written change order signed by
both parties, with a corresponding entry in [`../decisions.md`](../decisions.md). Changes are
estimated at the rate in §6. **A change that adds scope must name what it displaces** — the
plan carries no slack by design ([`scope.md`](../01-requirements/scope.md) §6).

## 9. 🔴 Regulatory responsibility
**Client is the publisher and the regulated entity.** Builder builds a system that Client
operates. Specifically:
- Client is responsible for obtaining and maintaining all market-data and content licences.
- Client is responsible for determining whether SEBI RA/IA registration is required and for
  obtaining it.
- Client is responsible for the content published through the platform and for its
  editorial and compliance policies.
- Builder implements the controls specified in
  [`01-requirements/compliance.md`](../01-requirements/compliance.md) — the advice-language
  deny-list, the schema-level absence of recommendation fields, disclaimer placement,
  entitlement filtering, the kill switch and the audit log — **as engineering controls, not
  as legal assurance.**
- **Builder is not providing legal advice and makes no representation that the delivered
  system is compliant with any regulation.** Compliance is determined by Client's counsel.

## 10. Acceptance
Each milestone is accepted when the acceptance evidence in `07-planning/milestones.md` is
produced and signed off in [`signoffs/`](signoffs/). Client has `<5>` business days to accept
or reject with specific written reasons. Silence past that window is deemed acceptance.
Rejection must cite a specific unmet acceptance criterion.

## 11. Warranty, liability, confidentiality
`<To be drafted by counsel.>` Points requiring specific attention given the subject matter:
defect warranty period and its scope; **explicit exclusion of liability for trading losses
by end users**; exclusion of liability for the accuracy of third-party data; caps on
aggregate liability; mutual confidentiality; data-protection obligations under the DPDP Act
including processor terms; and insurance requirements.

## 12. Term & termination
`<Notice period>`. On termination: Builder delivers all work-in-progress, source code,
infrastructure definitions, credentials and documentation; Client pays for work completed and
accepted plus work in progress at the day rate. **The raw signal corpus and all accumulated
data are Client property and must be handed over in full** — it is the project's most valuable
asset.

---

**Signatures**

| | Client | Builder |
|---|---|---|
| Name | | |
| Title | | |
| Date | | |
| Signature | | |
