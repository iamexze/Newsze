import Link from "next/link";
import { INDEX_LINKS } from "@/lib/options";
import { byId, chg } from "@/lib/data";
import { num } from "@/lib/format";
import { SectionHead, Notice, Delta, Spark } from "@/components/Bits";
import T from "@/components/T";
import Explain from "@/components/Explain";

export const metadata = {
  title: "Index relationships",
  description: "Nifty, Sensex and Bank Nifty move together — until they don't. Correlation, beta, and why divergence is composition rather than a signal.",
};

const IDS = ["IDX:NIFTY50","IDX:SENSEX","IDX:NIFTYBANK","IDX:FINNIFTY","IDX:MIDCAP"];

export default function Correlation() {
  return (
    <>
      <section className="band" style={{ paddingBlock: "42px 36px" }}>
        <div className="wrap">
          <div className="kicker accent">Index relationships</div>
          <h1 className="reveal" style={{ fontSize: "clamp(30px,4.8vw,54px)", marginTop: 10, maxWidth: 980 }}>
            <T en="If Nifty goes up, Sensex goes up — until the month it doesn't"
               hi="निफ्टी चढ़े तो सेंसेक्स चढ़ता है — उस महीने को छोड़कर जब ऐसा नहीं होता" />
          </h1>
          <p className="sub reveal d1" style={{ fontSize: 16.5, maxWidth: 790, marginTop: 14, lineHeight: 1.55 }}>
            Published analysis puts the long-run Nifty–Sensex correlation near 85% on average
            and above 90% in most months since 2008 — and records it falling as low as 11% in a
            single month. The average is the comfortable number. The episodes are the ones that
            break hedges.
          </p>
          <div className="grid g4 mt32" style={{ gap: 20 }}>
            <div className="reveal"><div className="figure lg">0.98</div>
              <div className="statlbl">Bank Nifty to Nifty correlation, reported since Jan 2017</div></div>
            <div className="reveal d1"><div className="figure lg">1.12</div>
              <div className="statlbl"><Explain metric="beta">Bank Nifty beta to Nifty, same analysis</Explain></div></div>
            <div className="reveal d2"><div className="figure lg">85%</div>
              <div className="statlbl">Average Nifty–Sensex correlation over five years</div></div>
            <div className="reveal d3"><div className="figure lg">11%</div>
              <div className="statlbl">Lowest monthly reading recorded in that series</div></div>
          </div>
        </div>
      </section>

      <div className="wrap" style={{ paddingTop: 28 }}>
        <div className="breadcrumb"><Link href="/">Today</Link> / <Link href="/india">India</Link> / Relationships</div>

        <div className="grid mb32" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
          {IDS.map((id) => {
            const i = byId(id); if (!i) return null;
            const c = chg(i);
            return (
              <Link key={id} href={`/ticker/${encodeURIComponent(id)}`} className="card tile reveal">
                <div className="label mb8">{i.sym}</div>
                <div className="num" style={{ fontSize: 19, fontWeight: 600 }}>{num(i.last, 0)}</div>
                <div className="mt4"><Delta v={c} /></div>
                <div className="mt8"><Spark data={i.hist} w={172} h={28} up={c >= 0} /></div>
              </Link>
            );
          })}
        </div>

        <SectionHead title="Pairwise relationships" />
        <div className="card pad0 mb32 reveal">
          <div className="scrollx">
            <table>
              <thead><tr><th style={{ paddingLeft: 16 }}>Pair</th><th>Correlation</th><th>Beta</th>
                <th style={{ paddingRight: 16 }}>Diversification</th></tr></thead>
              <tbody>
                {INDEX_LINKS.pairs.map((p) => {
                  const div = p.corr > 0.95 ? "none" : p.corr > 0.85 ? "minimal" : "some";
                  return (
                    <tr key={p.a + p.b} className="hoverable">
                      <td style={{ paddingLeft: 16 }}>{p.a} ↔ {p.b}</td>
                      <td>
                        <span className="row" style={{ justifyContent: "flex-end", gap: 9 }}>
                          <span className="bar" style={{ width: 70 }}>
                            <i style={{ width: `${p.corr * 100}%`,
                              background: p.corr > 0.95 ? "var(--down)" : p.corr > 0.85
                                ? "var(--warn)" : "var(--up)" }} /></span>
                          <span style={{ fontWeight: 600 }}>{p.corr.toFixed(2)}</span>
                        </span>
                      </td>
                      <td style={{ fontWeight: 600, color: p.beta > 1.2 ? "var(--warn)" : undefined }}>
                        {p.beta.toFixed(2)}</td>
                      <td style={{ paddingRight: 16 }}>
                        <span className={`ev ${div === "none" ? "weak" : div === "minimal" ? "mixed" : "supported"}`}>
                          {div}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)" }}>
            <p className="meta">
              Correlation above 0.95 means the two instruments are effectively one position.
              Beta above 1 means the second moves more than the first for the same market event
              — leverage, not diversification.
            </p>
          </div>
        </div>

        <SectionHead title="What each pair actually tells you" />
        <div className="stack mb32" style={{ gap: 12 }}>
          {INDEX_LINKS.pairs.map((p, i) => (
            <div key={p.a + p.b} className={`card reveal ${i % 2 ? "d1" : ""}`}>
              <div className="between mb8">
                <h3 style={{ fontSize: 18 }}>{p.a} ↔ {p.b}</h3>
                <span className="row" style={{ gap: 10 }}>
                  <span className="num" style={{ fontSize: 13 }}>ρ {p.corr.toFixed(2)}</span>
                  <span className="num" style={{ fontSize: 13 }}>β {p.beta.toFixed(2)}</span>
                </span>
              </div>
              <p className="sub">{p.note}</p>
            </div>
          ))}
        </div>

        <section className="band reveal" style={{ paddingBlock: 36 }}>
          <div className="wrap">
            <div className="kicker accent">Why divergence happens</div>
            <div className="grid mt16" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(276px,1fr))", gap: 26 }}>
              {INDEX_LINKS.divergence.map((d) => (
                <div key={d.h} className="reveal">
                  <h3 style={{ fontSize: 18 }}>{d.h}</h3>
                  <p className="sub mt8">{d.p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="mt32 mb32">
          <Notice>
            Correlation and beta figures come from published analysis dated 2013 to 2018, and
            no current readings were available. Compute rolling values from recent returns
            before relying on them for position sizing — relationships of this kind drift.
          </Notice>
        </div>
      </div>
    </>
  );
}
