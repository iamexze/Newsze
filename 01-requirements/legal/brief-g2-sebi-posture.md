# Counsel Brief — G2: SEBI Regulatory Posture

**To:** `<Securities regulatory counsel>` · **From:** `<Client>` · **Date:** `<date>`
**Subject:** Whether a quantified, probabilistic market-impact estimate constitutes
"research" or "advice" under Indian securities regulation
**Attachments:** [`product-model.md`](../product-model.md) §2 and §6 · [`prd.md`](../prd.md) §4 (M2) ·
[`compliance.md`](../compliance.md) · sample Impact Card (attached separately)

> **This is the most important question in the project.** Our product design, our schema and
> our engineering controls are all built around a particular answer. If that answer is wrong,
> we need to know in week 3, not after launch.

---

## 1. What we are building (please read this section carefully — the detail matters)

A web platform publishing market news and statistical analysis for retail and professional
users, covering global markets and, in particular, Indian equities and derivatives.

The feature in question is the **"Impact Card."** When a market-relevant event occurs
(a rate decision, an inflation print, an earnings release), our system:

1. Classifies the event into a type from a fixed taxonomy.
2. Retrieves historically similar past events from our own database.
3. **Reports the empirical distribution of what the relevant instruments did after those
   past events** — median move, hit rate, sample size, and a confidence band.

### What the output looks like, precisely

> **FED CUTS 25BP, SIGNALS SLOWER PATH**
> NIFTY BANK, 1-day horizon: expected −0.41%, 68% range [−1.3%, +0.5%], probability of
> decline 61%, based on **34 historically similar events**, of which 62% saw a decline.
> Confidence 0.61. Method: analog retrieval + event-study estimation, model v1.4.2.
> *[list of all 34 past events, each dated and linked]*

### What the output never contains
We have designed the system so that these are **structurally impossible**, not merely
prohibited by policy:

| Never present | How it is prevented |
|---|---|
| "Buy", "sell", "hold", "accumulate", "book profit" | Deny-list scan over every published string; a hit blocks publication and fails the build |
| A target price | **No such field exists in the database schema**; a CI test asserts the column name never appears in any migration |
| Entry, exit, stop-loss or position sizing | Same |
| Any recommendation on a specific security for a specific person | No user-specific output is generated; all output is identical for all users |
| Suitability assessment, risk profiling, portfolio construction | Not built; explicitly out of scope |

Additional controls: every estimate carries its sample size and confidence; where historical
data is insufficient we publish *"Not enough history to call this"* rather than a number; and
**every estimate we publish is automatically scored against what actually happened and
displayed permanently on a public accuracy record** (see §4 — we believe this is relevant to
the characterisation, and we would like your view).

### Distribution
Published on a website and apps to a general, undifferentiated audience. Free tier and paid
subscription tiers. **No user-specific content; no human interaction with users about
specific securities; no advisory relationship contemplated.**

---

## 2. The questions

Please answer each numbered question directly.

**On characterisation**
1. Does the Impact Card output, as described above, constitute a **"research report"** within
   the meaning of the SEBI (Research Analysts) Regulations, 2014 as currently in force?
2. Does it constitute a **"recommendation"** for those purposes? Does the absence of any
   buy/sell/hold language and of any target price affect the analysis, or is a probabilistic
   directional estimate sufficient on its own to be a recommendation?
3. Does it constitute **"investment advice"** under the SEBI (Investment Advisers)
   Regulations, 2013? We believe not, as nothing is personalised and no advisory relationship
   exists — please confirm or correct.
4. Is there a legally meaningful distinction between *"this event type was historically
   followed by a decline 62% of the time"* (a statement about the past) and *"this instrument
   is likely to decline"* (a statement about the future)? **Our product is designed on the
   assumption that this distinction matters. Does it?**

**On exemptions and carve-outs**
5. Is any exemption available to us — for example as a media/news entity, or under any
   carve-out for general-purpose publications, or any exemption for publicly available
   information presented without recommendation?
6. Does operating a **free tier** alongside paid subscriptions affect the analysis? Does
   charging a subscription fee for access to analytics materially change our position?
7. Would our position change if the same analytics were offered **only** to institutional or
   professional subscribers?

**On registration**
8. If registration as a Research Analyst is required or advisable, please set out: eligibility
   criteria, qualification and certification requirements for personnel, net-worth
   requirements, application process and realistic timeline, ongoing compliance obligations
   (disclosures, record-keeping, review, internal policies), and estimated one-off and
   recurring cost.
9. Can an **entity** register with qualified personnel employed, rather than an individual?
   What is the minimum viable compliance structure for a startup?
10. If we register, what additional capability would registration *permit* us to offer that
    we cannot offer now? (This is material to our product roadmap — we want to understand
    both the cost and what it buys.)

**On conduct and content**
11. What **disclaimer language** do you recommend, and where must it appear? Our current draft
    is in [`compliance.md`](../compliance.md) §5.
12. Are there restrictions on how we may describe our own **accuracy record**? We intend to
    publish our historical hit rate and calibration. Does publishing a verifiable track record
    of past predictive accuracy create any risk of being construed as a performance claim or
    an inducement, even though it describes model calibration and not investor returns?
13. Our system **summarises third-party content (including earnings-call transcripts) using
    large language models**, with human oversight and a kill switch. Does automated generation
    raise any specific concern? Does SEBI's guidance on AI/ML usage by regulated entities apply
    to us if we are not registered?
14. Are there constraints on partnering with, or featuring, third-party analysts or educators?
    We intend to work only with SEBI-registered persons — please confirm this is the right line.

**On related exposure**
15. Do the **IT Rules, 2021** (digital news publisher obligations — grievance officer,
    redressal timelines, periodic compliance reporting) apply to us? If so, what is the minimum
    compliance posture?
16. We may display **IPO Grey Market Premium**, which references an unregulated and arguably
    illegal market. Our strong inclination is **not** to display it. Please advise whether
    displaying it, with a prominent caveat, creates regulatory exposure.
17. Any other Indian regulatory exposure we have not identified — advertising standards,
    consumer protection, or otherwise?

---

## 3. What we need from you, in what form

1. **A direct answer to Q1–Q4** — the characterisation question. This is the gate.
2. **A recommended operating posture**: either (a) we may operate as described without
   registration, with specified controls and disclaimers; or (b) registration is required or
   strongly advisable, with the path set out.
3. **Specific language changes**, if any, to how we describe our outputs — we will implement
   them as engineering controls, not just copy edits.
4. **A list of anything we must not build**, so we can place it formally out of scope.

**Deadline:** `<date — 3 weeks from sending>`. We have a go/no-go decision gated on this and
are holding development of the affected feature until we hear from you.

---

## 4. Our current working assumptions (please correct any of these)

We have built to the following assumptions. **Each is a question, not a conclusion.**

1. Describing the historical distribution of outcomes after similar past events is
   information, not a recommendation.
2. The absence of buy/sell/hold language, target prices and position guidance is material to
   that characterisation.
3. Content that is identical for every user, with no advisory relationship, is not investment
   advice.
4. Publishing our own accuracy record is a transparency measure that reduces rather than
   increases regulatory risk.
5. We may need to register as a Research Analyst regardless, simply to be safe and to
   preserve future product flexibility.

**If assumption 1 or 2 is wrong, we will redesign the feature.** We would rather redesign now
than litigate later, so please be direct about the risk rather than diplomatic.
