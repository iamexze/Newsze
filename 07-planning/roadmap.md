# Roadmap — Phases & Gates

**Status:** Draft v1 · **Date:** 2026-11-12
**Planning assumption:** core team of **5** — 1 full-stack lead, 1 frontend, 1 backend/data
engineer, 1 data/quant engineer, 1 product/design (founder-led). A 3-person team roughly
multiplies every duration by 1.6; see [estimates.md](estimates.md) for the lean variant.

> **The gates are the plan.** Dates are estimates; **exit criteria are commitments.** A phase
> does not end because its dates elapsed — it ends when its exit criteria are met. If a gate
> fails, the roadmap changes, not the gate.

---

## Timeline at a glance

```
2026                           2027
Nov   Dec   Jan   Feb   Mar   Apr   May   Jun   Jul   Aug   Sep   Oct   Nov
│                                                                          │
├─P0─┤                                                                     │   Foundation & Gates (4w)
     ├──────P1──────┤                                                      │   Pipeline Spine (8w)
                    ├────P2────┤                                           │   News Product (6w)
                               ├─────P3─────┤                              │   India Analytics (7w)
                                            ├────P4────┤                   │   Impact Engine public (6w)
                                                       ├───P5───┤          │   Personalisation (5w)
                                                                ├──P6──┤   │   Monetisation (5w)
                                                                       ├P7─┤   Scale & API (ongoing)
▲                  ▲            ▲            ▲          ▲        ▲
G1-G3            ALPHA        BETA        PUBLIC      LEDGER    PAID
gates           internal    invite-only   LAUNCH      PUBLIC    LAUNCH
```

---

## Phase 0 — Foundation & Gates
**17 Nov – 12 Dec 2026 (4 weeks)** · *Cost of being wrong here: the entire project.*

| Workstream | Deliverable |
|---|---|
| **Legal** 🔴 | G1 market-data licensing memo + quotes · G2 SEBI RA opinion with exact safe framing · G3 content-rights memo + wire shortlist · entity structure decision |
| **Research** | 20 interviews, 8-person diary study, concept test (RQ1–RQ8 in [research-plan.md](../02-research/research-plan.md)) |
| **Technical spikes** | **S1** NSE EOD ingestion reliability · **S2** wire→structured-Event latency + cost/1k · **S3** 🔴 *does analog retrieval have any signal on 5y of backfilled data?* · **S4** entity resolution precision on NSE-500 |
| **Design** | Clickable prototype of the Bridge + Impact Card for the concept test |
| **Setup** | Repo, CI, environments, IaC skeleton, source registry schema |

**Exit criteria (all must pass):**
- [ ] G1, G2, G3 answered **in writing** by counsel, with a costed path for each
- [ ] **S3 shows measurable out-of-sample signal** on ≥1 event class — *if S3 fails, we pivot to news + analytics without the Impact Engine and the whole plan is re-cut*
- [ ] RQ1 confirmed: the pre-open pain is real and quantified
- [ ] S2 proves end-to-end latency ≤60s at an acceptable cost per 1k events
- [ ] Budget approved for Phase 1–3 with real data-licensing numbers

🚦 **GO/NO-GO.** This is the only phase where cancelling is cheap.

---

## Phase 1 — The Pipeline Spine
**15 Dec 2026 – 13 Feb 2027 (8 weeks, includes a holiday fortnight)**
*Goal: the machine runs end to end, internally. No public product.*

Build: source registry + 25 sources · raw immutable ingestion to R2 · event bus · normalise ·
entity resolution (dictionary + LLM fallback) · clustering · classification against taxonomy
v1 · **15-year historical backfill of prices + events (the corpus bootstrap)** · settlement
job · internal console (pipeline monitor, review queue, kill switch) · **Accuracy Ledger in
shadow mode from day one** · Postgres + Timescale + pgvector + Temporal + observability.

**Exit criteria:**
- [ ] 25+ sources ingesting continuously for 14 days with <1% gap
- [ ] Entity resolution ≥95% precision on the NSE-500 golden set
- [ ] Cluster purity ≥90% on the 500-item golden set
- [ ] Classification ≥85% type accuracy
- [ ] Backfill complete: ≥15y prices, ≥5y events, PIT-verified
- [ ] **Shadow ledger producing scored impacts daily** — the 90-day clock starts here
- [ ] p95 wire→classified ≤45s

🏁 **ALPHA (internal).**

---

## Phase 2 — The News Product
**16 Feb – 27 Mar 2027 (6 weeks)** · *Goal: a real, usable news product. Invite-only.*

Build: Next.js app, design system, data primitives · live wire with filters + SSE · story
pages with timelines and tier badges · entity/ticker pages · **Impact Cards (shadow numbers
visible to invited users with a clear "experimental" label)** · global cross-asset dashboard
+ macro calendar · SEO/ISR/structured data · auth + basic accounts · instrumentation.

**Exit criteria:**
- [ ] 100 invited users; ≥30% weekly return rate
- [ ] LCP ≤2.5s, INP ≤200ms at p75 on mid-tier Android/4G
- [ ] Zero licensing violations in an internal content audit
- [ ] Qualitative: ≥8/20 interviewed users say the wire replaced ≥1 existing source

🏁 **BETA (invite-only).**

---

## Phase 3 — India Analytics + The Bridge
**30 Mar – 15 May 2027 (7 weeks)** · *Goal: the differentiator. The habit. **Public launch.***

Build: index dashboards with contribution attribution · **OI build-up classification** ·
option chain (PCR, max pain, OI-by-strike) · FII/DII flows · India macro with surprise ·
USDINR · **the Overnight Bridge** (expected open, cone, attribution waterfall, key levels,
top-3 events, **daily self-scoring at 09:16**) · 07:30 IST email digest · watchlists ·
real-time data tier **if G1 cleared**, otherwise EOD everywhere with visible latency badges.

**Exit criteria:**
- [ ] Bridge publishes on time on 20 of 20 consecutive trading days
- [ ] Bridge 30-day open-estimate MAE beats the naive "GIFT Nifty gap" baseline *(if it doesn't, we ship the attribution waterfall as information and drop the point estimate)*
- [ ] 1,000 users open the Bridge on ≥10 of 20 trading days *(the MVP success criterion)*
- [ ] ≥35% "very disappointed" on the Sean Ellis PMF question
- [ ] Uptime 99.9%; 99.95% in the 09:00–15:45 IST window

🚦 **PUBLIC LAUNCH.** 🏁 **This is the MVP.**

---

## Phase 4 — Impact Engine Public + Accuracy Ledger
**18 May – 26 Jun 2027 (6 weeks)** · *Goal: turn on the moat.*

Requires ≥90 days of shadow-mode data — available because it started in Phase 1.

Build: calibration layer + publication gate hardened · **public `/track-record`** with
slicing, calibration curves, suppression log, model history · analog display + regime-
concentration warnings · learned-model ensemble component (*only if it beats the baseline
out-of-sample*) · corrections and withdrawals flow · shareable Impact Cards (OG images).

**Exit criteria:**
- [ ] ≥3 event classes clear the calibration bar on 90 days of shadow data
- [ ] Published classes: direction accuracy >57% at 1d, band-68 coverage 63–73%
- [ ] Ledger is public, complete, and has no hide path (verified by audit)
- [ ] Zero advice-language violations in an automated scan of 10,000 published strings

🏁 **LEDGER PUBLIC** — the marketing moment.

---

## Phase 5 — Personalisation & Depth
**29 Jun – 31 Jul 2027 (5 weeks)**

Alert rules engine · Radar thresholds · web push + WhatsApp · quiet hours and fatigue caps ·
digests (pre-open, post-close, weekend) · search + semantic search · India depth
(participant-wise OI, IV surface, rollovers, delivery %, bulk/block/insider, results +
concall summaries) · global depth (central-bank tracker, surprise indices, breadth, risk
dashboard, correlations).

**Exit:** alert→open CTR >35% · <2% alert-driven unsubscribes · D30 retention >40% ·
median alerts/day/user ≤5.

---

## Phase 6 — Monetisation
**3 Aug – 4 Sep 2027 (5 weeks)**

Razorpay + Stripe · tiers + entitlement enforcement at the serialiser · paywall moments
(depth / timeliness / personalisation / export) · **the Ledger-as-paywall A/B test** ·
GST invoicing · dunning · export (CSV/PDF) · Terminal tier foundations.

**Exit:** free→paid ≥3% at 60 days · paywall-hit→checkout ≥12% · payment success ≥92% in
India · CAC payback <6 months on at least one channel.

---

## Phase 7 — Scale, API & Expansion
**Sep 2027 onwards (continuous)**

Public Data API + webhooks + streaming · Narrative Tracker · Analog Engine query UI ·
Ask Newze (RAG) · Hindi · native apps · Terminal multi-pane workspace · broker white-label ·
multi-region · US/EU microstructure depth · institutional tier.

---

## Cross-phase: what runs continuously from Phase 1
1. **The corpus grows every day** — never pause ingestion, even during a refactor. A gap in the corpus is permanent.
2. **Shadow scoring runs every day** — the Ledger's credibility is a function of unbroken history.
3. **Weekly quality report** — entity precision, cluster purity, classification accuracy, calibration.
4. **Weekly competitive watch** ([competitive-watch.md](../02-research/competitive-watch.md)).
5. **Quarterly licence audit** — every source: what we display, to whom, at what latency, under which clause.
6. **Quarterly game day** — kill a subsystem in staging, verify graceful degradation (commitment C2).

---

## The three ways this plan fails (and the planned response)

| Failure | Detected | Response |
|---|---|---|
| **S3 fails — analogs have no signal** | Phase 0 | Drop the Impact Engine. Ship a superb structured news + analytics product. Moats 3 and 4 survive; Moats 1 and 2 do not. Smaller business, still a business. **Decide in Phase 0, not Phase 4.** |
| **G1 fails — real-time data unaffordable** | Phase 0 | Ship EOD-only with visible latency badges. The Bridge works on EOD + GIFT + ADRs anyway. Revisit at Series A. |
| **Phase 3 PMF criterion missed** | Phase 3 | Do **not** proceed to Phase 4. Re-run research on why the habit didn't form. The Ledger only has value if people come back. |
