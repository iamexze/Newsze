# ADR-008 — Tiered LLM routing; LLMs never produce numbers

**Status:** Accepted · **Date:** 2026-11-12

## Context
At ~20k signals/day (10x on event days), naive LLM usage would dominate both cost and
latency. Separately, the Accuracy Ledger requires that every published number be
reproducible and auditable — a property a language model cannot provide.

## Decision — two rules

**Rule 1 — Tiered routing.** Every classification request is routed:
deterministic parser → **Claude Haiku 5.5** → **Claude Opus 5**, in that order.
Structured sources (macro prints, exchange files, filings) use templated parsers and never
reach a model. Haiku handles bulk unstructured tagging. Opus is reserved for high-impact,
ambiguous, or human-reviewed items. Target: **≥85% of volume never reaches the expensive
tier.** Inference is performed at **cluster level** (once per story, not once per article),
and cached by content hash.

**Rule 2 — LLMs classify, extract and summarise. They never produce a number that appears in
an Impact.** All quantitative output comes from deterministic statistical code
(analog retrieval, event-study estimation, GARCH, the ensemble and calibration layers).

## Consequences
**Positive:** cost stays within NFR-COST-01; latency budget is met because the expensive path
is rare; **every published number is reproducible from code and data**, which is what makes
the Ledger meaningful; model-provider changes do not alter our published estimates.
**Negative:** more pipeline complexity than "send everything to one model"; the routing rules
need tuning and monitoring (classification-confidence distribution shift is a monitored
signal).
**Enforcement:** code review plus a structural guarantee — the Impact schema is populated
only by the scoring service, which has no model client.
