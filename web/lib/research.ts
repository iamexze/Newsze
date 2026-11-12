/* ───────────────────────────────────────────────────────────────────────────
   RESEARCH LAYER — the explanatory content.

   IMPORTANT DISTINCTION, observed throughout this file:
     • MECHANISMS and PUBLISHED FINDINGS below are real, sourced and cited.
     • Any LIVE NUMBER rendered on the site is sample data from lib/data.ts.
   The two are kept apart deliberately: the education should be correct even
   though the demo figures are synthetic.
   ─────────────────────────────────────────────────────────────────────────── */

export type Source = { label: string; who: string; url?: string };

/* ═══ 1. GLOBAL → INDIA TRANSMISSION ═══════════════════════════════════════ */

export type Channel = {
  id: string; name: string; strength: "strong" | "moderate" | "weak" | "conditional";
  lagHours: number; window: string;
  what: string; how: string; watch: string[]; caveat: string;
  evidence?: string; sources: Source[];
  sensitivity?: { driver: string; effect: string }[];
};

export const CHANNELS: Channel[] = [
  {
    id: "us-close",
    name: "The US close",
    strength: "strong",
    lagHours: 9,
    window: "02:30 IST (US close) → 09:15 IST (India open)",
    what: "The largest single input to an Indian opening gap. The S&P 500 and Nasdaq settle at roughly 02:30 IST; India opens about seven hours later with that information already in the price.",
    how: "Transmission is one-way. Research on US and Indian index data finds unidirectional Granger causality running from the S&P 500 and Nasdaq to the Nifty, not the reverse — which is what you would expect from the time zones and the relative size of the two markets. Crucially, the same work finds that the volatility of the Nifty's OVERNIGHT return is imported from the US. The gap is the transmission window; the intraday session is substantially domestic.",
    watch: ["S&P 500 and Nasdaq closing change", "US after-hours futures", "VIX close and direction", "Sector leadership — a tech-led fall transmits differently from a bank-led one"],
    caveat: "Correlation is unstable. One brokerage estimate put the Nifty / S&P 500 correlation near 0.39 against a ten-year average of about 0.54. Studies covering 2023–2025 find correlation low on average but RISING sharply in stress periods. So the channel is weak on a quiet day and strong exactly when it matters most — which is the opposite of convenient.",
    evidence: "One 2023–2025 study attributes about 14.3% of Indian market variance to US shocks, with spillover running one way.",
    sources: [
      { label: "Granger causality US → Nifty; overnight volatility imported", who: "NSE research paper" },
      { label: "Nifty/S&P correlation 0.39 vs 0.54 ten-year average", who: "Yes Securities analysis" },
      { label: "14.3% of Indian variance from US shocks, 2023–2025", who: "Journal study on S&P 500 / Nifty spillover" },
      { label: "Strong decade-long Nifty–S&P correlation", who: "Goldman Sachs" },
    ],
  },
  {
    id: "gift",
    name: "GIFT Nifty basis",
    strength: "strong",
    lagHours: 0,
    window: "Trades while India is closed",
    what: "Nifty futures traded at GIFT City, the successor to the Singapore contract. It trades through the Indian night, so it is the only instrument that prices Indian equities continuously against overnight global news.",
    how: "Most commentary reads the GIFT level as the expected open. The more informative number is the BASIS — the premium or discount to fair value given cost of carry and days to expiry. A GIFT contract up 40 points in a market where fair value says it should be up 70 is a weak signal dressed as a positive one.",
    watch: ["Level versus the previous Nifty close", "Basis versus theoretical fair value", "Volume — a thin overnight session moves on little", "Time of the move: a 04:00 IST move on US data differs from an 08:30 IST drift"],
    caveat: "There is no peer-reviewed study establishing GIFT Nifty's predictive accuracy for the Indian open. It is widely used and weakly documented. Treat the single number repeated in morning coverage as an input, not an answer.",
    sources: [{ label: "No published study found on GIFT Nifty predictive accuracy", who: "Literature search, Nov 2026" }],
  },
  {
    id: "adr",
    name: "ADR and GDR dislocation",
    strength: "moderate",
    lagHours: 7,
    window: "US session → next Indian open",
    what: "Several large Indian companies have US-listed depositary receipts — Infosys, HDFC Bank, ICICI Bank, Wipro, Dr Reddy's among them. These trade for seven hours after the Indian close.",
    how: "Compare the ADR's US close to its Indian close, adjusted for the depositary ratio and the USD/INR move. The resulting premium or discount is a direct, security-level read on how global investors repriced that specific company overnight — not an index-level inference.",
    watch: ["Currency-adjusted ADR premium or discount", "Whether the move is name-specific or sector-wide", "ADR volume — a thin tape overstates the signal"],
    caveat: "ADR liquidity is far below the Indian line for most names. A small US order can produce a dislocation that evaporates in the first minute of Indian trade. Size matters more than direction here.",
    sensitivity: [
      { driver: "ADR discount of 1–2% on a large IT name", effect: "Historically precedes a negative Indian open in that name more often than not, with the gap typically smaller than the discount" },
    ],
    sources: [{ label: "Mechanism: depositary receipt arbitrage and currency adjustment", who: "Market structure" }],
  },
  {
    id: "crude",
    name: "Crude oil",
    strength: "strong",
    lagHours: 0,
    window: "Continuous; macro effect over quarters",
    what: "India imports roughly 85–88% of its crude. Oil is simultaneously an inflation input, a current-account item, a fiscal variable and a sector-level earnings driver.",
    how: "The dollar price is only half of it. What matters domestically is crude in RUPEE terms, which combines Brent with USD/INR — and those two often move together in the unhelpful direction, amplifying the effect.",
    watch: ["Brent in rupee terms, not dollars", "OPEC+ meeting calendar", "Marketing margins at the oil marketing companies", "Paint, tyre, aviation and logistics costs — second-order consumers"],
    caveat: "Published sensitivities vary widely by study, base price and year, and government tax choices can absorb or amplify the pass-through entirely. Treat any single coefficient as indicative.",
    evidence: "An RBI staff study estimated roughly 49 basis points on headline CPI per $10 per barrel from a $65 base — about 24bp direct and 26bp indirect. DBS put the figure lower, at 20–25bp.",
    sensitivity: [
      { driver: "+$10 / barrel → CPI", effect: "≈ +49bp headline (RBI staff study); 20–25bp (DBS)" },
      { driver: "+$10 / barrel → current account", effect: "≈ $12.5bn (RBI) · $12–13bn ≈ 0.3% of GDP (ICRA) · ≈ 0.5% of GDP (Kotak)" },
      { driver: "+$10 / barrel → GDP growth", effect: "≈ −10bp annually, on one published estimate" },
      { driver: "Sustained crude above $100", effect: "During 2011–13 the rupee lost close to 20% over eighteen months" },
    ],
    sources: [
      { label: "~49bp CPI per $10/bbl (24bp direct, 26bp indirect)", who: "RBI staff study, 2019" },
      { label: "20–25bp CPI estimate", who: "DBS" },
      { label: "Current account ≈ $12.5bn per $10", who: "RBI" },
      { label: "$12–13bn, ≈0.3% of GDP", who: "ICRA" },
      { label: "≈0.5% of GDP", who: "Kotak" },
    ],
  },
  {
    id: "dxy",
    name: "The dollar and USD/INR",
    strength: "moderate",
    lagHours: 0,
    window: "Continuous",
    what: "The dollar index sets the global risk tone for emerging-market assets, and USD/INR determines the rupee return a foreign investor actually receives.",
    how: "A rising dollar does two things at once: it raises the rupee cost of imports, and it reduces the dollar return on an unhedged Indian equity position, which mechanically discourages foreign inflows. Rate differentials against the US drive the carry on Indian debt.",
    watch: ["DXY level and direction", "USD/INR spot and the NDF premium", "RBI intervention signatures in the forex reserve series", "The India–US ten-year yield differential"],
    caveat: "RBI management of the rupee compresses observed volatility, which makes the historical relationship look weaker than the underlying economic one. A managed currency hides the pressure rather than removing it.",
    sources: [{ label: "Mechanism: unhedged FX return and carry differential", who: "Market structure" }],
  },
  {
    id: "rates",
    name: "Global rates",
    strength: "moderate",
    lagHours: 8,
    window: "US data and Fed events → next Indian session",
    what: "The US ten-year yield anchors the global discount rate. The India–US differential governs the attractiveness of Indian debt to foreign capital.",
    how: "Higher US yields compress the valuation of long-duration assets everywhere and narrow the carry on Indian bonds. The effect on Indian equities is strongest where valuations are richest and earnings are furthest out.",
    watch: ["US ten-year and two-year", "Market-implied Fed path, not the current level", "India ten-year G-Sec and the spread to the US", "Real yields rather than nominal"],
    caveat: "A rate move driven by stronger growth transmits very differently from the same move driven by an inflation scare. The level alone tells you little; the reason matters more.",
    sources: [{ label: "Mechanism: discount rate and carry", who: "Market structure" }],
  },
  {
    id: "flows",
    name: "Foreign portfolio flows",
    strength: "conditional",
    lagHours: 24,
    window: "Reported after the close, acts the following sessions",
    what: "Foreign institutional investors were historically the marginal buyer of Indian equities. They are much less so now, and that shift has changed how the whole market responds to global risk.",
    how: "The structural change is the important part. FII ownership of Nifty 50 constituents has fallen from roughly 27% in 2015 to about 18% by the end of 2024, while domestic institutions and retail have grown. Systematic investment plans provide a large, price-insensitive monthly bid that did not exist a decade ago.",
    watch: ["FII cash net, but always alongside DII net on the same day", "Participant-wise index futures positioning", "Monthly SIP inflow", "The absorption ratio: DII buying as a share of FII selling"],
    caveat: "This is the channel most over-read by retail traders. A long-run study across roughly 4,400 sessions concluded that monthly co-movement between flows and returns reflects shared drivers — liquidity, global sentiment — more than flows causing returns. Our own ledger rates this our weakest published class.",
    evidence: "Practitioner studies report that index declines were materially deeper when domestic institutions absorbed less than half of foreign outflows, and contained when absorption exceeded about 75%. Those are proprietary studies without published methodology — treat as suggestive, not established.",
    sensitivity: [
      { driver: "FII ownership of Nifty 50", effect: "≈27% in 2015 → ≈18% at end-2024" },
      { driver: "DII absorption below 50% of FII selling", effect: "Associated with materially deeper declines (unaudited practitioner study)" },
    ],
    sources: [
      { label: "~4,400-session study: flows co-move with returns, causation unclear", who: "Groww research" },
      { label: "Absorption thresholds and depth of declines", who: "NiftyTrader internal study" },
      { label: "FII ownership 27% → 18%", who: "NiftyTrader ownership data" },
    ],
  },
  {
    id: "asia",
    name: "The Asian session",
    strength: "weak",
    lagHours: 3,
    window: "05:30–09:00 IST",
    what: "Japan, Korea, Hong Kong and Australia trade in the hours immediately before India opens, and are the first markets to react to overnight US news.",
    how: "Asia is best read as a confirmation signal rather than an independent one. When Asia is simply following the US, it carries little extra information. When Asia diverges from the US lead, that divergence is the information.",
    watch: ["Nikkei, Hang Seng, KOSPI direction", "Whether Asia confirms or contradicts the US close", "China policy headlines, which are regionally specific"],
    caveat: "Treating Asia as an independent input double-counts the US signal that Asia is already reflecting. This is the single most common error in morning market commentary.",
    sources: [{ label: "Mechanism: sequential information absorption across time zones", who: "Market structure" }],
  },
];

/* ═══ 2. SIGNAL EVIDENCE ═══════════════════════════════════════════════════
   Honest ratings of what traders actually watch. The uncomfortable finding
   from the literature is that most of it has little demonstrated predictive
   power at the index level. We say so.                                      */

export type Signal = {
  name: string; family: string;
  evidence: "supported" | "mixed" | "weak" | "none";
  horizon: string; what: string; finding: string; use: string;
  sources: Source[];
};

export const SIGNALS: Signal[] = [
  {
    name: "Surprise versus consensus", family: "Macro",
    evidence: "supported", horizon: "Minutes to 1 day",
    what: "The standardised gap between a released figure and the forecast consensus.",
    finding: "The most robust input we use. Markets price expectations, so a release exactly in line with consensus is already in the price regardless of its level. The surprise is the news; the number is not.",
    use: "Primary feature in our impact estimates. Classes with a consensus baseline consistently outscore classes without one on our own ledger.",
    sources: [{ label: "Event-study literature on scheduled macro releases", who: "Standard finance" }],
  },
  {
    name: "Call–put implied volatility spread", family: "Options",
    evidence: "supported", horizon: "Weeks to a quarter",
    what: "The average difference between call and put implied volatility across single stocks.",
    finding: "One of the few option-based measures with real out-of-sample support. A study covering 1996–2015 found the cross-stock average spread explained about 12.4% of quarterly return variation out of sample.",
    use: "Note the critical qualifier: the same research found the INDEX option IV spread has no power at monthly and longer horizons. The signal lives in the cross-section of single stocks, not in the index.",
    sources: [
      { label: "Average call-put IV spread explains 12.4% of quarterly variation OOS", who: "1996–2015 study, via CXO Advisory" },
      { label: "S&P 500 index option IV spread shows no monthly+ predictive power", who: "same study" },
    ],
  },
  {
    name: "Option volume and open-interest ratios", family: "Options",
    evidence: "mixed", horizon: "Overnight to days",
    what: "Ratios built from option volume or open interest against equity volume.",
    finding: "Some support at the single-stock level and for overnight moves specifically. One measure is reported to predict directional overnight price moves in underlyings. A 2025 paper finds open-interest-based measures outperform simple put/call volume ratios.",
    use: "Evidence is concentrated at stock level and overnight horizons. It does not establish index-level timing power, which is what most retail users of these ratios assume it does.",
    sources: [
      { label: "OVI predicts directional overnight moves", who: "Options research" },
      { label: "Open-interest measures beat put/call volume ratios", who: "2025 paper" },
    ],
  },
  {
    name: "Put-call ratio", family: "Options",
    evidence: "weak", horizon: "Days",
    what: "Total put open interest divided by total call open interest.",
    finding: "Ubiquitous in Indian retail commentary and poorly supported in the literature as an index return predictor. Our literature search found no robust published evidence of aggregate PCR predicting index returns.",
    use: "We display it because it describes positioning, which is genuinely useful context. We do not treat it as a directional signal, and we publish no impact estimate from it alone.",
    sources: [{ label: "No robust published evidence located for aggregate PCR as a return predictor", who: "Literature search, Nov 2026" }],
  },
  {
    name: "Open-interest build-up classification", family: "Derivatives",
    evidence: "mixed", horizon: "Days to expiry",
    what: "The four-way read of price change against open-interest change: long build-up, short build-up, long unwinding, short covering.",
    finding: "Mechanically informative — it genuinely tells you whether new positions are being opened or old ones closed. Whether it predicts the next move is a separate and much weaker claim.",
    use: "We publish estimates on extreme readings only, ranked against the symbol's own 250-day history, and always with the sample size shown. Mid-range readings carry no estimate.",
    sources: [{ label: "Mechanism: position accounting", who: "Market structure" }],
  },
  {
    name: "Market breadth", family: "Technical",
    evidence: "none", horizon: "Days to weeks",
    what: "Advance-decline lines, percentage of constituents above a moving average, new highs versus new lows.",
    finding: "Our literature search returned no quality published evidence on breadth as a market-return predictor. Absence of evidence is not evidence of absence — but it is also not a reason to publish an estimate.",
    use: "Displayed as description of internal participation. No impact estimate is computed from breadth.",
    sources: [{ label: "No quality evidence located", who: "Literature search, Nov 2026" }],
  },
  {
    name: "Institutional flow data", family: "Flows",
    evidence: "weak", horizon: "Days",
    what: "Daily FII and DII net buying in the cash segment.",
    finding: "A long-run study over roughly 4,400 Indian sessions concluded that monthly co-movement reflects shared drivers rather than flows causing returns. Our own ledger rates this our weakest published class, at a hit rate barely above a coin flip.",
    use: "Published with its 57.8% hit rate shown, which is close enough to random that the honest reading is: context, not signal.",
    sources: [{ label: "~4,400-session study of flows and returns", who: "Groww research" }],
  },
  {
    name: "Cross-market overnight transmission", family: "Global",
    evidence: "supported", horizon: "The opening gap",
    what: "US close, Asian session, ADR dislocation, currency and crude, combined into an expected Indian open.",
    finding: "The best-supported of the directional channels we use. Research finds the Nifty's overnight return volatility is imported from the US, and that spillover is one-way.",
    use: "This is what the Overnight Bridge is built on, and it is scored publicly every trading morning.",
    sources: [{ label: "Overnight volatility imported from US; unidirectional causality", who: "NSE research paper" }],
  },
  {
    name: "Valuation versus bond yield", family: "Valuation",
    evidence: "mixed", horizon: "Quarters to years",
    what: "Index earnings yield compared with the government bond yield.",
    finding: "Has some long-horizon explanatory power for returns and essentially none at trading horizons. Useful for allocation, useless for a trading week.",
    use: "Shown on the valuation page with explicit percentile context. No short-horizon estimate is computed.",
    sources: [{ label: "Long-horizon valuation literature", who: "Standard finance" }],
  },
  {
    name: "Narrative momentum", family: "Sentiment",
    evidence: "none", horizon: "Unknown",
    what: "Share of market conversation given to a theme, and its rate of change.",
    finding: "Interesting, measurable, and never cleared our calibration bar as a standalone directional input.",
    use: "Published as description only. No estimate is derived from narrative data alone.",
    sources: [{ label: "Internal calibration testing", who: "Newze" }],
  },
];

export const EVIDENCE_LABEL: Record<Signal["evidence"], { t: string; tone: string }> = {
  supported: { t: "Evidence supports", tone: "up" },
  mixed: { t: "Mixed evidence", tone: "warn" },
  weak: { t: "Weak evidence", tone: "down" },
  none: { t: "No evidence found", tone: "down" },
};

/* ═══ 3. FORECAST AGGREGATION ══════════════════════════════════════════════
   What predictors are saying, and how right they have been. Sample data —
   the forecasters are illustrative, not real institutions.                  */

export type Forecaster = {
  id: string; name: string; kind: "Brokerage" | "Bank" | "Model" | "Survey" | "Market-implied" | "Newze";
  view: "up" | "down" | "neutral"; target?: string; horizon: string; asOf: string;
  rationale: string;
  record: { n: number; hit: number; brier: number; bias: "bullish" | "bearish" | "balanced" };
};

export const FORECASTERS: Forecaster[] = [
  { id: "f1", name: "Meridian Securities", kind: "Brokerage", view: "up", target: "Nifty 26,400", horizon: "12 months", asOf: "08 Nov 2026",
    rationale: "Earnings recovery in financials and a domestic flow base that no longer depends on foreign participation.",
    record: { n: 48, hit: 0.563, brier: 0.238, bias: "bullish" } },
  { id: "f2", name: "Arcus Capital", kind: "Bank", view: "down", target: "Nifty 23,100", horizon: "6 months", asOf: "11 Nov 2026",
    rationale: "Valuations in the top decile against the earnings-yield-to-bond-yield spread; margin pressure from crude.",
    record: { n: 41, hit: 0.610, brier: 0.219, bias: "bearish" } },
  { id: "f3", name: "Consensus of 34 brokerages", kind: "Survey", view: "up", target: "Nifty 25,800", horizon: "12 months", asOf: "10 Nov 2026",
    rationale: "Median of published year-end targets. Dispersion is unusually wide, at ±8.2%.",
    record: { n: 96, hit: 0.542, brier: 0.247, bias: "bullish" } },
  { id: "f4", name: "Options-implied distribution", kind: "Market-implied", view: "neutral", target: "±4.1% to expiry", horizon: "15 days",
    asOf: "12 Nov 2026",
    rationale: "Risk-neutral distribution from the Nifty option chain. Slight put skew; no directional tilt beyond it.",
    record: { n: 412, hit: 0.588, brier: 0.224, bias: "balanced" } },
  { id: "f5", name: "Trend-following model", kind: "Model", view: "up", horizon: "20 days", asOf: "12 Nov 2026",
    rationale: "Price above the 50 and 200 day averages; breadth confirming at 58% of constituents above their 50-day.",
    record: { n: 288, hit: 0.551, brier: 0.243, bias: "bullish" } },
  { id: "f6", name: "Mean-reversion model", kind: "Model", view: "down", horizon: "5 days", asOf: "12 Nov 2026",
    rationale: "Two-standard-deviation extension from the 20-day mean with India VIX in the bottom quartile.",
    record: { n: 306, hit: 0.579, brier: 0.231, bias: "bearish" } },
  { id: "f7", name: "Newze Overnight Bridge", kind: "Newze", view: "down", target: "Open 24,310", horizon: "Next open", asOf: "12 Nov 2026",
    rationale: "US close and the Fed guidance surprise dominate the attribution; partly offset by a firmer rupee.",
    record: { n: 212, hit: 0.642, brier: 0.198, bias: "balanced" } },
  { id: "f8", name: "Retail sentiment poll", kind: "Survey", view: "up", horizon: "1 week", asOf: "12 Nov 2026",
    rationale: "68% of respondents expect a higher close next Friday. Historically contrarian at extremes.",
    record: { n: 142, hit: 0.481, brier: 0.264, bias: "bullish" } },
  { id: "f9", name: "Macro nowcast model", kind: "Model", view: "neutral", horizon: "1 quarter", asOf: "09 Nov 2026",
    rationale: "Growth tracking near trend with inflation inside the band; no directional tilt from the macro state alone.",
    record: { n: 64, hit: 0.531, brier: 0.249, bias: "balanced" } },
  { id: "f10", name: "Northfield Research", kind: "Brokerage", view: "up", target: "Nifty 26,900", horizon: "12 months", asOf: "05 Nov 2026",
    rationale: "Capex cycle and PSU bank re-rating; assumes crude stays below $80.",
    record: { n: 52, hit: 0.519, brier: 0.254, bias: "bullish" } },
];

/* ═══ 4. VALUATION & REGIME ════════════════════════════════════════════════ */

export const VALUATION = [
  { metric: "Nifty 50 P/E (trailing)", value: 22.4, pctile: 71, avg10: 23.1, note: "Above the ten-year mean, below the 2021 extreme" },
  { metric: "Nifty 50 P/B", value: 3.6, pctile: 68, avg10: 3.3, note: "" },
  { metric: "Earnings yield", value: 4.46, pctile: 29, avg10: 4.33, note: "Inverse of P/E, in percent" },
  { metric: "10-year G-Sec yield", value: 6.74, pctile: 41, avg10: 7.02, note: "" },
  { metric: "Earnings yield − bond yield", value: -2.28, pctile: 24, avg10: -2.69, note: "Negative spread: bonds yield more than equity earnings" },
  { metric: "Nifty Midcap P/E", value: 31.8, pctile: 84, avg10: 26.4, note: "Top-quintile, the stretched part of the market" },
  { metric: "Market cap to GDP", value: 1.32, pctile: 78, avg10: 1.04, note: "Buffett ratio" },
  { metric: "Dividend yield", value: 1.14, pctile: 22, avg10: 1.36, note: "" },
];

export const REGIMES = [
  { name: "Risk-on", from: "Mar 2026", to: "Present", nifty: 8.4, vix: 13.9, breadth: 0.58, active: true,
    desc: "Low volatility, positive breadth, domestic flows dominant. Global correlation suppressed." },
  { name: "Disinflation", from: "Sep 2025", to: "Mar 2026", nifty: 11.2, vix: 12.4, breadth: 0.64, active: false,
    desc: "Falling inflation prints across both India and the US; rate-sensitive sectors led." },
  { name: "Risk-off", from: "May 2025", to: "Sep 2025", nifty: -9.1, vix: 22.6, breadth: 0.27, active: false,
    desc: "Global correlation spiked. US transmission at its strongest in the sample." },
  { name: "Stagflation scare", from: "Nov 2024", to: "May 2025", nifty: -3.4, vix: 18.2, breadth: 0.38, active: false,
    desc: "Crude above $95 with sticky core inflation; margin compression across consumption." },
];

/* ═══ 5. STUDY HUB ═════════════════════════════════════════════════════════ */

export type Lesson = {
  slug: string; title: string; dek: string; level: "Foundation" | "Intermediate" | "Advanced";
  minutes: number; topic: string;
  body: { h?: string; p?: string; list?: string[]; callout?: string }[];
};

export const LESSONS: Lesson[] = [
  {
    slug: "why-surprise-beats-the-number", title: "Why the surprise matters more than the number",
    dek: "An inflation print of 4.4% is not news. An inflation print of 4.4% against a 4.7% forecast is.",
    level: "Foundation", minutes: 6, topic: "Macro",
    body: [
      { p: "The most common mistake in reading market news is treating the level of a figure as the event. Markets are forward-looking pricing machines: by the time a scheduled release arrives, the consensus expectation is already reflected in prices. What moves the market is the difference between what arrived and what was expected." },
      { h: "Standardising the surprise" },
      { p: "A miss of 0.3 percentage points on inflation is enormous. A miss of 0.3 percentage points on a volatile industrial production series is unremarkable. To compare them we divide the forecast error by the historical dispersion of forecast errors for that series, giving a standardised surprise in units of standard deviation." },
      { p: "A surprise of plus or minus 1.5 sigma or more sits in roughly the top decile. That is the threshold at which we expect a measurable market response." },
      { callout: "An event with no consensus baseline is a weaker event, not a stronger one. Our impact estimates for classes without a consensus consistently score worse than those with one — which is why we buy forecast data rather than skipping it." },
      { h: "Where this breaks down" },
      { p: "The consensus has to be genuine. A median of four forecasts is noise. Revised figures released alongside the headline can swamp the surprise in the headline itself. And a surprise in the forward guidance accompanying a decision frequently matters more than the decision — a rate cut exactly as forecast, with a guidance change nobody expected, is a hawkish event despite being a cut." },
    ],
  },
  {
    slug: "reading-open-interest", title: "Reading open interest without fooling yourself",
    dek: "The four-way build-up classification is mechanical and useful. What people infer from it usually is not.",
    level: "Intermediate", minutes: 8, topic: "Derivatives",
    body: [
      { p: "Open interest is the number of derivative contracts currently outstanding. Combined with the price change over the same period, it tells you whether money is entering or leaving a position — and in which direction." },
      { h: "The four cases" },
      { list: [
        "Price up, OI up — long build-up. New money is going long.",
        "Price down, OI up — short build-up. New money is going short.",
        "Price down, OI down — long unwinding. Existing longs are closing.",
        "Price up, OI down — short covering. Existing shorts are closing.",
      ] },
      { p: "This classification is accounting, not forecasting. It describes what has already happened with a high degree of reliability. The leap most commentary makes — that a short build-up implies a further fall, or that it implies a squeeze — is a much weaker claim and is usually asserted without evidence." },
      { h: "Rank it against itself" },
      { p: "A 12% open-interest increase means something completely different in Bank Nifty than in a mid-cap with a tenth of the liquidity. Any cross-symbol comparison of raw OI change is meaningless. The only useful normalisation is against that symbol's own history — which is why every percentile on this site is a within-symbol, 250-day rank." },
      { callout: "We publish impact estimates on extreme build-up readings only, with the sample size shown, and the samples are small. Mid-range readings carry no estimate because we have no evidence they carry information." },
    ],
  },
  {
    slug: "how-the-overnight-gap-forms", title: "How the overnight gap forms",
    dek: "Seven hours of global trading happen while India sleeps. The gap is where that information lands.",
    level: "Intermediate", minutes: 9, topic: "Global",
    body: [
      { p: "The Indian cash market trades for about six and a quarter hours a day. The other seventeen and three-quarter hours are not empty: the US trades, Europe trades, Asia trades, currencies and commodities trade continuously, and Nifty futures trade at GIFT City throughout." },
      { p: "All of that information has to enter Indian prices somewhere, and it enters at the open. That is what the opening gap is." },
      { h: "The evidence" },
      { p: "Research on US and Indian index data finds unidirectional Granger causality running from the S&P 500 and Nasdaq to the Nifty — and, more usefully, that the volatility of the Nifty's overnight return is imported from the US. The gap is the transmission window; the intraday session is substantially domestic." },
      { p: "One study covering 2023 to 2025 attributes about 14.3% of Indian market variance to US shocks, with the spillover running one way." },
      { h: "Why correlation estimates disagree" },
      { p: "Published correlation figures for the Nifty against the S&P 500 range widely depending on the window. A recent brokerage estimate put it near 0.39 against a ten-year average of about 0.54. Dynamic studies find correlation low on average but rising sharply during stress." },
      { callout: "That last point is the practically important one: the channel is weakest on quiet days and strongest in a crisis. Any model fitted on calm periods will understate exactly the episodes that matter." },
      { h: "Decomposing the gap" },
      { p: "Rather than quoting a single GIFT Nifty number, decompose: the US close, the Asian session, the GIFT basis against fair value, ADR dislocation on large names, the dollar and the rupee, crude in rupee terms, global rates, and any overnight events. Each contributes a signed quantity, and the components should sum to the estimate. If they don't, the model has a residual it is not explaining — and that residual should be shown, not hidden." },
    ],
  },
  {
    slug: "what-actually-predicts-direction", title: "What actually predicts direction, and what doesn't",
    dek: "Most of what the market watches has no demonstrated index-level predictive power. Here is the honest scoreboard.",
    level: "Advanced", minutes: 11, topic: "Analytics",
    body: [
      { p: "Traders watch a standard set of indicators: put-call ratio, open-interest build-up, advance-decline breadth, FII flows, moving averages, volatility indices. It is worth asking which of these actually has published evidence behind it as a predictor of index direction. The answer is uncomfortable." },
      { h: "What has support" },
      { p: "The surprise component of scheduled macro releases is well supported by decades of event-study work. Cross-market overnight transmission is supported — the overnight volatility import result is a real finding. And the cross-stock average call-minus-put implied volatility spread has genuine out-of-sample support: one study covering 1996 to 2015 found it explained about 12.4% of quarterly return variation out of sample." },
      { callout: "The same study found that the INDEX option implied volatility spread has no predictive power at monthly and longer horizons. The signal lives in the cross-section of individual stocks, not in the index — which is the opposite of how most people use option-implied measures." },
      { h: "What is mixed" },
      { p: "Option volume and open-interest ratios have some support, concentrated at the single-stock level and at overnight horizons. A 2025 paper finds open-interest-based measures outperform simple put-call volume ratios. None of this establishes index-level timing power." },
      { p: "There is also a sobering structural result: research finds option prices do not predict returns among stocks that are easy to borrow, implying much of the apparent predictive power in option-based signals reflects short-sale constraints rather than information about direction." },
      { h: "What has little or none" },
      { p: "We could not locate robust published evidence for the aggregate put-call ratio as an index return predictor, nor quality evidence on advance-decline breadth. A long-run study across roughly 4,400 Indian sessions concluded that co-movement between institutional flows and returns reflects shared drivers rather than flows causing returns." },
      { h: "What to do with this" },
      { p: "Not: stop looking at these measures. They describe positioning and participation, which is real information about the state of the market. But description is not prediction, and the gap between the two is where most trading losses live." },
      { p: "Our own ledger makes the same point from the other direction. Our best-scoring event class clears 67% directional accuracy at one day. Our worst published class sits at 57.8%, close enough to a coin flip that we show the number rather than the claim. Two classes have been suppressed entirely for falling below the bar." },
    ],
  },
  {
    slug: "crude-and-the-indian-market", title: "Crude oil and the Indian market",
    dek: "India imports most of its oil. The transmission runs through inflation, the current account, the rupee and margins — all at once.",
    level: "Foundation", minutes: 7, topic: "Macro",
    body: [
      { p: "India imports roughly 85 to 88 percent of the crude it consumes. That single fact makes oil one of the few variables that affects Indian inflation, the external balance, the currency, the fiscal position and corporate margins simultaneously." },
      { h: "Published sensitivities" },
      { p: "An RBI staff study estimated that a $10 per barrel increase from a $65 base adds roughly 49 basis points to headline CPI — about 24 basis points directly through fuel and 26 basis points indirectly through transport and input costs. DBS has put the figure lower, at 20 to 25 basis points." },
      { p: "On the external side, the RBI has estimated the cost at about $12.5 billion a year per $10. ICRA's estimate is $12 to 13 billion, widening the current account deficit by roughly 0.3 percent of GDP; Kotak's is higher at about 0.5 percent. One estimate puts the growth effect at around 10 basis points off annual GDP." },
      { callout: "These estimates come from different years, different base prices and different assumptions. They also depend heavily on how government absorbs the shock through fuel taxation. Treat any single coefficient as indicative, not precise." },
      { h: "Crude in rupees, not dollars" },
      { p: "The dollar price is only half the story. The rupee cost combines Brent with USD/INR, and the two frequently move together unhelpfully: a higher oil price raises dollar demand for imports, which weakens the rupee, which raises the rupee cost further. During 2011 to 2013, with crude sustained above $100, the rupee lost close to 20 percent over eighteen months." },
      { h: "Sector transmission" },
      { p: "Oil marketing companies see margin compression when retail prices are not adjusted. Paints, tyres, aviation, logistics and chemicals all carry crude derivatives as direct inputs. Consumption names face second-order pressure as fuel costs reduce discretionary spending. The effect is not uniform, and the sector dispersion often matters more than the index move." },
    ],
  },
  {
    slug: "reading-a-confidence-band", title: "How to read a confidence band",
    dek: "A point estimate inside a wide band is a weak statement. Most of our estimates are weak statements, and we would rather say so.",
    level: "Foundation", minutes: 5, topic: "Analytics",
    body: [
      { p: "When this site says Bank Nifty, one day, minus 0.41 percent, with a 68 percent range of minus 1.3 to plus 0.5, almost all of the meaning is in the range rather than the point." },
      { h: "What the numbers mean" },
      { p: "The point estimate is the central tendency of historical outcomes after similar events. The 68 percent band is where two-thirds of those historical outcomes fell. The probability of an upward move is simply the share that were positive. The sample size is how many such events we found." },
      { p: "A tilt of 0.41 percent inside a band nearly two percentage points wide is a weak statement. It says the distribution leans slightly negative, not that the market will fall." },
      { h: "Confidence is calibration, not conviction" },
      { p: "The confidence figure is not an opinion about how sure we feel. It is a calibrated probability: a set of estimates published at 0.60 confidence should be correct about 60 percent of the time. Our track record page shows whether they are, by bucket." },
      { callout: "When the sample is too small or the event class has lost calibration, we publish no number at all and say so. That empty state appears often. It is a feature of an honest system, not a gap in a dishonest one." },
    ],
  },
];

export const lessonBySlug = (s: string) => LESSONS.find((l) => l.slug === s);
export const channelById = (id: string) => CHANNELS.find((c) => c.id === id);
