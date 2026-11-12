import { MOOD } from "@/lib/scenarios";

/** Global risk-mood composite. Six observable inputs, each signed.
 *  A description of present conditions — never a forecast. */
export function MoodGauge({ compact = false }: { compact?: boolean }) {
  const pos = ((MOOD.score + 100) / 200) * 100;
  const tone = MOOD.score > 15 ? "up" : MOOD.score < -15 ? "down" : "flat";
  return (
    <div>
      <div className="between mb8">
        <span className="label">Global risk mood</span>
        <span className={`num ${tone}`} style={{ fontSize: 13, fontWeight: 600 }}>
          {MOOD.score > 0 ? "+" : ""}{MOOD.score}
          <span className="meta" style={{ marginLeft: 6 }}>
            {MOOD.changed > 0 ? "▲ +" : "▼ "}{Math.abs(MOOD.changed)} vs yesterday</span>
        </span>
      </div>
      <div className="gauge" style={{ height: compact ? 26 : 34 }}>
        <span className="seg" style={{ left: 0, width: "38%", background: "var(--down)", opacity: .72 }} />
        <span className="seg" style={{ left: "38%", width: "24%", background: "var(--flat)", opacity: .34 }} />
        <span className="seg" style={{ left: "62%", width: "38%", background: "var(--up)", opacity: .72 }} />
        <span className="mark" style={{ left: `${pos}%` }} />
      </div>
      <div className="between meta mt4">
        <span>risk-off</span>
        <span style={{ fontWeight: 600 }}>{MOOD.label}</span>
        <span>risk-on</span>
      </div>
    </div>
  );
}

export function MoodHistory({ h = 72 }: { h?: number }) {
  const d = MOOD.history;
  const w = 320;
  const y = (v: number) => h / 2 - (v / 100) * (h / 2 - 6);
  const pts = d.map((v, i) => `${(i / (d.length - 1)) * w},${y(v)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: "auto", display: "block" }}
      role="img" aria-label="Global risk mood over the last 21 sessions">
      <rect x="0" y="0" width={w} height={h / 2} fill="var(--up)" opacity=".05" />
      <rect x="0" y={h / 2} width={w} height={h / 2} fill="var(--down)" opacity=".05" />
      <line x1="0" y1={h / 2} x2={w} y2={h / 2} stroke="var(--border-strong)" strokeWidth="1" />
      <polyline points={pts} fill="none" stroke="var(--accent)" strokeWidth="1.8"
        strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={w} cy={y(d[d.length - 1])} r="3.2" fill="var(--accent)" />
    </svg>
  );
}

export function MoodComponents() {
  return (
    <div className="stack" style={{ gap: 9 }}>
      {MOOD.components.map((c) => (
        <div key={c.k}>
          <div className="between" style={{ marginBottom: 3 }}>
            <span style={{ fontSize: 12.5 }}>{c.k}</span>
            <span className={`num ${c.v >= 0 ? "up" : "down"}`} style={{ fontSize: 12 }}>
              {c.v > 0 ? "+" : ""}{c.v}</span>
          </div>
          <span className="wfb" style={{ display: "block", height: 11 }}>
            <i style={{ [c.v >= 0 ? "left" : "right"]: "50%", width: `${Math.min(50, Math.abs(c.v) / 2)}%`,
              background: c.v >= 0 ? "var(--up)" : "var(--down)" } as React.CSSProperties} />
          </span>
          <div className="meta mt4" style={{ fontSize: 10 }}>{c.note}</div>
        </div>
      ))}
    </div>
  );
}
