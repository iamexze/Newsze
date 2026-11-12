import Link from "next/link";
import { RISK, byId, chg } from "@/lib/data";
import { num } from "@/lib/format";
import { SectionHead, Delta, Spark, Stat, Notice } from "@/components/Bits";

export const metadata = { title: "Risk dashboard" };

export default function Risk() {
  return (
    <div className="wrap" style={{ paddingTop: 18 }}>
      <div className="breadcrumb"><Link href="/">Today</Link> / <Link href="/markets">Markets</Link> / Risk</div>
      <div className="mb24">
        <div className="kicker">Cross-asset stress indicators</div>
        <h1 style={{ fontSize: 32, marginTop: 4 }}>Risk dashboard</h1>
        <p className="sub" style={{ maxWidth: 720, marginTop: 6 }}>
          Eight indicators that historically move before equities do. Each is shown against its
          own five-year distribution, because the level of a spread means nothing without
          knowing where that level sits in its history.
        </p>
      </div>

      <div className="grid g2 mb24">
        {RISK.map((r) => (
          <div key={r.name} className="card">
            <div className="between mb12">
              <span className="label">{r.name}</span>
              <span className={`chip ${r.pct > 70 ? "w" : r.pct < 25 ? "up" : ""}`}>
                {r.pct}th percentile
              </span>
            </div>
            <div className="num" style={{ fontSize: 26, fontWeight: 600 }}>{r.value}</div>
            <div style={{ position: "relative", height: 26, marginTop: 14 }}>
              <div style={{ position: "absolute", inset: "10px 0", background: "var(--sunken)",
                borderRadius: 4 }} />
              <div style={{ position: "absolute", inset: "10px 0", width: "25%", background: "var(--up)",
                opacity: .18, borderRadius: "4px 0 0 4px" }} />
              <div style={{ position: "absolute", top: 10, bottom: 10, left: "70%", right: 0,
                background: "var(--warn)", opacity: .18, borderRadius: "0 4px 4px 0" }} />
              <div style={{ position: "absolute", top: 2, bottom: 2, left: `${r.pct}%`, width: 2.5,
                background: r.pct > 70 ? "var(--warn)" : "var(--accent)", transform: "translateX(-1px)",
                borderRadius: 2 }} />
            </div>
            <div className="between meta mt4">
              <span>calm</span><span>5-year range</span><span>stressed</span>
            </div>
            <p className="sub mt12">{r.note}</p>
          </div>
        ))}
      </div>

      <Notice>
        Percentile bands are descriptive. A reading in the top decile has historically been
        associated with wider outcomes in both directions — it is not a signal to act, and we
        publish no impact estimate on these indicators.
      </Notice>
    </div>
  );
}
