#!/usr/bin/env python3
"""Spike S2 -- latency budget and inference cost. Bars: p95 <=45s, cost within NFR-COST-01."""
from model import simulate_latency, pct, cost_per_1k, STAGES

lat = simulate_latency()
unrev = simulate_latency(review_share=0.0)

print("=" * 78)
print("  SPIKE S2 -- END-TO-END LATENCY & INFERENCE COST")
print("=" * 78)
print("\n  LATENCY  (source publish -> visible on an open client)")
print(f"    {'':>22}{'p50':>9}{'p90':>9}{'p95':>9}{'p99':>9}")
print(f"    {'all items':<22}{pct(lat,50):>8.1f}s{pct(lat,90):>8.1f}s"
      f"{pct(lat,95):>8.1f}s{pct(lat,99):>8.1f}s")
print(f"    {'unreviewed path':<22}{pct(unrev,50):>8.1f}s{pct(unrev,90):>8.1f}s"
      f"{pct(unrev,95):>8.1f}s{pct(unrev,99):>8.1f}s")
bar = pct(unrev, 95)
print(f"\n    budget: 45s p95 on the unreviewed path -> "
      f"{'PASS' if bar <= 45 else 'FAIL'} ({bar:.1f}s)")
print("\n    stage contributions (p50 -> p95, ms):")
for s, (a, b) in STAGES.items():
    flag = "  <- bypassed by structured sources" if s in {"cluster","classify_llm"} else ""
    print(f"      {s:<20}{a:>7} -> {b:<7}{flag}")

print("\n\n  INFERENCE COST per 1,000 events")
print(f"    {'routing':<44}{'USD':>9}{'INR':>10}")
print("    " + "-" * 63)
scenarios = [
    ("naive: Opus on every article, no clustering",
     {"parser":0.0,"haiku":0.0,"opus":1.0}, 1.0),
    ("Opus on every article, clustered (0.35x)",
     {"parser":0.0,"haiku":0.0,"opus":1.0}, 0.35),
    ("Haiku only, clustered",
     {"parser":0.0,"haiku":1.0,"opus":0.0}, 0.35),
    ("ADR-008 routing: 45/47/8 parser/haiku/opus, clustered",
     {"parser":0.45,"haiku":0.47,"opus":0.08}, 0.35),
]
base = None
for name, r, cf in scenarios:
    usd, inr = cost_per_1k(r, cf)
    if base is None:
        base = usd
    print(f"    {name:<44}{usd:>9.2f}{inr:>10.0f}")
chosen_usd, chosen_inr = cost_per_1k({"parser":0.45,"haiku":0.47,"opus":0.08}, 0.35)
print(f"\n    ADR-008 routing is {base/chosen_usd:.0f}x cheaper than the naive path.")

DAILY = 20000
m_usd = chosen_usd/1000*DAILY*30
print(f"\n  AT SCALE  ({DAILY:,} signals/day)")
print(f"    monthly inference: ${m_usd:,.0f}  (Rs {m_usd*88:,.0f})")
for mau in (10000, 50000, 200000):
    print(f"      at {mau:>7,} MAU -> Rs {m_usd*88/mau:>6.2f} per MAU/month "
          f"{'OK' if m_usd*88/mau <= 18 else 'OVER BUDGET'}  (NFR-COST-01 bar: Rs 18)")

print(f"""
  WHAT THIS TELLS US
    1. The LLM classification stage dominates latency (2.5s p50, 8s p95). It is
       also the only stage we can REMOVE: structured sources -- macro prints,
       exchange files, filings -- go through deterministic parsers and skip both
       clustering and classification. Those are also our highest-value items, so
       the fastest path carries the best content. That is a happy accident worth
       protecting in design.

    2. Cost is dominated by two decisions, neither of which is model choice:
         - CLUSTER-LEVEL inference (classify a story once, not 40 articles): ~3x
         - TIERED ROUTING (ADR-008):                                        ~{base/chosen_usd/2.9:.0f}x
       Together ~{base/chosen_usd:.0f}x. Without both, inference alone breaks NFR-COST-01
       before a single user is served.

    3. Inference cost per MAU FALLS with scale while data-licence cost is fixed.
       Both argue the same way: the unit economics only work with volume. This
       is the quantitative case for the growth plan, not a vibe.

  THESE ARE PLACEHOLDER DISTRIBUTIONS. Phase 0 W2.6 replaces STAGES and PRICING
  with measured values. The structure is what ships; the numbers are a hypothesis.
""")
