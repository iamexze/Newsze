import Link from "next/link";
import { MSCI, REBALANCE_MECHANICS } from "@/lib/india";
import { SectionHead, Notice, Stat } from "@/components/Bits";
import { CountUp } from "@/components/Motion";
import ProGate from "@/components/Pro";

export const metadata = {
  title: "Index flows & MSCI",
  description: "How MSCI and domestic index rebalancing move billions of forced passive flow through Indian stocks.",
};

export default function IndexFlows() {
  return (
    <>
      <section className="band" style={{ paddingBlock: "44px 38px" }}>
        <div className="wrap">
          <div className="kicker accent">Index flows · {MSCI.review}</div>
          <h1 className="reveal" style={{ fontSize: "clamp(31px,5vw,56px)", marginTop: 10, maxWidth: 1000 }}>
            The only genuinely forced buying in public markets
          </h1>
          <p className="sub reveal d1" style={{ fontSize: 17, maxWidth: 790, marginTop: 14, lineHeight: 1.55 }}>
            When MSCI adds a stock to its index, every fund tracking that index must buy it —
            on the same day, at whatever price, regardless of view. Nothing else in markets
            produces order flow that is both large and completely price-insensitive. Knowing
            when it arrives, and in what size, is a genuine edge.
          </p>
          <div className="grid g4 mt32" style={{ gap: 20 }}>
            <div className="reveal"><div className="figure lg">
              <CountUp value={MSCI.weight.to} decimals={1} suffix="%" /></div>
              <div className="statlbl">India weight in {MSCI.weight.index}, from {MSCI.weight.from}%</div></div>
            <div className="reveal d1"><div className="figure lg">{MSCI.netFlow}</div>
              <div className="statlbl">Estimated net passive inflow</div></div>
            <div className="reveal d2"><div className="figure lg">
              <CountUp value={MSCI.additions.length} /></div>
              <div className="statlbl">Additions to the standard index</div></div>
            <div className="reveal d3"><div className="figure lg">
              <CountUp value={MSCI.deletions.length} /></div>
              <div className="statlbl">Deletion</div></div>
          </div>
        </div>
      </section>

      <div className="wrap" style={{ paddingTop: 28 }}>
        <div className="breadcrumb"><Link href="/">Today</Link> / <Link href="/india">India</Link> / Index flows</div>

        <div className="cols mb32">
          <div className="min0">
            <SectionHead title={`${MSCI.review} — what changed`} />
            <div className="grid g2 mb24">
              <div className="card reveal">
                <div className="cardhead"><h2>Added</h2><span className="tag">inflow</span></div>
                {MSCI.additions.map((a) => (
                  <div key={a.name} className="between" style={{ padding: "9px 0", borderBottom: "1px solid var(--border)" }}>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{a.name}</span>
                    <span className="chip up">buy</span>
                  </div>
                ))}
                <p className="meta mt12">
                  Nuvama&apos;s estimate attributes roughly ${MSCI.altEstimate.inclusions}bn of inflow
                  to these inclusions.
                </p>
              </div>
              <div className="card reveal d1">
                <div className="cardhead"><h2>Removed &amp; cut</h2><span className="tag">outflow</span></div>
                {[...MSCI.deletions, ...MSCI.weightCuts].map((d) => (
                  <div key={d.name} className="between" style={{ padding: "9px 0", borderBottom: "1px solid var(--border)" }}>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{d.name}</span>
                    <span className="num down" style={{ fontSize: 13 }}>{d.flow}</span>
                  </div>
                ))}
                <p className="meta mt12">
                  NTPC stays in the index — its outflow comes purely from a weight change, with
                  nothing happening at the company.
                </p>
              </div>
            </div>

            <SectionHead title="Two estimates, shown as two" />
            <div className="card mb24 reveal">
              <p className="sub mb16">
                Published estimates for this review use different bases and arrive at different
                numbers. We show both rather than picking the convenient one.
              </p>
              <div className="scrollx">
                <table>
                  <thead><tr><th>Source basis</th><th>Weight move</th><th>Inclusions</th>
                    <th>Weight-up</th><th>Outflows</th><th>Net</th></tr></thead>
                  <tbody>
                    <tr><td>Business Standard / Nuvama</td>
                      <td className="num">{MSCI.weight.from}% → {MSCI.weight.to}%</td>
                      <td className="num">—</td><td className="num">—</td><td className="num">—</td>
                      <td className="num up">{MSCI.netFlow}</td></tr>
                    <tr><td>Nuvama via Business Upturn</td>
                      <td className="num">{MSCI.altEstimate.from}% → {MSCI.altEstimate.to}%</td>
                      <td className="num up">+${MSCI.altEstimate.inclusions}bn</td>
                      <td className="num up">+${MSCI.altEstimate.weightUp}bn</td>
                      <td className="num down">−${MSCI.altEstimate.outflows}bn</td>
                      <td className="num up">≈ +${MSCI.altEstimate.net}bn</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <SectionHead title="How rebalancing actually works" />
            <div className="stack mb24" style={{ gap: 0 }}>
              {REBALANCE_MECHANICS.map((m, i) => (
                <div key={m.h} className="reveal" style={{ display: "grid", gridTemplateColumns: "42px 1fr",
                  gap: 16, padding: "16px 0", borderBottom: "1px solid var(--border)" }}>
                  <div className="figure" style={{ fontSize: 24, color: "var(--border-strong)" }}>
                    {String(i + 1).padStart(2, "0")}</div>
                  <div>
                    <h3 style={{ fontSize: 17, marginBottom: 6 }}>{m.h}</h3>
                    <p className="sub" style={{ fontSize: 14.5 }}>{m.p}</p>
                  </div>
                </div>
              ))}
            </div>

            <SectionHead title="Next review — candidate tracker" />
            <div className="mb32">
              <ProGate title="Screen for the next review before it is announced"
                what={["Free-float and liquidity screens against published inclusion thresholds",
                  "Estimated passive flow per candidate at current index assets",
                  "Announcement-window versus effective-date price behaviour, historical",
                  "Alerts on MSCI and domestic index consultation papers",
                  "Domestic index reviews too — Nifty, Sensex and sector indices"]}>
                <table>
                  <thead><tr><th>Candidate</th><th>Free float</th><th>ADV</th><th>Est. flow</th>
                    <th>Probability</th></tr></thead>
                  <tbody>
                    {["Candidate A","Candidate B","Candidate C","Candidate D","Candidate E"].map((c, i) => (
                      <tr key={c}>
                        <td>{c}</td>
                        <td className="num">{(32 + i * 6).toFixed(1)}%</td>
                        <td className="num">${(18 + i * 7).toFixed(0)}mn</td>
                        <td className="num up">+${(120 + i * 60)}mn</td>
                        <td className="num">{74 - i * 9}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ProGate>
            </div>
          </div>

          <aside className="stack" style={{ gap: 16 }}>
            <div className="ink reveal">
              <div className="label mb12">The weight decline, read correctly</div>
              <p className="sub">{MSCI.trend.detail}</p>
              <hr className="mt16 mb16" />
              <p className="sub">{MSCI.trend.driver}</p>
              <hr className="mt16 mb16" />
              <p className="sub">
                India&apos;s weight can fall while Indian equities rise. It is a relative
                calculation across all emerging markets, not a verdict on India.
              </p>
            </div>

            <div className="card">
              <div className="cardhead"><h2>What to watch</h2></div>
              <ul className="arrowlist">
                {["The announcement date, not the effective date — most of the move happens in between",
                  "Separate inclusion flow from weight-change flow",
                  "Index assets under management, which scale every estimate",
                  "Domestic reviews too — Nifty and Sensex rebalancing moves domestic passive money",
                  "Free float changes, which alter weight without any index decision"].map((x) => <li key={x}>{x}</li>)}
              </ul>
            </div>

            <div className="card">
              <div className="cardhead"><h2>Sources</h2></div>
              <ul className="sources">
                {MSCI.sources.map((s) => <li key={s.label}><b>{s.who}</b><span>{s.label}</span></li>)}
              </ul>
            </div>
          </aside>
        </div>

        <div className="mb32">
          <Notice>
            Flow estimates are third-party calculations that depend on assumed index assets under
            management, and published figures for the same review differ materially. Treat any
            single number as one estimate among several.
          </Notice>
        </div>
      </div>
    </>
  );
}
