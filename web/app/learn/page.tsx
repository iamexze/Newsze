import Link from "next/link";
import { LESSONS } from "@/lib/research";
import { SectionHead } from "@/components/Bits";

export const metadata = { title: "Market study" };

export default function Learn() {
  const topics = Array.from(new Set(LESSONS.map((l) => l.topic)));
  return (
    <>
      <section className="band" style={{ paddingBlock: "42px 34px" }}>
        <div className="wrap">
          <div className="kicker accent">Market study</div>
          <h1 style={{ fontSize: "clamp(32px,5.2vw,56px)", marginTop: 10, maxWidth: 900 }}>
            How to read what this site shows you
          </h1>
          <p className="sub" style={{ fontSize: 17, maxWidth: 720, marginTop: 14, lineHeight: 1.55 }}>
            Short, specific explainers on the mechanics behind the numbers — what a surprise
            is, how an opening gap forms, how to read open interest without fooling yourself,
            and what the evidence actually says about predicting direction.
          </p>
        </div>
      </section>

      <div className="wrap" style={{ paddingTop: 28 }}>
        <div className="breadcrumb"><Link href="/">Today</Link> / Market study</div>
        <div className="row mb24" style={{ gap: 7 }}>
          {topics.map((t) => <span key={t} className="chip">{t}</span>)}
        </div>

        <div className="grid g2" style={{ gap: 18 }}>
          {LESSONS.map((l, i) => (
            <Link key={l.slug} href={`/learn/${l.slug}`} className="card tile">
              <div className="between mb8">
                <span className="row" style={{ gap: 7 }}>
                  <span className="chip">{l.topic}</span>
                  <span className="chip a">{l.level}</span>
                </span>
                <span className="meta">{l.minutes} min</span>
              </div>
              <h3 style={{ fontFamily: "var(--serif)", fontSize: 26, lineHeight: 1.12 }}>{l.title}</h3>
              <p className="tiledek" style={{ fontSize: 14.5, marginTop: 8 }}>{l.dek}</p>
              <span className="sub mt12" style={{ color: "var(--accent)", fontWeight: 600, display: "block" }}>
                Read →</span>
            </Link>
          ))}
        </div>

        <div className="mt32 mb32">
          <SectionHead title="Where to go next" />
          <div className="grid g3">
            {[
              { h: "The transmission study", d: "The eight channels through which global markets move Indian prices, each rated by what the published evidence shows.", href: "/transmission" },
              { h: "The signals review", d: "An honest scoreboard of the indicators traders watch — including the ones with no demonstrated predictive power.", href: "/signals" },
              { h: "The Accuracy Ledger", d: "Our own record, scored and permanent, as the worked example of everything these lessons argue for.", href: "/track-record" },
            ].map((c) => (
              <Link key={c.href} href={c.href} className="card tile">
                <h3 style={{ fontFamily: "var(--serif)", fontSize: 21 }}>{c.h}</h3>
                <p className="tiledek">{c.d}</p>
                <span className="sub mt8" style={{ color: "var(--accent)", fontWeight: 600, display: "block" }}>
                  Open →</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
