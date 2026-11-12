# User Stories

**Status:** Draft v1 · **Date:** 2026-11-12
Format: `US-<persona>-<n>` · Estimates in story points (Fibonacci) · Linked to PRD requirement IDs.

Personas defined in [`../02-research/personas.md`](../02-research/personas.md):
**RT** = Rohit, the serious Indian retail trader (P0) · **AN** = Ananya, the global macro
investor (P1) · **PR** = Prakash, the professional analyst (P2) · **DV** = Dev, the API
integrator (P3) · **OPS** = our own editorial/ops user.

---

## Epic A — "Know what matters, fast" (M1)

| ID | Story | Pts | Req |
|---|---|---|---|
| US-RT-01 | As a trader, I want one card per story instead of 40 duplicates, so I can scan the market in 60 seconds. | 8 | FR-M1-02 |
| US-RT-02 | As a trader, I want to see whether a headline came from the exchange itself or from a Twitter account, so I know how much to trust it. | 3 | FR-M1-03 |
| US-RT-03 | As a trader, I want a story's full timeline, so I can tell a new development from a recycled one. | 5 | FR-M1-04 |
| US-RT-04 | As a trader, I want the wire to update live without refreshing, because I keep it open on a second monitor. | 5 | FR-M1-08 |
| US-RT-05 | As a trader, I want to filter the wire to only F&O-relevant Indian events, so I'm not reading about European utilities. | 3 | FR-M1-07 |
| US-AN-01 | As a global investor, I want to see when a story is a rumour and watch it get confirmed or denied, so I don't act on noise. | 5 | FR-M1-09 |
| US-RT-06 | As a returning user, I want "what's new since I last looked" on a story I'm following. | 3 | FR-M1-05 |

## Epic B — "Tell me what it means" (M2)

| ID | Story | Pts | Req |
|---|---|---|---|
| US-RT-10 | As a trader, I want to know the expected move on Bank Nifty from an RBI decision, with a range — not a vibe. | 13 | FR-M2-03 |
| US-RT-11 | As a trader, I want to see the historical analogs behind that estimate, so I can judge it myself instead of trusting a black box. | 8 | FR-M2-04 |
| US-RT-12 | As a trader, I want the product to tell me when it *doesn't* know, so I can stop treating every number as equally real. | 5 | FR-M2-05 |
| US-AN-10 | As an investor, I want to see whether a macro print beat or missed consensus, because that's what actually moves prices. | 5 | FR-M2-02 |
| US-PR-10 | As an analyst, I want every number traceable to its primary source, so I can cite it in my own note. | 5 | FR-M2-09 |
| US-RT-13 | As a trader, I want to share an Impact Card in my group chat, because that's how I discuss trades. | 3 | FR-M2-10 |

## Epic C — "The morning ritual" (M5) — *highest priority epic*

| ID | Story | Pts | Req |
|---|---|---|---|
| US-RT-20 | As an Indian trader, I want a 07:30 IST briefing that tells me where Nifty is likely to open and why, so I'm ready before 09:15. | 13 | FR-M5-01/02 |
| US-RT-21 | As a trader, I want the gap broken down by cause (US close, crude, USDINR, ADRs), so I understand the drivers instead of memorising a number. | 13 | FR-M5-03 |
| US-RT-22 | As a trader, I want to know the odds this gap fills, based on similar past gaps. | 8 | FR-M5-04 |
| US-RT-23 | As a trader, I want yesterday's OI-derived key levels in the same place. | 5 | FR-M5-05 |
| US-RT-24 | As a trader, I want to see at 09:20 whether the 07:30 estimate was right, so I learn how much to trust it. | 5 | FR-M5-07 |
| US-RT-25 | As a trader, I want this pushed to me — I shouldn't have to remember to open an app at 07:30. | 5 | FR-M5-08 |

## Epic D — "India market depth" (M4)

| ID | Story | Pts | Req |
|---|---|---|---|
| US-RT-30 | As an F&O trader, I want OI build-up classified (long build-up vs short covering) per symbol, not raw OI numbers I have to interpret. | 8 | FR-M4-02 |
| US-RT-31 | As an options trader, I want PCR, max pain and OI-by-strike for Nifty/Bank Nifty on one screen. | 8 | FR-M4-03 |
| US-RT-32 | As a trader, I want to see what FIIs did yesterday vs what retail clients did, because the divergence is the signal. | 8 | FR-M4-05 |
| US-RT-33 | As a trader, I want to know which constituents actually moved the index today. | 5 | FR-M4-01 |
| US-RT-34 | As a trader, I want alerts when a stock enters the F&O ban list or margins change, because it changes my position sizing. | 5 | FR-M4-16 |
| US-PR-30 | As an analyst, I want concall transcripts summarised with citations, so I can cover 40 results days instead of 8. | 13 | FR-M4-10 |
| US-RT-35 | As a trader, I want India macro prints (CPI, GST, IIP) with their surprise and the sectors they hit. | 8 | FR-M4-12 |

## Epic E — "Global context" (M3)

| ID | Story | Pts | Req |
|---|---|---|---|
| US-AN-40 | As an investor, I want one cross-asset screen showing equities, rates, FX, commodities and credit. | 8 | FR-M3-01 |
| US-AN-41 | As an investor, I want a macro calendar that shows consensus and then auto-fills the actual and the surprise. | 8 | FR-M3-02 |
| US-AN-42 | As an investor, I want to see the market-implied path for each central bank in one place. | 13 | FR-M3-04 |
| US-AN-43 | As an investor, I want to know what regime we're in and when it changed. | 13 | FR-M3-08 |
| US-PR-40 | As an analyst, I want a correlation explorer so I can check whether a hedge still works. | 8 | FR-M3-06 |

## Epic F — "Trust" (M6)

| ID | Story | Pts | Req |
|---|---|---|---|
| US-RT-50 | As a sceptical user, I want to see this product's full track record before I pay for it. | 8 | FR-M6-02 |
| US-AN-50 | As an investor, I want to know the hit rate for *this specific* event type, not an overall average. | 5 | FR-M6-02 |
| US-PR-50 | As an analyst, I want to see when a model was changed and how the old one performed. | 5 | FR-M6-04 |

## Epic G — "Only tell me what's mine" (M7)

| ID | Story | Pts | Req |
|---|---|---|---|
| US-RT-60 | As a trader, I want alerts only for news that actually affects my positions, above an impact threshold I set. | 8 | FR-M7-02 |
| US-RT-61 | As a trader, I want quiet hours, because I don't want a push at 2am about a Chilean copper strike. | 3 | FR-M7-03 |
| US-RT-62 | As a trader, I want a post-close summary of what moved my watchlist and why. | 5 | FR-M7-05 |
| US-AN-60 | As an investor, I want a weekend review instead of daily noise. | 3 | FR-M7-05 |

## Epic H — "Ask the corpus" (M8)

| ID | Story | Pts | Req |
|---|---|---|---|
| US-PR-70 | As an analyst, I want to ask "what happened to Indian IT stocks the last 10 times the rupee fell 2% in a week" and get a real answer with data. | 13 | FR-M8-04 |
| US-AN-70 | As an investor, I want search that understands meaning, not just keywords. | 8 | FR-M8-01 |
| US-RT-70 | As a trader, I want an entity page per stock with everything in one place. | 8 | FR-M8-02 |

## Epic I — "Run it safely" (M10)

| ID | Story | Pts | Req |
|---|---|---|---|
| US-OPS-01 | As an editor, I want high-impact items held for review before they publish. | 8 | FR-M10-02 |
| US-OPS-02 | As an editor, I want a kill switch for anything we got wrong — with the withdrawal shown publicly. | 5 | FR-M10-03 |
| US-OPS-03 | As an operator, I want to know within 5 minutes when a source stops sending data. | 5 | FR-M10-01 |
| US-OPS-04 | As an operator, I want a weekly quality report on entity precision, cluster purity and calibration. | 8 | FR-M10-05 |
| US-OPS-05 | As an operator, I want per-source and per-model cost visibility, so inference spend doesn't quietly eat the margin. | 5 | FR-M10-06 |

## Epic J — "Build on it" (M11)

| ID | Story | Pts | Req |
|---|---|---|---|
| US-DV-01 | As a developer, I want a documented REST API for events and impacts. | 13 | FR-M11-01 |
| US-DV-02 | As a developer, I want webhooks so I don't have to poll. | 8 | FR-M11-01 |
| US-DV-03 | As a developer, I want a streaming feed with <2s latency. | 13 | FR-M11-02 |

---

## Anti-stories (things we deliberately refuse to build)

| ID | Story | Why refused |
|---|---|---|
| AS-01 | "As a trader, I want you to tell me what to buy." | Advice. SEBI RA boundary. Violates principle #5. Non-negotiable. |
| AS-02 | "As a trader, I want a target price for this stock." | Same as AS-01. |
| AS-03 | "As a user, I want a forum to discuss tips." | Moderation liability under SEBI finfluencer rules; dilutes the trust position. |
| AS-04 | "As a user, I want push notifications for every headline." | Destroys the signal-to-noise promise, which is the whole product. |
| AS-05 | "As a publisher, I want an infinite-scroll feed optimised for time-on-site." | Violates principle #8. Our revenue is subscription, not attention. |
