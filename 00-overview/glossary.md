# Glossary

**Status:** Living document · **Date:** 2026-11-12
**Rule:** if a term appears in a spec, a schema, a ticket or the UI, it is defined here, once.
Code uses these exact names. Disagreements about meaning are resolved by editing this file,
not by arguing in a PR.

---

## Part A — Newze domain terms (our invented vocabulary)

| Term | Definition | Notes |
|---|---|---|
| **Signal** | A single raw, timestamped input from one source. The atom of ingestion. | Immutable once stored. `signals` table. |
| **Event** | A typed, deduplicated, entity-linked thing that happened. One real-world occurrence = one Event, regardless of how many Signals reported it. | `events` table. Typed per the [event taxonomy](../05-data-model/event-taxonomy.yaml). |
| **Story** | A living cluster of Signals and Events about one developing subject. Has a timeline, not a publish date. | `stories` table. *Not* an "article" — we never use the word article. |
| **Impact** | A **prediction**: the expected effect of an Event on one instrument over one horizon, with a confidence band and historical basis. | `impacts` table. Has **no** `action` field, by design. |
| **Outcome** | What actually happened, measured and joined back to an Impact after its horizon elapsed. | `outcomes` table. Append-only. |
| **Impact Card** | The UI component that renders an Event + its Impacts + its analogs. The product's atomic unit of value. | |
| **Analog** | A past Event judged similar to a current one, used as evidence. | Retrieved by vector similarity over the Event Corpus. |
| **Event Corpus** | Our accumulated store of (event × context × realised outcome) tuples. **Moat 1.** | Grows daily; never reset. |
| **Accuracy Ledger** | The permanent public record of every Impact we published and how it scored. **Moat 2.** | `/track-record`. Append-only, no hide path. |
| **Overnight Bridge** | The 07:30 IST daily product: expected Indian open, attribution waterfall, top events, key levels. **Loop L1.** | |
| **Attribution Waterfall** | The decomposition of an expected gap into signed contributions (US close, crude, USDINR, ADR drag…) that sum to the estimate. | |
| **Publication Gate** | The hard rule suppressing an Impact when `n_analogs < 12` or the class's calibration is out of tolerance. | Code, not policy. |
| **Source Tier** | T0 exchange/primary · T1 wire · T2 major outlet · T3 aggregator · T4 social/unverified. | T4 can never produce a published Impact. |
| **Surprise** | The standardised difference between an actual figure and consensus. The most predictive field we have. | `surprise.z` |
| **Novelty** | 0–1: how unprecedented an Event is. 0 = fully anticipated and priced, 1 = never seen. | |
| **Certainty** | `rumoured → reported → confirmed / denied`. The state machine on an Event's truth status. | |
| **Latency class** | `realtime` / `delayed` / `eod` — attached to every price-bearing field. Licensing- and trust-critical. | Gate G1. |
| **Radar** | The filter that surfaces only news whose predicted impact on a *watched* instrument exceeds the user's threshold. | |
| **Loop L1 / L2 / L3** | Morning Ritual (daily habit) / Interrupt (breaking news) / Study (weekend deep work). Every feature must serve one. | [product-model.md](../01-requirements/product-model.md) §5 |
| **Shadow mode** | A model publishing to an internal ledger only, for ≥90 days, before any user sees it. | |
| **Suppression** | Automatic removal of a degrading event class from the UI. The suppression itself is published. | |
| **Point-in-time (PIT) correct** | A query that returns only what we knew at a given `ingest_time`. Required for all training and backtests. | Prevents look-ahead bias. |

---

## Part B — Market terms (so non-trading team members aren't lost)

### Indian market
| Term | Meaning |
|---|---|
| **NSE / BSE** | India's two main stock exchanges. |
| **Nifty 50** | NSE's benchmark index of 50 large companies. |
| **Bank Nifty** | NSE index of 12 major banks. The most actively traded derivative in India. |
| **Sensex** | BSE's 30-stock benchmark. |
| **F&O** | Futures & Options — derivatives. India's F&O volumes are the world's largest by contract count. |
| **OI (Open Interest)** | Number of derivative contracts currently open. Rising OI + rising price = new longs; rising OI + falling price = new shorts. |
| **OI build-up** | The four-way classification: long build-up, short build-up, long unwinding, short covering. |
| **PCR (Put-Call Ratio)** | Put OI ÷ Call OI. A crude positioning/sentiment gauge. |
| **Max pain** | The strike at which the largest total option value would expire worthless. |
| **IV / India VIX** | Implied volatility; India VIX is the Nifty volatility index. |
| **Expiry** | The day derivatives settle. Weekly and monthly. Behaviour on these days is statistically distinct. |
| **Rollover** | Moving a derivative position from the expiring contract to the next one. |
| **FII / FPI** | Foreign Institutional / Portfolio Investors. |
| **DII** | Domestic Institutional Investors (Indian MFs, insurers, banks). |
| **Participant-wise OI** | NSE's daily breakdown of positions by FII / DII / Pro / Client. "Smart money vs retail." |
| **GIFT Nifty** | Nifty futures traded at GIFT City (successor to SGX Nifty); trades while India is closed — the key overnight indicator. |
| **ADR / GDR** | American/Global Depositary Receipts — Indian companies listed abroad (e.g. INFY, HDB on NYSE). Their overnight moves predict the Indian open. |
| **Bhavcopy** | NSE/BSE's daily end-of-day data file. |
| **Delivery %** | Share of traded volume actually settled by delivery rather than intraday. High = conviction. |
| **Bulk / Block deal** | Large trades disclosed to the exchange. |
| **SAST / PIT** | SEBI regulations requiring disclosure of substantial acquisitions and insider trades. |
| **F&O ban** | When a stock's derivative OI exceeds a market-wide limit, new positions are barred. |
| **GMP (Grey Market Premium)** | Unofficial pre-listing price of an IPO in an **unregulated** grey market. Must always be labelled as such. |
| **SEBI** | Securities and Exchange Board of India — the regulator. |
| **RA / IA** | SEBI-registered Research Analyst / Investment Adviser. Regulated statuses we currently do **not** hold. |
| **RBI** | Reserve Bank of India — the central bank. |
| **Repo rate / CRR / SLR** | RBI's main policy rate; cash reserve ratio; statutory liquidity ratio. |
| **Lakh / Crore** | 100,000 / 10,000,000. Indian number formatting (`1,00,000`). |
| **G-sec** | Government securities (Indian sovereign bonds). |
| **Muhurat trading** | Ceremonial Diwali trading session. |

### Global
| Term | Meaning |
|---|---|
| **Fed / FOMC** | US central bank / its rate-setting committee. |
| **ECB / BoJ / BoE / PBoC** | European, Japanese, UK, Chinese central banks. |
| **bp (basis point)** | 0.01%. Rate moves are quoted in bp. |
| **CPI / WPI / PPI / IIP / PMI / NFP** | Inflation (consumer/wholesale/producer), industrial production, purchasing managers' index, US non-farm payrolls. |
| **DXY** | US dollar index. |
| **Brent / WTI** | The two main crude oil benchmarks. |
| **VIX** | S&P 500 volatility index. "The fear gauge." |
| **MOVE** | Bond-market volatility index. |
| **IG / HY spreads** | Investment-grade / high-yield credit spreads. Stress indicators. |
| **Yield curve inversion** | Short rates above long rates. Historically a recession signal. |
| **COT** | Commitments of Traders — US futures positioning data. |
| **Risk-on / risk-off** | Market regimes of appetite for / flight from risk. |
| **Abnormal return** | Return in excess of what a market model predicted. The correct measure of event impact. |
| **Event study** | The statistical method for measuring abnormal returns around events. |
| **GARCH** | A model of time-varying volatility. Used for our volatility-response estimates. |

---

## Part C — Technical terms used in our specs
| Term | Meaning |
|---|---|
| **Brier score** | Accuracy measure for probabilistic predictions. Lower is better; 0.25 = random for a 50/50 call. |
| **Calibration** | Whether "60% confident" predictions come true ~60% of the time. We publish this. |
| **Cone / band** | The 68% and 95% ranges around a point estimate. |
| **ANN search** | Approximate nearest-neighbour search over vectors. How analogs are retrieved. |
| **ISR** | Incremental Static Regeneration (Next.js) — cached pages that refresh on a timer. |
| **SSE** | Server-Sent Events — one-way realtime push. Our primary realtime transport. |
| **DLQ** | Dead-letter queue — where failed messages go for inspection and replay. |
| **Golden set** | A hand-labelled evaluation dataset used to measure pipeline quality weekly. |
| **Survivorship bias** | Error from excluding delisted/failed entities from history. Our universe retains them. |
| **Look-ahead bias** | Using information in a backtest that wasn't available at the time. The cardinal sin. |
