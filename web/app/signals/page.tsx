import Link from "next/link";
import { SIGNALS, EVIDENCE_LABEL } from "@/lib/research";
import { LEDGER } from "@/lib/data";
import { SectionHead, Stat, Notice } from "@/components/Bits";

export const metadata = {
  title: "What actually predicts direction",
  description: "An honest scoreboard of the indicators traders watch, rated by what the published evidence actually shows.",
};

export default function Signals() {
  const counts = SIGNALS.reduce((a, s) => ({ ...a, [s.evidence]: (a[s.evidence] ?? 0) + 1 }),
    {} as Record<string, number>);

  return (
    <>
      <section className="band" style={{ paddingBlock: "42px 36px" }}>
        <div className="wrap">
          <div className="kicker accent">Analytics · evidence review</div>
          <h1 style={{ fontSize: "clamp(32px,5.2vw,58px)", marginTop: 10, maxWidth: 980 }}>
            Most of what the market watches has no demonstrated power to predict direction.
          </h1>
          <p className="sub" style={{ fontSize: 17, maxWidth: 740, marginTop: 14, lineHeight: 1.55 }}>
            Put-call ratios, breadth, flows, open interest, moving averages. Every one of them is
            quoted daily as though it forecasts something. We went looking for the published
            evidence behind each. This page is what we found, including where the answer was
            nothing.
          </p>
          <div className="grid g4 mt32" style={{ gap: 20 }}>
            <div><div className="figure lg">{counts.supported ?? 0}</div>
              <div className="statlbl">Supported by evidence</div></div>
            <div><div className="figure lg">{counts.mixed ?? 0}</div>
              <div className="statlbl">Mixed evidence</div></div>
            <div><div className="figure lg">{(counts.weak ?? 0) + (counts.none ?? 0)}</div>
              <div className="statlbl">Weak or none found</div></div>
            <div><div className="figure lg">{(LEDGER.overall.dirAcc * 100).toFixed(1)}%</div>
              <div className="statlbl">Our own published hit rate, 1 day</div></div>
          </div>
        </div>
      </section>

      <div className="wrap" style={{ paddingTop: 28 }}>
        <div className="breadcrumb"><Link href="/">Today</Link> / Signals</div>

        <div className="cols mb32">
          <div className="min0">
            <SectionHead title="Why publish this" />
            <div className="article">
              <p>
                A site that sells market analytics has an obvious incentive to imply that its
                indicators work. We would rather state plainly which ones have evidence behind
                them, because the alternative is the thing we exist to replace.
              </p>
              <p>
                The distinction that matters throughout is between <strong>description</strong>{" "}
                and <strong>prediction</strong>. Open interest genuinely tells you whether new
                positions are being opened — that is accounting, and it is reliable. Whether
                that predicts the next move is an entirely separate claim, usually asserted
                without support. Most of the gap between a trader&apos;s confidence and their
                results lives in that distinction.
              </p>
            </div>
          </div>
          <aside>
            <div className="ink">
              <div className="label mb12">The uncomfortable one</div>
              <p className="sub">
                A study covering 1996–2015 found the cross-stock average call-minus-put implied
                volatility spread explained about 12.4% of quarterly return variation out of
                sample — genuinely strong.
              </p>
              <p className="sub mt12">
                The same research found the <strong style={{ color: "var(--on-ink)" }}>index</strong>{" "}
                option IV spread has <strong style={{ color: "var(--on-ink)" }}>no</strong>{" "}
                predictive power at monthly and longer horizons.
              </p>
              <hr className="mt16 mb16" />
              <p className="sub">
                The signal lives in the cross-section of individual stocks — the opposite of how
                almost everyone uses option-implied measures.
              </p>
            </div>
          </aside>
        </div>

        <SectionHead title="The scoreboard" />
        <div className="stack mb32" style={{ gap: 14 }}>
          {SIGNALS.map((s) => {
            const e = EVIDENCE_LABEL[s.evidence];
            return (
              <article key={s.name} className="card">
                <div className="between mb12" style={{ alignItems: "flex-start" }}>
                  <div className="min0">
                    <div className="row" style={{ gap: 9 }}>
                      <span className="chip">{s.family}</span>
                      <span className="meta">{s.horizon}</span>
                    </div>
                    <h2 style={{ fontFamily: "var(--serif)", fontSize: 25, marginTop: 7 }}>{s.name}</h2>
                  </div>
                  <span className={`ev ${s.evidence}`} style={{ flex: "0 0 auto" }}>{e.t}</span>
                </div>
                <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 22 }}>
                  <div className="min0">
                    <div className="label mb8">What it is</div>
                    <p className="sub">{s.what}</p>
                  </div>
                  <div className="min0">
                    <div className="label mb8">What the evidence shows</div>
                    <p className="sub">{s.finding}</p>
                  </div>
                  <div className="min0">
                    <div className="label mb8">How we use it</div>
                    <p className="sub">{s.use}</p>
                  </div>
                </div>
                <details className="mt12">
                  <summary className="meta" style={{ cursor: "pointer" }}>Sources ({s.sources.length})</summary>
                  <ul className="sources mt8">
                    {s.sources.map((x) => <li key={x.label}><b>{x.who}</b><span>{x.label}</span></li>)}
                  </ul>
                </details>
              </article>
            );
          })}
        </div>

        <section className="band" style={{ paddingBlock: 36 }}>
          <div className="wrap">
            <div className="kicker accent">Our own numbers, same standard</div>
            <h2 style={{ fontSize: "clamp(24px,3.2vw,36px)", marginTop: 8, maxWidth: 800 }}>
              We apply this review to ourselves, and publish the result
            </h2>
            <div className="grid g4 mt24" style={{ gap: 20 }}>
              <div><div className="figure lg">{(LEDGER.byType[0].dir * 100).toFixed(1)}%</div>
                <div className="statlbl">Best class — {LEDGER.byType[0].type.replace(/_/g, " ")}, n={LEDGER.byType[0].n}</div></div>
              <div><div className="figure lg">{(LEDGER.byType[6].dir * 100).toFixed(1)}%</div>
                <div className="statlbl">Weakest published — {LEDGER.byType[6].type.replace(/_/g, " ")}</div></div>
              <div><div className="figure lg">2</div>
                <div className="statlbl">Classes suppressed for failing the calibration bar</div></div>
              <div><div className="figure lg">{(LEDGER.byHorizon[4].dir * 100).toFixed(1)}%</div>
                <div className="statlbl">20-day horizon — close enough to a coin flip to treat as one</div></div>
            </div>
            <p className="sub mt24" style={{ maxWidth: 760 }}>
              Accuracy decays with horizon, as it should. Anyone claiming a twenty-day
              directional edge comparable to their fifteen-minute edge is not measuring
              honestly.
            </p>
            <Link href="/track-record" className="chip mt16" style={{ padding: "9px 15px", fontSize: 13 }}>
              Open the Accuracy Ledger →</Link>
          </div>
        </section>

        <div className="mt32 mb32">
          <Notice>
            Absence of published evidence is not proof that something does not work — it means
            we found no basis to publish an estimate from it, and so we do not. Indicators rated
            weak or none are still displayed on this site as description of market state.
          </Notice>
        </div>
      </div>
    </>
  );
}
