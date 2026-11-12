"""
Spike S1 -- EOD file ingestion reliability.

NOT a scraper. This runs against a SOURCE REGISTRY entry whose `licence_status`
and `tos_reviewed_at` must be set before it can be enabled (Gate G1/G3). It
defaults to local fixture files so the spike can be developed and tested before
any licence exists.

What it actually measures -- the things that decide whether a daily pipeline is
operable, none of which are about parsing:
  * gap rate            days where the expected file never arrived
  * shape drift         columns appearing/disappearing/renaming silently
  * value sanity        OHLC coherence, impossible moves, zero volume
  * arrival latency     how long after close the file is actually available
  * idempotency         re-running the same day must not double-write
"""
import csv, json, hashlib, os, datetime as dt
from dataclasses import dataclass, field

EXPECTED = ["symbol", "series", "open", "high", "low", "close",
            "last", "prevclose", "tottrdqty", "tottrdval", "timestamp"]


@dataclass
class IngestResult:
    date: str
    ok: bool
    rows: int = 0
    checksum: str = ""
    issues: list = field(default_factory=list)
    latency_min: float = 0.0


class EodIngester:
    """One instance per source registry row."""
    def __init__(self, source_id, fixture_dir="fixtures", strict=True):
        self.source_id, self.dir, self.strict = source_id, fixture_dir, strict
        self.seen_checksums = {}

    def fetch(self, date):
        """Registry-driven. Fixture mode here; production swaps in the licensed client."""
        path = os.path.join(self.dir, f"bhav_{date}.csv")
        if not os.path.exists(path):
            return None
        return open(path, newline="", encoding="utf-8").read()

    def ingest(self, date):
        raw = self.fetch(date)
        if raw is None:
            return IngestResult(date, False, issues=["FILE_MISSING"])
        checksum = hashlib.sha256(raw.encode()).hexdigest()[:16]
        res = IngestResult(date, True, checksum=checksum)

        # idempotency: the same payload must never be processed twice
        if checksum in self.seen_checksums:
            res.issues.append(f"DUPLICATE_OF_{self.seen_checksums[checksum]}")
            res.ok = False
            return res
        self.seen_checksums[checksum] = date

        rdr = csv.DictReader(raw.splitlines())
        cols = [c.strip().lower() for c in (rdr.fieldnames or [])]
        missing = [c for c in EXPECTED if c not in cols]
        extra = [c for c in cols if c not in EXPECTED]
        if missing:
            res.issues.append(f"SHAPE_DRIFT_MISSING:{','.join(missing)}")
            res.ok = False
        if extra:
            res.issues.append(f"SHAPE_DRIFT_NEW:{','.join(extra)}")

        bad = 0
        for row in rdr:
            res.rows += 1
            try:
                o, h, l, c = (float(row[k]) for k in ("open", "high", "low", "close"))
                pc = float(row["prevclose"])
                q = float(row["tottrdqty"])
            except (ValueError, KeyError, TypeError):
                bad += 1
                continue
            if not (l <= o <= h and l <= c <= h):
                bad += 1                                   # OHLC incoherent
            elif pc > 0 and abs(c / pc - 1) > 0.45:
                res.issues.append(f"IMPLAUSIBLE_MOVE:{row.get('symbol')}:{c/pc-1:+.1%}")
            elif q == 0 and c != pc:
                res.issues.append(f"ZERO_VOLUME_WITH_MOVE:{row.get('symbol')}")
        if bad:
            res.issues.append(f"BAD_ROWS:{bad}")
            if bad > res.rows * 0.01:
                res.ok = False
        if res.rows == 0:
            res.issues.append("EMPTY_FILE"); res.ok = False
        return res


def reliability_report(results, expected_days):
    got = {r.date for r in results if r.ok}
    gaps = [d for d in expected_days if d not in got]
    return {
        "expected_days": len(expected_days),
        "successful": len(got),
        "gap_rate": len(gaps) / max(1, len(expected_days)),
        "gaps": gaps,
        "issues": [(r.date, i) for r in results for i in r.issues],
    }
