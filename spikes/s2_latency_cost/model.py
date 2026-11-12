"""
Spike S2 -- end-to-end latency and inference cost.

Two questions that decide whether the architecture is viable:
  1. Can we get a wire headline to a user's screen inside the 45s budget?
  2. What does classification actually cost per 1,000 events, and does the
     tiered-routing decision (ADR-008) earn its complexity?

Latency distributions below are PLACEHOLDERS to be replaced with measurements in
Phase 0 week 2. The structure is the deliverable -- it tells us which stage to
measure first and which knob actually moves the number.
"""
import random, math
from statistics import median

# stage -> (p50_ms, p95_ms). Replace with measured values in W2.6.
STAGES = {
    "ingest_persist":  (300, 2000),
    "normalise":       (40, 150),
    "resolve_entities":(120, 900),
    "cluster":         (400, 2200),
    "classify_llm":    (2500, 8000),
    "score_analog":    (600, 3000),
    "publish":         (150, 800),
    "push_to_client":  (400, 3000),
}
STRUCTURED_SKIPS = {"cluster", "classify_llm"}   # deterministic parsers bypass these

# --- pricing placeholders (USD per 1M tokens). Replace with live rates in W2.6.
PRICING = {
    "parser": {"in": 0.0,  "out": 0.0},
    "haiku":  {"in": 1.00, "out": 5.00},
    "opus":   {"in": 15.00, "out": 75.00},
}
TOKENS = {"in": 2200, "out": 420}     # per CLUSTER, not per article


def _lognormal(p50, p95):
    mu = math.log(p50)
    sigma = (math.log(p95) - mu) / 1.645
    return random.lognormvariate(mu, sigma)


def simulate_latency(n=20000, structured_share=0.45, review_share=0.04, seed=3):
    rng = random.Random(seed)
    random.seed(seed)
    out = []
    for _ in range(n):
        structured = rng.random() < structured_share
        total = 0.0
        for st, (p50, p95) in STAGES.items():
            if structured and st in STRUCTURED_SKIPS:
                continue
            total += _lognormal(p50, p95)
        if structured:
            total += _lognormal(400, 1200)      # templated parser
        if rng.random() < review_share:
            total += _lognormal(90000, 300000)  # human review queue
        out.append(total / 1000.0)
    return out


def pct(v, p):
    s = sorted(v)
    return s[min(len(s) - 1, int(len(s) * p / 100))]


def cost_per_1k(routing, cluster_factor=1.0, usd_inr=88.0):
    """routing: {'parser':share,'haiku':share,'opus':share}. cluster_factor is
    the share of inference actually performed after deduplication into stories."""
    usd = 0.0
    for tier, share in routing.items():
        p = PRICING[tier]
        usd += share * cluster_factor * (
            TOKENS["in"] / 1e6 * p["in"] + TOKENS["out"] / 1e6 * p["out"])
    return usd * 1000, usd * 1000 * usd_inr
