"""
Purged, embargoed, walk-forward evaluation.

The three guards that separate a real backtest from a self-flattering one:
  1. WALK-FORWARD   train only on the past; never a random shuffle
  2. PURGE          drop train events whose outcome window overlaps the test start
  3. EMBARGO        additionally drop train events immediately before the test start
Without 2 and 3, overlapping outcome windows leak the answer across the boundary
and every strategy looks profitable.
"""
from statistics import mean

HORIZON_DAYS = {"1d": 1, "5d": 5}


def walk_forward_splits(events, n_folds=5, embargo_days=10, horizon="1d"):
    """Expanding-window folds over time-ordered events."""
    ev = sorted(events, key=lambda e: e.t)
    tmax = ev[-1].t
    # first 40% is always train-only; remaining 60% split into n_folds test blocks
    start = int(tmax * 0.40)
    block = (tmax - start) / n_folds
    h = HORIZON_DAYS[horizon]
    for i in range(n_folds):
        t0 = start + block * i
        t1 = start + block * (i + 1)
        test = [e for e in ev if t0 <= e.t < t1]
        cutoff = t0 - embargo_days - h          # purge + embargo
        train = [e for e in ev if e.t < cutoff]
        if len(train) > 200 and len(test) > 20:
            yield i, train, test


def evaluate(events, engine_factory, horizon="1d", n_folds=5, min_test=30):
    """
    Returns per-event-type results. Baseline = always predict the direction that
    was the majority in TRAIN (the honest naive prior; no look-ahead).
    """
    acc = {}
    for fold, train, test in walk_forward_splits(events, n_folds, horizon=horizon):
        eng = engine_factory().fit(train)
        # train-derived majority direction, per type
        prior = {}
        for e in train:
            s = prior.setdefault(e.etype, [0, 0])
            s[0] += 1
            s[1] += 1 if e.fwd[horizon] > 0 else 0
        for e in test:
            p = eng.predict(e, horizon)
            rec = acc.setdefault(e.etype, {"n": 0, "model_hit": 0, "base_hit": 0,
                                           "suppressed": 0, "conc": [], "folds": set()})
            rec["folds"].add(fold)
            if p is None:
                rec["suppressed"] += 1
                continue
            actual_up = e.fwd[horizon] > 0
            pred_up = p["expected"] > 0
            cnt, ups = prior.get(e.etype, [1, 0])
            base_up = (ups / cnt) >= 0.5
            rec["n"] += 1
            rec["model_hit"] += int(pred_up == actual_up)
            rec["base_hit"] += int(base_up == actual_up)
            rec["conc"].append(p["regime_concentration"])

    out = {}
    for t, r in acc.items():
        if r["n"] < min_test:
            out[t] = {"n": r["n"], "verdict": "INSUFFICIENT"}
            continue
        m = r["model_hit"] / r["n"]
        b = r["base_hit"] / r["n"]
        out[t] = {
            "n": r["n"],
            "model_acc": m,
            "baseline_acc": b,
            "lift_pp": (m - b) * 100,
            "suppressed": r["suppressed"],
            "regime_conc": mean(r["conc"]) if r["conc"] else 0.0,
            "folds": len(r["folds"]),
            "ci95_pp": 1.96 * (0.5 / (r["n"] ** 0.5)) * 100,   # conservative band on a proportion
        }
    return out


def per_fold_stability(events, engine_factory, etype, horizon="1d", n_folds=5):
    """Lift must be stable across folds. One lucky fold is not a finding."""
    lifts = []
    for _, train, test in walk_forward_splits(events, n_folds, horizon=horizon):
        eng = engine_factory().fit(train)
        prior = {}
        for e in train:
            s = prior.setdefault(e.etype, [0, 0])
            s[0] += 1; s[1] += 1 if e.fwd[horizon] > 0 else 0
        n = mh = bh = 0
        for e in (x for x in test if x.etype == etype):
            p = eng.predict(e, horizon)
            if p is None:
                continue
            au = e.fwd[horizon] > 0
            cnt, ups = prior.get(etype, [1, 0])
            n += 1
            mh += int((p["expected"] > 0) == au)
            bh += int(((ups / cnt) >= 0.5) == au)
        if n >= 15:
            lifts.append(((mh - bh) / n) * 100)
    return lifts
