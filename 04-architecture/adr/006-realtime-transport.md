# ADR-006 — SSE as the primary realtime transport

**Status:** Accepted · **Date:** 2026-11-12

## Context
The live wire, price strips and alerts must update without a refresh. Traders keep the app
open for hours on a second monitor, and on Indian mobile networks that often means passing
through aggressive proxies with unreliable connectivity.

## Options
1. **Polling** — simple, but 3s freshness at scale is wasteful and still feels laggy.
2. **WebSocket** — bidirectional, lowest latency, but needs its own reconnect/backoff/heartbeat
   logic and is more often blocked by corporate proxies.
3. **SSE** — one-directional server→client over plain HTTP; **automatic reconnection and
   `Last-Event-ID` resume are built into the browser**; proxy-friendly; trivially
   CDN/load-balancer compatible.
4. **A realtime vendor (Pusher/Ably)** — fastest to ship, ongoing per-connection cost,
   another dependency in the critical path.

## Decision
**SSE as the primary transport.** Our feed is overwhelmingly one-directional. WebSocket is
reserved for genuinely bidirectional surfaces (the Phase 7 Terminal workspace).

## Consequences
**Positive:** browser-native reconnection with gap backfill via `Last-Event-ID` (directly
satisfies FR-M1-08); works through proxies; simpler server implementation; no vendor cost.
**Negative:** HTTP/1.1 connection limits per domain (mitigated by HTTP/2, which we serve);
no client→server channel on the same connection (fine — those are ordinary HTTP calls).
**Scale note:** a dedicated SSE gateway fleet is planned for Phase 6; long-lived connections
are the main constraint on serving-layer scaling.
