import Link from "next/link";
import { notFound } from "next/navigation";
import { SCENARIOS, scenarioBySlug, VERDICT_META } from "@/lib/scenarios";
import { byId } from "@/lib/data";
import { SectionHead, Notice } from "@/components/Bits";
import { MoodGauge } from "@/components/Mood";

export function generateStaticParams() {
  return SCENARIOS.map((s) => ({ slug: s.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const s = scenarioBySlug((await params).slug);
  return { title: s ? `If ${s.trigger.toLowerCase()}` : "Scenario", description: s?.finding };
}

export default async function ScenarioPage({ params }: { params: Promise<{ slug: string }> }) {
  const s = scenarioBySlug((await params).slug);
  if (!s) notFound();
  const v = VERDICT_META[s.verdict];
  const others = SCENARIOS.filter((x) => x.slug !== s.slug).slice(0, 5);
  const best = [...s.outcomes].sort((a, b) => b.conf - a.conf)[0];
  const bestInst = byId(best.instrument);

  return (
    <>
      <section className="band" style={{ paddingBlock: "42px 36px" }}>
        <div className="wrap">
          <div className="breadcrumb" style={{ color: "var(--on-ink-faint)" }}>
            <Link href="/">Today</Link> / <Link href="/scenarios">Scenarios</Link> / {s.group}
          </div>
          <div className="row mt8" style={{ gap: 10 }}>
            <span className="chip">{s.group}</span>
            {s.live && <span className="chip a">active now</span>}
            <span className={`ev ${v.tone}`}>{v.label}</span>
          </div>
          <h1 className="reveal" style={{ fontSize: "clamp(29px,4.6vw,50px)", marginTop: 12, maxWidth: 940 }}>
            If {s.trigger.toLowerCase()}
          </h1>
          {s.liveNote && <p className="sub mt12" style={{ color: "var(--accent-on-ink)" }}>{s.liveNote}</p>}
          <div className="grid g4 mt32" style={{ gap: 20 }}>
            <div><div className="figure lg">{best.median > 0 ? "+" : ""}{best.median.toFixed(2)}%</div>
              <div className="statlbl">Median {bestInst?.sym} move, {best.horizon}</div></div>
            <div><div className="figure lg">{Math.round(best.up * 100)}%</div>
              <div className="statlbl">Of occasions it rose</div></div>
            <div><div className="figure lg">{best.n}</div>
              <div className="statlbl">Historical occurrences</div></div>
            <div><div className="figure lg">{best.conf.toFixed(2)}</div>
              <div className="statlbl">Calibrated confidence</div></div>
          </div>
        </div>
      </section>

      <div className="wrap" style={{ paddingTop: 28 }}>
        <div className="cols">
          <div className="min0">
            <SectionHead title="Belief versus record" />
            <div className="grid g2 mb24">
              <div className="card reveal">
                <div className="label mb8">What traders assume</div>
                <p style={{ fontFamily: "var(--serif)", fontSize: 18, lineHeight: 1.35, fontWeight: 600 }}>
                  &ldquo;{s.belief}&rdquo;
                </p>
              </div>
              <div className="card reveal d1" style={{ borderColor: v.tone === "supported" ? "var(--up)"
                : v.tone === "weak" ? "var(--down)" : "var(--warn)" }}>
                <div className="label mb8">What the record shows</div>
                <p className="sub" style={{ fontSize: 14 }}>{s.finding}</p>
              </div>
            </div>

            <SectionHead title="Why it happens" />
            <div className="article mb24">
              <p>{s.why}</p>
            </div>

            <SectionHead title="The full distribution" />
            <div className="card pad0 mb24 reveal">
              <div className="scrollx">
                <table>
                  <thead><tr><th style={{ paddingLeft: 16 }}>Instrument</th><th>Horizon</th>
                    <th>Median</th><th>68% range</th><th>Rose</th><th>n</th>
                    <th style={{ paddingRight: 16 }}>Conf</th></tr></thead>
                  <tbody>
                    {s.outcomes.map((o, i) => {
                      const inst = byId(o.instrument);
                      return (
                        <tr key={i} className="hoverable">
                          <td style={{ paddingLeft: 16 }}>
                            <Link href={`/ticker/${encodeURIComponent(o.instrument)}`}>
                              {inst?.sym ?? o.instrument}</Link></td>
                          <td style={{ fontFamily: "var(--sans)", fontSize: 11.5, color: "var(--muted)" }}>
                            {o.horizon}</td>
                          <td className={o.median >= 0 ? "up" : "down"} style={{ fontWeight: 600 }}>
                            {o.median > 0 ? "+" : ""}{o.median.toFixed(2)}%</td>
                          <td style={{ color: "var(--muted)" }}>{o.b68[0].toFixed(1)} · {o.b68[1].toFixed(1)}</td>
                          <td>
                            <span className="row" style={{ justifyContent: "flex-end", gap: 8 }}>
                              <span className="bar" style={{ width: 58 }}>
                                <i style={{ width: `${o.up * 100}%`,
                                  background: o.up >= 0.5 ? "var(--up)" : "var(--down)" }} /></span>
                              {Math.round(o.up * 100)}%
                            </span>
                          </td>
                          <td style={{ color: o.n < 100 ? "var(--warn)" : undefined }}>{o.n}</td>
                          <td style={{ paddingRight: 16 }}>{o.conf.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)" }}>
                <p className="meta">
                  The 68% range is where two-thirds of historical outcomes fell. Where it spans
                  zero, the median is a weak statement about direction regardless of how large
                  it looks.
                </p>
              </div>
            </div>
          </div>

          <aside className="stack" style={{ gap: 16 }}>
            <div className="card reveal">
              <div className="cardhead"><h2>Risk mood now</h2></div>
              <MoodGauge compact />
              <p className="meta mt12">
                Scenario outcomes are regime-dependent. The same condition in risk-on and
                risk-off states has produced materially different distributions.
              </p>
            </div>

            <div className="ink reveal">
              <div className="label mb12">How to use this</div>
              <p className="sub">
                Treat it as a prior, not a trade. If the record says the index rose on 63% of
                occasions with a median of a third of a percent, that is a mild tilt inside a
                wide distribution — information about the odds, not an instruction.
              </p>
            </div>

            <div className="card">
              <div className="cardhead"><h2>Other scenarios</h2></div>
              {others.map((o) => (
                <Link key={o.slug} href={`/scenarios/${o.slug}`}
                  style={{ display: "block", padding: "9px 0", borderBottom: "1px solid var(--border)" }}>
                  <div className="between">
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{o.triggerShort}</span>
                    <span className={`ev ${VERDICT_META[o.verdict].tone}`}>
                      {VERDICT_META[o.verdict].label}</span>
                  </div>
                </Link>
              ))}
              <Link href="/scenarios" className="sub mt12"
                style={{ color: "var(--accent)", fontWeight: 600 }}>All scenarios →</Link>
            </div>
          </aside>
        </div>

        <div className="mt24 mb32">
          <Notice>
            A conditional distribution describes what followed on previous occasions. It is not
            a forecast of this occasion, not a recommendation, and not a trading system.
          </Notice>
        </div>
      </div>
    </>
  );
}
