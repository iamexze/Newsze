import Link from "next/link";
import { notFound } from "next/navigation";
import { TREES, treeBySlug, ENGINE } from "@/lib/outlook";
import { chainBySlug, outlook as optOutlook } from "@/lib/options";
import { byId, chg } from "@/lib/data";
import { num } from "@/lib/format";
import { SectionHead, Notice, Delta, Spark } from "@/components/Bits";
import { ImpliedDistribution } from "@/components/OptionCharts";
import Tree from "@/components/Tree";
import ProGate from "@/components/Pro";

export function generateStaticParams() { return TREES.map((t) => ({ slug: t.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const t = treeBySlug((await params).slug);
  return { title: t ? `${t.name} outlook` : "Outlook", description: t?.modal };
}

export default async function OutlookPage({ params }: { params: Promise<{ slug: string }> }) {
  const t = treeBySlug((await params).slug);
  if (!t) notFound();
  const inst = byId(t.instrument);
  const chain = chainBySlug(t.slug);
  const o = chain ? optOutlook(chain) : null;
  const others = TREES.filter((x) => x.slug !== t.slug);

  return (
    <>
      <section className="band" style={{ paddingBlock: "40px 34px" }}>
        <div className="wrap">
          <div className="breadcrumb" style={{ color: "var(--on-ink-faint)" }}>
            <Link href="/">Today</Link> / <Link href="/outlook">Outlook</Link> / {t.name}
          </div>
          <div className="row mt8" style={{ gap: 8 }}>
            <span className="chip a">{t.horizon}</span>
            <span className="meta">{t.asOf}</span>
          </div>
          <h1 className="reveal" style={{ fontSize: "clamp(29px,4.6vw,50px)", marginTop: 12 }}>
            {t.name} outlook
          </h1>
          <p className="sub reveal d1" style={{ fontSize: 16.5, maxWidth: 780, marginTop: 12, lineHeight: 1.55 }}>
            {t.modal}
          </p>
          <div className="grid g4 mt32" style={{ gap: 20 }}>
            <div><div className="figure lg">{num(t.spot, 0)}</div><div className="statlbl">Spot</div></div>
            {o && (<>
              <div><div className="figure lg">±{num(o.em, 0)}</div>
                <div className="statlbl">Expected move, one sigma</div></div>
              <div><div className="figure lg">{(o.up * 100).toFixed(1)}%</div>
                <div className="statlbl">Implied, finishes higher</div></div>
              <div><div className="figure lg">{(o.down * 100).toFixed(1)}%</div>
                <div className="statlbl">Implied, finishes lower</div></div>
            </>)}
          </div>
        </div>
      </section>

      <div className="wrap" style={{ paddingTop: 28 }}>
        <div className="cols">
          <div className="min0">
            <SectionHead title="The possibility tree" />
            <div className="card mb24 reveal"><Tree nodes={t.root} /></div>

            {chain && (<>
              <SectionHead title="What the option market implies" href={`/options/${chain.slug}`} more="Full chain" />
              <div className="card mb24 reveal">
                <ImpliedDistribution c={chain} h={190} />
                <div className="scrollx mt12">
                  <table>
                    <tbody>
                      <tr><td>ATM implied volatility</td><td className="num">{chain.atmIv}%</td></tr>
                      <tr><td>IV rank</td><td className="num"
                        style={{ color: chain.ivRank > 60 ? "var(--warn)" : undefined }}>{chain.ivRank}</td></tr>
                      <tr><td>Put-call ratio</td><td className="num">{chain.pcr}</td></tr>
                      <tr><td>Max pain</td><td className="num">{num(chain.maxPain, 0)}</td></tr>
                      {o && <tr><td>Straddle breakevens</td>
                        <td className="num">{num(o.breakevenDown, 0)} / {num(o.breakevenUp, 0)}</td></tr>}
                    </tbody>
                  </table>
                </div>
                <p className="meta mt12">
                  Risk-neutral. The implied distribution prices the width of outcomes, not the
                  direction, and the branch probabilities above that are marked
                  &ldquo;option-implied&rdquo; are derived from it.
                </p>
              </div>
            </>)}

            <SectionHead title="Path analytics" />
            <div className="mb24">
              <ProGate title={`Test every path on ${t.name}`}
                what={["Joint probability for any path you select through the tree",
                  "The historical dates behind every base rate, clickable",
                  "Regime filter — restrict base rates to the current volatility state",
                  "Alerts when a branch condition triggers intraday",
                  "Cost-adjusted expectancy per path, because a 58% branch loses money after costs if the move is small",
                  "Export the matched historical cases"]}>
                <table>
                  <thead><tr><th>Path</th><th>Joint P</th><th>Median move</th><th>n</th>
                    <th>Net of costs</th></tr></thead>
                  <tbody>
                    {[["Break up → fail → revert","12.1%","−0.62%","142","−0.08%"],
                      ["Break up → extend","14.3%","+0.94%","142","+0.61%"],
                      ["Range → drift to max pain","24.8%","+0.18%","208","−0.04%"],
                      ["Break down → reclaim → recover","10.1%","+0.71%","134","+0.38%"],
                      ["Break down → extend","13.6%","−0.88%","134","−0.55%"]].map((r, i) => (
                      <tr key={i}>
                        <td>{r[0]}</td><td className="num">{r[1]}</td>
                        <td className={String(r[2]).startsWith("−") ? "num down" : "num up"}>{r[2]}</td>
                        <td className="num">{r[3]}</td>
                        <td className={String(r[4]).startsWith("−") ? "num down" : "num up"}>{r[4]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ProGate>
            </div>
          </div>

          <aside className="stack" style={{ gap: 16 }}>
            <div className="card reveal">
              <div className="cardhead"><h2>Levels in play</h2></div>
              <div className="ladder">
                {t.levels.map((l) => (
                  <div key={l.k} className={l.k === "Spot" ? "spot" : ""}>
                    <span className="lv">{l.v.toLocaleString("en-IN")}</span>
                    <span style={{ color: "var(--muted)" }}>{l.k}</span>
                  </div>
                ))}
              </div>
              <hr className="mt12 mb12" />
              {t.levels.filter((l) => l.why).map((l) => (
                <p key={l.k} className="sub" style={{ fontSize: 12, marginBottom: 7 }}>
                  <strong>{l.k}</strong> — {l.why}
                </p>
              ))}
            </div>

            <div className="ink reveal">
              <div className="label mb12">Reading a tree honestly</div>
              <ul className="arrowlist">
                {["Each probability is conditional on its parent — multiply down the path",
                  "The modal path is usually under 50%, which is what a real forecast looks like",
                  "A branch marked base-rate carries its sample size; small n is shown, not hidden",
                  "The false-breakout branch is frequently the modal one — plan for it",
                  "Levels have a documented mechanism and no proven profitability after costs"].map((x) => <li key={x}>{x}</li>)}
              </ul>
            </div>

            {inst && (
              <div className="card">
                <div className="cardhead"><h2>Underlying</h2></div>
                <Link href={`/ticker/${encodeURIComponent(inst.id)}`} className="between">
                  <div><div style={{ fontWeight: 600, fontSize: 13 }}>{inst.sym}</div>
                    <div className="meta">{inst.name}</div></div>
                  <Spark data={inst.hist} w={72} h={26} up={chg(inst) >= 0} />
                  <div style={{ textAlign: "right" }}>
                    <div className="num" style={{ fontSize: 13 }}>{num(inst.last, 0)}</div>
                    <Delta v={chg(inst)} />
                  </div>
                </Link>
              </div>
            )}

            <div className="card">
              <div className="cardhead"><h2>Other outlooks</h2></div>
              {others.map((x) => (
                <Link key={x.slug} href={`/outlook/${x.slug}`} className="between"
                  style={{ padding: "9px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{x.name}</span>
                  <span className="meta">{x.root.length} branches</span>
                </Link>
              ))}
            </div>
          </aside>
        </div>

        <div className="mt24 mb32">
          <Notice>
            {ENGINE.evidence.summary}
          </Notice>
        </div>
      </div>
    </>
  );
}
