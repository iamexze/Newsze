import Link from "next/link";
import { FORECASTERS } from "@/lib/research";
import { SectionHead, Stat, Notice } from "@/components/Bits";

export const metadata = { title: "Forecaster scoreboard" };

export default function Scoreboard() {
  const ranked = [...FORECASTERS].sort((a, b) => b.record.hit - a.record.hit);
  const best = ranked[0], worst = ranked[ranked.length - 1];
  const avg = FORECASTERS.reduce((a, f) => a + f.record.hit, 0) / FORECASTERS.length;
  const belowCoin = FORECASTERS.filter((f) => f.record.hit < 0.5).length;

  return (
    <>
      <section className="band" style={{ paddingBlock: "42px 36px" }}>
        <div className="wrap">
          <div className="kicker accent">Scoreboard</div>
          <h1 style={{ fontSize: "clamp(32px,5.2vw,58px)", marginTop: 10, maxWidth: 940 }}>
            Who called it right
          </h1>
          <p className="sub" style={{ fontSize: 17, maxWidth: 740, marginTop: 14, lineHeight: 1.55 }}>
            Every forecaster we track, ranked by the only thing that matters: how often the
            direction they stated turned out correct at the horizon they stated it. Nothing is
            removed, including our own entry when it slips.
          </p>
          <div className="grid g4 mt32" style={{ gap: 20 }}>
            <div><div className="figure lg">{(best.record.hit * 100).toFixed(1)}%</div>
              <div className="statlbl">Best — {best.name}</div></div>
            <div><div className="figure lg">{(avg * 100).toFixed(1)}%</div>
              <div className="statlbl">Average across all tracked forecasters</div></div>
            <div><div className="figure lg">{belowCoin}</div>
              <div className="statlbl">Tracked forecasters below a coin flip</div></div>
            <div><div className="figure lg">{FORECASTERS.reduce((a, f) => a + f.record.n, 0).toLocaleString("en-IN")}</div>
              <div className="statlbl">Calls scored in total</div></div>
          </div>
        </div>
      </section>

      <div className="wrap" style={{ paddingTop: 28 }}>
        <div className="breadcrumb"><Link href="/">Today</Link> /{" "}
          <Link href="/forecasts">Forecasts</Link> / Scoreboard</div>

        <SectionHead title="Ranked by hit rate" href="/forecasts" more="Current views" />
        <div className="card pad0 mb32">
          <div className="scrollx">
            <table>
              <thead><tr>
                <th style={{ paddingLeft: 16, width: 40 }}>#</th>
                <th>Forecaster</th><th>Kind</th><th>Hit rate</th><th>Calls</th>
                <th>Brier</th><th>Bias</th><th style={{ paddingRight: 16 }}>Current view</th>
              </tr></thead>
              <tbody>
                {ranked.map((f, i) => (
                  <tr key={f.id} className="hoverable">
                    <td style={{ paddingLeft: 16, fontFamily: "var(--serif)", fontSize: 19 }}>{i + 1}</td>
                    <td>{f.name}</td>
                    <td style={{ fontFamily: "var(--sans)", fontSize: 11.5, color: "var(--muted)" }}>{f.kind}</td>
                    <td>
                      <span className="row" style={{ justifyContent: "flex-end", gap: 9 }}>
                        <span className="bar" style={{ width: 62 }}>
                          <i style={{ width: `${Math.max(2, ((f.record.hit - 0.45) / 0.2) * 100)}%`,
                            background: f.record.hit >= 0.6 ? "var(--up)"
                              : f.record.hit < 0.5 ? "var(--down)" : "var(--accent)" }} />
                        </span>
                        <span style={{ fontWeight: 600,
                          color: f.record.hit >= 0.6 ? "var(--up)" : f.record.hit < 0.5 ? "var(--down)" : undefined }}>
                          {(f.record.hit * 100).toFixed(1)}%</span>
                      </span>
                    </td>
                    <td style={{ color: "var(--muted)" }}>{f.record.n}</td>
                    <td style={{ color: f.record.brier > 0.25 ? "var(--warn)" : undefined }}>
                      {f.record.brier.toFixed(3)}</td>
                    <td style={{ fontFamily: "var(--sans)", fontSize: 11.5, color: "var(--muted)" }}>
                      {f.record.bias}</td>
                    <td style={{ paddingRight: 16 }}>
                      <span className={f.view === "up" ? "up" : f.view === "down" ? "down" : "flat"}>
                        {f.view === "up" ? "▲ higher" : f.view === "down" ? "▼ lower" : "▬ neutral"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)" }}>
            <p className="meta">
              Hit rate is the share of directional calls that proved correct at the stated
              horizon. Brier score measures probabilistic accuracy — lower is better, and 0.25
              is what random guessing produces on a 50/50 call. Bias records whether a
              forecaster&apos;s calls skew to one side regardless of conditions.
            </p>
          </div>
        </div>

        <div className="grid g2 mb32">
          <div className="ink">
            <div className="label mb12">The spread is narrower than it looks</div>
            <p className="sub">
              Best to worst across this set runs from {(best.record.hit * 100).toFixed(1)}% to{" "}
              {(worst.record.hit * 100).toFixed(1)}%. On a directional call, 50% is random. So the
              best forecaster here is roughly {((best.record.hit - 0.5) * 100).toFixed(1)}{" "}
              percentage points better than a coin, and the worst is{" "}
              {((0.5 - worst.record.hit) * 100).toFixed(1)} points worse.
            </p>
            <p className="sub mt12">
              That is the realistic scale of forecasting skill in markets. Anyone presenting a
              materially larger edge over a meaningful sample is either measuring selectively or
              not measuring at all.
            </p>
          </div>
          <div className="card">
            <div className="cardhead"><h2>How scoring works</h2></div>
            <ul style={{ listStyle: "none" }}>
              {[
                "A call is recorded when it is published, with its stated direction and horizon.",
                "It is scored automatically at that horizon against the realised move.",
                "Scores are never revised, and a forecaster cannot withdraw a call after the fact.",
                "Calls with no stated horizon are excluded rather than assigned one.",
                "Our own Bridge is scored on exactly the same basis as everyone else.",
              ].map((x) => (
                <li key={x} className="sub" style={{ padding: "8px 0 8px 18px", position: "relative",
                  borderBottom: "1px solid var(--border)" }}>
                  <span style={{ position: "absolute", left: 0, color: "var(--faint)" }}>—</span>{x}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mb32">
          <Notice>
            Forecasters shown here are illustrative, not real institutions — this is a prototype
            running on sample data. The scoring methodology is real and is the one we apply to
            our own published estimates on the{" "}
            <Link href="/track-record" style={{ color: "var(--warn)", fontWeight: 600 }}>Accuracy Ledger</Link>.
          </Notice>
        </div>
      </div>
    </>
  );
}
