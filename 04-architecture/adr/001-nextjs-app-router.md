# ADR-001 — Next.js App Router for the web application

**Status:** Accepted · **Date:** 2026-11-12 · **Deciders:** Eng lead, Product

## Context
We need SEO-indexable news pages (story pages, ticker pages, dated Bridge archives are a
primary growth loop), sub-60s index freshness on breaking stories, data-dense dashboards
that must stay fast on mid-tier Android over 4G, and realtime surfaces.

## Options
1. **Next.js App Router (RSC + ISR)** — SSR/ISR built in, server components keep heavy data
   off the client, one framework for marketing, content and app.
2. **SPA (Vite + React) + separate SSR service** — maximum client control, but SEO becomes a
   second system to build and maintain.
3. **Remix** — excellent data loading, smaller ecosystem for our ISR-heavy needs.
4. **Astro + React islands** — superb for content, awkward for a realtime dashboard app.

## Decision
**Next.js 15, App Router, React Server Components.** ISR for public content with ≤60s
revalidation; client components only where interactivity demands it.

## Consequences
**Positive:** SEO and app in one codebase; ISR gives fresh-but-cached news pages; RSC keeps
data-heavy pages light; large hiring pool.
**Negative:** App Router has sharp edges around caching semantics — we will hit them; some
coupling to Vercel's ergonomics (mitigated: we can self-host Next).
**Risks:** over-using client components would erase the benefit. **Mitigation:** a bundle
budget enforced in CI, and client components require justification in review.
