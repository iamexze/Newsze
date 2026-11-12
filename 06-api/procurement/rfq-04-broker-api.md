# Enquiry — broker developer API

**Send to two broker API providers.** Several Indian brokers publish developer APIs on
licensed exchange feeds. **This is the route with the largest potential cost saving and the
largest legal uncertainty**, so the first question matters more than the price.

**Attach:** `00-data-requirement-spec.md`
**Send:** Phase 0, week 1 · **Chase:** day 7, day 14

---

**Subject:** Developer API — permitted use for a subscription analytics platform

Dear `<broker>` API team,

We are evaluating data sources for a pre-launch subscription analytics platform and would
like to understand whether your developer API is an appropriate route, and under what terms.

**What we are.** Newze publishes Indian market news and analytics to retail and professional
subscribers over the web, on a subscription model. We are **not** a broker, we do not route
orders, and we have no execution capability. We are not seeking order-placement access.

**The question that decides this for us, before any discussion of price:**

> Does your API licence permit data obtained through it to be **displayed to our own
> subscribers** on a commercial platform — or is use restricted to the API holder's own
> personal trading and analysis?

We would rather hear a clear "no" now than build on an ambiguity. If display to third parties
is not permitted, please say so and we will not take up further time.

**If display to subscribers is permitted**, our full requirement is in the attached
specification. In summary we would need index, cash and derivatives data including
strike-level option open interest, participant-wise positioning, end-of-day files, ban and
surveillance lists, and historical depth of roughly fifteen years.

Specific points:

- **Historical depth.** Most broker APIs are built for live trading rather than research.
  How far back does your historical data go, at what granularity, and is bulk historical
  access available?
- **Rate limits.** Our use is analytical rather than tick-by-tick. What limits apply, and is
  a higher tier available for a commercial platform?
- **Derived analytics.** We display computed values — open interest build-up classification,
  put-call ratio, max pain, implied-volatility rank — rather than raw quotes in many places.
  Section 4 of the specification lists them. Does your licence treat these differently?
- **Commercial terms.** Is there a commercial tier distinct from the individual developer
  tier, and what does it cost?
- **Stability.** What notice applies to a change in terms, and what has historically happened
  to commercial users when terms changed?

We are approaching the exchanges directly and authorised redistributors in parallel, so a
clear answer on permitted use is more valuable to us than a competitive price on an
uncertain basis.

Response requested by `<date>`.

With thanks,

`<Name>` · `<Title>` · Newze
`<email>` · `<phone>`
