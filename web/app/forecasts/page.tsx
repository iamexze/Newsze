import Link from "next/link";
import { FORECASTERS } from "@/lib/research";
import { SectionHead, Stat, Notice } from "@/components/Bits";

export const metadata = {
  title: "Who thinks the market goes up",
  description: "Every forecast we track, in one place, with each forecaster's scored record attached.",
};

export default function Forecasts() {
  const up = FORECASTERS.filter((f) => f.view === "up");
  const down = FORECASTERS.filter((f) => f.view === "down");
  const neutral = FORECASTERS.filter((f) => f.view === "neutral");
  const n = FORECASTERS.length;
  const upPct = (up.length / n) * 100;
  const neuPct = (neutral.length / n) * 100;
  const downPct = (down.length / n) * 100;
  // weight each view by that forecaster's own hit rate
  const wUp = up.reduce((a, f) => a + f.record.hit, 0);
  const wDown = down.reduce((a, f) => a + f.record.hit, 0);
  const wTotal = FORECASTERS.reduce((a, f) => a + f.record.hit, 0);
  const skew = ((wUp - wDown) / wTotal) * 100;

  return (
    <>
      <section className="band" style={{ paddingBlock: "42px 36px" }}>
        <div className="wrap">
          <div className="kicker accent">Forecast aggregator</div>
          <h1 style={{ fontSize: "clamp(32px,5.2vw,58px)", marginTop: 10, maxWidth: 980 }}>
            Everyone has a view on where the market goes. Almost nobody keeps score.
          </h1>
          <p className="sub" style={{ fontSize: 17, maxWidth: 760, marginTop: 14, lineHeight: 1.55 }}>
            We collect the forecasts — brokerage targets, model output, survey consensus, the
            option-implied distribution, our own Bridge — and attach each forecaster&apos;s
            historical record to their current call. A view without a track record is an
            opinion. A view with one is information.
          </p>

          <div className="mt32">
            <div className="between mb8">
              <span className="label">Consensus of {n} tracked forecasters</span>
              <span className="meta">weighted by each forecaster&apos;s own hit rate</span>
            </div>
            <div className="gauge" style={{ height: 38 }}>
              <span className="seg" style={{ left: 0, width: `${downPct}%`, background: "var(--down)", opacity: .85 }} />
              <span className="seg" style={{ left: `${downPct}%`, width: `${neuPct}%`, background: "#3A3A3A" }} />
              <span className="seg" style={{ left: `${downPct + neuPct}%`, width: `${upPct}%`, background: "var(--up)", opacity: .85 }} />
              <span className="mark" style={{ left: `${50 + skew / 2}%` }} />
            </div>
            <div className="between meta mt8">
              <span>{down.length} lower</span>
              <span>{neutral.length} neutral</span>
              <span>{up.length} higher</span>
            </div>
            <p className="sub mt16" style={{ maxWidth: 700 }}>
              The vertical mark is the hit-rate-weighted skew, not the headcount. Weighting
              matters: the most bullish forecaster in this set has the second-worst record, and
              the retail sentiment poll has been right less than half the time.
            </p>
          </div>
        </div>
      </section>

      <div className="wrap" style={{ paddingTop: 28 }}>
        <div className="breadcrumb"><Link href="/">Today</Link> / Forecasts</div>

        <div className="cols mb32">
          <div className="min0">
            <SectionHead title="Current views" href="/forecasts/scoreboard" more="Scoreboard" />
            <div className="stack" style={{ gap: 12 }}>
              {FORECASTERS.map((f) => {
                const tone = f.view === "up" ? "up" : f.view === "down" ? "down" : "flat";
                const glyph = f.view === "up" ? "▲" : f.view === "down" ? "▼" : "▬";
                return (
                  <article key={f.id} className="card">
                    <div className="between mb12" style={{ alignItems: "flex-start" }}>
                      <div className="min0">
                        <div className="row" style={{ gap: 8 }}>
                          <span className="chip">{f.kind}</span>
                          <span className="meta">{f.horizon} · as of {f.asOf}</span>
                        </div>
                        <h3 style={{ fontFamily: "var(--serif)", fontSize: 23, marginTop: 6 }}>{f.name}</h3>
                      </div>
                      <div style={{ textAlign: "right", flex: "0 0 auto" }}>
                        <div className={tone} style={{ fontSize: 26, lineHeight: 1 }}>{glyph}</div>
                        {f.target && <div className="num mt4" style={{ fontSize: 12 }}>{f.target}</div>}
                      </div>
                    </div>
                    <p className="sub">{f.rationale}</p>
                    <hr className="mt12 mb12" />
                    <div className="row" style={{ gap: 20, flexWrap: "wrap" }}>
                      <span><span className="num" style={{ fontSize: 15, fontWeight: 600 }}>
                        {(f.record.hit * 100).toFixed(1)}%</span>
                        <span className="meta"> hit rate</span></span>
                      <span><span className="num" style={{ fontSize: 15, fontWeight: 600 }}>{f.record.n}</span>
                        <span className="meta"> scored calls</span></span>
                      <span><span className="num" style={{ fontSize: 15, fontWeight: 600 }}>
                        {f.record.brier.toFixed(3)}</span>
                        <span className="meta"> Brier</span></span>
                      <span className={`chip ${f.record.bias === "bullish" ? "up"
                        : f.record.bias === "bearish" ? "dn" : ""}`}>
                        {f.record.bias} bias</span>
                      {f.record.hit < 0.5 && <span className="chip dn">below a coin flip</span>}
                    </div>
                    <div className="bar mt12">
                      <i style={{ width: `${((f.record.hit - 0.45) / 0.2) * 100}%`,
                        background: f.record.hit >= 0.6 ? "var(--up)"
                          : f.record.hit < 0.5 ? "var(--down)" : "var(--accent)" }} />
                    </div>
                    <div className="meta mt4" style={{ fontSize: 9.5 }}>
                      scale: 45% ——— 65% · 50% is random
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <aside className="stack" style={{ gap: 16 }}>
            <div className="ink">
              <div className="label mb12">How to read a consensus</div>
              <p className="sub">
                A consensus is not a forecast. It is a description of what a group of people
                currently believe, and groups of forecasters are systematically biased toward
                the bullish side because that is where their business incentives sit.
              </p>
              <p className="sub mt12">
                In this sample, {up.length} of {n} tracked forecasters are positioned higher.
                Weighted by their own historical accuracy, the skew is materially smaller than
                the headcount suggests.
              </p>
              <hr className="mt16 mb16" />
              <p className="sub">
                The most useful column on this page is the hit rate, not the view.
              </p>
            </div>

            <div className="card">
              <div className="cardhead"><h2>What we track</h2></div>
              <ul style={{ listStyle: "none" }}>
                {["Published brokerage and bank targets","Survey consensus across contributors",
                  "The option-implied risk-neutral distribution","Systematic model output — trend, mean-reversion, macro nowcast",
                  "Retail sentiment polling","Our own Overnight Bridge"].map((x) => (
                  <li key={x} className="sub" style={{ padding: "7px 0 7px 16px", position: "relative",
                    borderBottom: "1px solid var(--border)" }}>
                    <span style={{ position: "absolute", left: 0, color: "var(--faint)" }}>—</span>{x}
                  </li>
                ))}
              </ul>
              <p className="meta mt12">
                Each is scored on the same basis: did the direction stated at the stated horizon
                turn out correct.
              </p>
            </div>

            <Notice>
              Aggregating other people&apos;s forecasts is not an endorsement of any of them, and
              the consensus is not our view. We publish this because knowing what is already
              expected is more useful than being told what to expect.
            </Notice>
          </aside>
        </div>
      </div>
    </>
  );
}
