# Wireframes (low-fidelity)

**Status:** Draft v1 · **Date:** 2026-11-12
Lo-fi on purpose — these fix **information hierarchy**, not visual design. Visual language
lives in [`../design-system.md`](../design-system.md).

---

## W1 — `/today` in Bridge mode · MOBILE (the 07:30 screen) ⭐

```
┌─────────────────────────────────────┐
│ NEWZE        Thu 12 Nov · 07:30 IST │
│ ───────────────────────────────────│
│  EXPECTED OPEN                      │
│                                     │
│  NIFTY 50                           │
│  24,310  ▼ −152  (−0.62%)          │ ← largest type on the screen
│  ├────────┬──●───┬────────┤         │ ← probability cone, not a point
│  24,180  24,250 24,370  24,440     │
│  68% range          95% range       │
│                                     │
│  BANK NIFTY  52,840  ▼ −0.41%  ▸   │
│                                     │
│  conf 0.64 · model v1.4.2 · 30d MAE│
│  41 pts · [how this is built ▸]     │
├─────────────────────────────────────┤
│  WHY                        ▼ open  │
│                                     │
│  US close          ████████▌ −38    │ ← waterfall, signed, sorted by
│  Brent +2.1%       ███▌      −12    │   absolute contribution
│  USDINR −0.3%      ██▏       +09    │
│  ADR drag          █▌        −06    │
│  Asia mixed        █         −04    │
│  Fed event         ███▌      −18    │ ← tappable → Impact Card
│  residual          ▏         +02    │
│  ───────────────────────────────    │
│  NET                         −67 bp │
├─────────────────────────────────────┤
│  WHAT MATTERS TODAY            3    │
│  ┌─────────────────────────────┐   │
│  │ ⬤T1  FED CUTS 25BP, SIGNALS │   │
│  │      SLOWER PATH            │   │
│  │ ───────────────────────────│   │
│  │ NIFTY BANK  1d              │   │
│  │ −0.4%  [−1.3% ·· +0.5%]    │   │
│  │ 34 analogs · 62% down       │   │
│  │ conf 0.61                   │   │
│  │ [analogs]  [story · 23 src] │   │
│  └─────────────────────────────┘   │
│  ┌ ⬤T0 RBI RISK-WEIGHT CIRCULAR ┐  │
│  ┌ ⬤T1 BRENT +2.1% ON OPEC NEWS ┐  │
├─────────────────────────────────────┤
│  YOUR WATCHLIST (3 with events)  ▸ │
│  HDFCBANK  ▲ +1.4% exp · 19 analogs│
│  INFY      ▼ ADR −1.8% overnight   │
│  TATAMOTORS  ⬤ results today       │
├─────────────────────────────────────┤
│  KEY LEVELS (from yday OI)      ▸  │
│  Max pain 24,400 · High OI PE 24,200│
│  High OI CE 24,500 · PCR 0.84      │
├─────────────────────────────────────┤
│  YESTERDAY WE SAID                 │
│  Est. open 24,462 · Actual 24,438  │
│  Miss 24 pts ✓ within 68% cone     │ ← never hidden, never spun
│  30-day record ▸                    │
├─────────────────────────────────────┤
│ ⚠ Information & statistical analysis│
│   only. Not investment advice. ▸    │
└─────────────────────────────────────┘
```
**Fold line is below the waterfall.** ① + ② must fit a 6.1" screen with no scroll.

---

## W2 — Impact Card, expanded (the atomic unit)

```
┌───────────────────────────────────────────────────────────────┐
│ ⬤T1 REUTERS +22 others          18:30 UTC · 00:00 IST · 4m ago│
│ FED CUTS 25BP, POWELL SIGNALS SLOWER PATH AHEAD               │
│ ─────────────────────────────────────────────────────────────│
│ EVENT  RATE_DECISION · CUT      SURPRISE  ◐ guidance hawkish  │
│ −25bp vs −25bp consensus        z = +1.2 on the path, not     │
│ NOVELTY 0.31                    the level ← what actually moved│
│ ─────────────────────────────────────────────────────────────│
│ EXPECTED IMPACT                     [15m][1h][1d*][5d][20d]   │
│                                                               │
│  INSTRUMENT      EXPECTED    68% BAND      P(up)   n    conf  │
│  NIFTY BANK      −0.41%   [−1.3, +0.5]     39%    34   0.61   │
│  NIFTY 50        −0.28%   [−0.9, +0.4]     42%    34   0.58   │
│  USDINR          +0.22%   [−0.1, +0.6]     64%    41   0.66   │
│  XAU/USD         +0.70%   [−0.2, +1.6]     68%    52   0.71   │
│  NIFTY IT        +0.35%   [−0.6, +1.3]     57%    28   0.49 ⚠ │
│  SPX             — not enough history to call this (n=7) —    │ ← the honest state
│ ─────────────────────────────────────────────────────────────│
│ ▾ THE 34 ANALOGS                                              │
│   ┌─ forward return fan, 1d ─────────────────────────┐        │
│   │        ▁▂▃▅▇█▇▅▃▂▁   median −0.35%               │        │
│   │   −3%      −0.35%      +2%                        │        │
│   └───────────────────────────────────────────────────┘       │
│   21 Sep 2026 · hawkish cut · BANKNIFTY −0.8%  →              │
│   18 Dec 2024 · hawkish cut · BANKNIFTY −1.4%  →              │
│   01 Nov 2023 · hawkish hold· BANKNIFTY +0.2%  →              │
│   [ see all 34 ]                                              │
│   ⚠ 9 of 34 analogs fall in Sep–Dec 2024. Treat as correlated.│
│ ─────────────────────────────────────────────────────────────│
│ ▾ WHY WE THINK THIS   ▾ METHOD v1.4.2   ▾ 23 SOURCES          │
│ ─────────────────────────────────────────────────────────────│
│ [⭐ watch]  [🔔 alert me]  [↗ share]      [full story ▸]       │
│ ─────────────────────────────────────────────────────────────│
│ ⚠ Statistical description of historical analogs. Not advice,  │
│   not a recommendation, not a forecast of returns.            │
└───────────────────────────────────────────────────────────────┘
```
`*` default horizon = 1d. `⚠` on a confidence cell = below the comfortable threshold but
above the publication gate.

---

## W3 — `/wire` · DESKTOP

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ NEWZE  [Today][Markets][India][Global][Track Record]        🔍 /   ⭐  👤     │
├────────────┬─────────────────────────────────────────────┬───────────────────┤
│ FILTERS    │ LIVE WIRE                      ⏸ 14:22:08 IST│ MARKET STRIP      │
│            │                                              │ NIFTY  24,338 ▲   │
│ REGION     │ ⬤T0  2m  NSE                    impact ███▌ │ BNF    52,901 ▲   │
│ ☑ India    │ TATAMOTORS: Q2 PAT ₹3,842cr vs ₹3,510cr est │ INDIAVIX 13.2 ▼   │
│ ☑ Global   │ TATAMOTORS +2.1% exp 1d · n=22 · conf .58   │ USDINR 88.41 ▲    │
│ ☐ US       │ 11 sources · [impact] [story]                │ BRENT  74.2  ▲    │
│ ☐ Europe   │ ─────────────────────────────────────────── │ ───────────────   │
│            │ ⬤T1  9m  Reuters +14                 ███    │ YOUR WATCHLIST    │
│ ASSET      │ OPEC+ DELAYS OUTPUT DECISION TO DEC         │ HDFCBANK ▲ 1.1%   │
│ ☑ Equity   │ BRENT +1.4% exp · XLE +0.9% · n=31          │   ⬤ 2 events     │
│ ☑ FX       │ ─────────────────────────────────────────── │ INFY     ▼ 0.4%   │
│ ☑ Rates    │ ⬤T4  12m  @unverified_acct      ⚠ RUMOUR   │ TATAMOTORS ▲ 2.3% │
│ ☑ Commod   │ UNCONFIRMED: LARGE BLOCK IN RELIANCE        │   ⬤ results      │
│            │ No impact published — tier T4. Tracking.    │ ───────────────   │
│ EVENT TYPE │ ─────────────────────────────────────────── │ NEXT 24H          │
│ ☑ All      │ ⬤T0  18m  SEBI                        ██   │ 16:00 US CPI      │
│ ☐ Earnings │ SEBI TIGHTENS INDEX-OPTION POSITION LIMITS  │ 18:30 Fed speaker │
│ ☐ Macro    │ NIFTY −0.3% exp · brokers ▼ · n=4 ⚠ thin   │ 09:00 RBI minutes │
│ ☐ Policy   │ ─────────────────────────────────────────── │ ───────────────   │
│            │ ⬤T2  24m  ET                           █   │ LEDGER (30d)      │
│ MIN IMPACT │ GOVT MAY REVIEW IMPORT DUTY ON EDIBLE OILS  │ 1d direction 61%  │
│ ▓▓▓▓░░ 0.3%│ — not enough history to call this —         │ cone hit 71%      │
│            │                                              │ n=1,284 calls     │
│ TIER       │                      [ load older ]          │ full record ▸     │
│ ☑T0 ☑T1    │                                              │                   │
│ ☑T2 ☐T3 ☐T4│                                              │                   │
└────────────┴─────────────────────────────────────────────┴───────────────────┘
```

---

## W4 — `/india/derivatives/oi`

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ INDIA › DERIVATIVES › OPEN INTEREST        12 Nov · EOD ⓘ delayed  [⚡ Pro: RT]│
├──────────────────────────────────────────────────────────────────────────────┤
│ [ Indices ] [ Stocks ] [ By sector ]        Expiry: 27 Nov (15d) ▾           │
├──────────────────────────────────────────────────────────────────────────────┤
│ SYMBOL      PRICE%   OI%    BUILD-UP            PCR   IV%ile  SIGNAL-STRENGTH│
│ ─────────────────────────────────────────────────────────────────────────────│
│ BANKNIFTY   −0.4   +12.1   ▼ SHORT BUILD-UP    0.72    38     ████████░ 94%ile│
│ NIFTY       −0.2    +3.4   ▼ short build-up    0.84    31     ███░░░░░░ 41%ile│
│ HDFCBANK    +1.1    −8.2   ▲ SHORT COVERING    0.91    44     ██████░░░ 78%ile│
│ RELIANCE    +0.6    +9.8   ▲ LONG BUILD-UP     1.14    52     █████░░░░ 66%ile│
│ INFY        −0.9    +4.1   ▼ short build-up    0.68    61     ██░░░░░░░ 29%ile│
│ ─────────────────────────────────────────────────────────────────────────────│
│ ⓘ Build-up = f(Δprice, ΔOI). Percentile ranks today's OI change vs this       │
│   symbol's own 250-day history — not a cross-symbol comparison.               │
├────────────────────────────────────┬─────────────────────────────────────────┤
│ BANKNIFTY — OI BY STRIKE           │ RELATED EVENTS                          │
│                                    │ ⬤T0 2h  RBI risk-weight circular        │
│  52400 ███████░ CE   PE ██         │     BANKNIFTY +0.9% exp · n=11          │
│  52600 ████████ CE   PE ███        │ ⬤T1 5h  HDFC Bank block deal           │
│  52800 ██████ CE  ●  PE █████      │ ───────────────────────────────────────│
│  53000 ███ CE        PE ████████   │ ANALOGS                                 │
│  53200 ██ CE         PE ██████     │ "BANKNIFTY short build-up >90%ile with  │
│                                    │  15d to expiry" → 23 occurrences        │
│  Max pain 52,800  ● spot 52,841    │  5d forward: median +0.6%, 61% up       │
│  PCR 0.72 (30d avg 0.88)           │  ⚠ 8 of 23 in one regime window         │
│                                    │  [ open in Analog Engine ▸ ]            │
└────────────────────────────────────┴─────────────────────────────────────────┘
```

---

## W5 — `/track-record` (the Accuracy Ledger)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ TRACK RECORD        every call we have ever published · nothing removed      │
│ [event type ▾] [instrument ▾] [horizon ▾] [model ▾] [since ▾]                │
├──────────────────────────────────────────────────────────────────────────────┤
│  ALL PUBLISHED CALLS          1d horizon          since 01 Jan 2026          │
│  ┌───────────────────┬───────────────────┬───────────────────┐               │
│  │ DIRECTION ACCURACY│ CONE HIT RATE     │ CALIBRATION       │               │
│  │   61.2%           │  69.8%            │  Brier 0.207      │               │
│  │   n = 4,187       │  (target 68%)     │  error +0.03      │               │
│  └───────────────────┴───────────────────┴───────────────────┘               │
│                                                                              │
│  CALIBRATION CURVE              ┌──────────────────────────┐                 │
│  (predicted vs realised)        │            ╱ ideal       │                 │
│                                 │         ╱●              │                 │
│                                 │      ●╱●                │                 │
│                                 │   ●╱                     │                 │
│                                 └──────────────────────────┘                 │
├──────────────────────────────────────────────────────────────────────────────┤
│  BY EVENT TYPE              n      DIR%    CONE%   BRIER   TREND    STATUS   │
│  RATE_DECISION             412     67.2    73.1    0.184   ▲       published │
│  CPI                       388     64.8    71.4    0.196   ▬       published │
│  EARNINGS                 1,204    59.1    68.2    0.221   ▼       published │
│  FII_DII_FLOW              602     57.8    66.9    0.233   ▼       ⚠ watch   │
│  SEBI_ACTION                41     52.1    61.0    0.268   ▼       SUPPRESSED│
│                                    └─ auto-pulled 04 Nov 2026 · breached     │
│                                       calibration tolerance · [why ▸]        │
│  GEOPOLITICAL               88     51.0    59.2    0.271   ▬       SUPPRESSED│
├──────────────────────────────────────────────────────────────────────────────┤
│  WITHDRAWALS & CORRECTIONS (3)                                    [ all ▸ ]  │
│  08 Nov  Impact on ADANIENT withdrawn — entity mis-resolution. Reason ▸      │
│  22 Oct  CPI surprise sign error, 14 impacts recomputed. Reason ▸            │
├──────────────────────────────────────────────────────────────────────────────┤
│  MODEL HISTORY   v1.4.2 (current, 12 Oct) · v1.3.0 · v1.2.1 · v1.0 (shadow)  │
│  Past versions remain visible with their own records. [ methodology ▸ ]      │
└──────────────────────────────────────────────────────────────────────────────┘
```
> Cells with n < 10 show "—", never a percentage. There is no UI, and no database path, to
> hide an individual scored call.

---

## W6 — `/ticker/NSE:HDFCBANK` (entity page)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ HDFC BANK  NSE:HDFCBANK · BSE:500180 · NYSE:HDB · ISIN INE040A01034    [⭐]  │
│ ₹1,742.30  ▲ +19.20 (+1.11%)   EOD 12 Nov ⓘ    NIFTY50 · BANKNIFTY · FINNIFTY│
├──────────────────────────────────────────────────────────────────────────────┤
│ [Overview] [Events] [Impacts] [Derivatives] [Fundamentals] [Filings] [Peers] │
├───────────────────────────────────────────┬──────────────────────────────────┤
│  ┌─ price + event markers ──────────────┐ │ LIVE SIGNALS                     │
│  │        ╱╲    ⬤        ╱              │ │ OI build-up  ▲ short covering    │
│  │   ╱╲  ╱  ╲  ╱ ╲ ⬤   ╱               │ │ Delivery %   68.2 (20d avg 54.1) │
│  │  ╱  ╲╱    ╲╱   ╲   ╱                 │ │ FII stake    Q2 ▲ +0.4pp         │
│  │ ⬤ = event with published impact      │ │ IV %ile      44                  │
│  └──────────────────────────────────────┘ │ ADR premium  +0.8% vs local      │
│                                            │ ─────────────────────────────── │
│  OPEN IMPACTS (not yet settled)           │ OUR RECORD ON THIS NAME          │
│  RBI risk-weight circular   +0.9%  1d  ⏳ │ 1d direction 63.8% (n=212)       │
│  Block deal 0.4% equity     −0.3%  5d  ⏳ │ cone hit     70.1%               │
│                                            │ [full record ▸]                 │
│  SETTLED (last 30d)                       │ ─────────────────────────────── │
│  Q2 results beat     +1.4% exp → +1.9% ✓  │ PEERS                            │
│  MSCI weight change  −0.6% exp → +0.2% ✗  │ ICICIBANK · KOTAKBANK · AXISBANK │
│  Mgmt change         −0.2% exp → −0.1% ✓  │ SBIN · INDUSINDBK                │
└───────────────────────────────────────────┴──────────────────────────────────┘
```

---

## Responsive rules
| Breakpoint | Behaviour |
|---|---|
| < 640px | Single column. Bridge ①② above fold. Tables → cards. Filters → bottom sheet. |
| 640–1024 | Two columns. Right rail collapses into tabs. |
| 1024–1440 | Three columns as drawn. |
| > 1440 | Fourth optional pane (Pro "workspace" mode, Phase 7). |
