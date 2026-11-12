# Newze — web prototype

A working prototype of the Newze product described in the planning repository one level up.

> ⚠️ **Every figure on this site is sample data.** Prices, events, flows, the option chain and
> the accuracy record are synthetic, generated deterministically in `lib/data.ts` so the site
> renders identically on every request. Replacing that module with licensed feeds is the
> Phase 1 work item, and is gated on the market-data licensing question in
> `../01-requirements/compliance.md`.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build — 71 static pages
npm start          # serve the production build on :3000
```
Node 20+. No database, no API keys, no external services.

## Routes

| Area | Routes |
|---|---|
| **Front** | `/` · `/wire` · `/search` |
| **Overnight Bridge** | `/bridge` |
| **India** | `/india` · `/india/derivatives` · `/india/flows` · `/india/macro` · `/india/valuation` |
| **Global** | `/markets` · `/markets/risk` · `/markets/regime` · `/global/central-banks` · `/calendar` |
| **Global factors** | `/global-factors` + 8 studies: crude · gold · dollar · US rates · China · crypto · global equities · geopolitics |
| **Outlook** | `/outlook` + 3 possibility trees — branching paths with conditional probabilities |
| **Scenarios** | `/scenarios` + 10 conditional outlooks — "if this, then what followed" |
| **India depth** | `/india/index-flows` (MSCI) · `/india/microstructure` · `/india/ipo` · `/economy` · `/heatmap` |
| **Options** | `/options` + 7 chains: Nifty · Bank Nifty · Fin Nifty · Sensex · crude · natural gas · gold |
| **Explained** | `/explain` + 18 statistics, each with its drivers and the common misreading |
| **Tools** | `/screener` · `/pro` · `/alerts` · `/watchlist` · `/india/correlation` |
| **More markets** | `/sectors` · `/commodities` (MCX) · `/regulations` |
| **Market study** | `/transmission` · `/signals` · `/patterns` · `/statistics` · `/learn` · `/learn/[slug]` (6 lessons) |
| **Forecasts** | `/forecasts` · `/forecasts/scoreboard` |
| **Intelligence** | `/track-record` · `/analogs` · `/narratives` |
| **Detail** | `/story/[slug]` (13) · `/ticker/[symbol]` (36) |
| **Editorial** | `/methodology` · `/about` · `/editorial-policy` · `/disclaimer` · `/pricing` |

**206 routes total**, verified by crawling every internal link. 189 pre-rendered.

## Structure

```
app/            App Router pages — one folder per route
components/     Masthead, TickerStrip, StoryTile, Thumb, ImpactCard,
                Waterfall, Bits (Spark, Delta, Conf, Stat, Tier, …)
lib/data.ts     The entire sample dataset. One file, one seam.
lib/research.ts Transmission channels, signal evidence ratings, forecaster
                records, valuation, regimes, lessons.
lib/factors.ts  Eight global factors, candlestick patterns (drawable geometry +
                evidence verdicts), calendar-anomaly statistics.
lib/india.ts    MSCI/index-flow mechanics, exchange microstructure rules (F&O ban,
                ASM, GSM, concentration margin), IPO book, economy dashboard,
                heatmap, screens.
lib/scenarios.ts Ten conditional scenarios + the global risk-mood composite.
lib/explain.ts  18 statistics: plain-language definition, formula, the factors
                that move each one with indicative weights, and the common
                misreading. Powers the <Explain> click-through on every figure.
lib/outlook.ts  Branching possibility trees, the analysis-engine description and
                the evidence review on price levels.
lib/options.ts  Seven option chains, risk-neutral probability maths (N(d2),
                expected move, straddle-implied sigma), index correlation/beta,
                and the editorial "Newze view" per chain.
                Mechanisms and cited findings in both are REAL; live figures are not.
lib/format.ts   Indian number formatting (lakh/crore), percentages, relative time
app/globals.css Design tokens and every rule. No CSS framework.
```

## Decisions worth knowing

**No stock photography.** A general news site puts a photograph in the card slot; on a markets
site that is filler, and fabricated news photography would be dishonest. Each card's visual
(`components/Thumb.tsx`) is drawn from that story's own numbers — a cone for a rate decision,
a distribution for an event with analogs, signed bars for flows — so the image carries
information before the headline is read.

**The publication gate is in the component.** `ImpactCard` renders "not enough history to call
this (n=7)" rather than a number whenever the estimate is suppressed. The honest empty state
is designed, not defaulted, because at scale it appears often and it is the trust feature.

**Every statistic is clickable to what moves it.** `<Explain metric="pcr">` wraps any figure
and links it to `/explain/pcr`, which answers four questions in order: what it is in plain
language, how it is calculated, which factors move it and by roughly how much, and the common
misreading. That last section is the valuable one — PCR read as a contrarian signal, delivery
percentage read as conviction, max pain read as a target, gap-fill rates quoted
unconditionally.

**Branch probabilities carry their basis and their joint value.** `/outlook` renders trees
three levels deep. Every node states whether its probability came from the option chain
(`implied`) or from historical conditional frequency (`base-rate`), carries its sample size,
and shows the *joint* probability down the path — so a 42% branch beneath a 34% branch reads
as the 14% outcome it actually is. The page also states what the evidence on price levels
shows: order clustering at round numbers is a documented mechanism, one study finds temporary
reversal at intraday levels that weakens with age, broad testing finds no profitability trend
across technical rules, and no rigorous test of breakout-and-retest rules after costs was
located.

**The "may go up / may go down" figure is risk-neutral, and says so.** `/options/[slug]`
derives P(finish above) from the chain using N(d₂), the expected move as spot × IV × √(t), and
the straddle-implied sigma as straddle ÷ 0.8. Every surface rendering those numbers states that
option prices embed a risk premium, so the implied density is tilted relative to realised
history — and that the probabilities are terminal, saying nothing reliable about whether a
level is touched before expiry. Showing the number without that caveat is the standard failure
of tools in this category.

**Four themes, not two.** Light, Dark, Paper (warm low-glare for long reading) and Terminal
(high-contrast dark), plus System. Each redefines tokens only — no component rule changes.

**Bilingual without a client-side i18n layer.** `components/T.tsx` renders both English and
Hindi into the HTML and hides one with CSS keyed off `data-lang` on `<html>`. That keeps every
page a server component — no translation state, no re-render, no hydration flash — and makes
switching instant. Prose is deliberately *not* translated this way: per the content rules we
translate the structured payload (headlines, deks, interface chrome), never the generated
analysis, because a machine-translated analysis would lose the citation and advice-language
guarantees the English passes through.

**Scenarios are stated as history, not forecast.** `/scenarios` answers "if this, then what"
with the historical distribution and the sample size, and explicitly tests the *common belief*
against the record. Four of ten come out backwards — global crash does not spare India,
Chinese stimulus often pulls money out of India, MSCI inclusions move on announcement not on
the effective date, and FII selling is near-random as a signal. Those rows are the point.

**Motion is progressive.** `MotionRoot` adds `js-anim` to `<html>` only once JS confirms it is
running, and only when the reader has not asked for reduced motion. Without it every `.reveal`
element is simply visible — the page is complete at rest, so a failed script or a slow
connection yields the whole page rather than a blank one. `CountUp` renders its final value in
the server HTML for the same reason.

**White page, deep-navy ink, one accent.** Navy rather than pure black: it holds large display
type without harshness and lets the amber Pro marker sit on it cleanly. Full-bleed `.band`
sections and solid `.ink` blocks carry the figures that matter, so the eye lands on them first.
Type is Sora (display), Public Sans (interface), JetBrains Mono (every figure).

**Candlesticks are drawn, not imported.** `components/Candles.tsx` renders patterns from real
`[open, high, low, close]` geometry on a 0–100 scale — eight shapes, no charting library, and
the colour semantics stay consistent with every other direction cue on the site.

**The paywall shows the real thing, blurred.** `ProGate` renders actual content behind a gate
rather than a fabricated teaser, names exactly what unlocks, and links to the track record
before the price. All research stays free — Pro is the live data and the scanners, not the
knowledge.

**Real research, synthetic data — kept apart.** `lib/research.ts` holds cited findings:
one-way Granger causality from the S&P 500 to the Nifty, the overnight-volatility import
result, ~14.3% of Indian variance from US shocks, the 0.39 vs 0.54 correlation estimates,
RBI's ~49bp CPI per $10/bbl, FII ownership falling 27%→18%. Those are sourced and attributed
on the page. Every *live figure* rendered anywhere on the site is sample data. The separation
is deliberate — the education should be correct even while the demo numbers are invented.

**The signals page says what doesn't work.** A site selling analytics has an obvious incentive
to imply its indicators work. `/signals` rates ten of them against the published literature and
reports that most — put-call ratio, breadth, flow data — have weak or no demonstrated
index-level predictive power.

**Colour is never the only encoding.** Direction is always colour + glyph + sign, for
accessibility and because roughly 8% of a male-skewed audience has red/green deficiency.

**No charting library.** Every visual — sparklines, probability cones, attribution waterfalls,
the calibration curve, the option-chain OI profile — is hand-drawn SVG or CSS. These shapes
are the product's differentiation; outsourcing them to a generic library would flatten them.

**Latency is a visible attribute.** Every price-bearing figure carries its latency class
(`realtime` / `delayed_15m` / `eod`) and the UI shows it. This is both an honesty measure and
the architectural hook for the data-licensing upgrade (ADR-004).

## Not built yet

Accounts, payments, alerts and the alert-rule engine, the public API, real-time transport
(SSE), personalisation, Hindi. See `../01-requirements/scope.md`.
