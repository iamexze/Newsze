/* ───────────────────────────────────────────────────────────────────────────
   INDIAN MARKET — index flows, microstructure, primary market, economy.
   Mechanisms, rules and cited figures are real and attributed.
   Live figures rendered on the site are sample data.
   ─────────────────────────────────────────────────────────────────────────── */
import type { Source } from "./research";

/* ═══ INDEX FLOWS — MSCI AND DOMESTIC REBALANCING ══════════════════════════ */

export const MSCI = {
  review: "November 2026 review",
  weight: { from: 11.5, to: 11.7, index: "MSCI Emerging Markets" },
  netFlow: "≈ $2.0 bn",
  altEstimate: { from: 12.9, to: 13.15, inclusions: 1.75, weightUp: 0.51, outflows: 0.55, net: 1.7 },
  additions: [
    { name: "LIC", note: "Standard index inclusion" },
    { name: "Coforge", note: "Standard index inclusion" },
    { name: "Meesho", note: "Standard index inclusion" },
    { name: "Adani Green", note: "Standard index inclusion" },
  ],
  deletions: [{ name: "PI Industries", flow: "≈ −$119 mn" }],
  weightCuts: [{ name: "NTPC", flow: "≈ −$97 mn", note: "largest weight-cut outflow" }],
  trend: {
    claim: "India's EM weight has fallen sharply from its peak",
    detail: "One source reports India's share of the MSCI EM Index at 11.94%, down from nearly 21% in September 2024. Another puts it at about 18% as of March 2026. The sources conflict and we show both rather than picking one.",
    driver: "Coverage attributes the decline largely to AI-driven gains in Taiwan and Korea pulling relative weight away from India, rather than to Indian underperformance alone.",
  },
  sources: [
    { label: "India EM weight 11.5% → 11.7%, ≈$2bn passive inflows (Nuvama estimate)", who: "Business Standard, Nov 2026" },
    { label: "Additions LIC, Coforge, Meesho, Adani Green; PI Industries removed", who: "Business Standard / Business Upturn" },
    { label: "PI Industries ≈−$119mn; NTPC largest weight-cut outflow ≈−$97mn", who: "Business Standard" },
    { label: "Alternative base: 12.9% → 13.15%, net ≈$1.7bn", who: "Nuvama via Business Upturn" },
    { label: "EM weight 11.94%, down from nearly 21% in Sep 2024", who: "Market coverage, 2026" },
    { label: "Decline attributed to AI-driven gains in Taiwan and Korea", who: "Market coverage, 2026" },
  ] as Source[],
};

export const REBALANCE_MECHANICS = [
  { h: "Passive money has no choice",
    p: "Index funds and ETFs tracking MSCI EM must hold the index weights. When MSCI adds a stock, every tracking fund has to buy it, on the same day, regardless of price or view. That is the cleanest example of genuinely forced order flow in public markets." },
  { h: "The flow is announced before it happens",
    p: "MSCI publishes the changes in advance of the effective date. The announcement window is where most of the price move happens, because active managers front-run the mechanical buying. By the effective date the move is frequently complete or reversing." },
  { h: "Two numbers, not one",
    p: "Inclusion flow and weight-change flow are separate. A stock already in the index can see large passive flow purely because India's country weight moved, with nothing happening to the company. In the November 2026 review, inclusions accounted for roughly $1.75bn while weight increases accounted for about $0.51bn." },
  { h: "Country weight is a relative game",
    p: "India's EM weight falls when other EM markets rise faster, even if Indian equities are flat or up. The reported decline has been attributed largely to AI-driven gains in Taiwan and Korea. An Indian investor reading 'India weight cut' as a verdict on India is misreading a relative calculation." },
];

/* ═══ MICROSTRUCTURE — THE RULES THAT DECIDE WHAT YOU CAN TRADE ════════════ */

export type Rule = {
  slug: string; name: string; what: string;
  trigger: string; effect: string; watch: string;
  detail: { h: string; p: string }[];
  sources: Source[];
};

export const MICRO: Rule[] = [
  {
    slug: "fno-ban", name: "F&O ban period",
    what: "A derivative contract is barred from new positions when open interest across the market gets too large relative to the permitted limit.",
    trigger: "Market-wide open interest exceeds 95% of the market-wide position limit (MWPL)",
    effect: "No new positions. Any trade in the banned scrip's derivatives must REDUCE open interest by end of day. Normal trading resumes once open interest falls back to 80% of MWPL.",
    watch: "The daily ban list, published by the exchange before the session",
    detail: [
      { h: "The cash market is unaffected", p: "A stock in F&O ban can still be bought and sold in the cash segment normally. Only its derivatives are restricted. This is the single most common misunderstanding." },
      { h: "Brokers differ", p: "The rule permits position-reducing trades, but brokers vary on whether they accept orders that only reduce exposure. Check your own broker's policy before you need it." },
      { h: "Liquidity collapses", p: "A banned contract typically sees spreads widen sharply because one entire side of the order flow is prohibited. Exiting a position during a ban is materially more expensive than entering was." },
    ],
    sources: [
      { label: "Ban at >95% of MWPL; resumes at 80%; trades must reduce FutEq OI by EOD; cash market unaffected", who: "NSE F&O regulations / broker documentation" },
    ],
  },
  {
    slug: "asm", name: "Additional Surveillance Measure (ASM)",
    what: "An exchange framework that raises the cost of trading a security showing speculative price or volume behaviour. It is not a statement about the company.",
    trigger: "Price and volume behaviour flagged by exchange surveillance, jointly operated by NSE, BSE and SEBI",
    effect: "Higher applicable margin, and in some stages a change to the settlement or trading mechanism. Under Short-Term ASM, Stage I applies margin of 50% or the existing margin, whichever is higher; Stage II applies 100%, capped at 100%.",
    watch: "The exchange ASM list and the stage a security sits in",
    detail: [
      { h: "It targets behaviour, not fundamentals", p: "ASM is a surveillance response to speculative spikes. A stock entering ASM is not an allegation of wrongdoing by the company, and reading it as one leads to the wrong trade." },
      { h: "Short-term and long-term are separate tracks", p: "ST-ASM and LT-ASM have different stage structures and different margin schedules. NSE applied 100% margin at Stage I for some securities under the long-term track in late 2025." },
      { h: "The margin is the point", p: "A 100% margin requirement means the position must be fully funded. For a leveraged trader this is not a tax on the trade — it eliminates the trade entirely." },
    ],
    sources: [
      { label: "ST-ASM Stage I: 50% or existing margin, whichever higher; Stage II: 100%, capped at 100%", who: "NSE circular, March 2026" },
      { label: "ASM operated jointly by NSE, BSE and SEBI; targets speculative spikes not fundamentals", who: "NSE ASM FAQ" },
      { label: "LT-ASM Stage I at 100% margin applied to some securities, late 2025", who: "NSE circulars" },
    ],
  },
  {
    slug: "gsm", name: "Graded Surveillance Measure (GSM)",
    what: "A stricter framework than ASM, applied to securities on criteria including price behaviour and financial parameters.",
    trigger: "Exchange criteria covering price movement and company financial parameters",
    effect: "Progressive restriction by stage, up to periodic call auction and trade-for-trade settlement. Securities failing the inclusion criteria on review are moved out of the framework.",
    watch: "The GSM list and the stage; stage changes are published by circular",
    detail: [
      { h: "The framework was simplified", p: "NSE reduced GSM stages from six to four after its first review. The FAQ was updated in June 2026 and the framework itself revised by circular in May 2026, so always check the current stage definitions against the primary document rather than secondary summaries." },
      { h: "Exit is possible", p: "GSM is not permanent. Securities that stop meeting the inclusion criteria are reviewed and moved out." },
      { h: "Call auction changes everything", p: "At higher stages a security may trade only in periodic call auctions rather than continuously. Intraday trading becomes impossible, not merely expensive." },
    ],
    sources: [
      { label: "GSM stages reduced from six to four after first review; securities failing criteria moved out", who: "NSE GSM framework" },
      { label: "GSM FAQ updated June 2026; framework revised by circular May 2026", who: "NSE" },
    ],
  },
  {
    slug: "concentration-margin", name: "Concentration margin",
    what: "An extra margin applied when a small number of clients hold a large share of the permitted position limit in a contract.",
    trigger: "Top 10 clients holding more than 20% of MWPL in an F&O contract",
    effect: "An additional 15% exposure margin on that contract, reported as applying from 28 August 2026.",
    watch: "Broker margin notifications — this often appears as an unexplained overnight margin increase",
    detail: [
      { h: "It is about crowding, not size", p: "The measure responds to concentration of positions in few hands, which is a liquidation-risk problem rather than a pricing problem. A contract can be large and uncrowded, or small and dangerously crowded." },
      { h: "It arrives without warning to the position holder", p: "The margin change applies to the contract, not to the specific clients causing the concentration. Everyone in that contract pays the extra margin." },
    ],
    sources: [
      { label: "Extra 15% exposure margin where top 10 clients hold >20% of MWPL, from 28 Aug 2026", who: "Broker market bulletin, 2026" },
    ],
  },
];

/* ═══ PRIMARY MARKET ═══════════════════════════════════════════════════════ */

export const IPOS = [
  { name: "Varda Logistics", board: "Mainboard", size: "₹4,200 cr", band: "₹486–512",
    opens: "18 Nov", closes: "20 Nov", qib: 4.8, nii: 12.4, retail: 3.1, total: 6.2, status: "open" },
  { name: "Kalyani Renewables", board: "Mainboard", size: "₹2,800 cr", band: "₹312–328",
    opens: "20 Nov", closes: "24 Nov", qib: 0, nii: 0, retail: 0, total: 0, status: "upcoming" },
  { name: "Sentia Diagnostics", board: "Mainboard", size: "₹1,150 cr", band: "₹742–780",
    opens: "12 Nov", closes: "14 Nov", qib: 28.4, nii: 61.2, retail: 14.8, total: 32.1, status: "closed" },
  { name: "Raghav Precision", board: "SME", size: "₹84 cr", band: "₹128–135",
    opens: "17 Nov", closes: "19 Nov", qib: 2.1, nii: 44.6, retail: 18.2, total: 21.4, status: "open" },
  { name: "Nirmaan Infra", board: "SME", size: "₹61 cr", band: "₹96–102",
    opens: "10 Nov", closes: "12 Nov", qib: 1.4, nii: 88.2, retail: 36.4, total: 41.8, status: "closed" },
  { name: "Orbit Speciality", board: "Mainboard", size: "₹3,400 cr", band: "₹1,180–1,240",
    opens: "25 Nov", closes: "27 Nov", qib: 0, nii: 0, retail: 0, total: 0, status: "upcoming" },
];

export const IPO_NOTES = [
  { h: "Subscription is not demand", p: "Non-institutional subscription figures are inflated by leveraged applications that are funded for days, not held. A 60x NII number and a 3x QIB number describe two completely different books." },
  { h: "The QIB number is the signal", p: "Qualified institutional buyers cannot withdraw their bids after the close. That irreversibility is what makes the QIB subscription the most informative of the three figures." },
  { h: "SME is a different market", p: "SME issues have smaller floats, wider price bands and far thinner post-listing liquidity. Subscription multiples that look spectacular often reflect a tiny denominator." },
  { h: "Grey market premium is unregulated", p: "GMP circulates widely and refers to an unofficial, unregulated market. We do not publish it. Anyone quoting it to you as a price signal is quoting an unregulated market with no reporting obligations." },
];

/* ═══ ECONOMY DASHBOARD ════════════════════════════════════════════════════ */

export const ECONOMY = [
  { group: "Growth", rows: [
    { k: "Real GDP growth", v: "6.80%", p: "Q1 FY27", t: "up", note: "Above consensus of 6.6%" },
    { k: "GVA growth", v: "6.60%", p: "Q1 FY27", t: "up", note: "" },
    { k: "IIP", v: "3.10%", p: "Sep 2026", t: "flat", note: "Manufacturing the drag" },
    { k: "Core sector", v: "4.20%", p: "Sep 2026", t: "up", note: "Cement and steel leading" },
    { k: "Manufacturing PMI", v: "57.2", p: "Oct 2026", t: "up", note: "Expansion for 28 months" },
    { k: "Services PMI", v: "59.1", p: "Oct 2026", t: "up", note: "" },
  ]},
  { group: "Prices", rows: [
    { k: "CPI inflation", v: "4.40%", p: "Oct 2026", t: "down", note: "Sixth print inside the band" },
    { k: "Core CPI", v: "3.90%", p: "Oct 2026", t: "flat", note: "Sticky but contained" },
    { k: "Food inflation", v: "2.10%", p: "Oct 2026", t: "down", note: "Vegetables −6.1% m/m" },
    { k: "WPI inflation", v: "2.18%", p: "Oct 2026", t: "down", note: "" },
    { k: "Fuel & light CPI", v: "1.80%", p: "Oct 2026", t: "down", note: "" },
  ]},
  { group: "External", rows: [
    { k: "Trade deficit", v: "−$21.4 bn", p: "Oct 2026", t: "up", note: "Narrower than expected" },
    { k: "Merchandise exports", v: "$39.2 bn", p: "Oct 2026", t: "up", note: "" },
    { k: "Services surplus", v: "$16.8 bn", p: "Oct 2026", t: "up", note: "The structural offset" },
    { k: "Forex reserves", v: "$702.4 bn", p: "07 Nov", t: "up", note: "Near record" },
    { k: "Current account", v: "−1.1% of GDP", p: "Q1 FY27", t: "flat", note: "" },
    { k: "FDI inflows", v: "$18.2 bn", p: "H1 FY27", t: "flat", note: "" },
  ]},
  { group: "Fiscal & money", rows: [
    { k: "GST collections", v: "₹1.92 lakh cr", p: "Oct 2026", t: "up", note: "Record for the month" },
    { k: "Fiscal deficit", v: "42% of BE", p: "H1 FY27", t: "flat", note: "On track" },
    { k: "Repo rate", v: "5.75%", p: "Oct 2026", t: "down", note: "Third cut this cycle" },
    { k: "Bank credit growth", v: "11.4%", p: "Oct 2026", t: "flat", note: "Moderating from 16%" },
    { k: "Deposit growth", v: "10.8%", p: "Oct 2026", t: "up", note: "Credit-deposit gap narrowing" },
    { k: "M3 growth", v: "9.6%", p: "Oct 2026", t: "flat", note: "" },
  ]},
  { group: "Household & markets", rows: [
    { k: "Demat accounts", v: "19.2 cr", p: "Oct 2026", t: "up", note: "" },
    { k: "Monthly SIP inflow", v: "₹26,400 cr", p: "Oct 2026", t: "up", note: "Record" },
    { k: "Mutual fund AUM", v: "₹71.4 lakh cr", p: "Oct 2026", t: "up", note: "" },
    { k: "Unemployment rate", v: "7.1%", p: "Oct 2026", t: "flat", note: "CMIE series" },
    { k: "Two-wheeler sales", v: "+8.2% y/y", p: "Oct 2026", t: "up", note: "Rural demand proxy" },
    { k: "Power demand", v: "+4.6% y/y", p: "Oct 2026", t: "up", note: "High-frequency activity proxy" },
  ]},
];

/* ═══ HEATMAP ══════════════════════════════════════════════════════════════ */

export const HEATMAP = [
  { sector: "Banks", weight: 32.1, chg: -0.41, names: [
    ["HDFCBANK", 1.12, 11.2], ["ICICIBANK", 0.64, 7.8], ["SBIN", -0.38, 3.1],
    ["AXISBANK", -0.92, 2.9], ["KOTAKBANK", 0.21, 2.6], ["INDUSINDBK", -1.84, 1.1]] },
  { sector: "IT", weight: 13.4, chg: -0.94, names: [
    ["TCS", -0.61, 4.2], ["INFY", -1.42, 3.8], ["HCLTECH", -0.88, 1.9],
    ["WIPRO", -1.21, 1.1], ["TECHM", -0.44, 0.9]] },
  { sector: "Energy", weight: 11.8, chg: 0.54, names: [
    ["RELIANCE", 0.61, 8.4], ["ONGC", 1.82, 1.2], ["BPCL", -0.74, 0.8], ["IOC", -0.41, 0.7]] },
  { sector: "Auto", weight: 7.2, chg: 1.24, names: [
    ["MARUTI", -0.72, 2.1], ["TATAMOTORS", 2.31, 1.8], ["M&M", 1.64, 1.6],
    ["BAJAJ-AUTO", 0.92, 1.1], ["EICHERMOT", 1.18, 0.6]] },
  { sector: "FMCG", weight: 6.9, chg: 0.11, names: [
    ["HINDUNILVR", -0.22, 2.4], ["ITC", 0.48, 2.2], ["NESTLEIND", 0.14, 0.9], ["BRITANNIA", 0.31, 0.6]] },
  { sector: "Pharma", weight: 5.4, chg: 0.38, names: [
    ["SUNPHARMA", 0.52, 1.8], ["CIPLA", 0.18, 0.9], ["DRREDDY", -0.34, 0.8], ["DIVISLAB", 1.04, 0.7]] },
  { sector: "Metals", weight: 4.1, chg: -0.82, names: [
    ["TATASTEEL", -1.14, 1.1], ["JSWSTEEL", -0.68, 1.0], ["HINDALCO", -0.92, 0.9], ["VEDL", 0.34, 0.5]] },
  { sector: "Infra & capex", weight: 6.2, chg: 0.29, names: [
    ["LT", 0.74, 3.4], ["ULTRACEMCO", -0.18, 1.2], ["ADANIPORTS", 0.92, 0.9], ["GRASIM", 0.11, 0.7]] },
  { sector: "NBFC", weight: 6.4, chg: 1.42, names: [
    ["BAJFINANCE", 1.84, 2.4], ["BAJAJFINSV", 1.21, 1.3], ["SHRIRAMFIN", 0.88, 0.7], ["CHOLAFIN", 1.64, 0.6]] },
  { sector: "Telecom & media", weight: 3.2, chg: 0.18, names: [
    ["BHARTIARTL", 0.24, 2.8], ["INDUSTOWER", -0.42, 0.3]] },
];

/* ═══ SCREENER (Pro preview) ═══════════════════════════════════════════════ */

export const SCREENS = [
  { name: "Short build-up at a 250-day extreme", hits: 14, desc: "Price down, open interest up, OI change above the 90th percentile of the symbol's own history, 10–20 days to expiry." },
  { name: "ADR dislocation above 1.5%", hits: 3, desc: "US-listed depositary receipt closed at a currency-adjusted premium or discount wider than 1.5% to the Indian close." },
  { name: "Delivery spike with no news", hits: 9, desc: "Delivery percentage more than two standard deviations above its 20-day mean, with no tier-0 or tier-1 story in 48 hours." },
  { name: "Earnings surprise, under-reacted", hits: 6, desc: "Beat consensus by more than 1σ, moved less than the analog median in the following session." },
  { name: "Entering F&O ban tomorrow", hits: 2, desc: "Market-wide open interest above 90% of MWPL and rising." },
  { name: "Fresh ASM stage change", hits: 5, desc: "Moved stage on the surveillance list in the last five sessions." },
  { name: "MSCI weight change candidates", hits: 11, desc: "Free-float and liquidity screens against the published inclusion thresholds ahead of the next review." },
  { name: "IV percentile below 20 into an event", hits: 7, desc: "Implied volatility in the bottom quintile of its own year with a scheduled event inside the expiry." },
];
