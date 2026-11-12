# Design System

**Status:** Draft v1 · **Date:** 2026-11-12
**Rule:** this is a **data-dense professional tool that must not look like a terminal to a
beginner, and must not look like a consumer app to a professional.** Every decision below
resolves that tension.

---

## 1. Design principles

1. **Density earns its place.** Dense when information is being compared; airy when a
   decision is being made. The Bridge is airy. The OI table is dense.
2. **Numbers are the interface.** Tabular figures, consistent decimals, aligned decimal
   points, units always present. A number that shifts position between refreshes is a bug.
3. **Uncertainty is drawn, not stated.** Bands, cones, and sample sizes are visual primitives
   with their own components — never a footnote.
4. **Colour is never the only encoding.** Direction = colour **+** arrow glyph **+** sign.
   Required for accessibility (NFR-A11Y-01) and for the ~8% of our male-skewed audience with
   red/green deficiency.
5. **Dark mode is a first-class citizen**, not an inversion. Traders use dark at 07:30 and at
   23:00. Both themes are designed, both are tested, neither is an afterthought.
6. **Motion only to show change.** A value that updated may flash once. Nothing else animates.
   No skeleton shimmer longer than 400ms — show stale data with a staleness marker instead.

---

## 2. Colour

### 2.1 Semantic tokens (never use a raw hex in a component)

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#FFFFFF` | `#0B0E14` | page |
| `--bg-raised` | `#F7F8FA` | `#141821` | cards, rails |
| `--bg-sunken` | `#EEF0F4` | `#070A0F` | table headers, wells |
| `--border` | `#E2E5EA` | `#232936` | hairlines |
| `--text` | `#0D1117` | `#E6EAF2` | primary |
| `--text-muted` | `#5A6472` | `#8B95A7` | labels, meta |
| `--text-faint` | `#8C95A3` | `#5D6678` | timestamps, units |
| `--accent` | `#2563EB` | `#4D8DFF` | links, focus, primary action |
| **`--up`** | `#0E8A4F` | `#2FBF71` | positive move |
| **`--down`** | `#C62B2B` | `#FF5C5C` | negative move |
| `--flat` | `#6B7280` | `#8B95A7` | unchanged |
| `--warn` | `#B45309` | `#F0A830` | low confidence, thin data, staleness |
| `--rumour` | `#7C3AED` | `#A982FF` | unverified / T4 |
| `--suppressed` | `#6B7280` | `#8B95A7` | withdrawn/suppressed state |

### 2.2 Direction encoding — mandatory triple
```
▲ +1.11%   (colour --up   + glyph ▲ + explicit sign)
▼ −0.62%   (colour --down + glyph ▼ + explicit sign)
▬  0.00%   (colour --flat + glyph ▬)
```
**Never** a bare coloured number. **Never** a red/green background fill as the sole signal.

> **Global note:** up=green / down=red is correct for India, US and Europe. In Japan, China,
> Korea and Taiwan the convention is **inverted** (red = up). A user-settable
> `directionPalette: western | east-asian` preference ships before any East Asia launch.
> Hard-coding this is a localisation bug waiting 18 months to be discovered.

### 2.3 Source-tier palette
`T0` exchange/primary — solid accent ⬤ · `T1` wire — solid neutral-dark ⬤ · `T2` major
outlet — hollow ◯ · `T3` aggregator — hollow faint ◌ · `T4` social/unverified — `--rumour`
with a persistent "Unverified" text label.

### 2.4 Confidence encoding
Confidence is **opacity + an explicit numeral + a bar**, never colour alone (colour is
reserved for direction).

---

## 3. Typography

| Role | Face | Size / weight | Notes |
|---|---|---|---|
| Display (expected open) | Inter Tight / Söhne | 40–56px, 600 | tabular-nums |
| H1 / page title | Inter | 28px, 600 | |
| H2 / section | Inter | 20px, 600 | |
| Headline (story) | Inter | 17px, 600, 1.3 | max 2 lines, then ellipsis |
| Body | Inter | 15px, 400, 1.55 | |
| Meta / label | Inter | 12px, 500, +0.02em, uppercase | `--text-muted` |
| **Data / numeric** | **JetBrains Mono or IBM Plex Mono** | 13–15px, 450 | `font-variant-numeric: tabular-nums` — **mandatory everywhere a number can change** |
| Micro (timestamps, units) | Inter | 11px, 400 | `--text-faint` |

**Number formatting rules**
- Prices: exchange tick precision (₹1,742.30 not ₹1742.3)
- Percent: 2dp under 10%, 1dp above (`+1.11%`, `+14.2%`)
- Large numbers: **user preference** — `lakh/crore` (India default) or `K/M/B` (global default)
- Currency symbol always present; never infer from context
- Timestamps: relative under 1h (`4m ago`), then absolute with timezone (`18:30 UTC · 00:00 IST`)

---

## 4. Spacing, radius, elevation
4px base scale: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64`. Radius: `4` controls, `8` cards,
`12` modals, `999` pills. Elevation: hairline borders primarily; shadow only for true
overlays (modals, dropdowns, bottom sheets). **No decorative shadows on data surfaces** —
they cost contrast.

---

## 5. Core components (the ones that carry the product)

| Component | Notes |
|---|---|
| **`<ImpactCard>`** | The atomic unit. Variants: `compact` (wire), `expanded` (story), `micro` (watchlist row), `share` (OG image). All render from one `Impact` payload. |
| **`<ConeChart>`** | Point estimate + 68%/95% bands. Used in Bridge and anywhere a distribution is shown. Must render legibly at 320px wide. |
| **`<Waterfall>`** | Signed contribution bars, sorted by |value|, summing to a net. Max 8 components (research RQ4). |
| **`<AnalogStrip>`** | Fan chart + dated analog list + the regime-concentration warning. |
| **`<SourceRow>`** | Tier dot + outlet + timestamp + link-out. The provenance primitive; appears everywhere. |
| **`<DataValue>`** | Wraps every number: value + unit + direction encoding + source tooltip + staleness marker. **If a number isn't in a `<DataValue>`, it's a bug.** |
| **`<ConfidenceBar>`** | Numeral + bar + n. |
| **`<NotEnoughHistory>`** | The honest empty state. Designed as carefully as the success state — it appears often and it is the trust feature. |
| **`<StalenessBadge>`** | `realtime` / `15m delayed` / `EOD` / `stale ⚠`. Legally required (G1) and operationally honest. |
| **`<TierBadge>`**, **`<DisclaimerBlock>`**, **`<OIBuildupTag>`**, **`<TimelineThread>`** | |

---

## 6. Charts
See `dataviz` conventions. House rules on top:
- Library: **lightweight-charts** for price/time series; **visx/ECharts** for everything else. *(ADR-007)*
- Every chart shows its data's as-of time and latency class.
- Event markers on price charts are clickable to the Event.
- No 3D, no gradients-as-data, no dual y-axes without an explicit, labelled reason.
- Every chart has a `<table>` fallback for screen readers (NFR-A11Y-01).
- Uncertainty is **always** drawn where it exists. A point estimate rendered without its band is a design defect.

---

## 7. Accessibility checklist (enforced in CI)
- Contrast ≥ 4.5:1 body, ≥ 3:1 large text and UI glyphs — in **both** themes
- Full keyboard operation; visible focus ring on `--accent`; `/` focuses search; `Esc` closes layers
- All data visualisations have text/table equivalents
- `prefers-reduced-motion` respected (kills the update flash)
- Live regions announce new wire items politely, never assertively
- Minimum 44×44px touch targets
- Never colour-only encoding (§2.2)

---

## 8. Voice in the interface
Confident about data, humble about prediction. Never hype.

| ✅ Write | ❌ Never write |
|---|---|
| "Similar events: 62% moved down (n=34)" | "Bearish signal!" |
| "Not enough history to call this" | *(silently omitting the estimate)* |
| "Expected −0.4%, range −1.3% to +0.5%" | "Expected to fall 0.4%" *(false precision)* |
| "We were 28 points off — within our 68% range" | "We nailed it" |
| "23 sources reporting" | "BREAKING!!!" |
