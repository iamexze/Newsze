import Link from "next/link";
import { PATTERNS, VERDICT_TONE } from "@/lib/factors";
import Candles from "@/components/Candles";
import { SectionHead, Notice, Stat } from "@/components/Bits";
import ProGate, { ProTag } from "@/components/Pro";

export const metadata = {
  title: "Candlestick patterns",
  description: "Eight patterns, drawn, explained — and rated against what twenty years of published research actually found.",
};

export default function Patterns() {
  const supported = PATTERNS.filter((p) => p.verdict === "some support").length;
  const none = PATTERNS.filter((p) => p.verdict === "no support").length;

  return (
    <>
      <section className="band" style={{ paddingBlock: "44px 38px" }}>
        <div className="wrap">
          <div className="kicker accent">Technical analysis · evidence review</div>
          <h1 style={{ fontSize: "clamp(32px,5.2vw,58px)", marginTop: 10, maxWidth: 1000 }}>
            Candlestick patterns, drawn — and what the research actually found
          </h1>
          <p className="sub" style={{ fontSize: 17, maxWidth: 780, marginTop: 14, lineHeight: 1.55 }}>
            Every pattern here is drawn from its real geometry so you can see exactly what it
            is. Each also carries a verdict from the published literature. Those verdicts are
            mostly unflattering, and we publish them anyway — the point of this site is to tell
            you how much weight something deserves, not to sell you confidence.
          </p>
          <div className="grid g4 mt32" style={{ gap: 20 }}>
            <div><div className="figure lg">{PATTERNS.length}</div><div className="statlbl">Patterns reviewed</div></div>
            <div><div className="figure lg">{supported}</div><div className="statlbl">With some published support</div></div>
            <div><div className="figure lg">{none}</div><div className="statlbl">With no support in major markets</div></div>
            <div><div className="figure lg">≈1%</div><div className="statlbl">Round-turn cost that erodes most reported edges</div></div>
          </div>
        </div>
      </section>

      <div className="wrap" style={{ paddingTop: 28 }}>
        <div className="breadcrumb"><Link href="/">Today</Link> / Patterns</div>

        <div className="cols mb32">
          <div className="min0">
            <SectionHead title="What the literature says, in short" />
            <div className="article">
              <p>
                Bootstrap testing on Dow components found strong evidence that candlestick
                technical analysis is <strong>not profitable on the US stock market</strong>,
                with neither bullish nor bearish signals consistently beating buy-and-hold.
                Review articles note that Marshall et al. (2006, 2008) and Horton (2009) find
                candlestick strategies have no predictive value for major equity markets.
              </p>
              <p>
                Positive results do exist, and they cluster in smaller, less efficient markets.
                A Taiwan study found three bullish reversal patterns significantly profitable
                there, with the Piercing pattern singled out. A Thailand study found that{" "}
                <em>only</em> the Falling Window, and only after a prevailing downtrend, showed
                predictive power.
              </p>
              <p>
                Then there is cost. One Taiwan study reports transaction costs averaging about
                1% per round turn significantly eroding profits, and a 2022 study of Chinese
                SSE50 components found none of the patterns examined generated an average return
                greater than the assumed round-turn cost. A pattern can be statistically real
                and still be unprofitable.
              </p>
            </div>
          </div>
          <aside>
            <div className="ink">
              <div className="label mb12">The result worth remembering</div>
              <p className="sub">
                A 2022 study of SSE50 components found that the Gravestone Doji showed superior
                profitability over a ten-day hold <strong style={{ color: "var(--on-ink)" }}>only
                when applied as a contrarian signal</strong> — the exact opposite of the
                textbook reading.
              </p>
              <hr className="mt16 mb16" />
              <p className="sub">
                That is what an unstable, data-mined relationship looks like from the inside. It
                is also why we do not publish impact estimates from chart patterns.
              </p>
            </div>
          </aside>
        </div>

        <SectionHead title="The patterns" />
        <div className="evgrid mb32">
          {PATTERNS.map((p) => (
            <article key={p.slug} className="card">
              <div className="between mb12" style={{ alignItems: "flex-start" }}>
                <div className="min0">
                  <div className="row" style={{ gap: 7 }}>
                    <span className="chip">{p.type}</span>
                    <span className={`chip ${p.bias === "bullish" ? "up" : p.bias === "bearish" ? "dn" : ""}`}>
                      {p.bias}</span>
                  </div>
                  <h2 style={{ fontSize: 21, marginTop: 7 }}>{p.name}</h2>
                </div>
              </div>
              <div className="candlebox mb12">
                <Candles candles={p.candles} label={`${p.name} pattern`} />
              </div>
              <div className="label mb4">Shape</div>
              <p className="sub" style={{ fontSize: 13 }}>{p.what}</p>
              <div className="label mb4 mt12">The claim</div>
              <p className="sub" style={{ fontSize: 13 }}>{p.claim}</p>
              <hr className="mt12 mb12" />
              <div className="between mb8">
                <span className="label">Verdict</span>
                <span className={`ev ${VERDICT_TONE[p.verdict]}`}>{p.verdict}</span>
              </div>
              <p className="sub" style={{ fontSize: 13 }}>{p.evidence}</p>
              <details className="mt12">
                <summary className="meta" style={{ cursor: "pointer" }}>Sources ({p.sources.length})</summary>
                <ul className="sources mt8">
                  {p.sources.map((s) => <li key={s.label}><b>{s.who}</b><span>{s.label}</span></li>)}
                </ul>
              </details>
            </article>
          ))}
        </div>

        <SectionHead title="Pattern scanner" />
        <div className="mb32">
          <ProGate
            title="Scan the Indian F&O universe for these patterns"
            what={[
              "Daily scan across all F&O names and indices",
              "Each hit ranked by the historical base rate for that pattern in that symbol",
              "Trend-condition filter — the Thailand result only held after a downtrend",
              "Transaction-cost adjusted expectancy, not raw hit rate",
              "Alerts when a pattern fires on a watchlist name",
            ]}
          >
            <table>
              <thead><tr><th>Symbol</th><th>Pattern</th><th>Trend</th><th>Base rate</th>
                <th>n</th><th>Net of costs</th></tr></thead>
              <tbody>
                {["HDFCBANK","RELIANCE","INFY","TATAMOTORS","SBIN","BAJFINANCE"].map((s, i) => (
                  <tr key={s}>
                    <td>{s}</td>
                    <td style={{ fontFamily: "var(--sans)", fontSize: 12 }}>
                      {["Hammer","Rising window","Doji","Bullish engulfing","Shooting star","Piercing"][i]}</td>
                    <td style={{ fontFamily: "var(--sans)", fontSize: 12 }}>
                      {i % 2 ? "Downtrend" : "Uptrend"}</td>
                    <td className="num">{(52 + i * 1.8).toFixed(1)}%</td>
                    <td className="num">{40 + i * 11}</td>
                    <td className={i % 3 ? "num down" : "num up"}>
                      {i % 3 ? "−" : "+"}{(0.1 + i * 0.07).toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ProGate>
        </div>

        <section className="band" style={{ paddingBlock: 34 }}>
          <div className="wrap">
            <div className="kicker accent">How to read a pattern honestly</div>
            <div className="grid g3 mt16" style={{ gap: 26 }}>
              {[
                { h: "Require a trend condition", b: "The one pattern with clean support in the Thailand study worked only after a prevailing downtrend. A pattern evaluated without its context is a different and weaker claim than the one the research tested." },
                { h: "Subtract costs before believing it", b: "Round-turn costs near 1% erased the reported edge in multiple studies. A pattern with a 53% hit rate and a small average move is a losing strategy once you pay to trade it." },
                { h: "Beware market-hopping evidence", b: "Positive results cluster in Taiwan, Thailand and China; negative results dominate in the US. Citing the market where a pattern worked, and ignoring the ones where it did not, is how a dead strategy stays alive in trading education." },
              ].map((c) => (
                <div key={c.h}>
                  <h3 style={{ fontSize: 19 }}>{c.h}</h3>
                  <p className="sub mt8">{c.b}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="mt32 mb32">
          <Notice>
            We publish no impact estimate from chart patterns. They appear on this site as
            education and as description of price shape, never as a signal, because none of them
            has cleared our calibration bar.
          </Notice>
        </div>
      </div>
    </>
  );
}
