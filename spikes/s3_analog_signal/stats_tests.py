"""
Significance testing for the S3 verdict.

Why this file exists: the first version of this spike PASSED a pure-noise event
class at +8.9pp lift. Six classes tested at ~50% accuracy will always throw up a
winner by chance. Lift alone is not evidence. Three corrections are applied:

  1. HONEST NULL        H0 is max(0.5, baseline) -- the model must beat a coin
                        flip, not merely beat a noisy train-derived prior that
                        happened to point the wrong way on the test block.
  2. EXACT BINOMIAL     one-sided p-value, not an eyeballed confidence band.
  3. BONFERRONI         alpha / (number of classes tested). Testing six classes
                        and reporting the best one is p-hacking with extra steps.
"""
import math


def _log_choose(n, k):
    return (math.lgamma(n + 1) - math.lgamma(k + 1) - math.lgamma(n - k + 1))


def binom_sf(k, n, p):
    """P(X >= k) for X ~ Binomial(n, p). One-sided."""
    if k <= 0:
        return 1.0
    if k > n:
        return 0.0
    total = 0.0
    for i in range(k, n + 1):
        lp = _log_choose(n, i) + i * math.log(p) + (n - i) * math.log(1 - p)
        total += math.exp(lp)
    return min(1.0, total)


def test_class(hits, n, baseline_rate, n_tests, alpha=0.05):
    """Returns (p_value, alpha_corrected, passes)."""
    p0 = max(0.5, baseline_rate)          # the honest null
    p = binom_sf(hits, n, p0)
    a = alpha / max(1, n_tests)           # Bonferroni
    return p, a, (p < a)


def sign_test_folds(lifts):
    """P(>= observed positive folds) under a fair coin. Guards one-lucky-fold results."""
    n = len(lifts)
    if n == 0:
        return 1.0
    pos = sum(1 for x in lifts if x > 0)
    return binom_sf(pos, n, 0.5)
