import Link from "next/link";
import { notFound } from "next/navigation";
import { CHAINS, chainBySlug, outlook, VIEWS, probAbove } from "@/lib/options";
import { byId, chg } from "@/lib/data";
import { num } from "@/lib/format";
import { SectionHead, Notice, Delta, Spark } from "@/components/Bits";
import { OiProfile, OiLabels, ImpliedDistribution, ProbabilityLadder } from "@/components/OptionCharts";
import ProGate from "@/components/Pro";
import { CountUp } from "@/components/Motion";
import Explain from "@/components/Explain";

export function generateStaticParams() { return CHAINS.map((c) => ({ slug: c.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const c = chainBySlug((await params).slug);
  return { title: c ? `${c.name} options` : "Options", description: c?.note };
}

export default async function OptionPage({ params }: { params: Promise<{ slug: string }> }) {
  const c = chainBySlug((await params).slug);
  if (!c) notFound();
  const o = outlook(c);
  const view = VIEWS[c.slug];
  const inst = byId(c.instrument);
  const others = CHAINS.filter((x) => x.slug !== c.slug);
  const atm = c.rows.reduce((a, r) =>
    Math.abs(r.strike - c.spot) < Math.abs(a.strike - c.spot) ? r : a, c.rows[0]);

  return (
    <>
      <section className="band" style={{ paddingBlock: "40px 34px" }}>
        <div className="wrap">
          <div className="breadcrumb" style={{ color: "var(--on-ink-faint)" }}>
            <Link href="/">Today</Link> / <Link href="/options">Options</Link> / {c.name}
          </div>
          <div className="row mt8" style={{ gap: 8 }}>
            <span className="chip">{c.venue}</span>
            <span className="chip a">{c.expiry} · {c.dte} days</span>
            <span className="chip">lot {c.lot}</span>
            {c.ivRank > 60 && <span className="chip w">IV rank {c.ivRank}</span>}
          </div>
          <h1 className="reveal" style={{ fontSize: "clamp(29px,4.6vw,50px)", marginTop: 12 }}>
            {c.name} options
          </h1>

          {/* the up/down read */}
          <div className="grid mt24" style={{ gridTemplateColumns: "minmax(0,1fr) minmax(0,1.3fr)", gap: 32 }}>
            <div className="min0">
              <div className="label mb8">Market-implied odds at expiry</div>
              <div className="odds">
                <div>
                  <div className="big up"><CountUp value={o.up * 100} decimals={1} suffix="%" /></div>
                  <div className="statlbl">Finishes higher</div>
                </div>
                <div>
                  <div className="big down"><CountUp value={o.down * 100} decimals={1} suffix="%" /></div>
                  <div className="statlbl">Finishes lower</div>
                </div>
              </div>
              <p className="sub mt12" style={{ fontSize: 13 }}>
                Risk-neutral, from the option chain — a statement about prices, not a forecast.
                At the money the odds sit close to even by construction; the information is in
                the <em>width</em> below, not the tilt.
              </p>
            </div>
            <div className="min0">
              <div className="label mb8"><Explain metric="expected-move">Expected move to {c.expiry}</Explain></div>
              <div className="figure lg">±{num(o.em, 0)}</div>
              <div className="statlbl">
                one sigma · {num(c.spot - o.em, 0)} – {num(c.spot + o.em, 0)} · {(o.em / c.spot * 100).toFixed(2)}%
              </div>
              <div className="grid mt16" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 14 }}>
                <div><div className="num" style={{ fontSize: 16, fontWeight: 600 }}>{num(o.straddleImplied, 0)}</div>
                  <div className="statlbl">Straddle-implied 1σ</div></div>
                <div><div className="num" style={{ fontSize: 16, fontWeight: 600 }}>{num(c.straddle, 1)}</div>
                  <div className="statlbl">ATM straddle</div></div>
                <div><div className="num" style={{ fontSize: 16, fontWeight: 600 }}>{num(o.breakevenDown, 0)} / {num(o.breakevenUp, 0)}</div>
                  <div className="statlbl">Straddle breakevens</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="wrap" style={{ paddingTop: 28 }}>
        <div className="cols">
          <div className="min0">
            <SectionHead title="Implied distribution" />
            <div className="card mb24 reveal">
              <ImpliedDistribution c={c} h={210} />
              <div className="oikey" style={{ borderTop: "1px solid var(--border)", marginTop: 10 }}>
                <span className="meta"><span className="swatch" style={{ background: "var(--accent)", opacity: .35 }} />
                  shaded: one and two sigma</span>
                <span className="meta">solid line: spot</span>
                <span className="meta">dashed: max pain {num(c.maxPain, 0)}</span>
              </div>
              <div className="scrollx mt12">
                <table>
                  <thead><tr><th>Band</th><th>Range</th><th>Probability inside</th></tr></thead>
                  <tbody>
                    {o.bands.map((b) => (
                      <tr key={b.k}>
                        <td>{b.k}σ</td>
                        <td className="num">{num(b.lo, 0)} – {num(b.hi, 0)}</td>
                        <td>
                          <span className="row" style={{ justifyContent: "flex-end", gap: 9 }}>
                            <span className="bar" style={{ width: 80 }}>
                              <i style={{ width: `${b.inside * 100}%` }} /></span>
                            <span style={{ fontWeight: 600 }}>{(b.inside * 100).toFixed(1)}%</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <SectionHead title="Open interest by strike" />
            <div className="card pad0 mb24 reveal">
              <div className="oichart">
                <OiProfile c={c} h={320} />
                <OiLabels c={c} />
              </div>
              <div className="oikey">
                <span className="meta"><span className="swatch" style={{ background: "var(--down)" }} />calls</span>
                <span className="meta"><span className="swatch" style={{ background: "var(--up)" }} />puts</span>
                <span className="meta">PCR {c.pcr}</span>
                <span className="meta">max pain {num(c.maxPain, 0)}</span>
                <span className="meta" style={{ marginLeft: "auto" }}>highlighted rows: at the money, max pain</span>
              </div>
            </div>

            <SectionHead title="Option chain" />
            <div className="card pad0 mb24 reveal">
              <div className="scrollx">
                <table>
                  <thead>
                    <tr>
                      <th colSpan={5} style={{ textAlign: "center", color: "var(--down)" }}>CALLS</th>
                      <th style={{ textAlign: "center" }}>STRIKE</th>
                      <th colSpan={5} style={{ textAlign: "center", color: "var(--up)" }}>PUTS</th>
                    </tr>
                    <tr>
                      <th style={{ paddingLeft: 14 }}>OI</th><th>Chg</th><th>Vol</th><th>IV</th><th>LTP</th>
                      <th style={{ textAlign: "center" }}>—</th>
                      <th>LTP</th><th>IV</th><th>Vol</th><th>Chg</th><th style={{ paddingRight: 14 }}>OI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {c.rows.map((r) => {
                      const isAtm = r.strike === atm.strike;
                      return (
                        <tr key={r.strike} className="hoverable"
                          style={{ background: isAtm ? "var(--accent-soft)" : undefined }}>
                          <td style={{ paddingLeft: 14 }}>{(r.ceOi / 1000).toFixed(1)}k</td>
                          <td className={r.ceChg >= 0 ? "up" : "down"}>
                            {r.ceChg > 0 ? "+" : ""}{(r.ceChg / 1000).toFixed(1)}k</td>
                          <td style={{ color: "var(--muted)" }}>{(r.ceVol / 1000).toFixed(1)}k</td>
                          <td>{r.ceIv}</td><td>{num(r.ceLtp, 1)}</td>
                          <td style={{ textAlign: "center", fontWeight: 700, fontFamily: "var(--mono)",
                            background: "var(--sunken)" }}>
                            {num(r.strike, 0)}
                            {r.strike === c.maxPain && <span className="chip w" style={{ marginLeft: 6 }}>MP</span>}
                          </td>
                          <td>{num(r.peLtp, 1)}</td><td>{r.peIv}</td>
                          <td style={{ color: "var(--muted)" }}>{(r.peVol / 1000).toFixed(1)}k</td>
                          <td className={r.peChg >= 0 ? "up" : "down"}>
                            {r.peChg > 0 ? "+" : ""}{(r.peChg / 1000).toFixed(1)}k</td>
                          <td style={{ paddingRight: 14 }}>{(r.peOi / 1000).toFixed(1)}k</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <SectionHead title="Probability ladder" />
            <div className="card pad0 mb24 reveal">
              <ProbabilityLadder c={c} />
              <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)" }}>
                <p className="meta">
                  P(above) = N(d₂) under Black–Scholes with zero drift, using ATM implied
                  volatility and {c.dte} days to expiry. Risk-neutral: it is what the option
                  prices imply, not what the underlying has historically done.
                </p>
              </div>
            </div>

            <SectionHead title="Strategy analytics" />
            <div className="mb24">
              <ProGate title={`Build and test positions on ${c.name}`}
                what={["Payoff diagrams for any multi-leg structure, with greeks",
                  "Probability of profit from the live implied distribution",
                  "Margin estimate per structure under current SPAN rules",
                  "Historical behaviour of this structure at this IV percentile",
                  "Alerts on IV rank, max-pain shift and OI build-up at chosen strikes"]}>
                <table>
                  <thead><tr><th>Structure</th><th>Net debit</th><th>Max profit</th><th>Max loss</th>
                    <th>P(profit)</th><th>Breakevens</th></tr></thead>
                  <tbody>
                    {[["Long straddle", c.straddle, "unlimited", c.straddle, 0.41],
                      ["Short strangle", -c.straddle * 0.6, c.straddle * 0.6, "undefined", 0.68],
                      ["Bull call spread", c.straddle * 0.35, c.straddle * 0.65, c.straddle * 0.35, 0.47],
                      ["Iron condor", -c.straddle * 0.3, c.straddle * 0.3, c.straddle * 0.7, 0.72],
                      ["Calendar", c.straddle * 0.22, "varies", c.straddle * 0.22, 0.55]].map((r, i) => (
                      <tr key={i}>
                        <td>{r[0] as string}</td>
                        <td className="num">{typeof r[1] === "number" ? num(Math.abs(r[1] as number), 1) : r[1]}</td>
                        <td className="num">{typeof r[2] === "number" ? num(r[2] as number, 1) : r[2]}</td>
                        <td className="num">{typeof r[3] === "number" ? num(r[3] as number, 1) : r[3]}</td>
                        <td className="num">{((r[4] as number) * 100).toFixed(0)}%</td>
                        <td className="num">{num(o.breakevenDown, 0)} / {num(o.breakevenUp, 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ProGate>
            </div>
          </div>

          <aside className="stack" style={{ gap: 16 }}>
            {view && (
              <div className="ink reveal">
                <div className="label mb8">The Newze view</div>
                <h3 style={{ fontSize: 17, lineHeight: 1.3, marginBottom: 10 }}>{view.stance}</h3>
                {view.body.map((p, i) => (
                  <p key={i} className="sub" style={{ marginBottom: 10 }}>{p}</p>
                ))}
                <hr className="mt12 mb12" />
                <div className="label mb8">What we are watching</div>
                <ul className="arrowlist">{view.watch.map((w) => <li key={w}>{w}</li>)}</ul>
                <p className="meta mt12">
                  Editorial commentary. Describes conditions and what we are monitoring —
                  it is not a recommendation and contains no target or position guidance.
                </p>
              </div>
            )}

            <div className="card">
              <div className="cardhead"><h2>Chain summary</h2></div>
              <table>
                <tbody>
                  <tr><td>Spot</td><td className="num">{num(c.spot, 0)}</td></tr>
                  <tr><td><Explain metric="iv-rank">ATM IV</Explain></td><td className="num">{c.atmIv}%</td></tr>
                  <tr><td>IV rank</td><td className="num"
                    style={{ color: c.ivRank > 60 ? "var(--warn)" : undefined }}>{c.ivRank}</td></tr>
                  <tr><td><Explain metric="pcr">Put-call ratio</Explain></td><td className="num">{c.pcr}</td></tr>
                  <tr><td><Explain metric="max-pain">Max pain</Explain></td><td className="num">{num(c.maxPain, 0)}</td></tr>
                  <tr><td>Days to expiry</td><td className="num">{c.dte}</td></tr>
                  <tr><td>Lot size</td><td className="num">{c.lot}</td></tr>
                </tbody>
              </table>
            </div>

            {inst && (
              <div className="card">
                <div className="cardhead"><h2>Underlying</h2></div>
                <Link href={`/ticker/${encodeURIComponent(inst.id)}`} className="between">
                  <div><div style={{ fontWeight: 600, fontSize: 13 }}>{inst.sym}</div>
                    <div className="meta">{inst.name}</div></div>
                  <Spark data={inst.hist} w={76} h={26} up={chg(inst) >= 0} />
                  <div style={{ textAlign: "right" }}>
                    <div className="num" style={{ fontSize: 13 }}>{num(inst.last, 0)}</div>
                    <Delta v={chg(inst)} />
                  </div>
                </Link>
              </div>
            )}

            <div className="card">
              <div className="cardhead"><h2>Other chains</h2></div>
              {others.map((x) => (
                <Link key={x.slug} href={`/options/${x.slug}`} className="between"
                  style={{ padding: "9px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{x.name}</span>
                  <span className="meta">IV {x.atmIv}%</span>
                </Link>
              ))}
            </div>
          </aside>
        </div>

        <div className="mt24 mb32">
          <Notice>
            Implied probabilities are risk-neutral and describe the price of optionality, not a
            forecast. They are terminal — they say nothing reliable about whether a level is
            touched before expiry. Chain values are sample data.
          </Notice>
        </div>
      </div>
    </>
  );
}
