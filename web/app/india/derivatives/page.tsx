import Link from "next/link";
import { OPTION_CHAIN, OI_TABLE, BUILDUP_LABEL, byId, PARTICIPANTS, STORIES } from "@/lib/data";
import { num } from "@/lib/format";
import { SectionHead, Stat, Notice } from "@/components/Bits";
import StoryCard from "@/components/StoryCard";
import Explain from "@/components/Explain";

export const metadata = { title: "Derivatives & open interest" };

export default function Derivatives() {
  const oc = OPTION_CHAIN;
  const maxOi = Math.max(...oc.rows.flatMap((r) => [r.ceOi, r.peOi]));
  const stories = STORIES.filter((s) => s.section === "Derivatives");
  const totCe = oc.rows.reduce((a, r) => a + r.ceOi, 0);
  const totPe = oc.rows.reduce((a, r) => a + r.peOi, 0);

  return (
    <div className="wrap" style={{ paddingTop: 18 }}>
      <div className="breadcrumb"><Link href="/">Today</Link> / <Link href="/india">India</Link> / Derivatives</div>
      <div className="mb24">
        <div className="kicker">NSE F&amp;O · end of day</div>
        <h1 style={{ fontSize: 32, marginTop: 4 }}>Derivatives &amp; open interest</h1>
        <p className="sub" style={{ maxWidth: 720, marginTop: 6 }}>
          Build-up classification, the option chain by strike, put-call ratio, max pain, implied
          volatility and participant-wise positioning — the microstructure that decides an
          Indian trading day.
        </p>
      </div>

      <div className="grid g4 mb24">
        <Stat big={num(oc.spot, 0)} label={`${byId(oc.underlying)!.sym} spot`} />
        <Explain metric="pcr"><Stat big={oc.pcr.toFixed(2)} label="Put-call ratio" /></Explain>
        <Explain metric="max-pain"><Stat big={num(oc.maxPain, 0)} label="Max pain" /></Explain>
        <Stat big={`${oc.dte}d`} label={`To expiry ${oc.expiry}`} />
      </div>

      <div className="cols">
        <div className="min0">
          {/* option chain */}
          <SectionHead title={`Option chain — ${byId(oc.underlying)!.sym}, ${oc.expiry}`} />
          <div className="card pad0 mb24">
            <div className="scrollx">
              <table>
                <thead>
                  <tr>
                    <th colSpan={4} style={{ textAlign: "center", color: "var(--down)",
                      borderBottom: "1px solid var(--border)" }}>CALLS</th>
                    <th style={{ textAlign: "center" }}>STRIKE</th>
                    <th colSpan={4} style={{ textAlign: "center", color: "var(--up)",
                      borderBottom: "1px solid var(--border)" }}>PUTS</th>
                  </tr>
                  <tr>
                    <th style={{ paddingLeft: 14 }}>OI</th><th>Chg</th><th>IV</th><th>LTP</th>
                    <th style={{ textAlign: "center" }}>—</th>
                    <th>LTP</th><th>IV</th><th>Chg</th><th style={{ paddingRight: 14 }}>OI</th>
                  </tr>
                </thead>
                <tbody>
                  {oc.rows.map((r) => {
                    const atm = Math.abs(r.strike - oc.spot) < 100;
                    return (
                      <tr key={r.strike} className="hoverable"
                        style={{ background: atm ? "var(--accent-soft)" : undefined }}>
                        <td style={{ paddingLeft: 14, position: "relative" }}>
                          <span style={{ position: "absolute", right: 9, top: 6, bottom: 6,
                            width: `${(r.ceOi / maxOi) * 70}%`, background: "var(--down)",
                            opacity: .12, borderRadius: 2 }} />
                          <span style={{ position: "relative" }}>{(r.ceOi / 1000).toFixed(1)}k</span>
                        </td>
                        <td className={r.ceChg >= 0 ? "up" : "down"}>
                          {r.ceChg > 0 ? "+" : ""}{(r.ceChg / 1000).toFixed(1)}k</td>
                        <td>{r.ceIv.toFixed(1)}</td>
                        <td>{num(r.ceLtp, 0)}</td>
                        <td style={{ textAlign: "center", fontWeight: 700,
                          fontFamily: "var(--mono)", background: "var(--sunken)" }}>
                          {num(r.strike, 0)}
                          {r.strike === oc.maxPain && <span className="chip w" style={{ marginLeft: 6 }}>max pain</span>}
                        </td>
                        <td>{num(r.peLtp, 0)}</td>
                        <td>{r.peIv.toFixed(1)}</td>
                        <td className={r.peChg >= 0 ? "up" : "down"}>
                          {r.peChg > 0 ? "+" : ""}{(r.peChg / 1000).toFixed(1)}k</td>
                        <td style={{ paddingRight: 14, position: "relative" }}>
                          <span style={{ position: "absolute", left: 9, top: 6, bottom: 6,
                            width: `${(r.peOi / maxOi) * 70}%`, background: "var(--up)",
                            opacity: .12, borderRadius: 2 }} />
                          <span style={{ position: "relative" }}>{(r.peOi / 1000).toFixed(1)}k</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ padding: "10px 14px", borderTop: "1px solid var(--border)" }}
              className="row">
              <span className="meta">Total call OI {(totCe / 1000).toFixed(0)}k</span>
              <span className="meta">Total put OI {(totPe / 1000).toFixed(0)}k</span>
              <span className="meta">ATM IV {oc.atmIv}% · IV percentile {oc.ivPct}</span>
              <span className="meta" style={{ marginLeft: "auto" }}>highlighted row = at the money</span>
            </div>
          </div>

          {/* build-up */}
          <SectionHead title="Open-interest build-up" />
          <div className="card pad0 mb24">
            <div className="scrollx">
              <table>
                <thead><tr><th style={{ paddingLeft: 14 }}>Symbol</th><th>Price</th><th>OI</th>
                  <th>Classification</th><th>PCR</th><th>IV %ile</th>
                  <th style={{ paddingRight: 14 }}>250d percentile</th></tr></thead>
                <tbody>
                  {OI_TABLE.map((r) => {
                    const i = byId(r.id)!;
                    const tone = r.buildup === "LONG_BUILDUP" || r.buildup === "SHORT_COVERING"
                      ? "var(--up)" : r.buildup === "SHORT_BUILDUP" ? "var(--down)" : "var(--muted)";
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
                        <td style={{ paddingRight: 14 }}>
                          <span className="row" style={{ justifyContent: "flex-end", gap: 8 }}>
                            <span className="bar" style={{ width: 54 }}>
                              <i style={{ width: `${r.pctile}%`,
                                background: r.pctile > 85 ? "var(--warn)" : "var(--accent)" }} /></span>
                            <span style={{ fontWeight: r.pctile > 85 ? 600 : 400,
                              color: r.pctile > 85 ? "var(--warn)" : undefined }}>{r.pctile}</span>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {stories.length > 0 && (<>
            <SectionHead title="Derivatives stories" />
            {stories.map((s) => <StoryCard key={s.id} s={s} />)}
          </>)}
        </div>

        <aside className="stack" style={{ gap: 16 }}>
          <div className="card">
            <div className="cardhead"><h2>Participant-wise OI</h2><span className="tag">index futures</span></div>
            <div className="scrollx">
              <table>
                <thead><tr><th>Who</th><th>Long</th><th>Short</th><th>Net</th></tr></thead>
                <tbody>
                  {PARTICIPANTS.map((p) => {
                    const net = p.idxFutLong - p.idxFutShort;
                    return (
                      <tr key={p.who}>
                        <td>{p.who}</td>
                        <td>{(p.idxFutLong / 1000).toFixed(0)}k</td>
                        <td>{(p.idxFutShort / 1000).toFixed(0)}k</td>
                        <td className={net >= 0 ? "up" : "down"}>
                          {net > 0 ? "+" : ""}{(net / 1000).toFixed(0)}k</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="meta mt12">
              The FII / client divergence is the number most traders here are actually looking
              for: foreign institutions net short index futures while retail clients are net
              long.
            </p>
          </div>

          <div className="card">
            <div className="cardhead"><h2>Reading build-up</h2></div>
            <table>
              <tbody>
                <tr><td style={{ fontSize: 12 }}>Price ▲ &amp; OI ▲</td><td className="up">Long build-up</td></tr>
                <tr><td style={{ fontSize: 12 }}>Price ▼ &amp; OI ▲</td><td className="down">Short build-up</td></tr>
                <tr><td style={{ fontSize: 12 }}>Price ▼ &amp; OI ▼</td><td className="flat">Long unwinding</td></tr>
                <tr><td style={{ fontSize: 12 }}>Price ▲ &amp; OI ▼</td><td className="up">Short covering</td></tr>
              </tbody>
            </table>
            <p className="meta mt12">
              The classification is mechanical. What it means depends on where the OI change
              sits in that symbol&apos;s own history, which is the percentile column.
            </p>
          </div>

          <Notice>
            Open interest, max pain and put-call ratio are descriptions of positioning. They are
            not signals, and nothing on this page is a recommendation to take a position.
          </Notice>
        </aside>
      </div>
    </div>
  );
}
