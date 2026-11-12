"""
Analog retrieval engine -- the primary estimator in the Impact Engine.

Given an event, find the k most similar PAST events of the same type and report
the empirical distribution of what followed. This is the explainable core:
"here are the 34 times this happened before."

Deliberately simple. If signal needs a complicated model to appear, it isn't there.
"""
import math
from synth import FEATURES


class Standardiser:
    """Fit on TRAIN ONLY. Fitting on all data is look-ahead bias."""
    def __init__(self):
        self.mu, self.sd = {}, {}

    def fit(self, events):
        for f in FEATURES:
            vals = [e.feats[f] for e in events]
            n = len(vals) or 1
            m = sum(vals) / n
            var = sum((v - m) ** 2 for v in vals) / max(1, n - 1)
            self.mu[f], self.sd[f] = m, math.sqrt(var) or 1.0
        return self

    def vec(self, e):
        return [(e.feats[f] - self.mu[f]) / self.sd[f] for f in FEATURES]


def _dist(a, b, w):
    return math.sqrt(sum(wi * (ai - bi) ** 2 for ai, bi, wi in zip(a, b, w)))


class AnalogEngine:
    """
    weights: per-feature importance. Uniform by default -- we are testing whether
    ANY signal exists, not tuning. Tuning before the existence question is answered
    is how teams talk themselves into a dead product.
    """
    def __init__(self, k=25, min_n=12, weights=None):
        self.k, self.min_n = k, min_n
        self.weights = weights or [1.0] * len(FEATURES)

    def fit(self, train_events):
        self.std = Standardiser().fit(train_events)
        self.by_type = {}
        for e in train_events:
            self.by_type.setdefault(e.etype, []).append((self.std.vec(e), e))
        return self

    def predict(self, e, horizon="1d"):
        """Returns None when evidence is thin -- the publication gate (FR-M2-05)."""
        pool = self.by_type.get(e.etype, [])
        if len(pool) < self.min_n:
            return None
        q = self.std.vec(e)
        scored = sorted(((_dist(q, v, self.weights), ev) for v, ev in pool),
                        key=lambda x: x[0])[: self.k]
        if len(scored) < self.min_n:
            return None
        rets = [ev.fwd[horizon] for _, ev in scored]
        n = len(rets)
        mean = sum(rets) / n
        srt = sorted(rets)
        median = srt[n // 2] if n % 2 else (srt[n // 2 - 1] + srt[n // 2]) / 2
        up = sum(1 for r in rets if r > 0)
        # regime concentration: share of analogs falling in the single densest
        # 180-day window. High => the n is illusory (FR-M2-06).
        days = sorted(ev.t for _, ev in scored)
        best = max(sum(1 for d in days if d0 <= d < d0 + 180) for d0 in days)
        return {
            "expected": mean,
            "median": median,
            "prob_up": up / n,
            "n": n,
            "hit_rate": max(up, n - up) / n,
            "regime_concentration": best / n,
            "neighbours": [ev.event_id for _, ev in scored[:3]],
        }
