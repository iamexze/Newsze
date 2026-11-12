# Quote — Newze

**Status:** Draft v1 — **indicative, not a binding quote** · **Date:** 2026-11-12
**Valid until:** `<date>` · **Prepared for:** `<Client>`

> ⚠️ **This is a planning instrument.** Four of its biggest inputs — market-data licensing,
> wire licensing, consensus-forecast data, and the Impact Engine's feasibility — are unknown
> until Phase 0 (M0) closes. **M0 exists to replace these placeholders with real numbers.**
> A binding quote should be issued only after M0.

---

## 1. Engineering effort

From [`07-planning/estimates.md`](../07-planning/estimates.md): **975 person-days (P50)**,
**≈1,420 pd** with the utilisation and risk loading applied.

| Phase | P50 pd | Loaded pd |
|---|---:|---:|
| M0 Discovery & Gates | 84 | 118 |
| M1 Pipeline Spine | 206 | 310 |
| M2 News Product | 146 | 205 |
| M3 India + Bridge (**MVP**) | 182 | 274 |
| M4 Impact Engine + Ledger | 123 | 196 |
| M5 Personalisation | 138 | 186 |
| M6 Monetisation | 96 | 131 |
| **Total** | **975** | **1,420** |
| *MVP only (M0–M3)* | *618* | *907* |

| Blended day rate | Total (loaded) | MVP only |
|---|---:|---:|
| ₹8,000/pd | ₹1.14 cr | ₹73 L |
| ₹12,000/pd | ₹1.70 cr | ₹1.09 cr |
| ₹18,000/pd | ₹2.56 cr | ₹1.63 cr |

*Rate depends on team seniority and engagement model. Fill in the agreed rate and this table
collapses to one row.*

## 2. 🔴 Third-party costs — billed to Client directly, NOT included above

| Item | Indicative range | Confidence | Note |
|---|---|---|---|
| **NSE/BSE market-data licence** | **unknown** | 🔴 none | **Potentially the largest single line item.** Quote in M0 (Gate G1) |
| **News-wire licence** | **unknown** | 🔴 none | Quote in M0 (Gate G3). Start with one wire |
| **Consensus-forecast data** | **unknown** | 🔴 none | Required for `surprise_z`, the model's best feature |
| Securities counsel (SEBI opinion) | ₹2–6 L | Low | One-off + retainer |
| Media/IP counsel | ₹1–3 L | Low | One-off |
| SEBI RA registration *(if pursued)* | ₹3–10 L + ongoing staffing | Low | Decision at M0 |
| Cloud infrastructure | ₹40k–₹2 L/mo, scaling with MAU | Med | Mumbai region |
| LLM inference | ₹30k–₹1.5 L/mo | Med | Governed by NFR-COST-01 (≤₹18/MAU blended) |
| Managed services (Temporal, Redpanda, Typesense, PostHog, Sentry, Grafana) | ₹25k–₹80k/mo | Med | |
| WhatsApp Business messaging | per conversation | Med | Pro-tier channel only |
| Payments | 2–3% of revenue | High | UPI cheaper than cards |
| Security audit / pentest | ₹2–5 L | Med | Before public launch |
| Brand & design | ₹1–5 L | Low | Optional external |
| Research incentives | ₹20k | High | 20 × ₹1,000 |

## 3. Payment schedule
Per [`07-planning/milestones.md`](../07-planning/milestones.md):
15% (M0) · 20% (M1) · 20% (M2) · 20% (M3) · 15% (M4) · 5% (M5) · 5% (M6).
Net `<15>` days from milestone acceptance. Third-party costs invoiced at cost, or paid by
Client directly (preferred — it keeps licence agreements in Client's name, which matters
legally).

## 4. Assumptions this quote depends on
1. Team of 5; a team of 3 extends the calendar ~1.6× at similar total cost.
2. Client meets obligations C1–C9 in [`sow.md`](sow.md) §4 on time.
3. Decisions returned within 2 business days.
4. **Gate G1/G2/G3 outcomes do not force a fundamental redesign.** They might — that is why
   M0 is separately priced and separately cancellable.
5. **Spike S3 succeeds.** If analog retrieval shows no out-of-sample signal, M4 is cancelled
   and the scope reduces by ~196 loaded pd — a change order, not a dispute.
6. Third-party services are paid for by Client.
7. Phase 7 (public API, apps, expansion) is excluded and separately quoted.

## 5. Recommended commercial structure

> **Price M0 separately and commit to nothing else until it closes.**
>
> M0 is 118 loaded pd — roughly 8% of the programme — and it answers the three legal gates,
> validates the core product hypothesis with real users, and tests whether the Impact Engine
> is feasible at all. Every number in §1 and §2 becomes real at the end of it.
>
> Committing the full budget before M0 means pricing four unknowns, any one of which could
> change the product. **The disciplined move is a small, time-boxed, cancellable M0, then a
> firm quote for M1–M3, then a decision on M4–M6 once the MVP is in users' hands.**

| Stage | Commit | Decision point |
|---|---|---|
| **Now** | M0 only — fixed price | Go/no-go on all three gates + S3 |
| After M0 | M1–M3 (MVP) — firm fixed price | PMF criterion at M3 |
| After M3 | M4–M6 — priced on actuals | Business performance |
