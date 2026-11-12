import Link from "next/link";
import { HEATMAP } from "@/lib/india";
import { SectionHead, Notice } from "@/components/Bits";

export const metadata = { title: "Market heatmap" };

function tone(v: number) {
  const a = Math.min(1, Math.abs(v) / 2.2);
  return v >= 0
    ? `color-mix(in srgb, var(--up) ${18 + a * 62}%, var(--surface))`
    : `color-mix(in srgb, var(--down) ${18 + a * 62}%, var(--surface))`;
}

export default function Heatmap() {
  const total = HEATMAP.reduce((a, s) => a + s.weight, 0);
  const adv = HEATMAP.flatMap((s) => s.names).filter((n) => (n[1] as number) > 0).length;
  const dec = HEATMAP.flatMap((s) => s.names).length - adv;

  return (
    <>
      <section className="band" style={{ paddingBlock: "40px 34px" }}>
        <div className="wrap">
          <div className="kicker accent">Market map · Nifty 50 universe</div>
          <h1 className="reveal" style={{ fontSize: "clamp(30px,4.8vw,52px)", marginTop: 10, maxWidth: 900 }}>
            Where the index actually moved today
          </h1>
          <p className="sub reveal d1" style={{ fontSize: 16.5, maxWidth: 740, marginTop: 14, lineHeight: 1.55 }}>
            Sized by index weight, coloured by move. A heatmap sized by weight rather than
            equally shows you what moved the index — which is a different question from what
            moved the most.
          </p>
          <div className="grid g4 mt32" style={{ gap: 20 }}>
            <div className="reveal"><div className="figure lg">{adv}</div><div className="statlbl">Advancing</div></div>
            <div className="reveal d1"><div className="figure lg">{dec}</div><div className="statlbl">Declining</div></div>
            <div className="reveal d2"><div className="figure lg">{HEATMAP.length}</div><div className="statlbl">Sectors</div></div>
            <div className="reveal d3"><div className="figure lg">{total.toFixed(0)}%</div>
              <div className="statlbl">Index weight covered</div></div>
          </div>
        </div>
      </section>

      <div className="wrap" style={{ paddingTop: 28 }}>
        <div className="breadcrumb"><Link href="/">Today</Link> / Heatmap</div>

        <div className="row mb16" style={{ gap: 14 }}>
          <span className="meta">Tile size = index weight</span>
          <span className="row" style={{ gap: 6, marginLeft: "auto" }}>
            <span className="meta">−2%</span>
            {[-2.2, -1.2, -0.4, 0, 0.4, 1.2, 2.2].map((v) => (
              <span key={v} style={{ width: 22, height: 12, borderRadius: 2, background: tone(v),
                display: "inline-block", border: "1px solid var(--border)" }} />
            ))}
            <span className="meta">+2%</span>
          </span>
        </div>

        <div className="stack mb32" style={{ gap: 14 }}>
          {HEATMAP.map((s) => (
            <section key={s.sector} className="card reveal">
              <div className="between mb12">
                <div className="row" style={{ gap: 10 }}>
                  <h2 style={{ fontSize: 18 }}>{s.sector}</h2>
                  <span className="chip">{s.weight.toFixed(1)}% weight</span>
                </div>
                <span className={`num ${s.chg >= 0 ? "up" : "down"}`} style={{ fontSize: 15, fontWeight: 600 }}>
                  {s.chg > 0 ? "▲ +" : "▼ "}{Math.abs(s.chg).toFixed(2)}%
                </span>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {s.names.map(([sym, chg, w]) => {
                  const width = Math.max(96, (w as number) * 26);
                  return (
                    <Link key={sym as string} href={`/ticker/${encodeURIComponent(`NSE:${sym}`)}`}
                      style={{ background: tone(chg as number), border: "1px solid var(--border)",
                        borderRadius: 5, padding: "10px 11px", minWidth: width, flex: `1 1 ${width}px`,
                        display: "block" }}>
                      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "-.01em" }}>{sym}</div>
                      <div className="num" style={{ fontSize: 13, fontWeight: 600, marginTop: 3 }}>
                        {(chg as number) > 0 ? "+" : ""}{(chg as number).toFixed(2)}%
                      </div>
                      <div className="meta" style={{ fontSize: 9.5, marginTop: 2 }}>{w}% wt</div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <div className="grid g3 mb32">
          {[
            { h: "Weight, not count", b: "Thirty small names rising and two heavyweights falling is a down day for the index and an up day for the market. Breadth and index direction answer different questions, and this map is built to show the gap between them." },
            { h: "Sector before stock", b: "Most single-stock moves on any given day are sector moves wearing a company name. Checking the sector tile before the stock tile prevents attributing a sector repricing to company news." },
            { h: "Look for the outlier inside a sector", b: "The informative tile is the one coloured against its own sector. That is where something company-specific is actually happening." },
          ].map((c, i) => (
            <div key={c.h} className={`card reveal ${i % 3 === 1 ? "d1" : i % 3 === 2 ? "d2" : ""}`}>
              <h3 style={{ fontSize: 18 }}>{c.h}</h3>
              <p className="sub mt8">{c.b}</p>
            </div>
          ))}
        </div>

        <div className="mb32"><Notice>Sample data. Weights are illustrative.</Notice></div>
      </div>
    </>
  );
}
