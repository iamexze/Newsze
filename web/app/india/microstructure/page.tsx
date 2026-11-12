import Link from "next/link";
import { MICRO } from "@/lib/india";
import { SectionHead, Notice } from "@/components/Bits";
import ProGate from "@/components/Pro";
import Explain from "@/components/Explain";

export const metadata = {
  title: "Market microstructure",
  description: "F&O ban, ASM, GSM and concentration margin — the exchange rules that decide what you are actually allowed to trade.",
};

export default function Microstructure() {
  return (
    <>
      <section className="band" style={{ paddingBlock: "44px 38px" }}>
        <div className="wrap">
          <div className="kicker accent">Market microstructure · NSE / BSE / SEBI</div>
          <h1 className="reveal" style={{ fontSize: "clamp(31px,5vw,56px)", marginTop: 10, maxWidth: 1000 }}>
            The rules that decide what you can actually trade
          </h1>
          <p className="sub reveal d1" style={{ fontSize: 17, maxWidth: 800, marginTop: 14, lineHeight: 1.55 }}>
            A position can be right and still be impossible. Surveillance frameworks, ban
            periods and margin rules change what is tradeable overnight, usually by circular,
            usually without warning to the person holding the position. These four mechanisms
            account for most of the &ldquo;why can&apos;t I place this order&rdquo; moments in
            an Indian trading life.
          </p>
          <div className="grid g4 mt32" style={{ gap: 20 }}>
            <div className="reveal"><div className="figure lg">95%</div>
              <div className="statlbl"><Explain metric="mwpl">Of MWPL — the F&amp;O ban trigger</Explain></div></div>
            <div className="reveal d1"><div className="figure lg">100%</div>
              <div className="statlbl">Margin at ASM Stage II — the position must be fully funded</div></div>
            <div className="reveal d2"><div className="figure lg">4</div>
              <div className="statlbl">GSM stages, reduced from six</div></div>
            <div className="reveal d3"><div className="figure lg">+15%</div>
              <div className="statlbl">Extra margin when ten clients hold &gt;20% of MWPL</div></div>
          </div>
        </div>
      </section>

      <div className="wrap" style={{ paddingTop: 28 }}>
        <div className="breadcrumb"><Link href="/">Today</Link> / <Link href="/india">India</Link> / Microstructure</div>

        <div className="stack mb32" style={{ gap: 16 }}>
          {MICRO.map((r, i) => (
            <article key={r.slug} className="card reveal" id={r.slug}>
              <div className="row mb12" style={{ gap: 10 }}>
                <span className="figure" style={{ fontSize: 26, color: "var(--border-strong)" }}>
                  {String(i + 1).padStart(2, "0")}</span>
                <h2 style={{ fontSize: 25 }}>{r.name}</h2>
              </div>
              <p className="sub mb16" style={{ maxWidth: 820 }}>{r.what}</p>

              <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 16 }}>
                <div className="min0" style={{ borderLeft: "2px solid var(--down)", paddingLeft: 13 }}>
                  <div className="label mb4">Trigger</div>
                  <p className="sub" style={{ fontSize: 13 }}>{r.trigger}</p>
                </div>
                <div className="min0" style={{ borderLeft: "2px solid var(--warn)", paddingLeft: 13 }}>
                  <div className="label mb4">Effect</div>
                  <p className="sub" style={{ fontSize: 13 }}>{r.effect}</p>
                </div>
                <div className="min0" style={{ borderLeft: "2px solid var(--accent)", paddingLeft: 13 }}>
                  <div className="label mb4">What to watch</div>
                  <p className="sub" style={{ fontSize: 13 }}>{r.watch}</p>
                </div>
              </div>

              <hr className="mt16 mb16" />
              <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(246px,1fr))", gap: 18 }}>
                {r.detail.map((d) => (
                  <div key={d.h} className="min0">
                    <h3 style={{ fontSize: 15, marginBottom: 6 }}>{d.h}</h3>
                    <p className="sub" style={{ fontSize: 13 }}>{d.p}</p>
                  </div>
                ))}
              </div>

              <details className="mt16">
                <summary className="meta" style={{ cursor: "pointer" }}>Sources ({r.sources.length})</summary>
                <ul className="sources mt8">
                  {r.sources.map((s) => <li key={s.label}><b>{s.who}</b><span>{s.label}</span></li>)}
                </ul>
              </details>
            </article>
          ))}
        </div>

        <SectionHead title="Live surveillance tracker" />
        <div className="mb32">
          <ProGate title="Know before the circular reaches your broker"
            what={["Daily F&O ban list with proximity warnings before entry",
              "ASM and GSM stage changes across both exchanges, with the margin impact",
              "Concentration-margin flags on contracts you hold",
              "Alerts the evening a change is circulated, not the morning it bites",
              "Historical stage history per symbol"]}>
            <table>
              <thead><tr><th>Symbol</th><th>Framework</th><th>Stage</th><th>Margin</th>
                <th>Changed</th><th>MWPL used</th></tr></thead>
              <tbody>
                {["ADANIENT","IDEA","YESBANK","RPOWER","SUZLON","IRFC"].map((s, i) => (
                  <tr key={s}>
                    <td>{s}</td>
                    <td style={{ fontFamily: "var(--sans)", fontSize: 12 }}>
                      {["ST-ASM","GSM","ST-ASM","LT-ASM","F&O ban","Concentration"][i]}</td>
                    <td className="num">{["I","II","II","I","—","—"][i]}</td>
                    <td className="num">{[50, 100, 100, 100, 0, 15][i]}%</td>
                    <td className="num">{i + 1}d ago</td>
                    <td className="num" style={{ color: i === 4 ? "var(--down)" : undefined }}>
                      {[62, 44, 71, 38, 96, 84][i]}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ProGate>
        </div>

        <section className="band reveal" style={{ paddingBlock: 34 }}>
          <div className="wrap">
            <div className="kicker accent">How traders actually get caught</div>
            <div className="grid g3 mt16" style={{ gap: 26 }}>
              {[
                { h: "Entering before a ban, exiting during one", b: "Open interest builds, the contract crosses 95% of MWPL overnight, and the next morning one side of the order book is prohibited. Spreads widen and the exit costs far more than the entry did. Watch MWPL utilisation above 90%, not the ban list itself — by then it is too late." },
                { h: "Treating ASM as a verdict on the company", b: "ASM responds to speculative price and volume behaviour, not to fundamentals. Selling on an ASM headline, or buying because it looks like an overreaction, both misread what the exchange has actually said." },
                { h: "Margin that arrives overnight", b: "Concentration margin applies to the contract, not to the clients causing the concentration. Everyone in that contract pays it, and it shows up as an unexplained margin call before the open." },
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
            Rules change by circular, often with short notice. The figures here reflect
            published circulars at the time of writing; always confirm the current stage,
            margin and position limit for any security against the exchange&apos;s own ASM, GSM
            and ban-list pages before trading.
          </Notice>
        </div>
      </div>
    </>
  );
}
