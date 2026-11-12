import Link from "next/link";
import { metricBySlug } from "@/lib/explain";

/**
 * Makes any statistic clickable through to its explainer.
 * The premise: a number is useless until you know what changes it, so every
 * figure on this site should be one tap from the factors that move it.
 */
export default function Explain({ metric, children, inline = true }:
  { metric: string; children: React.ReactNode; inline?: boolean }) {
  const m = metricBySlug(metric);
  if (!m) return <>{children}</>;
  return (
    <Link href={`/explain/${m.slug}`} className={inline ? "xstat" : "xstat block"}
      title={`What moves ${m.name}?`}>
      {children}
      <span className="xmark" aria-hidden="true">?</span>
      <span className="sr"> — explain {m.name}</span>
    </Link>
  );
}

/** Driver bar — one factor and its share of day-to-day variation. */
export function DriverBar({ d }: { d: { name: string; dir: string; weight: number; note: string; link?: string } }) {
  const arrow = d.dir === "raises" ? "▲" : d.dir === "lowers" ? "▼" : "⇅";
  const tone = d.dir === "raises" ? "up" : d.dir === "lowers" ? "down" : "flat";
  return (
    <div className="driver">
      <div className="between mb4">
        <span className="row" style={{ gap: 8 }}>
          <span className={tone} style={{ fontSize: 11 }}>{arrow}</span>
          <span style={{ fontWeight: 600, fontSize: 14 }}>{d.name}</span>
        </span>
        <span className="num" style={{ fontSize: 13, fontWeight: 600 }}>{d.weight}%</span>
      </div>
      <div className="bar"><i style={{ width: `${d.weight}%` }} /></div>
      <p className="sub mt8" style={{ fontSize: 12.5 }}>
        {d.note}
        {d.link && <> <Link href={d.link} style={{ color: "var(--accent)", fontWeight: 600 }}>More →</Link></>}
      </p>
    </div>
  );
}
