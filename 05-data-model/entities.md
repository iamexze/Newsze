# Entities — Field-Level Specification

**Status:** Draft v1 · **Date:** 2026-11-12
Conventions: `id` = UUIDv7 (time-sortable) unless stated · all timestamps `timestamptz`
stored UTC · money/prices `numeric(20,6)` — **never float** · percentages stored as decimal
fractions (`0.0041` = 0.41%) and formatted at render.

---

## 1. `sources`
| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | uuid | PK | |
| `name` | text | NOT NULL, UNIQUE | "Reuters Top News" |
| `kind` | enum | NOT NULL | `wire · rss · exchange · filing · macro · price · social · vendor` |
| `tier` | smallint | NOT NULL, 0–4 | T0 primary … T4 social |
| `base_url` | text | | |
| `auth_ref` | text | | Secret-manager key, **never the credential** |
| `parser` | text | NOT NULL | Registered parser id |
| `expected_cadence_s` | int | | Drives the "source silent" alert (FR-M10-01) |
| `licence_status` | enum | NOT NULL | `licensed · public · fair_use · forbidden` |
| `licence_ref` | text | | Contract/clause pointer |
| `redistributable` | bool | NOT NULL DEFAULT false | **Gate G1.** Governs API serialisation |
| `latency_class` | enum | NOT NULL | `realtime · delayed_15m · eod` |
| `tos_url`, `tos_reviewed_at` | text, timestamptz | | Compliance audit trail |
| `enabled` | bool | DEFAULT true | |

> A source with `licence_status = forbidden` cannot be enabled — enforced by a CHECK constraint.

## 2. `signals` — raw, immutable
| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | uuid | PK | |
| `source_id` | uuid | FK → sources | |
| `raw_uri` | text | NOT NULL | R2 pointer to the untouched payload |
| `checksum` | text | NOT NULL, UNIQUE | sha256 — the dedupe key |
| `external_id` | text | | Source's own id, when it has one |
| `url` | text | | Canonical link-out |
| `title` | text | | |
| `body` | text | | **Internal analysis only — never rendered publicly** (FR-M1-06) |
| `lang` | text | | BCP-47 |
| `event_time` | timestamptz | | When the thing happened |
| `publish_time` | timestamptz | | When the source said it |
| `ingest_time` | timestamptz | NOT NULL DEFAULT now() | **The PIT key. Immutable.** |
| `normalised` | jsonb | | Stage ② output |
| `entity_links` | jsonb | | Stage ③ output: resolved ids + confidence |

Indexes: `(source_id, ingest_time DESC)`, `(ingest_time DESC)`, GIN on `normalised`.
**Grants: INSERT + SELECT only. No UPDATE, no DELETE, for any application role.**

## 3. `stories`
| Field | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `slug` | text | URL slug; may change, `id` never does |
| `canonical_headline` | text | ≤85 chars, our words ([content-design.md](../03-design/content-design.md)) |
| `canonical_dek` | text | ≤160 chars |
| `summary_bullets` | jsonb | ≤3 bullets, each with `citation: signal_id` |
| `embedding` | vector(768) | HNSW index, clustering + retrieval |
| `first_seen`, `last_updated` | timestamptz | |
| `source_count` | int | Denormalised for display ("23 sources") |
| `max_tier` | smallint | Best (lowest) tier in the cluster |
| `stance_spread` | numeric | Disagreement across sources |
| `status` | enum | `active · dormant · merged` (+ `merged_into_id`) |

## 4. `story_signals` (m:n)
`story_id`, `signal_id`, `role` (`canonical · supporting · duplicate · contradicting`),
`stance` (−1..1), `added_at`. PK `(story_id, signal_id)`.

## 5. `events`
| Field | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `story_id` | uuid FK | |
| `type`, `subtype` | text | From [`event-taxonomy.yaml`](event-taxonomy.yaml) |
| `taxonomy_version` | int | So old events remain interpretable after taxonomy changes |
| `actors` | text[] | Entity ids |
| `magnitude` | jsonb | `{value, unit}` — unit is **mandatory** |
| `consensus` | jsonb | `{value, unit, source, n_forecasters}` nullable |
| `surprise_z` | numeric | Standardised surprise. **The most predictive field** |
| `surprise_direction` | enum | `beat · miss · inline · na` |
| `novelty` | numeric | 0–1 |
| `certainty` | enum | `rumoured · reported · confirmed · denied` |
| `scope` | enum | `global · region · country · sector · single_name` |
| `context_vector` | vector(128) | Event features + market regime → analog retrieval |
| `as_of` | timestamptz | |
| `ingest_time` | timestamptz | PIT key |
| `classifier_version`, `classifier_confidence` | text, numeric | |
| `review_state` | enum | `auto · held · approved · edited · suppressed` |

CHECK: `certainty='rumoured'` ⇒ no published impacts (enforced by trigger).
CHECK: source tier 4 ⇒ `certainty IN ('rumoured','denied')`.

## 6. `event_entities` (m:n)
`event_id`, `entity_id`, `role` (`actor · subject · affected · mentioned`),
`confidence`, `resolver` (`dict · fuzzy · llm · human`). PK `(event_id, entity_id, role)`.

## 7. `entities`
`id` · `kind` (`org · person · country · commodity · currency · policy_body · sector · theme`) ·
`canonical_name` · `isin` · `lei` · `cin` (India) · `country` · `sectors jsonb` (GICS + NSE) ·
`identifiers jsonb` (exchange codes, ADR tickers, Wikidata) · `peer_set uuid[]` ·
`supply_chain jsonb` · `created_at`.

## 8. `entity_aliases`
`entity_id` · `alias` · `lang` · `source` (`seed · learned · human`) · `confidence` ·
`verified_at`. Unique `(alias, lang)`. **Mirrored into Redis** as the stage-③ hot dictionary.

## 9. `instruments`
| Field | Type | Notes |
|---|---|---|
| `id` | text PK | `NSE:HDFCBANK`, `NASDAQ:AAPL` — exchange-qualified |
| `entity_id` | uuid FK | |
| `exchange`, `symbol` | text | |
| `asset_class` | enum | `equity · index · future · option · fx · commodity · bond · crypto · etf` |
| `currency` | char(3) | ISO-4217, **always explicit** |
| `tick_size`, `lot_size` | numeric, int | |
| `is_active` | bool | **Delisted rows are retained** (S6) |
| `listed_on`, `delisted_on` | date | |
| `underlying_id` | text FK | For derivatives |
| `expiry`, `strike`, `option_type` | date, numeric, enum | For F&O |

## 10. `index_membership`
`index_id` · `instrument_id` · `weight` · `valid_from` · `valid_to`.
**Time-ranged** — the single most-forgotten source of look-ahead bias (S7).

## 11. `impacts`
| Field | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `event_id` | uuid FK | |
| `instrument_id` | text FK | |
| `horizon` | enum | `15m · 1h · 1d · 5d · 20d` |
| `expected_move_pct` | numeric(10,6) | Decimal fraction |
| `band68_lo/hi`, `band95_lo/hi` | numeric | |
| `prob_up` | numeric | 0–1 |
| `vol_response_iv_pts` | numeric | nullable |
| `confidence` | numeric | 0–1, **calibrated** |
| `analog_n` | int | |
| `analog_hit_rate`, `analog_median_move` | numeric | |
| `analog_ids` | uuid[] | The evidence, clickable in the UI |
| `analog_regime_concentration` | numeric | Drives the FR-M2-06 warning |
| `method` | text | `ensemble:analog0.6|stat0.25|ml0.15` |
| `model_version` | text | |
| `published` | bool | False when the publication gate suppresses it |
| `suppression_reason` | text | `thin_analogs · calibration · tier · manual` |
| `withdrawn`, `withdrawn_at`, `withdrawn_reason`, `withdrawn_by` | bool, ts, text, uuid | |
| `created_at` | timestamptz | |

**There is no `action`, `recommendation`, `target_price` or `stop_loss` column. A CI test
asserts these column names never appear in any migration.** (Invariant I4.)

## 12. `outcomes`
`id` · `impact_id` (UNIQUE) · `realised_move_pct` · `abnormal_move_pct` (market-model
adjusted) · `benchmark_id` · `direction_hit bool` · `in_band68 bool` · `in_band95 bool` ·
`abs_error` · `brier` · `realised_vol_change` · `settled_at` · `settlement_data_source`.
**INSERT + SELECT only. Immutable. Computed solely by the `system` role.**

## 13. `ledger_entries`
Denormalised, query-optimised projection of outcomes for `/track-record`:
`id` · `outcome_id` · `event_type` · `subtype` · `instrument_id` · `asset_class` ·
`horizon` · `model_version` · `confidence_bucket` · `direction_hit` · `in_band68` ·
`brier` · `counted bool` · `created_at`.
`counted=false` only where an impact was withdrawn before its horizon elapsed — and the
withdrawal reason is displayed. **No DELETE grant.**

## 14. Market data (TimescaleDB hypertables)
| Table | Key | Fields |
|---|---|---|
| `price_ohlcv` | `(instrument_id, bucket, interval)` | o/h/l/c/v, vwap, `latency_class`, `source_id` |
| `price_tick` | `(instrument_id, ts)` | ltp, bid, ask, qty *(Phase 5+, licence-gated)* |
| `deriv_oi` | `(instrument_id, ts)` | oi, oi_change, price_change, `buildup_class`, volume |
| `option_chain` | `(underlying, expiry, strike, ts)` | ce_oi, pe_oi, ce_iv, pe_iv, ce_ltp, pe_ltp |
| `iv_metrics` | `(instrument_id, ts)` | atm_iv, iv_rank, iv_percentile, skew_25d, term_slope |
| `flows` | `(market, segment, participant, date)` | buy_value, sell_value, net_value |
| `participant_oi` | `(participant, instrument_type, date)` | FII/DII/Pro/Client long & short |
| `fundamentals` | `(entity_id, period, metric)` | value, `reported_at` *(SCD — PIT correct)* |
| `macro_series` | `(series_id, period)` | value, consensus, prior, revised, `released_at` |

Every market-data row carries `source_id` and `latency_class`. **No row without provenance.**

## 15. `market_states` (Analog Engine B)
`as_of date` · `market` · `features vector(80)` · `feature_manifest_version` ·
`regime_labels jsonb`. One row per market per day. The feature manifest is versioned so a
vector built in 2027 is never silently compared against one built in 2026.

## 16. User-side
| Table | Key fields |
|---|---|
| `organisations` | `id`, `name`, `tier`, `seats`, `billing_ref`, `sso_config` |
| `users` | `id`, `org_id`, `email` (citext), `phone`, `role`, `tier`, `prefs jsonb` (tz, number_format `lakh_crore|western`, `direction_palette western|east_asian`, theme), `created_at`, `deleted_at` |
| `watchlists` | `id`, `user_id`, `org_id`, `name`, `is_shared`, `position` |
| `watchlist_items` | `watchlist_id`, `instrument_id`/`entity_id`, `added_at` |
| `alert_rules` | `id`, `user_id`, `conditions jsonb`, `impact_threshold`, `channels text[]`, `quiet_hours jsonb`, `dedupe_window_s`, `enabled` |
| `alert_deliveries` | `id`, `rule_id`, `impact_id`, `channel`, `sent_at`, `delivered_at`, `opened_at`, `suppressed_reason` |
| `subscriptions` | `id`, `user_id`/`org_id`, `plan`, `provider` (`razorpay`/`stripe`), `provider_ref`, `status`, `current_period_end`, `gst_details jsonb` |
| `audit_log` | `id`, `actor_id`, `actor_role`, `action`, `target_type`, `target_id`, `before jsonb`, `after jsonb`, `reason`, `ip`, `at` — **append-only** |

## 17. Retention
| Data | Retention | Why |
|---|---|---|
| `signals` raw payloads | 7 years | The corpus is the moat; also a compliance record |
| prices / OI / flows | indefinite | Historical depth is the product |
| `impacts` / `outcomes` / `ledger_entries` | **indefinite, never deleted** | The Ledger's entire credibility |
| product analytics events | 25 months | YoY comparison + privacy minimisation |
| application logs | 90 days | |
| `audit_log` | 7 years | |
| user PII after account deletion | purged ≤30 days; anonymised analytics retained | DPDP / GDPR |
