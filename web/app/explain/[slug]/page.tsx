import Link from "next/link";
import { notFound } from "next/navigation";
import { METRICS, metricBySlug } from "@/lib/explain";
import { SectionHead, Notice } from "@/components/Bits";
import { DriverBar } from "@/components/Explain";
import ProGate from "@/components/Pro";

export function generateStaticParams() { return METRICS.map((m) => ({ slug: m.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const m = metricBySlug((await params).slug);
  return { title: m ? `${m.name} — explained` : "Explained", description: m?.plain };
}

export default async function ExplainPage({ params }: { params: Promise<{ slug: string }> }) {
  const m = metricBySlug((await params).slug);
  if (!m) notFound();
  const others = METRICS.filter((x) => x.group === m.group && x.slug !== m.slug).slice(0, 4);
  const top = [...m.drivers].sort((a, b) => b.weight - a.weight)[0];

  return (
    <>
      <section className="band" style={{ paddingBlock: "40px 34px" }}>
        <div className="wrap">
          <div className="breadcrumb" style={{ color: "var(--on-ink-faint)" }}>
            <Link href="/">Today</Link> / <Link href="/explain">Explained</Link> / {m.group}
          </div>
          <div className="row mt8" style={{ gap: 8 }}>
            <span className="chip">{m.group}</span>
            <span className="chip a">{m.level}</span>
          </div>
          <h1 className="reveal" style={{ fontSize: "clamp(29px,4.6vw,50px)", marginTop: 12 }}>{m.name}</h1>
          <p className="sub reveal d1" style={{ fontSize: 17, maxWidth: 780, marginTop: 12, lineHeight: 1.55 }}>
            {m.plain}
          </p>
          <div className="grid mt32" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 20 }}>
            <div><div className="figure lg">{m.reading.value}</div>
              <div className="statlbl">Current reading</div></div>
            {m.reading.percentile !== undefined && (
              <div><div className="figure lg">{m.reading.percentile}</div>
                <div className="statlbl">Percentile in its own history</div></div>
            )}
            <div><div className="figure lg">{m.drivers.length}</div>
              <div className="statlbl">Factors that move it</div></div>
            <div><div className="figure lg">{top.weight}%</div>
              <div className="statlbl">Largest single factor — {top.name.toLowerCase()}</div></div>
          </div>
        </div>
      </section>

      <div className="wrap" style={{ paddingTop: 28 }}>
        <div className="cols">
          <div className="min0">
            <SectionHead title="What it is reading right now" />
            <div className="card mb24 reveal">
              <div className="row" style={{ gap: 16, alignItems: "baseline" }}>
                <span className="figure" style={{ fontSize: 34 }}>{m.reading.value}</span>
                {m.reading.percentile !== undefined && (
                  <span className={`chip ${m.reading.percentile > 75 ? "w"
                    : m.reading.percentile < 30 ? "up" : ""}`}>
                    {m.reading.percentile}th percentile</span>
                )}
              </div>
              <p className="sub mt12">{m.reading.context}</p>
              {m.reading.percentile !== undefined && (
                <>
                  <div style={{ position: "relative", height: 24, marginTop: 16 }}>
                    <div style={{ position: "absolute", inset: "9px 0", background: "var(--sunken)",
                      borderRadius: 3 }} />
                    <div style={{ position: "absolute", top: 9, bottom: 9, left: 0, width: "30%",
                      background: "var(--up)", opacity: .15, borderRadius: "3px 0 0 3px" }} />
                    <div style={{ position: "absolute", top: 9, bottom: 9, left: "75%", right: 0,
                      background: "var(--warn)", opacity: .15, borderRadius: "0 3px 3px 0" }} />
                    <div style={{ position: "absolute", top: 2, bottom: 2, left: `${m.reading.percentile}%`,
                      width: 3, background: "var(--ink)", transform: "translateX(-1.5px)", borderRadius: 2 }} />
                  </div>
                  <div className="between meta mt4"><span>low</span><span>own history</span><span>high</span></div>
                </>
              )}
            </div>

            {m.formula && (<>
              <SectionHead title="How it is calculated" />
              <div className="card mb24 reveal" style={{ background: "var(--raised)" }}>
                <p className="num" style={{ fontSize: 14, lineHeight: 1.7, whiteSpace: "normal" }}>
                  {m.formula}
                </p>
              </div>
            </>)}

            <SectionHead title="What moves it" />
            <div className="card mb24 reveal">
              <p className="sub mb16">
                Roughly how much each factor contributes to day-to-day variation. Weights are
                indicative — they exist so you can see which driver matters rather than
                treating all of them as equal.
              </p>
              {m.drivers.map((d) => <DriverBar key={d.name} d={d} />)}
            </div>

            <SectionHead title="The common misreading" />
            <div className="card mb24 reveal" style={{ borderColor: "var(--warn)" }}>
              <div className="row mb8" style={{ gap: 8 }}>
                <span className="ev weak">Where people go wrong</span>
              </div>
              <p className="sub" style={{ fontSize: 14.5 }}>{m.misreading}</p>
            </div>

            <SectionHead title="Track it" />
            <div className="mb24">
              <ProGate title={`Chart ${m.name.toLowerCase()} and its drivers over time`}
                what={[`Full history of ${m.short} with percentile bands`,
                  "Each driver charted alongside, so you can see which one moved it",
                  "Alerts when it crosses a percentile you choose",
                  "Cross-symbol comparison ranked against each symbol's own history",
                  "Export the series"]}>
                <table>
                  <thead><tr><th>Date</th><th>{m.short}</th><th>Percentile</th>
                    <th>Largest driver</th><th>Change</th></tr></thead>
                  <tbody>
                    {["12 Nov","11 Nov","10 Nov","07 Nov","06 Nov","05 Nov"].map((d, i) => (
                      <tr key={d}>
                        <td>{d}</td>
                        <td className="num">{m.reading.value}</td>
                        <td className="num">{(m.reading.percentile ?? 50) + i * 3}</td>
                        <td style={{ fontFamily: "var(--sans)", fontSize: 12 }}>
                          {m.drivers[i % m.drivers.length].name}</td>
                        <td className={i % 2 ? "num down" : "num up"}>
                          {i % 2 ? "−" : "+"}{(0.4 + i * 0.3).toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ProGate>
            </div>
          </div>

          <aside className="stack" style={{ gap: 16 }}>
            <div className="ink reveal">
              <div className="label mb12">In one line</div>
              <p className="sub" style={{ fontSize: 14.5 }}>{m.plain}</p>
              <hr className="mt16 mb12" />
              <div className="label mb8">The factor that matters most</div>
              <p className="sub">
                <strong style={{ color: "var(--on-ink)" }}>{top.name}</strong> — roughly{" "}
                {top.weight}% of day-to-day variation. {top.note}
              </p>
            </div>

            {m.related.length > 0 && (
              <div className="card">
                <div className="cardhead"><h2>See it in use</h2></div>
                {m.related.map((r) => (
                  <Link key={r.href} href={r.href} className="between"
                    style={{ padding: "9px 0", borderBottom: "1px solid var(--border)" }}>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{r.label}</span>
                    <span style={{ color: "var(--accent)" }}>→</span>
                  </Link>
                ))}
              </div>
            )}

            {others.length > 0 && (
              <div className="card">
                <div className="cardhead"><h2>More in {m.group}</h2></div>
                {others.map((o) => (
                  <Link key={o.slug} href={`/explain/${o.slug}`} className="between"
                    style={{ padding: "9px 0", borderBottom: "1px solid var(--border)" }}>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{o.name}</span>
                    <span className="num" style={{ fontSize: 12 }}>{o.reading.value}</span>
                  </Link>
                ))}
                <Link href="/explain" className="sub mt12"
                  style={{ color: "var(--accent)", fontWeight: 600 }}>All statistics →</Link>
              </div>
            )}
          </aside>
        </div>

        <div className="mt24 mb32">
          <Notice>
            Readings shown are sample data. The definitions, formulas and driver relationships
            are real and are how the metric genuinely behaves.
          </Notice>
        </div>
      </div>
    </>
  );
}
