# Content & Editorial Design

**Status:** Draft v1 · **Date:** 2026-11-12

## 1. Why this document exists
Most of our output is machine-generated. That makes editorial standards an **engineering
spec** — a prompt contract and a lint rule — not a style guide a human remembers.

## 2. Headline rules (machine-generated, lint-enforced)
- ≤ 85 characters. Fact first, actor second, interpretation never.
- Numbers belong in the headline when they are the news (`FED CUTS 25BP` not `FED CUTS RATES`).
- No question headlines. No "here's why". No "what it means for you". No em-dash cliffhangers.
- Never the word *crash*, *soar*, *plunge*, *skyrocket*, *bloodbath* — use the number.
- Uncertainty stated in the dek, never smuggled into the headline.

## 3. The summary contract (what the LLM must produce)
```jsonc
{
  "headline": "≤85 chars, factual, no interpretation",
  "dek":      "≤160 chars, adds the 'so what', still factual",
  "bullets":  ["≤3 bullets, ≤100 chars each, each traceable to a cited signal"],
  "entities": ["resolved ids only — never free text"],
  "citations":[{"claim_idx":0,"signal_id":"sig_..."}]   // every bullet must cite
}
```
**Hard constraints enforced in code, not in the prompt alone:**
- Any sentence without a citation is dropped before render.
- Any quoted span > 200 characters from a single source fails the render lint (FR-M1-06).
- Advice-shaped language (`buy`, `sell`, `target`, `should`, `recommend`, `add on dips`) is
  blocked by a deny-list check on every generated string. A hit fails the build / blocks publish.
- Superlatives and intensifiers are stripped (`massive`, `huge`, `historic`, `unprecedented`
  unless `novelty > 0.9` and justified by data).

## 4. Numbers in prose
Always: value + unit + comparison + as-of. `"CPI 4.8% y/y (est 5.0%, prior 5.2%) · Oct · MoSPI"`.
Never a number without its source. Never a change without its base.

## 5. Error, empty and degraded states (designed, not default)
| State | Copy |
|---|---|
| Not enough history | "Not enough history to call this (n=7). Here's the raw context." |
| Data stale | "Prices as of 15:30 IST · delayed 15 min · exchange feed delayed" |
| Source down | "3 of 62 sources are not reporting. Coverage may be incomplete. [status ▸]" |
| Model suppressed | "We've paused estimates for this event class — our recent calls weren't accurate enough. [why ▸]" |
| Withdrawn | "This estimate was withdrawn on 08 Nov. Reason: entity mis-resolution. The original is preserved below." |
| Bridge failed | "Today's briefing didn't publish on time. We don't show yesterday's as if it were today's. [status ▸]" |

> Every one of these is a **trust-building moment**. They get the same design attention as
> the happy path, because at scale the user will see them often.

## 6. Correction policy (public, at `/corrections`)
1. Nothing published is silently edited. Ever.
2. A correction appends a dated notice to the original; the original text remains visible.
3. Material corrections push to anyone who was alerted on the original item.
4. Impact corrections are recomputed, re-settled, and both versions appear on the Ledger.
5. The corrections page is indexed and linked from the footer — not hidden.

## 7. Localisation
- en-IN is the default register for India (lakh/crore, IST-first, Indian number grouping `1,00,000`).
- en-US/en-GB for global users (million/billion, local-market-first).
- Hindi is a P2 rendering of the same structured payload — **translate the payload, never the prose**, so the citation and advice-language guarantees survive translation.
