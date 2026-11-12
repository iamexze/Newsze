"""
Statistical power for the S3 decision.

The harness validation found ZERO false positives but a high false-NEGATIVE rate:
8 of 12 synthetic draws returned NO-GO on data that genuinely contained signal.
The method was not at fault -- sample size was.

This matters enormously for the Phase 0 decision rule. Without a power check,
"NO-GO" is ambiguous between:
      (a) there is no signal                      -> kill the Impact Engine
      (b) there is not enough data to tell        -> get more data
Acting on (b) as if it were (a) kills a live product. So the rule must separate
them, and this module is how.
"""
import math

def _norm_ppf(p):
    """Inverse standard normal CDF (Acklam's rational approximation)."""
    a = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02,
         1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00]
    b = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02,
         6.680131188771972e+01, -1.328068155288572e+01]
    c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00,
         -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00]
    d = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00,
         3.754408661907416e+00]
    pl, pu = 0.02425, 1 - 0.02425
    if p < pl:
        q = math.sqrt(-2 * math.log(p))
        return (((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5]) / \
               ((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1)
    if p > pu:
        q = math.sqrt(-2 * math.log(1 - p))
        return -(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5]) / \
                ((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1)
    q = p - 0.5
    r = q * q
    return (((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5])*q / \
           (((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1)


def required_n(effect_pp, alpha, power=0.80, p0=0.50):
    """Test events needed to detect an `effect_pp` lift over p0, one-sided."""
    p1 = p0 + effect_pp / 100.0
    if p1 >= 1.0 or effect_pp <= 0:
        return float("inf")
    za = _norm_ppf(1 - alpha)
    zb = _norm_ppf(power)
    num = za * math.sqrt(p0 * (1 - p0)) + zb * math.sqrt(p1 * (1 - p1))
    return math.ceil((num / (p1 - p0)) ** 2)


def achieved_power(n, effect_pp, alpha, p0=0.50):
    """Probability of detecting a true `effect_pp` lift with n test events."""
    p1 = p0 + effect_pp / 100.0
    if n <= 0 or p1 >= 1.0:
        return 0.0
    za = _norm_ppf(1 - alpha)
    crit = p0 + za * math.sqrt(p0 * (1 - p0) / n)
    z = (p1 - crit) / math.sqrt(p1 * (1 - p1) / n)
    return 0.5 * (1 + math.erf(z / math.sqrt(2)))


def min_detectable_effect(n, alpha, power=0.80, p0=0.50):
    """The smallest lift (pp) this sample size can actually detect."""
    lo, hi = 0.1, 50.0
    for _ in range(60):
        mid = (lo + hi) / 2
        if achieved_power(n, mid, alpha, p0) < power:
            lo = mid
        else:
            hi = mid
    return round(hi, 1)


if __name__ == "__main__":
    print("\n  SAMPLE SIZE REQUIRED PER EVENT CLASS  (one-sided, 80% power, null = 50%)")
    print("  Bonferroni-corrected alpha shown for a 6-class and a 12-class test.\n")
    print(f"  {'true lift':>10} | {'alpha=0.0500':>13} {'alpha=0.0083':>13} {'alpha=0.0042':>13}")
    print(f"  {'':>10} | {'(1 class)':>13} {'(6 classes)':>13} {'(12 classes)':>13}")
    print("  " + "-" * 56)
    for eff in (2, 3, 4, 5, 7, 10, 15):
        r = [required_n(eff, a) for a in (0.05, 0.05/6, 0.05/12)]
        print(f"  {eff:>8}pp | {r[0]:>13,} {r[1]:>13,} {r[2]:>13,}")

    print("\n  WHAT PHASE 0 CAN ACTUALLY DETECT")
    print("  Minimum detectable effect at alpha=0.0083, 80% power:\n")
    print(f"  {'test events':>12} | {'min detectable lift':>22}")
    print("  " + "-" * 38)
    for n in (150, 300, 500, 1000, 2000, 5000):
        print(f"  {n:>12,} | {min_detectable_effect(n, 0.05/6):>19}pp")

    print("""
  READ THIS BEFORE SETTING THE S3 BAR
  -----------------------------------
  A 10-year synthetic history yields ~150 TEST events for a class like
  RATE_DECISION (8 Fed/RBI meetings a year, 60% of the sample reserved for
  testing). At that n, nothing below ~16pp of lift is detectable.

  A real Impact Engine edge is 3-6pp. Detecting that needs 700-4,000 test
  events per class. Three consequences for the plan:

    1. The 15-year backfill is NOT a nice-to-have. It is what makes S3
       answerable at all. Protect it in scope.
    2. HIGH-FREQUENCY classes are where S3 should look first -- EARNINGS,
       FII_DII_FLOW, BULK_BLOCK_DEAL produce thousands of events. Rate
       decisions are the most interesting and the least testable.
    3. A NO-GO on an underpowered class means "we cannot tell", not "there is
       nothing there". The decision rule must say so explicitly, or Phase 0
       will kill a product that works.
""")
