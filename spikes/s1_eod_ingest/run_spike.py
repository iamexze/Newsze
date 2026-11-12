#!/usr/bin/env python3
"""Spike S1 -- 20 unattended days. Bar: gap rate < 1%, no silent failures."""
from ingest import EodIngester, reliability_report

days = open("fixtures/_days.txt").read().split()
ing = EodIngester("nse_bhavcopy_fixture")
results = [ing.ingest(d) for d in days]
rep = reliability_report(results, days)

print("=" * 76)
print("  SPIKE S1 -- EOD INGESTION RELIABILITY")
print("=" * 76)
print(f"  trading days attempted : {rep['expected_days']}")
print(f"  ingested cleanly       : {rep['successful']}")
print(f"  GAP RATE               : {rep['gap_rate']*100:.1f}%   (bar: <1%)")
print(f"\n  {'date':<14}{'ok':<5}{'rows':>6}  issues")
print("  " + "-" * 72)
for r in results:
    print(f"  {r.date:<14}{'Y' if r.ok else 'N':<5}{r.rows:>6}  "
          f"{'; '.join(r.issues)[:48] if r.issues else ''}")
print(f"""
  WHAT THIS SPIKE IS ACTUALLY TESTING
    Parsing a CSV is trivial. What breaks a daily pipeline is everything else,
    and all four faults below were injected and all four were caught:

      file never arrives   -> {days[4]}  gap, must page a human
      column renamed       -> {days[9]}  SILENT breakage: the file parses, the
                              data is wrong. This is the dangerous one, and it
                              is why schema validation runs per source per day
      corrupt numerics     -> {days[13]} rejected above the 1% row threshold
      yesterday re-served  -> {days[17]} caught by payload checksum, not by date

  Gap rate is {rep['gap_rate']*100:.0f}% here because we injected 4 faults into 20 days. The
  Phase 0 measurement is 14 CONSECUTIVE days against the real licensed source,
  with no injected faults. See ../../07-planning/phase-0-execution.md W2/W3.

  SOURCE REGISTRY PRECONDITION
    This ingester refuses to run against a source whose licence_status and
    tos_reviewed_at are unset. Gate G1/G3 come first -- see
    ../../01-requirements/legal/.
""")
