# API Endpoints & Contracts

**Status:** Draft v1 · **Date:** 2026-11-12
Two surfaces: the **internal BFF** (tRPC, consumed by our own web app) and the **public REST
API** (M11, Phase 7, B2B). This document specifies the public contract; the BFF mirrors it
with richer, UI-shaped payloads.

Base: `https://api.newze.com/v1` · Auth: `Authorization: Bearer <key>` ·
All timestamps ISO-8601 UTC · All percentages decimal fractions · All money objects
`{value, currency}`.

---

## 1. Conventions

**Response envelope** (every response, success or error):
```jsonc
{
  "data": { },
  "meta": {
    "request_id": "req_01JC...",
    "as_of": "2026-11-12T09:14:22Z",
    "latency_class": "eod",             // realtime | delayed_15m | eod — per the licence
    "entitlement": "api_dev",
    "model_version": "impact-v1.4.2",   // when the payload contains impacts
    "disclaimer": "Information and statistical analysis only. Not investment advice."
  },
  "pagination": { "cursor": "...", "has_more": true, "limit": 50 }
}
```
**Errors:** RFC 7807 problem+json. `400` validation · `401` auth · `402` quota/entitlement
(with `upgrade_url`) · `403` forbidden · `404` · `409` conflict · `422` semantic · `429`
rate limit (`Retry-After`) · `5xx` with `request_id`.

**Pagination:** cursor-based only. Offset pagination is not offered — the feed mutates.
**Idempotency:** `Idempotency-Key` honoured on all POSTs.
**Versioning:** URL major version; additive changes only within a version; deprecations
announced ≥180 days ahead with `Sunset` headers.

---

## 2. Events

### `GET /events`
| Param | Type | Notes |
|---|---|---|
| `type` | csv | taxonomy types, e.g. `RATE_DECISION,CPI` |
| `instrument` | csv | `NSE:HDFCBANK,NASDAQ:AAPL` |
| `entity` | csv | entity ids |
| `country`, `asset_class`, `scope` | csv | |
| `min_tier` | int | default 3 — tier 4 excluded unless explicitly requested |
| `certainty` | csv | default `confirmed,reported` |
| `since`, `until` | ts | on `ingest_time` (PIT-correct by default) |
| `has_impact` | bool | |
| `limit`, `cursor` | | max 200 |

```jsonc
{ "data": [{
  "event_id": "evt_01JC8F...",
  "type": "RATE_DECISION", "subtype": "CUT", "taxonomy_version": 1,
  "story": { "id": "sty_01JC...", "headline": "Fed cuts 25bp, signals slower path",
             "dek": "...", "source_count": 23, "max_tier": 1,
             "url": "https://newze.com/story/..." },
  "actors": ["policy_body:US_FED"],
  "affected": ["index:NIFTY_BANK","ccy:USDINR","index:SPX","cmdty:XAU"],
  "magnitude": { "value": -25, "unit": "bp" },
  "consensus": { "value": -25, "unit": "bp", "source": "poll:reuters", "n_forecasters": 71 },
  "surprise": { "z": 1.2, "direction": "inline", "note": "path, not level" },
  "novelty": 0.31, "certainty": "confirmed", "scope": "global",
  "event_time": "2026-11-12T18:30:00Z", "ingest_time": "2026-11-12T18:30:04Z",
  "impacts_url": "/v1/events/evt_01JC8F.../impacts"
}]}
```

### `GET /events/{id}` · `GET /events/{id}/impacts` · `GET /events/{id}/signals`
`/signals` returns provenance only — source name, tier, url, timestamps, and a ≤200-char
excerpt. **Never full source text** (licensing, FR-M1-06).

---

## 3. Impacts

### `GET /impacts`
Filters: `instrument`, `event_type`, `horizon`, `min_confidence`, `min_abs_move`,
`published` (default true), `settled` (true/false/any), `since`, `until`.

```jsonc
{ "data": [{
  "impact_id": "imp_01JC...", "event_id": "evt_01JC8F...",
  "instrument": "NSE:NIFTYBANK", "horizon": "1d",
  "expected_move_pct": -0.0041,
  "band_68": [-0.0130, 0.0050], "band_95": [-0.0170, 0.0250],
  "direction_prob": { "up": 0.39, "down": 0.61 },
  "vol_response": { "iv_change_pts": 1.4 },
  "confidence": 0.61,
  "analogs": { "n": 34, "hit_rate": 0.62, "median_move": -0.0035,
               "regime_concentration": 0.26,
               "nearest": ["evt_01HX...","evt_01G9...","evt_01F2..."] },
  "method": "ensemble:analog0.6|stat0.25|ml0.15",
  "model_version": "impact-v1.4.2",
  "published": true, "withdrawn": false,
  "created_at": "2026-11-12T18:30:12Z",
  "outcome": null
}]}
```
**Suppressed impacts** (publication gate) return with `published: false` and a
`suppression_reason`; `expected_move_pct` is **null** — we do not leak a number we refused
to publish.

### `GET /impacts/{id}/analogs`
Full analog list: each with `event_id`, `date`, `similarity`, `realised_move_pct`,
`abnormal_move_pct`, plus `warnings[]` (e.g. `regime_concentration`).

---

## 4. Track record (public, unauthenticated)

### `GET /track-record`
Params: `event_type`, `instrument`, `asset_class`, `horizon`, `model_version`,
`since`, `confidence_bucket`, `group_by`.
```jsonc
{ "data": { "n": 4187, "direction_accuracy": 0.612, "band68_coverage": 0.698,
  "brier": 0.207, "calibration_error": 0.03,
  "calibration_curve": [{"predicted":0.55,"realised":0.53,"n":812}, "..."],
  "by_event_type": [{"type":"RATE_DECISION","n":412,"direction_accuracy":0.672,
                     "brier":0.184,"status":"published"},
                    {"type":"SEBI_ACTION","n":41,"status":"suppressed",
                     "suppressed_at":"2026-11-04","reason":"calibration_breach"}],
  "withdrawals": [{"impact_id":"imp_...","at":"2026-11-08","reason":"entity_misresolution"}]
}}
```
> This endpoint is **deliberately open and unauthenticated.** It is the marketing asset.
> Cells with `n < 10` return `null` rates, never a percentage.

---

## 5. Market data *(entitlement- and licence-gated — Gate G1)*

`GET /instruments` · `GET /instruments/{id}` · `GET /instruments/{id}/ohlcv`
(`interval=1m|5m|15m|1h|1d`, `from`, `to`) · `GET /instruments/{id}/oi` ·
`GET /options/chain` (`underlying`, `expiry`) · `GET /india/flows` ·
`GET /india/participants` · `GET /macro/series/{id}` · `GET /macro/calendar`.

Every response carries `meta.latency_class` and per-field `source_id`.
**Fields whose source has `redistributable = false` are removed from API responses
entirely**, regardless of tier (architectural commitment C5). The API never returns a price
the licence does not permit us to redistribute.

---

## 6. Overnight Bridge

### `GET /bridge/{date}` *(`/bridge/today` alias)*
```jsonc
{ "data": {
  "date": "2026-11-12", "published_at": "2026-11-12T02:00:00Z",
  "market": "IN", "model_version": "bridge-v0.9.1",
  "estimates": [{
    "instrument": "NSE:NIFTY50", "prev_close": 24462.10,
    "expected_open": 24310.00, "expected_gap_pct": -0.0062,
    "band_68": [24250, 24370], "band_95": [24180, 24440],
    "gap_fill_probability": 0.58, "gap_fill_n": 142,
    "confidence": 0.64 }],
  "attribution": [
    {"component":"us_close","contribution_pts":-38,"detail":"SPX -0.9%"},
    {"component":"crude","contribution_pts":-12,"detail":"Brent +2.1%"},
    {"component":"usdinr","contribution_pts":9},
    {"component":"adr_dislocation","contribution_pts":-6},
    {"component":"asia","contribution_pts":-4},
    {"component":"overnight_events","contribution_pts":-18,
     "events":["evt_01JC8F..."]},
    {"component":"residual","contribution_pts":2}],
  "key_levels": { "max_pain": 24400, "high_oi_pe": 24200,
                  "high_oi_ce": 24500, "pcr": 0.84 },
  "top_events": ["evt_01JC8F...","evt_01JC9A...","evt_01JCB2..."],
  "previous_scored": { "date":"2026-11-11", "estimated_open":24462,
                       "actual_open":24438, "error_pts":24, "within_band68":true }
}}
```

---

## 7. Search & entities
`GET /search` (`q`, `kind=story|event|entity|filing`, `mode=keyword|semantic`, filters) ·
`GET /entities/{id}` · `GET /entities/{id}/events` · `GET /entities/resolve?q=HDFC%20Bank`
(returns ranked candidates with confidence — the entity-resolution endpoint integrators ask
for most).

---

## 8. Webhooks

### `POST /webhooks` — register
```jsonc
{ "url": "https://partner.example/newze",
  "events": ["impact.published","event.classified","outcome.settled","bridge.published"],
  "filters": { "instrument": ["NSE:NIFTYBANK"], "min_abs_move": 0.005, "min_confidence": 0.55 },
  "secret": "whsec_..." }
```
Delivery: `POST` with `Newze-Signature: t=<ts>,v1=<hmac-sha256>` (sign `t.body`; reject if
`|now − t| > 300s`). At-least-once; dedupe on `delivery_id`. Retries: 1m, 5m, 30m, 2h, 12h.
Auto-disable after 24h of continuous failure, with an email. Replay available for 7 days.

**Topics:** `event.classified` · `event.updated` · `impact.published` ·
`impact.withdrawn` · `outcome.settled` · `bridge.published` · `class.suppressed` ·
`correction.issued`.

> `impact.withdrawn` and `correction.issued` are **mandatory** subscriptions for any
> integrator who displays our impacts — enforced contractually. If we retract, downstream
> must retract.

---

## 9. Streaming
`GET /stream` (SSE, `api_biz` only). Params: `topics`, `instrument`, `min_impact`.
Events: `message` (payload), `heartbeat` (15s), `rewind` via `Last-Event-ID` (5-minute buffer).
≤2s from internal publish.

---

## 10. Internal BFF (tRPC) — shape only
`feed.live` (subscription) · `feed.filtered` · `story.get` · `event.get` ·
`impact.analogs` · `bridge.today` · `india.oi` · `india.chain` · `india.participants` ·
`markets.crossAsset` · `markets.calendar` · `ledger.slice` · `watchlist.*` · `alerts.*` ·
`search.*` · `ask.query` · `billing.*` · `admin.*`.
Shares generated types with the public API — **one source of truth from the Postgres schema
and the taxonomy → Python → TypeScript.**

---

## 11. Rate limits
| Tier | REST | Streaming | Burst |
|---|---|---|---|
| anon (track-record only) | 60/min | — | 100 |
| `api_dev` | 600/min, 10k/mo | — | 1,000 |
| `api_biz` | contracted (default 6k/min) | 5 concurrent | contracted |
| internal BFF | per-user 1,200/min | 1 per session | |
Headers: `X-RateLimit-Limit`, `-Remaining`, `-Reset` on every response.
