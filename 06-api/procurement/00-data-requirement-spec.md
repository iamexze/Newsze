# Data Requirement Specification — Newze

**Version:** 1.0 · **Date:** 2026-11-13 · **Status:** For circulation with RFQs

> Every enquiry in this folder references this document. Send it as an attachment so each
> counterparty quotes against the same scope. Do not restate the scope in the email body —
> differences between the email and this file are how quotes become incomparable.

---

## 1. Who is asking

**Newze** is a pre-launch market-intelligence platform for Indian and global markets. It
publishes market news with quantified historical context, plus analytics dashboards, to
retail and professional subscribers over the web. Business model is subscription; there is no
brokerage, no order routing and no execution capability.

**Current stage:** working prototype on synthetic data. No live market data is in use and no
licence is currently held. We are scoping cost before committing to a launch date.

---

## 2. Data sets required

### 2.1 Indian equity and derivatives — **primary requirement**

| # | Data set | Granularity | History needed |
|---|---|---|---|
| D1 | Index levels — Nifty 50, Bank Nifty, Fin Nifty, Midcap, sector indices, India VIX; Sensex and BSE indices | OHLC + close | 15 years |
| D2 | Cash equity prices — NSE and BSE listed universe | OHLC, volume, VWAP, delivery quantity | 15 years |
| D3 | Derivatives — index and stock futures | OHLC, volume, open interest | 15 years |
| D4 | Derivatives — index and stock options, full chain | Strike-level OI, volume, LTP, IV | 10 years |
| D5 | Participant-wise open interest (FII / DII / Pro / Client) | Daily | 10 years |
| D6 | Bhavcopy / end-of-day files, both segments | Daily | 15 years |
| D7 | Market-wide position limit utilisation and F&O ban list | Daily | 5 years |
| D8 | Surveillance lists — ASM and GSM, with stage | Daily | 5 years |
| D9 | Corporate actions, bulk and block deals | Event | 10 years |
| D10 | Index constituents and weights, **point-in-time** | On change | 15 years |

> **D10 is not optional.** Current-constituent lists applied to historical periods create
> survivorship and look-ahead bias, which would invalidate every statistic we publish.
> Please state explicitly whether point-in-time constituent history is available and whether
> it is separately licensed.

### 2.2 Global — secondary, may be a different counterparty
US equity indices and large-cap single names including Indian ADRs (INFY, HDB, IBN, WIT,
RDY); European and Asian index levels; FX majors and USD/INR including NDF where available;
commodity benchmarks (Brent, WTI, gold, silver, copper); US and Indian government bond yields.

### 2.3 Not required
Tick-by-tick or full order-book depth. Colocation or direct exchange connectivity. Pre-trade
risk or execution services.

---

## 3. Latency classes

We need **three distinct classes**, and our system treats latency as a per-field attribute,
so partial coverage is usable.

| Class | Use | Priority |
|---|---|---|
| **End of day** | Free tier, all historical analytics, model training | **Required at launch** |
| **Delayed (15 min)** | Free and entry-tier display | Required at launch |
| **Real time** | Paid-tier display only | Phase 2 — please quote separately |

**Please quote the three separately.** We would rather launch on end-of-day than delay launch
waiting for a real-time agreement.

---

## 4. How the data will be used

Please confirm which of these your licence permits, and price each where separable.

| # | Use | Detail |
|---|---|---|
| U1 | **Display to subscribers** | Prices and derivatives data shown on web pages to logged-in and anonymous users |
| U2 | **Derived analytics, displayed** | Values we compute from licensed data and display instead of the underlying: open-interest build-up classification, put-call ratio, max pain, implied-volatility rank, index contribution attribution, historical frequency statistics |
| U3 | **Internal storage and modelling** | Permanent storage of history for statistical analysis and model training. Not displayed in raw form |
| U4 | **Non-production use** | Development and staging environments |
| U5 | **Redistribution via API** | Phase 3 only. A paid B2B API. We assume licensed prices may **not** be redistributed without explicit permission and have architected to exclude them — please confirm |

> **U2 is the question we most need answered precisely.** Much of our product is computed
> values rather than licensed quotes. Whether derived data is treated as licensed data, as
> derived data, or as our own work product materially changes both the cost and the design.

---

## 5. Scale

Planning figures, not commitments.

| Horizon | Monthly active users | Paying subscribers | Notes |
|---|---:|---:|---|
| Launch | 15,000 | 400 | Majority on free, end-of-day only |
| Launch + 12 months | 50,000 | 2,500 | Real-time for paying tier only |
| Launch + 24 months | 400,000 | 25,000 | Plus B2B API customers |

Subscription pricing is ₹249 per month for the individual paid tier. We mention it because
per-subscriber licence models interact with it directly: a per-subscriber fee above roughly
₹40 per month would make the tier unviable at this price, and we would need to know that
before launch rather than after.

Geography: primarily India; some subscribers outside India.

---

## 6. Questions we need answered to compare quotes

Please answer each, even where the answer is "not applicable".

**Commercial**
1. Fee structure — flat, per-subscriber, per-display, per-data-set, revenue share, or a combination?
2. Is there a startup, low-volume or pre-revenue tier?
3. Minimum commitment period and notice period?
4. Is **historical / archive** data licensed separately from the live feed, and at what cost?
5. One-off setup or integration fees?
6. How does cost scale with the subscriber numbers in §5?

**Scope**
7. Which of U1–U5 does the licence permit, and which require a separate agreement?
8. **How is derived data (U2) treated?**
9. Is **end-of-day** data separately licensed from real time, and at what relative cost?
10. Is **non-production use (U4)** covered, or separately licensed?
11. Is point-in-time index constituent history (D10) available, and separately licensed?

**Obligations**
12. Audit, reporting or subscriber-counting obligations?
13. Required attribution or display conventions?
14. Restrictions on display to **non-paying** users?
15. Restrictions on display to subscribers **outside India**?

**Risk**
16. 🔴 **On termination, what happens to data we have already stored?** Must it be deleted? Our historical database is our principal asset, and a licence that can compulsorily erase it changes our risk profile materially. Please be specific.
17. How much notice applies to a fee change?
18. What is the realistic timeline from agreement to live data?

---

## 7. What we will do with your answer

We are collecting comparable quotes from the exchanges directly, from authorised vendors and
from broker API providers, then selecting one route. We expect to launch on end-of-day data
and add real time later, so a strong end-of-day proposal is competitive even without a
real-time offer.

**Contact:** `<name>` · `<email>` · `<phone>`
**Response requested by:** `<date — allow three weeks>`
