# Instrumentation Plan

**Status:** Draft v1 · **Date:** 2026-11-12
**Rule: no feature ships un-instrumented.** A PR adding a surface without its events fails review.

---

## 1. Event naming
`object_action`, snake_case, past tense. Objects: `signal, event, impact, story, card,
analog, bridge, alert, watchlist, ledger, search, ask, paywall, subscription, session`.

## 2. Global properties (on every event)
`user_id | anon_id` · `session_id` · `tier` · `surface` · `route` · `device` · `viewport` ·
`connection` · `locale` · `tz` · `ts_client` · `ts_server` · `app_version` · `experiment_variants[]`.

## 3. Pipeline events (server, for quality + cost)
| Event | Key properties |
|---|---|
| `signal_ingested` | source_id, tier, kind, latency_ms (publish→ingest), bytes |
| `signal_normalised` | duration_ms, lang, dedupe_hit |
| `entity_resolved` | method (dict/fuzzy/llm/human), confidence, unresolved_count |
| `story_clustered` | story_id, cluster_size, new_story bool, duration_ms |
| `event_classified` | event_type, subtype, classifier_version, confidence, model_tier, tokens_in/out, cost_usd |
| `impact_computed` | instrument, horizon, method, analog_n, confidence, published, suppression_reason |
| `impact_published` | impact_id, end_to_end_latency_ms (source publish → published) |
| `item_held_for_review` | reason, queue_depth |
| `item_reviewed` | decision, reviewer_role, wait_ms |
| `impact_settled` | horizon, direction_hit, in_band68, brier, abs_error |
| `class_suppressed` / `class_restored` | event_type, horizon, calibration_error |
| `impact_withdrawn` | reason, actor_role |
| `source_silent` | source_id, expected_cadence_s, silent_for_s |

> These are the inputs to the weekly quality report **and** the per-1k-event cost dashboard
> (FR-M10-05, FR-M10-06). They are not optional.

## 4. Product events (client + server)
| Event | Key properties | Feeds |
|---|---|---|
| `card_viewed` | impact_id, event_type, instrument, confidence, surface, position | **NSM** |
| `card_expanded` | section (analogs / method / sources / why) | depth |
| `analogs_viewed` | impact_id, analog_n, scrolled_to_end | L3 |
| `story_opened` | story_id, source_count, from_surface | |
| `source_clicked` | outlet, tier, impact_id — *proves the provenance promise is used* | trust |
| `analytics_surface_viewed` | surface, instrument, dwell_ms | **NSM** |
| `bridge_viewed` | date, time_to_first_scroll_ms, sections_viewed[], **completed bool** | **L1** |
| `bridge_shared` | channel | growth |
| `bridge_scored_viewed` | error_pts, within_band — *do users check whether we were right?* | trust |
| `watchlist_modified` | action, instrument, list_size | activation |
| `alert_rule_created` | conditions_summary, threshold, channels | |
| `alert_fired` | rule_id, impact_id, channel, suppressed_reason | server |
| `alert_delivered` / `alert_opened` | latency_ms, channel | **CTR** |
| `alert_muted` | scope (instrument / type / all) | fatigue |
| `ledger_viewed` | filters, slice, from_paywall bool | trust/conversion |
| `search_performed` | mode, result_count, clicked_rank | |
| `ask_question` | tokens, cited_sources_count, refused bool, refusal_reason | |
| `paywall_hit` | gate_type (depth/timeliness/personalisation/export), surface | conversion |
| `checkout_started` / `subscription_created` / `subscription_cancelled` | plan, provider, cancel_reason | revenue |

## 5. Derived metrics (computed, not logged)
`WDS` · activation rate (signup → first `card_viewed` <120s) · pre-open session rate
(`bridge_viewed` between 07:00–09:15 IST ÷ WAU) · alert CTR · time-to-insight (session start
→ first `card_expanded` or `bridge_viewed` complete) · cost per 1k events (from pipeline
events) · end-to-end latency percentiles.

## 6. Experimentation
PostHog feature flags + experiments. Rules: one primary metric declared **before** launch ·
minimum 2-week runtime to cover a full weekly market cycle (expiry effects are real and will
otherwise poison results) · **quality metrics are guardrails on every experiment** — an
experiment that raises engagement while lowering calibration or raising alert fatigue is a
failed experiment · results logged in [`../decisions.md`](../decisions.md).

**Planned experiments:** Ledger-as-paywall vs feature-grid paywall · Impact Card variants
(point / +band / +analogs — research RQ3) · alert threshold defaults · Bridge push copy ·
onboarding single-question vs zero-question.

## 7. Privacy
No PII in analytics properties — ever · IPs truncated · session replay disabled on account,
billing and any PII surface · consent gate for marketing analytics (DPDP/GDPR) · 25-month
retention · user-level opt-out honoured in-product, not just in a policy ·
**we never sell or share behavioural data. It is not a revenue line and never will be.**
