/* ───────────────────────────────────────────────────────────────────────────
   OPTIONS — chains, implied distributions and the market's own probabilities.

   The probabilities here are RISK-NEUTRAL. They come from option prices, which
   embed the premium investors demand for bearing risk, so the distribution is
   tilted relative to what the underlying has historically done. That is stated
   on every surface that renders them — it is the single most important caveat
   in this file and the one most often dropped by tools that show this data.

   Method references (real): Breeden–Litzenberger (the second derivative of the
   call price with respect to strike gives the risk-neutral density);
   P(S_T > K) = N(d2) under Black–Scholes; one-sigma expected move
   = S × IV × √(DTE/365); the ATM straddle ≈ 0.8σ, so straddle ÷ 0.8 ≈ 1σ.
   Chain values below are sample data.
   ─────────────────────────────────────────────────────────────────────────── */

export type ChainRow = {
  strike: number;
  ceOi: number; ceChg: number; ceIv: number; ceLtp: number; ceVol: number;
  peOi: number; peChg: number; peIv: number; peLtp: number; peVol: number;
};

export type Chain = {
  slug: string; instrument: string; name: string; venue: string;
  spot: number; expiry: string; dte: number; lot: number;
  atmIv: number; ivRank: number; pcr: number; maxPain: number;
  straddle: number;            // ATM straddle premium
  rows: ChainRow[];
  note: string;
};

function mkRow(strike: number, spot: number, iv: number, seed: number): ChainRow {
  const d = (strike - spot) / spot;
  const near = Math.exp(-Math.pow(d * 14, 2));
  const oiBase = 6000 + near * 26000;
  const skew = d < 0 ? 1.18 : 0.86;                // put skew
  const r = (n: number) => ((Math.sin(seed * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1;
  const ceOi = Math.round(oiBase * (d >= 0 ? 1.14 : 0.78) * (0.8 + r(1) * 0.45));
  const peOi = Math.round(oiBase * (d <= 0 ? 1.2 : 0.72) * (0.8 + r(2) * 0.45));
  const tv = Math.max(0.4, near * spot * iv * 0.016);
  return {
    strike,
    ceOi, ceChg: Math.round(ceOi * (r(3) - 0.42) * 0.5),
    ceIv: +(iv * 100 * (1 + Math.max(0, d) * 1.1 + 0.03)).toFixed(1),
    ceLtp: +Math.max(0.5, spot - strike > 0 ? spot - strike + tv : tv).toFixed(1),
    ceVol: Math.round(ceOi * (0.25 + r(4) * 0.7)),
    peOi, peChg: Math.round(peOi * (r(5) - 0.38) * 0.5),
    peIv: +(iv * 100 * (1 + Math.max(0, -d) * 1.4 * skew + 0.03)).toFixed(1),
    peLtp: +Math.max(0.5, strike - spot > 0 ? strike - spot + tv : tv).toFixed(1),
    peVol: Math.round(peOi * (0.25 + r(6) * 0.7)),
  };
}

function mkChain(
  slug: string, instrument: string, name: string, venue: string,
  spot: number, step: number, iv: number, dte: number, expiry: string,
  lot: number, ivRank: number, seed: number, note: string
): Chain {
  const atm = Math.round(spot / step) * step;
  const rows: ChainRow[] = [];
  for (let k = -5; k <= 5; k++) rows.push(mkRow(atm + k * step, spot, iv, seed + k));
  const ce = rows.reduce((a, r) => a + r.ceOi, 0);
  const pe = rows.reduce((a, r) => a + r.peOi, 0);
  // max pain: strike minimising total intrinsic value payable by writers
  let maxPain = atm, best = Infinity;
  for (const r of rows) {
    const pain = rows.reduce((a, x) =>
      a + Math.max(0, r.strike - x.strike) * x.ceOi + Math.max(0, x.strike - r.strike) * x.peOi, 0);
    if (pain < best) { best = pain; maxPain = r.strike; }
  }
  const at = rows.find((r) => r.strike === atm)!;
  return {
    slug, instrument, name, venue, spot, expiry, dte, lot,
    atmIv: +(iv * 100).toFixed(1), ivRank, pcr: +(pe / ce).toFixed(2), maxPain,
    straddle: +(at.ceLtp + at.peLtp).toFixed(1), rows, note,
  };
}

export const CHAINS: Chain[] = [
  mkChain("nifty", "IDX:NIFTY50", "Nifty 50", "NSE", 24338, 100, 0.131, 15, "27 Nov 2026", 65, 31, 3.1,
    "India's benchmark. The most liquid option chain in the country and the reference for every implied-probability figure on this site."),
  mkChain("banknifty", "IDX:NIFTYBANK", "Nifty Bank", "NSE", 52841, 200, 0.142, 15, "27 Nov 2026", 30, 38, 5.7,
    "Higher implied volatility than Nifty and a correlation above 0.98 to it — the leverage instrument, not a diversifier."),
  mkChain("finnifty", "IDX:FINNIFTY", "Nifty Financial Services", "NSE", 23410, 100, 0.138, 15, "27 Nov 2026", 65, 34, 7.2,
    "Overlaps heavily with Bank Nifty. Treating positions in both as independent risk is a common and expensive error."),
  mkChain("sensex", "IDX:SENSEX", "BSE Sensex", "BSE", 78610, 200, 0.128, 11, "25 Nov 2026", 20, 29, 9.4,
    "Thirty large caps against the Nifty's fifty. The composition gap, not sentiment, drives most Sensex–Nifty divergence."),
  mkChain("crudeoil", "CMD:BRENT", "Crude Oil", "MCX", 6453, 50, 0.284, 18, "19 Nov 2026", 100, 61, 11.8,
    "Priced in rupees on MCX and trading until late evening, so the position carries through the entire US session."),
  mkChain("naturalgas", "CMD:NG", "Natural Gas", "MCX", 248, 5, 0.462, 18, "25 Nov 2026", 1250, 78, 13.5,
    "The highest implied volatility of any liquid Indian contract. Weekly US inventory data is the dominant scheduled risk."),
  mkChain("gold", "CMD:XAU", "Gold", "MCX", 78420, 500, 0.146, 32, "05 Dec 2026", 100, 44, 15.9,
    "Rupee-denominated, so the contract carries both the metal and the currency. Import duty changes move it independently of the dollar price."),
];

export const chainBySlug = (s: string) => CHAINS.find((c) => c.slug === s);

/* ── implied probability ─────────────────────────────────────────────────── */

/** Normal CDF — Abramowitz & Stegun 7.1.26. */
export function ncdf(x: number) {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989422804014327 * Math.exp(-x * x / 2);
  const p = d * t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 +
    t * (-1.821255978 + t * 1.330274429))));
  return x > 0 ? 1 - p : p;
}

/** One-sigma expected move: S × IV × √(DTE/365). */
export function expectedMove(spot: number, ivPct: number, dte: number) {
  return spot * (ivPct / 100) * Math.sqrt(dte / 365);
}

/** P(S_T > K) under Black–Scholes with zero drift = N(d2). Risk-neutral. */
export function probAbove(spot: number, strike: number, ivPct: number, dte: number) {
  const iv = ivPct / 100, t = dte / 365;
  if (t <= 0 || iv <= 0) return spot > strike ? 1 : 0;
  const d2 = (Math.log(spot / strike) - (iv * iv / 2) * t) / (iv * Math.sqrt(t));
  return ncdf(d2);
}

export function outlook(c: Chain) {
  const em = expectedMove(c.spot, c.atmIv, c.dte);
  const up = probAbove(c.spot, c.spot, c.atmIv, c.dte);
  const bands = [0.5, 1, 1.5, 2].map((k) => ({
    k, lo: c.spot - em * k, hi: c.spot + em * k,
    inside: 1 - 2 * (1 - ncdf(k)),
  }));
  return {
    em, up, down: 1 - up,
    straddleImplied: c.straddle / 0.8,       // ATM straddle ≈ 0.8σ
    breakevenUp: c.spot + c.straddle,
    breakevenDown: c.spot - c.straddle,
    bands,
  };
}

/* ── index relationships ─────────────────────────────────────────────────── */

export const INDEX_LINKS = {
  pairs: [
    { a: "Nifty 50", b: "Sensex", corr: 0.97, beta: 0.99,
      note: "Two benchmarks of the same market. Published analysis puts the long-run correlation near 85% on average, above 90% in most months since 2008 — and it has fallen as low as 11% in a single month during a sector-rotation episode." },
    { a: "Nifty 50", b: "Nifty Bank", corr: 0.98, beta: 1.12,
      note: "Analysis since January 2017 reported correlation above 0.98 and beta of 1.12. Bank Nifty is a leverage instrument on the Nifty, not a diversifier." },
    { a: "Nifty Bank", b: "Fin Nifty", corr: 0.96, beta: 0.94,
      note: "Heavy constituent overlap. Positions in both are close to the same position twice." },
    { a: "Nifty 50", b: "Nifty Midcap", corr: 0.88, beta: 1.26,
      note: "Higher beta and genuinely lower correlation — the one pair in this set with real diversification." },
    { a: "Nifty Bank", b: "Nifty PSU Bank", corr: 0.79, beta: 1.41,
      note: "High beta with relatively low correlation. Published analysis notes this makes PSU bank exposure inefficient to hedge with Bank Nifty." },
  ],
  divergence: [
    { h: "It is composition, not sentiment", p: "The Sensex holds thirty large caps; the Nifty holds fifty. Weight differences — notably the Nifty's three public sector banks against the Sensex's single one — explain most of the gap on any given day. A divergence between the two is an arithmetic result, not a market signal." },
    { h: "Divergence is not weakness", p: "Commentary frequently reads a Sensex–Nifty gap as internal weakness. Analysis of the relationship finds that a divergence between the two does not necessarily indicate weakness; it usually indicates that a few heavyweights moved differently." },
    { h: "Correlation breaks down exactly when you need it", p: "The Nifty–Sensex correlation has fallen to as low as 11% in a single month. Correlation is a long-run average that conceals episodes, and hedges sized on the average fail during the episodes." },
    { h: "High beta is not diversification", p: "Bank Nifty's 0.98 correlation and 1.12 beta to the Nifty means holding both is holding more of one thing. Fin Nifty against Bank Nifty is worse still." },
  ],
};

/* ── editorial view ──────────────────────────────────────────────────────── */

export const VIEWS: Record<string, { stance: string; body: string[]; watch: string[] }> = {
  nifty: {
    stance: "The implied distribution is unusually narrow into this expiry",
    body: [
      "Implied volatility in the bottom third of its own year, with a macro-heavy calendar still ahead, is the configuration where the option market is cheapest and the realised outcome is most likely to embarrass it. That is a statement about the price of optionality, not a direction call.",
      "The put skew is doing the useful work here. Downside protection is bid relative to upside, which is normal for an index and tells you where the hedging demand sits rather than where the market is going.",
    ],
    watch: ["Whether IV percentile stays below 35 into the final week",
      "Max pain distance from spot as expiry approaches",
      "Whether the US rate path repricing continues"],
  },
  banknifty: {
    stance: "Short build-up at a 250-day extreme, with correlation to Nifty above 0.98",
    body: [
      "Open interest rose 12.1% while the index fell 0.4% — a short build-up in the 94th percentile of this index's own history. Twenty-three comparable cases exist and eight of them fall inside a single six-month window, so the effective sample is far smaller than the count.",
      "The more useful observation is structural. Bank Nifty's correlation to the Nifty is above 0.98 with a beta near 1.12. Anyone running positions in both is running one position with extra steps, and the higher implied volatility is the cost of that leverage, not a separate opportunity.",
    ],
    watch: ["Whether the short build-up unwinds or extends into expiry",
      "Participant-wise OI: FII net short against client net long",
      "RBI risk-weight follow-through on NBFC exposures"],
  },
  sensex: {
    stance: "Divergence from the Nifty is composition, and the market keeps misreading it",
    body: [
      "The Sensex holds thirty names, the Nifty fifty, and the weight differences — particularly in public sector banks — account for most daily divergence between them. Published analysis of the relationship is explicit that a gap does not necessarily indicate weakness.",
      "A shorter expiry cycle and a smaller lot make the Sensex chain a different instrument from the Nifty chain even though the underlying exposure is nearly identical.",
    ],
    watch: ["Weight divergence in financials", "Whether the correlation holds above 0.9 through the month"],
  },
  crudeoil: {
    stance: "The highest-consequence contract an Indian trader can hold overnight",
    body: [
      "MCX crude trades until late evening, shifting with US daylight saving so the overlap with American hours is preserved. An equity trader's overnight risk arrives once, as a gap. A crude position is live through the entire US session, through inventory data and through OPEC headlines.",
      "The rupee leg compounds it. The contract is rupee-denominated, so a trader is long or short both the barrel and the currency, and the two frequently move together unhelpfully.",
    ],
    watch: ["OPEC+ meeting calendar", "Weekly US inventory release", "Crude in rupee terms, not dollars"],
  },
  naturalgas: {
    stance: "Implied volatility near the top of its range, and deservedly so",
    body: [
      "Natural gas carries the highest implied volatility of any liquid Indian contract. The weekly US storage report is the dominant scheduled risk and it lands during the MCX evening session, which means the position is open when the number prints.",
      "High implied volatility is not an edge in either direction. It is a correct price for a genuinely uncertain outcome, and selling it because it looks expensive is how retail traders discover gamma.",
    ],
    watch: ["Weekly US storage release", "Weather-driven demand revisions", "Contract rollover liquidity"],
  },
  gold: {
    stance: "Two exposures in one contract: the metal and the rupee",
    body: [
      "MCX gold is rupee-denominated, so the contract carries the dollar gold price and the currency simultaneously. A flat dollar price with a weakening rupee still produces a rising contract, which is precisely how the recent record in rupee terms came about.",
      "Import duty is the third variable and the fastest-acting. A 2024 duty cut dropped the domestic price about 6% month-on-month while dollar gold rose — a move no amount of chart reading would have anticipated.",
    ],
    watch: ["Import duty announcements", "Real US yields", "Festive and wedding demand calendar"],
  },
  finnifty: {
    stance: "Almost the same position as Bank Nifty, priced separately",
    body: [
      "Fin Nifty's constituent overlap with Bank Nifty is heavy enough that correlation sits near 0.96. Holding both is not diversification; it is concentration that looks diversified on a position sheet.",
      "The separate expiry cycle is the one genuine difference, and it matters mainly for expiry-day flow rather than for exposure.",
    ],
    watch: ["Overlap-adjusted net exposure if you hold both", "Expiry-day flow concentration"],
  },
};
