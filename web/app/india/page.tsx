import Link from "next/link";
import { INSTRUMENTS, byId, chg, SECTORS, OI_TABLE, BUILDUP_LABEL, FLOWS, MACRO_IN,
  CONTRIB, STORIES, PARTICIPANTS } from "@/lib/data";
import { num, crore } from "@/lib/format";
import { SectionHead, Delta, Spark, Stat, QuoteRow, Tier } from "@/components/Bits";
import Waterfall from "@/components/Waterfall";
import StoryCard from "@/components/StoryCard";

export const metadata = { title: "India" };

export default function IndiaHub() {
  const idx = ["IDX:NIFTY50","IDX:NIFTYBANK","IDX:FINNIFTY","IDX:MIDCAP","IDX:SENSEX","IDX:INDIAVIX"];
  const stories = STORIES.filter((s) => s.region === "IN");
  const fiiNet = FLOWS.slice(0, 13).reduce((a, f) => a + f.fii, 0);
  const diiNet = FLOWS.slice(0, 13).reduce((a, f) => a + f.dii, 0);

  return (
    <div className="wrap" style={{ paddingTop: 18 }}>
      <div className="breadcrumb"><Link href="/">Today</Link> / India</div>
      <div className="mb24">
        <div className="kicker">NSE · BSE · end-of-day and 15-minute delayed</div>
        <h1 style={{ fontSize: 32, marginTop: 4 }}>Indian markets</h1>
        <p className="sub" style={{ maxWidth: 720, marginTop: 6 }}>
          Index attribution, full derivatives microstructure, institutional flows and the macro
          series that move them — with the events that explain each one linked alongside.
        </p>
      </div>

      {/* index cards */}
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(214px,1fr))" }}>
        {idx.map((id) => {
          const i = byId(id)!;
          const c = chg(i);
          return (
            <Link key={id} href={`/ticker/${encodeURIComponent(id)}`} className="card">
              <div className="between mb8">
                <span className="label">{i.sym}</span>
                <span className="meta">{i.exch}</span>
              </div>
              <div className="num" style={{ fontSize: 22, fontWeight: 600 }}>{num(i.last, 2)}</div>
              <div className="mt4"><Delta v={c} /></div>
              <div className="mt8"><Spark data={i.hist} w={190} h={30} up={c >= 0} /></div>
            </Link>
          );
        })}
      </div>

      <div className="cols mt32">
        <div className="min0">
          {/* attribution */}
          <SectionHead title="What moved the index today" />
          <div className="card mb24">
            <p className="sub mb16">
              Index points contributed by each constituent. The index fell; two stocks did most
              of the damage and one did most of the offsetting.
            </p>
            <Waterfall rows={CONTRIB.map((c) => ({ name: byId(c.id)!.sym, pts: c.pts }))} />
          </div>

          {/* OI */}
          <SectionHead title="Derivatives — open interest build-up" href="/india/derivatives" more="Full derivatives" />
          <div className="card pad0 mb24">
            <div className="scrollx">
              <table>
                <thead><tr><th style={{ paddingLeft: 14 }}>Symbol</th><th>Price</th><th>OI change</th>
                  <th>Classification</th><th>PCR</th><th>IV %ile</th><th style={{ paddingRight: 14 }}>250d %ile</th></tr></thead>
                <tbody>
                  {OI_TABLE.map((r) => {
                    const i = byId(r.id)!;
                    const tone = r.buildup === "LONG_BUILDUP" ? "var(--up)"
                      : r.buildup === "SHORT_BUILDUP" ? "var(--down)"
                      : r.buildup === "SHORT_COVERING" ? "var(--up)" : "var(--muted)";
                    return (
                      <tr key={r.id} className="hoverable">
                        <td style={{ paddingLeft: 14 }}>
                          <Link href={`/ticker/${encodeURIComponent(r.id)}`}>{i.sym}</Link></td>
                        <td className={r.priceChg >= 0 ? "up" : "down"}>
                          {r.priceChg > 0 ? "+" : ""}{r.priceChg.toFixed(2)}%</td>
                        <td>{r.oiChg > 0 ? "+" : ""}{r.oiChg.toFixed(1)}%</td>
                        <td style={{ fontFamily: "var(--sans)", fontSize: 12, color: tone, fontWeight: 500 }}>
                          {BUILDUP_LABEL[r.buildup]}</td>
                        <td>{r.pcr.toFixed(2)}</td>
                        <td>{r.ivPct}</td>
                        <td style={{ paddingRight: 14, color: r.pctile > 85 ? "var(--warn)" : undefined,
                          fontWeight: r.pctile > 85 ? 600 : 400 }}>{r.pctile}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ padding: "10px 14px", borderTop: "1px solid var(--border)" }}>
              <p className="meta">
                Build-up classification is the standard four-way read of price change against
                open-interest change. The percentile ranks today&apos;s OI change against that
                symbol&apos;s own 250-day history — never across symbols, which have different
                liquidity profiles.
              </p>
            </div>
          </div>

          {/* sectors */}
          <SectionHead title="Sectors" />
          <div className="card pad0 mb24">
            <div className="scrollx">
              <table>
                <thead><tr><th style={{ paddingLeft: 14 }}>Sector</th><th>1d</th><th>5d</th><th>20d</th>
                  <th style={{ paddingRight: 14 }}>Breadth</th></tr></thead>
                <tbody>
                  {SECTORS.map((s) => (
                    <tr key={s.name} className="hoverable">
                      <td style={{ paddingLeft: 14 }}>{s.name}</td>
                      <td className={s.chg >= 0 ? "up" : "down"}>{s.chg > 0 ? "+" : ""}{s.chg.toFixed(2)}%</td>
                      <td className={s.chg5 >= 0 ? "up" : "down"}>{s.chg5 > 0 ? "+" : ""}{s.chg5.toFixed(2)}%</td>
                      <td className={s.chg20 >= 0 ? "up" : "down"}>{s.chg20 > 0 ? "+" : ""}{s.chg20.toFixed(2)}%</td>
                      <td style={{ paddingRight: 14 }}>
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
          </div>

          <SectionHead title="India stories" href="/wire?region=IN" more="All" />
          {stories.map((s) => <StoryCard key={s.id} s={s} />)}
        </div>

        <aside className="stack" style={{ gap: 16 }}>
          <div className="card">
            <div className="cardhead"><h2>Institutional flows</h2>
              <Link href="/india/flows" className="tag" style={{ color: "var(--accent)" }}>detail →</Link></div>
            <div className="grid g2" style={{ gap: 12 }}>
              <Stat big={crore(fiiNet * 1e7, 0)} label="FII, 13 sessions" tone="down" />
              <Stat big={crore(diiNet * 1e7, 0)} label="DII, 13 sessions" tone="up" />
            </div>
            <p className="sub mt12">
              Domestic institutions have absorbed foreign selling in eleven of the last thirteen
              sessions. That is the defining structural feature of this market.
            </p>
          </div>

          <div className="card">
            <div className="cardhead"><h2>Smart money vs retail</h2><span className="tag">index futures</span></div>
            {PARTICIPANTS.map((p) => {
              const net = p.idxFutLong - p.idxFutShort;
              const tot = p.idxFutLong + p.idxFutShort;
              return (
                <div key={p.who} className="between" style={{ padding: "7px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{p.who}</span>
                  <span className="row" style={{ gap: 8 }}>
                    <span className="wfb" style={{ width: 76, height: 12 }}>
                      <i style={{ [net >= 0 ? "left" : "right"]: "50%",
                        width: `${(Math.abs(net) / tot) * 50}%`,
                        background: net >= 0 ? "var(--up)" : "var(--down)" } as React.CSSProperties} />
                    </span>
                    <span className={`num ${net >= 0 ? "up" : "down"}`} style={{ fontSize: 12, width: 64, textAlign: "right" }}>
                      {net > 0 ? "+" : ""}{(net / 1000).toFixed(1)}k
                    </span>
                  </span>
                </div>
              );
            })}
            <p className="meta mt8">Net index-futures position by participant category.
              FIIs are net short; clients are net long — the divergence is the signal.</p>
          </div>

          <div className="card">
            <div className="cardhead"><h2>Macro</h2>
              <Link href="/india/macro" className="tag" style={{ color: "var(--accent)" }}>all →</Link></div>
            <table>
              <tbody>
                {MACRO_IN.slice(0, 7).map((m) => (
                  <tr key={m.name}>
                    <td style={{ fontSize: 12.5 }}>{m.name}</td>
                    <td className="num">{m.value}{m.unit.startsWith("%") ? "%" : ""}</td>
                    <td style={{ width: 40 }}>
                      {m.surprise !== null && (
                        <span className={m.surprise > 0 ? "up" : m.surprise < 0 ? "down" : "flat"}
                          style={{ fontSize: 11 }}>
                          {m.surprise > 0 ? "▲" : m.surprise < 0 ? "▼" : "▬"}{Math.abs(m.surprise).toFixed(1)}σ
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="meta mt8">σ = standardised surprise against consensus.</p>
          </div>

          <div className="card">
            <div className="cardhead"><h2>Currency &amp; rates</h2></div>
            {["FX:USDINR","RT:IN10Y","CMD:BRENT"].map((id) => <QuoteRow key={id} id={id} />)}
          </div>
        </aside>
      </div>
    </div>
  );
}
