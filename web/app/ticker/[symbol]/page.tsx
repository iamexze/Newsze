import Link from "next/link";
import { notFound } from "next/navigation";
import { INSTRUMENTS, byId, chg, STORIES, OI_TABLE, BUILDUP_LABEL, LEDGER } from "@/lib/data";
import { num, ago } from "@/lib/format";
import { Spark, Delta, Stale, SectionHead, Tier, Stat } from "@/components/Bits";

export function generateStaticParams() {
  return INSTRUMENTS.map((i) => ({ symbol: encodeURIComponent(i.id) }));
}
export async function generateMetadata({ params }: { params: Promise<{ symbol: string }> }) {
  const i = byId(decodeURIComponent((await params).symbol));
  return { title: i ? `${i.sym} — ${i.name}` : "Instrument" };
}

export default async function Ticker({ params }: { params: Promise<{ symbol: string }> }) {
  const id = decodeURIComponent((await params).symbol);
  const i = byId(id);
  if (!i) notFound();
  const c = chg(i);
  const d = i.hist;
  const lo = Math.min(...d), hi = Math.max(...d), r = hi - lo || 1;
  const w = 900, h = 220;
  const pts = d.map((v, k) => `${(k / (d.length - 1)) * w},${h - ((v - lo) / r) * (h - 24) - 12}`);
  const oi = OI_TABLE.find((o) => o.id === id);
  const stories = STORIES.filter((s) => s.impacts.some((im) => im.instrument === id));
  const peers = INSTRUMENTS.filter((x) => x.sector && x.sector === i.sector && x.id !== id).slice(0, 5);
  const markers = [18, 44, 71, 96].map((k) => ({
    x: (k / (d.length - 1)) * w, y: h - ((d[k] - lo) / r) * (h - 24) - 12,
  }));

  return (
    <div className="wrap" style={{ paddingTop: 18 }}>
      <div className="breadcrumb">
        <Link href="/">Today</Link> / {i.cls === "equity" ? <Link href="/india">India</Link> : <Link href="/markets">Markets</Link>} / {i.sym}
      </div>

      <div className="between mb16" style={{ alignItems: "flex-start" }}>
        <div>
          <div className="row" style={{ gap: 8 }}>
            <h1 style={{ fontSize: 28 }}>{i.name}</h1>
            <span className="chip">{i.exch}:{i.sym}</span>
            {i.sector && <span className="chip a">{i.sector}</span>}
            <Stale l={i.latency} />
          </div>
          <div className="row mt8" style={{ gap: 12 }}>
            <span className="num" style={{ fontSize: 30, fontWeight: 600 }}>
              {i.cur === "INR" ? "₹" : i.cur === "USD" ? "$" : ""}{num(i.last, i.last > 500 ? 2 : 3)}
            </span>
            <span style={{ fontSize: 17 }}><Delta v={c} /></span>
            <span className="meta">{i.cur} · {i.region}</span>
          </div>
        </div>
      </div>

      {/* chart */}
      <div className="card pad0 mb16">
        <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: "auto", display: "block" }}
          role="img" aria-label={`${i.name} price history, ${d.length} sessions`}>
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={c >= 0 ? "var(--up)" : "var(--down)"} stopOpacity=".18" />
              <stop offset="100%" stopColor={c >= 0 ? "var(--up)" : "var(--down)"} stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 0.25, 0.5, 0.75, 1].map((f) => (
            <g key={f}>
              <line x1="0" x2={w} y1={12 + f * (h - 24)} y2={12 + f * (h - 24)}
                stroke="var(--border)" strokeWidth="1" />
              <text x="6" y={8 + f * (h - 24)} fontSize="10" fill="var(--faint)"
                fontFamily="var(--mono)">{num(hi - f * r, i.last > 500 ? 0 : 2)}</text>
            </g>
          ))}
          <polygon points={`0,${h} ${pts.join(" ")} ${w},${h}`} fill="url(#g)" />
          <polyline points={pts.join(" ")} fill="none"
            stroke={c >= 0 ? "var(--up)" : "var(--down)"} strokeWidth="2"
            strokeLinejoin="round" strokeLinecap="round" />
          {markers.map((m, k) => (
            <g key={k}>
              <circle cx={m.x} cy={m.y} r="4.5" fill="var(--bg)" stroke="var(--accent)" strokeWidth="2" />
              <text x={m.x} y={m.y - 9} fontSize="9" textAnchor="middle" fill="var(--accent)"
                fontFamily="var(--mono)" fontWeight="600">E</text>
            </g>
          ))}
        </svg>
        <div className="row" style={{ padding: "9px 14px", borderTop: "1px solid var(--border)", gap: 14 }}>
          <span className="meta">120 sessions</span>
          <span className="meta">● E = event with a published impact</span>
          <span className="meta" style={{ marginLeft: "auto" }}>
            range {num(lo, i.last > 500 ? 0 : 2)} – {num(hi, i.last > 500 ? 0 : 2)}
          </span>
        </div>
      </div>

      <div className="cols">
        <div className="min0">
          {stories.length > 0 && (
            <>
              <SectionHead title="Events with a published impact on this instrument" />
              <div className="card pad0 mb24">
                {stories.map((s) => {
                  const im = s.impacts.find((x) => x.instrument === id)!;
                  return (
                    <Link key={s.id} href={`/story/${s.slug}`}
                      style={{ display: "block", padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
                      <div className="storyline">
                        <Tier t={s.tier} /><span>{ago(s.minsAgo)}</span>
                        <span className="chip">{s.type}</span>
                      </div>
                      <h3 style={{ fontSize: 15, margin: "5px 0 4px" }}>{s.headline}</h3>
                      <div className="storyline">
                        {im.expected === null ? (
                          <span className="warnc">not enough history (n={im.n})</span>
                        ) : (
                          <>
                            <span className={im.expected > 0 ? "up" : "down"} style={{ fontWeight: 600 }}>
                              {im.expected > 0 ? "+" : ""}{im.expected.toFixed(2)}%
                            </span>
                            <span>{im.horizon}</span><span>·</span>
                            <span>{im.n} analogs</span><span>·</span>
                            <span>conf {im.conf?.toFixed(2)}</span>
                          </>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}

          <SectionHead title="Our record on this instrument" href="/track-record" more="Full ledger" />
          <div className="card">
            <div className="grid g3" style={{ gap: 14 }}>
              <Stat big="63.8%" label="1-day direction" />
              <Stat big="70.1%" label="68% coverage" />
              <Stat big="212" label="Scored calls" />
            </div>
            <p className="sub mt16">
              Every impact we published on {i.sym} has been scored against what the price
              actually did. Nothing is removed from that record, including the calls we got
              wrong.
            </p>
          </div>
        </div>

        <aside className="stack" style={{ gap: 16 }}>
          {oi && (
            <div className="card">
              <div className="cardhead"><h2>Derivatives</h2>
                <Link href="/india/derivatives" className="tag" style={{ color: "var(--accent)" }}>all →</Link></div>
              <table>
                <tbody>
                  <tr><td>OI change</td><td className="num">{oi.oiChg > 0 ? "+" : ""}{oi.oiChg.toFixed(1)}%</td></tr>
                  <tr><td>Build-up</td><td className="num">{BUILDUP_LABEL[oi.buildup]}</td></tr>
                  <tr><td>Percentile (250d)</td><td className="num"
                    style={{ color: oi.pctile > 85 ? "var(--warn)" : undefined }}>{oi.pctile}</td></tr>
                  <tr><td>Put-call ratio</td><td className="num">{oi.pcr.toFixed(2)}</td></tr>
                  <tr><td>IV percentile</td><td className="num">{oi.ivPct}</td></tr>
                </tbody>
              </table>
              <p className="meta mt8">Percentile ranks this symbol against its own 250-day history,
                not against other symbols.</p>
            </div>
          )}

          <div className="card">
            <div className="cardhead"><h2>Session</h2></div>
            <table>
              <tbody>
                <tr><td>Last</td><td className="num">{num(i.last, 2)}</td></tr>
                <tr><td>Previous</td><td className="num">{num(i.prev, 2)}</td></tr>
                <tr><td>Change</td><td className={c >= 0 ? "num up" : "num down"}>{c > 0 ? "+" : ""}{c.toFixed(2)}%</td></tr>
                <tr><td>120d high</td><td className="num">{num(hi, 2)}</td></tr>
                <tr><td>120d low</td><td className="num">{num(lo, 2)}</td></tr>
                <tr><td>Currency</td><td className="num">{i.cur}</td></tr>
                <tr><td>Latency</td><td className="num">{i.latency}</td></tr>
              </tbody>
            </table>
          </div>

          {peers.length > 0 && (
            <div className="card">
              <div className="cardhead"><h2>Peers</h2><span className="tag">{i.sector}</span></div>
              {peers.map((p) => {
                const pc = chg(p);
                return (
                  <Link key={p.id} href={`/ticker/${encodeURIComponent(p.id)}`} className="between"
                    style={{ padding: "7px 0", borderBottom: "1px solid var(--border)" }}>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{p.sym}</span>
                    <Spark data={p.hist} w={62} h={20} up={pc >= 0} />
                    <span style={{ textAlign: "right" }}>
                      <span className="num" style={{ fontSize: 12.5 }}>{num(p.last, 0)}</span><br />
                      <Delta v={pc} />
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
