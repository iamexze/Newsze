import Link from "next/link";
import { LEDGER, BRIDGE } from "@/lib/data";
import { SectionHead, Stat, Notice } from "@/components/Bits";

export const metadata = {
  title: "Accuracy Ledger",
  description: "Every estimate Newze has published, scored against what actually happened. Nothing is removed.",
};

function Calibration() {
  const W = 420, H = 300, P = 40;
  const x = (v: number) => P + (v - 0.5) * 2 * (W - P - 14);
  const y = (v: number) => H - P - (v - 0.5) * 2 * (H - P - 14);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }} role="img"
      aria-label="Calibration curve: predicted probability against realised frequency.">
      {[0.5, 0.6, 0.7, 0.8].map((t) => (
        <g key={t}>
          <line x1={x(t)} y1={P - 10} x2={x(t)} y2={H - P} stroke="var(--border)" strokeWidth="1" />
          <line x1={P} y1={y(t)} x2={W - 14} y2={y(t)} stroke="var(--border)" strokeWidth="1" />
          <text x={x(t)} y={H - P + 16} fontSize="10" fill="var(--faint)" textAnchor="middle"
            fontFamily="var(--mono)">{(t * 100).toFixed(0)}%</text>
          <text x={P - 8} y={y(t) + 3} fontSize="10" fill="var(--faint)" textAnchor="end"
            fontFamily="var(--mono)">{(t * 100).toFixed(0)}%</text>
        </g>
      ))}
      {/* ideal */}
      <line x1={x(0.5)} y1={y(0.5)} x2={x(0.8)} y2={y(0.8)} stroke="var(--border-strong)"
        strokeWidth="1.5" strokeDasharray="4 4" />
      <text x={x(0.78)} y={y(0.8) - 8} fontSize="10" fill="var(--muted)" textAnchor="end"
        fontFamily="var(--mono)">perfect calibration</text>
      {/* observed */}
      <polyline points={LEDGER.calibration.map((c) => `${x(c.predicted)},${y(c.realised)}`).join(" ")}
        fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" />
      {LEDGER.calibration.map((c) => (
        <g key={c.bucket}>
          <circle cx={x(c.predicted)} cy={y(c.realised)} r={4 + (c.n / 1200) * 5}
            fill="var(--accent)" opacity=".9" />
          <title>{c.bucket}: predicted {(c.predicted * 100).toFixed(1)}%, realised {(c.realised * 100).toFixed(1)}%, n={c.n}</title>
        </g>
      ))}
      <text x={W / 2} y={H - 6} fontSize="10.5" fill="var(--muted)" textAnchor="middle">
        Predicted probability</text>
      <text x={12} y={H / 2} fontSize="10.5" fill="var(--muted)" textAnchor="middle"
        transform={`rotate(-90 12 ${H / 2})`}>Realised frequency</text>
    </svg>
  );
}

export default function TrackRecord() {
  const o = LEDGER.overall;
  return (
    <div className="wrap" style={{ paddingTop: 18 }}>
      <div className="breadcrumb"><Link href="/">Today</Link> / Track record</div>
      <div className="mb24">
        <div className="kicker">Public · permanent · nothing removed</div>
        <h1 style={{ fontSize: 34, marginTop: 4 }}>The Accuracy Ledger</h1>
        <p className="sub" style={{ maxWidth: 760, marginTop: 8, fontSize: 15 }}>
          Every impact estimate Newze has ever published, scored against what the price actually
          did. There is no mechanism in our systems to hide an individual call — only to
          suppress an entire event class, and a suppression appears on this page too.
          Published since {LEDGER.since} on model {LEDGER.modelVersion}.
        </p>
      </div>

      <div className="grid g4 mb24">
        <Stat big={`${(o.dirAcc * 100).toFixed(1)}%`} label="Direction accuracy" />
        <Stat big={`${(o.coverage68 * 100).toFixed(1)}%`} label="68% band coverage" />
        <Stat big={o.brier.toFixed(3)} label="Brier score" />
        <Stat big={o.n.toLocaleString("en-IN")} label="Calls scored" />
      </div>

      <div className="cols">
        <div className="min0">
          <SectionHead title="Calibration" />
          <div className="card mb24">
            <div className="grid" style={{ gridTemplateColumns: "minmax(0,1fr) 230px", gap: 20 }}>
              <div className="min0"><Calibration /></div>
              <div>
                <p className="sub">
                  A well-calibrated forecaster who says &ldquo;60% likely&rdquo; is right about
                  60% of the time. The dashed line is perfect calibration; our curve should sit
                  on it. Dot size is the number of calls in that bucket.
                </p>
                <hr className="mt12 mb12" />
                <table>
                  <thead><tr><th>Bucket</th><th>Said</th><th>Was</th><th>n</th></tr></thead>
                  <tbody>
                    {LEDGER.calibration.map((c) => (
                      <tr key={c.bucket}>
                        <td style={{ fontSize: 11.5 }}>{c.bucket}</td>
                        <td>{(c.predicted * 100).toFixed(1)}</td>
                        <td className={c.realised >= c.predicted ? "up" : "down"}>
                          {(c.realised * 100).toFixed(1)}</td>
                        <td style={{ color: "var(--faint)" }}>{c.n}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <SectionHead title="By event class" />
          <div className="card pad0 mb24">
            <div className="scrollx">
              <table>
                <thead><tr><th style={{ paddingLeft: 14 }}>Event type</th><th>n</th><th>Direction</th>
                  <th>Coverage</th><th>Brier</th><th>Trend</th><th style={{ paddingRight: 14 }}>Status</th></tr></thead>
                <tbody>
                  {LEDGER.byType.map((t) => (
                    <tr key={t.type} className="hoverable"
                      style={{ opacity: t.status === "suppressed" ? .62 : 1 }}>
                      <td style={{ paddingLeft: 14, fontFamily: "var(--mono)", fontSize: 11.5 }}>{t.type}</td>
                      <td>{t.n.toLocaleString("en-IN")}</td>
                      <td style={{ fontWeight: 600,
                        color: t.dir >= 0.6 ? "var(--up)" : t.dir < 0.55 ? "var(--down)" : undefined }}>
                        {(t.dir * 100).toFixed(1)}%</td>
                      <td>{(t.cov * 100).toFixed(1)}%</td>
                      <td style={{ color: t.brier > 0.24 ? "var(--warn)" : undefined }}>{t.brier.toFixed(3)}</td>
                      <td className={t.trend === "up" ? "up" : t.trend === "down" ? "down" : "flat"}>
                        {t.trend === "up" ? "▲" : t.trend === "down" ? "▼" : "▬"}</td>
                      <td style={{ paddingRight: 14 }}>
                        {t.status === "published" && <span className="chip up">published</span>}
                        {t.status === "watch" && <span className="chip w">watch</span>}
                        {t.status === "suppressed" && <span className="chip dn">suppressed</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ padding: "12px 14px", borderTop: "1px solid var(--border)" }}>
              {LEDGER.byType.filter((t) => t.status === "suppressed").map((t) => (
                <p key={t.type} className="sub" style={{ marginBottom: 6 }}>
                  <span className="chip dn" style={{ marginRight: 7 }}>{t.type}</span>
                  Auto-suppressed {t.suppressedOn}. {t.reason}. We stopped publishing estimates
                  for this class and left the record of why.
                </p>
              ))}
            </div>
          </div>

          <SectionHead title="By horizon" />
          <div className="card pad0 mb24">
            <div className="scrollx">
              <table>
                <thead><tr><th style={{ paddingLeft: 14 }}>Horizon</th><th>n</th><th>Direction</th>
                  <th>Coverage</th><th style={{ paddingRight: 14 }}>Brier</th></tr></thead>
                <tbody>
                  {LEDGER.byHorizon.map((h) => (
                    <tr key={h.h} className="hoverable">
                      <td style={{ paddingLeft: 14 }}>{h.h}</td>
                      <td>{h.n.toLocaleString("en-IN")}</td>
                      <td style={{ fontWeight: 600 }}>{(h.dir * 100).toFixed(1)}%</td>
                      <td>{(h.cov * 100).toFixed(1)}%</td>
                      <td style={{ paddingRight: 14 }}>{h.brier.toFixed(3)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ padding: "12px 14px", borderTop: "1px solid var(--border)" }}>
              <p className="meta">
                Accuracy decays with horizon, as it should. Anyone claiming a 20-day directional
                edge comparable to their 15-minute edge is not measuring honestly.
              </p>
            </div>
          </div>
        </div>

        <aside className="stack" style={{ gap: 16 }}>
          <div className="card">
            <div className="cardhead"><h2>Overnight Bridge</h2><span className="tag">30 days</span></div>
            <div className="grid g2" style={{ gap: 12 }}>
              <Stat big={`${BRIDGE.mae30}`} label="Mean error, pts" />
              <Stat big={`${BRIDGE.onTime30}/30`} label="On time" />
            </div>
            <Link href="/bridge" className="sub mt12" style={{ color: "var(--accent)", fontWeight: 600 }}>
              Daily record →</Link>
          </div>

          <div className="card">
            <div className="cardhead"><h2>Withdrawals &amp; corrections</h2>
              <span className="tag">{LEDGER.withdrawals.length}</span></div>
            <ul className="timeline">
              {LEDGER.withdrawals.map((w) => (
                <li key={w.date}>
                  <div className="meta">{w.date}</div>
                  <div style={{ fontSize: 13, fontWeight: 500, marginTop: 2 }}>{w.what}</div>
                  <div className="sub" style={{ fontSize: 12 }}>{w.reason}</div>
                </li>
              ))}
            </ul>
            <p className="meta mt12">
              A withdrawn estimate stays in the record with its reason shown. It is excluded
              from the accuracy figures and the exclusion is itself disclosed.
            </p>
          </div>

          <div className="card">
            <div className="cardhead"><h2>Model history</h2></div>
            {LEDGER.versions.map((v) => (
              <div key={v.v} style={{ padding: "9px 0", borderBottom: "1px solid var(--border)" }}>
                <div className="between">
                  <span className="num" style={{ fontSize: 12 }}>{v.v}</span>
                  <span className={`num ${v.dir >= 0.6 ? "up" : ""}`} style={{ fontSize: 12 }}>
                    {(v.dir * 100).toFixed(1)}%</span>
                </div>
                <div className="meta">from {v.from} · n={v.n.toLocaleString("en-IN")}</div>
                <div className="sub" style={{ fontSize: 12 }}>{v.note}</div>
              </div>
            ))}
            <p className="meta mt12">
              Superseded versions keep their own record. We do not retrospectively re-score old
              calls with a newer model — that would flatter us.
            </p>
          </div>

          <Notice>
            A track record is not a promise. Calibration tells you how much weight to give an
            estimate; it does not tell you what any individual estimate will do.
          </Notice>
        </aside>
      </div>
    </div>
  );
}
