# Decision Log

Running log of every decision that shapes the product. **One line per decision, newest first.**
Architecturally expensive, hard-to-reverse decisions also get a full
[ADR](04-architecture/adr/). Everything else lives here only.

**Rules**
1. Record the decision **and the reasoning**, not just the outcome. In six months the
   reasoning is the valuable half.
2. Record decisions that were **rejected**, with why. Prevents re-litigating.
3. A decision that turns out wrong is **not deleted** — add a new row that reverses it and
   link back. (Same principle as [ADR-009](04-architecture/adr/009-append-only-ledger.md):
   the record of being wrong is what makes the record trustworthy.)
4. Every scope change, every estimate revision and every experiment result gets a row.

---

| Date | # | Decision | Why | Who | Links |
|---|---|---|---|---|---|
| 2026-11-13 | D049 | **Every statistic is one tap from what moves it** | A number is useless until you know what changes it. 18 metrics, 80 factors each with an indicative weight, and the common misreading named. The misreadings are the point — PCR as a contrarian signal, delivery % as conviction, max pain as a target | Product | [web/lib/explain.ts](web/lib/explain.ts) |
| 2026-11-13 | D048 | 🔴 **Pro repriced ₹799 → ₹249/mo; Terminal ₹9,999 → ₹1,999** | Client decision. A serious Indian retail trader already spends ₹1,200–2,500/mo across tools; at ₹799 we displace something, at ₹249 we sit alongside. **Cost: contribution per sub falls ₹738 → ₹199 and break-even subscriber count rises ~3.7×.** The bet is volume over margin and is only defensible if conversion improves by more than 3.7×. Test in RQ5 before treating as settled | Client, Product | [metrics-monetisation.md](07-planning/metrics-monetisation.md) |
| 2026-11-13 | D047 | **Nav leads with Today, India, Global factors, Outlook** | The four surfaces a trader opens first. Everything else follows in order of how often it is used, not how impressive it is | Product | [web/components/Masthead.tsx](web/components/Masthead.tsx) |
| 2026-11-13 | D046 | **"AI analysis" is scoped explicitly: models read, code computes** | The outlook page states that language models classify and summarise while every probability comes from the option chain or historical frequency. The boundary is architectural — the scoring service has no model client (ADR-008) — so the claim is verifiable rather than reassuring | Product, Eng | [web/lib/outlook.ts](web/lib/outlook.ts) |
| 2026-11-13 | D045 | **Possibility trees show joint probability, not just branch probability** | A 42% branch beneath a 34% branch is a 14% outcome. Showing only the branch figure is the most common way these trees mislead. Each node also names its basis (option-implied vs historical base rate) and its sample size | Product | [web/components/Tree.tsx](web/components/Tree.tsx) |
| 2026-11-13 | D044 | **Four themes: Light, Dark, Paper, Terminal** | Paper is warm and low-glare for long reading; Terminal is high-contrast dark for a desk. Both redefine tokens only, so no component rule changes and no risk of a half-themed surface | Design | [web/components/ThemeToggle.tsx](web/components/ThemeToggle.tsx) |
| 2026-11-13 | D043 | **Index relationships get a page because correlation breaks when it matters** | Nifty–Sensex averages ~85% and has fallen to 11% in a single month; Bank Nifty sits at 0.98 correlation and 1.12 beta to Nifty. Traders hold "diversified" index positions that are one position with extra steps, and divergence is composition rather than signal | Product | [web/app/india/correlation](web/app/india/correlation/page.tsx) |
| 2026-11-13 | D042 | **The up/down probability is risk-neutral and labelled as such on every surface** | The user asked for "it may go up, it may go down". The honest form is the option market's own implied probability — N(d₂), expected move = S·IV·√t, straddle ÷ 0.8 for sigma — with the caveat that option prices embed a risk premium and the density is terminal, not path-dependent. Omitting that caveat is the standard failure of tools in this category | Product, Eng | [web/lib/options.ts](web/lib/options.ts) |
| 2026-11-13 | D041 | **The regulation tracker publishes the disagreement rather than resolving it** | Secondary sources on the 2026 F&O overhaul contradict each other on lot sizes, expiry days and effective dates; some quote figures others call superseded. Picking one arbitrarily is how a wrong number gets repeated, so each disputed field is flagged with the conflict named | Product | [web/app/regulations](web/app/regulations/page.tsx) |
| 2026-11-13 | D040 | **Hindi ships as dual-rendered HTML, not a client i18n layer** | Both languages render server-side and CSS hides one off `data-lang`. Keeps every page a server component, no hydration flash, instant switch. Only the structured payload is translated — never the generated prose, which would lose its citation and advice-language guarantees | Eng, Product | [web/components/T.tsx](web/components/T.tsx) |
| 2026-11-13 | D039 | **News corpus expanded to 21 stories with Hindi headlines** | Thirteen stories was too thin to demonstrate clustering, section filtering or the Radar threshold. The new coverage also carries the SEBI F&O overhaul, MSCI review, MCX session structure and the SIP structural story | Product | [web/lib/data.ts](web/lib/data.ts) |
| 2026-11-13 | D038 | **Scenarios test the common belief, not just the data** | The user asked for a prediction section. The useful form is a conditional outlook that names what traders assume and then shows what actually followed. Four of ten beliefs come out backwards — a correct intuition confirmed changes no behaviour; a confident wrong one is where money is lost | Product | [web/app/scenarios](web/app/scenarios/page.tsx) |
| 2026-11-13 | D037 | **Motion is progressive, never required** | `js-anim` is added by JS only, so without it every revealed element is simply visible and the page is complete at rest. CountUp renders its final value server-side. A failed script yields the whole page, not a blank one | Eng | [web/components/Motion.tsx](web/components/Motion.tsx) |
| 2026-11-13 | D036 | **Microstructure gets a first-class page** | F&O ban at 95% of MWPL, ASM margins to 100%, GSM call auctions and concentration margin decide what a trader can actually trade. It is high-value, hard-to-find knowledge that no competitor assembles in one place | Product | [web/app/india/microstructure](web/app/india/microstructure/page.tsx) |
| 2026-11-13 | D035 | **Index-flow/MSCI tracking is a distinct product surface** | Passive rebalancing is the only genuinely price-insensitive order flow in public markets, it is announced in advance, and most of the move happens in the announcement window rather than on the effective date. Published flow estimates for the same review differ materially, so we show both | Product | [web/app/india/index-flows](web/app/india/index-flows/page.tsx) |
| 2026-11-13 | D034 | **All research stays free; Pro sells tools, not knowledge** | The global-factor studies, transmission work, pattern and seasonality reviews, methodology and full Ledger are free permanently. Pro is live data, scanners and workbenches. Gating the knowledge would contradict the trust position that makes the product work | Product | [web/app/pricing](web/app/pricing/page.tsx) |
| 2026-11-13 | D033 | **Candlestick patterns are published with their (mostly negative) evidence** | Marshall et al. and Horton find no predictive value in major equity markets; the SSE50 study found no bearish pattern worked and none beat ~1% round-turn costs. Publishing that, rather than a pattern cheat-sheet, is the differentiator | Product | [web/app/patterns](web/app/patterns/page.tsx) |
| 2026-11-13 | D032 | **Global factors get their own section, ranked by transmission strength not news volume** | Crypto generates far more coverage than DXY and matters far less to an Indian portfolio. Eight factors, each rated high/medium/low impact on India, with crypto rated low and the reason stated | Product | [web/app/global-factors](web/app/global-factors/page.tsx) |
| 2026-11-13 | D031 | **Theme v3: white page, deep-navy ink, Sora/Public Sans/JetBrains Mono** | Pure black with Instrument Serif read as stylised editorial rather than a market product. Navy holds large display type without harshness and gives the amber Pro marker somewhere to sit | Design | [web/app/globals.css](web/app/globals.css) |
| 2026-11-13 | D030 | **The site says which indicators do NOT work** | `/signals` rates ten indicators against the published literature. Put-call ratio, breadth and flow data come back weak or unevidenced at index level. A site selling analytics has an incentive to imply everything works; saying otherwise is the whole trust position | Product | [web/app/signals](web/app/signals/page.tsx) |
| 2026-11-13 | D029 | **Forecast aggregation is published as a scoreboard, not a signal** | The user asked for market up/down predictions. The compliant and more useful form is aggregating what forecasters say and attaching each one's scored hit rate — a scoreboard, never a recommendation. It also extends the Ledger moat to third parties | Product | [web/app/forecasts](web/app/forecasts/page.tsx) |
| 2026-11-13 | D028 | **Theme: white paper, black ink, with black as a structural material** | Full-bleed bands and solid blocks carry the figures that matter, so the eye lands on them first. Instrument Serif / Archivo / IBM Plex Mono replaces the earlier pairing | Design | [web/app/globals.css](web/app/globals.css) |
| 2026-11-13 | D027 | **Data-visuals replace photography in card slots** | A news grid needs an image slot. Stock photos on a markets site are filler, and fabricated news photography would be dishonest. Each card's visual is drawn from that story's own numbers, so it carries information before the headline is read | Design | [web/components/Thumb.tsx](web/components/Thumb.tsx) |
| 2026-11-13 | D026 | **The web prototype is light-first, not dark-first** | A publication reads on white; the terminal aesthetic in the earlier draft read as a tool, not a news product. Dark is fully designed for the 07:30 and 23:00 sessions and is one toggle away | Design | [web/app/globals.css](web/app/globals.css) |
| 2026-11-13 | D025 | **A runnable Next.js prototype replaces the single-file artifact** | The artifact could not show the multi-page structure the product actually needs. 24 routes on localhost:3000, 71 static pages, with `lib/data.ts` as the single seam where licensed feeds will replace sample data | Eng | [web/README.md](web/README.md) |
| 2026-11-12 | D024 | **Entity-resolution quality is measured on unseen surface forms, not on the seed dictionary** | The original golden set scored 100% because it was drawn from the dictionary the resolver was built from — a rigged test. The hard set (possessives, truncations, headline caps) gives the honest number: 100% precision, 85% recall, 0 wrong-entity errors | Eng | [spikes/s4](spikes/s4_entity_resolution/) |
| 2026-11-12 | D023 | **S3 targets high-frequency event classes first** (EARNINGS, FII_DII_FLOW, BULK_BLOCK_DEAL, INSIDER_TRADE) | Power analysis: detecting a 3–6pp edge needs 700–4,000 test events per class. RATE_DECISION — the most interesting class — yields ~150 per decade and is the least testable. Counter-intuitive, so it is written down | Data | [phase-0-execution.md](07-planning/phase-0-execution.md) §7 |
| 2026-11-12 | D022 | 🔴 **The 15-year backfill is protected scope, not a scope item** | Without it the Phase 4 calibration gate is statistically unanswerable. Cutting it to save M1 time would silently make the moat untestable — and that would not surface until Phase 4 | Product, Eng | [spikes/README.md](spikes/README.md) |
| 2026-11-12 | D021 | **S3 decision rule gains a fourth verdict: INSUFFICIENT POWER** | Harness validation returned NO-GO on 8 of 12 draws containing genuine signal. A rule that cannot separate "no signal" from "not enough data to look" will kill a working product. Supersedes the v1 rule | Product, Data | [phase-0-execution.md](07-planning/phase-0-execution.md) §7 |
| 2026-11-12 | D020 | **S3 significance testing: honest null + exact binomial + Bonferroni + fold sign-test** | The first harness run passed a **pure-noise class at +8.9pp lift**. Lift alone is not evidence when six classes are tested at ~50% accuracy. Post-fix false-positive rate: 0/12 draws | Data | [spikes/s3](spikes/s3_analog_signal/) |
| 2026-11-12 | D019 | **Phase 0 is priced and committed separately from everything else** | Four of the largest cost inputs (market-data licence, wire licence, consensus data, Impact Engine feasibility) are unknown until it closes. Committing the full budget first would be pricing four unknowns | Product | [quote.md](09-client/quote.md) §5 |
| 2026-11-12 | D018 | **ap-south-1 (Mumbai) is the primary region, not us-east-1** | P0 users, the two daily traffic spikes, the key data sources and the regulatory exposure are all Indian. 200ms matters most in the 10 minutes that define the product | Eng | [ADR-010](04-architecture/adr/010-india-first-region.md) |
| 2026-11-12 | D017 | **The Accuracy Ledger has no delete path at any layer** | The moat is the claim that we *cannot* have hidden the bad calls. A soft delete would reduce that to a promise | Product, Eng | [ADR-009](04-architecture/adr/009-append-only-ledger.md) |
| 2026-11-12 | D016 | **LLMs never produce a number that appears in an Impact** | The Ledger requires reproducible, auditable figures. All quantitative output comes from deterministic statistical code | Eng, Product | [ADR-008](04-architecture/adr/008-llm-routing.md) |
| 2026-11-12 | D015 | **Tiered LLM routing: parser → Haiku 5.5 → Opus 5** | Inference would otherwise dominate cost and latency. Target ≥85% of volume never reaching the expensive tier | Eng | [ADR-008](04-architecture/adr/008-llm-routing.md) |
| 2026-11-12 | D014 | **Charts built on lightweight-charts + visx; no charting vendor** | The cone, the waterfall and the fan chart *are* the differentiation. We can't outsource our differentiator to a generic library | Design, Eng | [ADR-007](04-architecture/adr/007-charting.md) |
| 2026-11-12 | D013 | **SSE, not WebSocket, as the primary realtime transport** | Our feed is one-directional; browser-native reconnect with `Last-Event-ID` gives us gap backfill for free, and SSE survives Indian mobile proxies better | Eng | [ADR-006](04-architecture/adr/006-realtime-transport.md) |
| 2026-11-12 | D012 | **TimescaleDB now; ClickHouse only when ticks or p95>2s demand it** | The Impact Engine joins prices to events constantly — keeping both in Postgres dialect is worth more than raw scan speed at our scale | Eng | [ADR-005](04-architecture/adr/005-timeseries-store.md) |
| 2026-11-12 | D011 | **Latency class is an attribute of every price-bearing field** | Lets development proceed on EOD data before Gate G1 closes, and makes licence compliance structural rather than procedural | Eng, Product | [ADR-004](04-architecture/adr/004-market-data-abstraction.md) |
| 2026-11-12 | D010 | **Temporal for durable workflows** | A 20-day settlement timer must survive deploys. A silently missed settlement corrupts the Ledger, which is the one thing that must never be wrong | Eng | [ADR-003](04-architecture/adr/003-orchestration.md) |
| 2026-11-12 | D009 | **Redpanda (Kafka API) as the event bus** | Reprocessing-as-replay is architectural commitment C1; the Kafka API is the portability hedge | Eng | [ADR-002](04-architecture/adr/002-event-bus.md) |
| 2026-11-12 | D008 | **Next.js App Router** | SEO is existential for a news product and ISR gives <60s index freshness on breaking stories | Eng | [ADR-001](04-architecture/adr/001-nextjs-app-router.md) |
| 2026-11-12 | D007 | **The Accuracy Ledger runs in shadow mode from Phase 1, public in Phase 4** | It needs ≥90 days of scored history before it can be shown. Starting the clock in Phase 1 is what makes a Phase 4 launch possible — sequence this wrong and the moat slips 6 months | Product | [roadmap.md](07-planning/roadmap.md) |
| 2026-11-12 | D006 | **MVP = "the best pre-open 10 minutes in India," not a broad news site** | A narrow daily habit (loop L1) beats a broad shallow product. 250 mornings a year is the strongest retention mechanic available to us | Product | [scope.md](01-requirements/scope.md) |
| 2026-11-12 | D005 | **Analytics, never advice — enforced in schema, prompts and CI, not just disclaimers** | SEBI RA boundary. The Impact schema has no `action` field, so there is nowhere to put a recommendation even by accident | Product, Legal | [compliance.md](01-requirements/compliance.md) |
| 2026-11-12 | D004 | **Gates G1 (market data), G2 (SEBI), G3 (content rights) are go/no-go before production code** | Three of the four things that could kill the project are legal. They are cheapest to discover in week 2, not month 8 | Product | [compliance.md](01-requirements/compliance.md) |
| 2026-11-12 | D003 | **Spike S3 (does analog retrieval have any signal?) runs in Phase 0, not Phase 4** | It is the highest-risk assumption in the plan. Scheduled early so it can fail cheaply. If it fails, we ship news + analytics and lose Moats 1 and 2 — a decision worth making in week 3, not month 10 | Product, Data | [research-plan.md](02-research/research-plan.md) |
| 2026-11-12 | D002 | **No CMS. Structured-first architecture** | Every incumbent is CMS-based, which is precisely why none of them can emit a machine-readable payload in seconds. Prose is a rendering of the payload, never the source | Eng, Product | [tech-stack.md](04-architecture/tech-stack.md) |
| 2026-11-12 | D001 | **The moat is a compounding Event→Outcome corpus + a public Accuracy Ledger — not features** | Answers the client's "no one should replicate this": features are copyable in weeks; a three-year scored track record is copyable only by someone who started three years ago | Product | [vision-and-moat.md](00-overview/vision-and-moat.md) |

---

## Rejected options (so they don't come back)

| Date | Rejected | Why |
|---|---|---|
| 2026-11-12 | Buy/sell signals, target prices, model portfolios | SEBI RA registration required; would also destroy the trust position. Revisit only if registration is obtained |
| 2026-11-12 | A user forum / comments in v1 | Moderation liability under SEBI finfluencer rules; dilutes the trust position |
| 2026-11-12 | Ad-funded free tier with engagement optimisation | Would corrupt the product within a quarter. Our incentive must be correctness, not attention |
| 2026-11-12 | Paid stock promotion / sponsored research | Would destroy Moat 2 instantly and permanently |
| 2026-11-12 | Headless CMS | Forces prose-first; silently destroys the structured-first architecture |
| 2026-11-12 | MongoDB as primary store | Data is deeply relational; the ledger needs transactional integrity |
| 2026-11-12 | Microservices at launch | 3–6 engineers. Modular monolith; split along the pipeline-stage seams later |
| 2026-11-12 | Kubernetes at launch | Operational overhead with no payoff below ~50k users |
| 2026-11-12 | Scraping exchange sites for real-time prices | Licence violation and a single point of catastrophic failure |
| 2026-11-12 | A pure-LLM "AI analyst" | Non-reproducible and non-calibratable, therefore incompatible with the Accuracy Ledger |
| 2026-11-12 | Native mobile apps before Phase 7 | PWA delivers 90% of the value 6 months earlier |
| 2026-11-12 | GraphQL for the public API | REST + webhooks + SSE is what B2B data consumers actually ask for |

---

## Open decisions (awaiting an owner's answer)

| # | Question | Blocks | Owner | Due |
|---|---|---|---|---|
| O1 | Real-time NSE/BSE licence — direct or via vendor? At what cost? | All real-time M4 | Founder | M0 end |
| O2 | Does a quantified Impact constitute "research" under SEBI RA Regulations? | M2, M5 public launch | Counsel | M0 wk 3 |
| O3 | Which wire partner, at what cost, with what redistribution rights? | M1 breadth | Founder | M0 wk 4 |
| O4 | Build or licence the 15-year historical backfill? | Corpus bootstrap | Eng + Founder | M0 end |
| O5 | India-first pricing or global day one? | M9 | Product | M0 end |
| O6 | Do we display IPO GMP at all, given it references an unregulated grey market? | FR-M4-11 | Counsel | M3 |
| O7 | Is "Newze" the final name? Domain availability? | Brand, design | Client | M1 |
| O8 | Team size: 3 or 5? | All estimates | Client | Before M0 |
| O9 | Pursue SEBI RA registration (Plan B) or operate as information only (Plan A)? | Product boundary | Client + Counsel | M0 end |
| O10 | Which 4–6 event classes does S3 test on real data, given the power constraint? | S3 verdict | Data | M0 wk 1 |
| O11 | Can the 15-year backfill be licensed as a bulk historical dataset, or must it be accumulated? | D022, corpus bootstrap | Founder | M0 end |
