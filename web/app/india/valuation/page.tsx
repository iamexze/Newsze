import Link from "next/link";
import { VALUATION } from "@/lib/research";
import { SectionHead, Notice } from "@/components/Bits";
import Explain from "@/components/Explain";

export const metadata = { title: "Valuation" };

export default function Valuation() {
  const spread = VALUATION.find((v) => v.metric.includes("Earnings yield −"))!;
  return (
    <>
      <section className="band" style={{ paddingBlock: "40px 32px" }}>
        <div className="wrap">
          <div className="kicker accent">India · valuation</div>
          <h1 style={{ fontSize: "clamp(30px,4.8vw,52px)", marginTop: 10, maxWidth: 880 }}>
            Valuation tells you about the next five years, not the next five days
          </h1>
          <p className="sub" style={{ fontSize: 16.5, maxWidth: 720, marginTop: 12, lineHeight: 1.55 }}>
            Every metric here is shown against its own ten-year distribution, because a price-earnings
            ratio without a percentile is a number without a meaning. None of it has useful
            short-horizon predictive power, and we say so rather than implying otherwise.
          </p>
          <div className="grid g4 mt32" style={{ gap: 20 }}>
            <div><div className="figure lg">{VALUATION[0].value}</div>
              <div className="statlbl">Nifty 50 trailing P/E · {VALUATION[0].pctile}th percentile</div></div>
            <div><div className="figure lg">{spread.value}%</div>
              <div className="statlbl"><Explain metric="earnings-yield-spread">Earnings yield minus bond yield</Explain></div></div>
            <div><div className="figure lg">{VALUATION[5].value}</div>
              <div className="statlbl">Midcap P/E · {VALUATION[5].pctile}th percentile</div></div>
            <div><div className="figure lg">{VALUATION[6].value}×</div>
              <div className="statlbl">Market cap to GDP</div></div>
          </div>
        </div>
      </section>

      <div className="wrap" style={{ paddingTop: 28 }}>
        <div className="breadcrumb"><Link href="/">Today</Link> / <Link href="/india">India</Link> / Valuation</div>

        <SectionHead title="Against ten years of history" />
        <div className="stack mb32" style={{ gap: 12 }}>
          {VALUATION.map((v) => (
            <div key={v.metric} className="card">
              <div className="between mb12">
                <span style={{ fontWeight: 600, fontSize: 14.5 }}>{v.metric}</span>
                <span className="row" style={{ gap: 14 }}>
                  <span className="num" style={{ fontSize: 19, fontWeight: 600 }}>{v.value}</span>
                  <span className={`chip ${v.pctile > 75 ? "w" : v.pctile < 30 ? "up" : ""}`}>
                    {v.pctile}th percentile
                  </span>
                </span>
              </div>
              <div style={{ position: "relative", height: 24 }}>
                <div style={{ position: "absolute", inset: "9px 0", background: "var(--sunken)", borderRadius: 3 }} />
                <div style={{ position: "absolute", top: 9, bottom: 9, left: 0, width: "30%",
                  background: "var(--up)", opacity: .16, borderRadius: "3px 0 0 3px" }} />
                <div style={{ position: "absolute", top: 9, bottom: 9, left: "75%", right: 0,
                  background: "var(--warn)", opacity: .16, borderRadius: "0 3px 3px 0" }} />
                <div style={{ position: "absolute", top: 2, bottom: 2, left: `${v.pctile}%`, width: 3,
                  background: "var(--ink)", transform: "translateX(-1.5px)", borderRadius: 2 }} />
              </div>
              <div className="between meta mt4">
                <span>cheap</span>
                <span>10-year average {v.avg10}</span>
                <span>expensive</span>
              </div>
              {v.note && <p className="sub mt8">{v.note}</p>}
            </div>
          ))}
        </div>

        <div className="grid g2 mb32">
          <div className="ink">
            <div className="label mb12">The spread that actually matters</div>
            <p className="sub">
              Earnings yield minus the ten-year government bond yield compares what equity
              earns you against the risk-free alternative. It currently sits at{" "}
              <strong style={{ color: "var(--on-ink)" }}>{spread.value}%</strong> — negative,
              meaning bonds yield more than the index earns — in the{" "}
              {spread.pctile}th percentile of its ten-year range.
            </p>
            <p className="sub mt12">
              This has some long-horizon explanatory power for subsequent returns and
              essentially none over a trading week. It is an allocation input, not a timing
              input, and treating it as the latter is a common and expensive confusion.
            </p>
          </div>
          <div className="card">
            <div className="cardhead"><h2>Why no estimate here</h2></div>
            <p className="sub">
              Every analytics page on this site either carries an impact estimate or explains
              why it does not. This one does not, because valuation measures have never cleared
              our calibration bar at the horizons we publish — 15 minutes to 20 days.
            </p>
            <p className="sub mt12">
              The honest framing is that valuation describes the price you are paying for a
              stream of future earnings. It says nothing reliable about what happens between
              now and Friday.
            </p>
            <Link href="/signals" className="sub mt12"
              style={{ color: "var(--accent)", fontWeight: 600, display: "block" }}>
              See the full evidence review →</Link>
          </div>
        </div>

        <div className="mb32">
          <Notice>
            Percentile context is descriptive. A top-decile valuation has historically been
            associated with lower subsequent long-horizon returns, which is not the same as a
            prediction about any particular period.
          </Notice>
        </div>
      </div>
    </>
  );
}
