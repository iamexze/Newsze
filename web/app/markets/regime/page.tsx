import Link from "next/link";
import { REGIMES } from "@/lib/research";
import { RISK } from "@/lib/data";
import { SectionHead, Notice, Stat } from "@/components/Bits";

export const metadata = { title: "Market regime" };

export default function Regime() {
  const current = REGIMES.find((r) => r.active)!;
  return (
    <>
      <section className="band" style={{ paddingBlock: "40px 34px" }}>
        <div className="wrap">
          <div className="kicker accent">Regime detector</div>
          <div className="verdict mt16">
            <div className="glyph">◆</div>
            <div>
              <div className="figure lg">{current.name}</div>
              <div className="statlbl">Current regime · since {current.from}</div>
            </div>
          </div>
          <p className="sub" style={{ fontSize: 16.5, maxWidth: 740, marginTop: 20, lineHeight: 1.55 }}>
            {current.desc} Regime matters because almost every relationship on this site is
            conditional on it — the US transmission channel is weak in calm markets and strong
            in stress, and a model fitted across both will be wrong in each.
          </p>
          <div className="grid g4 mt32" style={{ gap: 20 }}>
            <div><div className="figure lg">{current.nifty > 0 ? "+" : ""}{current.nifty}%</div>
              <div className="statlbl">Nifty, regime to date</div></div>
            <div><div className="figure lg">{current.vix}</div>
              <div className="statlbl">Average India VIX</div></div>
            <div><div className="figure lg">{Math.round(current.breadth * 100)}%</div>
              <div className="statlbl">Average breadth</div></div>
            <div><div className="figure lg">{REGIMES.length}</div>
              <div className="statlbl">Regimes identified in the sample</div></div>
          </div>
        </div>
      </section>

      <div className="wrap" style={{ paddingTop: 28 }}>
        <div className="breadcrumb"><Link href="/">Today</Link> / <Link href="/markets">Markets</Link> / Regime</div>

        <SectionHead title="Regime history" />
        <div className="card pad0 mb32">
          <div className="scrollx">
            <table>
              <thead><tr><th style={{ paddingLeft: 16 }}>Regime</th><th>From</th><th>To</th>
                <th>Nifty</th><th>Avg VIX</th><th style={{ paddingRight: 16 }}>Breadth</th></tr></thead>
              <tbody>
                {REGIMES.map((r) => (
                  <tr key={r.name} className="hoverable"
                    style={{ background: r.active ? "var(--accent-soft)" : undefined }}>
                    <td style={{ paddingLeft: 16 }}>
                      {r.name}{r.active && <span className="chip a" style={{ marginLeft: 8 }}>current</span>}</td>
                    <td style={{ color: "var(--muted)" }}>{r.from}</td>
                    <td style={{ color: "var(--muted)" }}>{r.to}</td>
                    <td className={r.nifty >= 0 ? "up" : "down"}>{r.nifty > 0 ? "+" : ""}{r.nifty}%</td>
                    <td style={{ color: r.vix > 18 ? "var(--warn)" : undefined }}>{r.vix}</td>
                    <td style={{ paddingRight: 16 }}>
                      <span className="row" style={{ justifyContent: "flex-end", gap: 9 }}>
                        <span className="bar" style={{ width: 56 }}>
                          <i style={{ width: `${r.breadth * 100}%`,
                            background: r.breadth >= 0.5 ? "var(--up)" : "var(--down)" }} /></span>
                        {Math.round(r.breadth * 100)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)" }}>
            {REGIMES.map((r) => (
              <p key={r.name} className="sub" style={{ marginBottom: 6 }}>
                <strong>{r.name}</strong> — {r.desc}
              </p>
            ))}
          </div>
        </div>

        <div className="cols mb32">
          <div className="min0">
            <SectionHead title="Why regime conditions everything" />
            <div className="article">
              <p>
                Studies covering 2023 to 2025 find the correlation between the Nifty and the
                S&amp;P 500 is low on average but rises sharply during periods of market stress.
                That single property breaks most naive modelling: a relationship estimated over
                a full sample will understate the connection in exactly the episodes where it
                matters, and overstate it the rest of the time.
              </p>
              <p>
                This is why every impact estimate on this site includes volatility regime,
                trend state and breadth among its matching features — a historical analog drawn
                from a different regime is a weaker analog, and the engine treats it as one.
                It is also why the analog pages carry a concentration warning when the matched
                cases cluster inside a single window.
              </p>
            </div>
          </div>
          <aside>
            <div className="card">
              <div className="cardhead"><h2>Current risk readings</h2>
                <Link href="/markets/risk" className="tag" style={{ color: "var(--accent)" }}>all →</Link></div>
              <div className="stack" style={{ gap: 10 }}>
                {RISK.slice(0, 5).map((r) => (
                  <div key={r.name}>
                    <div className="between" style={{ marginBottom: 3 }}>
                      <span style={{ fontSize: 12.5 }}>{r.name}</span>
                      <span className="num" style={{ fontSize: 12 }}>{r.value}</span>
                    </div>
                    <div className="bar"><i style={{ width: `${r.pct}%`,
                      background: r.pct > 70 ? "var(--warn)" : "var(--accent)" }} /></div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <div className="mb32">
          <Notice>
            Regime labels are a classification of past conditions, assigned after the fact.
            Identifying the current regime correctly in real time is substantially harder than
            labelling it in hindsight, and we publish no estimate conditioned on a regime call
            alone.
          </Notice>
        </div>
      </div>
    </>
  );
}
