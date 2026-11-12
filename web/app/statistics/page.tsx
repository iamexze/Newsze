import Link from "next/link";
import { CALENDAR_STATS, STAT_TONE } from "@/lib/factors";
import { LEDGER } from "@/lib/data";
import { SectionHead, Notice, Stat } from "@/components/Bits";
import ProGate from "@/components/Pro";

export const metadata = {
  title: "Market statistics",
  description: "Calendar anomalies, seasonality and the statistical claims traders repeat — checked against the Indian literature.",
};

export default function Statistics() {
  const gone = CALENDAR_STATS.filter((s) => s.status === "disappeared").length;
  const holds = CALENDAR_STATS.filter((s) => s.status === "holds").length;

  return (
    <>
      <section className="band" style={{ paddingBlock: "44px 38px" }}>
        <div className="wrap">
          <div className="kicker accent">Market statistics · Indian equities</div>
          <h1 style={{ fontSize: "clamp(32px,5.2vw,58px)", marginTop: 10, maxWidth: 1020 }}>
            The Monday effect was real. Then settlement reform killed it.
          </h1>
          <p className="sub" style={{ fontSize: 17, maxWidth: 790, marginTop: 14, lineHeight: 1.55 }}>
            The best-documented finding in the Indian calendar-anomaly literature is also the
            most instructive: a day-of-the-week effect existed before T+2 rolling settlement and
            disappeared after it. The anomaly was a settlement artefact, and better market
            structure removed it. Most of the rest of this literature points the same way.
          </p>
          <div className="grid g4 mt32" style={{ gap: 20 }}>
            <div><div className="figure lg">{gone}</div><div className="statlbl">Effects that have disappeared</div></div>
            <div><div className="figure lg">{CALENDAR_STATS.length - gone - holds}</div>
              <div className="statlbl">Disputed or structural</div></div>
            <div><div className="figure lg">{holds}</div><div className="statlbl">That genuinely hold — and it is gold demand, not equity</div></div>
            <div><div className="figure lg">0</div><div className="statlbl">Impact estimates we publish from seasonality</div></div>
          </div>
        </div>
      </section>

      <div className="wrap" style={{ paddingTop: 28 }}>
        <div className="breadcrumb"><Link href="/">Today</Link> / Statistics</div>

        <SectionHead title="Claims, checked" />
        <div className="stack mb32" style={{ gap: 14 }}>
          {CALENDAR_STATS.map((s) => (
            <article key={s.name} className="card">
              <div className="between mb12" style={{ alignItems: "flex-start" }}>
                <h2 style={{ fontSize: 23 }}>{s.name}</h2>
                <span className={`ev ${STAT_TONE[s.status]}`} style={{ flex: "0 0 auto" }}>
                  {s.status}</span>
              </div>
              <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 22 }}>
                <div className="min0">
                  <div className="label mb8">The claim</div>
                  <p className="sub" style={{ fontStyle: "italic" }}>&ldquo;{s.claim}&rdquo;</p>
                </div>
                <div className="min0" style={{ gridColumn: "span 2" }}>
                  <div className="label mb8">What the research found</div>
                  <p className="sub">{s.finding}</p>
                </div>
              </div>
              <details className="mt12">
                <summary className="meta" style={{ cursor: "pointer" }}>Sources ({s.sources.length})</summary>
                <ul className="sources mt8">
                  {s.sources.map((x) => <li key={x.label}><b>{x.who}</b><span>{x.label}</span></li>)}
                </ul>
              </details>
            </article>
          ))}
        </div>

        <div className="cols mb32">
          <div className="min0">
            <SectionHead title="Why anomalies die" />
            <div className="article">
              <p>
                There are two separate reasons a documented market anomaly stops working, and
                they have very different implications.
              </p>
              <p>
                <strong>It was arbitraged away.</strong> Once an effect is published and easy to
                trade, capital flows to it until the edge is gone. This is the textbook story
                and it is often true. The Indian literature explicitly describes calendar
                anomalies as diminishing over time.
              </p>
              <p>
                <strong>The market structure changed.</strong> This is the more interesting
                case, and the Indian day-of-the-week result is a clean example. The effect was
                tied to the settlement cycle. When settlement moved to T+2 rolling, the
                mechanism that generated the effect simply stopped existing. No arbitrage was
                required.
              </p>
              <p>
                The practical lesson is that any statistical regularity should come with a
                mechanism. If you cannot say <em>why</em> the pattern exists, you cannot know
                whether a rule change has already removed it — and you will keep trading it long
                after it has gone.
              </p>
            </div>
          </div>
          <aside>
            <div className="ink">
              <div className="label mb12">Multiple comparisons</div>
              <p className="sub">
                Testing twelve months across many indices generates apparent effects by chance
                alone. Most of this literature does not correct for multiple comparisons, which
                means a portion of the reported month effects are statistical noise that
                survived to publication.
              </p>
              <hr className="mt16 mb16" />
              <p className="sub">
                We apply a Bonferroni correction across event classes in our own testing for
                exactly this reason — and it is why two classes sit suppressed on our ledger.
              </p>
              <Link href="/track-record" style={{ color: "var(--accent-on-ink)", fontWeight: 600,
                fontSize: 13, display: "block", marginTop: 12 }}>See the ledger →</Link>
            </div>
          </aside>
        </div>

        <SectionHead title="Seasonality workbench" />
        <div className="mb32">
          <ProGate
            title="Test a seasonal claim against the full history"
            what={[
              "Day-of-week, month, expiry-week and pre-holiday returns across 15 years",
              "Multiple-comparison corrected significance on every cell",
              "Pre- and post-settlement-reform split, so structural breaks are visible",
              "Per-sector and per-symbol breakdowns, not just the index",
              "Export the underlying series",
            ]}
          >
            <table>
              <thead><tr><th>Window</th><th>Mean return</th><th>Hit rate</th><th>n</th>
                <th>p (raw)</th><th>p (corrected)</th></tr></thead>
              <tbody>
                {["Monday","Tuesday","Wednesday","Thursday","Friday","Expiry week"].map((d, i) => (
                  <tr key={d}>
                    <td>{d}</td>
                    <td className={i % 2 ? "num down" : "num up"}>
                      {i % 2 ? "−" : "+"}{(0.02 + i * 0.012).toFixed(3)}%</td>
                    <td className="num">{(49.2 + i * 0.7).toFixed(1)}%</td>
                    <td className="num">{740 - i * 4}</td>
                    <td className="num">{(0.04 + i * 0.09).toFixed(3)}</td>
                    <td className="num">{(0.28 + i * 0.11).toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ProGate>
        </div>

        <div className="mb32">
          <Notice>
            We publish no impact estimate from calendar effects. Expiry proximity is used as a
            conditioning variable inside our models — it changes which historical analogs are
            considered comparable — but it is never a signal on its own.
          </Notice>
        </div>
      </div>
    </>
  );
}
