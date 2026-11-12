# User Flows

**Status:** Draft v1 · **Date:** 2026-11-12
Each flow names the loop it serves (L1 morning ritual · L2 interrupt · L3 study) and its
success metric.

---

## Flow 1 — The Morning Ritual (L1) ⭐ *the most important flow in the product*

**Success metric:** user reaches "informed" state in **< 4 minutes**, ≥10 days per month.

```
07:30 IST  PUSH: "Nifty indicated −0.6% · Fed surprise is the driver"
    │
    ├── taps notification ──────────────▶ /today (Bridge mode)
    │                                          │
    │   ┌──────────────────────────────────────┴────────────────────────┐
    │   │ ① EXPECTED OPEN            Nifty 24,310 (−0.62%)  cone ±0.4%  │ ◀ 5 sec
    │   │ ② WHY (waterfall)          US −38 · crude −12 · INR +9 · ...  │ ◀ 20 sec
    │   │ ③ TOP 3 EVENTS             each with an Impact Card           │ ◀ 90 sec
    │   │ ④ KEY LEVELS               max pain, high-OI strikes, VWAP    │ ◀ 30 sec
    │   │ ⑤ YOUR WATCHLIST           3 names with overnight events      │ ◀ 45 sec
    │   │ ⑥ YESTERDAY WE SAID…       scored result of the last Bridge   │ ◀ 10 sec  ← trust
    │   └───────────────────────────────────────────────────────────────┘
    │                                          │
    │                     ┌────────────────────┼────────────────────┐
    │                     ▼                    ▼                    ▼
    │              tap an event         tap a waterfall       tap a watchlist
    │              → Impact Card        component → the       name → /ticker
    │              → analogs            driver's detail
    │                     │
    └─────────────────────┴──▶ 09:16 IST  PUSH: "Open was 24,338 — we were 28 pts off (within cone)"
                                              │
                                              ▼
                                   Trust compounds. Habit forms.
                                   ↳ measured as: next-day Bridge open rate
```

**Design requirements derived from this flow**
- The entire ① + ② block must render **above the fold on a 6.1" phone**, no scroll.
- Zero blocking interactions before value — no login wall on the Bridge (logged-out users see it with a soft prompt for personalisation).
- Offline-tolerant: the 07:30 payload is cached; a user on a weak connection still reads it.
- ⑥ is never hidden, never cherry-picked, even on a bad miss. **Especially on a bad miss.**

---

## Flow 2 — The Interrupt (L2)

**Success metric:** alert→open CTR > 35%; median alert→comprehension < 45s.

```
Event ingested ──▶ classified ──▶ Impact computed ──▶ affects a watched instrument?
                                                            │
                                      ┌─────────────────────┴──────────────┐
                                      │ |expected_move| ≥ user threshold?  │
                                      │ AND confidence ≥ gate              │
                                      │ AND not deduped within window      │
                                      │ AND outside quiet hours            │
                                      └─────────────────────┬──────────────┘
                                                      yes   │   no → silent, appears in digest
                                                            ▼
                               PUSH / web push / email / WhatsApp
                               "HDFCBANK: RBI eases risk weights.
                                Similar events: +1.4% median (n=19, 68% up)"
                                                            │
                                                  tap ──────┴──────▶ Impact Card (full)
                                                                          │
                              ┌───────────────────────────────┬───────────┴─────────────┐
                              ▼                               ▼                         ▼
                        "Show analogs"                 "Read the story"            /ticker page
                        19 past events, dated,         timeline, 11 sources,       price, OI, events
                        each clickable, fan chart      tier badges, link-outs      peers, filings
                              │
                              ▼
                        user forms their own view  ← *we never close this loop with an action*
```

**Dedupe & fatigue rules (product-critical):** max 1 alert per instrument per 30 min; max
N/day per user (default 5, user-settable); a developing story updates the existing alert
rather than firing a new one; every alert carries a one-tap "less like this".

---

## Flow 3 — The Study session (L3)

**Success metric:** ≥1 session/week among Pro users; strongest predictor of renewal.

```
/today ──▶ /india/derivatives/oi ──▶ "Bank Nifty: short build-up, 94th percentile"
                                              │
                                              ├──▶ "when has this happened before?"
                                              │         ▼
                                              │    /analogs → 23 analogs, fan chart,
                                              │    regime-concentration warning
                                              │
                                              ├──▶ related events rail → story
                                              └──▶ /track-record filtered to this event class
                                                        ▼
                                              "our 1d calls on this class: 61% (n=140)"
                                                        ▼
                                              user calibrates their trust  ← the real product
```

---

## Flow 4 — First run / activation

**Success metric:** signup → first Impact Card viewed in **< 120 seconds**; ≥60% create a watchlist in session 1.

```
Landing ──▶ live wire visible immediately (no wall) ──▶ taps any Impact Card
   │                                                          │
   │                                      ┌───────────────────┴──────────────────┐
   │                                      │ Card renders FULLY. Value first.     │
   │                                      │ Soft prompt only after the 3rd card  │
   │                                      └───────────────────┬──────────────────┘
   ▼                                                          ▼
"Get the 07:30 open briefing" ──▶ email/Google/phone OTP ──▶ ONE question:
                                                              "Which do you trade?"
                                                     [Nifty/BankNifty] [Stocks] [Global] [All]
                                                              │
                                                              ▼
                                               pre-seeded watchlist + sensible alert defaults
                                                              ▼
                                               "Your first briefing arrives tomorrow 07:30"
                                                              ▼
                                               ⚡ immediately show *yesterday's* Bridge, scored
                                                  ← proof before the wait. Removes the 1-day
                                                    activation gap that would kill retention.
```

**Rule: no onboarding carousel.** No 5-step wizard. One question, one tap, done.

---

## Flow 5 — Free → Pro conversion

**Success metric:** free→paid 4–6% within 90 days; paywall-hit→checkout-start > 12%.

```
Natural usage ──▶ paywall moment (one of three, chosen by behaviour)
                        │
   ┌────────────────────┼─────────────────────┬──────────────────────┐
   ▼                    ▼                     ▼                      ▼
 Depth gate          Timeliness gate      Personalisation gate   Export gate
 "6th Impact Card    "Real-time OI is     "Alert thresholds      "CSV/PDF export
  today"              Pro; you're seeing   and >3 watchlists      is Pro"
                      EOD"                 are Pro"
   │                    │                     │                      │
   └────────────────────┴──────────┬──────────┴──────────────────────┘
                                   ▼
          Paywall shows: THE LEDGER. Not a feature list — the track record.
          "Here's what our calls on your instruments did over 12 months."
                                   ▼
                        Razorpay (INR) / Stripe (intl)  ──▶  Pro active
                                   ▼
                        Immediate win: enable their first real alert in-flow
```

> **The paywall sells the Ledger, not the feature list.** Features are claims; the Ledger is
> evidence. This is the conversion thesis and it should be A/B tested against a conventional
> feature-grid paywall in Phase 6.

---

## Flow 6 — Editorial safety (internal, OPS)

```
Event classified ──▶ risk rules
                        │
        ┌───────────────┼────────────────┐
        ▼               ▼                ▼
  impact > X σ    confidence < Y    source tier = T4
        └───────────────┼────────────────┘
                        ▼
                 HOLD → review queue (SLA: 4 min during market hours)
                        │
        ┌───────────────┼───────────────┬──────────────┐
        ▼               ▼               ▼              ▼
     approve         approve         suppress       escalate
                   w/ edit          (logged)
                        ▼
                    PUBLISH
                        │
                   ┌────┴────┐
                   ▼         ▼
            auto-settle   KILL SWITCH (any time, any user with the role)
            at horizons        ▼
                   ▼      public withdrawal notice + reason (append-only)
             Accuracy Ledger
```
