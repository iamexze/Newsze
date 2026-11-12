/* ───────────────────────────────────────────────────────────────────────────
   OUTLOOK — branching possibility trees.

   "If it goes up it may break down; if it breaks down it may go up." This is
   that, made explicit: a tree of conditional paths, each branch carrying a
   probability and the basis for it.

   TWO SOURCES OF PROBABILITY, always labelled:
     • implied   — from the option chain. Real maths (N(d2)), risk-neutral.
     • base rate — from historical conditional frequency in our corpus.
   Where they disagree we show both. Where the sample is thin we say so.

   EVIDENCE CAVEAT, stated on the page: broad testing finds technical rules
   have no obvious profitability trend, with support/resistance contributing
   only ~7.3% of rules surviving a false-discovery correction. Order clustering
   at round numbers is a real documented mechanism for why levels form, and one
   study finds statistically significant TEMPORARY reversal at algorithmic
   intraday levels that weakens as levels age. None of that establishes that
   breakout-and-retest rules are profitable after costs.
   ─────────────────────────────────────────────────────────────────────────── */

import type { Source } from "./research";

export type Node = {
  id: string;
  label: string;
  detail?: string;
  prob: number;                       // probability of this branch given its parent
  basis: "implied" | "base-rate" | "both";
  n?: number;                         // sample size where base-rate is used
  level?: number;                     // price level this branch hinges on
  tone: "up" | "down" | "flat";
  children?: Node[];
};

export type Tree = {
  slug: string; instrument: string; name: string;
  spot: number; horizon: string; asOf: string;
  levels: { k: string; v: number; why: string }[];
  root: Node[];
  modal: string;                      // the single most likely path
  note: string;
};

export const TREES: Tree[] = [
  {
    slug: "nifty", instrument: "IDX:NIFTY50", name: "Nifty 50",
    spot: 24338, horizon: "to 27 Nov expiry", asOf: "12 Nov 2026 · 10:04 IST",
    levels: [
      { k: "High OI call", v: 24500, why: "Largest call open interest — where writers are positioned against a rise" },
      { k: "Max pain", v: 24400, why: "Strike at which the largest total option value expires worthless" },
      { k: "Spot", v: 24338, why: "" },
      { k: "High OI put", v: 24200, why: "Largest put open interest — where writers are positioned against a fall" },
      { k: "Prior VWAP", v: 24455, why: "Previous session volume-weighted average" },
    ],
    modal: "Range-bound between 24,200 and 24,500 into expiry — 46% implied, and the single most likely outcome by some distance.",
    note: "Implied probabilities come from the option chain and are risk-neutral. Base rates come from historical conditional frequency. Neither is a forecast.",
    root: [
      {
        id: "up", label: "Trades above 24,500", level: 24500, prob: 0.34, basis: "implied", tone: "up",
        detail: "The high open-interest call strike. Option writers are positioned against this level, which is one documented reason levels form — not a guarantee they hold.",
        children: [
          { id: "up-fail", label: "Fails back below 24,500 — the false breakout", prob: 0.58, basis: "base-rate", n: 142, tone: "down",
            detail: "The modal outcome after a push through a high-OI strike in our sample. Published work on levels finds temporary reversal behaviour that weakens as the level ages.",
            children: [
              { id: "up-fail-revert", label: "Reverts toward 24,300", level: 24300, prob: 0.61, basis: "base-rate", n: 142, tone: "down" },
              { id: "up-fail-hold", label: "Holds 24,400 and re-attempts", level: 24400, prob: 0.39, basis: "base-rate", n: 142, tone: "flat" },
            ] },
          { id: "up-extend", label: "Extends toward 24,700", level: 24700, prob: 0.42, basis: "both", n: 142, tone: "up",
            detail: "Sustained acceptance above the strike. Writers hedging short calls can accelerate this, which is the mechanism behind the move rather than the pattern.",
            children: [
              { id: "up-ext-24900", label: "Reaches 24,900", level: 24900, prob: 0.31, basis: "implied", tone: "up" },
              { id: "up-ext-stall", label: "Stalls between 24,700 and 24,900", prob: 0.69, basis: "base-rate", n: 96, tone: "flat" },
            ] },
        ],
      },
      {
        id: "range", label: "Holds between 24,200 and 24,500", prob: 0.46, basis: "implied", tone: "flat",
        detail: "The single most likely outcome. Implied volatility in the bottom third of its own year is consistent with a market pricing a narrow range, and max pain sits inside this band.",
        children: [
          { id: "range-drift", label: "Drifts toward max pain at 24,400", level: 24400, prob: 0.54, basis: "base-rate", n: 208, tone: "flat",
            detail: "Drift toward max pain into expiry is widely asserted and weakly evidenced. We show it with its sample size rather than as a rule." },
          { id: "range-chop", label: "Chops without direction into expiry", prob: 0.46, basis: "base-rate", n: 208, tone: "flat" },
        ],
      },
      {
        id: "down", label: "Breaks below 24,200", level: 24200, prob: 0.31, basis: "implied", tone: "down",
        detail: "The high open-interest put strike. A break here removes the level where put writers were positioned.",
        children: [
          { id: "down-reclaim", label: "Reclaims 24,200 — the failed breakdown", prob: 0.56, basis: "base-rate", n: 134, tone: "up",
            detail: "This is the mirror of the false breakout above, and it is the branch most traders are least prepared for: a break lower that reverses.",
            children: [
              { id: "down-reclaim-up", label: "Recovers toward 24,400", level: 24400, prob: 0.58, basis: "base-rate", n: 134, tone: "up" },
              { id: "down-reclaim-stall", label: "Stalls at 24,300", level: 24300, prob: 0.42, basis: "base-rate", n: 134, tone: "flat" },
            ] },
          { id: "down-extend", label: "Extends toward 24,000", level: 24000, prob: 0.44, basis: "both", n: 134, tone: "down",
            children: [
              { id: "down-ext-23800", label: "Reaches 23,800", level: 23800, prob: 0.29, basis: "implied", tone: "down" },
              { id: "down-ext-base", label: "Bases between 24,000 and 24,200", prob: 0.71, basis: "base-rate", n: 88, tone: "flat" },
            ] },
        ],
      },
    ],
  },
  {
    slug: "banknifty", instrument: "IDX:NIFTYBANK", name: "Nifty Bank",
    spot: 52841, horizon: "to 27 Nov expiry", asOf: "12 Nov 2026 · 10:04 IST",
    levels: [
      { k: "High OI call", v: 53000, why: "Largest call open interest" },
      { k: "Max pain", v: 52800, why: "Largest total option value expiring worthless" },
      { k: "Spot", v: 52841, why: "" },
      { k: "High OI put", v: 52600, why: "Largest put open interest" },
    ],
    modal: "Range 52,600–53,000, but with a 94th-percentile short build-up the tails are fatter than the implied distribution suggests.",
    note: "Short build-up at a 250-day extreme makes the upside branch asymmetric: a squeeze has a mechanism behind it that the option-implied distribution does not price separately.",
    root: [
      {
        id: "squeeze", label: "Trades above 53,000 — short covering", level: 53000, prob: 0.33, basis: "both", n: 23, tone: "up",
        detail: "Open interest rose 12.1% while price fell 0.4% — a short build-up in the 94th percentile of this index's own history. If price moves against that positioning, covering supplies the buying.",
        children: [
          { id: "sq-extend", label: "Squeeze extends to 53,400", level: 53400, prob: 0.47, basis: "base-rate", n: 23, tone: "up",
            detail: "Thin sample. Eight of the 23 comparable cases fall in one six-month window, so the effective n is far smaller than 23." },
          { id: "sq-fade", label: "Covering exhausts, fades back below 53,000", prob: 0.53, basis: "base-rate", n: 23, tone: "down" },
        ],
      },
      { id: "bn-range", label: "Holds 52,600–53,000", prob: 0.42, basis: "implied", tone: "flat",
        detail: "Max pain sits inside the band at 52,800.",
        children: [
          { id: "bn-drift", label: "Drifts to max pain 52,800", level: 52800, prob: 0.57, basis: "base-rate", n: 186, tone: "flat" },
          { id: "bn-chop", label: "Chops into expiry", prob: 0.43, basis: "base-rate", n: 186, tone: "flat" },
        ] },
      {
        id: "bn-break", label: "Breaks below 52,600 — shorts add", level: 52600, prob: 0.25, basis: "implied", tone: "down",
        children: [
          { id: "bn-bk-extend", label: "Extends toward 52,200", level: 52200, prob: 0.51, basis: "base-rate", n: 118, tone: "down" },
          { id: "bn-bk-reclaim", label: "Reclaims 52,600", prob: 0.49, basis: "base-rate", n: 118, tone: "up" },
        ],
      },
    ],
  },
  {
    slug: "crudeoil", instrument: "CMD:BRENT", name: "Crude Oil (MCX)",
    spot: 6453, horizon: "to 19 Nov expiry", asOf: "12 Nov 2026 · 10:04 IST",
    levels: [
      { k: "High OI call", v: 6600, why: "Largest call open interest" },
      { k: "Spot", v: 6453, why: "" },
      { k: "High OI put", v: 6300, why: "Largest put open interest" },
    ],
    modal: "Wide. Implied volatility at the 61st percentile and an OPEC+ decision inside the expiry mean the distribution is genuinely fat-tailed.",
    note: "This contract trades through the US session. The branch probabilities below do not price the gap risk of a headline landing while an Indian equity trader is asleep — because for this instrument there is no gap, only a live market.",
    root: [
      { id: "cr-up", label: "Trades above 6,600 on supply news", level: 6600, prob: 0.36, basis: "implied", tone: "up",
        children: [
          { id: "cr-up-ext", label: "Extends to 6,800", level: 6800, prob: 0.44, basis: "both", n: 62, tone: "up" },
          { id: "cr-up-fade", label: "Fades as the headline is discounted", prob: 0.56, basis: "base-rate", n: 62, tone: "down",
            detail: "Most geopolitical and supply headlines do not persist past 48 hours. Our GEOPOLITICAL event class is currently suppressed on the ledger for poor calibration." } ,
        ] },
      { id: "cr-range", label: "Holds 6,300–6,600", prob: 0.38, basis: "implied", tone: "flat" },
      { id: "cr-down", label: "Breaks below 6,300", level: 6300, prob: 0.26, basis: "implied", tone: "down",
        children: [
          { id: "cr-dn-ext", label: "Extends to 6,100 — positive for India", level: 6100, prob: 0.48, basis: "both", n: 54, tone: "down",
            detail: "Falling crude is the one widely-held Indian market intuition the data supports — see the crude scenario." },
          { id: "cr-dn-reclaim", label: "Reclaims 6,300", prob: 0.52, basis: "base-rate", n: 54, tone: "up" },
        ] },
    ],
  },
];

export const treeBySlug = (s: string) => TREES.find((t) => t.slug === s);

export const BASIS_LABEL = {
  implied: { t: "option-implied", tone: "supported" },
  "base-rate": { t: "historical base rate", tone: "mixed" },
  both: { t: "implied + base rate", tone: "supported" },
} as const;

/* ── how the engine works, and what it is not ────────────────────────────── */

export const ENGINE = {
  does: [
    { h: "Language models classify and summarise", p: "Every story on this site is typed against a fixed taxonomy, entity-linked and summarised by a model under human review. That is what the model does." },
    { h: "Deterministic code produces every number", p: "Probabilities come from the option chain — N(d₂), expected move, implied density — and from historical conditional frequency in our own corpus. No number on this page was generated by a language model. That boundary is architectural, not a policy: the scoring service has no model client." },
    { h: "Branches are conditional, not sequential predictions", p: "Each probability is conditional on its parent branch occurring. Multiplying down a path gives the joint probability, which is usually far smaller than the branch figures suggest at a glance." },
  ],
  doesNot: [
    { h: "It does not know what will happen", p: "A 46% modal outcome means the single most likely path is slightly less likely than not. That is the honest shape of a market forecast, and anything presented as more certain is being presented dishonestly." },
    { h: "It does not price the unprecedented", p: "Both inputs are backward-looking. An event with no historical analog gets a high novelty score and no estimate at all." },
    { h: "It does not claim levels are tradeable", p: "See the evidence note below. Levels exist and have a documented mechanism; that is a different claim from being profitable to trade after costs." },
  ],
  evidence: {
    summary: "Order clustering at round numbers is a documented reason levels form. One study finds statistically significant temporary reversal at algorithmically defined intraday levels, with the effect weakening as levels age. Broad testing across technical rules finds no obvious trend in profitability, with support and resistance contributing roughly 7.3% of the rules that survive a false-discovery-rate correction. We found no rigorous peer-reviewed test showing breakout-and-retest rules are profitable after costs.",
    sources: [
      { label: "No obvious trend in TA profitability; S/R ≈7.3% of rules surviving FDR correction", who: "Technical Analysis and Discrete False Discovery Rate (arXiv)" },
      { label: "Stop-loss and take-profit orders cluster at round numbers", who: "Osler, Federal Reserve Bank of New York staff report" },
      { label: "Statistically significant temporary reversal at intraday levels, weakening with level age", who: "Chung & Bellotti, 2021 (via secondary source)" },
      { label: "No rigorous peer-reviewed test of retest-based breakout rules located", who: "Literature search, Nov 2026" },
    ] as Source[],
  },
};
