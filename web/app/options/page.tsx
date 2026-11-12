import Link from "next/link";
import { CHAINS, outlook } from "@/lib/options";
import { num } from "@/lib/format";
import { SectionHead, Notice } from "@/components/Bits";
import { ImpliedDistribution } from "@/components/OptionCharts";
import T from "@/components/T";

export const metadata = {
  title: "Option chains",
  description: "Option chains, implied distributions and the market's own probabilities for Nifty, Bank Nifty, Sensex, Fin Nifty, crude, natural gas and gold.",
};

export default function Options() {
  return (
    <>
      <section className="band" style={{ paddingBlock: "44px 38px" }}>
        <div className="wrap">
          <div className="kicker accent">Option chains · implied probability</div>
          <h1 className="reveal" style={{ fontSize: "clamp(31px,5vw,56px)", marginTop: 10, maxWidth: 1000 }}>
            <T en="The option market publishes its own probability distribution. Here it is."
               hi="ऑप्शन बाज़ार अपनी संभावना खुद बताता है। यह रही।" />
          </h1>
          <p className="sub reveal d1" style={{ fontSize: 17, maxWidth: 800, marginTop: 14, lineHeight: 1.55 }}>
            Seven chains across equity indices and commodities, each with the open-interest
            profile, the implied distribution and the probability of finishing above any level.
            These are <strong>risk-neutral</strong> probabilities, derived from prices — not a
            forecast, and that distinction is on every page.
          </p>
          <div className="grid g4 mt32" style={{ gap: 20 }}>
            <div className="reveal"><div className="figure lg">{CHAINS.length}</div>
              <div className="statlbl">Chains covered</div></div>
            <div className="reveal d1"><div className="figure lg">N(d₂)</div>
              <div className="statlbl">The probability every level is scored against</div></div>
            <div className="reveal d2"><div className="figure lg">σ√t</div>
              <div className="statlbl">Expected move = spot × IV × √(days/365)</div></div>
            <div className="reveal d3"><div className="figure lg">0.8</div>
              <div className="statlbl">ATM straddle ÷ 0.8 ≈ one sigma</div></div>
          </div>
        </div>
      </section>

      <div className="wrap" style={{ paddingTop: 28 }}>
        <div className="breadcrumb"><Link href="/">Today</Link> / Options</div>

        <div className="stack mb32" style={{ gap: 16 }}>
          {CHAINS.map((c) => {
            const o = outlook(c);
            return (
              <Link key={c.slug} href={`/options/${c.slug}`} className="card tile reveal">
                <div className="grid" style={{ gridTemplateColumns: "minmax(0,1fr) minmax(0,1.1fr)", gap: 24,
                  alignItems: "center" }}>
                  <div className="min0">
                    <div className="row mb8" style={{ gap: 8 }}>
                      <span className="chip">{c.venue}</span>
                      <span className="chip a">{c.expiry} · {c.dte}d</span>
                      {c.ivRank > 60 && <span className="chip w">IV {c.ivRank}%ile</span>}
                    </div>
                    <h2 style={{ fontSize: 24 }}>{c.name}</h2>
                    <div className="row mt8" style={{ gap: 16 }}>
                      <span className="num" style={{ fontSize: 20, fontWeight: 600 }}>
                        {num(c.spot, 0)}</span>
                      <span className="meta">ATM IV {c.atmIv}% · PCR {c.pcr} · max pain {num(c.maxPain, 0)}</span>
                    </div>
                    <p className="tiledek mt8" style={{ fontSize: 13 }}>{c.note}</p>
                    <div className="row mt12" style={{ gap: 14 }}>
                      <span className="sub" style={{ fontSize: 12.5 }}>
                        Expected move <strong className="num">±{num(o.em, 0)}</strong></span>
                      <span className="sub" style={{ fontSize: 12.5 }}>
                        <span className="up">{(o.up * 100).toFixed(1)}% up</span>
                        {" · "}
                        <span className="down">{(o.down * 100).toFixed(1)}% down</span></span>
                    </div>
                  </div>
                  <div className="min0"><ImpliedDistribution c={c} h={150} /></div>
                </div>
              </Link>
            );
          })}
        </div>

        <section className="band reveal" style={{ paddingBlock: 34 }}>
          <div className="wrap">
            <div className="kicker accent">Read this before you use the probabilities</div>
            <div className="grid g3 mt16" style={{ gap: 26 }}>
              {[
                { h: "Risk-neutral is not real-world", b: "Option prices embed the premium investors demand for bearing risk, so the implied density is tilted relative to what the underlying has historically done. A 62% implied probability of finishing higher is a statement about prices, not a forecast of the outcome." },
                { h: "Terminal, not path", b: "These probabilities describe where the contract finishes at expiry. They say nothing reliable about whether a level is touched before then — a terminal distribution does not determine a barrier-touch probability without extra assumptions." },
                { h: "'Expected move' means three different things", b: "One standard deviation, the ATM straddle, and a scaled band are all published under that label. We state which one each figure is. The straddle is roughly 0.8σ, so dividing it by 0.8 approximates the one-sigma move." },
              ].map((c) => (
                <div key={c.h} className="reveal">
                  <h3 style={{ fontSize: 19 }}>{c.h}</h3>
                  <p className="sub mt8">{c.b}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="mt32 mb32">
          <Notice>
            Chain values are sample data. The methods — Breeden–Litzenberger for the density,
            N(d₂) for the probability above a strike, spot × IV × √(t) for the expected move —
            are standard and real, and are applied as described.
          </Notice>
        </div>
      </div>
    </>
  );
}
