import Link from "next/link";
import { FACTORS } from "@/lib/factors";
import { byId, chg } from "@/lib/data";
import { num } from "@/lib/format";
import { SectionHead, Delta, Spark, Notice } from "@/components/Bits";
import { ProTag } from "@/components/Pro";

export const metadata = {
  title: "Global factors",
  description: "Everything outside India that moves Indian markets — crude, gold, the dollar, US rates, China, crypto, global equities and geopolitics — with the mechanism and the evidence for each.",
};

const IMPACT_N = { high: 3, medium: 2, low: 1 } as const;

export default function GlobalFactors() {
  return (
    <>
      <section className="band" style={{ paddingBlock: "44px 38px" }}>
        <div className="wrap">
          <div className="kicker accent">Global factors</div>
          <h1 style={{ fontSize: "clamp(32px,5.2vw,58px)", marginTop: 10, maxWidth: 1000 }}>
            Eight things outside India that decide what happens inside it
          </h1>
          <p className="sub" style={{ fontSize: 17, maxWidth: 780, marginTop: 14, lineHeight: 1.55 }}>
            Crude, gold, the dollar, US rates, China, crypto, global equities and geopolitics.
            For each one: the mechanism, the published sensitivities, what to watch, and — where
            the honest answer is that it does not transmit reliably — we say that too.
          </p>
          <div className="grid g4 mt32" style={{ gap: 20 }}>
            <div><div className="figure lg">8</div><div className="statlbl">Factors tracked</div></div>
            <div><div className="figure lg">5</div><div className="statlbl">Rated high impact on India</div></div>
            <div><div className="figure lg">1</div><div className="statlbl">Rated low — crypto, and we explain why</div></div>
            <div><div className="figure lg">≈88%</div><div className="statlbl">Of India&apos;s crude, imported</div></div>
          </div>
        </div>
      </section>

      <div className="wrap" style={{ paddingTop: 28 }}>
        <div className="breadcrumb"><Link href="/">Today</Link> / Global factors</div>

        <div className="stack mb32" style={{ gap: 16 }}>
          {FACTORS.map((f) => {
            const insts = f.instruments.map((i) => byId(i)).filter(Boolean);
            return (
              <Link key={f.slug} href={`/global-factors/${f.slug}`} className="card tile">
                <div className="factor">
                  <div className="mark">{f.mark}</div>
                  <div className="min0">
                    <div className="between mb4" style={{ alignItems: "flex-start" }}>
                      <div className="min0">
                        <div className="row" style={{ gap: 8 }}>
                          <span className={`ev ${f.impact === "high" ? "supported"
                            : f.impact === "medium" ? "mixed" : "none"}`}>{f.impact} impact</span>
                          <span className="meta">{f.kicker}</span>
                        </div>
                        <h2 style={{ fontSize: 26, marginTop: 7 }}>{f.name}</h2>
                      </div>
                      <div className="row" style={{ gap: 14, flex: "0 0 auto" }}>
                        {insts.slice(0, 2).map((i) => {
                          const c = chg(i!);
                          return (
                            <div key={i!.id} style={{ textAlign: "right" }}>
                              <div className="meta">{i!.sym}</div>
                              <div className="num" style={{ fontSize: 14, fontWeight: 600 }}>
                                {num(i!.last, i!.last > 500 ? 0 : 2)}</div>
                              <Delta v={c} />
                            </div>
                          );
                        })}
                        {insts[0] && <Spark data={insts[0]!.hist} w={74} h={34} up={chg(insts[0]!) >= 0} />}
                      </div>
                    </div>
                    <p className="sub mt8" style={{ maxWidth: 760 }}>{f.summary}</p>
                    <div className="row mt12" style={{ gap: 8 }}>
                      <span className="chip a">{f.direction.length > 64
                        ? f.direction.slice(0, 62) + "…" : f.direction}</span>
                      {f.pro && <ProTag />}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <section className="band" style={{ paddingBlock: 34 }}>
          <div className="wrap">
            <div className="kicker accent">How to use this section</div>
            <div className="grid g3 mt16" style={{ gap: 26 }}>
              {[
                { h: "Rank by impact, not by headline volume", b: "Crypto generates far more coverage than the dollar index and matters far less to an Indian portfolio. Attention should follow transmission strength, not news volume — which is close to the opposite of how most feeds are ordered." },
                { h: "Watch the pairs that compound", b: "Crude and the rupee move together unhelpfully: higher oil raises dollar demand, which weakens the rupee, which raises the rupee cost of oil. Crude and gold rising together is the signature of genuine global risk-off. Single-factor reads miss both." },
                { h: "Expect offsetting effects", b: "Gold rising is good for gold-loan lenders, bad for the import bill, bad for jewellery volumes and good for reserve valuation. Any factor summarised as simply good or bad for Indian equity has been oversimplified." },
              ].map((c) => (
                <div key={c.h}>
                  <h3 style={{ fontSize: 19 }}>{c.h}</h3>
                  <p className="sub mt8">{c.b}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="mt32 mb32">
          <Notice>
            Mechanisms and cited sensitivities on these pages are real and attributed. Every
            live price figure is sample data. The two are kept apart deliberately.
          </Notice>
        </div>
      </div>
    </>
  );
}
