# Concept Test — Impact Card Variants

**n = 150** Indian traders/investors (screened with [screener.md](screener.md) S1–S5)
**Design:** between-subjects, 3 cells × 50, randomised assignment
**Settles:** **RQ3** — does admitting uncertainty build trust or destroy it?
**Secondary:** RQ4 (waterfall comprehension), RQ5 (willingness to pay)
**Channel:** online, ~8 minutes, ₹100 incentive

---

## The three variants

| Cell | Variant | Shows |
|---|---|---|
| **A** | *Point estimate* | "Bank Nifty: expected −0.4% over 1 day." Nothing else. |
| **B** | *+ Confidence band* | "Bank Nifty: expected −0.4%, 68% range −1.3% to +0.5%. Confidence 0.61." |
| **C** | *+ Analogs + honesty* | B, plus "Based on 34 similar past events — 62% declined" with the dated list, **plus a second instrument showing "Not enough history to call this (n=7)."** |

**C is our intended design.** The test exists because C is also the riskiest: it is more
complex, and it openly admits ignorance. If C loses to A, our core design principle is wrong
and we need to know before building it.

---

## Flow

**1. Screening** — S1–S5. Terminate if unqualified.

**2. Context** *(identical for all cells)*
> "Imagine it's a trading morning. The US Federal Reserve cut interest rates overnight. A
> market app shows you this:"

**3. Stimulus** — one variant, viewed for a minimum of 15 seconds before Next unlocks.

**4. Comprehension** *(before any opinion questions — measure understanding first)*
- Q1. In your own words, what is this screen telling you? *(free text, coded)*
- Q2. According to this, is Bank Nifty more likely to go up or down tomorrow? `Up` `Down` `It doesn't say` `Not sure`
- Q3. How confident does this screen seem about its own estimate? `Very` `Somewhat` `Not very` `It doesn't say`
- Q4 *(cell C only)*. One instrument says "Not enough history to call this." What do you think that means? *(free text)* ⭐

**5. Trust**
- Q5. How much would you trust this estimate? `1–7`
- Q6. Does this feel like it was made by someone who knows what they're doing? `1–7`
- Q7. Would you want to know how they arrived at this number? `Yes` `No`
- Q8 *(cell C only)*. The screen admits it doesn't have enough data for one instrument. Does that make you trust the rest **more**, **less**, or **no difference**? ⭐⭐ *— this single question is the point of the study*

**6. Action**
- Q9. Would you open an app that showed you this every morning? `1–7`
- Q10. Would you share this with a trading friend? `Yes` `Maybe` `No`
- Q11. What's missing?

**7. Waterfall** *(all cells — a separate stimulus)*
> Show the attribution waterfall: `US close −38 · crude −12 · USDINR +9 · ADR drag −6 · Asia −4 · Fed event −18 · residual +2 → net −67`
- Q12. What is this chart telling you? *(free text, coded for comprehension)*
- Q13. Is this `Too much detail` / `About right` / `Not enough`?
- Q14. *(Show an 11-bar version to half the sample.)* Same two questions. → **settles RQ4: how many bars is too many**

**8. Pricing** (Van Westendorp, all cells)
- Q15. At what monthly price would this be **so cheap** you'd doubt its quality?
- Q16. At what price would it be **a bargain**?
- Q17. At what price would it start to feel **expensive but still worth considering**?
- Q18. At what price would it be **too expensive to consider**?

**9. Close** — segment questions, open comment.

---

## Pre-registered analysis plan

*Written before data collection so results cannot be reinterpreted after the fact.*

| # | Hypothesis | Test | Decision |
|---|---|---|---|
| H-A | **C ≥ B > A on trust (Q5)** | ANOVA + pairwise, α=0.05 | If **A > C significantly**, our transparency principle is wrong for this audience. Redesign the Impact Card and revisit [content-design.md](../../03-design/content-design.md) |
| H-B | **Q8: ≥50% say "trust the rest MORE"** | One-sample proportion | If <30% say "more" and >30% say "less", the `NotEnoughHistory` state needs redesign — not removal |
| H-C | Comprehension (Q2 correct) ≥80% in all cells | Proportion | A cell below 70% is too complex regardless of its trust score |
| H-D | Waterfall comprehension ≥70% at 7 bars, degrading at 11 | Proportion, 7 vs 11 | Sets the hard cap on waterfall components |
| H-E | Van Westendorp optimal price point ₹400–900/mo | Standard VW intersections | Informs but does not decide pricing — stated WTP overstates real WTP by roughly 2× |

**Guards:** randomised cell assignment · randomised question order within blocks ·
attention check mid-survey (drop failures) · minimum 15s stimulus exposure ·
**free-text coded by two people independently**, disagreements resolved by a third.

**Known limitation, stated up front:** this measures *stated* reaction to a static image, not
behaviour. It is strong evidence about **comprehension** and weak evidence about
**willingness to pay**. Weight it accordingly in the synthesis — and do not let a good VW
number become a pricing decision.
