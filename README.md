# Newze — Planning Workspace

**Newze turns world events into measured market consequences — globally, and specifically
for the Indian trader — and publishes its own accuracy while doing it.**

> ⚠️ **Planning artifacts only.** No application code is written until the Phase 0 gates in
> [`07-planning/roadmap.md`](07-planning/roadmap.md) are cleared. Three of the four things
> that could kill this project are legal, not technical — see
> [`01-requirements/compliance.md`](01-requirements/compliance.md).

---

## Read these four, in this order

| # | Doc | Time | Why |
|---|---|---|---|
| 1 | [`00-overview/one-pager.md`](00-overview/one-pager.md) | 5 min | The whole thing on one page |
| 2 | [`01-requirements/product-model.md`](01-requirements/product-model.md) | 20 min | **The machine.** How an event becomes an insight. Everything else is downstream |
| 3 | [`01-requirements/prd.md`](01-requirements/prd.md) | 30 min | Every feature, prioritised, with acceptance criteria |
| 4 | [`07-planning/roadmap.md`](07-planning/roadmap.md) | 10 min | Phases, gates, and the three ways this plan fails |

---

## Full map

```
00-overview/     one-pager · vision-and-moat · glossary
01-requirements/ prd · product-model · user-stories · user-roles · scope · compliance
02-research/     competitors · personas · research-plan · competitive-watch · references/
03-design/       sitemap · user-flows/ · wireframes/ · design-system · content-design
04-architecture/ system-diagram · tech-stack · adr/ (10 records)
05-data-model/   er-diagram · entities · multi-tenancy · event-taxonomy.yaml
06-api/          endpoints · integrations
07-planning/     roadmap · milestones · estimates · metrics-monetisation · instrumentation
08-ops/          environments · deployment · backup-monitoring · security-privacy
09-client/       sow · quote · meetings/ · signoffs/
decisions.md     running log — date, decision, why
```

| Folder | What's in it |
|---|---|
| [`00-overview/`](00-overview/) | The pitch, the moat thesis, and the shared vocabulary |
| [`01-requirements/`](01-requirements/) | What we're building, for whom, with what constraints. **The PRD and the product model live here** |
| [`02-research/`](02-research/) | Who else is in the market, who our users are, and what we still need to learn |
| [`03-design/`](03-design/) | Every screen, every flow, the wireframes and the visual system |
| [`04-architecture/`](04-architecture/) | The system that runs the machine, plus 10 ADRs for the expensive decisions |
| [`05-data-model/`](05-data-model/) | Entities, relationships, the event taxonomy, tenancy |
| [`06-api/`](06-api/) | Endpoint contracts, and every external data source with its licence status |
| [`07-planning/`](07-planning/) | Phases, milestones, estimates, metrics, instrumentation |
| [`08-ops/`](08-ops/) | Environments, CI/CD, backups, monitoring, security, privacy |
| [`09-client/`](09-client/) | SOW, quote, meeting notes, sign-offs |

---

## The thesis in four lines

1. **The gap:** news tells you what happened, charts tell you what prices did — nothing credible tells you what *this kind of event* has historically done to *these instruments*, with what hit rate.
2. **The wedge:** Indian traders, at 07:30 IST, with an **Overnight Bridge** that explains the open and then **scores itself at 09:16 every day.**
3. **The moat:** a compounding Event→Outcome corpus and a **permanent public Accuracy Ledger.** Features are copyable in six weeks. A three-year scored track record is copyable only by someone who started three years ago.
4. **The constraint:** analytics, never advice — enforced in the schema, the prompts and CI, not in a footer disclaimer.

---

## Working agreement

- Every irreversible technical choice gets an **ADR** in [`04-architecture/adr/`](04-architecture/adr/).
- Every decision of any kind gets a line in [`decisions.md`](decisions.md) — including rejected ones, with why.
- Each doc's header carries a status: `Draft` → `In Review` → `Approved` → `Superseded`.
- Nothing in [`01-requirements/`](01-requirements/) changes without a `decisions.md` entry.
- **A change that adds scope must name what it displaces.** The plan carries no slack by design.
- Phase gates are hard. A phase ends when its **exit criteria** are met, not when its dates elapse.

---

## Running the prototype

```bash
cd web && npm install && npm run dev   # http://localhost:3000
```
A working 24-route prototype of the product. All figures are sample data — see
[`web/README.md`](web/README.md).

## Status · 12 Nov 2026

**Phase 0 not yet started.** Awaiting: team size and budget (O8), Phase 0 approval,
and counsel engagement for gates G2/G3. Open questions are tracked at the bottom of
[`decisions.md`](decisions.md).
