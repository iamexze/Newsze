import Link from "next/link";
import { METRICS, METRIC_GROUPS } from "@/lib/explain";
import { SectionHead, Notice } from "@/components/Bits";
import { CountUp } from "@/components/Motion";
import T from "@/components/T";

export const metadata = {
  title: "Statistics explained",
  description: "Every number on this site in plain language, with the factors that move it and the common misreading.",
};

export default function ExplainHub() {
  return (
    <>
      <section className="band" style={{ paddingBlock: "44px 38px" }}>
        <div className="wrap">
          <div className="kicker accent">Statistics explained</div>
          <h1 className="reveal" style={{ fontSize: "clamp(31px,5vw,56px)", marginTop: 10, maxWidth: 980 }}>
            <T en="A number is useless until you know what changes it"
               hi="कोई आँकड़ा तब तक बेकार है जब तक आप न जानें कि उसे क्या बदलता है" />
          </h1>
          <p className="sub reveal d1" style={{ fontSize: 17, maxWidth: 800, marginTop: 14, lineHeight: 1.55 }}>
            Every statistic on this site is one tap from this page. Each entry answers four
            questions in order: what it is in plain language, how it is calculated, which
            factors move it and by roughly how much — and the misreading that costs people
            money.
          </p>
          <div className="grid g4 mt32" style={{ gap: 20 }}>
            <div className="reveal"><div className="figure lg"><CountUp value={METRICS.length} /></div>
              <div className="statlbl">Statistics explained</div></div>
            <div className="reveal d1"><div className="figure lg">
              <CountUp value={METRICS.reduce((a, m) => a + m.drivers.length, 0)} /></div>
              <div className="statlbl">Factors mapped, each with its weight</div></div>
            <div className="reveal d2"><div className="figure lg">{METRIC_GROUPS.length}</div>
              <div className="statlbl">Groups</div></div>
            <div className="reveal d3"><div className="figure lg">{METRICS.length}</div>
              <div className="statlbl">Common misreadings named</div></div>
          </div>
        </div>
      </section>

      <div className="wrap" style={{ paddingTop: 28 }}>
        <div className="breadcrumb"><Link href="/">Today</Link> / Explained</div>

        {METRIC_GROUPS.map((g) => (
          <section key={g} className="mb32 reveal">
            <SectionHead title={g} />
            <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(286px,1fr))", gap: 14 }}>
              {METRICS.filter((m) => m.group === g).map((m, i) => (
                <Link key={m.slug} href={`/explain/${m.slug}`}
                  className={`card tile reveal ${i % 3 === 1 ? "d1" : i % 3 === 2 ? "d2" : ""}`}>
                  <div className="between mb8">
                    <span className="chip">{m.level}</span>
                    <span className="num" style={{ fontSize: 15, fontWeight: 700 }}>{m.reading.value}</span>
                  </div>
                  <h3 style={{ fontSize: 18 }}>{m.name}</h3>
                  <p className="tiledek" style={{ fontSize: 13 }}>{m.plain}</p>
                  <div className="row mt8" style={{ gap: 6 }}>
                    <span className="meta">{m.drivers.length} factors</span>
                    <span className="meta">·</span>
                    <span className="meta" style={{ color: "var(--accent)" }}>What moves it →</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}

        <div className="mb32">
          <Notice>
            Factor weights are indicative shares of day-to-day variation, not precise
            decompositions. They exist so you can see which driver actually matters rather
            than treating all of them as equal.
          </Notice>
        </div>
      </div>
    </>
  );
}
