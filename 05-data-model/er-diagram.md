# ER Diagram

**Status:** Draft v1 · **Date:** 2026-11-12
Mermaid source below renders to `er-diagram.png` via
`npx -y @mermaid-js/mermaid-cli -i er-diagram.mmd -o er-diagram.png`.
Field-level detail in [`entities.md`](entities.md).

---

## 1. The spine — how the five core objects connect

```
   ┌──────────┐  n:1  ┌──────────┐
   │  SOURCE  │◀──────│  SIGNAL  │  raw, immutable, append-only
   └──────────┘       └────┬─────┘
                           │ n:1
                           ▼
                     ┌──────────┐  1:n   ┌───────────────┐
                     │  STORY   │───────▶│ STORY_SOURCE  │ (tier, stance)
                     └────┬─────┘        └───────────────┘
                          │ 1:n
                          ▼
                    ┌───────────┐  n:m   ┌─────────────┐
                    │   EVENT   │◀──────▶│   ENTITY    │ org/person/country/theme
                    └─────┬─────┘        └──────┬──────┘
                          │ 1:n                 │ 1:n
                          ▼                     ▼
                    ┌───────────┐         ┌──────────────┐
                    │  IMPACT   │────────▶│  INSTRUMENT  │
                    └─────┬─────┘  n:1    └──────┬───────┘
                          │ 1:1                  │ 1:n
                          ▼                      ▼
                    ┌───────────┐         ┌──────────────────────────────┐
                    │  OUTCOME  │         │ PRICE_OHLCV · DERIV_OI · IV  │
                    └─────┬─────┘         │ FLOWS · FUNDAMENTALS         │
                          │ 1:1           └──────────────────────────────┘
                          ▼
                 ┌────────────────┐
                 │ LEDGER_ENTRY   │  public, append-only, never deleted
                 └────────────────┘
```

## 2. Full mermaid source

```mermaid
erDiagram
    SOURCE ||--o{ SIGNAL : emits
    SOURCE {
        uuid id PK
        text name
        text kind "wire|rss|exchange|filing|macro|price|social"
        smallint tier "0-4"
        text licence_status "licensed|public|forbidden"
        text parser
        int  expected_cadence_s
        bool enabled
    }
    SIGNAL ||--o{ STORY_SIGNAL : groups_into
    SIGNAL {
        uuid id PK
        uuid source_id FK
        text raw_uri "object store pointer - immutable"
        text checksum UK
        timestamptz event_time
        timestamptz publish_time
        timestamptz ingest_time "PIT key - all backtests filter on this"
        text lang
        jsonb normalised
    }
    STORY ||--o{ STORY_SIGNAL : contains
    STORY ||--o{ EVENT : yields
    STORY {
        uuid id PK
        text slug
        text canonical_headline
        text canonical_dek
        vector embedding "pgvector 768"
        timestamptz first_seen
        timestamptz last_updated
        int source_count
        numeric stance_spread
    }
    EVENT ||--o{ EVENT_ENTITY : references
    EVENT ||--o{ IMPACT : predicts
    EVENT {
        uuid id PK
        uuid story_id FK
        text type "taxonomy v-n"
        text subtype
        jsonb magnitude
        jsonb consensus
        numeric surprise_z
        numeric novelty
        text certainty "rumoured|reported|confirmed|denied"
        text scope
        int  taxonomy_version
        vector context_vector "pgvector - analog retrieval"
        timestamptz as_of
        timestamptz ingest_time
    }
    ENTITY ||--o{ EVENT_ENTITY : linked_by
    ENTITY ||--o{ ENTITY_ALIAS : known_as
    ENTITY ||--o{ INSTRUMENT : issues
    ENTITY {
        uuid id PK
        text kind "org|person|country|commodity|policy_body|sector|theme"
        text canonical_name
        text isin
        jsonb sectors
        jsonb identifiers
    }
    INSTRUMENT ||--o{ IMPACT : is_about
    INSTRUMENT ||--o{ PRICE_OHLCV : has
    INSTRUMENT ||--o{ DERIV_OI : has
    INSTRUMENT ||--o{ INDEX_MEMBERSHIP : member_of
    INSTRUMENT {
        text id PK "EXCH:SYMBOL"
        uuid entity_id FK
        text exchange
        text symbol
        text asset_class
        text currency
        numeric tick_size
        int lot_size
        bool is_active "delisted retained - no survivorship bias"
    }
    IMPACT ||--|| OUTCOME : settled_by
    IMPACT {
        uuid id PK
        uuid event_id FK
        text instrument_id FK
        text horizon "15m|1h|1d|5d|20d"
        numeric expected_move_pct
        numeric band68_lo
        numeric band68_hi
        numeric band95_lo
        numeric band95_hi
        numeric prob_up
        numeric confidence
        int analog_n
        numeric analog_hit_rate
        text method
        text model_version
        bool published
        bool withdrawn
        timestamptz created_at
    }
    OUTCOME ||--|| LEDGER_ENTRY : scores
    OUTCOME {
        uuid id PK
        uuid impact_id FK
        numeric realised_move_pct
        numeric abnormal_move_pct
        bool direction_hit
        bool in_band68
        bool in_band95
        numeric brier
        timestamptz settled_at
    }
    LEDGER_ENTRY {
        uuid id PK
        uuid outcome_id FK
        text event_type
        text instrument_id
        text horizon
        text model_version
        bool counted "false only if withdrawn pre-horizon - reason required"
        text withdrawal_reason
        timestamptz created_at
    }
    USER ||--o{ WATCHLIST : owns
    USER ||--o{ ALERT_RULE : defines
    USER }o--|| ORGANISATION : belongs_to
    USER {
        uuid id PK
        uuid org_id FK
        citext email UK
        text role
        text tier
        jsonb prefs "tz, number_format, direction_palette"
        timestamptz created_at
    }
    WATCHLIST ||--o{ WATCHLIST_ITEM : contains
    ALERT_RULE ||--o{ ALERT_DELIVERY : fires
    ALERT_RULE {
        uuid id PK
        uuid user_id FK
        jsonb conditions
        numeric impact_threshold
        text[] channels
        jsonb quiet_hours
        int dedupe_window_s
    }
    MARKET_STATE {
        date as_of PK
        text market "IN|US|EU|GLOBAL"
        vector features "pgvector 80 - Analog Engine B"
        jsonb regime_labels
    }
    NARRATIVE ||--o{ NARRATIVE_MENTION : measured_by
    NARRATIVE {
        uuid id PK
        text label
        vector embedding
    }
```

## 3. Store placement

| Table group | Store | Why |
|---|---|---|
| `source`, `signal` (metadata), `story`, `event`, `impact`, `outcome`, `ledger_entry`, `entity`, `instrument`, `user`, `watchlist`, `alert_*` | **Postgres 17** | Relational integrity, transactions, the ledger's append-only guarantees |
| `signal.raw` payloads | **R2 object store** | Immutable, cheap, replayable (commitment C1) |
| `story.embedding`, `event.context_vector`, `market_state.features`, `narrative.embedding` | **pgvector (HNSW)** | Co-located with relational data; one fewer system |
| `price_ohlcv`, `price_tick`, `deriv_oi`, `iv_surface`, `flows` | **TimescaleDB hypertables** | Compression + time-bucket queries; → ClickHouse at tick scale ([ADR-005](../04-architecture/adr/005-timeseries-store.md)) |
| search documents | **Typesense** | Full-text + facets |
| hot reads, alias dictionary, dedupe windows | **Redis** | |

## 4. Invariants enforced in the schema itself

| # | Invariant | Mechanism |
|---|---|---|
| S1 | `signal` is append-only | No UPDATE/DELETE grant for any application role; `ingest_time` defaults to `now()` and is immutable |
| S2 | Every published `impact` traces to ≥1 `signal` | FK chain impact→event→story→story_signal→signal, enforced by a trigger on publish |
| S3 | `outcome` and `ledger_entry` have no DELETE path | Revoked at the role level; `withdrawn` is a flag on `impact`, never a deletion |
| S4 | No `action`/`recommendation` column exists anywhere | Compliance boundary (I4). CI schema-diff test asserts it stays absent |
| S5 | Backtests cannot see the future | All training reads go through a PIT view filtered on `ingest_time <= as_of`; direct table access blocked in CI |
| S6 | Delisted instruments are retained | `is_active = false`, never deleted — prevents survivorship bias |
| S7 | Index membership is time-ranged | `index_membership(valid_from, valid_to)` — point-in-time correct |
