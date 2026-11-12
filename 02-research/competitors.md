# Market & Competitive Teardown

**Status:** Draft v1 · **Date:** 2026-11-12

---

## 1. Market sizing (top-down → bottom-up)

### India (primary market)
| Layer | Figure | Source class |
|---|---|---|
| Demat accounts | ~19 crore | CDSL/NSDL monthly |
| Active traders (traded ≥1x in 12m) | ~4–5 crore | NSE active client base |
| **Serious/frequent traders (our SAM)** | **~45–60 lakh** | F&O active + high-frequency cash |
| Already pay for a market tool | ~8–12 lakh | TradingView/Sensibull/StockEdge/Trendlyne install+sub base |
| **Realistic 3-yr SOM @ 3% of SAM** | **~1.5–1.8 lakh subs** | — |
| At blended ₹700/mo ARPU | **₹125–150 crore ARR** | — |

### Global (secondary)
Retail investors who would pay $20–50/mo for Bloomberg-grade context: conservatively
2–4 million globally (triangulated from Koyfin, Seeking Alpha, Morning Brew Pro, Finimize
subscriber bases). 0.5% capture = 10–20k subs = $4–10M ARR.

> **Read:** India is the volume and the wedge. Global is the ARPU and the exit multiple.
> Build India-first, architect global-ready. Never the reverse — a global-first product
> always under-serves Indian market microstructure, which is where the differentiation is.

---

## 2. Competitor teardown — where each one is structurally weak

### Global

**Bloomberg Terminal** — $30k/yr. Unassailable on depth and institutional distribution.
*Weakness:* price excludes 99.9% of the market; no retail funnel; interpretation is left to
the user. *We never compete here; we compete for the user who will never buy it.*

**Reuters / AP / AFP** — the wires. Speed and trust. *Weakness:* they sell the input, not
the interpretation. **They are a supplier, not a competitor** — and a licensing path.

**Yahoo Finance / Investing.com / MarketWatch** — free, huge. *Weakness:* ad-funded →
engagement-optimised → clickbait; data is commodity; zero memory (no system knows what it
told you last month); analytics stop at a P/E ratio. **Most of our free-tier users come
from here.**

**Koyfin / Sentieo / AlphaSense / YCharts** — the "affordable terminal" tier, $50–$500/mo.
Genuinely good. *Weakness:* tool-shaped not narrative-shaped; US/EU-centric; India coverage
is a ticker list; no accountability layer; no event-outcome history.

**Seeking Alpha / Finimize / Morning Brew** — editorial + newsletter. *Weakness:*
opinion-driven, crowd contributors of wildly varying quality, no quantified impact, no
scoring of their own calls.

**TradingView** — the real global competitor by mindshare. Charts + social + screeners,
excellent product. *Weakness:* news is a thin feed; analytics are user-generated;
no editorial intelligence; no event→outcome engine; no India macro depth.

### India

| Player | Strength | The hole we drive through |
|---|---|---|
| **Moneycontrol** | Brand, reach, breadth | Pageview-optimised, ad-heavy, slow, F&O analytics are decorative, no quant layer, app is a portal not a tool |
| **Economic Times / Mint / BQ Prime** | Journalism quality | Newspaper DNA — prose first, structure never; no instrument-level linkage |
| **Zerodha (Varsity/Pulse/Kite)** | Trust, distribution, 1.3cr+ users | Deliberately refuses to be an analytics/opinion product — it's a broker. Pulse is a raw RSS aggregator. **This is the biggest unoccupied space in Indian fintech.** |
| **Sensibull** | Best-in-class options analytics | Options-only; no news; no macro; no global; tool not intelligence |
| **Opstra / Quantsapp** | Deep derivatives math | Niche, dated UX, zero narrative layer |
| **StockEdge** | Good scans and FII/DII data | Screener-shaped; no event engine; no global bridge |
| **Trendlyne / Tijori / Screener.in** | Fundamentals, filings | Equity-research shaped; weak on intraday/derivatives/news velocity |
| **Telegram / YouTube "analysts"** | Immediacy, community, trust-by-personality | Unaccountable, often illegal post-SEBI finfluencer rules, survivorship bias. **These channels are where our users are today and why the Accuracy Ledger is the killer feature — it is the exact antidote.** |

---

## 3. The positioning map

```
                       HIGH INTERPRETATION / "what it means"
                                    │
         Bloomberg ●                │                ★ NEWZE
         (unaffordable)             │           (quantified, accountable,
                                    │            India+Global, affordable)
                      Seeking Alpha ●
                      Finimize ●    │
   LOW DATA ──────────────────────  ┼  ────────────────────── HIGH DATA
   DEPTH                            │                         DEPTH
                      Telegram ●    │   ● Koyfin   ● TradingView
                                    │   ● Sensibull ● StockEdge
         Moneycontrol ●             │   ● Investing.com
         (noise)                    │   ● Screener.in
                                    │
                       LOW INTERPRETATION / "here is the data"
```

**The upper-right quadrant is empty below $500/mo. That is the entire business.**

---

## 4. Why now (the timing thesis)

1. **Indian retail depth is structural, not a bubble.** 19cr demat accounts, SIP flows
   ₹25k+ crore/month, DII flows now large enough to absorb FII selling. The audience exists
   permanently now.
2. **SEBI's crackdown on unregistered finfluencers** has vacated the trust position.
   Millions of traders lost their information source and are actively looking for a
   legitimate one. This window is open *now* and closes when someone fills it.
3. **LLMs made the interpretation layer economically possible.** Entity extraction, event
   typing, cross-lingual summarisation and clustering at scale cost ~1/100th of what a
   newsroom costs. In 2019 this product needed 200 analysts. Today it needs 8 engineers.
4. **Vector search + cheap columnar storage** made the Analog Engine (Moat 1) buildable by
   a startup. ClickHouse/Timescale + pgvector replace what used to be a $2M data warehouse.
5. **Exchange/market data APIs are finally accessible** to small players (broker APIs,
   licensed vendors) in a way they were not a decade ago.

---

## 5. Competitive response plan

| If… | They will… | We respond by… |
|---|---|---|
| Moneycontrol clones the Impact Card | Ship a shallow version in ~3 months | Publishing our Accuracy Ledger against theirs. They cannot match a 12-month scored history. |
| Zerodha builds this into Kite | Instant 1.3cr distribution | Be the licensed data/API layer *for* brokers (`07` B2B tier). Partner, don't duel. |
| TradingView adds India macro | Strong product, slow on local depth | Double down on microstructure they will never prioritise: participant-wise OI, expiry lab, GIFT basis, SAST/PIT filings |
| A funded startup copies the whole thesis | Burn to catch up | 18-month corpus head start + the public ledger. Catching up means publicly starting at zero credibility. |
