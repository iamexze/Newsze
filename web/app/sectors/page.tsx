import Link from "next/link";
import { SECTORS, byId, chg, INSTRUMENTS } from "@/lib/data";
import { HEATMAP } from "@/lib/india";
import { num } from "@/lib/format";
import { SectionHead, Delta, Spark, Notice } from "@/components/Bits";
import T from "@/components/T";

export const metadata = { title: "Sectors" };

const DRIVERS: Record<string, string> = {
  "Nifty Bank": "Rate cycle, credit growth, asset quality, and RBI risk-weight policy. The largest index weight, so bank moves are index moves.",
  "Nifty IT": "US and European discretionary technology spending, the rupee, and ADR dislocation overnight. The most globally transmitted Indian sector.",
  "Nifty Auto": "Crude, commodity input costs, monsoon and rural demand, and the financing rate. Two-wheeler volumes are the cleanest rural proxy.",
  "Nifty Pharma": "US generic pricing, FDA inspection outcomes, and the rupee. Largely insulated from domestic demand.",
  "Nifty FMCG": "Rural demand, agricultural input costs and crude derivatives in packaging. Defensive in drawdowns.",
  "Nifty Metal": "Chinese demand above everything else. Domestic factors are secondary for this sector.",
  "Nifty Energy": "Crude in rupee terms, marketing margins and government pricing policy. Upstream and downstream move opposite directions.",
  "Nifty Realty": "Rate cycle and credit availability. The highest-beta rate-sensitive sector.",
  "Nifty PSU Bank": "Government policy, credit costs and recapitalisation. More policy-driven than private banks.",
  "Nifty Infra": "Government capex, order books and GST collections as an activity proxy.",
};

export default function Sectors() {
  const best = [...SECTORS].sort((a, b) => b.chg20 - a.chg20)[0];
  const worst = [...SECTORS].sort((a, b) => a.chg20 - b.chg20)[0];
  return (
    <>
      <section className="band" style={{ paddingBlock: "40px 34px" }}>
        <div className="wrap">
          <div className="kicker accent">Sectors · India</div>
          <h1 className="reveal" style={{ fontSize: "clamp(29px,4.6vw,50px)", marginTop: 10, maxWidth: 900 }}>
            <T en="Most single-stock moves are sector moves wearing a company name"
               hi="अधिकांश एकल-शेयर चालें असल में क्षेत्रीय चालें होती हैं" />
          </h1>
          <p className="sub reveal d1" style={{ fontSize: 16.5, maxWidth: 760, marginTop: 14, lineHeight: 1.55 }}>
            Ten sectors, with the external driver that actually moves each one. Checking the
            sector before the stock prevents attributing a sector repricing to company news —
            which is the most common misreading in Indian market commentary.
          </p>
          <div className="grid g4 mt32" style={{ gap: 20 }}>
            <div className="reveal"><div className="figure lg">{best.name.replace("Nifty ", "")}</div>
              <div className="statlbl">Best 20-day · {best.chg20 > 0 ? "+" : ""}{best.chg20}%</div></div>
            <div className="reveal d1"><div className="figure lg">{worst.name.replace("Nifty ", "")}</div>
              <div className="statlbl">Worst 20-day · {worst.chg20}%</div></div>
            <div className="reveal d2"><div className="figure lg">{SECTORS.length}</div>
              <div className="statlbl">Sectors tracked</div></div>
            <div className="reveal d3"><div className="figure lg">
              {Math.round(best.breadth * 100)}%</div>
              <div className="statlbl">Breadth in the leading sector</div></div>
          </div>
        </div>
      </section>

      <div className="wrap" style={{ paddingTop: 28 }}>
        <div className="breadcrumb"><Link href="/">Today</Link> / Sectors</div>

        <SectionHead title="Performance and breadth" href="/heatmap" more="Heatmap" />
        <div className="card pad0 mb32 reveal">
          <div className="scrollx">
            <table>
              <thead><tr><th style={{ paddingLeft: 16 }}>Sector</th><th>1d</th><th>5d</th><th>20d</th>
                <th style={{ paddingRight: 16 }}>Breadth</th></tr></thead>
              <tbody>
                {SECTORS.map((s) => (
                  <tr key={s.name} className="hoverable">
                    <td style={{ paddingLeft: 16 }}>{s.name}</td>
                    <td className={s.chg >= 0 ? "up" : "down"}>{s.chg > 0 ? "+" : ""}{s.chg.toFixed(2)}%</td>
                    <td className={s.chg5 >= 0 ? "up" : "down"}>{s.chg5 > 0 ? "+" : ""}{s.chg5.toFixed(2)}%</td>
                    <td className={s.chg20 >= 0 ? "up" : "down"}>{s.chg20 > 0 ? "+" : ""}{s.chg20.toFixed(2)}%</td>
                    <td style={{ paddingRight: 16 }}>
                      <span className="row" style={{ justifyContent: "flex-end", gap: 8 }}>
                        <span className="bar" style={{ width: 60 }}>
                          <i style={{ width: `${s.breadth * 100}%`,
                            background: s.breadth >= 0.5 ? "var(--up)" : "var(--down)" }} /></span>
                        {Math.round(s.breadth * 100)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)" }}>
            <p className="meta">
              Breadth is the share of constituents advancing. A sector rising on two names is a
              stock story; one rising on eight of ten is a re-rating, and the latter has
              historically persisted longer.
            </p>
          </div>
        </div>

        <SectionHead title="What drives each sector" />
        <div className="grid g2 mb32">
          {SECTORS.map((s, i) => {
            const hm = HEATMAP.find((h) => s.name.includes(h.sector) || h.sector.includes(s.name.replace("Nifty ", "")));
            return (
              <div key={s.name} className={`card reveal ${i % 2 ? "d1" : ""}`}>
                <div className="between mb8">
                  <h3 style={{ fontSize: 18 }}>{s.name}</h3>
                  <span className={`num ${s.chg20 >= 0 ? "up" : "down"}`} style={{ fontSize: 14, fontWeight: 600 }}>
                    {s.chg20 > 0 ? "+" : ""}{s.chg20}% <span className="meta">20d</span></span>
                </div>
                <p className="sub" style={{ fontSize: 13 }}>{DRIVERS[s.name] ?? ""}</p>
                {hm && (
                  <div className="row mt12" style={{ gap: 6 }}>
                    {hm.names.slice(0, 5).map(([sym]) => (
                      <Link key={sym as string} href={`/ticker/${encodeURIComponent(`NSE:${sym}`)}`}
                        className="chip">{sym}</Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mb32">
          <Notice>
            Sector drivers describe mechanisms. We publish no impact estimate at sector level —
            the analog samples are thinner than at index or single-stock level.
          </Notice>
        </div>
      </div>
    </>
  );
}
