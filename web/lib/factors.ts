/* ───────────────────────────────────────────────────────────────────────────
   GLOBAL FACTORS · CANDLESTICK PATTERNS · MARKET STATISTICS

   Same rule as lib/research.ts: the MECHANISMS and CITED FINDINGS here are
   real and attributed. Every live figure rendered on the site is sample data.
   ─────────────────────────────────────────────────────────────────────────── */

import type { Source } from "./research";

/* ═══ GLOBAL FACTORS ═══════════════════════════════════════════════════════ */

export type Factor = {
  slug: string; name: string; mark: string; kicker: string;
  instruments: string[];
  impact: "high" | "medium" | "low";
  direction: string;          // plain-language direction of effect on India
  summary: string;
  mechanism: { h: string; p: string }[];
  indiaEffect: string[];
  watch: string[];
  numbers?: { k: string; v: string; note?: string }[];
  caveat: string;
  sources: Source[];
  pro?: string[];             // what the Pro tier adds on this factor
};

export const FACTORS: Factor[] = [
  {
    slug: "crude-oil", name: "Crude oil", mark: "OIL",
    kicker: "India imports 85–88% of what it burns",
    instruments: ["CMD:BRENT"], impact: "high",
    direction: "Higher crude is unambiguously negative for India at the macro level",
    summary: "Oil is the single most consequential commodity for India because it is simultaneously an inflation input, a current-account item, a fiscal variable and a sector-level earnings driver. No other global factor touches as many parts of the economy at once.",
    mechanism: [
      { h: "Inflation", p: "An RBI staff study estimated roughly 49 basis points on headline CPI per $10 per barrel from a $65 base — about 24bp directly through fuel and 26bp indirectly through transport and input costs. DBS put the figure lower, at 20–25bp. The spread between those estimates is itself informative: pass-through depends heavily on tax policy." },
      { h: "External balance", p: "The RBI has estimated the current-account cost at roughly $12.5bn a year per $10. ICRA's figure is $12–13bn, widening the deficit by about 0.3% of GDP; Kotak's estimate is higher at about 0.5%. One published estimate puts the growth effect at around 10bp off annual GDP." },
      { h: "The rupee loop", p: "Higher oil raises dollar demand for imports, which weakens the rupee, which raises the rupee cost of oil further. During 2011–13, with crude sustained above $100, the rupee lost close to 20% over eighteen months. This feedback is why crude-in-rupees matters more than crude-in-dollars." },
      { h: "Sector dispersion", p: "Oil marketing companies face margin compression when retail prices lag. Paints, tyres, aviation, logistics and chemicals carry crude derivatives as direct inputs. Consumption names face second-order pressure as fuel costs eat discretionary spending. The sector dispersion often exceeds the index move." },
    ],
    indiaEffect: [
      "CPI rises with a lag of roughly one to two quarters",
      "Current-account deficit widens, pressuring the rupee",
      "Fiscal position worsens if the government absorbs the shock through excise cuts",
      "OMC, aviation, paint, tyre and logistics margins compress",
      "Upstream producers (ONGC, Oil India) benefit — the one offsetting group",
    ],
    watch: ["Brent in rupee terms, not dollars", "OPEC+ meeting calendar and compliance",
      "US inventory data, Wednesdays", "Refining crack spreads", "Rupee at the same time — the two compound"],
    numbers: [
      { k: "+$10/bbl → CPI", v: "≈ +49bp", note: "RBI staff study; DBS estimates 20–25bp" },
      { k: "+$10/bbl → current account", v: "≈ $12.5bn", note: "≈0.3% of GDP (ICRA) to 0.5% (Kotak)" },
      { k: "+$10/bbl → GDP growth", v: "≈ −10bp", note: "one published estimate" },
      { k: "Import dependence", v: "85–88%", note: "of crude consumed" },
    ],
    caveat: "Published sensitivities vary widely by study, base price and year, and government tax choices can absorb or amplify the pass-through entirely. Treat any single coefficient as indicative rather than precise.",
    sources: [
      { label: "~49bp CPI per $10/bbl (24bp direct, 26bp indirect)", who: "RBI staff study, 2019" },
      { label: "20–25bp CPI estimate", who: "DBS" },
      { label: "Current account ≈$12.5bn per $10", who: "RBI" },
      { label: "$12–13bn ≈ 0.3% of GDP", who: "ICRA" },
      { label: "≈0.5% of GDP", who: "Kotak" },
    ],
    pro: ["Crude-in-rupee series with the FX decomposition separated out",
      "Sector margin sensitivity table across 40 Indian names",
      "Alerts on OPEC+ headlines above an impact threshold"],
  },
  {
    slug: "gold", name: "Gold", mark: "AU",
    kicker: "A global risk asset and an Indian household staple at once",
    instruments: ["CMD:XAU", "CMD:XAG"], impact: "high",
    direction: "Rising gold is mildly risk-off globally, and mechanically widens India's import bill",
    summary: "Gold occupies a position in India no other asset does: it is a safe-haven trade for global investors, a household savings instrument for hundreds of millions of people, a major import line, and a growing share of RBI reserves. Those four roles can point in opposite directions at once.",
    mechanism: [
      { h: "Price transmission", p: "Indian domestic prices closely mirror international movements, with the rupee amplifying or dampening the move. World Gold Council analysis notes domestic prices supported by rupee weakness — a falling rupee makes dollar gold more expensive locally even when the dollar price is flat." },
      { h: "The duty lever", p: "Import duty changes have large, immediately measurable effects. After a 2024 duty cut, the domestic gold price fell about 6% month-on-month even as the dollar price of gold rose. Bar and coin demand is relatively more sensitive to duty changes than jewellery demand." },
      { h: "Demand structure", p: "Econometric work finds income and price are the main long-run drivers of Indian gold demand. Festive and wedding seasons create a pronounced and predictable seasonal pattern in physical buying — one of the few genuine seasonalities in the Indian market." },
      { h: "Reserve asset", p: "The RBI has been a steady buyer. Reserves stood at roughly 880 tonnes as of end Q3 2026, and gold's weight in total foreign-exchange reserves rose from about 9% a year earlier to 12.5% by August 2025, largely through valuation gains rather than purchases." },
    ],
    indiaEffect: [
      "Higher gold widens the import bill and pressures the current account",
      "Jewellery demand falls at high prices while investment demand (bars, coins, ETFs) rises",
      "Gold loan NBFCs see collateral values rise — a direct earnings positive",
      "Household savings shift away from financial assets, which is a slow negative for equity flows",
      "RBI reserve valuation gains improve the headline reserve number without any purchase",
    ],
    watch: ["Gold in rupee terms", "Import duty announcements — the fastest-acting lever",
      "Festive and wedding season calendar", "Real US yields, the main global driver",
      "RBI monthly reserve composition", "Gold ETF flows as a cleaner read on investment demand"],
    numbers: [
      { k: "2024 duty cut", v: "−6% m/m", note: "domestic price fell while dollar gold rose" },
      { k: "RBI gold reserves", v: "≈880t", note: "end Q3 2026" },
      { k: "Gold share of FX reserves", v: "9% → 12.5%", note: "to Aug 2025, mostly valuation" },
      { k: "Long-run demand drivers", v: "income, price", note: "econometric analysis" },
    ],
    caveat: "Gold's roles conflict. A rising price is simultaneously good for gold-loan lenders, bad for the import bill, bad for jewellery volumes and good for reserve valuation. Any single directional read on 'gold up' for Indian equities is almost certainly too simple.",
    sources: [
      { label: "Domestic prices mirror international; rupee amplifies", who: "World Gold Council, 2025" },
      { label: "2024 duty cut → −6% m/m domestic price", who: "World Gold Council" },
      { label: "Income and price are the main long-run demand drivers", who: "Econometric analysis via WGC" },
      { label: "RBI reserves ≈880t end Q3'26; gold weight 9%→12.5%", who: "World Gold Council / RBI" },
    ],
    pro: ["Gold-in-rupee with duty-adjusted import parity", "Gold loan NBFC collateral sensitivity",
      "Festive-season demand nowcast"],
  },
  {
    slug: "crypto", name: "Cryptocurrencies", mark: "BTC",
    kicker: "A risk-appetite thermometer with an unstable reading",
    instruments: ["CRY:BTC"], impact: "low",
    direction: "Weak and unstable. Useful as a sentiment read, not as an input to Indian equity direction",
    summary: "Bitcoin is widely treated as a global risk-appetite gauge, and it sometimes is. The problem is that its relationship with equities is not stable enough to build anything on — the correlation swings from meaningfully negative to strongly positive within the same year.",
    mechanism: [
      { h: "The decoupling claim", p: "On a 52-week basis, Bitcoin's correlation with the Nasdaq Composite was measured at −0.06 in early 2026, the lowest since December 2018, having flipped negative in late February. In one quarter Bitcoin fell 13.4% while the Nasdaq-100 rose 27.7%." },
      { h: "The sceptical reading", p: "Other analysis over the same period found correlation rising to 0.69 with beta above 3 by early March, and a daily return correlation with the Nasdaq-100 of 0.49 through a drawdown. The conclusion there was that Bitcoin had decoupled in performance but not in sensitivity — that is, it still responds to the same macro impulses, just with unstable amplification." },
      { h: "Why it matters for India", p: "The honest answer is: not much, directly. Indian equity has no mechanical link to crypto. The indirect channel is risk appetite — a sharp crypto drawdown occasionally coincides with broader de-risking that does reach emerging-market equity. That is a weak, episodic and unreliable signal." },
    ],
    indiaEffect: [
      "No direct mechanical channel to Indian equities",
      "Occasional co-movement during broad risk-off episodes",
      "Indian crypto exposure is tax-disadvantaged, which weakens the domestic wealth-effect channel",
      "Relevant mainly as one input among many to a global risk-appetite read",
    ],
    watch: ["Bitcoin's rolling correlation with the Nasdaq, not its price",
      "Whether a crypto move is crypto-specific or part of a broader risk move",
      "Beta, not just correlation — amplification matters more than direction"],
    numbers: [
      { k: "BTC / Nasdaq 52-week correlation", v: "−0.06", note: "early 2026, lowest since Dec 2018" },
      { k: "Competing measure, same period", v: "0.49 – 0.69", note: "daily correlation through a drawdown" },
      { k: "Beta to equities, peak", v: ">3", note: "early March 2026 estimate" },
    ],
    caveat: "The sources genuinely disagree, and several widely circulated correlation figures turn out to be older data republished under newer dates. We rate this factor low-impact for Indian equities and publish no impact estimate from crypto moves.",
    sources: [
      { label: "52-week BTC/Nasdaq correlation −0.06, lowest since Dec 2018", who: "Market analysis, 2026" },
      { label: "Correlation 0.69, beta >3; 0.49 daily through drawdown", who: "Competing 2026 analysis" },
      { label: "Q2: BTC −13.4% vs Nasdaq-100 +27.7%", who: "NYDIG data via CoinMarketCap" },
    ],
  },
  {
    slug: "dollar", name: "The US dollar", mark: "USD",
    kicker: "The price of everything else",
    instruments: ["FX:DXY", "FX:USDINR"], impact: "high",
    direction: "A stronger dollar is broadly negative for Indian assets",
    summary: "The dollar sets the global risk tone for emerging markets, determines the rupee return a foreign investor actually earns, and prices every commodity India imports. It is the quietest of the major channels and one of the most pervasive.",
    mechanism: [
      { h: "Unhedged return", p: "A foreign investor in Indian equity earns the index return plus the currency move. A strengthening dollar reduces the dollar return on an unhedged position regardless of what the Nifty does, which mechanically discourages inflows." },
      { h: "Import pricing", p: "Crude, gold, electronics and edible oils are dollar-priced. A stronger dollar raises the rupee cost of all of them simultaneously, which is why dollar strength and imported inflation arrive together." },
      { h: "Carry and rate differentials", p: "The India–US yield differential governs the attractiveness of Indian debt. A narrowing differential, whether from higher US yields or lower Indian ones, reduces the carry that supports debt inflows." },
      { h: "Managed, not free", p: "RBI intervention compresses observed rupee volatility. That makes the historical statistical relationship look weaker than the underlying economic one — the pressure shows up in reserves rather than in the exchange rate." },
    ],
    indiaEffect: [
      "Foreign portfolio inflows weaken as unhedged dollar returns fall",
      "Imported inflation rises through dollar-priced commodities",
      "IT services exporters benefit — the main offsetting sector",
      "Companies with unhedged dollar debt face higher servicing costs",
      "RBI reserves are drawn down defending the rupee, which itself becomes a signal",
    ],
    watch: ["DXY level and direction", "USD/INR spot and the NDF premium",
      "RBI weekly reserve data for intervention signatures",
      "India–US ten-year differential", "Real yields rather than nominal"],
    caveat: "Because the rupee is managed, the observable exchange rate understates the pressure. Reserve changes are often the better read on dollar stress than the spot rate itself.",
    sources: [{ label: "Mechanism: unhedged FX return, import pricing, carry differential", who: "Market structure" }],
    pro: ["NDF premium and forward curve", "Estimated RBI intervention series",
      "Sector FX exposure table — net exporters versus net importers"],
  },
  {
    slug: "us-rates", name: "US rates and the Fed", mark: "FED",
    kicker: "The global discount rate",
    instruments: ["RT:US10Y"], impact: "high",
    direction: "Higher US yields are negative for Indian equity valuations and for debt inflows",
    summary: "The US ten-year yield anchors the discount rate applied to every long-duration asset on earth. Indian equities, which carry a growth premium and therefore long-dated cash flows, are more sensitive to it than the headline correlation suggests.",
    mechanism: [
      { h: "Discounting", p: "A higher risk-free rate compresses the present value of future earnings. The effect is largest where valuations are richest and earnings are furthest out — which describes much of the Indian growth complex." },
      { h: "The path, not the level", p: "Markets price expectations. A rate decision exactly in line with forecasts moves nothing; the surprise in the guidance moves everything. A cut delivered with a hawkish dot plot is a hawkish event." },
      { h: "Why the move happened", p: "A yield rise driven by stronger growth transmits very differently from the same rise driven by an inflation scare. The level alone tells you little." },
    ],
    indiaEffect: [
      "Equity valuations compress, concentrated in high-multiple names",
      "Debt inflows slow as the carry narrows",
      "The rupee weakens on a widening rate differential",
      "RBI's own room to ease narrows if the differential becomes uncomfortable",
    ],
    watch: ["Market-implied Fed path, not the current rate", "Two-year versus ten-year",
      "Real yields", "The reason for any move — growth or inflation"],
    caveat: "The transmission to Indian equity is conditional on regime. In calm markets the relationship is weak; in stress it tightens sharply.",
    sources: [{ label: "Mechanism: discount rate and carry", who: "Market structure" }],
  },
  {
    slug: "china", name: "China", mark: "CN",
    kicker: "Commodity demand, supply chains and portfolio substitution",
    instruments: ["IDX:HSI", "CMD:HG"], impact: "medium",
    direction: "Mixed. Chinese weakness lowers commodity costs for India but signals global demand weakness",
    summary: "China affects India through three distinct and partly offsetting channels: as the marginal buyer of industrial commodities, as a supply-chain source and competitor, and as the other large emerging market competing for the same global portfolio allocation.",
    mechanism: [
      { h: "Commodity demand", p: "China is the dominant marginal consumer of industrial metals. Chinese construction and manufacturing activity moves copper, steel and coal prices, which flow directly into Indian metal producers' earnings and into infrastructure input costs." },
      { h: "Portfolio substitution", p: "Global emerging-market allocators frequently treat India and China as substitutes within a fixed EM allocation. Periods of Chinese policy stimulus have coincided with rotation out of Indian equity into Chinese equity, independent of anything happening in India." },
      { h: "Supply chain", p: "India imports a substantial volume of intermediate goods, electronics components and active pharmaceutical ingredients from China. Disruption raises input costs; the 'China plus one' relocation theme works the other way, as a structural positive." },
    ],
    indiaEffect: [
      "Chinese stimulus lifts metal prices — positive for Indian metal producers, negative for user industries",
      "EM allocation rotation can pull foreign flows out of India with no Indian trigger",
      "API and electronics component costs move with Chinese supply conditions",
      "China plus one relocation is a slow structural positive for Indian manufacturing",
    ],
    watch: ["China manufacturing PMI", "Copper and steel prices",
      "Chinese policy stimulus announcements", "EM fund flow data for rotation",
      "Hang Seng relative performance against the Nifty"],
    caveat: "The substitution channel is the one most often missed. Indian equity can fall on Chinese good news, which looks irrational until you account for a fixed EM allocation being reweighted.",
    sources: [{ label: "Mechanism: marginal commodity demand, EM allocation substitution", who: "Market structure" }],
    pro: ["EM fund flow rotation tracker", "India–China relative valuation series"],
  },
  {
    slug: "global-equities", name: "Global equity markets", mark: "EQ",
    kicker: "The overnight gap is where it lands",
    instruments: ["IDX:SPX", "IDX:NDX", "IDX:N225", "IDX:SX5E"], impact: "high",
    direction: "Strong but unstable — weak on calm days, strong in stress",
    summary: "The largest single input to an Indian opening gap, and the best-evidenced of the directional channels. Research finds the volatility of the Nifty's overnight return is imported from the US, with causality running one way.",
    mechanism: [
      { h: "One-way transmission", p: "Research on US and Indian index data finds unidirectional Granger causality from the S&P 500 and Nasdaq to the Nifty. One study covering 2023–2025 attributes about 14.3% of Indian market variance to US shocks." },
      { h: "It lives in the gap", p: "The same work finds the Nifty's overnight return volatility is imported from the US while the intraday session is substantially domestic. That is why we model the opening gap rather than the trading day." },
      { h: "Unstable correlation", p: "One estimate puts the Nifty / S&P correlation near 0.39 against a ten-year average of about 0.54, and dynamic studies find it low on average but rising sharply in stress. The channel is weakest on quiet days and strongest exactly when it matters." },
    ],
    indiaEffect: [
      "Sets the opening gap, which is where most global information enters",
      "Sector leadership transmits — a tech-led US fall hits Indian IT hardest",
      "Volatility transmits more reliably than direction",
      "In stress, correlation rises and diversification benefits disappear",
    ],
    watch: ["S&P 500 and Nasdaq closes plus after-hours", "Sector leadership, not just the index",
      "VIX direction", "Asia as confirmation rather than an independent signal"],
    numbers: [
      { k: "US share of Indian market variance", v: "≈14.3%", note: "2023–2025 study" },
      { k: "Nifty / S&P correlation", v: "0.39", note: "recent estimate vs 0.54 ten-year average" },
      { k: "Direction of causality", v: "one-way", note: "US → Nifty" },
    ],
    caveat: "Treating the Asian session as independent double-counts the US signal Asia is already reflecting — the most common error in morning market commentary.",
    sources: [
      { label: "Granger causality US → Nifty; overnight volatility imported", who: "NSE research paper" },
      { label: "14.3% of Indian variance from US shocks", who: "2023–2025 journal study" },
      { label: "Correlation 0.39 vs 0.54 ten-year average", who: "Yes Securities" },
    ],
  },
  {
    slug: "geopolitics", name: "Geopolitics and supply chains", mark: "GEO",
    kicker: "Episodic, high-magnitude, poorly forecastable",
    instruments: ["CMD:BRENT", "CMD:XAU"], impact: "medium",
    direction: "Asymmetric — rarely positive, occasionally severely negative",
    summary: "Conflict, sanctions, shipping-lane disruption and election outcomes transmit to India mainly through energy prices, shipping costs and risk appetite. The distribution is heavily skewed: most geopolitical headlines do nothing, and a few do a great deal.",
    mechanism: [
      { h: "Energy first", p: "The dominant channel for India is almost always crude. A conflict that threatens supply or transit routes raises the oil price, and everything in the crude chapter then follows." },
      { h: "Shipping and insurance", p: "Disruption to major transit routes raises freight rates and war-risk insurance premiums, which feed into landed import costs with a lag of weeks." },
      { h: "Risk appetite", p: "Emerging-market assets are typically sold first in a global risk-off move, regardless of local exposure. India's domestic flow base has reduced but not eliminated this." },
    ],
    indiaEffect: [
      "Crude and gold rise together, which is the worst combination for the import bill",
      "Freight and insurance costs rise with a several-week lag",
      "Foreign flows reverse on risk appetite alone, independent of Indian fundamentals",
      "Defence and selected commodity producers are the narrow beneficiaries",
    ],
    watch: ["Crude and gold moving together — the signature of genuine risk-off",
      "Freight rate indices", "Transit-route specific headlines rather than general conflict news",
      "Whether the move persists past 48 hours; most do not"],
    caveat: "Our own ledger suppressed the GEOPOLITICAL event class for poor calibration. The honest position is that we cannot forecast the market impact of geopolitical events well enough to publish estimates, and we say so rather than guessing.",
    sources: [{ label: "Class suppressed on our own Accuracy Ledger, 22 Sep 2026", who: "Newze" }],
  },
];

export const factorBySlug = (s: string) => FACTORS.find((f) => f.slug === s);

/* ═══ CANDLESTICK PATTERNS ═════════════════════════════════════════════════
   Geometry is drawable: each candle is [open, high, low, close] on a 0–100
   scale. The evidence ratings come from the published literature and are
   mostly unflattering.                                                      */

export type Candle = [number, number, number, number]; // o,h,l,c
export type Pattern = {
  slug: string; name: string; type: "Reversal" | "Continuation" | "Indecision";
  bias: "bullish" | "bearish" | "neutral";
  candles: Candle[];
  what: string; claim: string; evidence: string;
  verdict: "some support" | "market-specific" | "no support" | "contrarian";
  sources: Source[];
};

export const PATTERNS: Pattern[] = [
  {
    slug: "hammer", name: "Hammer", type: "Reversal", bias: "bullish",
    candles: [[62, 66, 20, 60], [58, 62, 54, 56], [56, 72, 54, 70]],
    what: "A small body near the top of the range with a long lower shadow, appearing after a decline.",
    claim: "Sellers pushed price down intraday and were overwhelmed; a reversal follows.",
    evidence: "One multi-criteria ranking study placed Hammer in the top three patterns examined. That is a ranking, not a significance test, and we could find no robust significance evidence for Hammer specifically with data-snooping and transaction-cost controls applied.",
    verdict: "market-specific",
    sources: [{ label: "Hammer, long engulfing and rising window ranked top three", who: "Multi-criteria study" }],
  },
  {
    slug: "bullish-engulfing", name: "Bullish engulfing", type: "Reversal", bias: "bullish",
    candles: [[70, 74, 56, 58], [52, 80, 50, 78]],
    what: "A down candle followed by an up candle whose body completely engulfs it.",
    claim: "A decisive shift from net selling to net buying.",
    evidence: "Engulfing patterns rank well in descriptive studies. Bootstrap testing on DJIA components found strong evidence that candlestick technical analysis is not profitable on the US market, with neither bullish nor bearish signals consistently beating buy-and-hold.",
    verdict: "no support",
    sources: [
      { label: "Bootstrap study: candlestick analysis not profitable on US market", who: "Marshall et al." },
      { label: "Long engulfing ranked top three", who: "Multi-criteria study" },
    ],
  },
  {
    slug: "piercing", name: "Piercing pattern", type: "Reversal", bias: "bullish",
    candles: [[74, 78, 56, 58], [50, 72, 48, 70]],
    what: "A down candle followed by an up candle opening below the prior low and closing above its midpoint.",
    claim: "A gap down that is bought back through the previous day's range.",
    evidence: "The most favourably evidenced pattern in our review. A Taiwan study found three bullish reversal patterns significantly profitable in that market, with Piercing singled out. Note the market specificity — the same tests on US data return nothing.",
    verdict: "some support",
    sources: [{ label: "Three bullish reversal patterns significantly profitable, Piercing especially", who: "Taiwan market study" }],
  },
  {
    slug: "doji", name: "Doji", type: "Indecision", bias: "neutral",
    candles: [[60, 74, 46, 60]],
    what: "Open and close at effectively the same level, producing a cross.",
    claim: "Buyers and sellers in balance; a trend change is imminent.",
    evidence: "We found no significance evidence for Doji as a standalone directional signal. One China SSE50 study found Gravestone Doji over a ten-day holding period showed superior profitability only when applied as a contrarian signal — that is, the opposite of the textbook reading.",
    verdict: "contrarian",
    sources: [{ label: "Gravestone Doji profitable only as a contrary signal, 10-day hold", who: "SSE50 study, 2022" }],
  },
  {
    slug: "shooting-star", name: "Shooting star", type: "Reversal", bias: "bearish",
    candles: [[40, 46, 36, 44], [46, 50, 42, 48], [50, 78, 48, 54]],
    what: "A small body near the low of the range with a long upper shadow, after an advance.",
    claim: "Buyers pushed price up and were rejected; a top is forming.",
    evidence: "A 2022 study of SSE50 component stocks found that none of the bearish candlestick patterns examined offered predictive power. Bearish patterns fare consistently worse than bullish ones across the literature.",
    verdict: "no support",
    sources: [{ label: "None of the bearish patterns examined offered predictive power", who: "SSE50 study, 2022" }],
  },
  {
    slug: "falling-window", name: "Falling window (gap down)", type: "Continuation", bias: "bearish",
    candles: [[64, 68, 58, 60], [48, 52, 40, 42], [42, 46, 34, 36]],
    what: "A downward price gap between two candles, with no overlap of ranges.",
    claim: "A gap that is not filled signals continuation.",
    evidence: "A Thailand study found that only the Falling Window after a prevailing downtrend showed predictive power, with bearish signals indicated significantly over a five-day holding period. Notably it was the only pattern in that study that worked, and only with the trend condition attached.",
    verdict: "some support",
    sources: [{ label: "Only Falling Window after a downtrend showed predictive power, 5-day hold", who: "Stock Exchange of Thailand study, 2017" }],
  },
  {
    slug: "rising-window", name: "Rising window (gap up)", type: "Continuation", bias: "bullish",
    candles: [[36, 42, 32, 40], [50, 58, 48, 56], [58, 66, 54, 64]],
    what: "An upward price gap between two candles.",
    claim: "Unfilled upward gaps signal continuation.",
    evidence: "Ranked in the top three of one multi-criteria study alongside Hammer and long engulfing. As with those, the ranking is not a significance test.",
    verdict: "market-specific",
    sources: [{ label: "Rising window ranked top three", who: "Multi-criteria study" }],
  },
  {
    slug: "three-white-soldiers", name: "Three white soldiers", type: "Reversal", bias: "bullish",
    candles: [[34, 40, 32, 38], [38, 50, 36, 48], [48, 62, 46, 60]],
    what: "Three consecutive up candles, each opening within the prior body and closing near its high.",
    claim: "Sustained accumulation and a durable trend change.",
    evidence: "Reviews note that Marshall et al. (2006, 2008) and Horton (2009) find candlestick trading strategies have no predictive value for major equity markets. Multi-candle patterns also occur rarely, so sample sizes in any single market are small.",
    verdict: "no support",
    sources: [{ label: "No predictive value for major equity markets", who: "Marshall et al. 2006, 2008; Horton 2009" }],
  },
];

export const patternBySlug = (s: string) => PATTERNS.find((p) => p.slug === s);
export const VERDICT_TONE: Record<Pattern["verdict"], string> = {
  "some support": "supported", "market-specific": "mixed",
  "no support": "none", "contrarian": "weak",
};

/* ═══ MARKET STATISTICS / CALENDAR ANOMALIES ═══════════════════════════════ */

export type Stat = {
  name: string; claim: string; finding: string;
  status: "disappeared" | "disputed" | "structural" | "holds";
  sources: Source[];
};

export const CALENDAR_STATS: Stat[] = [
  {
    name: "Day-of-the-week effect",
    claim: "Mondays are weak and Fridays are strong in Indian equities.",
    finding: "The evidence is inconsistent and the effect appears to be fading. A 2021 study of the Nifty 50 and sector indices found no day-of-the-week effect in any of the four Nifty indices examined, though some sector indices showed month effects. Other studies report positive Monday and Wednesday effects, and a separate study found a Friday effect over 2007–2012. The studies disagree with each other more than they agree.",
    status: "disputed",
    sources: [
      { label: "No day-of-week effect in any of four Nifty indices", who: "2021 study" },
      { label: "Friday effect in Nifty returns, 2007–2012", who: "Separate study" },
    ],
  },
  {
    name: "Settlement reform killed the anomaly",
    claim: "Calendar effects are a permanent feature of markets.",
    finding: "The most interesting result in this literature. One study of the Nifty found a day-of-the-week effect BEFORE T+2 rolling settlement which disappeared afterwards. A separate study using 1999–2003 data found Monday and Friday significant before rolling settlement, with only Friday remaining after. The anomaly was largely a settlement-cycle artefact, and improving market structure removed it.",
    status: "disappeared",
    sources: [
      { label: "Day-of-week effect present before T+2 rolling settlement, absent after", who: "Nifty study" },
      { label: "Monday and Friday significant pre-reform; Friday only post-reform", who: "1999–2003 study" },
    ],
  },
  {
    name: "Diminishing calendar anomalies",
    claim: "Seasonal patterns can be traded reliably.",
    finding: "Published work on Indian equities explicitly describes calendar anomalies as diminishing. This is the expected outcome: a well-documented, easily-traded anomaly attracts capital until it is arbitraged away. The patterns that survive publication tend to be the ones that are hard to trade after costs.",
    status: "disappeared",
    sources: [{ label: "Diminishing calendar anomalies in Indian equity markets", who: "Published study, 2020" }],
  },
  {
    name: "Month-of-the-year effects",
    claim: "Specific months reliably outperform.",
    finding: "Some sector indices show month effects even where the broad indices do not. This is weak evidence: testing twelve months across many indices generates apparent effects by chance alone unless the testing is corrected for multiple comparisons, and most of this literature does not correct for it.",
    status: "disputed",
    sources: [{ label: "Some sector indices show month effects while Nifty indices do not", who: "2021 study" }],
  },
  {
    name: "Expiry-day behaviour",
    claim: "Expiry days behave differently from ordinary sessions.",
    finding: "Mechanically true and economically well founded — settlement of a large derivatives book against a cash index creates genuine, predictable order flow around the settlement window. We found no peer-reviewed Indian study quantifying the directional effect, so we treat expiry as a conditioning variable in our models rather than as a signal in itself.",
    status: "structural",
    sources: [{ label: "No peer-reviewed Indian expiry-day directional study located", who: "Literature search, Nov 2026" }],
  },
  {
    name: "Festive and wedding season gold demand",
    claim: "Indian gold demand is seasonal.",
    finding: "One of the few genuine, economically grounded seasonalities. Physical gold buying rises markedly around the festive and wedding calendar, and World Gold Council data tracks this pattern consistently year to year. It is a demand phenomenon with a real cause, not a statistical artefact.",
    status: "holds",
    sources: [{ label: "Festive and wedding seasonality in Indian physical gold demand", who: "World Gold Council" }],
  },
];

export const STAT_TONE: Record<Stat["status"], string> = {
  disappeared: "none", disputed: "weak", structural: "mixed", holds: "supported",
};
