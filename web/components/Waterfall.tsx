import Link from "next/link";

type Row = { name: string; pts: number; note?: string; story?: string };

/** Signed contribution bars from a centre baseline, sorted by magnitude.
 *  Components sum to the net — that is the whole point of the chart. */
export default function Waterfall({ rows, unit = "pts" }: { rows: Row[]; unit?: string }) {
  const sorted = [...rows].sort((a, b) => Math.abs(b.pts) - Math.abs(a.pts));
  const max = Math.max(...sorted.map((r) => Math.abs(r.pts))) || 1;
  const net = rows.reduce((s, r) => s + r.pts, 0);
  return (
    <div className="wf">
      {sorted.map((r) => {
        const w = (Math.abs(r.pts) / max) * 50;
        const pos = r.pts >= 0;
        const body = (
          <>
            <span className="wfn" title={r.note || r.name}>{r.name}</span>
            <span className="wfb">
              <i style={{
                [pos ? "left" : "right"]: "50%", width: `${w}%`,
                background: pos ? "var(--up)" : "var(--down)",
              } as React.CSSProperties} />
            </span>
            <span className={`wfv ${pos ? "up" : "down"}`}>
              {pos ? "+" : ""}{r.pts}
            </span>
          </>
        );
        return r.story ? (
          <Link key={r.name} href={`/story/${r.story}`} className="wfrow"
            style={{ textDecoration: "none" }} title={r.note}>{body}</Link>
        ) : (
          <div key={r.name} className="wfrow">{body}</div>
        );
      })}
      <div className="wfrow wfnet">
        <span className="wfn" style={{ color: "var(--fg)" }}>Net</span>
        <span />
        <span className={`wfv ${net >= 0 ? "up" : "down"}`}>
          {net >= 0 ? "+" : ""}{net} {unit}
        </span>
      </div>
    </div>
  );
}
