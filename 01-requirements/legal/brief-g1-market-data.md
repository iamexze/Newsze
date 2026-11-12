# Counsel Brief — G1: Market Data Licensing

**To:** `<Securities / commercial counsel>` · **From:** `<Client>` · **Date:** `<date>`
**Subject:** Licensing requirements for display and redistribution of Indian and global
exchange data
**Attachments:** [`prd.md`](../prd.md) §6 (M4) · [`integrations.md`](../../06-api/integrations.md) ·
[`endpoints.md`](../../06-api/endpoints.md)

---

## 1. What we intend to do with exchange data

A subscription web platform showing market analytics to retail and professional users.

| Use | Detail | Priority |
|---|---|---|
| **Display — delayed/EOD** | End-of-day prices, indices, derivatives data, open interest, option chains, flows | **MVP — required** |
| **Display — real-time** | Live prices and OI during market hours, to paying subscribers | Phase 4+ |
| **Derived analytics** | Our own computations *from* exchange data: OI build-up classification, put-call ratio, max pain, IV rank, index contribution attribution, historical statistics | **MVP — required** |
| **Historical storage** | 15 years of prices and derivatives data, stored permanently, used to compute statistics and train models | **MVP — required** |
| **Redistribution via API** | A paid B2B API serving data to broker/fintech customers | Phase 7 |
| **Non-production use** | Development and staging environments | Throughout |

**Data sets in scope:** NSE and BSE (equities, indices, F&O, open interest, bhavcopy,
participant-wise OI, bulk/block deals, F&O ban list, corporate actions) · NSE IX / GIFT Nifty
· US equities and ADRs · FX including USDINR · commodities · government bond yields.

---

## 2. Questions

**Scope of licence required**
1. For each use in the table above, what licence is required from NSE and from BSE? We
   specifically need to understand where the line falls between **display**, **internal use**
   and **redistribution**.
2. Does storing 15 years of historical exchange data and computing statistics from it require
   a licence distinct from a display licence?
3. **How are derived values treated?** If we compute a put-call ratio, a max-pain level or an
   OI build-up classification from licensed data and display only our computed value — is that
   licensed data, derived data, or our own work product? This materially affects our product.
4. Does displaying **delayed or end-of-day** data require a licence, or is publicly published
   end-of-day data free to use? If free, under what conditions and attribution?
5. Do the exchanges' website terms of use permit automated retrieval of their publicly
   published files? If not, what is the compliant route to the same data?

**Commercial structure**
6. What licence tiers exist, and what is the fee structure — flat, per-subscriber, per-display,
   revenue-share? Are there startup or low-volume tiers?
7. Is licensing through an **authorised vendor/redistributor** available, and typically cheaper
   or faster than a direct exchange agreement for a company at our stage?
8. **Can we obtain data through a broker's licensed API** (several Indian brokers offer
   developer APIs), and would that cover our display use, or only a user's own personal use?
   *This is the question with the largest cost implication — please address it specifically.*
9. What are typical timelines from application to live data?

**Obligations and restrictions**
10. What audit, reporting, subscriber-counting or attribution obligations typically attach?
11. What restrictions apply to displaying data to **non-paying** users?
12. Are there restrictions on showing data **outside India** to international subscribers?
13. May licensed data be used in **development and staging** environments, or must
    non-production use be separately licensed? *(We have assumed not, and have designed our
    development environments to use fixtures and EOD data only — please confirm this is
    correct and necessary.)*
14. What happens to our **stored historical data if a licence is terminated**? Must it be
    deleted? This is critical: our historical database is our principal asset, and a licence
    that can compulsorily erase it changes our risk profile materially.

**Global data**
15. What is required for US (NYSE/NASDAQ), European and Asian data? Is a single global vendor
    the practical route?
16. Are FX and commodity benchmark quotes licensed differently from equity data?

**API product (Phase 7)**
17. Our planned B2B API would serve our **own event and impact data** (our work product) and,
    potentially, prices. We assume prices cannot be redistributed without explicit permission.
    Please confirm, and advise what an API containing only our derived analytics — with no
    licensed prices — requires.

---

## 3. What we need from you

1. **A licence requirements matrix**: for each use, what licence, from whom, at what indicative
   cost, with what timeline.
2. **A recommended path for a pre-revenue startup** that is legally sound and affordable — we
   expect this to be "start with EOD and/or a vendor, upgrade later," but need it confirmed.
3. **Review of our architectural assumption** that delayed/EOD-only operation at launch is
   compliant and that upgrading later is purely commercial, not structural. *(We have designed
   "latency class" as a per-field attribute specifically to make this upgrade a configuration
   change — see [ADR-004](../../04-architecture/adr/004-market-data-abstraction.md).)*
4. **The two or three things most likely to get us into trouble**, so we can design them out
   now rather than discover them in an audit.

**Deadline:** `<date — 3 weeks>`. We are simultaneously requesting commercial quotes from
NSE, BSE, two vendors and two broker API providers; your guidance will tell us which of those
quotes we actually need.
