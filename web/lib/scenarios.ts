/* ───────────────────────────────────────────────────────────────────────────
   SCENARIOS — "if this, then what followed"

   A conditional outlook board. Each scenario states a trigger condition, the
   belief traders commonly hold about it, and the historical distribution of
   what actually followed for Indian instruments.

   These are DESCRIPTIONS OF HISTORY, not forecasts. Several of the most widely
   repeated beliefs come out backwards, and those are the valuable rows.

   Distributions are sample data. The MECHANISMS and the cited research behind
   each verdict are real — see lib/research.ts and lib/factors.ts.
   ─────────────────────────────────────────────────────────────────────────── */

export type Outcome = {
  instrument: string; horizon: string;
  up: number;            // share of historical cases that rose
  median: number;        // median % move
  b68: [number, number];
  n: number; conf: number;
};

export type Scenario = {
  slug: string; group: string;
  trigger: string; triggerShort: string;
  belief: string;                       // what traders commonly assume
  verdict: "confirmed" | "contradicted" | "partly" | "too-weak";
  finding: string;                      // what the data says
  why: string;                          // the mechanism
  outcomes: Outcome[];
  live: boolean;                        // currently active in the sample data
  liveNote?: string;
};

export const SCENARIOS: Scenario[] = [
  {
    slug: "us-selloff", group: "Global equities",
    trigger: "S&P 500 falls more than 1% in the US session",
    triggerShort: "US falls >1%",
    belief: "A global sell-off is a buying opportunity in India because India is a domestic-demand story that decouples from Wall Street.",
    verdict: "contradicted",
    finding: "India falls with it, and falls harder in exactly the episodes where decoupling is claimed. Dynamic studies find the Nifty / S&P correlation is low on average but RISES SHARPLY during stress. Research also finds the Nifty's overnight return volatility is imported from the US, with causality running one way. The decoupling story is true on quiet days, when it does not matter, and false on violent ones, when it does.",
    why: "Transmission happens in the opening gap, not during the Indian session. Foreign investors reduce emerging-market exposure as a block during risk-off, regardless of local fundamentals.",
    outcomes: [
      { instrument: "IDX:NIFTY50", horizon: "next open", up: 0.21, median: -0.74, b68: [-1.62, 0.08], n: 218, conf: 0.72 },
      { instrument: "IDX:NIFTYBANK", horizon: "next open", up: 0.19, median: -0.91, b68: [-2.04, 0.12], n: 218, conf: 0.70 },
      { instrument: "IDX:NIFTY50", horizon: "1d close", up: 0.34, median: -0.42, b68: [-1.48, 0.71], n: 218, conf: 0.58 },
      { instrument: "IDX:NIFTY50", horizon: "5d", up: 0.47, median: -0.11, b68: [-2.90, 2.64], n: 216, conf: 0.38 },
    ],
    live: false,
  },
  {
    slug: "crude-falls", group: "Commodities",
    trigger: "Brent falls more than 3% over two sessions",
    triggerShort: "Crude −3%",
    belief: "Falling crude is good for India.",
    verdict: "confirmed",
    finding: "This is the cleanest positive relationship in the set, and the one piece of widely held intuition that the data supports. India imports 85–88% of the crude it consumes, so a fall is a direct transfer to the importing economy. The effect is strongest in oil-consuming sectors and in the currency, and weakest at the index level because upstream producers offset part of it.",
    why: "Lower crude reduces the import bill, narrows the current-account deficit, eases imported inflation and widens margins for every crude-consuming industry. An RBI staff study put the CPI sensitivity near 49bp per $10 per barrel.",
    outcomes: [
      { instrument: "IDX:NIFTY50", horizon: "1d", up: 0.63, median: 0.34, b68: [-0.42, 1.08], n: 164, conf: 0.64 },
      { instrument: "FX:USDINR", horizon: "1d", up: 0.31, median: -0.18, b68: [-0.48, 0.14], n: 164, conf: 0.66 },
      { instrument: "NSE:MARUTI", horizon: "5d", up: 0.68, median: 1.42, b68: [-1.10, 3.90], n: 158, conf: 0.59 },
      { instrument: "NSE:ONGC", horizon: "1d", up: 0.28, median: -1.18, b68: [-2.60, 0.34], n: 164, conf: 0.67 },
    ],
    live: true,
    liveNote: "Brent is up 2.1% on the OPEC+ delay — this scenario is currently inverted.",
  },
  {
    slug: "dollar-weakens", group: "Currency",
    trigger: "Dollar index falls more than 0.5% in a session",
    triggerShort: "DXY −0.5%",
    belief: "A weaker dollar is good for India and the rupee strengthens.",
    verdict: "partly",
    finding: "Directionally right, materially weaker than assumed. The rupee does firm, but far less than the dollar move, because the RBI manages the exchange rate and absorbs much of the pressure in reserves rather than in the rate. The equity effect is real but small at the index level, and larger in rate-sensitive and import-heavy sectors.",
    why: "A weaker dollar improves unhedged returns for foreign investors and lowers the rupee cost of dollar-priced imports. Managed-currency intervention compresses the observed move, so the statistical relationship looks weaker than the economic one.",
    outcomes: [
      { instrument: "FX:USDINR", horizon: "1d", up: 0.27, median: -0.14, b68: [-0.36, 0.09], n: 302, conf: 0.68 },
      { instrument: "IDX:NIFTY50", horizon: "1d", up: 0.58, median: 0.21, b68: [-0.52, 0.94], n: 302, conf: 0.54 },
      { instrument: "NSE:INFY", horizon: "1d", up: 0.39, median: -0.38, b68: [-1.42, 0.64], n: 298, conf: 0.56 },
      { instrument: "IDX:NIFTYBANK", horizon: "5d", up: 0.61, median: 0.68, b68: [-1.80, 3.10], n: 296, conf: 0.44 },
    ],
    live: true,
    liveNote: "DXY is soft after the CPI undershoot — partially active.",
  },
  {
    slug: "risk-off-signature", group: "Cross-asset",
    trigger: "Gold and crude both rise more than 1.5% while the dollar firms",
    triggerShort: "Gold + crude + DXY all up",
    belief: "Gold rising is a hedge, so the portfolio is protected.",
    verdict: "confirmed",
    finding: "This combination is the clearest risk-off signature in the data and the worst of all worlds for India specifically. Gold and crude are the two largest import lines; both rising while the dollar firms raises the import bill three ways at once. Indian equity underperforms global equity in these windows rather than holding up.",
    why: "Gold up means flight to safety. Crude up means supply fear. The dollar firming means capital moving to the US. For a large net commodity importer with an open capital account, all three are negative simultaneously.",
    outcomes: [
      { instrument: "IDX:NIFTY50", horizon: "1d", up: 0.26, median: -0.58, b68: [-1.44, 0.26], n: 88, conf: 0.63 },
      { instrument: "FX:USDINR", horizon: "5d", up: 0.74, median: 0.42, b68: [-0.12, 0.98], n: 86, conf: 0.66 },
      { instrument: "IDX:NIFTY50", horizon: "5d", up: 0.38, median: -0.94, b68: [-3.20, 1.42], n: 86, conf: 0.47 },
      { instrument: "IDX:INDIAVIX", horizon: "1d", up: 0.71, median: 4.80, b68: [-1.40, 11.60], n: 88, conf: 0.61 },
    ],
    live: false,
  },
  {
    slug: "us-yields-spike", group: "Rates",
    trigger: "US 10-year yield rises more than 10bp in a session",
    triggerShort: "US 10Y +10bp",
    belief: "Rate moves matter for bonds, not for Indian equities.",
    verdict: "contradicted",
    finding: "Indian equity is more sensitive to the US discount rate than most Indian traders assume, because the market carries a growth premium and therefore long-dated cash flows. The effect concentrates in the highest-multiple names, not in the index average, so an index-level check understates it badly.",
    why: "A higher risk-free rate compresses the present value of distant earnings. It also narrows the India–US carry, which slows debt inflows and pressures the rupee.",
    outcomes: [
      { instrument: "IDX:NIFTY50", horizon: "1d", up: 0.36, median: -0.31, b68: [-1.04, 0.44], n: 246, conf: 0.59 },
      { instrument: "IDX:MIDCAP", horizon: "1d", up: 0.31, median: -0.52, b68: [-1.62, 0.58], n: 244, conf: 0.57 },
      { instrument: "FX:USDINR", horizon: "1d", up: 0.68, median: 0.16, b68: [-0.08, 0.42], n: 246, conf: 0.64 },
      { instrument: "IDX:NIFTYBANK", horizon: "1d", up: 0.44, median: -0.14, b68: [-1.10, 0.86], n: 246, conf: 0.48 },
    ],
    live: true,
    liveNote: "Yields rose on the hawkish dot plot — active now.",
  },
  {
    slug: "fii-sell-dii-absorb", group: "Flows",
    trigger: "FII net selling above ₹3,000 crore with DII buying more than they sell",
    triggerShort: "FII sell, DII absorb",
    belief: "Heavy foreign selling means the market falls.",
    verdict: "too-weak",
    finding: "Close to a coin flip, and this is our weakest published class at 57.8% on the ledger. The structural reason is that foreign ownership of Nifty 50 constituents fell from roughly 27% in 2015 to about 18% by end-2024 while domestic flows grew. A long-run study across roughly 4,400 sessions concluded that flows and returns co-move because of shared drivers rather than flows causing returns.",
    why: "Record systematic investment plan inflows create a large, price-insensitive domestic bid that absorbs foreign selling. The same foreign outflow that moved the index sharply in 2013 barely registers now.",
    outcomes: [
      { instrument: "IDX:NIFTY50", horizon: "1d", up: 0.48, median: -0.08, b68: [-0.84, 0.66], n: 602, conf: 0.39 },
      { instrument: "IDX:NIFTY50", horizon: "5d", up: 0.46, median: -0.14, b68: [-2.10, 1.78], n: 598, conf: 0.38 },
      { instrument: "IDX:MIDCAP", horizon: "5d", up: 0.42, median: -0.44, b68: [-2.80, 1.94], n: 596, conf: 0.41 },
    ],
    live: true,
    liveNote: "FII −₹2,140cr with DII +₹2,980cr today — active, and historically uninformative.",
  },
  {
    slug: "vix-spike", group: "Volatility",
    trigger: "VIX rises more than 20% in a session",
    triggerShort: "VIX +20%",
    belief: "US volatility spikes do not reach India.",
    verdict: "contradicted",
    finding: "India VIX follows, and the correlation between the two markets rises at exactly this moment. This is the mechanism behind the decoupling illusion: markets look independent in calm periods and converge in stress, so any diversification benefit disappears precisely when it is needed.",
    why: "Volatility is the component of the US signal that transmits most reliably to India — more reliably than direction. Research finds Nifty overnight return volatility is imported from the US.",
    outcomes: [
      { instrument: "IDX:INDIAVIX", horizon: "next open", up: 0.78, median: 8.40, b68: [1.20, 17.80], n: 142, conf: 0.74 },
      { instrument: "IDX:NIFTY50", horizon: "next open", up: 0.24, median: -0.86, b68: [-1.94, 0.18], n: 142, conf: 0.69 },
      { instrument: "IDX:NIFTY50", horizon: "5d", up: 0.52, median: 0.18, b68: [-3.40, 3.80], n: 140, conf: 0.34 },
    ],
    live: false,
  },
  {
    slug: "msci-inclusion", group: "Index flows",
    trigger: "MSCI announces an index inclusion for a stock",
    triggerShort: "MSCI inclusion",
    belief: "Buy on the effective date when the passive money arrives.",
    verdict: "contradicted",
    finding: "Most of the move happens in the ANNOUNCEMENT window, not on the effective date. Active managers position ahead of the mechanical buying, so by the time passive funds transact the move is frequently complete or already reversing. Buying on the effective date is systematically late.",
    why: "MSCI publishes changes in advance. Forced passive flow is the most predictable order flow in markets, which is exactly why it is front-run.",
    outcomes: [
      { instrument: "IDX:NIFTY50", horizon: "announcement→effective", up: 0.71, median: 4.20, b68: [-1.40, 9.80], n: 96, conf: 0.61 },
      { instrument: "IDX:NIFTY50", horizon: "effective+5d", up: 0.42, median: -1.10, b68: [-4.60, 2.40], n: 94, conf: 0.52 },
    ],
    live: true,
    liveNote: "November review announced — four additions in the window.",
  },
  {
    slug: "cpi-undershoot", group: "Macro",
    trigger: "India CPI prints more than 1σ below consensus",
    triggerShort: "CPI miss >1σ",
    belief: "Lower inflation means the RBI cuts and the market rallies.",
    verdict: "partly",
    finding: "Bonds respond cleanly; equity much less so. The G-Sec yield falls on roughly two-thirds of occasions. The index effect is positive but small and swamped by whatever else is happening globally that day — the surprise is real information, but it competes with a much larger global signal.",
    why: "A downside surprise widens the room for policy easing, which is a direct bond input. Equity has to weigh it against global rates, the currency and earnings.",
    outcomes: [
      { instrument: "RT:IN10Y", horizon: "1d", up: 0.29, median: -1.80, b68: [-4.40, 0.20], n: 46, conf: 0.67 },
      { instrument: "IDX:NIFTYBANK", horizon: "1d", up: 0.63, median: 0.38, b68: [-0.44, 1.26], n: 46, conf: 0.60 },
      { instrument: "IDX:NIFTY50", horizon: "1d", up: 0.59, median: 0.21, b68: [-0.32, 0.78], n: 46, conf: 0.57 },
    ],
    live: true,
    liveNote: "October CPI came in 1.8σ below consensus — active.",
  },
  {
    slug: "china-stimulus", group: "Global equities",
    trigger: "China announces major policy stimulus",
    triggerShort: "China stimulus",
    belief: "Chinese stimulus lifts all emerging markets including India.",
    verdict: "contradicted",
    finding: "Indian equity frequently falls on Chinese good news. Global allocators treat India and China as substitutes inside a fixed emerging-market allocation, so money rotates out of India into China with nothing happening in India at all. Indian metal producers do benefit from the commodity leg.",
    why: "Portfolio substitution inside a fixed EM weight. This is the channel most often missed, and it makes Indian weakness on Chinese strength look irrational until you see the allocation mechanics.",
    outcomes: [
      { instrument: "IDX:NIFTY50", horizon: "5d", up: 0.41, median: -0.62, b68: [-2.90, 1.84], n: 62, conf: 0.48 },
      { instrument: "NSE:TATASTEEL", horizon: "5d", up: 0.66, median: 2.14, b68: [-2.20, 6.40], n: 62, conf: 0.55 },
      { instrument: "IDX:HSI", horizon: "5d", up: 0.73, median: 3.80, b68: [-1.60, 9.20], n: 62, conf: 0.60 },
    ],
    live: false,
  },
];

export const scenarioBySlug = (s: string) => SCENARIOS.find((x) => x.slug === s);

export const VERDICT_META: Record<Scenario["verdict"], { label: string; tone: string }> = {
  confirmed: { label: "Belief holds", tone: "supported" },
  contradicted: { label: "Belief is backwards", tone: "weak" },
  partly: { label: "Partly true, weaker than assumed", tone: "mixed" },
  "too-weak": { label: "Too weak to act on", tone: "none" },
};

/* ═══ GLOBAL RISK MOOD ═════════════════════════════════════════════════════
   A composite of six observable inputs, each contributing a signed score.
   It is a description of current conditions, not a forecast.               */

export const MOOD = {
  score: -18,            // −100 (maximum risk-off) … +100 (maximum risk-on)
  label: "Mildly risk-off",
  changed: -11,          // vs yesterday
  components: [
    { k: "Equity volatility", v: -14, note: "VIX 16.4, India VIX 13.9 — both below median but rising" },
    { k: "Credit spreads", v: 8, note: "HY near cycle tights, no stress" },
    { k: "Gold vs crude", v: -22, note: "Both bid together — the risk-off signature" },
    { k: "Dollar", v: -16, note: "DXY firm after the hawkish guidance" },
    { k: "Rates direction", v: -19, note: "US 10Y up on the dot plot" },
    { k: "EM flows", v: -7, note: "FII selling, absorbed domestically" },
  ],
  history: [12, 18, 9, -4, 2, 14, 21, 16, 6, -8, -3, 5, 11, -2, -7, -14, -9, 4, -1, -7, -18],
};
