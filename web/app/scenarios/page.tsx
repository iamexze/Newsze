import Link from "next/link";
import { SCENARIOS, VERDICT_META, MOOD } from "@/lib/scenarios";
import { byId } from "@/lib/data";
import { SectionHead, Notice } from "@/components/Bits";
import { MoodGauge, MoodHistory, MoodComponents } from "@/components/Mood";
import { CountUp } from "@/components/Motion";
import ProGate from "@/components/Pro";
import Explain from "@/components/Explain";

export const metadata = {
  title: "Scenarios",
  description: "If this happens, what has followed? Conditional outlooks for Indian markets, with the common belief tested against the historical record.",
};

function OutcomeRow({ o }: { o: { instrument: string; horizon: string; up: number;
  median: number; b68: [number, number]; n: number; conf: number } }) {
  const inst = byId(o.instrument);
  const dirUp = o.median >= 0;
  return (
    <tr className="hoverable">
      <td><Link href={`/ticker/${encodeURIComponent(o.instrument)}`}>{inst?.sym ?? o.instrument}</Link></td>
      <td style={{ fontFamily: "var(--sans)", fontSize: 11.5, color: "var(--muted)" }}>{o.horizon}</td>
      <td className={dirUp ? "up" : "down"} style={{ fontWeight: 600 }}>
        {dirUp ? "▲ +" : "▼ "}{Math.abs(o.median).toFixed(2)}%</td>
      <td style={{ color: "var(--muted)" }}>{o.b68[0].toFixed(1)} · {o.b68[1].toFixed(1)}</td>
      <td>
        <span className="row" style={{ justifyContent: "flex-end", gap: 8 }}>
          <span className="bar" style={{ width: 54 }}>
            <i style={{ width: `${o.up * 100}%`, background: o.up >= 0.5 ? "var(--up)" : "var(--down)" }} />
          </span>
          {Math.round(o.up * 100)}%
        </span>
      </td>
      <td style={{ color: o.n < 100 ? "var(--warn)" : undefined }}>{o.n}</td>
      <td>{o.conf.toFixed(2)}</td>
    </tr>
  );
}

export default function Scenarios() {
  const live = SCENARIOS.filter((s) => s.live);
  const contradicted = SCENARIOS.filter((s) => s.verdict === "contradicted").length;

  return (
    <>
      <section className="band" style={{ paddingBlock: "46px 40px" }}>
        <div className="wrap">
          <div className="kicker accent">Scenarios · if this, then what</div>
          <h1 className="reveal" style={{ fontSize: "clamp(32px,5.4vw,60px)", marginTop: 10, maxWidth: 1020 }}>
            Crude falls and India rises. Wall Street crashes and India does not hold up.
          </h1>
          <p className="sub reveal d1" style={{ fontSize: 17, maxWidth: 800, marginTop: 14, lineHeight: 1.55 }}>
            Ten conditions that traders act on every week, each tested against what actually
            followed. Four of the most widely repeated beliefs come out backwards. Those are the
            rows worth your time — a correct intuition saves you nothing, and a confident wrong
            one costs you everything.
          </p>
          <div className="grid g4 mt32" style={{ gap: 20 }}>
            <div className="reveal"><div className="figure lg"><CountUp value={SCENARIOS.length} /></div>
              <div className="statlbl">Scenarios tested</div></div>
            <div className="reveal d1"><div className="figure lg"><CountUp value={contradicted} /></div>
              <div className="statlbl">Where the common belief is backwards</div></div>
            <div className="reveal d2"><div className="figure lg"><CountUp value={live.length} /></div>
              <div className="statlbl">Conditions active right now</div></div>
            <div className="reveal d3"><div className="figure lg">{MOOD.score}</div>
              <div className="statlbl">Global risk mood · {MOOD.label}</div></div>
          </div>
        </div>
      </section>

      <div className="wrap" style={{ paddingTop: 28 }}>
        <div className="breadcrumb"><Link href="/">Today</Link> / Scenarios</div>

        {/* mood */}
        <div className="grid mb32" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16 }}>
          <div className="card reveal">
            <div className="cardhead"><h2><Explain metric="risk-mood">Global risk mood</Explain></h2><span className="tag">composite</span></div>
            <MoodGauge />
            <hr className="mt16 mb12" />
            <MoodHistory />
            <p className="meta mt8">21 sessions. Above the line is risk-on.</p>
          </div>
          <div className="card reveal d1">
            <div className="cardhead"><h2>What is driving it</h2><span className="tag">6 inputs</span></div>
            <MoodComponents />
          </div>
          <div className="card reveal d2">
            <div className="cardhead"><h2>Live conditions</h2><span className="tag">{live.length} active</span></div>
            <div className="stack" style={{ gap: 10 }}>
              {live.map((s) => (
                <Link key={s.slug} href={`/scenarios/${s.slug}`}
                  style={{ display: "block", paddingBottom: 9, borderBottom: "1px solid var(--border)" }}>
                  <div className="between mb4">
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{s.triggerShort}</span>
                    <span className={`ev ${VERDICT_META[s.verdict].tone}`}>
                      {VERDICT_META[s.verdict].label}</span>
                  </div>
                  <p className="meta" style={{ fontSize: 10.5, lineHeight: 1.45 }}>{s.liveNote}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* scenarios */}
        <SectionHead title="All scenarios" />
        <div className="stack mb32" style={{ gap: 16 }}>
          {SCENARIOS.map((s) => {
            const v = VERDICT_META[s.verdict];
            return (
              <article key={s.slug} className="card reveal">
                <div className="between mb12" style={{ alignItems: "flex-start" }}>
                  <div className="min0">
                    <div className="row" style={{ gap: 8 }}>
                      <span className="chip">{s.group}</span>
                      {s.live && <span className="chip a">active now</span>}
                    </div>
                    <h2 style={{ fontSize: 23, marginTop: 8 }}>
                      <Link href={`/scenarios/${s.slug}`}>If {s.trigger.toLowerCase()}</Link>
                    </h2>
                  </div>
                  <span className={`ev ${v.tone}`} style={{ flex: "0 0 auto" }}>{v.label}</span>
                </div>

                <div className="grid mb16" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
                  <div className="min0" style={{ borderLeft: "2px solid var(--border-strong)", paddingLeft: 14 }}>
                    <div className="label mb4">What traders assume</div>
                    <p className="sub" style={{ fontSize: 13.5, fontStyle: "italic" }}>&ldquo;{s.belief}&rdquo;</p>
                  </div>
                  <div className="min0" style={{ borderLeft: `2px solid var(--${v.tone === "supported" ? "up"
                    : v.tone === "weak" ? "down" : "warn"})`, paddingLeft: 14 }}>
                    <div className="label mb4">What followed, historically</div>
                    <p className="sub" style={{ fontSize: 13.5 }}>{s.finding}</p>
                  </div>
                </div>

                <div className="scrollx">
                  <table>
                    <thead><tr><th>Instrument</th><th>Horizon</th><th>Median move</th>
                      <th>68% range</th><th>Rose</th><th>n</th><th>Conf</th></tr></thead>
                    <tbody>{s.outcomes.map((o, i) => <OutcomeRow key={i} o={o} />)}</tbody>
                  </table>
                </div>

                <div className="row mt12" style={{ gap: 12 }}>
                  <Link href={`/scenarios/${s.slug}`} className="sub"
                    style={{ color: "var(--accent)", fontWeight: 600 }}>Why this happens →</Link>
                </div>
              </article>
            );
          })}
        </div>

        <SectionHead title="Build your own scenario" />
        <div className="mb32">
          <ProGate title="Condition on anything, and see what followed"
            what={["Combine up to five conditions across any instruments and any thresholds",
              "Pick the instruments and horizons you care about",
              "Regime filter — restrict to matching volatility and trend states",
              "Multiple-comparison corrected significance on every cell",
              "Alerts when your conditions go live",
              "Export the matched dates and outcomes"]}>
            <table>
              <thead><tr><th>Condition</th><th>Threshold</th><th>Matches</th><th>Median</th>
                <th>Rose</th><th>p (corrected)</th></tr></thead>
              <tbody>
                {[["S&P 500 daily return","< −1.0%","218","−0.74%","21%","0.004"],
                  ["Brent 2-day change","< −3.0%","164","+0.34%","63%","0.031"],
                  ["DXY daily change","< −0.5%","302","+0.21%","58%","0.112"],
                  ["US 10Y change","> +10bp","246","−0.31%","36%","0.019"],
                  ["India VIX percentile","< 25","188","+0.12%","54%","0.408"],
                  ["Days to expiry","10–20","—","—","—","—"]].map((r, i) => (
                  <tr key={i}>
                    <td>{r[0]}</td><td className="num">{r[1]}</td><td className="num">{r[2]}</td>
                    <td className={`num ${String(r[3]).startsWith("−") ? "down" : "up"}`}>{r[3]}</td>
                    <td className="num">{r[4]}</td><td className="num">{r[5]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ProGate>
        </div>

        <section className="band reveal" style={{ paddingBlock: 36 }}>
          <div className="wrap">
            <div className="kicker accent">Read this before you use any of it</div>
            <div className="grid g3 mt16" style={{ gap: 26 }}>
              {[
                { h: "These are histories, not forecasts", b: "Every row says what followed on previous occasions. It does not say what will follow this time. The 68% range is usually wide enough that the median is a weak statement, and we show the range for exactly that reason." },
                { h: "Conditions overlap", b: "Four scenarios are active simultaneously right now, and they point in different directions. Real markets do not present one clean condition at a time, which is why no single scenario should be treated as the read." },
                { h: "The backwards ones matter most", b: "A belief you already hold that turns out correct changes nothing about your behaviour. A belief that is backwards — global crash means India holds up, Chinese stimulus lifts India, buy MSCI inclusions on the effective date — is where the money is actually lost." },
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
            Conditional distributions describe the past. They are not predictions, not
            recommendations, and not a trading system. Sample sizes are shown on every row
            because a 62% hit rate on 88 observations and the same rate on 600 are very
            different claims.
          </Notice>
        </div>
      </div>
    </>
  );
}
