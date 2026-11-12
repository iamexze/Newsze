# ADR-007 — lightweight-charts + visx, not a charting vendor

**Status:** Accepted · **Date:** 2026-11-12

## Context
We need financial price charts with event markers, plus many bespoke visualisations that do
not exist off the shelf: probability cones, attribution waterfalls, analog fan charts,
calibration curves, OI-by-strike profiles, IV surfaces.

## Options
1. **TradingView Charting Library** — the industry standard look and feel; licensing terms and
   cost; heavy; limited control over bespoke marks.
2. **Highcharts / amCharts** — broad, commercial licence, generic financial styling.
3. **lightweight-charts** (TradingView's open-source library) — small, fast, purpose-built for
   price/time series; limited beyond that.
4. **visx / D3** — complete control, more work per chart.
5. **Recharts / Chart.js** — quick, but fights back on dense financial visualisations.

## Decision
**lightweight-charts** for price/time series with event markers; **visx** for every bespoke
visualisation. No commercial charting vendor.

## Consequences
**Positive:** tiny bundle on the most-viewed surfaces; full control over the visualisations
that *are* our differentiation (the cone, the waterfall, the fan chart are product, not
decoration); no licence cost or vendor constraint.
**Negative:** more implementation work per bespoke chart; we own accessibility and
responsiveness ourselves (every chart needs a `<table>` fallback per NFR-A11Y-01).
**Note:** if users later demand full technical-analysis drawing tools, revisit the TradingView
Charting Library for *that surface only* — it is not a reason to adopt a vendor system-wide.
