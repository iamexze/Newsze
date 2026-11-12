"""
Real-data adapter for Spike S3.

Drop in a CSV of real events joined to realised forward returns and run:
    python3 run_spike.py --real events.csv

CSV columns (header required):
    event_id, t, etype, instrument,
    surprise_z, novelty, vix, trend, breadth, dxy_chg, crude_chg,
    days_to_expiry, iv_pct, flow_regime,
    fwd_1d, fwd_5d

CRITICAL -- how `t` and the features must be built, or the result is a lie:

  t            Integer TRADING-DAY index, ordered by INGEST TIME (when we learned
               of the event), not event time. Ordering by event time leaks the
               future into the training set.

  features     Every feature must be computable from data available STRICTLY
               BEFORE the event's ingest time. The three that are routinely got
               wrong:
                 - index membership (use point-in-time, not today's constituents)
                 - consensus figures (use the pre-release consensus, not revised)
                 - fundamentals (use as-reported, not restated)

  fwd_*        Realised return over the horizon, measured from the first price
               at which the information could ACTUALLY have been acted on --
               not the close before the event. For an 18:30 UTC Fed decision and
               an Indian instrument, that is the next day's open, not yesterday's
               close.

  universe     Include delisted and merged instruments. Excluding them is
               survivorship bias and will inflate every result.
"""
import csv
from synth import Event, FEATURES


def load_csv(path):
    events = []
    with open(path, newline="", encoding="utf-8") as fh:
        for i, row in enumerate(csv.DictReader(fh), 2):
            try:
                feats = {f: float(row[f]) for f in FEATURES}
                ev = Event(row["event_id"], int(row["t"]), row["etype"],
                           row.get("instrument", "NA"), feats)
                ev.fwd = {"1d": float(row["fwd_1d"]),
                          "5d": float(row.get("fwd_5d", row["fwd_1d"]))}
                events.append(ev)
            except (KeyError, ValueError) as e:
                raise SystemExit(f"row {i}: {e}\nSee the docstring in adapters.py "
                                 "for the required columns and their definitions.")
    if not events:
        raise SystemExit("no rows loaded")
    _sanity(events)
    return events


def _sanity(events):
    """Checks that catch the three mistakes that silently invalidate a backtest."""
    warn = []
    ts = [e.t for e in events]
    if max(ts) - min(ts) < 500:
        warn.append(f"only {max(ts)-min(ts)} trading days of history -- "
                    "far too short for a credible walk-forward test")
    by_type = {}
    for e in events:
        by_type[e.etype] = by_type.get(e.etype, 0) + 1
    thin = {k: v for k, v in by_type.items() if v < 300}
    if thin:
        warn.append(f"thin classes (will be underpowered): {thin}")
    rets = [e.fwd["1d"] for e in events]
    m = sum(rets) / len(rets)
    if abs(m) > 0.002:
        warn.append(f"mean 1d forward return is {m:+.4f} -- suspiciously large. "
                    "Check you are not measuring from the pre-event close")
    zero = sum(1 for r in rets if r == 0)
    if zero > len(rets) * 0.05:
        warn.append(f"{zero} events have exactly zero forward return -- "
                    "likely missing price data, not genuine flat days")
    if warn:
        print("\n  !! DATA WARNINGS")
        for w in warn:
            print(f"     - {w}")
        print()
