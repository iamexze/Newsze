# Compliance & Regulatory Constraints

**Status:** Draft v1 — **REQUIRES QUALIFIED LEGAL REVIEW** · **Date:** 2026-11-12

> ⚠️ **This document is written by a product team, not by lawyers.** It exists to make the
> constraints visible early and to scope the legal work. Nothing here is legal advice. Items
> marked 🔴 are **go/no-go gates** that must be answered in writing by qualified counsel
> before the corresponding code is written.

---

## 1. Why this is in the requirements folder, not an appendix

Three of the four things that could kill this product are legal, not technical. In a
financial-information product, **compliance is a product-design input, not a review step at
the end.** Design the product around the constraints and you ship. Design the product first
and you rebuild it.

---

## 🔴 Gate G1 — Market data licensing

**The constraint:** NSE, BSE, and most global exchanges licence their price, index and
derivatives data. Real-time display and any redistribution require a written licence and
fees; "we scraped it from a public website" is not a defence and is the most common way
products like this get shut down.

| Question to answer | Why it matters |
|---|---|
| What are NSE's / BSE's current data licence tiers, fees, and display-vs-redistribution terms? | Determines whether M4 can be real-time at launch |
| Can we use a licensed vendor (e.g. a market-data redistributor or a broker's licensed API) instead of a direct exchange agreement? | Usually cheaper and faster to start |
| Does our **API product (M11)** constitute redistribution? Almost certainly yes for prices. | Determines what the API can contain |
| What is permitted for **derived** data (our OI classifications, max pain, computed analytics)? | Derived analytics are often treated differently from raw quotes |
| What are the equivalent terms for US/EU data we display? | Scopes global coverage cost |

**Product decisions forced by this gate:**
- MVP is specified against **delayed / end-of-day** data. Every M4 requirement must work on
  EOD so we are never blocked.
- The data layer abstracts *latency class* (`realtime` / `delayed` / `eod`) as a first-class
  attribute, so upgrading post-licence is a config change, not a rewrite. See
  [ADR-004](../04-architecture/adr/004-market-data-abstraction.md).
- Every displayed price carries its latency class and source attribution in the UI.

---

## 🔴 Gate G2 — SEBI: are we doing "research"?

**The constraint:** In India, providing research reports / recommendations on securities is
regulated (SEBI Research Analyst Regulations); investment advice is separately regulated
(Investment Adviser Regulations). SEBI has also acted against unregistered "finfluencers"
and restricted regulated entities from associating with them.

**The hard question for counsel:**
> Does publishing a quantified, probabilistic estimate of an event's historical effect on an
> instrument — with no buy/sell/hold language, no target price and no position guidance —
> constitute a "research report" or "recommendation" under the RA Regulations?

**Our working posture until counsel answers** (defensive by design):

| Rule | Implementation |
|---|---|
| **Describe, never prescribe** | Output is a *distribution of historical outcomes*, not an action. The Impact schema has **no `action` field** — there is literally nowhere to put a recommendation |
| **No target prices** | Blocked at schema, prompt-guardrail and CI-assertion level |
| **No position sizing, no entry/exit, no stop-loss** | Same enforcement |
| **Always show n, confidence and the "we don't know" state** | FR-M2-05 publication gate |
| **Prominent, persistent disclaimers** | On every Impact Card, the Bridge, and all digests — not buried in a footer |
| **No performance claims implying future returns** | The Accuracy Ledger reports *model calibration*, never "returns you would have made" |
| **Editorial independence** | No paid stock promotion, ever (`04-scope` §5) |

**The registration track:** Plan A is to operate as information/analytics. Plan B — and the
more likely long-term answer if we ever want to say anything directive — is to **obtain SEBI
RA registration as an entity**, with a qualified research analyst on staff, compliance
officer, record-keeping and the associated disclosures. Budget and timeline for this are a
Phase 0 output. **Do not assume Plan A survives contact with counsel.**

---

## 🔴 Gate G3 — News content rights

**The constraint:** We cannot republish wire or publisher copy. Copyright subsists in the
article text; headlines may have thin protection; facts do not.

**Architecture that respects this (built in, not bolted on):**
- We store full text internally for **analysis** (entity extraction, clustering, classification). We do not display it.
- Public rendering = our own summary + **≤200 characters quoted** + prominent link-out + outlet attribution + tier badge. Enforced by a CI lint on the render layer (FR-M1-06).
- Images are never hotlinked or republished; we use our own generated visuals.
- `robots.txt` / ToS of every source is recorded in the source registry with its licence status; sources whose terms forbid our use are excluded at config level.
- Preferred path: a **commercial wire licence** (Reuters/AFP/PTI/ANI) for the sources we want to quote more liberally.

**Questions for counsel:** Does our internal analytical use of full text constitute fair
dealing under the Indian Copyright Act / fair use in other jurisdictions? What are the
limits on our summaries being derived from a single source? What attribution is required?

---

## 4. Other obligations (not gates, but required)

| Area | Obligation | Where handled |
|---|---|---|
| **DPDP Act 2023 (India)** | Consent, purpose limitation, data-principal rights, breach notification, possible Consent Manager integration | `08-ops/security-privacy.md` |
| **GDPR (if EU users)** | Lawful basis, DSAR, DPA with processors, data-transfer mechanism | same |
| **GST (India)** | GST-compliant invoicing on INR subscriptions; correct place-of-supply | `09-client/quote.md`, M9 |
| **IT Rules 2021 (India)** | If classified as a digital news publisher: grievance officer, grievance redressal timelines, periodic compliance reporting | Phase 0 legal scope |
| **Advertising/promotion** | No misleading performance claims; disclaimers in all marketing, not just the product | Marketing checklist |
| **Accessibility** | WCAG 2.2 AA (NFR-A11Y-01) — also reduces legal exposure in several markets | `03-design/` |
| **AI disclosure** | State clearly where LLMs generate or summarise content; keep a human kill switch (FR-M10-03) | Product UI + editorial policy |
| **Record keeping** | If RA registration is pursued: retention of research rationale, distribution records | `05-data-model/` retention policy |

---

## 5. Standing disclaimer (draft — counsel to finalise)

> *Newze publishes market information and statistical analysis of historical market
> behaviour. Nothing on Newze is investment advice, a research report, or a recommendation
> to buy or sell any security. Estimates are probabilistic descriptions of historical
> analogs and may be wrong. Past behaviour does not predict future results. Market data may
> be delayed; latency is shown with every price. Consult a SEBI-registered investment
> adviser before making investment decisions.*

Placement: every Impact Card (collapsed but always present), the Overnight Bridge, every
digest/email, the API response envelope, and the footer of every page.

---

## 6. Phase 0 legal work order

| # | Deliverable | Owner | Due |
|---|---|---|---|
| L1 | Written opinion on G2 (RA Regulations applicability) + the exact safe framing | Securities counsel | Phase 0 wk 3 |
| L2 | Market-data licensing options memo with costs (NSE/BSE direct vs vendor) | Founder + counsel | Phase 0 wk 3 |
| L3 | Content-rights memo + recommended wire partner shortlist | Media counsel | Phase 0 wk 4 |
| L4 | Entity structure + whether RA registration is pursued, with cost/timeline | Founder + CA + counsel | Phase 0 wk 4 |
| L5 | Privacy policy, ToS, disclaimer set, DPDP compliance checklist | Counsel | Phase 1 wk 2 |
| L6 | IT Rules 2021 applicability assessment | Counsel | Phase 1 |

**Until L1 and L2 return, no production ingestion of licensed market data and no public
Impact publication.** Development proceeds on EOD/free data and in shadow mode.
