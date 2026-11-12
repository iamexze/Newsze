import Link from "next/link";
import { byId, Instrument, chg } from "@/lib/data";
import { pct, num } from "@/lib/format";

export function Tier({ t }: { t: 0 | 1 | 2 | 3 | 4 }) {
  const label = ["Exchange / primary", "Wire", "Major outlet", "Aggregator", "Social — unverified"][t];
  return <span className={`dot t${t}`} title={`Tier ${t} — ${label}`} aria-label={`Source tier ${t}`} />;
}

export function Stale({ l }: { l: Instrument["latency"] }) {
  const m = { realtime: "live", delayed_15m: "15m delayed", eod: "end of day" }[l];
  return <span className="stale" title="Market data latency class">{m}</span>;
}

export function SectionHead({ title, href, more }: { title: string; href?: string; more?: string }) {
  return (
    <div className="sectionhead">
      <h2>{title}</h2>
      {href && <Link href={href}>{more ?? "All"} →</Link>}
    </div>
  );
}

export function Delta({ v, dp = 2, suffix = "%" }: { v: number; dp?: number; suffix?: string }) {
  const c = v > 0 ? "up" : v < 0 ? "down" : "flat";
  const a = v > 0 ? "▲" : v < 0 ? "▼" : "▬";
  return (
    <span className={`num ${c}`}>
      {a} {Math.abs(v).toFixed(dp)}{suffix}
    </span>
  );
}

/** Sparkline — deterministic SVG, no library. */
export function Spark({ data, w = 108, h = 28, up }: { data: number[]; w?: number; h?: number; up?: boolean }) {
  const d = data.slice(-48);
  const lo = Math.min(...d), hi = Math.max(...d), r = hi - lo || 1;
  const pts = d.map((v, i) => `${(i / (d.length - 1)) * w},${h - ((v - lo) / r) * (h - 3) - 1.5}`);
  const rising = up ?? d[d.length - 1] >= d[0];
  const col = rising ? "var(--up)" : "var(--down)";
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" style={{ display: "block" }}>
      <polyline points={`0,${h} ${pts.join(" ")} ${w},${h}`} fill={col} opacity=".08" />
      <polyline points={pts.join(" ")} fill="none" stroke={col} strokeWidth="1.5"
        strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={w} cy={h - ((d[d.length - 1] - lo) / r) * (h - 3) - 1.5} r="2" fill={col} />
    </svg>
  );
}

export function QuoteRow({ id, spark = true }: { id: string; spark?: boolean }) {
  const i = byId(id);
  if (!i) return null;
  const c = chg(i);
  return (
    <Link href={`/ticker/${encodeURIComponent(i.id)}`}
      className="between" style={{ padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
      <div className="min0">
        <div style={{ fontWeight: 600, fontSize: 13 }}>{i.sym}</div>
        <div className="meta">{i.name}</div>
      </div>
      {spark && <Spark data={i.hist} w={76} h={24} up={c >= 0} />}
      <div style={{ textAlign: "right" }}>
        <div className="num" style={{ fontSize: 13 }}>{num(i.last, i.last > 500 ? 0 : 2)}</div>
        <Delta v={c} />
      </div>
    </Link>
  );
}

/** Confidence: numeral + bar. Colour is reserved for direction. */
export function Conf({ v }: { v: number }) {
  return (
    <span className="num" title="Calibrated confidence">
      {v.toFixed(2)}
      <span className="confbar"><i style={{ width: `${v * 100}%` }} /></span>
    </span>
  );
}

export function Stat({ big, label, tone }: { big: string; label: string; tone?: "up" | "down" }) {
  return (
    <div>
      <div className={`statbig ${tone ?? ""}`}>{big}</div>
      <div className="statlbl">{label}</div>
    </div>
  );
}

export function Notice({ children }: { children: React.ReactNode }) {
  return <div className="notice"><b>⚠</b><span>{children}</span></div>;
}

export const fmtPct = pct;
