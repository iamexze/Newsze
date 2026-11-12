# Quote Comparison & Decision Framework

**Status:** Awaiting responses · **Owner:** Founder
Fill this in as quotes arrive. **Decide against the framework in §3, not against the
headline fee** — the cheapest quote is frequently the one that forbids something the product
depends on.

---

## 1. Comparison matrix

| | NSE direct | BSE direct | Vendor A | Vendor B | Broker API A | Broker API B |
|---|---|---|---|---|---|---|
| Responded | | | | | | |
| **Display to subscribers permitted** | | | | | | |
| **Derived analytics — how treated** | | | | | | |
| End-of-day fee / month | | | | | | |
| Delayed 15m fee / month | | | | | | |
| Real-time fee / month | | | | | | |
| Fee model (flat / per-sub / other) | | | | | | |
| Historical archive — available? | | | | | | |
| Historical archive — cost | | | | | | |
| Point-in-time constituents (D10) | | | | | | |
| Participant-wise OI (D5) | | | | | | |
| Option chain, strike level (D4) | | | | | | |
| Non-production use covered | | | | | | |
| Redistribution via API possible | | | | | | |
| **Stored data on termination** | | | | | | |
| Minimum commitment | | | | | | |
| Time to live data | | | | | | |
| Audit / reporting burden | | | | | | |
| Non-paying user restrictions | | | | | | |

**Bold rows are disqualifying if answered wrongly.** A quote that forbids display to
subscribers, treats all derived analytics as licensed data at full cost, or requires deletion
of stored history on termination is not a cheaper option — it is a different product.

---

## 2. The three numbers that decide the business

| | Figure | Why it decides something |
|---|---|---|
| **N1** | Cheapest compliant **end-of-day** monthly cost | Sets whether we can launch at all, and when |
| **N2** | Incremental **real-time** monthly cost | Sets whether the ₹249 Pro tier has anything to sell |
| **N3** | Fixed monthly total at launch scale | Sets break-even subscriber count |

**Break-even arithmetic.** At ₹249 per month, contribution per subscriber is approximately
₹199 after payment fees, infrastructure and support. Break-even subscribers ≈ N3 ÷ 199.

| N3 (fixed monthly licence cost) | Break-even Pro subscribers |
|---:|---:|
| ₹1 lakh | ~500 |
| ₹5 lakh | ~2,500 |
| ₹15 lakh | ~7,540 |
| ₹40 lakh | ~20,100 |
| ₹1 crore | ~50,250 |

Our twelve-month target is 2,500 paying subscribers. **Read across: if N3 lands above roughly
₹5 lakh per month, the plan does not reach break-even inside twelve months at ₹249.**

---

## 3. Decision framework

Work down in order. Stop at the first branch that matches.

### Branch A — No compliant route permits display to subscribers
**Then:** there is no product. Stop and reconsider the business, do not build around it.
*Probability: low. Exchanges license display routinely; the question is price, not permission.*

### Branch B — Display permitted, but N3 > ₹5 lakh/month at launch scale
**Then:** the price is wrong, not the plan. Options, in order of preference:
1. Launch **end-of-day only** and defer real time until subscriber count supports it. Our
   architecture already treats latency as a per-field attribute, so this costs nothing to do.
2. Raise Pro back toward ₹499–799 and accept a smaller addressable base.
3. Narrow the data scope — drop participant-wise OI and full option-chain history at launch,
   which are the two most expensive line items relative to how much of the product depends on them.

**Do not** launch with a cost base that needs 20,000 subscribers while planning for 2,500.

### Branch C — Display permitted, N3 ≤ ₹5 lakh, derived analytics treated as our work product
**Then:** proceed. This is the good outcome. Sign the end-of-day agreement, build on it, and
negotiate real time separately once there is a paying base to justify it.

### Branch D — Display permitted, but derived analytics are treated as licensed data
**Then:** the cost scales with how much we compute, which is most of the product. Re-price
the quote on that basis before comparing, and re-read Branch B with the revised figure. Also
ask counsel whether the vendor's reading is actually correct — this is the question in the
G1 counsel brief, and a vendor's interpretation is not a legal conclusion.

### Branch E — The broker API route permits display and is materially cheaper
**Then:** get it in writing, and get counsel to read the terms before signing. The saving is
real; so is the risk that terms change with little notice and the data source disappears
mid-operation. If taking this route, **architect for a second source from day one** — the
source registry already supports it, and the cost of a parallel end-of-day fallback is small
insurance against a terms change.

### Branch F — Stored history must be deleted on termination
**Then:** this is the one that is easy to sign and expensive to discover. Our historical
corpus is the asset the whole product is built on; a licence that can compulsorily erase it
makes the moat contingent on a counterparty's goodwill. Negotiate a carve-out for derived
and aggregated data at minimum, and record the answer in `decisions.md` whichever way it goes.

---

## 4. What to do the day quotes arrive

1. Fill in §1 for every respondent — including non-responses, which are information.
2. Compute N1, N2, N3 and read the break-even row in §2.
3. Walk §3 top to bottom and stop at the first matching branch.
4. Log the outcome in [`../../decisions.md`](../../decisions.md) as a dated decision with the
   figures, not a summary.
5. Update [`../../07-planning/metrics-monetisation.md`](../../07-planning/metrics-monetisation.md)
   §3 with the real N3, replacing the placeholder.
6. If Branch B or F applies, tell the client before doing anything else. Both change the plan.

---

## 5. Response log

| Date | Counterparty | Channel | Summary | Next action | Owner |
|---|---|---|---|---|---|
| | | | | | |
