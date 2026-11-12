import { Story, byId } from "@/lib/data";

/* Card visual. A general-news site puts a photograph here; on a markets site a
   photograph is decoration. Each thumbnail is drawn from the story's own numbers,
   so the image carries information: the shape tells you what kind of event it is
   and which way the estimate points, before you read the headline. */

function Cone({ exp, lo, hi, dir }: { exp: number; lo: number; hi: number; dir: string }) {
  const span = Math.max(Math.abs(lo), Math.abs(hi)) * 2 || 1;
  const x = (v: number) => 50 + (v / span) * 46;
  return (
    <>
      <rect x={x(lo)} y="30" width={x(hi) - x(lo)} height="12" rx="2.5"
        fill={`var(--${dir})`} opacity=".22" />
      <line x1="50" y1="22" x2="50" y2="50" stroke="var(--border-strong)" strokeWidth=".7" />
      <line x1={x(exp)} y1="24" x2={x(exp)} y2="48" stroke={`var(--${dir})`} strokeWidth="2" />
      <circle cx={x(exp)} cy="36" r="3.4" fill={`var(--${dir})`} />
    </>
  );
}

function Bars({ vals }: { vals: number[] }) {
  const max = Math.max(...vals.map(Math.abs)) || 1;
  return (
    <>
      <line x1="50" y1="14" x2="50" y2="58" stroke="var(--border-strong)" strokeWidth=".7" />
      {vals.map((v, i) => {
        const w = (Math.abs(v) / max) * 42;
        const y = 16 + i * 7.2;
        return <rect key={i} x={v >= 0 ? 50 : 50 - w} y={y} width={w} height="4.6" rx="1.4"
          fill={v >= 0 ? "var(--up)" : "var(--down)"} opacity={.85 - i * 0.07} />;
      })}
    </>
  );
}

function Dist({ dir }: { dir: string }) {
  const hs = [3, 7, 13, 22, 34, 44, 38, 27, 17, 10, 5];
  return (
    <>
      {hs.map((h, i) => (
        <rect key={i} x={6 + i * 8.2} y={56 - h} width="6.6" height={h} rx="1.2"
          fill={i >= 4 && i <= 6 ? `var(--${dir})` : "var(--border-strong)"}
          opacity={i >= 4 && i <= 6 ? .75 : .45} />
      ))}
      <line x1="47" y1="8" x2="47" y2="58" stroke={`var(--${dir})`} strokeWidth="1.6" />
    </>
  );
}

function Line({ data, dir }: { data: number[]; dir: string }) {
  const d = data.slice(-40);
  const lo = Math.min(...d), hi = Math.max(...d), r = hi - lo || 1;
  const pts = d.map((v, i) => `${(i / (d.length - 1)) * 100},${56 - ((v - lo) / r) * 42}`).join(" ");
  return (
    <>
      <polyline points={`0,58 ${pts} 100,58`} fill={`var(--${dir})`} opacity=".12" />
      <polyline points={pts} fill="none" stroke={`var(--${dir})`} strokeWidth="1.8"
        strokeLinejoin="round" />
    </>
  );
}

export default function Thumb({ s, h = 118 }: { s: Story; h?: number }) {
  const top = s.impacts.find((i) => i.expected !== null);
  const dir = !top ? "flat" : top.expected! > 0 ? "up" : "down";
  const kind = s.type === "FII_DII_FLOW" || s.type === "BULK_BLOCK_DEAL" ? "bars"
    : s.type === "RATE_DECISION" || s.type === "CPI" ? "cone"
    : s.analogs.length >= 3 ? "dist"
    : "line";
  const inst = top ? byId(top.instrument) : undefined;

  return (
    <div style={{ position: "relative", height: h, background: "var(--sunken)",
      borderRadius: 4, overflow: "hidden", border: "1px solid var(--border)" }}>
      <svg viewBox="0 0 100 64" preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden="true">
        {kind === "cone" && top && <Cone exp={top.expected!} lo={top.b68![0]} hi={top.b68![1]} dir={dir} />}
        {kind === "bars" && <Bars vals={[2.98, -2.14, 2.24, -1.88, 1.9]} />}
        {kind === "dist" && <Dist dir={dir} />}
        {kind === "line" && inst && <Line data={inst.hist} dir={dir} />}
        {kind === "line" && !inst && <Dist dir="flat" />}
      </svg>
      <div style={{ position: "absolute", left: 8, top: 7 }}>
        <span className="chip" style={{ background: "var(--bg)", fontSize: 9, borderColor: "var(--border)" }}>
          {s.type.replace(/_/g, " ")}
        </span>
      </div>
      {top && (
        <div style={{ position: "absolute", right: 8, bottom: 7, textAlign: "right" }}>
          <div className={`num ${dir}`} style={{ fontSize: 15, fontWeight: 600, lineHeight: 1 }}>
            {top.expected! > 0 ? "+" : ""}{top.expected!.toFixed(2)}%
          </div>
          <div className="meta" style={{ fontSize: 9 }}>{inst?.sym} · {top.horizon} · n={top.n}</div>
        </div>
      )}
      {!top && (
        <div style={{ position: "absolute", right: 8, bottom: 7 }}>
          <span className="meta" style={{ fontSize: 9 }}>no estimate published</span>
        </div>
      )}
    </div>
  );
}
