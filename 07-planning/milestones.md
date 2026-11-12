# Milestones & Deliverables

**Status:** Draft v1 · **Date:** 2026-11-12
Each milestone is a **payment-linked, sign-off-able unit of work**. A milestone is complete
when its acceptance evidence exists and is signed off in
[`../09-client/signoffs/`](../09-client/signoffs/) — not when the code is written.

---

## M0 — Discovery & Gates · *ends 12 Dec 2026*
| Deliverable | Acceptance evidence |
|---|---|
| Legal opinions G1/G2/G3 | Three written memos from counsel, with costed options |
| Research findings report | 20 interview transcripts, diary data, concept-test results, written verdict per RQ |
| Technical spike reports S1–S4 | Code + measured results; **S3 backtest with an explicit go/no-go verdict** |
| Clickable prototype (Bridge + Impact Card) | Figma/HTML prototype used in the concept test |
| Approved Phase 1–3 budget | Signed budget with real licensing numbers |
| This planning repo, reviewed and signed off | [signoffs/](../09-client/signoffs/) entry |
| **Payment trigger** | **15% of total** |

## M1 — Pipeline Spine · *ends 13 Feb 2027*
| Deliverable | Acceptance evidence |
|---|---|
| Source registry + 25 live sources | 14-day continuous ingestion log, <1% gap |
| Raw immutable storage + bus replay | Demo: reprocess 7 days from raw, byte-identical inputs |
| Entity resolution | ≥95% precision on NSE-500 golden set (report) |
| Clustering | ≥90% purity on 500-item golden set (report) |
| Classification vs taxonomy v1 | ≥85% type accuracy (report) |
| 15y price + 5y event backfill | Row counts, PIT verification test passing |
| Settlement job + **shadow Accuracy Ledger** | 14 consecutive days of scored impacts |
| Internal console (monitor, review queue, kill switch) | Walkthrough + RBAC test |
| Observability | One trace spanning all 8 stages, demoed |
| **Payment trigger** | **20%** |

## M2 — News Product (Beta) · *ends 27 Mar 2027*
| Deliverable | Acceptance evidence |
|---|---|
| Web app: wire, story pages, ticker pages, global dashboard, macro calendar | Deployed to staging + 100 invited users |
| Design system + data primitives | Storybook, both themes, a11y audit passing |
| Realtime SSE feed | New item visible ≤3s, reconnect-with-backfill demoed |
| SEO surfaces | Lighthouse ≥90, structured data validated, sitemap live |
| Auth + accounts | Security review checklist signed |
| Instrumentation | All mandatory events firing, verified in PostHog |
| Content-licensing audit | Zero violations across a 1,000-item sample |
| **Payment trigger** | **20%** |

## M3 — India Analytics + Overnight Bridge (**MVP / Public Launch**) · *ends 15 May 2027*
| Deliverable | Acceptance evidence |
|---|---|
| India index dashboards + contribution attribution | Verified against exchange data for 10 sessions |
| OI build-up, option chain, PCR, max pain | Reconciliation report vs exchange files |
| FII/DII flows, India macro with surprise, USDINR | Live, with provenance on every number |
| **Overnight Bridge** | 20/20 on-time publications; MAE beats the naive GIFT-gap baseline |
| Daily self-scoring at 09:16 | 20 consecutive scored days, public |
| 07:30 digest delivery | Delivery + open rates reported |
| Watchlists | Functional, tested |
| Launch readiness | Load test at 10x expected peak; runbooks signed; status page live |
| **PMF check** | 1,000 users on the Bridge ≥10/20 days; ≥35% "very disappointed" |
| **Payment trigger** | **20%** |

## M4 — Impact Engine Public + Accuracy Ledger · *ends 26 Jun 2027*
| Deliverable | Acceptance evidence |
|---|---|
| Calibration layer + publication gate | Gate demonstrably suppressing thin classes |
| Public `/track-record` | Live, sliceable, with ≥90 days of scored history |
| Analogs UI + regime warnings | Shipped |
| Corrections & withdrawals flow | End-to-end drill completed and published |
| Compliance scan | 10,000 published strings, zero advice-language hits |
| Quality bar | ≥3 classes clearing calibration; 1d direction >57% |
| **Payment trigger** | **15%** |

## M5 — Personalisation & Depth · *ends 31 Jul 2027*
Alert engine, Radar, push + WhatsApp, digests, search, India depth, global depth.
Acceptance: CTR >35%, ≤5 alerts/day median, D30 >40%. **Payment: 5%**

## M6 — Monetisation · *ends 4 Sep 2027*
Payments, tiers, entitlement enforcement, paywall + A/B, GST invoicing, export.
Acceptance: free→paid ≥3%, payment success ≥92% in India. **Payment: 5%**

## M7 — API & Scale · *continuous from Sep 2027*
Billed separately — time & materials or a new SOW.

---

## Payment schedule summary

| Milestone | Share | Cumulative | Target date |
|---|---:|---:|---|
| M0 Discovery & Gates | 15% | 15% | 12 Dec 2026 |
| M1 Pipeline Spine | 20% | 35% | 13 Feb 2027 |
| M2 News Product (Beta) | 20% | 55% | 27 Mar 2027 |
| M3 India + Bridge (**MVP**) | 20% | 75% | 15 May 2027 |
| M4 Impact Engine + Ledger | 15% | 90% | 26 Jun 2027 |
| M5 Personalisation | 5% | 95% | 31 Jul 2027 |
| M6 Monetisation | 5% | 100% | 4 Sep 2027 |

---

## Milestone rules
1. **Acceptance evidence is produced by the builder and verified by the approver.** "It works on my machine" is not evidence.
2. A milestone may be accepted **with noted exceptions**, which carry forward as explicit debt in the next milestone's scope — never silently.
3. **No milestone is accepted while a P0 defect is open.**
4. Scope changes mid-milestone require a written change order and a `decisions.md` entry.
5. **M0 is cancellable without penalty beyond work done.** This is deliberate: it is the phase designed to discover that the project should not continue.
