# Data Licensing Procurement

**Purpose:** close **Gate G1** — the market-data licensing question that sets the price, the
tier structure and whether the business reaches break-even.

> This is the single highest-value open item in the project. Everything downstream — the
> ₹249 price point, whether Pro has real-time data to sell, the launch date — is waiting on
> three numbers that only these enquiries produce.

---

## The pack

| File | What it is | Who it goes to |
|---|---|---|
| [`00-data-requirement-spec.md`](00-data-requirement-spec.md) | The master specification. **Attach to every enquiry** so quotes are comparable | All |
| [`rfq-01-nse.md`](rfq-01-nse.md) | Direct licence enquiry | NSE data licensing |
| [`rfq-02-bse.md`](rfq-02-bse.md) | Direct licence enquiry | BSE information products |
| [`rfq-03-vendor.md`](rfq-03-vendor.md) | Sublicensing enquiry — **send to two vendors** | Authorised redistributors |
| [`rfq-04-broker-api.md`](rfq-04-broker-api.md) | Permitted-use enquiry — **send to two brokers** | Broker developer API teams |
| [`quote-comparison.md`](quote-comparison.md) | Matrix, break-even arithmetic and the decision framework | Internal |

**Six enquiries, one specification.** Fill the bracketed fields, attach the spec, send all six
on the same day.

---

## How to send

1. Fill `<name>`, `<email>`, `<phone>` and `<date>` in all five outbound files. Allow **three weeks** for the response date.
2. Identify two authorised redistributors and two broker API providers before sending.
3. Attach `00-data-requirement-spec.md` to every email. Do not paste the scope into the body — differences between the email and the attachment are how quotes stop being comparable.
4. Send all six the same day so responses arrive together.
5. Chase on day 7 and day 14. Log every response in `quote-comparison.md` §5, including the non-responses.

---

## The three questions that matter more than price

Most procurement goes wrong by optimising the headline fee. These decide more:

**1. Are derived analytics licensed data, or our work product?**
Much of what we display is computed — build-up classification, put-call ratio, max pain, IV
rank, index attribution. If those count as licensed data, cost scales with how much we
compute, which is most of the product.

**2. What happens to stored history on termination?**
The historical corpus is the asset the whole product rests on. A licence that can compel
deletion makes the moat contingent on a counterparty's goodwill. Easy to sign, expensive to
discover.

**3. Is display to subscribers permitted at all?**
Particularly for the broker API route. A clear "no" today is worth more than a cheap quote on
an uncertain basis.

---

## What happens next

Quotes produce three numbers — cheapest compliant end-of-day cost, incremental real-time
cost, and fixed monthly total at launch. Those feed the break-even table in
[`quote-comparison.md`](quote-comparison.md) §2.

**The headline:** at ₹249/month, contribution is about ₹199 per subscriber. Our twelve-month
target is 2,500 paying subscribers, which covers roughly **₹5 lakh/month** of fixed licence
cost. If the quotes land materially above that, the price is wrong or the scope is — and
that is a conversation to have before launch, not after.

---

## Related

- [`../../01-requirements/legal/brief-g1-market-data.md`](../../01-requirements/legal/brief-g1-market-data.md) — the counsel brief on the same gate. **Send both in the same week**: counsel tells you what you need, vendors tell you what it costs
- [`../../04-architecture/adr/004-market-data-abstraction.md`](../../04-architecture/adr/004-market-data-abstraction.md) — why latency is a per-field attribute, which is what makes an end-of-day launch possible
- [`../integrations.md`](../integrations.md) — the full source inventory
- [`../../07-planning/metrics-monetisation.md`](../../07-planning/metrics-monetisation.md) — unit economics, to be updated with the real figure
