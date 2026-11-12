"""
Synthetic market + event generator with KNOWN ground truth.

Purpose: validate that the analog harness (a) DETECTS signal where it exists and,
more importantly, (b) REPORTS NO SIGNAL where none exists. A backtest harness that
finds signal in noise is worse than useless -- it would green-light a dead product.

Ground truth is declared in SIGNAL_SPEC. Nothing downstream reads it except the
scorer, which uses it only to label the report.
"""
import random, math
from dataclasses import dataclass, field

# ---------------------------------------------------------------- ground truth
# effect: expected 1d return contribution, as a fraction, per unit of the driver.
# Realistic effect sizes: a strong macro surprise moves an index a few tenths of
# a percent on average, against ~1.1% daily vol. Signal is MEANT to be faint.
SIGNAL_SPEC = {
    "RATE_DECISION": {"driver": "surprise_z", "effect": -0.0030, "regime_amp": "vix"},
    "CPI":           {"driver": "surprise_z", "effect": -0.0022, "regime_amp": None},
    "EARNINGS":      {"driver": None,         "effect": 0.0,     "regime_amp": None},
    "MNA":           {"driver": None,         "effect": 0.0,     "regime_amp": None},
    "GEOPOLITICAL":  {"driver": None,         "effect": 0.0,     "regime_amp": None},
    "SEBI_ACTION":   {"driver": None,         "effect": 0.0,     "regime_amp": None},
}
INSTRUMENTS = ["NSE:NIFTY50", "NSE:NIFTYBANK", "NSE:HDFCBANK"]

FEATURES = ["surprise_z", "novelty", "vix", "trend", "breadth",
            "dxy_chg", "crude_chg", "days_to_expiry", "iv_pct", "flow_regime"]


@dataclass
class Event:
    event_id: str
    t: int                      # trading-day index == ingest_time ordering
    etype: str
    instrument: str
    feats: dict
    fwd: dict = field(default_factory=dict)   # horizon -> realised return


def _regime_walk(n, rng):
    """Slow-moving regime state: vix level, trend, breadth, flow."""
    vix, trend, breadth, flow = 15.0, 0.0, 0.5, 0.0
    out = []
    for _ in range(n):
        vix = max(8.0, min(45.0, vix + rng.gauss(0, 0.8) - 0.02 * (vix - 15)))
        trend = max(-1, min(1, trend * 0.97 + rng.gauss(0, 0.12)))
        breadth = max(0.05, min(0.95, breadth * 0.9 + 0.1 * (0.5 + trend * 0.3)
                                + rng.gauss(0, 0.05)))
        flow = flow * 0.93 + rng.gauss(0, 0.3)
        out.append({"vix": vix, "trend": trend, "breadth": breadth, "flow_regime": flow})
    return out


def generate(n_days=2600, events_per_day=1.6, seed=7):
    """~10 years of trading days. Returns (events, daily_vol_by_day)."""
    rng = random.Random(seed)
    regimes = _regime_walk(n_days, rng)
    events, eid = [], 0

    for t in range(n_days):
        reg = regimes[t]
        # vol clusters with vix -- the realistic nuisance that defeats naive backtests
        day_vol = 0.0045 + 0.00055 * (reg["vix"] - 8)
        for _ in range(rng.choices([0, 1, 2, 3], [0.25, 0.4, 0.25, 0.1])[0]
                       if events_per_day else 0):
            etype = rng.choices(list(SIGNAL_SPEC),
                                [0.08, 0.10, 0.38, 0.14, 0.18, 0.12])[0]
            inst = rng.choice(INSTRUMENTS)
            f = {
                "surprise_z": rng.gauss(0, 1),
                "novelty": rng.random(),
                "vix": reg["vix"],
                "trend": reg["trend"],
                "breadth": reg["breadth"],
                "dxy_chg": rng.gauss(0, 0.004),
                "crude_chg": rng.gauss(0, 0.018),
                "days_to_expiry": rng.randint(0, 29),
                "iv_pct": max(0.0, min(1.0, rng.gauss(0.5, 0.22))),
                "flow_regime": reg["flow_regime"],
            }
            spec = SIGNAL_SPEC[etype]
            mu = 0.0
            if spec["driver"]:
                mu = spec["effect"] * f[spec["driver"]]
                if spec["regime_amp"] == "vix":
                    # effect is stronger in high-vol regimes -- exactly the kind of
                    # conditional structure analog retrieval should exploit and a
                    # flat per-type average should miss
                    mu *= (0.5 + f["vix"] / 20.0)
            ev = Event(f"evt_{eid:06d}", t, etype, inst, f)
            ev.fwd = {
                "1d": mu + rng.gauss(0, day_vol * 1.0),
                "5d": mu * 1.4 + rng.gauss(0, day_vol * 2.2),
            }
            events.append(ev)
            eid += 1
    return events


def truth_label(etype):
    return "SIGNAL" if SIGNAL_SPEC[etype]["effect"] != 0 else "noise"
