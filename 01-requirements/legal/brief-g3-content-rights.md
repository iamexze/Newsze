# Counsel Brief — G3: News Content Rights

**To:** `<Media / IP counsel>` · **From:** `<Client>` · **Date:** `<date>`
**Subject:** Copyright position for aggregating, analysing and summarising third-party news
**Attachments:** [`product-model.md`](../product-model.md) §2 · [`prd.md`](../prd.md) §3 (M1) ·
[`content-design.md`](../../03-design/content-design.md) · sample story page (attached separately)

---

## 1. What we do with third-party content

We ingest news from wires, publisher RSS feeds, company announcements, exchange filings and
regulatory publications. **We do not employ journalists and do not do original reporting.**

### Internally (not shown to users)
We store the full text of ingested articles and process it with software, including large
language models, to: extract named entities (companies, people, instruments), classify the
event type, group articles reporting the same occurrence into a single cluster, and compute
statistical analysis. **The stored full text is never displayed to users.**

### Publicly (what a user sees)
For each cluster of articles about one event, we display:

| Shown | Example |
|---|---|
| **Our own headline**, written by our system | "Fed cuts 25bp, signals slower path ahead" |
| **Our own summary**, ≤3 bullets, each citing a source | "Policy rate lowered to 3.75%…" |
| **Our own statistical analysis** | "34 similar past events: 62% saw Bank Nifty decline" |
| **A source list** — outlet name, timestamp, credibility tier, **and a link to the original** | "Reuters · 18:30 UTC · [read original]" |
| **At most 200 characters quoted** from any single source, where a direct quote is needed | — |

We display **no article bodies, no publisher images, and no extended extracts**. Every source
row links out to the publisher's own page. This 200-character limit and the no-body-text rule
are enforced by an automated check in our build system, not merely by editorial policy.

**Commercial model:** subscription. Free and paid tiers.

---

## 2. Questions

**Internal analytical use**
1. Does storing and machine-processing the full text of third-party articles — **without
   displaying it** — constitute infringement under the Indian Copyright Act, 1957? Does the
   fair-dealing provision cover analysis and indexing of this kind?
2. Does it matter that the processing involves large language models? Is there any emerging
   Indian position on text-and-data mining for commercial purposes that we should plan around?
3. Does our **retention of the full text for seven years** (for reprocessing and as a
   compliance record) change the analysis versus transient processing?

**Published output**
4. Are **headlines** protected by copyright in India? If some are, how should we treat them?
   *(Our system writes its own headlines, but they will sometimes closely resemble the
   original, because a factual headline has limited ways to be expressed.)*
5. Is an **automatically generated summary** of a copyrighted article an infringing derivative
   work, or a permissible expression of the underlying facts? **This is our central question.**
6. Does summarising from **multiple sources** materially improve our position compared with
   summarising a single article?
7. Is the **200-character quotation limit** a reasonable and defensible line? Should it be
   lower? Is a character limit the right test at all, or does substantiality matter more than
   length?
8. Does **attribution with a prominent link to the original** strengthen our position? Does it
   matter whether the link is to the article or to the publisher's homepage?

**Feeds, terms of use and scraping**
9. May we use a publisher's **public RSS feed** for this purpose? Does publishing an RSS feed
   imply a licence, and if so, how far does it extend?
10. How binding are **website terms of use** that prohibit automated access or commercial use,
    where we have not clicked through any agreement? What is our exposure if we rely on a
    public feed whose terms prohibit commercial aggregation?
11. Is any exchange-published or government-published content (exchange filings, SEBI orders,
    RBI circulars, statistical releases) free of copyright constraint? May we reproduce it in
    full?

**Licensing**
12. If we license a wire service (Reuters, AFP, PTI, ANI), what rights would we typically
    obtain, and does that solve the problem for the licensed content only — leaving our
    position on unlicensed RSS sources unchanged?
13. What would you expect a wire licence to cost for a startup, and what structures exist
    (per-story, flat, tiered by audience)?
14. **Given our actual usage — headline, our own summary, a link, and at most 200 characters —
    do we need a wire licence at all?** If not strictly necessary, is it advisable anyway?

**Other**
15. Our analysis and summaries are **machine-generated**. Who owns the copyright in them under
    Indian law, and does that affect our ability to license our own output through a B2B API?
16. What is the realistic enforcement risk? Have Indian publishers acted against aggregators
    operating in this way?
17. If we expand to serving EU and US users, what changes? (We are aware the EU has a
    press-publishers' right; please flag anything that would require a different architecture
    rather than a different policy.)

---

## 3. What we need from you

1. **A clear position on Q5** — whether our generated summaries are defensible. Our entire
   content architecture depends on it.
2. **A written set of operating rules** we can implement as automated checks: maximum quote
   length, required attribution format, what must never be reproduced, which source categories
   are safe and which are not.
3. **A recommendation on wire licensing** — necessary, advisable, or unnecessary — with a
   shortlist and expected cost.
4. **A source-category risk ranking** (exchange/government filings · company announcements ·
   wire copy · publisher RSS · social) so we can configure our source registry accordingly.
   Each source in our system already carries a licence-status field; we need to know what to
   put in it.

**Deadline:** `<date — 3 weeks>`.

---

## 4. Our current assumptions (please correct)
1. Facts are not copyrightable; our summaries express facts, not protected expression.
2. Internal analytical processing without display is defensible.
3. Headline + link + attribution is the standard aggregator posture and is low-risk.
4. Government and exchange publications are freely reproducible.
5. A wire licence is desirable for coverage quality but not strictly required for our usage pattern.

**If assumption 2 or 5 is wrong, our cost structure changes materially** — so please address
those two directly even if the rest is straightforward.
