/* ───────────────────────────────────────────────────────────────────────────
   EXPLAIN — every statistic on this site, in plain language, with the factors
   that move it.

   The product idea: a number is useless until you know what changes it. Each
   entry answers four questions in order —
     1. What is it, in one sentence a beginner understands?
     2. How is it calculated?
     3. What moves it, and in which direction?
     4. What is the common misreading?

   Drivers carry a weight (rough share of day-to-day variation) so the reader
   can see which factor actually matters rather than treating all of them as
   equal. Weights are indicative.
   ─────────────────────────────────────────────────────────────────────────── */

export type Driver = {
  name: string; dir: "raises" | "lowers" | "either"; weight: number; note: string;
  link?: string;
};

export type Metric = {
  slug: string; name: string; short: string; group: string;
  plain: string;
  formula?: string;
  reading: { value: string; context: string; percentile?: number };
  drivers: Driver[];
  misreading: string;
  related: { label: string; href: string }[];
  level: "Foundation" | "Intermediate" | "Advanced";
};

export const METRICS: Metric[] = [
  {
    slug: "pcr", name: "Put-call ratio", short: "PCR", group: "Derivatives", level: "Foundation",
    plain: "How much put open interest exists compared with call open interest. It describes where option positions are sitting — not where the market is going.",
    formula: "PCR = total put open interest ÷ total call open interest",
    reading: { value: "0.84", context: "Below the 30-day average of 0.88 — slightly more call positioning than usual.", percentile: 38 },
    drivers: [
      { name: "Hedging demand", dir: "raises", weight: 34, note: "Institutions buying index puts as portfolio insurance is the single largest driver of a rising PCR, and it says nothing about direction — a hedge is bought by someone who is staying long." },
      { name: "Option writing activity", dir: "either", weight: 26, note: "Writers selling puts at a support strike lift PCR; writers selling calls at a resistance strike lower it. Both reflect where writers think price will not go.", link: "/explain/max-pain" },
      { name: "Days to expiry", dir: "either", weight: 18, note: "PCR drifts as near-strike positions are closed into expiry. Comparing a 2-day PCR to a 25-day PCR compares two different things." },
      { name: "Directional speculation", dir: "lowers", weight: 14, note: "Retail call buying lowers PCR. This is the component most commentary assumes is the whole number." },
      { name: "Strike range measured", dir: "either", weight: 8, note: "A PCR computed across five strikes and one computed across the full chain are different statistics with the same name." },
    ],
    misreading: "PCR is routinely read as a contrarian sentiment indicator — high PCR means bullish, low means bearish. Our literature search found no robust published evidence that aggregate PCR predicts index returns. It describes positioning, which is real information; it does not forecast.",
    related: [{ label: "The evidence on PCR", href: "/signals" }, { label: "Option chains", href: "/options" }],
  },
  {
    slug: "max-pain", name: "Max pain", short: "Max pain", group: "Derivatives", level: "Intermediate",
    plain: "The strike at which the largest total value of options would expire worthless — in other words, where option writers collectively lose the least.",
    formula: "For each strike K, total pain = Σ max(0, K − strikeᵢ)·callOIᵢ + Σ max(0, strikeᵢ − K)·putOIᵢ. Max pain is the K that minimises it.",
    reading: { value: "24,400", context: "62 points above spot, inside the current expected-move band." },
    drivers: [
      { name: "Open interest distribution", dir: "either", weight: 52, note: "Max pain is entirely determined by where open interest sits. It moves when positions move, which can be daily." },
      { name: "New position build-up", dir: "either", weight: 24, note: "A large fresh position at one strike can shift max pain materially in a single session.", link: "/explain/oi-buildup" },
      { name: "Expiry proximity", dir: "either", weight: 16, note: "Positions concentrate near the money into expiry, which usually pulls max pain toward spot rather than the other way round." },
      { name: "Strike range measured", dir: "either", weight: 8, note: "Computed across a wider strike range it can land somewhere different." },
    ],
    misreading: "The claim that price gravitates to max pain into expiry is widely repeated and weakly evidenced. Max pain is a calculation from current positioning, and positioning changes. We publish it as a level with its sample size attached, never as a target.",
    related: [{ label: "Option chains", href: "/options" }, { label: "Possibility trees", href: "/outlook" }],
  },
  {
    slug: "iv-rank", name: "Implied volatility rank", short: "IV rank", group: "Derivatives", level: "Intermediate",
    plain: "Where today's implied volatility sits in its own range over the past year, from 0 (cheapest it has been) to 100 (most expensive).",
    formula: "IV rank = (IV today − IV 52-week low) ÷ (IV 52-week high − IV 52-week low) × 100",
    reading: { value: "31", context: "Bottom third of its own year — options are cheap relative to their own history.", percentile: 31 },
    drivers: [
      { name: "Realised volatility", dir: "raises", weight: 38, note: "Implied volatility follows realised volatility with a lag. A quiet month compresses it." },
      { name: "Scheduled events inside the expiry", dir: "raises", weight: 27, note: "A policy decision or results date inside the contract life raises implied volatility before it arrives and collapses it after.", link: "/calendar" },
      { name: "Hedging demand", dir: "raises", weight: 18, note: "Demand for protection raises the price of optionality independently of what price is doing." },
      { name: "Option supply", dir: "lowers", weight: 12, note: "Systematic volatility-selling programmes suppress implied volatility in calm periods." },
      { name: "Days to expiry", dir: "either", weight: 5, note: "Short-dated contracts carry structurally different IV from long-dated ones." },
    ],
    misreading: "Low IV rank is treated as a buy signal for options. It means optionality is cheap relative to its own history, which is usually because nothing has happened recently — and recent calm is a poor predictor of future calm.",
    related: [{ label: "Option chains", href: "/options" }, { label: "Market regime", href: "/markets/regime" }],
  },
  {
    slug: "oi-buildup", name: "Open interest build-up", short: "OI build-up", group: "Derivatives", level: "Foundation",
    plain: "Whether money is entering or leaving a position, read from price and open interest moving together or apart.",
    formula: "Price ▲ + OI ▲ = long build-up · Price ▼ + OI ▲ = short build-up · Price ▼ + OI ▼ = long unwinding · Price ▲ + OI ▼ = short covering",
    reading: { value: "Short build-up, 94th percentile", context: "Bank Nifty: OI +12.1% with price −0.4%, the clearest short build-up since March.", percentile: 94 },
    drivers: [
      { name: "New directional positioning", dir: "either", weight: 41, note: "The intended reading: fresh money taking a side." },
      { name: "Hedging against a cash position", dir: "either", weight: 22, note: "A short future against a long cash book looks identical to a directional short in this classification. It is not." },
      { name: "Arbitrage and cash-futures basis", dir: "either", weight: 17, note: "Basis trades add open interest with no directional view at all." },
      { name: "Rollover activity", dir: "either", weight: 14, note: "Near expiry, OI changes are dominated by rolling rather than by new views.", link: "/india/derivatives" },
      { name: "Expiry-driven closure", dir: "lowers", weight: 6, note: "OI falls mechanically into settlement." },
    ],
    misreading: "The classification is accounting and is reliable. The inference — that a short build-up predicts a further fall, or a squeeze — is a separate and much weaker claim. We publish estimates only on extreme readings, ranked against the symbol's own 250-day history, and the samples are small.",
    related: [{ label: "Derivatives", href: "/india/derivatives" }, { label: "Reading OI honestly", href: "/learn/reading-open-interest" }],
  },
  {
    slug: "surprise-z", name: "Surprise", short: "Surprise z", group: "Macro", level: "Foundation",
    plain: "How far a released figure landed from what forecasters expected, measured in standard deviations. This is the number that moves markets — not the level.",
    formula: "z = (actual − consensus) ÷ historical standard deviation of (actual − consensus) for that series",
    reading: { value: "−1.8σ", context: "October CPI at 4.40% against a 4.70% consensus — a top-decile downside miss.", percentile: 92 },
    drivers: [
      { name: "The actual figure", dir: "either", weight: 44, note: "Obvious, but only half of it." },
      { name: "The consensus it is measured against", dir: "either", weight: 33, note: "A poll of four forecasters is noise. Consensus quality determines whether the surprise means anything.", link: "/explain/consensus" },
      { name: "Historical dispersion of that series", dir: "either", weight: 15, note: "A 0.3pp miss on inflation is enormous; the same miss on industrial production is unremarkable. The denominator is what makes them comparable." },
      { name: "Simultaneous revisions", dir: "either", weight: 8, note: "A revision to the prior figure released alongside the headline can swamp the headline surprise entirely." },
    ],
    misreading: "Reading the level instead of the surprise. An inflation print exactly in line with forecasts moves nothing however dramatic the number looks, because the expectation was already in the price.",
    related: [{ label: "Why surprise beats the number", href: "/learn/why-surprise-beats-the-number" }, { label: "Calendar", href: "/calendar" }],
  },
  {
    slug: "fii-flow", name: "FII net flow", short: "FII flow", group: "Flows", level: "Foundation",
    plain: "How much foreign institutional investors bought or sold in the Indian cash market on a given day.",
    formula: "FII net = FII gross purchases − FII gross sales, cash segment, provisional",
    reading: { value: "−₹2,140 cr", context: "The eleventh session of selling in thirteen — with domestic institutions buying ₹2,980 cr." },
    drivers: [
      { name: "Global risk appetite", dir: "either", weight: 36, note: "Emerging-market allocations are adjusted as a block. Indian fundamentals are frequently not involved at all.", link: "/transmission" },
      { name: "Dollar and rate differentials", dir: "either", weight: 24, note: "A stronger dollar reduces unhedged returns and discourages inflows regardless of what the Nifty does.", link: "/global-factors/dollar" },
      { name: "EM allocation rotation", dir: "either", weight: 18, note: "Money moving between India and China inside a fixed EM weight. Chinese good news can cause Indian outflows.", link: "/global-factors/china" },
      { name: "Index rebalancing", dir: "either", weight: 13, note: "Passive flow from MSCI and domestic index reviews is forced and announced in advance.", link: "/india/index-flows" },
      { name: "Indian fundamentals", dir: "either", weight: 9, note: "Genuinely the smallest component on most days, which is the opposite of how the number is reported." },
    ],
    misreading: "Treating FII selling alone as a directional signal. Foreign ownership of Nifty 50 constituents fell from roughly 27% in 2015 to about 18% by end-2024 while domestic flows grew. Our ledger rates this our weakest published class at a 57.8% hit rate — barely above a coin flip. Always read it against DII on the same day.",
    related: [{ label: "Flows", href: "/india/flows" }, { label: "The FII scenario", href: "/scenarios/fii-sell-dii-absorb" }],
  },
  {
    slug: "india-vix", name: "India VIX", short: "India VIX", group: "Volatility", level: "Foundation",
    plain: "The market's expectation of how much the Nifty will move over the next 30 days, derived from option prices.",
    reading: { value: "13.9", context: "Bottom quartile of its own range — the market is pricing a calm month.", percentile: 28 },
    drivers: [
      { name: "Nifty option implied volatility", dir: "either", weight: 58, note: "India VIX is computed from the Nifty option chain. It is implied volatility with a different label." },
      { name: "Scheduled events in the window", dir: "raises", weight: 19, note: "A policy decision or Budget inside the 30-day window lifts it mechanically." },
      { name: "Realised volatility", dir: "raises", weight: 14, note: "Follows with a lag — a violent week raises it after the fact." },
      { name: "Global volatility", dir: "raises", weight: 9, note: "Research finds Nifty overnight volatility is imported from the US. India VIX follows a VIX spike.", link: "/scenarios/vix-spike" },
    ],
    misreading: "A low VIX read as safety. It is a price, not a forecast — it says optionality is cheap, which usually means nothing has happened recently. Calm periods are precisely when a model fitted on calm data understates the risk.",
    related: [{ label: "Risk dashboard", href: "/markets/risk" }, { label: "Regime", href: "/markets/regime" }],
  },
  {
    slug: "expected-move", name: "Expected move", short: "Expected move", group: "Derivatives", level: "Intermediate",
    plain: "How far the option market thinks the price could move by expiry, one standard deviation either way.",
    formula: "Expected move = spot × implied volatility × √(days to expiry ÷ 365). The ATM straddle is roughly 0.8σ, so straddle ÷ 0.8 approximates the same figure.",
    reading: { value: "±387", context: "Nifty to the 27 Nov expiry — about 1.6% either way." },
    drivers: [
      { name: "Implied volatility", dir: "raises", weight: 52, note: "The dominant input. Everything that moves IV moves this.", link: "/explain/iv-rank" },
      { name: "Days to expiry", dir: "raises", weight: 31, note: "Scales with the square root of time, so it compresses fast in the final week." },
      { name: "Spot level", dir: "raises", weight: 12, note: "A proportional scaler — the percentage move matters more than the points." },
      { name: "Which definition is used", dir: "either", weight: 5, note: "One sigma, the straddle, and a scaled band are all published under this label and give different numbers." },
    ],
    misreading: "Reading it as a range the price will stay inside. One sigma contains roughly 68% of outcomes, which means it is breached about a third of the time. It is also risk-neutral — derived from prices that embed a risk premium, not from realised history.",
    related: [{ label: "Option chains", href: "/options" }, { label: "Reading a confidence band", href: "/learn/reading-a-confidence-band" }],
  },
  {
    slug: "delivery-pct", name: "Delivery percentage", short: "Delivery %", group: "Equity", level: "Foundation",
    plain: "What share of the day's traded volume was actually settled by delivery rather than squared off intraday.",
    formula: "Delivery % = delivered quantity ÷ total traded quantity × 100",
    reading: { value: "68.2%", context: "HDFC Bank, against a 20-day average of 54.1% — a meaningful spike." },
    drivers: [
      { name: "Institutional participation", dir: "raises", weight: 37, note: "Institutions take delivery; intraday traders do not. A spike usually means a larger holder was active." },
      { name: "Intraday and algorithmic volume", dir: "lowers", weight: 28, note: "High-frequency activity inflates the denominator without adding delivery." },
      { name: "Bulk and block deals", dir: "raises", weight: 19, note: "A single block can move the ratio sharply.", link: "/india/flows" },
      { name: "F&O availability", dir: "lowers", weight: 10, note: "Names with liquid derivatives see more positions expressed there instead of in cash." },
      { name: "Price volatility", dir: "lowers", weight: 6, note: "Volatile sessions attract intraday flow, diluting the ratio." },
    ],
    misreading: "A high delivery percentage read as bullish conviction. It tells you the buyer intends to hold, not that they are right — and a large seller delivering stock produces the same reading.",
    related: [{ label: "Derivatives", href: "/india/derivatives" }, { label: "Screener", href: "/screener" }],
  },
  {
    slug: "earnings-yield-spread", name: "Earnings yield minus bond yield", short: "EY − bond", group: "Valuation", level: "Advanced",
    plain: "What the index earns you compared with what a government bond pays. Negative means bonds yield more than the index earns.",
    formula: "(1 ÷ trailing P/E × 100) − 10-year government bond yield",
    reading: { value: "−2.28%", context: "24th percentile of its ten-year range — equity is expensive against bonds.", percentile: 24 },
    drivers: [
      { name: "Index earnings", dir: "raises", weight: 36, note: "Rising earnings lift the yield mechanically, which is the healthy way this spread improves." },
      { name: "Index price", dir: "lowers", weight: 31, note: "A rising index lowers the earnings yield. The spread can deteriorate purely because prices rose." },
      { name: "Government bond yield", dir: "lowers", weight: 26, note: "A falling bond yield widens the spread without anything happening to equities.", link: "/india/macro" },
      { name: "Earnings measure used", dir: "either", weight: 7, note: "Trailing and forward earnings give materially different answers for the same market." },
    ],
    misreading: "Treating it as a timing signal. It has some long-horizon explanatory power for subsequent returns and essentially none over a trading week. It is an allocation input, and it has never cleared our calibration bar at the horizons we publish.",
    related: [{ label: "Valuation", href: "/india/valuation" }, { label: "Evidence review", href: "/signals" }],
  },
  {
    slug: "breadth", name: "Market breadth", short: "Breadth", group: "Equity", level: "Foundation",
    plain: "What share of constituents are advancing. It tells you whether a move is broad or carried by a few heavyweights.",
    formula: "Breadth = advancing constituents ÷ total constituents",
    reading: { value: "58%", context: "Nifty 50 — a modestly broad session." },
    drivers: [
      { name: "Sector rotation", dir: "either", weight: 34, note: "Money moving between sectors produces a mixed breadth reading with a flat index." },
      { name: "Index heavyweight moves", dir: "either", weight: 29, note: "The index and breadth can disagree completely. Two heavyweights can carry the index against the majority.", link: "/heatmap" },
      { name: "Liquidity and flows", dir: "raises", weight: 21, note: "Broad domestic inflows lift participation across the board." },
      { name: "Universe measured", dir: "either", weight: 16, note: "Nifty 50 breadth and Nifty 500 breadth routinely disagree, and both get reported as 'breadth'." },
    ],
    misreading: "Breadth is widely treated as a leading indicator. Our literature search found no quality published evidence of breadth predicting index returns. We display it as description of participation and publish no estimate from it.",
    related: [{ label: "Heatmap", href: "/heatmap" }, { label: "Evidence review", href: "/signals" }],
  },
  {
    slug: "gift-basis", name: "GIFT Nifty basis", short: "GIFT basis", group: "Global", level: "Advanced",
    plain: "The premium or discount of the overnight Nifty futures contract to where fair value says it should be.",
    formula: "Basis = GIFT Nifty price − (spot × e^(r·t)), with r the cost of carry and t the time to expiry",
    reading: { value: "−0.11%", context: "A small discount — the overnight contract is slightly weaker than carry alone explains." },
    drivers: [
      { name: "Overnight global news", dir: "either", weight: 42, note: "The whole point: GIFT prices Indian equity against news that arrived after the Indian close.", link: "/transmission" },
      { name: "Cost of carry", dir: "raises", weight: 23, note: "Interest rates and time to expiry set the theoretical premium. Ignoring it is how a positive basis gets misread." },
      { name: "Overnight liquidity", dir: "either", weight: 21, note: "A thin session moves on little. Volume matters as much as the level." },
      { name: "Arbitrage activity", dir: "lowers", weight: 14, note: "Arbitrageurs compress the basis toward fair value when it is wide enough to pay." },
    ],
    misreading: "Quoting the level instead of the basis. 'GIFT Nifty up 40 points' when fair value says it should be up 70 is a weak signal presented as a positive one. We also found no peer-reviewed study establishing GIFT Nifty's predictive accuracy for the Indian open.",
    related: [{ label: "Overnight Bridge", href: "/bridge" }, { label: "Transmission", href: "/transmission" }],
  },
  {
    slug: "confidence", name: "Confidence", short: "Confidence", group: "Newze", level: "Intermediate",
    plain: "How much weight to give one of our estimates. It is a calibrated probability, not a feeling — estimates published at 0.60 should be right about 60% of the time.",
    reading: { value: "0.61", context: "Checkable on the Accuracy Ledger, by confidence bucket." },
    drivers: [
      { name: "Number of historical analogs", dir: "raises", weight: 33, note: "More comparable past events means a tighter estimate. Below twelve we publish nothing at all." },
      { name: "Regime concentration of analogs", dir: "lowers", weight: 26, note: "Thirty analogs from one six-month window count closer to one observation than thirty.", link: "/analogs" },
      { name: "Class calibration history", dir: "raises", weight: 24, note: "How well this event class has scored recently. Two classes are currently suppressed for failing it." },
      { name: "Consensus availability", dir: "raises", weight: 11, note: "Classes with a consensus baseline consistently outscore those without." },
      { name: "Source tier", dir: "raises", weight: 6, note: "Tier-4 sources produce no estimate at any confidence." },
    ],
    misreading: "Reading confidence as conviction. It is a frequency claim about a set of estimates, not a statement about this one. The honest use is as a weight, and our own published figures top out around 0.72.",
    related: [{ label: "Accuracy Ledger", href: "/track-record" }, { label: "Methodology", href: "/methodology" }],
  },
  {
    slug: "consensus", name: "Consensus", short: "Consensus", group: "Macro", level: "Foundation",
    plain: "The median of forecasters' expectations for a scheduled release — the number the market has already priced.",
    reading: { value: "4.70%", context: "October CPI, from 34 contributing forecasters." },
    drivers: [
      { name: "Number of contributors", dir: "either", weight: 38, note: "A median of four forecasts is noise. Contributor count is the first thing to check." },
      { name: "Recency of submissions", dir: "either", weight: 27, note: "Forecasts submitted before a relevant data point are stale, and medians rarely exclude them." },
      { name: "Which poll is quoted", dir: "either", weight: 21, note: "Different agencies run different polls on the same release and publish different consensus figures." },
      { name: "Herding among forecasters", dir: "either", weight: 14, note: "Forecasters anchor on each other, which narrows dispersion without improving accuracy." },
    ],
    misreading: "Treating consensus as a forecast. It is the market's pre-positioning, and its only job here is to be the baseline the actual figure is measured against.",
    related: [{ label: "Calendar", href: "/calendar" }, { label: "Surprise", href: "/explain/surprise-z" }],
  },
  {
    slug: "beta", name: "Beta", short: "Beta", group: "Risk", level: "Intermediate",
    plain: "How much one instrument moves for a given move in another. A beta of 1.12 means it moves 12% more.",
    formula: "β = covariance(a, b) ÷ variance(b)",
    reading: { value: "1.12", context: "Bank Nifty to Nifty, reported since January 2017 alongside correlation above 0.98." },
    drivers: [
      { name: "Sector concentration", dir: "either", weight: 35, note: "Bank Nifty is the financial slice of the Nifty, so it amplifies the same moves rather than diversifying them.", link: "/india/correlation" },
      { name: "Leverage in constituents", dir: "raises", weight: 26, note: "Financial and highly-geared businesses respond more to the same macro shock." },
      { name: "Measurement window", dir: "either", weight: 24, note: "Beta over one year and over five years differ substantially for the same pair." },
      { name: "Market regime", dir: "raises", weight: 15, note: "Beta tends to rise in stress, exactly when a hedge sized on the calm-period figure fails." },
    ],
    misreading: "Using a long-run beta to size a hedge. Both beta and correlation drift, and they drift most in the episodes where the hedge is actually needed.",
    related: [{ label: "Index relationships", href: "/india/correlation" }, { label: "Regime", href: "/markets/regime" }],
  },
  {
    slug: "gap-fill", name: "Gap fill probability", short: "Gap fill", group: "Newze", level: "Intermediate",
    plain: "How often a gap at the open has been closed within the same session, conditioned on gaps that looked like this one.",
    reading: { value: "58%", context: "Conditioned on gap size, direction, regime and days to expiry. n = 142." },
    drivers: [
      { name: "Gap size", dir: "lowers", weight: 39, note: "Small gaps fill far more often than large ones. An unconditional gap-fill statistic blends the two and is close to meaningless." },
      { name: "Volatility regime", dir: "either", weight: 25, note: "Fill rates differ materially between calm and stressed markets.", link: "/markets/regime" },
      { name: "What caused the gap", dir: "either", weight: 21, note: "A gap on a genuine information event behaves differently from one on thin overnight liquidity." },
      { name: "Days to expiry", dir: "either", weight: 15, note: "Expiry-week sessions behave distinctly enough that we condition on it." },
    ],
    misreading: "Quoting an unconditional gap-fill rate. 'Gaps fill 70% of the time' blends a 0.2% gap with a 2% gap, and the two have almost nothing in common.",
    related: [{ label: "Overnight Bridge", href: "/bridge" }, { label: "Possibility trees", href: "/outlook" }],
  },
  {
    slug: "mwpl", name: "Market-wide position limit", short: "MWPL", group: "Microstructure", level: "Intermediate",
    plain: "The cap on total derivative open interest in a stock across the whole market. Cross it and new positions are barred.",
    formula: "Ban triggers when market-wide OI exceeds 95% of MWPL; normal trading resumes when it falls to 80%.",
    reading: { value: "96%", context: "One symbol currently above the ban threshold." },
    drivers: [
      { name: "Aggregate open interest", dir: "raises", weight: 46, note: "The numerator. Crowding in a popular name is the usual cause." },
      { name: "Free float and the limit itself", dir: "lowers", weight: 27, note: "The denominator. Smaller float means the limit is reached sooner." },
      { name: "Rollover activity", dir: "raises", weight: 16, note: "Rolling positions near expiry can push utilisation up without new directional interest.", link: "/india/microstructure" },
      { name: "Position closure", dir: "lowers", weight: 11, note: "Only reducing trades are permitted during a ban, which is what brings utilisation back down." },
    ],
    misreading: "Watching the ban list instead of utilisation. By the time a name is on the list the restriction is already live and the exit is already expensive. Utilisation above 90% is the actionable reading.",
    related: [{ label: "Microstructure", href: "/india/microstructure" }, { label: "Regulation", href: "/regulations" }],
  },
  {
    slug: "risk-mood", name: "Global risk mood", short: "Risk mood", group: "Newze", level: "Foundation",
    plain: "A single composite of six cross-asset readings describing whether global capital is currently taking risk or avoiding it.",
    formula: "A signed average of six components: equity volatility, credit spreads, the gold-to-crude relationship, the dollar, rates direction and emerging-market flows.",
    reading: { value: "−18", context: "Mildly risk-off, eleven points lower than yesterday." },
    drivers: [
      { name: "Equity volatility", dir: "lowers", weight: 22, note: "VIX and India VIX. The most responsive component." },
      { name: "Gold against crude", dir: "lowers", weight: 21, note: "Both bid together is the signature of genuine risk-off, and the worst combination for India specifically.", link: "/global-factors/gold" },
      { name: "Rates direction", dir: "lowers", weight: 19, note: "Rising US yields compress long-duration valuations globally.", link: "/global-factors/us-rates" },
      { name: "The dollar", dir: "lowers", weight: 17, note: "A firming dollar pulls capital toward the US and away from emerging markets." },
      { name: "Credit spreads", dir: "lowers", weight: 13, note: "The slowest-moving component and the one that matters most when it does move." },
      { name: "Emerging-market flows", dir: "lowers", weight: 8, note: "The weakest component, included for completeness rather than signal." },
    ],
    misreading: "Reading the composite as a trading signal. It describes present conditions across six observable inputs. It has no published hit rate because we publish no estimate from it.",
    related: [{ label: "Scenarios", href: "/scenarios" }, { label: "Risk dashboard", href: "/markets/risk" }],
  },
];

export const metricBySlug = (s: string) => METRICS.find((m) => m.slug === s);
export const METRIC_GROUPS = Array.from(new Set(METRICS.map((m) => m.group)));
