import type { Chain } from "@/lib/options";
import { expectedMove, ncdf, probAbove } from "@/lib/options";

/** Open interest by strike. Calls left, puts right, spot and max pain marked.
 *  The classic view, hand-drawn so the colour semantics match the rest of the site. */
export function OiProfile({ c, h = 300 }: { c: Chain; h?: number }) {
  const max = Math.max(...c.rows.flatMap((r) => [r.ceOi, r.peOi]));
  const n = c.rows.length;
  const rowH = (h - 26) / n;
  const mid = 50;
  return (
    <svg viewBox={`0 0 100 ${h}`} preserveAspectRatio="none"
      style={{ width: "100%", height: h, display: "block" }}
      role="img" aria-label={`Open interest by strike for ${c.name}`}>
      {c.rows.map((r, i) => {
        const y = 13 + i * rowH;
        const cw = (r.ceOi / max) * 46;
        const pw = (r.peOi / max) * 46;
        const isAtm = Math.abs(r.strike - c.spot) < (c.rows[1].strike - c.rows[0].strike) / 2;
        const isMp = r.strike === c.maxPain;
        return (
          <g key={r.strike}>
            {(isAtm || isMp) && (
              <rect x="0" y={y - 1} width="100" height={rowH - 1}
                fill={isAtm ? "var(--accent)" : "var(--warn)"} opacity=".07" />
            )}
            <rect x={mid - cw} y={y} width={cw} height={rowH - 3} rx=".6"
              fill="var(--down)" opacity=".8" />
            <rect x={mid} y={y} width={pw} height={rowH - 3} rx=".6"
              fill="var(--up)" opacity=".8" />
          </g>
        );
      })}
      <line x1={mid} y1="8" x2={mid} y2={h - 8} stroke="var(--border-strong)" strokeWidth=".4" />
    </svg>
  );
}

/** Strike labels rendered as HTML beside the profile so type stays crisp. */
export function OiLabels({ c }: { c: Chain }) {
  return (
    <div className="oilabels">
      {c.rows.map((r) => {
        const isAtm = Math.abs(r.strike - c.spot) < (c.rows[1].strike - c.rows[0].strike) / 2;
        return (
          <div key={r.strike} className={isAtm ? "atm" : ""}>
            {r.strike.toLocaleString("en-IN")}
            {r.strike === c.maxPain && <span className="chip w">max pain</span>}
          </div>
        );
      })}
    </div>
  );
}

/** Risk-neutral implied distribution with the one and two sigma bands shaded. */
export function ImpliedDistribution({ c, h = 170 }: { c: Chain; h?: number }) {
  const em = expectedMove(c.spot, c.atmIv, c.dte);
  const span = em * 3.4;
  const w = 480;
  const x = (p: number) => ((p - (c.spot - span)) / (2 * span)) * w;
  const pts: string[] = [];
  for (let i = 0; i <= 120; i++) {
    const p = c.spot - span + (2 * span * i) / 120;
    const z = (p - c.spot) / em;
    const d = Math.exp(-(z * z) / 2);
    pts.push(`${x(p)},${h - 20 - d * (h - 42)}`);
  }
  const band = (k: number, op: number) => (
    <rect key={k} x={x(c.spot - em * k)} y={14} width={x(c.spot + em * k) - x(c.spot - em * k)}
      height={h - 34} fill="var(--accent)" opacity={op} />
  );
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: "auto", display: "block" }}
      role="img" aria-label={`Risk-neutral implied distribution for ${c.name}`}>
      {band(2, .05)}{band(1, .08)}
      <polygon points={`${x(c.spot - span)},${h - 20} ${pts.join(" ")} ${x(c.spot + span)},${h - 20}`}
        fill="var(--accent)" opacity=".16" />
      <polyline points={pts.join(" ")} fill="none" stroke="var(--accent)" strokeWidth="2" />
      <line x1={x(c.spot)} y1="10" x2={x(c.spot)} y2={h - 20} stroke="var(--fg)" strokeWidth="1.6" />
      <line x1={x(c.maxPain)} y1="18" x2={x(c.maxPain)} y2={h - 20}
        stroke="var(--warn)" strokeWidth="1.4" strokeDasharray="4 3" />
      <line x1="0" y1={h - 20} x2={w} y2={h - 20} stroke="var(--border)" strokeWidth="1" />
      {[-2, -1, 0, 1, 2].map((k) => (
        <text key={k} x={x(c.spot + em * k)} y={h - 6} fontSize="10" textAnchor="middle"
          fill="var(--faint)" fontFamily="var(--mono)">
          {Math.round(c.spot + em * k).toLocaleString("en-IN")}
        </text>
      ))}
      <text x={x(c.spot)} y="8" fontSize="9.5" textAnchor="middle" fill="var(--fg)"
        fontFamily="var(--mono)">spot</text>
    </svg>
  );
}

/** Probability ladder — P(close above each strike) at expiry, risk-neutral. */
export function ProbabilityLadder({ c }: { c: Chain }) {
  return (
    <div className="scrollx">
      <table>
        <thead><tr><th>Level</th><th>Distance</th><th>P(above) at expiry</th><th>P(below)</th></tr></thead>
        <tbody>
          {[...c.rows].reverse().filter((_, i) => i % 2 === 0).map((r) => {
            const p = probAbove(c.spot, r.strike, c.atmIv, c.dte);
            const d = ((r.strike - c.spot) / c.spot) * 100;
            return (
              <tr key={r.strike} className="hoverable">
                <td>{r.strike.toLocaleString("en-IN")}</td>
                <td className={d >= 0 ? "up" : "down"}>{d > 0 ? "+" : ""}{d.toFixed(2)}%</td>
                <td>
                  <span className="row" style={{ justifyContent: "flex-end", gap: 9 }}>
                    <span className="bar" style={{ width: 70 }}>
                      <i style={{ width: `${p * 100}%`,
                        background: p >= 0.5 ? "var(--up)" : "var(--down)" }} /></span>
                    <span style={{ fontWeight: 600 }}>{(p * 100).toFixed(1)}%</span>
                  </span>
                </td>
                <td style={{ color: "var(--muted)" }}>{((1 - p) * 100).toFixed(1)}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
