import Link from "next/link";
import { notFound } from "next/navigation";
import { FACTORS, factorBySlug } from "@/lib/factors";
import { byId, chg, STORIES } from "@/lib/data";
import { num } from "@/lib/format";
import { SectionHead, Delta, Spark, Stale, Notice, Stat } from "@/components/Bits";
import ProGate, { ProTag } from "@/components/Pro";
import StoryTile from "@/components/StoryTile";

export function generateStaticParams() {
  return FACTORS.map((f) => ({ slug: f.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const f = factorBySlug((await params).slug);
  return { title: f?.name ?? "Factor", description: f?.summary };
}

export default async function FactorPage({ params }: { params: Promise<{ slug: string }> }) {
  const f = factorBySlug((await params).slug);
  if (!f) notFound();
  const insts = f.instruments.map((i) => byId(i)).filter(Boolean);
  const others = FACTORS.filter((x) => x.slug !== f.slug).slice(0, 4);
  const related = STORIES.filter((s) =>
    s.impacts.some((im) => f.instruments.includes(im.instrument))).slice(0, 3);

  return (
    <>
      <section className="band" style={{ paddingBlock: "40px 34px" }}>
        <div className="wrap">
          <div className="breadcrumb" style={{ color: "var(--on-ink-faint)" }}>
            <Link href="/">Today</Link> / <Link href="/global-factors">Global factors</Link> / {f.name}
          </div>
          <div className="row mt8" style={{ gap: 14, alignItems: "flex-start" }}>
            <div className="mark" style={{ width: 60, height: 60, borderRadius: 10,
              background: "var(--ink-2)", display: "grid", placeItems: "center",
              fontFamily: "var(--serif)", fontWeight: 700, fontSize: 20, flex: "0 0 auto" }}>
              {f.mark}
            </div>
            <div className="min0">
              <div className="kicker accent">{f.kicker}</div>
              <h1 style={{ fontSize: "clamp(30px,4.6vw,52px)", marginTop: 6 }}>{f.name}</h1>
            </div>
          </div>
          <p className="sub" style={{ fontSize: 16.5, maxWidth: 780, marginTop: 14, lineHeight: 1.55 }}>
            {f.summary}
          </p>
          <div className="row mt16" style={{ gap: 10 }}>
            <span className={`ev ${f.impact === "high" ? "supported" : f.impact === "medium" ? "mixed" : "none"}`}>
              {f.impact} impact on India</span>
            <span className="chip">{f.direction}</span>
          </div>

          {insts.length > 0 && (
            <div className="grid mt32" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 18 }}>
              {insts.map((i) => {
                const c = chg(i!);
                return (
                  <Link key={i!.id} href={`/ticker/${encodeURIComponent(i!.id)}`}>
                    <div className="between mb4">
                      <span className="label">{i!.sym}</span>
                      <Stale l={i!.latency} />
                    </div>
                    <div className="figure lg">{num(i!.last, i!.last > 500 ? 0 : 2)}</div>
                    <div className="row mt4" style={{ gap: 8 }}>
                      <Delta v={c} /><span className="meta">{i!.cur}</span>
                    </div>
                    <div className="mt8"><Spark data={i!.hist} w={190} h={30} up={c >= 0} /></div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <div className="wrap" style={{ paddingTop: 28 }}>
        <div className="cols">
          <div className="min0">
            {f.numbers && (
              <>
                <SectionHead title="The numbers" />
                <div className="card pad0 mb32">
                  <div className="scrollx">
                    <table>
                      <tbody>
                        {f.numbers.map((n) => (
                          <tr key={n.k}>
                            <td style={{ paddingLeft: 16, whiteSpace: "normal", width: "40%" }}>{n.k}</td>
                            <td style={{ fontSize: 16, fontWeight: 600, textAlign: "left", width: 130 }}>{n.v}</td>
                            <td style={{ paddingRight: 16, whiteSpace: "normal", textAlign: "right",
                              fontFamily: "var(--sans)", fontSize: 12, color: "var(--muted)" }}>{n.note}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            <SectionHead title="How it transmits" />
            <div className="stack mb32" style={{ gap: 0 }}>
              {f.mechanism.map((m, i) => (
                <div key={m.h} style={{ display: "grid", gridTemplateColumns: "42px 1fr", gap: 16,
                  padding: "16px 0", borderBottom: "1px solid var(--border)" }}>
                  <div className="figure" style={{ fontSize: 24, color: "var(--border-strong)" }}>
                    {String(i + 1).padStart(2, "0")}</div>
                  <div>
                    <h3 style={{ fontSize: 17, marginBottom: 6 }}>{m.h}</h3>
                    <p className="sub" style={{ fontSize: 14.5 }}>{m.p}</p>
                  </div>
                </div>
              ))}
            </div>

            <SectionHead title="What it does to India" />
            <div className="card mb32">
              <ul className="arrowlist">
                {f.indiaEffect.map((e) => <li key={e}>{e}</li>)}
              </ul>
            </div>

            {f.pro && (
              <>
                <SectionHead title={`${f.name} — deeper analytics`} />
                <div className="mb32">
                  <ProGate
                    title={`Go deeper on ${f.name.toLowerCase()}`}
                    what={f.pro}
                  >
                    <table>
                      <thead><tr><th>Series</th><th>Latest</th><th>1w</th><th>1m</th><th>Percentile</th></tr></thead>
                      <tbody>
                        {["Rupee-adjusted series","Import parity","Sector sensitivity","Forward curve",
                          "Positioning percentile","Seasonal index"].map((r, i) => (
                          <tr key={r}>
                            <td>{r}</td>
                            <td className="num">{(100 + i * 13.4).toFixed(2)}</td>
                            <td className="num up">+{(0.4 + i * 0.3).toFixed(2)}%</td>
                            <td className="num down">−{(1.1 + i * 0.4).toFixed(2)}%</td>
                            <td className="num">{40 + i * 7}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </ProGate>
                </div>
              </>
            )}

            {related.length > 0 && (
              <>
                <SectionHead title="Stories on this factor" href="/wire" more="Live wire" />
                <div className="tilegrid mb32">
                  {related.map((s) => <StoryTile key={s.id} s={s} />)}
                </div>
              </>
            )}
          </div>

          <aside className="stack" style={{ gap: 16 }}>
            <div className="card">
              <div className="cardhead"><h2>What to watch</h2></div>
              <ul className="arrowlist">{f.watch.map((w) => <li key={w}>{w}</li>)}</ul>
            </div>

            <div className="ink">
              <div className="label mb12">Where it breaks down</div>
              <p className="sub">{f.caveat}</p>
            </div>

            <div className="card">
              <div className="cardhead"><h2>Sources</h2></div>
              <ul className="sources">
                {f.sources.map((s) => <li key={s.label}><b>{s.who}</b><span>{s.label}</span></li>)}
              </ul>
            </div>

            <div className="card">
              <div className="cardhead"><h2>Other factors</h2></div>
              {others.map((o) => (
                <Link key={o.slug} href={`/global-factors/${o.slug}`} className="between"
                  style={{ padding: "9px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontSize: 13.5, fontWeight: 500 }}>{o.name}</span>
                  <span className={`ev ${o.impact === "high" ? "supported"
                    : o.impact === "medium" ? "mixed" : "none"}`}>{o.impact}</span>
                </Link>
              ))}
              <Link href="/global-factors" className="sub mt12"
                style={{ color: "var(--accent)", fontWeight: 600 }}>All factors →</Link>
            </div>
          </aside>
        </div>

        <div className="mt24 mb32">
          <Notice>
            This page describes mechanisms and cites published research. It is not a trading
            strategy, and the existence of a transmission channel does not mean it can be traded
            profitably after costs.
          </Notice>
        </div>
      </div>
    </>
  );
}
