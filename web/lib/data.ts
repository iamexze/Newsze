/* ───────────────────────────────────────────────────────────────────────────
   SAMPLE DATASET — Newze prototype
   Every figure in this file is INVENTED for demonstration. It is not market
   data. Prices, events, flows and the accuracy record are synthetic, generated
   deterministically so the site renders identically on every request.
   Replacing this module with licensed feeds is the Phase 1 work item.
   ─────────────────────────────────────────────────────────────────────────── */

export const AS_OF = "2026-11-12T10:04:00+05:30";
export const AS_OF_LABEL = "Thu 12 Nov 2026 · 10:04 IST";
export const DATA_NOTICE =
  "Sample data. Every price, event and statistic on this site is synthetic and for demonstration only.";

/* ── deterministic PRNG so server and client agree ───────────────────────── */
function mulberry(seed: number) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function series(seed: number, n: number, start: number, vol: number) {
  const r = mulberry(seed); const out = [start];
  for (let i = 1; i < n; i++) {
    const g = (r() + r() + r() - 1.5) * 2;             // ~normal
    out.push(+(out[i - 1] * (1 + g * vol)).toFixed(2));
  }
  return out;
}

/* ── instruments ─────────────────────────────────────────────────────────── */
export type Instrument = {
  id: string; sym: string; name: string; exch: string;
  cls: "index" | "equity" | "fx" | "commodity" | "rate" | "crypto" | "vol";
  cur: string; last: number; prev: number; hist: number[];
  latency: "realtime" | "delayed_15m" | "eod";
  sector?: string; region: "IN" | "US" | "EU" | "ASIA" | "GLOBAL";
};

function mk(
  id: string, sym: string, name: string, exch: string, cls: Instrument["cls"],
  cur: string, start: number, vol: number, seed: number,
  region: Instrument["region"], latency: Instrument["latency"] = "delayed_15m",
  sector?: string
): Instrument {
  const hist = series(seed, 120, start, vol);
  return { id, sym, name, exch, cls, cur, hist,
    last: hist[hist.length - 1], prev: hist[hist.length - 2], latency, region, sector };
}

export const INSTRUMENTS: Instrument[] = [
  mk("IDX:NIFTY50","NIFTY 50","Nifty 50","NSE","index","INR",23980,0.0062,11,"IN","delayed_15m"),
  mk("IDX:NIFTYBANK","BANK NIFTY","Nifty Bank","NSE","index","INR",51900,0.0079,12,"IN","delayed_15m"),
  mk("IDX:FINNIFTY","FIN NIFTY","Nifty Financial Services","NSE","index","INR",23410,0.0071,13,"IN"),
  mk("IDX:MIDCAP","NIFTY MIDCAP","Nifty Midcap 150","NSE","index","INR",21340,0.0091,14,"IN"),
  mk("IDX:SENSEX","SENSEX","BSE Sensex","BSE","index","INR",78600,0.0061,15,"IN"),
  mk("IDX:INDIAVIX","INDIA VIX","India VIX","NSE","vol","pts",13.9,0.034,16,"IN"),
  mk("FX:USDINR","USD/INR","US Dollar / Indian Rupee","FX","fx","INR",87.9,0.0022,17,"IN","delayed_15m"),
  mk("IDX:SPX","S&P 500","S&P 500","NYSE","index","USD",6120,0.0058,18,"US"),
  mk("IDX:NDX","NASDAQ 100","Nasdaq 100","NASDAQ","index","USD",22100,0.0082,19,"US"),
  mk("IDX:DJI","DOW","Dow Jones Industrial","NYSE","index","USD",45200,0.0051,20,"US"),
  mk("IDX:VIX","VIX","CBOE Volatility Index","CBOE","vol","pts",16.4,0.047,21,"US"),
  mk("IDX:SX5E","EURO STOXX","Euro Stoxx 50","EUREX","index","EUR",5310,0.0063,22,"EU"),
  mk("IDX:N225","NIKKEI","Nikkei 225","TSE","index","JPY",41800,0.0074,23,"ASIA"),
  mk("IDX:HSI","HANG SENG","Hang Seng","HKEX","index","HKD",24300,0.0093,24,"ASIA"),
  mk("CMD:BRENT","BRENT","Brent Crude","ICE","commodity","USD",73.4,0.0138,25,"GLOBAL"),
  mk("CMD:XAU","GOLD","Gold Spot","OTC","commodity","USD",2740,0.0081,26,"GLOBAL"),
  mk("CMD:XAG","SILVER","Silver Spot","OTC","commodity","USD",33.8,0.0152,27,"GLOBAL"),
  mk("CMD:HG","COPPER","Copper","COMEX","commodity","USD",4.42,0.0119,28,"GLOBAL"),
  mk("FX:DXY","DXY","US Dollar Index","ICE","fx","idx",104.2,0.0031,29,"GLOBAL"),
  mk("FX:EURUSD","EUR/USD","Euro / US Dollar","FX","fx","USD",1.072,0.0034,30,"EU"),
  mk("FX:USDJPY","USD/JPY","US Dollar / Yen","FX","fx","JPY",154.3,0.0041,31,"ASIA"),
  mk("RT:US10Y","US 10Y","US 10-Year Treasury","GOVT","rate","%",4.21,0.0096,32,"US"),
  mk("RT:IN10Y","IND 10Y","India 10-Year G-Sec","CCIL","rate","%",6.74,0.0048,33,"IN"),
  mk("CRY:BTC","BTC/USD","Bitcoin","CRYPTO","crypto","USD",96400,0.0196,34,"GLOBAL"),
  mk("NSE:HDFCBANK","HDFCBANK","HDFC Bank","NSE","equity","INR",1718,0.0092,41,"IN","delayed_15m","Banks"),
  mk("NSE:ICICIBANK","ICICIBANK","ICICI Bank","NSE","equity","INR",1282,0.0096,42,"IN","delayed_15m","Banks"),
  mk("NSE:RELIANCE","RELIANCE","Reliance Industries","NSE","equity","INR",1304,0.0101,43,"IN","delayed_15m","Energy"),
  mk("NSE:INFY","INFY","Infosys","NSE","equity","INR",1842,0.0113,44,"IN","delayed_15m","IT"),
  mk("NSE:TCS","TCS","Tata Consultancy Services","NSE","equity","INR",4120,0.0098,45,"IN","delayed_15m","IT"),
  mk("NSE:SBIN","SBIN","State Bank of India","NSE","equity","INR",842,0.0121,46,"IN","delayed_15m","Banks"),
  mk("NSE:TATAMOTORS","TATAMOTORS","Tata Motors","NSE","equity","INR",782,0.0148,47,"IN","delayed_15m","Auto"),
  mk("NSE:BAJFINANCE","BAJFINANCE","Bajaj Finance","NSE","equity","INR",7180,0.0131,48,"IN","delayed_15m","NBFC"),
  mk("NSE:LT","LT","Larsen & Toubro","NSE","equity","INR",3640,0.0105,49,"IN","delayed_15m","Infra"),
  mk("NSE:SUNPHARMA","SUNPHARMA","Sun Pharmaceutical","NSE","equity","INR",1812,0.0094,50,"IN","delayed_15m","Pharma"),
  mk("NSE:MARUTI","MARUTI","Maruti Suzuki","NSE","equity","INR",11920,0.0109,51,"IN","delayed_15m","Auto"),
  mk("NSE:ADANIENT","ADANIENT","Adani Enterprises","NSE","equity","INR",2410,0.0192,52,"IN","delayed_15m","Conglomerate"),
  mk("NSE:WIPRO","WIPRO","Wipro","NSE","equity","INR",252,0.0118,61,"IN","delayed_15m","IT"),
  mk("NSE:HCLTECH","HCLTECH","HCL Technologies","NSE","equity","INR",1842,0.0104,62,"IN","delayed_15m","IT"),
  mk("NSE:TECHM","TECHM","Tech Mahindra","NSE","equity","INR",1620,0.0121,63,"IN","delayed_15m","IT"),
  mk("NSE:AXISBANK","AXISBANK","Axis Bank","NSE","equity","INR",1142,0.0109,64,"IN","delayed_15m","Banks"),
  mk("NSE:KOTAKBANK","KOTAKBANK","Kotak Mahindra Bank","NSE","equity","INR",1788,0.0098,65,"IN","delayed_15m","Banks"),
  mk("NSE:INDUSINDBK","INDUSINDBK","IndusInd Bank","NSE","equity","INR",982,0.0152,66,"IN","delayed_15m","Banks"),
  mk("NSE:ONGC","ONGC","Oil & Natural Gas Corp","NSE","equity","INR",254,0.0126,67,"IN","delayed_15m","Energy"),
  mk("NSE:BPCL","BPCL","Bharat Petroleum","NSE","equity","INR",312,0.0131,68,"IN","delayed_15m","Energy"),
  mk("NSE:IOC","IOC","Indian Oil","NSE","equity","INR",146,0.0128,69,"IN","delayed_15m","Energy"),
  mk("NSE:ITC","ITC","ITC","NSE","equity","INR",468,0.0082,70,"IN","delayed_15m","FMCG"),
  mk("NSE:HINDUNILVR","HINDUNILVR","Hindustan Unilever","NSE","equity","INR",2410,0.0086,71,"IN","delayed_15m","FMCG"),
  mk("NSE:NESTLEIND","NESTLEIND","Nestle India","NSE","equity","INR",2284,0.0079,72,"IN","delayed_15m","FMCG"),
  mk("NSE:BRITANNIA","BRITANNIA","Britannia Industries","NSE","equity","INR",5620,0.0091,73,"IN","delayed_15m","FMCG"),
  mk("NSE:CIPLA","CIPLA","Cipla","NSE","equity","INR",1548,0.0096,74,"IN","delayed_15m","Pharma"),
  mk("NSE:DRREDDY","DRREDDY","Dr Reddy's Laboratories","NSE","equity","INR",1286,0.0103,75,"IN","delayed_15m","Pharma"),
  mk("NSE:DIVISLAB","DIVISLAB","Divi's Laboratories","NSE","equity","INR",6120,0.0112,76,"IN","delayed_15m","Pharma"),
  mk("NSE:TATASTEEL","TATASTEEL","Tata Steel","NSE","equity","INR",162,0.0147,77,"IN","delayed_15m","Metals"),
  mk("NSE:JSWSTEEL","JSWSTEEL","JSW Steel","NSE","equity","INR",1042,0.0132,78,"IN","delayed_15m","Metals"),
  mk("NSE:HINDALCO","HINDALCO","Hindalco Industries","NSE","equity","INR",682,0.0141,79,"IN","delayed_15m","Metals"),
  mk("NSE:VEDL","VEDL","Vedanta","NSE","equity","INR",512,0.0178,80,"IN","delayed_15m","Metals"),
  mk("NSE:ULTRACEMCO","ULTRACEMCO","UltraTech Cement","NSE","equity","INR",11840,0.0101,81,"IN","delayed_15m","Infra"),
  mk("NSE:GRASIM","GRASIM","Grasim Industries","NSE","equity","INR",2714,0.0108,82,"IN","delayed_15m","Infra"),
  mk("NSE:ADANIPORTS","ADANIPORTS","Adani Ports & SEZ","NSE","equity","INR",1392,0.0156,83,"IN","delayed_15m","Infra"),
  mk("NSE:BAJAJFINSV","BAJAJFINSV","Bajaj Finserv","NSE","equity","INR",1944,0.0124,84,"IN","delayed_15m","NBFC"),
  mk("NSE:SHRIRAMFIN","SHRIRAMFIN","Shriram Finance","NSE","equity","INR",628,0.0137,85,"IN","delayed_15m","NBFC"),
  mk("NSE:CHOLAFIN","CHOLAFIN","Cholamandalam Investment","NSE","equity","INR",1486,0.0129,86,"IN","delayed_15m","NBFC"),
  mk("NSE:M&M","M&M","Mahindra & Mahindra","NSE","equity","INR",3128,0.0116,87,"IN","delayed_15m","Auto"),
  mk("NSE:BAJAJ-AUTO","BAJAJ-AUTO","Bajaj Auto","NSE","equity","INR",9240,0.0107,88,"IN","delayed_15m","Auto"),
  mk("NSE:EICHERMOT","EICHERMOT","Eicher Motors","NSE","equity","INR",5180,0.0113,89,"IN","delayed_15m","Auto"),
  mk("NSE:BHARTIARTL","BHARTIARTL","Bharti Airtel","NSE","equity","INR",1686,0.0094,90,"IN","delayed_15m","Telecom"),
  mk("NSE:INDUSTOWER","INDUSTOWER","Indus Towers","NSE","equity","INR",352,0.0138,91,"IN","delayed_15m","Telecom"),
];

export const byId = (id: string) => INSTRUMENTS.find((i) => i.id === id);
export const chg = (i: Instrument) => ((i.last - i.prev) / i.prev) * 100;

export const STRIP = ["IDX:NIFTY50","IDX:NIFTYBANK","IDX:SENSEX","IDX:INDIAVIX","FX:USDINR",
  "CMD:BRENT","CMD:XAU","IDX:SPX","IDX:NDX","FX:DXY","RT:US10Y","RT:IN10Y","CRY:BTC"];

/* ── event taxonomy slice used by the UI ─────────────────────────────────── */
export type Horizon = "15m" | "1h" | "1d" | "5d" | "20d";
export type Impact = {
  instrument: string; horizon: Horizon; expected: number | null;
  b68: [number, number] | null; b95: [number, number] | null;
  probUp: number | null; conf: number | null; n: number;
  hitRate: number | null; median: number | null; regimeConc: number;
  suppressed?: "thin_analogs" | "calibration" | "tier";
};
export type Story = {
  id: string; slug: string; headline: string; dek: string;
  type: string; subtype?: string; tier: 0 | 1 | 2 | 3 | 4;
  outlets: string[]; sourceCount: number; minsAgo: number;
  region: "IN" | "US" | "EU" | "ASIA" | "GLOBAL"; section: string;
  certainty: "confirmed" | "reported" | "rumoured" | "denied";
  surpriseZ: number | null; novelty: number;
  magnitude?: string; consensus?: string;
  bullets: { text: string; src: string }[];
  impacts: Impact[]; analogs: { date: string; label: string; move: number }[];
  body: string[]; lead?: boolean;
  hi?: { headline: string; dek: string };
};

const A = (date: string, label: string, move: number) => ({ date, label, move });

export const STORIES: Story[] = [
  {
    id: "evt_01JC8F", slug: "fed-cuts-25bp-signals-slower-path",
    headline: "Fed cuts 25bp but signals a slower path from here",
    dek: "The cut was fully priced. The dot plot showing two fewer moves in 2027 was not — and that is what repriced the curve.",
    type: "RATE_DECISION", subtype: "CUT", tier: 1,
    outlets: ["Reuters","Bloomberg","AP","FT","WSJ","CNBC","Mint"], sourceCount: 23,
    minsAgo: 34, region: "US", section: "Central banks", certainty: "confirmed",
    surpriseZ: 1.2, novelty: 0.31, magnitude: "−25bp", consensus: "−25bp (71 forecasters)",
    lead: true,
    bullets: [
      { text: "Target range lowered to 3.50–3.75%, the third consecutive cut.", src: "Federal Reserve statement" },
      { text: "Median dot removes two 2027 cuts; 2027 terminal shifts to 3.1% from 2.6%.", src: "FOMC projections" },
      { text: "Powell: 'we are closer to the point where the pace matters more than the direction.'", src: "Press conference" },
    ],
    impacts: [
      { instrument:"IDX:NIFTYBANK", horizon:"1d", expected:-0.41, b68:[-1.30,0.50], b95:[-2.40,1.60], probUp:0.39, conf:0.61, n:34, hitRate:0.62, median:-0.35, regimeConc:0.26 },
      { instrument:"IDX:NIFTY50",  horizon:"1d", expected:-0.28, b68:[-0.90,0.40], b95:[-1.80,1.10], probUp:0.42, conf:0.58, n:34, hitRate:0.59, median:-0.22, regimeConc:0.26 },
      { instrument:"FX:USDINR",    horizon:"1d", expected:0.22,  b68:[-0.10,0.60], b95:[-0.40,0.95], probUp:0.64, conf:0.66, n:41, hitRate:0.64, median:0.18, regimeConc:0.19 },
      { instrument:"CMD:XAU",      horizon:"1d", expected:0.70,  b68:[-0.20,1.60], b95:[-1.10,2.60], probUp:0.68, conf:0.71, n:52, hitRate:0.67, median:0.55, regimeConc:0.14 },
      { instrument:"RT:US10Y",     horizon:"1d", expected:1.40,  b68:[0.10,2.80],  b95:[-1.20,4.10], probUp:0.71, conf:0.69, n:48, hitRate:0.70, median:1.20, regimeConc:0.22 },
      { instrument:"IDX:SPX",      horizon:"1d", expected:null, b68:null, b95:null, probUp:null, conf:null, n:7, hitRate:null, median:null, regimeConc:0.71, suppressed:"thin_analogs" },
    ],
    analogs: [ A("21 Sep 2026","hawkish cut",-0.82), A("18 Dec 2024","hawkish cut",-1.41),
      A("01 Nov 2023","hawkish hold",0.22), A("26 Jul 2023","cut, dovish",0.61),
      A("14 Jun 2023","pause, hawkish dots",-0.94) ],
    body: [
      "The Federal Open Market Committee lowered its target range by 25 basis points, a move that had been priced at better than 95% in fed funds futures for three weeks. The decision itself was not the news.",
      "What moved markets was the summary of economic projections. The median participant now sees two fewer reductions across 2027 than in the September round, lifting the implied terminal rate to roughly 3.1%. The two-year yield rose nine basis points within twenty minutes of release; the ten-year followed more slowly.",
      "For Indian markets the transmission runs through three channels at once: the dollar index, which firmed; crude, which is priced in dollars and became marginally more expensive in rupee terms; and the rate differential that governs foreign portfolio flows into Indian debt.",
      "Our analog set contains 34 prior decisions where the policy action matched consensus but the guidance surprised hawkishly. Bank Nifty declined in 62% of them over the following session, with a median move of −0.35%. The distribution is wide and nine of those 34 cluster in late 2024, so they should be read as fewer than 34 independent observations.",
    ],
  },
  {
    id: "evt_01JC9A", slug: "rbi-eases-risk-weights-nbfc-lending",
    headline: "RBI eases risk weights on bank lending to NBFCs",
    dek: "Risk weight on exposures to better-rated non-bank lenders cut by 25 percentage points, releasing capital across the sector.",
    type: "RBI_CIRCULAR", subtype: "EASING", tier: 0,
    outlets: ["Reserve Bank of India","PTI","Mint","Economic Times"], sourceCount: 11,
    minsAgo: 96, region: "IN", section: "Policy", certainty: "confirmed",
    surpriseZ: 2.1, novelty: 0.58, magnitude: "−25pp risk weight",
    bullets: [
      { text: "Risk weight on AAA/AA-rated NBFC exposures returns to 100% from 125%.", src: "RBI circular DOR.STR.REC" },
      { text: "Applies to incremental and existing exposures from the current quarter.", src: "RBI circular" },
      { text: "Reverses part of the November 2023 tightening.", src: "Newze analysis" },
    ],
    impacts: [
      { instrument:"IDX:NIFTYBANK", horizon:"1d", expected:0.88, b68:[-0.20,2.00], b95:[-1.10,3.10], probUp:0.71, conf:0.54, n:14, hitRate:0.64, median:0.74, regimeConc:0.43 },
      { instrument:"NSE:BAJFINANCE", horizon:"1d", expected:1.90, b68:[0.10,3.80], b95:[-1.40,5.60], probUp:0.76, conf:0.51, n:14, hitRate:0.71, median:1.62, regimeConc:0.43 },
      { instrument:"NSE:HDFCBANK",  horizon:"1d", expected:0.52, b68:[-0.40,1.50], b95:[-1.30,2.40], probUp:0.63, conf:0.49, n:14, hitRate:0.57, median:0.44, regimeConc:0.43 },
      { instrument:"NSE:SBIN",      horizon:"5d", expected:null, b68:null, b95:null, probUp:null, conf:null, n:9, hitRate:null, median:null, regimeConc:0.66, suppressed:"thin_analogs" },
    ],
    analogs: [ A("08 Feb 2025","risk weight easing",1.21), A("16 Nov 2023","risk weight tightening",-2.04),
      A("05 Oct 2022","NBFC norms eased",0.88) ],
    body: [
      "The Reserve Bank has restored the 100% risk weight on bank exposures to non-banking financial companies rated AA and above, reversing roughly half of the capital surcharge imposed in November 2023.",
      "The practical effect is a release of regulatory capital at the larger private banks, whose NBFC books had been the most affected by the earlier measure. Analysts' first-pass estimates put the capital release in the ₹28,000–40,000 crore range across the system, though the circular's application to existing exposures is the detail that determines the figure.",
      "Our analog set here is thin — fourteen comparable regulatory easings since 2015 — and twelve of those fall inside two clusters. The estimate below is published with that caveat attached and a correspondingly low confidence.",
    ],
  },
  {
    id: "evt_01JCB2", slug: "brent-jumps-opec-delays-output-decision",
    headline: "Brent jumps 2.1% after OPEC+ delays output decision to December",
    dek: "The group postponed a scheduled quota review, leaving current cuts in place through the northern winter.",
    type: "OPEC_DECISION", subtype: "DELAY", tier: 1,
    outlets: ["Reuters","Bloomberg","Argus","Platts"], sourceCount: 14,
    minsAgo: 182, region: "GLOBAL", section: "Commodities", certainty: "confirmed",
    surpriseZ: 1.6, novelty: 0.44, magnitude: "+2.1% Brent", consensus: "quota review expected",
    bullets: [
      { text: "Ministerial meeting rescheduled to 14 December; current cuts roll forward.", src: "OPEC secretariat" },
      { text: "Brent front month settled at $73.42, a three-week high.", src: "ICE" },
      { text: "India imports roughly 88% of its crude; every $10 adds about 0.4pp to CPI over two quarters.", src: "Newze analysis" },
    ],
    impacts: [
      { instrument:"CMD:BRENT", horizon:"1d", expected:1.40, b68:[0.20,2.70], b95:[-1.00,4.00], probUp:0.72, conf:0.64, n:31, hitRate:0.68, median:1.15, regimeConc:0.21 },
      { instrument:"IDX:NIFTY50", horizon:"1d", expected:-0.31, b68:[-1.10,0.40], b95:[-1.90,1.00], probUp:0.38, conf:0.55, n:31, hitRate:0.58, median:-0.26, regimeConc:0.21 },
      { instrument:"FX:USDINR", horizon:"5d", expected:0.34, b68:[-0.20,0.90], b95:[-0.70,1.40], probUp:0.66, conf:0.57, n:29, hitRate:0.62, median:0.29, regimeConc:0.24 },
      { instrument:"NSE:MARUTI", horizon:"1d", expected:-0.74, b68:[-2.10,0.60], b95:[-3.40,1.90], probUp:0.35, conf:0.47, n:22, hitRate:0.59, median:-0.61, regimeConc:0.31 },
    ],
    analogs: [ A("30 Nov 2024","meeting delayed",1.84), A("04 Jun 2023","cuts extended",2.21),
      A("05 Oct 2022","2mb/d cut",4.12) ],
    body: [
      "OPEC+ postponed a quota review that several delegates had expected to produce a modest increase in output, leaving the current restraint in place through the northern hemisphere winter.",
      "Brent's reaction was immediate but contained, which is itself informative: positioning data from the prior week showed speculative length near the bottom of its five-year range, and a market that is already short reacts less violently to supply news.",
      "For India, the channel is mechanical. Crude is the largest single import line, and the rupee-denominated cost matters more than the dollar price. With USD/INR firm, the move in crude-in-rupees is roughly 2.4% rather than 2.1%.",
    ],
  },
  {
    id: "evt_01JCC7", slug: "tata-motors-q2-beats-jlr-margins",
    headline: "Tata Motors Q2 profit beats on JLR margin recovery",
    dek: "Consolidated PAT of ₹3,842 crore against a ₹3,510 crore consensus, with the surprise concentrated in the UK business.",
    type: "EARNINGS", subtype: "BEAT", tier: 0,
    outlets: ["NSE filing","BSE filing","Reuters","Mint","Moneycontrol"], sourceCount: 18,
    minsAgo: 221, region: "IN", section: "Results", certainty: "confirmed",
    surpriseZ: 1.4, novelty: 0.22, magnitude: "₹3,842cr PAT", consensus: "₹3,510cr (18 analysts)",
    bullets: [
      { text: "Consolidated revenue ₹1.09 lakh crore, up 7.2% year on year.", src: "Exchange filing" },
      { text: "JLR EBIT margin 9.1% against 7.4% a year earlier.", src: "Exchange filing" },
      { text: "Net automotive debt reduced by ₹4,100 crore in the quarter.", src: "Exchange filing" },
    ],
    impacts: [
      { instrument:"NSE:TATAMOTORS", horizon:"1d", expected:2.10, b68:[0.30,4.00], b95:[-1.20,5.80], probUp:0.74, conf:0.58, n:22, hitRate:0.64, median:1.80, regimeConc:0.18 },
      { instrument:"NSE:TATAMOTORS", horizon:"5d", expected:1.40, b68:[-1.60,4.40], b95:[-4.10,7.00], probUp:0.61, conf:0.44, n:22, hitRate:0.55, median:1.05, regimeConc:0.18 },
      { instrument:"IDX:NIFTY50", horizon:"1d", expected:0.09, b68:[-0.20,0.40], b95:[-0.50,0.70], probUp:0.56, conf:0.42, n:22, hitRate:0.53, median:0.07, regimeConc:0.18 },
    ],
    analogs: [ A("28 Jul 2026","Q1 beat",1.92), A("02 Feb 2026","Q3 beat",3.44), A("25 Oct 2025","Q2 miss",-4.12) ],
    body: [
      "Tata Motors reported consolidated profit after tax of ₹3,842 crore for the September quarter, roughly 9.5% ahead of the ₹3,510 crore consensus compiled from eighteen contributing analysts.",
      "The beat is concentrated in Jaguar Land Rover, where EBIT margin of 9.1% compares with 7.4% a year earlier. Domestic commercial vehicles were approximately in line; passenger vehicles were marginally soft on mix.",
      "Earnings surprises of this magnitude in this name have been followed by a positive next-day move in 64% of 22 analog cases, with a median of +1.8%. The five-day picture is materially weaker, which is the pattern across most of our earnings analog sets: the initial reaction carries most of the information.",
    ],
  },
  {
    id: "evt_01JCD3", slug: "india-cpi-eases-below-forecast",
    headline: "India CPI eases to 4.4%, below the 4.7% consensus",
    dek: "Food disinflation did the work. Core held at 3.9%, the sixth consecutive print inside the tolerance band.",
    type: "CPI", tier: 0,
    outlets: ["MoSPI","PTI","Reuters","Mint"], sourceCount: 9,
    minsAgo: 320, region: "IN", section: "Economy", certainty: "confirmed",
    surpriseZ: -1.8, novelty: 0.28, magnitude: "4.40% y/y", consensus: "4.70% (34 forecasters)",
    bullets: [
      { text: "Headline 4.40% against 4.72% prior; vegetables fell 6.1% month on month.", src: "MoSPI release" },
      { text: "Core (ex food, fuel) steady at 3.9%.", src: "Newze calculation" },
      { text: "Sixth straight print inside the 2–6% band.", src: "Newze analysis" },
    ],
    impacts: [
      { instrument:"RT:IN10Y", horizon:"1d", expected:-2.10, b68:[-4.40,0.20], b95:[-6.60,2.40], probUp:0.29, conf:0.67, n:46, hitRate:0.66, median:-1.80, regimeConc:0.17 },
      { instrument:"IDX:NIFTYBANK", horizon:"1d", expected:0.44, b68:[-0.40,1.30], b95:[-1.20,2.10], probUp:0.63, conf:0.60, n:46, hitRate:0.61, median:0.38, regimeConc:0.17 },
      { instrument:"IDX:NIFTY50", horizon:"1d", expected:0.26, b68:[-0.30,0.80], b95:[-0.90,1.40], probUp:0.59, conf:0.57, n:46, hitRate:0.58, median:0.21, regimeConc:0.17 },
      { instrument:"FX:USDINR", horizon:"1d", expected:-0.12, b68:[-0.40,0.20], b95:[-0.70,0.40], probUp:0.42, conf:0.51, n:46, hitRate:0.55, median:-0.09, regimeConc:0.17 },
    ],
    analogs: [ A("12 Sep 2026","downside miss",0.51), A("12 Jun 2026","downside miss",0.33),
      A("14 Mar 2026","upside beat",-0.62) ],
    body: [
      "Consumer price inflation fell to 4.40% in October from 4.72%, undershooting the 4.70% median of 34 forecasts. The surprise is roughly 1.8 standard deviations on our standardised scale, which places it in the top decile of downside misses in the past five years.",
      "Almost all of the move came from food, and within food from vegetables, which fell 6.1% on the month as the kharif arrivals reached mandis. Core inflation excluding food and fuel was unchanged at 3.9%.",
      "A downside CPI surprise of this size has historically been followed by a fall in the ten-year G-Sec yield on the next session in roughly two-thirds of comparable cases, with a median move of −1.8 basis points.",
    ],
  },
  {
    id: "evt_01JCE1", slug: "sebi-tightens-index-option-position-limits",
    headline: "SEBI tightens index option position limits for proprietary desks",
    dek: "Entity-level limits reduced; the consultation paper had proposed a steeper cut.",
    type: "SEBI_ACTION", subtype: "CIRCULAR", tier: 0,
    outlets: ["SEBI","PTI","Moneycontrol","Economic Times"], sourceCount: 12,
    minsAgo: 410, region: "IN", section: "Policy", certainty: "confirmed",
    surpriseZ: 0.4, novelty: 0.49,
    bullets: [
      { text: "Entity-level net limit reduced to ₹1,200 crore delta-equivalent.", src: "SEBI circular" },
      { text: "Implementation deferred to the February expiry.", src: "SEBI circular" },
      { text: "Softer than the ₹900 crore figure floated in the consultation paper.", src: "Newze analysis" },
    ],
    impacts: [
      { instrument:"IDX:NIFTYBANK", horizon:"1d", expected:null, b68:null, b95:null, probUp:null, conf:null, n:4, hitRate:null, median:null, regimeConc:0.88, suppressed:"thin_analogs" },
      { instrument:"IDX:INDIAVIX", horizon:"1d", expected:null, b68:null, b95:null, probUp:null, conf:null, n:4, hitRate:null, median:null, regimeConc:0.88, suppressed:"thin_analogs" },
    ],
    analogs: [ A("01 Oct 2024","F&O framework tightened",-1.12), A("20 Jul 2023","margin rules",-0.34) ],
    body: [
      "The market regulator has reduced entity-level position limits in index options for proprietary trading desks, with effect from the February expiry.",
      "The published figure is materially softer than the one floated in the September consultation paper, which is the part of the story that matters for positioning.",
      "We have four comparable regulatory events in our corpus, all clustered in a single eighteen-month window. That is not enough history to publish an impact estimate, and the publication gate has suppressed it. The raw context is shown instead.",
    ],
  },
  {
    id: "evt_01JCF9", slug: "fii-selling-resumes-dii-absorb",
    headline: "FIIs sell ₹2,140 crore in cash; domestic institutions absorb the lot",
    dek: "The eleventh session in thirteen of foreign selling, and the eleventh of domestic buying exceeding it.",
    type: "FII_DII_FLOW", subtype: "NET_SELL", tier: 0,
    outlets: ["NSE","BSE","Newze"], sourceCount: 4,
    minsAgo: 512, region: "IN", section: "Flows", certainty: "confirmed",
    surpriseZ: null, novelty: 0.12,
    bullets: [
      { text: "FII net cash −₹2,140 crore; DII net +₹2,980 crore.", src: "Exchange provisional data" },
      { text: "FII index futures net short rose to 71,400 contracts.", src: "NSE participant-wise OI" },
      { text: "SIP inflows for October were ₹26,400 crore, a record.", src: "AMFI" },
    ],
    impacts: [
      { instrument:"IDX:NIFTY50", horizon:"5d", expected:-0.18, b68:[-1.40,1.00], b95:[-2.60,2.20], probUp:0.46, conf:0.39, n:602, hitRate:0.54, median:-0.14, regimeConc:0.09 },
      { instrument:"IDX:MIDCAP", horizon:"5d", expected:-0.44, b68:[-2.10,1.20], b95:[-3.80,2.90], probUp:0.42, conf:0.41, n:602, hitRate:0.56, median:-0.37, regimeConc:0.09 },
    ],
    analogs: [ A("06 Nov 2026","FII sell, DII absorb",0.21), A("23 Oct 2026","FII sell, DII absorb",-0.44),
      A("17 Oct 2026","FII sell, DII absorb",-0.88) ],
    body: [
      "Foreign institutional investors were net sellers of ₹2,140 crore in the cash segment, the eleventh session of selling in the last thirteen. Domestic institutions bought ₹2,980 crore.",
      "The pattern has held for most of the quarter and is the single most important structural feature of this Indian market: domestic flows, led by systematic investment plans running at a record ₹26,400 crore a month, have been large enough to absorb foreign selling without a disorderly fall in prices.",
      "This is our highest-volume event class, with 602 settled analog cases. It is also one of our least predictive at the index level — the five-day hit rate is 54%, barely above a coin flip, and we publish it with that number shown.",
    ],
  },
  {
    id: "evt_01JCG4", slug: "infosys-adr-slips-overnight",
    headline: "Infosys ADR slips 1.8% overnight on US IT spending caution",
    dek: "A peer's guidance cut dragged the whole US-listed Indian IT complex lower after the Indian close.",
    type: "GUIDANCE_CHANGE", subtype: "CUT", tier: 1,
    outlets: ["Reuters","Bloomberg","CNBC"], sourceCount: 8,
    minsAgo: 620, region: "US", section: "Technology", certainty: "confirmed",
    surpriseZ: -1.1, novelty: 0.33,
    bullets: [
      { text: "INFY ADR closed at a 1.8% discount to the Indian close, adjusted for currency.", src: "NYSE" },
      { text: "A US peer cut full-year services guidance by 150bp.", src: "Reuters" },
      { text: "ADR dislocation of this size has preceded a negative Indian open in 68% of 44 cases.", src: "Newze analysis" },
    ],
    impacts: [
      { instrument:"NSE:INFY", horizon:"1d", expected:-1.30, b68:[-2.60,0.00], b95:[-3.90,1.30], probUp:0.31, conf:0.63, n:44, hitRate:0.68, median:-1.12, regimeConc:0.15 },
      { instrument:"NSE:TCS",  horizon:"1d", expected:-0.72, b68:[-1.80,0.40], b95:[-2.90,1.50], probUp:0.37, conf:0.56, n:44, hitRate:0.61, median:-0.64, regimeConc:0.15 },
    ],
    analogs: [ A("09 Oct 2026","ADR discount 1.6%",-1.44), A("18 Jul 2026","ADR discount 2.1%",-1.92),
      A("12 Apr 2026","ADR premium 1.4%",0.88) ],
    body: [
      "Infosys's New York-listed depositary receipt closed 1.8% below its Indian close on a currency-adjusted basis, following a guidance reduction at a large US IT services peer.",
      "The ADR dislocation is one of the six components in our Overnight Bridge attribution, and on a morning like this it is the second-largest contributor after the US close itself.",
    ],
  },
  {
    id: "evt_01JCH8", slug: "unconfirmed-block-deal-reliance",
    headline: "Unconfirmed: large block reported in Reliance",
    dek: "Circulating on social channels only. No exchange filing. We publish this as tracked and unverified.",
    type: "RUMOUR", tier: 4,
    outlets: ["Social (unverified)"], sourceCount: 2,
    minsAgo: 18, region: "IN", section: "Flows", certainty: "rumoured",
    surpriseZ: null, novelty: 0.8,
    bullets: [
      { text: "No exchange filing has been made as of 10:04 IST.", src: "NSE/BSE announcements" },
      { text: "Source tier 4. No impact estimate is computed for tier-4 sources.", src: "Newze editorial policy" },
    ],
    impacts: [],
    analogs: [],
    body: [
      "A claim of a large block trade in Reliance Industries is circulating on social channels. There is no exchange filing, and no tier-0 or tier-1 outlet has reported it.",
      "Our policy is to track claims like this visibly rather than ignore them, and to compute no impact estimate for them. If it is confirmed by a filing or a wire, this story will update and its certainty will change from rumoured to confirmed — the change will appear on the timeline below, and anyone alerted on it will be re-alerted.",
    ],
  },
  {
    id: "evt_01JCJ2", slug: "gst-collections-record-november",
    headline: "GST collections hit ₹1.92 lakh crore, a record for the month",
    dek: "Up 9.4% year on year, with the beat concentrated in domestic transactions rather than imports.",
    type: "GST_COLLECTION", tier: 0,
    outlets: ["Ministry of Finance","PTI","Mint"], sourceCount: 7,
    minsAgo: 745, region: "IN", section: "Economy", certainty: "confirmed",
    surpriseZ: 1.1, novelty: 0.19, magnitude: "₹1.92 lakh cr", consensus: "₹1.86 lakh cr",
    bullets: [
      { text: "Gross collections ₹1.92 lakh crore against ₹1.76 lakh crore a year earlier.", src: "Ministry of Finance" },
      { text: "Domestic component up 11.2%; import component up 3.8%.", src: "Ministry of Finance" },
      { text: "Refunds of ₹22,400 crore; net collection ₹1.70 lakh crore.", src: "Newze calculation" },
    ],
    impacts: [
      { instrument:"IDX:NIFTY50", horizon:"1d", expected:0.14, b68:[-0.40,0.70], b95:[-0.90,1.20], probUp:0.55, conf:0.44, n:58, hitRate:0.56, median:0.11, regimeConc:0.13 },
      { instrument:"NSE:LT", horizon:"5d", expected:0.62, b68:[-1.10,2.40], b95:[-2.80,4.10], probUp:0.59, conf:0.41, n:51, hitRate:0.57, median:0.48, regimeConc:0.16 },
    ],
    analogs: [ A("01 Oct 2026","record print",0.22), A("01 Jul 2026","above consensus",0.09) ],
    body: [
      "Goods and services tax collections reached ₹1.92 lakh crore, a record for the month and 9.4% above the year-earlier figure.",
      "The composition matters more than the headline. Domestic transactions grew 11.2% while the import component grew 3.8%, which points to domestic demand rather than trade as the driver.",
    ],
  },
  {
    id: "evt_01JCK6", slug: "bank-nifty-short-buildup-94th-percentile",
    headline: "Bank Nifty short build-up reaches the 94th percentile",
    dek: "Open interest rose 12.1% while price fell 0.4% — the clearest short build-up in the index since March.",
    type: "FNO_STRUCTURE", tier: 0,
    outlets: ["NSE","Newze"], sourceCount: 3,
    minsAgo: 55, region: "IN", section: "Derivatives", certainty: "confirmed",
    surpriseZ: null, novelty: 0.41,
    bullets: [
      { text: "OI +12.1% with price −0.4%: short build-up by the standard classification.", src: "NSE derivatives data" },
      { text: "94th percentile against this index's own 250-day history.", src: "Newze calculation" },
      { text: "Put-call ratio 0.72 against a 30-day average of 0.88.", src: "NSE option chain" },
    ],
    impacts: [
      { instrument:"IDX:NIFTYBANK", horizon:"5d", expected:0.61, b68:[-1.80,3.00], b95:[-4.10,5.30], probUp:0.61, conf:0.47, n:23, hitRate:0.61, median:0.58, regimeConc:0.35 },
    ],
    analogs: [ A("14 Mar 2026","short build-up 92nd pct",1.84), A("07 Nov 2025","short build-up 95th pct",-2.11),
      A("22 Aug 2025","short build-up 91st pct",1.02) ],
    body: [
      "Bank Nifty open interest rose 12.1% in the November series while the index fell 0.4%, the combination that the standard four-way classification labels a short build-up.",
      "Ranked against this index's own 250-day history, today's open-interest change sits at the 94th percentile. The ranking is deliberately within-symbol: comparing an open-interest change across symbols with different liquidity profiles produces nonsense.",
      "Twenty-three historical cases match the pattern of a short build-up above the 90th percentile with ten to twenty days to expiry. Eight of those twenty-three fall inside a single six-month window, so the effective sample is smaller than the count suggests.",
    ],
  },
  {
    id: "evt_01JCL0", slug: "ecb-holds-rates-cuts-growth-forecast",
    headline: "ECB holds, cuts its 2027 growth forecast",
    dek: "Rates unchanged as expected; the staff projection revision is the signal.",
    type: "RATE_DECISION", subtype: "HOLD", tier: 1,
    outlets: ["Reuters","Bloomberg","FT"], sourceCount: 16,
    minsAgo: 1180, region: "EU", section: "Central banks", certainty: "confirmed",
    surpriseZ: -0.6, novelty: 0.21, magnitude: "hold", consensus: "hold",
    bullets: [
      { text: "Deposit rate unchanged at 2.25%.", src: "ECB statement" },
      { text: "2027 GDP projection cut to 1.1% from 1.4%.", src: "ECB staff projections" },
    ],
    impacts: [
      { instrument:"FX:EURUSD", horizon:"1d", expected:-0.28, b68:[-0.70,0.10], b95:[-1.10,0.50], probUp:0.36, conf:0.58, n:38, hitRate:0.60, median:-0.24, regimeConc:0.20 },
      { instrument:"IDX:SX5E", horizon:"1d", expected:0.18, b68:[-0.60,0.90], b95:[-1.40,1.80], probUp:0.55, conf:0.45, n:38, hitRate:0.54, median:0.15, regimeConc:0.20 },
    ],
    analogs: [ A("17 Sep 2026","hold, dovish revision",-0.31), A("06 Jun 2026","cut",-0.52) ],
    body: [
      "The European Central Bank left its deposit rate unchanged at 2.25%, in line with every forecast in the survey. The staff projection round carried the news: the 2027 growth forecast was cut by three tenths.",
    ],
  },
  {
    id: "evt_01JCM5", slug: "hdfc-bank-block-deal-0-4-percent",
    headline: "HDFC Bank: 0.4% of equity changes hands in a block",
    dek: "Exchange-reported block worth roughly ₹5,200 crore at an implied 1.2% discount to the previous close.",
    type: "BULK_BLOCK_DEAL", subtype: "BLOCK", tier: 0,
    outlets: ["NSE","BSE","Reuters"], sourceCount: 6,
    minsAgo: 140, region: "IN", section: "Flows", certainty: "confirmed",
    surpriseZ: null, novelty: 0.3,
    bullets: [
      { text: "Approximately 3.05 crore shares at ₹1,702 against a ₹1,723 previous close.", src: "Exchange block deal window" },
      { text: "Counterparties not disclosed in the exchange filing.", src: "NSE" },
    ],
    impacts: [
      { instrument:"NSE:HDFCBANK", horizon:"1d", expected:-0.34, b68:[-1.20,0.50], b95:[-2.00,1.30], probUp:0.41, conf:0.52, n:88, hitRate:0.58, median:-0.29, regimeConc:0.11 },
      { instrument:"NSE:HDFCBANK", horizon:"5d", expected:0.22, b68:[-1.60,2.00], b95:[-3.30,3.70], probUp:0.54, conf:0.40, n:88, hitRate:0.53, median:0.18, regimeConc:0.11 },
    ],
    analogs: [ A("03 Sep 2026","0.3% block, 1.0% discount",-0.41), A("19 May 2026","0.6% block, 1.8% discount",-0.92) ],
    body: [
      "A block of roughly 3.05 crore HDFC Bank shares, about 0.4% of equity, traded at ₹1,702 against the previous close of ₹1,723 — an implied discount of 1.2%.",
      "Blocks at a discount of one to two percent have been followed by a negative next-day move in 58% of 88 analog cases, with the median move materially smaller than the discount itself.",
    ],
  },
];

export const storyBySlug = (s: string) => STORIES.find((x) => x.slug === s);
export const leadStory = STORIES.find((s) => s.lead)!;
export const storiesFor = (section: string) => STORIES.filter((s) => s.section === section);

/* ── Overnight Bridge ────────────────────────────────────────────────────── */
export const BRIDGE = {
  date: "2026-11-12", publishedAt: "07:30 IST", model: "bridge-v0.9.1",
  mae30: 41, onTime30: 30,
  estimates: [
    { id:"IDX:NIFTY50", prevClose:24462.10, open:24310, gapPct:-0.62,
      b68:[24250,24370] as [number,number], b95:[24180,24440] as [number,number], conf:0.64,
      gapFill:0.58, gapFillN:142 },
    { id:"IDX:NIFTYBANK", prevClose:53058.00, open:52840, gapPct:-0.41,
      b68:[52690,52990] as [number,number], b95:[52520,53160] as [number,number], conf:0.59,
      gapFill:0.61, gapFillN:138 },
  ],
  attribution: [
    { name:"US close", pts:-38, note:"S&P 500 −0.9%, Nasdaq −1.3%" },
    { name:"Fed decision", pts:-18, note:"hawkish dot plot", story:"fed-cuts-25bp-signals-slower-path" },
    { name:"Crude", pts:-12, note:"Brent +2.1% on OPEC+ delay", story:"brent-jumps-opec-delays-output-decision" },
    { name:"USD/INR", pts:9, note:"rupee firmer on CPI undershoot" },
    { name:"ADR drag", pts:-6, note:"INFY −1.8%, HDB −0.4%", story:"infosys-adr-slips-overnight" },
    { name:"Asia", pts:-4, note:"Nikkei −0.5%, Hang Seng +0.2%" },
    { name:"Residual", pts:2, note:"unexplained by the model" },
  ],
  levels: { maxPain:24400, highOiPE:24200, highOiCE:24500, pcr:0.84, prevVwap:24455 },
  topStories: ["fed-cuts-25bp-signals-slower-path","rbi-eases-risk-weights-nbfc-lending",
    "brent-jumps-opec-delays-output-decision"],
  yesterday: { est:24462, actual:24438, errorPts:24, inB68:true },
  history: [
    { d:"11 Nov", est:24462, act:24438, err:24, hit:true },
    { d:"10 Nov", est:24501, act:24560, err:-59, hit:true },
    { d:"07 Nov", est:24388, act:24291, err:97, hit:false },
    { d:"06 Nov", est:24410, act:24433, err:-23, hit:true },
    { d:"05 Nov", est:24277, act:24252, err:25, hit:true },
    { d:"04 Nov", est:24190, act:24248, err:-58, hit:true },
    { d:"03 Nov", est:24102, act:23998, err:104, hit:false },
    { d:"31 Oct", est:24044, act:24061, err:-17, hit:true },
    { d:"30 Oct", est:23980, act:23944, err:36, hit:true },
    { d:"29 Oct", est:23901, act:23922, err:-21, hit:true },
  ],
};

/* ── Accuracy Ledger ─────────────────────────────────────────────────────── */
export const LEDGER = {
  since: "01 Jan 2026", modelVersion: "impact-v1.4.2",
  overall: { n:4187, dirAcc:0.612, coverage68:0.698, brier:0.207, calErr:0.03, mae:0.0074 },
  calibration: [
    { bucket:"50–55%", predicted:0.525, realised:0.512, n:812 },
    { bucket:"55–60%", predicted:0.575, realised:0.566, n:1104 },
    { bucket:"60–65%", predicted:0.625, realised:0.641, n:968 },
    { bucket:"65–70%", predicted:0.675, realised:0.662, n:701 },
    { bucket:"70–75%", predicted:0.725, realised:0.744, n:398 },
    { bucket:"75–80%", predicted:0.775, realised:0.751, n:204 },
  ],
  byType: [
    { type:"RATE_DECISION", n:412, dir:0.672, cov:0.731, brier:0.184, trend:"up", status:"published" },
    { type:"CPI", n:388, dir:0.648, cov:0.714, brier:0.196, trend:"flat", status:"published" },
    { type:"GUIDANCE_CHANGE", n:242, dir:0.631, cov:0.702, brier:0.203, trend:"up", status:"published" },
    { type:"BULK_BLOCK_DEAL", n:516, dir:0.604, cov:0.691, brier:0.213, trend:"flat", status:"published" },
    { type:"EARNINGS", n:1204, dir:0.591, cov:0.682, brier:0.221, trend:"down", status:"published" },
    { type:"OPEC_DECISION", n:96, dir:0.583, cov:0.675, brier:0.228, trend:"flat", status:"published" },
    { type:"FII_DII_FLOW", n:602, dir:0.578, cov:0.669, brier:0.233, trend:"down", status:"watch" },
    { type:"RBI_CIRCULAR", n:88, dir:0.568, cov:0.662, brier:0.241, trend:"flat", status:"watch" },
    { type:"SEBI_ACTION", n:41, dir:0.521, cov:0.610, brier:0.268, trend:"down", status:"suppressed",
      suppressedOn:"04 Nov 2026", reason:"Rolling 90-day calibration breached tolerance" },
    { type:"GEOPOLITICAL", n:88, dir:0.510, cov:0.592, brier:0.271, trend:"flat", status:"suppressed",
      suppressedOn:"22 Sep 2026", reason:"Calibration error exceeded 0.08 for two consecutive windows" },
  ],
  byHorizon: [
    { h:"15m", n:702, dir:0.641, cov:0.712, brier:0.192 },
    { h:"1h",  n:884, dir:0.628, cov:0.706, brier:0.199 },
    { h:"1d",  n:1588, dir:0.612, cov:0.698, brier:0.207 },
    { h:"5d",  n:703, dir:0.571, cov:0.671, brier:0.236 },
    { h:"20d", n:310, dir:0.542, cov:0.648, brier:0.249 },
  ],
  withdrawals: [
    { date:"08 Nov 2026", what:"Impact on ADANIENT withdrawn", reason:"Entity mis-resolution — the event referred to an unlisted group subsidiary" },
    { date:"22 Oct 2026", what:"CPI surprise sign error; 14 impacts recomputed", reason:"Consensus feed delivered a revised rather than pre-release figure" },
    { date:"14 Sep 2026", what:"Impact on TATAPOWER withdrawn", reason:"Duplicate event — the same filing was ingested twice under different IDs" },
  ],
  versions: [
    { v:"impact-v1.4.2", from:"12 Oct 2026", dir:0.612, n:1284, note:"Current. Regime-concentration penalty added." },
    { v:"impact-v1.3.0", from:"03 Aug 2026", dir:0.597, n:1702, note:"Analog weighting by recency." },
    { v:"impact-v1.2.1", from:"19 May 2026", dir:0.584, n:1201, note:"First version with published confidence." },
    { v:"impact-v1.0", from:"01 Jan 2026", dir:0.561, n:0, note:"Shadow mode only. Never user-visible." },
  ],
};

/* ── Derivatives: option chain + OI build-up ─────────────────────────────── */
export const OPTION_CHAIN = {
  underlying:"IDX:NIFTYBANK", spot:52841, expiry:"27 Nov 2026", dte:15,
  pcr:0.72, maxPain:52800, atmIv:14.2, ivPct:38,
  rows: [
    { strike:52000, ceOi:18420, ceChg:-2140, ceIv:16.8, ceLtp:1024, peOi: 6210, peChg: 1840, peIv:15.1, peLtp:118 },
    { strike:52200, ceOi:16880, ceChg:-1420, ceIv:16.1, ceLtp: 862, peOi: 8940, peChg: 2610, peIv:14.8, peLtp:156 },
    { strike:52400, ceOi:21340, ceChg:  980, ceIv:15.4, ceLtp: 714, peOi:12480, peChg: 3420, peIv:14.4, peLtp:208 },
    { strike:52600, ceOi:24610, ceChg: 3210, ceIv:14.8, ceLtp: 580, peOi:17220, peChg: 4180, peIv:14.1, peLtp:272 },
    { strike:52800, ceOi:31280, ceChg: 6840, ceIv:14.2, ceLtp: 462, peOi:26140, peChg: 5920, peIv:14.2, peLtp:352 },
    { strike:53000, ceOi:28440, ceChg: 5120, ceIv:14.1, ceLtp: 360, peOi:31860, peChg: 7240, peIv:14.6, peLtp:448 },
    { strike:53200, ceOi:19260, ceChg: 2840, ceIv:14.3, ceLtp: 274, peOi:24180, peChg: 4120, peIv:15.2, peLtp:562 },
    { strike:53400, ceOi:12840, ceChg: 1620, ceIv:14.7, ceLtp: 204, peOi:16420, peChg: 2180, peIv:15.9, peLtp:692 },
    { strike:53600, ceOi: 8120, ceChg:  740, ceIv:15.3, ceLtp: 148, peOi:10240, peChg: 1140, peIv:16.7, peLtp:836 },
  ],
};

export type Buildup = "LONG_BUILDUP" | "SHORT_BUILDUP" | "LONG_UNWINDING" | "SHORT_COVERING";
export const OI_TABLE: { id:string; priceChg:number; oiChg:number; buildup:Buildup;
  pcr:number; ivPct:number; pctile:number }[] = [
  { id:"IDX:NIFTYBANK", priceChg:-0.41, oiChg:12.1, buildup:"SHORT_BUILDUP", pcr:0.72, ivPct:38, pctile:94 },
  { id:"IDX:NIFTY50",   priceChg:-0.22, oiChg: 3.4, buildup:"SHORT_BUILDUP", pcr:0.84, ivPct:31, pctile:41 },
  { id:"NSE:HDFCBANK",  priceChg: 1.12, oiChg:-8.2, buildup:"SHORT_COVERING", pcr:0.91, ivPct:44, pctile:78 },
  { id:"NSE:RELIANCE",  priceChg: 0.61, oiChg: 9.8, buildup:"LONG_BUILDUP",   pcr:1.14, ivPct:52, pctile:66 },
  { id:"NSE:INFY",      priceChg:-0.94, oiChg: 4.1, buildup:"SHORT_BUILDUP",  pcr:0.68, ivPct:61, pctile:29 },
  { id:"NSE:TATAMOTORS",priceChg: 2.31, oiChg:14.6, buildup:"LONG_BUILDUP",   pcr:1.32, ivPct:58, pctile:88 },
  { id:"NSE:BAJFINANCE",priceChg: 1.84, oiChg:-5.1, buildup:"SHORT_COVERING", pcr:1.02, ivPct:49, pctile:71 },
  { id:"NSE:SBIN",      priceChg:-0.38, oiChg:-6.7, buildup:"LONG_UNWINDING", pcr:0.79, ivPct:36, pctile:54 },
  { id:"NSE:ADANIENT",  priceChg:-2.14, oiChg:18.2, buildup:"SHORT_BUILDUP",  pcr:0.61, ivPct:77, pctile:92 },
  { id:"NSE:MARUTI",    priceChg:-0.72, oiChg: 2.2, buildup:"SHORT_BUILDUP",  pcr:0.88, ivPct:33, pctile:22 },
];
export const BUILDUP_LABEL: Record<Buildup,string> = {
  LONG_BUILDUP:"Long build-up", SHORT_BUILDUP:"Short build-up",
  LONG_UNWINDING:"Long unwinding", SHORT_COVERING:"Short covering",
};

/* ── participant-wise OI ("smart money vs retail") ───────────────────────── */
export const PARTICIPANTS = [
  { who:"FII", idxFutLong: 42180, idxFutShort:113600, idxOptLong: 284100, idxOptShort: 301400, stkFutLong:1284000, stkFutShort: 412000 },
  { who:"DII", idxFutLong: 88400, idxFutShort: 31200, idxOptLong:  42800, idxOptShort:  38100, stkFutLong: 318000, stkFutShort: 204000 },
  { who:"Pro", idxFutLong:126400, idxFutShort:142800, idxOptLong:1842000, idxOptShort:1918000, stkFutLong: 684000, stkFutShort: 712000 },
  { who:"Client", idxFutLong:214600, idxFutShort:184200, idxOptLong:2410000, idxOptShort:2321000, stkFutLong:1142000, stkFutShort:2100000 },
];

/* ── FII / DII flows, last 15 sessions (₹ crore) ─────────────────────────── */
export const FLOWS = [
  { d:"12 Nov", fii:-2140, dii: 2980 }, { d:"11 Nov", fii:-1880, dii: 2240 },
  { d:"10 Nov", fii:  940, dii:  310 }, { d:"07 Nov", fii:-3420, dii: 3810 },
  { d:"06 Nov", fii:-2010, dii: 2460 }, { d:"05 Nov", fii:-1240, dii: 1980 },
  { d:"04 Nov", fii:  610, dii:  -40 }, { d:"03 Nov", fii:-4180, dii: 4420 },
  { d:"31 Oct", fii:-2860, dii: 3140 }, { d:"30 Oct", fii:-1420, dii: 1760 },
  { d:"29 Oct", fii: 1180, dii:  240 }, { d:"28 Oct", fii:-2240, dii: 2610 },
  { d:"25 Oct", fii:-3010, dii: 3380 }, { d:"24 Oct", fii:-1640, dii: 2080 },
  { d:"23 Oct", fii:-2480, dii: 2740 },
];

/* ── macro series ────────────────────────────────────────────────────────── */
export const MACRO_IN = [
  { name:"CPI inflation", value:4.40, prior:4.72, consensus:4.70, unit:"% y/y", period:"Oct 2026", surprise:-1.8, src:"MoSPI" },
  { name:"Core CPI", value:3.90, prior:3.90, consensus:3.95, unit:"% y/y", period:"Oct 2026", surprise:-0.3, src:"Newze calc" },
  { name:"WPI inflation", value:2.18, prior:2.44, consensus:2.40, unit:"% y/y", period:"Oct 2026", surprise:-0.9, src:"DPIIT" },
  { name:"IIP growth", value:3.10, prior:2.80, consensus:3.40, unit:"% y/y", period:"Sep 2026", surprise:-0.7, src:"MoSPI" },
  { name:"GDP growth", value:6.80, prior:6.70, consensus:6.60, unit:"% y/y", period:"Q1 FY27", surprise:0.6, src:"MoSPI" },
  { name:"GST collections", value:1.92, prior:1.84, consensus:1.86, unit:"₹ lakh cr", period:"Oct 2026", surprise:1.1, src:"MoF" },
  { name:"Mfg PMI", value:57.2, prior:56.8, consensus:56.9, unit:"index", period:"Oct 2026", surprise:0.4, src:"S&P Global" },
  { name:"Services PMI", value:59.1, prior:58.4, consensus:58.6, unit:"index", period:"Oct 2026", surprise:0.6, src:"S&P Global" },
  { name:"Trade deficit", value:-21.4, prior:-23.8, consensus:-24.1, unit:"$ bn", period:"Oct 2026", surprise:1.2, src:"Commerce Ministry" },
  { name:"Repo rate", value:5.75, prior:6.00, consensus:5.75, unit:"%", period:"Oct 2026", surprise:0.0, src:"RBI" },
  { name:"Forex reserves", value:702.4, prior:698.1, consensus:null, unit:"$ bn", period:"07 Nov", surprise:null, src:"RBI WSS" },
  { name:"SIP inflows", value:26400, prior:25810, consensus:null, unit:"₹ cr", period:"Oct 2026", surprise:null, src:"AMFI" },
];
export const MACRO_GLOBAL = [
  { name:"US CPI", value:2.60, prior:2.80, consensus:2.70, unit:"% y/y", period:"Oct 2026", surprise:-0.8, src:"BLS" },
  { name:"US core PCE", value:2.40, prior:2.50, consensus:2.45, unit:"% y/y", period:"Sep 2026", surprise:-0.4, src:"BEA" },
  { name:"US non-farm payrolls", value:148, prior:161, consensus:135, unit:"k", period:"Oct 2026", surprise:0.9, src:"BLS" },
  { name:"US unemployment", value:4.30, prior:4.20, consensus:4.30, unit:"%", period:"Oct 2026", surprise:0.0, src:"BLS" },
  { name:"Euro area CPI", value:2.10, prior:2.20, consensus:2.15, unit:"% y/y", period:"Oct 2026", surprise:-0.3, src:"Eurostat" },
  { name:"China mfg PMI", value:49.8, prior:49.4, consensus:49.6, unit:"index", period:"Oct 2026", surprise:0.3, src:"NBS" },
  { name:"Japan CPI", value:2.30, prior:2.50, consensus:2.40, unit:"% y/y", period:"Oct 2026", surprise:-0.5, src:"Statistics Bureau" },
  { name:"UK CPI", value:2.70, prior:2.60, consensus:2.60, unit:"% y/y", period:"Oct 2026", surprise:0.5, src:"ONS" },
];

/* ── central banks ───────────────────────────────────────────────────────── */
export const CENTRAL_BANKS = [
  { bank:"US Federal Reserve", code:"FED", rate:3.625, prev:3.875, next:"16 Dec 2026", stance:"Easing, slower",
    implied3m:-0.18, implied12m:-0.52, note:"Dot plot removed two 2027 cuts" },
  { bank:"European Central Bank", code:"ECB", rate:2.25, prev:2.25, next:"18 Dec 2026", stance:"On hold",
    implied3m:-0.11, implied12m:-0.34, note:"2027 growth forecast cut to 1.1%" },
  { bank:"Bank of England", code:"BOE", rate:3.75, prev:4.00, next:"19 Dec 2026", stance:"Easing",
    implied3m:-0.14, implied12m:-0.46, note:"Services inflation still the constraint" },
  { bank:"Bank of Japan", code:"BOJ", rate:0.75, prev:0.50, next:"19 Dec 2026", stance:"Tightening",
    implied3m:0.09, implied12m:0.31, note:"Yen weakness keeps pressure on" },
  { bank:"Reserve Bank of India", code:"RBI", rate:5.75, prev:6.00, next:"05 Dec 2026", stance:"Easing",
    implied3m:-0.12, implied12m:-0.38, note:"CPI undershoot opens room" },
  { bank:"People's Bank of China", code:"PBOC", rate:2.90, prev:3.00, next:"20 Dec 2026", stance:"Easing",
    implied3m:-0.08, implied12m:-0.25, note:"Targeted easing continues" },
];

/* ── macro calendar ──────────────────────────────────────────────────────── */
export const CALENDAR = [
  { when:"Today 16:00 IST", region:"US", event:"Initial jobless claims", consensus:"221k", prior:"217k", impact:2 },
  { when:"Today 18:30 IST", region:"US", event:"Fed speaker — Williams", consensus:"—", prior:"—", impact:2 },
  { when:"Today 21:00 IST", region:"US", event:"EIA crude inventories", consensus:"−1.2mb", prior:"+2.1mb", impact:2 },
  { when:"Tomorrow 09:00 IST", region:"IN", event:"RBI policy minutes", consensus:"—", prior:"—", impact:3 },
  { when:"Tomorrow 17:30 IST", region:"EU", event:"Euro area industrial production", consensus:"+0.4%", prior:"−0.3%", impact:1 },
  { when:"14 Nov 11:00 IST", region:"IN", event:"WPI inflation", consensus:"2.20%", prior:"2.18%", impact:2 },
  { when:"17 Nov 07:30 IST", region:"ASIA", event:"Japan Q3 GDP", consensus:"+0.2% q/q", prior:"+0.5%", impact:2 },
  { when:"18 Nov 19:00 IST", region:"US", event:"Retail sales", consensus:"+0.3%", prior:"+0.4%", impact:3 },
  { when:"20 Nov", region:"IN", event:"Nifty F&O weekly expiry", consensus:"—", prior:"—", impact:3 },
  { when:"27 Nov", region:"IN", event:"Nifty & Bank Nifty monthly expiry", consensus:"—", prior:"—", impact:3 },
  { when:"28 Nov 17:30 IST", region:"IN", event:"Q2 FY27 GDP", consensus:"6.6%", prior:"6.8%", impact:3 },
  { when:"05 Dec", region:"IN", event:"RBI monetary policy decision", consensus:"hold at 5.75%", prior:"5.75%", impact:3 },
  { when:"16 Dec", region:"US", event:"FOMC decision", consensus:"hold at 3.625%", prior:"3.625%", impact:3 },
];

/* ── narratives ──────────────────────────────────────────────────────────── */
export const NARRATIVES = [
  { label:"Fed terminal rate repricing", share:14.2, wow:38, sentiment:-0.3, instruments:["RT:US10Y","FX:DXY","CMD:XAU"],
    divergence:0.2, note:"Mentions rising with price — narrative and market agree" },
  { label:"India domestic flow absorption", share:9.8, wow:12, sentiment:0.5, instruments:["IDX:NIFTY50","IDX:MIDCAP"],
    divergence:0.1, note:"Steady, structural" },
  { label:"IT services demand softness", share:8.4, wow:61, sentiment:-0.6, instruments:["NSE:INFY","NSE:TCS"],
    divergence:0.7, note:"Mentions accelerating while the sector has stopped falling — watch for exhaustion" },
  { label:"Crude supply discipline", share:7.1, wow:44, sentiment:-0.2, instruments:["CMD:BRENT","NSE:MARUTI"],
    divergence:0.3, note:"" },
  { label:"NBFC credit cycle", share:5.9, wow:88, sentiment:0.4, instruments:["NSE:BAJFINANCE","IDX:NIFTYBANK"],
    divergence:0.5, note:"First time above threshold since Feb 2025" },
  { label:"Yen carry unwind", share:4.2, wow:-18, sentiment:-0.1, instruments:["FX:USDJPY","IDX:N225"],
    divergence:0.6, note:"Narrative fading while positioning has not — divergence worth watching" },
  { label:"Retail F&O regulation", share:3.6, wow:124, sentiment:-0.4, instruments:["IDX:NIFTYBANK","IDX:INDIAVIX"],
    divergence:0.4, note:"Spiking on the SEBI circular" },
  { label:"Gold as reserve asset", share:3.1, wow:7, sentiment:0.6, instruments:["CMD:XAU","CMD:XAG"],
    divergence:0.2, note:"" },
];

/* ── sectors ─────────────────────────────────────────────────────────────── */
export const SECTORS = [
  { name:"Nifty Bank", chg:-0.41, chg5:1.82, chg20:3.94, breadth:0.42 },
  { name:"Nifty IT", chg:-0.94, chg5:-2.18, chg20:-4.41, breadth:0.20 },
  { name:"Nifty Auto", chg:1.24, chg5:2.94, chg20:6.12, breadth:0.73 },
  { name:"Nifty Pharma", chg:0.38, chg5:0.92, chg20:2.18, breadth:0.58 },
  { name:"Nifty FMCG", chg:0.11, chg5:-0.44, chg20:1.02, breadth:0.47 },
  { name:"Nifty Metal", chg:-0.82, chg5:1.14, chg20:5.88, breadth:0.38 },
  { name:"Nifty Energy", chg:0.54, chg5:1.61, chg20:2.44, breadth:0.61 },
  { name:"Nifty Realty", chg:-1.42, chg5:-2.88, chg20:-1.14, breadth:0.22 },
  { name:"Nifty PSU Bank", chg:0.88, chg5:3.42, chg20:8.12, breadth:0.80 },
  { name:"Nifty Infra", chg:0.29, chg5:1.08, chg20:3.21, breadth:0.55 },
];

/* ── index contribution attribution ──────────────────────────────────────── */
export const CONTRIB = [
  { id:"NSE:HDFCBANK", pts: 18.4 }, { id:"NSE:RELIANCE", pts: 11.2 },
  { id:"NSE:BAJFINANCE", pts: 8.1 }, { id:"NSE:SBIN", pts: 4.6 },
  { id:"NSE:LT", pts: 3.2 }, { id:"NSE:TCS", pts: -9.8 },
  { id:"NSE:INFY", pts: -14.1 }, { id:"NSE:MARUTI", pts: -6.4 },
  { id:"NSE:ADANIENT", pts: -5.2 }, { id:"NSE:SUNPHARMA", pts: -2.1 },
];

/* ── risk dashboard ──────────────────────────────────────────────────────── */
export const RISK = [
  { name:"VIX", value:16.4, pct:34, note:"Below the 5-year median" },
  { name:"India VIX", value:13.9, pct:28, note:"Compressed into expiry" },
  { name:"MOVE (bond vol)", value:98.2, pct:52, note:"Elevated vs equity vol" },
  { name:"US IG spread", value:84, pct:18, note:"bp over treasuries" },
  { name:"US HY spread", value:312, pct:24, note:"bp — near cycle tights" },
  { name:"2s10s curve", value:38, pct:61, note:"bp — positive, steepening" },
  { name:"India 10Y − repo", value:99, pct:44, note:"bp term premium" },
  { name:"Gold / S&P ratio", value:0.448, pct:71, note:"Elevated" },
];

/* ── sections used by nav ────────────────────────────────────────────────── */
export const SECTIONS = ["Central banks","Policy","Economy","Results","Derivatives",
  "Flows","Commodities","Technology"];

export const stats = {
  storiesToday: 147, sourcesLive: 62, impactsOpen: 38, settledToday: 212,
  corpusEvents: 1842066, corpusYears: 15,
};

/* ── additional coverage ─────────────────────────────────────────────────── */
const MORE: Story[] = [
  {
    id: "evt_01JD10", slug: "sebi-fo-overhaul-lot-sizes-weekly-expiry",
    headline: "SEBI's F&O overhaul: bigger contracts, one weekly expiry per exchange",
    dek: "Reported changes raise the minimum index contract value and restrict weekly expiries to a single benchmark per exchange. Published accounts disagree on the detail.",
    type: "SEBI_ACTION", subtype: "CIRCULAR", tier: 0,
    outlets: ["SEBI","NSE","BSE","PTI","Moneycontrol"], sourceCount: 16,
    minsAgo: 74, region: "IN", section: "Policy", certainty: "confirmed",
    surpriseZ: 0.8, novelty: 0.62,
    hi: { headline: "सेबी का F&O बदलाव: बड़े अनुबंध, प्रति एक्सचेंज एक साप्ताहिक एक्सपायरी",
          dek: "रिपोर्ट के अनुसार न्यूनतम सूचकांक अनुबंध मूल्य बढ़ा और साप्ताहिक एक्सपायरी एक बेंचमार्क तक सीमित।" },
    bullets: [
      { text: "Index derivatives minimum contract value moved into a roughly ₹15–20 lakh band — the first revision in about nine years.", src: "Secondary reporting; verify against exchange circular" },
      { text: "Each exchange retains weekly contracts on only one benchmark index. Reports disagree on which days apply.", src: "Secondary reporting" },
      { text: "Reported alongside: a 50:50 cash margin rule, higher STT on futures and option premium, and upfront option premium collection.", src: "Secondary reporting" },
    ],
    impacts: [
      { instrument:"IDX:NIFTYBANK", horizon:"5d", expected:null, b68:null, b95:null, probUp:null, conf:null, n:6, hitRate:null, median:null, regimeConc:0.82, suppressed:"thin_analogs" },
      { instrument:"IDX:INDIAVIX", horizon:"5d", expected:null, b68:null, b95:null, probUp:null, conf:null, n:6, hitRate:null, median:null, regimeConc:0.82, suppressed:"thin_analogs" },
    ],
    analogs: [ A("01 Oct 2024","F&O framework tightened",-1.12), A("20 Nov 2024","lot size revision",-0.64) ],
    body: [
      "Regulatory changes to India's derivatives framework have been widely reported, covering contract size, weekly expiry structure, margin treatment and transaction taxes. The direction of travel is consistent across accounts: fewer, larger contracts and fewer weekly settlement events.",
      "We are publishing this with an unusual caveat. The secondary sources reporting these changes disagree with one another on specifics — including the current Nifty lot size, which expiry days apply to which benchmark, and the effective dates of individual measures. Some still quote figures that other sources describe as superseded.",
      "Our editorial rule in this situation is to report the direction confidently, report the specifics as disputed, and tell you to verify against the exchange circular before you trade on any number. We have not published an impact estimate: six comparable regulatory events, clustered in a narrow window, is not a sample.",
    ],
  },
  {
    id: "evt_01JD11", slug: "gold-hits-record-rupee-terms-festive-demand",
    headline: "Gold at a record in rupee terms as festive demand meets a softer currency",
    dek: "The dollar price did part of the work; the rupee did the rest. Domestic buyers are paying the combination.",
    type: "COMMODITY_MOVE", tier: 1,
    outlets: ["Reuters","World Gold Council","Mint","PTI"], sourceCount: 12,
    minsAgo: 160, region: "IN", section: "Commodities", certainty: "confirmed",
    surpriseZ: 1.3, novelty: 0.34,
    hi: { headline: "रुपये में सोना रिकॉर्ड पर, त्योहारी मांग और कमजोर मुद्रा का असर",
          dek: "डॉलर कीमत ने आधा काम किया, बाकी रुपये ने। घरेलू खरीदार दोनों का भुगतान कर रहे हैं।" },
    bullets: [
      { text: "Domestic prices track international moves, with rupee weakness magnifying the gain.", src: "World Gold Council analysis" },
      { text: "Import duty remains the fastest-acting lever on the domestic price — a 2024 cut dropped it about 6% month-on-month while dollar gold rose.", src: "World Gold Council" },
      { text: "RBI gold reserves stood near 880 tonnes at end Q3 2026, with gold's share of forex reserves up from about 9% to 12.5% by August 2025.", src: "World Gold Council / RBI" },
    ],
    impacts: [
      { instrument:"CMD:XAU", horizon:"5d", expected:0.84, b68:[-1.20,2.90], b95:[-3.10,4.80], probUp:0.62, conf:0.53, n:74, hitRate:0.60, median:0.71, regimeConc:0.19 },
      { instrument:"FX:USDINR", horizon:"5d", expected:0.18, b68:[-0.24,0.62], b95:[-0.60,1.04], probUp:0.59, conf:0.48, n:74, hitRate:0.57, median:0.15, regimeConc:0.19 },
    ],
    analogs: [ A("22 Oct 2026","festive demand peak",1.24), A("09 Sep 2026","rupee weakness",0.88),
      A("14 Jul 2024","duty cut",-6.10) ],
    body: [
      "Gold reached a record in rupee terms, a milestone that says as much about the currency as about the metal. Domestic prices mirror international movements closely, and a weaker rupee magnifies the domestic gain even when the dollar price is unchanged.",
      "For Indian households the practical effect splits two ways. Jewellery volumes fall at high prices while investment demand through bars, coins and exchange-traded funds rises. Econometric work finds income and price to be the main long-run drivers of Indian gold demand, and both are pointing the same way right now.",
      "The import bill is the macro consequence. Gold sits behind only crude as an import line, and a record rupee price widens the external deficit at the same time as it lifts the valuation of the central bank's own reserves.",
    ],
  },
  {
    id: "evt_01JD12", slug: "msci-november-review-four-additions",
    headline: "MSCI adds four Indian names, lifting the country weight",
    dek: "An estimated $2 billion of passive money has to transact on the effective date, whatever it thinks of the price.",
    type: "INDEX_REBALANCE", subtype: "ADD", tier: 1,
    outlets: ["MSCI","Business Standard","Reuters","Nuvama"], sourceCount: 14,
    minsAgo: 300, region: "IN", section: "Flows", certainty: "confirmed",
    surpriseZ: 0.6, novelty: 0.28,
    hi: { headline: "MSCI ने चार भारतीय नाम जोड़े, देश का भार बढ़ा",
          dek: "अनुमानित $2 अरब निष्क्रिय पूंजी को प्रभावी तिथि पर लेन-देन करना ही होगा।" },
    bullets: [
      { text: "India's weight in the MSCI Emerging Markets index rises from 11.5% to 11.7%.", src: "Business Standard, citing Nuvama" },
      { text: "LIC, Coforge, Meesho and Adani Green added; PI Industries removed with an estimated $119mn of outflows.", src: "Business Standard" },
      { text: "NTPC stays in the index but sees the largest weight-cut outflow at about $97mn.", src: "Business Standard" },
    ],
    impacts: [
      { instrument:"IDX:NIFTY50", horizon:"5d", expected:0.22, b68:[-0.90,1.34], b95:[-2.10,2.56], probUp:0.56, conf:0.44, n:96, hitRate:0.55, median:0.18, regimeConc:0.22 },
    ],
    analogs: [ A("12 Aug 2026","MSCI August review",0.41), A("14 May 2026","MSCI May review",-0.22) ],
    body: [
      "MSCI's November review adds four Indian companies to its standard index and removes one, lifting India's weight in the emerging-markets benchmark.",
      "Index rebalancing produces the only genuinely price-insensitive order flow in public markets. Funds tracking the index must transact, on the effective date, regardless of view. What makes it tradeable in theory also makes it crowded in practice: the changes are announced in advance, and most of the price move happens in the announcement window rather than on the effective date.",
      "Published estimates for the same review differ materially depending on the assumed index assets under management and the weight base used. We show two of them side by side on our index-flows page rather than picking the one that reads better.",
    ],
  },
  {
    id: "evt_01JD13", slug: "rupee-weakest-in-three-months-rbi-reserves",
    headline: "Rupee at a three-month low; reserve data suggests the RBI has been active",
    dek: "A managed currency hides pressure in reserves rather than in the exchange rate. The weekly series is the better read.",
    type: "FX_INTERVENTION", subtype: "VERBAL", tier: 0,
    outlets: ["RBI","Reuters","Mint","Business Standard"], sourceCount: 9,
    minsAgo: 420, region: "IN", section: "Economy", certainty: "reported",
    surpriseZ: null, novelty: 0.31,
    hi: { headline: "रुपया तीन महीने के निचले स्तर पर; भंडार आंकड़े RBI की सक्रियता का संकेत",
          dek: "प्रबंधित मुद्रा में दबाव विनिमय दर के बजाय भंडार में दिखता है।" },
    bullets: [
      { text: "Forex reserves at $702.4bn in the week to 07 November.", src: "RBI weekly statistical supplement" },
      { text: "The rupee's observed volatility understates the underlying pressure because intervention absorbs it.", src: "Newze analysis" },
      { text: "Rate differentials against the US govern the carry supporting debt inflows.", src: "Newze analysis" },
    ],
    impacts: [
      { instrument:"FX:USDINR", horizon:"5d", expected:0.14, b68:[-0.22,0.52], b95:[-0.54,0.86], probUp:0.58, conf:0.46, n:188, hitRate:0.56, median:0.11, regimeConc:0.14 },
      { instrument:"NSE:INFY", horizon:"5d", expected:0.62, b68:[-1.40,2.70], b95:[-3.20,4.50], probUp:0.60, conf:0.47, n:184, hitRate:0.58, median:0.54, regimeConc:0.14 },
    ],
    analogs: [ A("18 Aug 2026","three-month low",0.22), A("02 May 2026","intervention week",-0.18) ],
    body: [
      "The rupee reached a three-month low against the dollar, with weekly reserve data pointing to central bank activity in the market.",
      "Because the rupee is managed, the exchange rate is the wrong place to look for stress. Intervention compresses observed volatility, which makes the statistical relationship between the dollar and Indian assets look weaker than the underlying economic one. Reserve changes, published weekly, are frequently the better read.",
      "For equity the transmission is split. Exporters benefit; companies with unhedged dollar liabilities and importers of dollar-priced inputs do not.",
    ],
  },
  {
    id: "evt_01JD14", slug: "it-sector-worst-week-guidance-caution",
    headline: "Indian IT has its worst week in four months on guidance caution",
    dek: "A peer's reduction abroad reset expectations for the whole services complex before a single Indian company said anything.",
    type: "GUIDANCE_CHANGE", subtype: "CUT", tier: 1,
    outlets: ["Reuters","Bloomberg","Mint","Economic Times"], sourceCount: 15,
    minsAgo: 540, region: "IN", section: "Technology", certainty: "confirmed",
    surpriseZ: -1.4, novelty: 0.29,
    hi: { headline: "मार्गदर्शन में सावधानी से भारतीय आईटी का चार महीने का सबसे खराब सप्ताह",
          dek: "विदेश में एक प्रतिस्पर्धी की कटौती ने पूरे सेवा क्षेत्र की उम्मीदें बदल दीं।" },
    bullets: [
      { text: "The Nifty IT index fell 2.18% over five sessions.", src: "Exchange data" },
      { text: "ADR dislocation preceded the Indian move, as it usually does for this sector.", src: "Newze analysis" },
      { text: "Narrative tracking shows 'IT services demand softness' mentions up 61% week on week.", src: "Newze narrative tracker" },
    ],
    impacts: [
      { instrument:"NSE:INFY", horizon:"5d", expected:-1.10, b68:[-3.40,1.20], b95:[-5.60,3.40], probUp:0.36, conf:0.52, n:66, hitRate:0.59, median:-0.94, regimeConc:0.27 },
      { instrument:"NSE:TCS", horizon:"5d", expected:-0.82, b68:[-2.80,1.14], b95:[-4.70,3.06], probUp:0.39, conf:0.49, n:66, hitRate:0.56, median:-0.70, regimeConc:0.27 },
      { instrument:"NSE:WIPRO", horizon:"5d", expected:-1.24, b68:[-3.90,1.42], b95:[-6.20,3.70], probUp:0.34, conf:0.45, n:62, hitRate:0.57, median:-1.06, regimeConc:0.29 },
    ],
    analogs: [ A("09 Oct 2026","peer guidance cut",-1.92), A("18 Jul 2026","demand commentary",-2.41),
      A("12 Apr 2026","guidance raise",1.64) ],
    body: [
      "Indian IT services stocks recorded their worst week in four months, driven not by any domestic disclosure but by a guidance reduction at a large overseas peer.",
      "This is the ADR channel working as described. US-listed depositary receipts trade for seven hours after the Indian close, so the repricing of Indian IT happens in New York and arrives in Mumbai as an opening gap. Our transmission study rates ADR dislocation a moderate-strength channel, with the important caveat that thin ADR liquidity frequently overstates the signal.",
      "The narrative tracker shows a sharp divergence worth noting: mentions of IT demand softness are accelerating while the sector has stopped falling. Narrative intensifying against a stabilising price is the pattern that often precedes exhaustion, though we publish no estimate from narrative data alone.",
    ],
  },
  {
    id: "evt_01JD15", slug: "mcx-crude-volumes-record-retail-participation",
    headline: "MCX crude volumes hit a record as retail participation broadens",
    dek: "Smaller contract sizes brought a new cohort into commodities. The timing, against an OPEC+ decision window, is uncomfortable.",
    type: "MARKET_STRUCTURE", tier: 0,
    outlets: ["MCX","PTI","Mint"], sourceCount: 7,
    minsAgo: 620, region: "IN", section: "Commodities", certainty: "confirmed",
    surpriseZ: null, novelty: 0.42,
    hi: { headline: "MCX में कच्चे तेल का वॉल्यूम रिकॉर्ड पर, खुदरा भागीदारी बढ़ी",
          dek: "छोटे अनुबंध आकार ने नए निवेशकों को कमोडिटी में लाया।" },
    bullets: [
      { text: "MCX lists futures and options across more than 50 commodities spanning metals, energy and agriculture.", src: "MCX" },
      { text: "Non-agri contracts trade from 09:00 to 23:30 IST, extending to 23:55 in winter to hold the overlap with US hours.", src: "Exchange timing guides" },
      { text: "Mini and micro contract variants lower the capital threshold materially.", src: "MCX contract specifications" },
    ],
    impacts: [
      { instrument:"CMD:BRENT", horizon:"5d", expected:null, b68:null, b95:null, probUp:null, conf:null, n:8, hitRate:null, median:null, regimeConc:0.74, suppressed:"thin_analogs" },
    ],
    analogs: [],
    body: [
      "Crude futures volumes on the Multi Commodity Exchange reached a record, with the exchange attributing part of the increase to broader retail participation through smaller contract variants.",
      "The structural point is the trading window. Non-agricultural commodity contracts trade until late evening India time, shifting with US daylight saving so that the overlap with American hours is preserved. That makes MCX one of the few Indian venues where a trader can react to US inventory data or an OPEC headline on the same calendar day rather than at the next morning's equity open.",
      "It is also where the risk sits. A retail participant who has only traded equities is used to a market that closes at 15:30 and absorbs overnight news in a gap. A commodity position stays live through the US session.",
    ],
  },
  {
    id: "evt_01JD16", slug: "psu-banks-lead-as-credit-costs-ease",
    headline: "PSU banks lead the market as credit costs ease",
    dek: "The sector is up 8.1% over twenty sessions with the broadest participation of any Indian sector.",
    type: "EARNINGS", subtype: "BEAT", tier: 1,
    outlets: ["Reuters","Mint","Moneycontrol"], sourceCount: 10,
    minsAgo: 700, region: "IN", section: "Results", certainty: "confirmed",
    surpriseZ: 1.1, novelty: 0.24,
    hi: { headline: "क्रेडिट लागत घटने से सरकारी बैंक बाज़ार में आगे",
          dek: "बीस सत्रों में क्षेत्र 8.1% ऊपर, भागीदारी सबसे व्यापक।" },
    bullets: [
      { text: "Nifty PSU Bank up 8.12% over twenty sessions with 80% of constituents advancing.", src: "Exchange data" },
      { text: "Breadth at this level is the highest of any Indian sector in the current sample.", src: "Newze calculation" },
    ],
    impacts: [
      { instrument:"IDX:NIFTYBANK", horizon:"5d", expected:0.48, b68:[-1.20,2.20], b95:[-2.80,3.80], probUp:0.58, conf:0.46, n:112, hitRate:0.57, median:0.41, regimeConc:0.21 },
      { instrument:"NSE:SBIN", horizon:"5d", expected:0.92, b68:[-1.80,3.70], b95:[-4.20,6.10], probUp:0.61, conf:0.48, n:108, hitRate:0.59, median:0.78, regimeConc:0.21 },
    ],
    analogs: [ A("03 Sep 2026","credit cost improvement",1.42), A("16 Jun 2026","asset quality beat",2.08) ],
    body: [
      "Public sector banks led the Indian market over the past month, with the sector index up 8.1% and breadth at 80% — the highest participation of any sector in the current sample.",
      "Breadth matters more than the index move here. A sector rising on two constituents is a stock story; a sector rising on eight of ten is a re-rating of the group. The latter has historically persisted longer.",
    ],
  },
  {
    id: "evt_01JD17", slug: "sip-inflows-record-structural-shift",
    headline: "SIP inflows set another record, deepening the domestic bid",
    dek: "₹26,400 crore a month of largely price-insensitive buying is the single most important structural fact about this market.",
    type: "MF_FLOW", subtype: "INFLOW", tier: 0,
    outlets: ["AMFI","PTI","Mint","Economic Times"], sourceCount: 11,
    minsAgo: 820, region: "IN", section: "Flows", certainty: "confirmed",
    surpriseZ: 0.7, novelty: 0.18,
    hi: { headline: "एसआईपी निवेश नया रिकॉर्ड, घरेलू मांग और मजबूत",
          dek: "हर महीने ₹26,400 करोड़ की मूल्य-असंवेदनशील खरीद इस बाज़ार का सबसे अहम ढांचागत तथ्य है।" },
    bullets: [
      { text: "Monthly systematic investment plan inflow of ₹26,400 crore, a record.", src: "AMFI" },
      { text: "Roughly 19.2 crore demat accounts as of October.", src: "CDSL / NSDL" },
      { text: "Foreign ownership of Nifty 50 constituents fell from about 27% in 2015 to roughly 18% by end-2024.", src: "Ownership data via market research" },
    ],
    impacts: [
      { instrument:"IDX:NIFTY50", horizon:"20d", expected:0.34, b68:[-2.80,3.50], b95:[-5.60,6.30], probUp:0.55, conf:0.37, n:88, hitRate:0.54, median:0.29, regimeConc:0.16 },
      { instrument:"IDX:MIDCAP", horizon:"20d", expected:0.71, b68:[-3.90,5.30], b95:[-7.80,9.20], probUp:0.57, conf:0.36, n:86, hitRate:0.55, median:0.62, regimeConc:0.16 },
    ],
    analogs: [ A("08 Oct 2026","record SIP",0.44), A("09 Sep 2026","record SIP",0.21) ],
    body: [
      "Monthly systematic investment plan inflows set another record, continuing a trend that has quietly reshaped how Indian equities respond to global stress.",
      "A large, recurring, price-insensitive domestic bid is why sustained foreign selling no longer produces the index falls it caused in 2013 or 2018. It is also why foreign flow data is a far weaker signal than most traders still assume — our own ledger rates it our weakest published class, at a hit rate barely above a coin flip.",
      "The honest caveat is that this bid has not been tested through a genuine, prolonged domestic drawdown. Systematic plans are sticky in normal conditions; whether they stay sticky through a twenty percent fall is an open question with no Indian precedent at this scale.",
    ],
  },
];
STORIES.push(...MORE);

/* Hindi headlines for the original coverage. Structured payload only — prose is
   not machine-translated, per the content design rules. */
const HI: Record<string, { headline: string; dek: string }> = {
  "fed-cuts-25bp-signals-slower-path": {
    headline: "फेड ने 25bp की कटौती की, पर आगे की राह धीमी रहने का संकेत",
    dek: "कटौती पहले से कीमत में थी। 2027 में दो कम कटौतियों का संकेत नहीं था — यही बदलाव लाया।" },
  "rbi-eases-risk-weights-nbfc-lending": {
    headline: "RBI ने एनबीएफसी को बैंक ऋण पर जोखिम भार घटाया",
    dek: "बेहतर रेटिंग वाली एनबीएफसी पर जोखिम भार 25 प्रतिशत अंक कम, जिससे पूंजी मुक्त हुई।" },
  "brent-jumps-opec-delays-output-decision": {
    headline: "ओपेक+ के फैसले टालने से ब्रेंट 2.1% चढ़ा",
    dek: "समूह ने कोटा समीक्षा टाल दी, मौजूदा कटौती सर्दियों तक जारी।" },
  "tata-motors-q2-beats-jlr-margins": {
    headline: "जेएलआर मार्जिन सुधार से टाटा मोटर्स का Q2 मुनाफा अनुमान से बेहतर",
    dek: "₹3,842 करोड़ का समेकित लाभ, अनुमान ₹3,510 करोड़ के मुकाबले।" },
  "india-cpi-eases-below-forecast": {
    headline: "भारत की खुदरा महंगाई 4.4% पर, अनुमान 4.7% से कम",
    dek: "खाद्य कीमतों में नरमी मुख्य कारण। कोर महंगाई 3.9% पर स्थिर।" },
  "sebi-tightens-index-option-position-limits": {
    headline: "सेबी ने प्रोप डेस्क के लिए इंडेक्स ऑप्शन पोजीशन सीमा सख्त की",
    dek: "इकाई स्तर की सीमा घटाई गई; परामर्श पत्र में प्रस्ताव इससे भी कड़ा था।" },
  "fii-selling-resumes-dii-absorb": {
    headline: "एफआईआई ने ₹2,140 करोड़ बेचे, घरेलू संस्थानों ने पूरा सोख लिया",
    dek: "तेरह में से ग्यारहवां सत्र जब विदेशी बिकवाली को घरेलू खरीद ने संभाला।" },
  "infosys-adr-slips-overnight": {
    headline: "अमेरिकी आईटी खर्च पर चिंता से इन्फोसिस एडीआर 1.8% फिसला",
    dek: "एक प्रतिस्पर्धी के मार्गदर्शन में कटौती ने भारतीय बंद के बाद पूरे समूह को नीचे खींचा।" },
  "unconfirmed-block-deal-reliance": {
    headline: "अपुष्ट: रिलायंस में बड़े ब्लॉक सौदे की चर्चा",
    dek: "केवल सोशल चैनलों पर। कोई एक्सचेंज फाइलिंग नहीं। हम इसे असत्यापित के रूप में प्रकाशित कर रहे हैं।" },
  "gst-collections-record-november": {
    headline: "जीएसटी संग्रह ₹1.92 लाख करोड़, महीने का रिकॉर्ड",
    dek: "सालाना 9.4% वृद्धि, बढ़त घरेलू लेनदेन से, आयात से नहीं।" },
  "bank-nifty-short-buildup-94th-percentile": {
    headline: "बैंक निफ्टी में शॉर्ट बिल्ड-अप 94वें पर्सेंटाइल पर",
    dek: "ओपन इंटरेस्ट 12.1% बढ़ा जबकि कीमत 0.4% गिरी — मार्च के बाद सबसे स्पष्ट शॉर्ट बिल्ड-अप।" },
  "ecb-holds-rates-cuts-growth-forecast": {
    headline: "ईसीबी ने दरें स्थिर रखीं, 2027 का वृद्धि अनुमान घटाया",
    dek: "दरें अपेक्षा के अनुरूप अपरिवर्तित; असली संकेत स्टाफ अनुमान में संशोधन है।" },
  "hdfc-bank-block-deal-0-4-percent": {
    headline: "एचडीएफसी बैंक: 0.4% इक्विटी ब्लॉक सौदे में हस्तांतरित",
    dek: "लगभग ₹5,200 करोड़ का सौदा, पिछले बंद भाव से 1.2% छूट पर।" },
};
for (const s of STORIES) { const h = HI[s.slug]; if (h) s.hi = h; }
