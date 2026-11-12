#!/usr/bin/env python3
"""Generate 20 trading days of fixture bhavcopy files, with deliberate faults
on specific days so the reliability checks are actually exercised."""
import csv, os, random, datetime as dt

random.seed(11)
SYMS = ["HDFCBANK", "INFY", "RELIANCE", "TCS", "SBIN", "TATAMOTORS",
        "ICICIBANK", "AXISBANK", "WIPRO", "BAJFINANCE"]
os.makedirs("fixtures", exist_ok=True)

d, days = dt.date(2026, 10, 12), []
while len(days) < 20:
    if d.weekday() < 5:
        days.append(d.isoformat())
    d += dt.timedelta(days=1)

FAULTS = {
    days[4]:  "missing",        # file never arrives  -> gap
    days[9]:  "shape_drift",    # a column is renamed -> silent breakage
    days[13]: "bad_rows",       # corrupt numerics
    days[17]: "duplicate",      # yesterday's file re-served
}
prev = {s: round(random.uniform(400, 3200), 2) for s in SYMS}
written = {}
for day in days:
    f = FAULTS.get(day)
    if f == "missing":
        continue
    if f == "duplicate":
        path = f"fixtures/bhav_{day}.csv"
        open(path, "w").write(written[days[16]])
        continue
    cols = ["symbol","series","open","high","low","close","last",
            "prevclose","tottrdqty","tottrdval","timestamp"]
    if f == "shape_drift":
        cols[7] = "prev_close"          # renamed: the classic silent failure
    rows = []
    for i, s in enumerate(SYMS):
        pc = prev[s]
        c = round(pc * (1 + random.gauss(0, 0.013)), 2)
        o = round(pc * (1 + random.gauss(0, 0.006)), 2)
        hi = round(max(o, c) * (1 + abs(random.gauss(0, 0.004))), 2)
        lo = round(min(o, c) * (1 - abs(random.gauss(0, 0.004))), 2)
        q = random.randint(100000, 9000000)
        r = [s, "EQ", o, hi, lo, c, c, pc, q, round(q*c, 2), day]
        if f == "bad_rows" and i < 3:
            r[2], r[8] = "N/A", ""      # corrupt numerics
        rows.append(r)
        prev[s] = c
    buf = ",".join(cols) + "\n" + "\n".join(",".join(str(x) for x in r) for r in rows) + "\n"
    written[day] = buf
    open(f"fixtures/bhav_{day}.csv", "w").write(buf)

open("fixtures/_days.txt", "w").write("\n".join(days))
print(f"wrote {len(os.listdir('fixtures'))-1} fixture files over {len(days)} trading days")
print(f"deliberate faults: {FAULTS}")
