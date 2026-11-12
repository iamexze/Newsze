# Estimates

**Status:** Draft v1 · **Date:** 2026-11-12
Unit: **person-days (pd)**, 1 pd = 1 focused engineer-day. Estimates are **P50** with an
explicit confidence. Apply the buffer in §4 before quoting anything to anyone.

> **Estimating honesty note:** items marked 🔴 are genuinely uncertain — they depend on data
> quality, licensing and modelling results we don't have yet. Treat their numbers as ranges
> to be re-estimated after Phase 0, not commitments.

---

## 1. By module

### Phase 0 — Foundation (team of 5, 4 weeks)
| Item | pd | Confidence |
|---|---:|---|
| Legal coordination + 3 memos (our time, excl. counsel fees) | 8 | High |
| 20 interviews + diary study + concept test + synthesis | 22 | High |
| Spike S1 — NSE EOD ingestion | 6 | High |
| Spike S2 — wire→Event latency & cost | 7 | Med |
| **Spike S3 — analog signal backtest** 🔴 | **15** | **Low** |
| Spike S4 — entity resolution precision | 8 | Med |
| Prototype (Bridge + Impact Card) | 10 | High |
| Repo, CI, IaC, environments | 8 | High |
| **Subtotal** | **84** | |

### Phase 1 — Pipeline Spine (8 weeks)
| Item | pd | Confidence |
|---|---:|---|
| Source registry + config framework | 8 | High |
| Ingestion workers × 6 source kinds | 22 | Med |
| Raw immutable storage + replay | 7 | High |
| Event bus + topic design + DLQ | 8 | High |
| Normalisation (time, units, currency, tiers) | 10 | High |
| Entity resolution (dict + fuzzy + LLM + console) | 18 | Med |
| Clustering (embeddings, ANN, story lifecycle) | 16 | Med |
| Classification (taxonomy, rules, LLM, schemas) | 20 | Med |
| **Historical backfill: 15y prices + 5y events** 🔴 | **25** | **Low** |
| Settlement job + shadow ledger | 12 | Med |
| Internal console (monitor, queue, kill switch, RBAC) | 18 | High |
| Data stores, migrations, PIT access layer | 14 | Med |
| Temporal workflows | 8 | Med |
| Observability (OTel, dashboards, alerts) | 10 | High |
| Golden sets + weekly quality report | 10 | Med |
| **Subtotal** | **206** | |

### Phase 2 — News Product (6 weeks)
| Item | pd | Confidence |
|---|---:|---|
| Design system + data primitives + Storybook | 18 | High |
| App shell, routing, theming, a11y baseline | 12 | High |
| Live wire + filters + SSE client | 14 | High |
| Story pages + timelines + source rows | 10 | High |
| Ticker / entity pages | 12 | Med |
| Impact Card component (all 4 variants) | 12 | Med |
| Global cross-asset dashboard | 14 | Med |
| Macro calendar + surprise | 10 | Med |
| SSE gateway (server side) | 8 | Med |
| Auth + accounts + sessions | 12 | High |
| SEO, ISR, structured data, OG images | 10 | High |
| Instrumentation + analytics wiring | 8 | High |
| Content-licensing lint + audit | 6 | High |
| **Subtotal** | **146** | |

### Phase 3 — India Analytics + Bridge (7 weeks)
| Item | pd | Confidence |
|---|---:|---|
| India data ingestion (bhavcopy, derivatives, flows, filings) | 20 | Med |
| Index dashboards + contribution attribution | 12 | Med |
| OI build-up classification + tables | 14 | Med |
| Option chain analytics (PCR, max pain, OI-by-strike) | 16 | Med |
| FII/DII flows | 8 | High |
| India macro suite + surprise | 12 | Med |
| USDINR + NDF | 8 | Med |
| **Overnight Bridge model** 🔴 | **30** | **Low** |
| Bridge UI (cone, waterfall, levels, scoring) | 18 | Med |
| Daily self-scoring job + display | 8 | High |
| 07:30 digest pipeline + templates + delivery | 12 | Med |
| Watchlists | 10 | High |
| Launch hardening (load test, runbooks, status page) | 14 | Med |
| **Subtotal** | **182** | |

### Phase 4 — Impact Engine Public (6 weeks)
| Item | pd | Confidence |
|---|---:|---|
| Analog retrieval productionisation 🔴 | 20 | Low |
| Statistical estimator (event study + GARCH) | 16 | Med |
| Ensemble + calibration layer | 14 | Low |
| Publication gate + suppression automation | 10 | Med |
| Public `/track-record` (slicing, curves, history) | 20 | Med |
| Analogs UI + regime warnings | 12 | Med |
| Corrections & withdrawals flow | 10 | High |
| Compliance scanner (advice language) | 6 | High |
| Learned model (GBDT) — *conditional* | 15 | Low |
| **Subtotal** | **123** | |

### Phase 5 — Personalisation & Depth (5 weeks) — **138 pd**
Alert rules engine 20 · matcher + dedupe + fatigue 14 · channels (push/email/WhatsApp) 16 ·
digests 12 · search + semantic 18 · India depth (participants, IV, rollover, delivery,
deals, results/concalls) 36 · global depth (CB tracker, surprise indices, breadth, risk,
correlations) 22.

### Phase 6 — Monetisation (5 weeks) — **96 pd**
Razorpay 16 · Stripe 10 · entitlement enforcement + serialiser filters 18 · paywall +
metering 14 · GST invoicing 10 · dunning + lifecycle emails 10 · export (CSV/PDF) 10 ·
A/B framework 8.

---

## 2. Totals

| Phase | pd | Calendar (team of 5) |
|---|---:|---|
| P0 Foundation | 84 | 4 weeks |
| P1 Pipeline Spine | 206 | 8 weeks |
| P2 News Product | 146 | 6 weeks |
| P3 India + Bridge | 182 | 7 weeks |
| P4 Impact Engine | 123 | 6 weeks |
| P5 Personalisation | 138 | 5 weeks |
| P6 Monetisation | 96 | 5 weeks |
| **Total to full paid product** | **975 pd** | **≈41 weeks (~9.5 months)** |
| *To MVP (P0–P3)* | *618 pd* | *≈25 weeks (~6 months)* |

**Sanity check:** 975 pd ÷ 5 people ≈ 195 working days each ≈ 9.3 months at 100%
utilisation. Real utilisation on feature work is 65–75% after meetings, support, incidents
and code review — hence the buffer below.

---

## 3. Lean-team variant (3 people)
Same scope, 1.6× calendar: MVP ≈ **9.5 months**, full ≈ **15 months**.
**Recommendation if the team is 3:** cut Phase 5 global depth and Phase 4's learned-model
component, and ship P0–P3 + the public Ledger only. That is ~**700 pd ≈ 11 months** at 3
people and still contains both compounding moats.

---

## 4. Buffers & risk loading

| Factor | Loading | Why |
|---|---|---|
| Utilisation (65–75% on feature work) | **×1.35** | Meetings, review, support, incidents |
| 🔴 Low-confidence items (S3, backfill, Bridge model, calibration) | **×1.5 on those lines** (+~55 pd) | Genuine modelling uncertainty |
| Integration/licensing surprises | **+8%** | Data vendors are never plug-and-play |
| **Planning number to quote** | **≈1,420 pd** | 975 × 1.35 + risk loading |

**Quote the buffered number. Track against the P50 number.** The gap is the risk budget, and
it is spent visibly, not silently.

---

## 5. Non-engineering costs to budget separately
Legal (securities + media counsel, Phase 0, then retainer) · **market-data licences 🔴 —
potentially the largest single line item** · wire licence 🔴 · consensus-forecast data ·
cloud + LLM inference (model with NFR-COST-01: ≤₹18/MAU blended) · WhatsApp per-conversation
costs · SEBI RA registration if pursued · design/brand · user-research incentives ·
security audit before public launch.

---

## 6. Estimation review cadence
Re-estimate at every phase boundary with actuals. Track **estimate accuracy per module** —
after two phases the team's personal fudge factor is known and should replace the generic
×1.35. Record each revision in [`../decisions.md`](../decisions.md).
