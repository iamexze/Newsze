import Link from "next/link";
import { Story, byId } from "@/lib/data";
import { Conf } from "./Bits";

/** The atomic unit of the product. Renders one Event's impacts across
 *  instruments at a chosen horizon, with the publication gate honoured:
 *  a suppressed impact shows the honest empty state, never a number. */
export default function ImpactCard({ story, horizon = "1d", compact = false }:
  { story: Story; horizon?: string; compact?: boolean }) {
  const rows = story.impacts.filter((i) => i.horizon === horizon);
  const shown = rows.length ? rows : story.impacts;
  if (!shown.length) {
    return (
      <div className="impact">
        <div className="ihead"><span className="label">Expected impact</span></div>
        <div className="ibody">
          <div className="nohist"><span>⚠</span>
            <span>No impact is computed for tier-4 sources. This item is tracked, not estimated.</span></div>
        </div>
      </div>
    );
  }
  return (
    <div className="impact">
      <div className="ihead">
        <span className="label">Expected impact</span>
        <span className="pill">{shown[0].horizon}</span>
        {story.surpriseZ !== null && (
          <span className="chip a" title="Standardised surprise versus consensus">
            surprise z {story.surpriseZ > 0 ? "+" : ""}{story.surpriseZ.toFixed(1)}
          </span>
        )}
      </div>
      <div className="ibody">
        <div className="scrollx">
          <table>
            <thead>
              <tr>
                <th>Instrument</th><th>Expected</th>
                {!compact && <th>68% range</th>}
                <th>P(up)</th><th>n</th>{!compact && <th>Conf</th>}
              </tr>
            </thead>
            <tbody>
              {shown.map((im) => {
                const inst = byId(im.instrument);
                if (im.suppressed || im.expected === null) {
                  return (
                    <tr key={im.instrument + im.horizon}>
                      <td colSpan={compact ? 4 : 6} style={{ textAlign: "left" }}>
                        <span className="warnc" style={{ fontStyle: "italic", fontFamily: "var(--sans)", fontSize: 12.5 }}>
                          {inst?.sym ?? im.instrument} — not enough history to call this (n={im.n})
                        </span>
                      </td>
                    </tr>
                  );
                }
                const dirc = im.expected > 0 ? "up" : im.expected < 0 ? "down" : "flat";
                return (
                  <tr key={im.instrument + im.horizon} className="hoverable">
                    <td>
                      <Link href={`/ticker/${encodeURIComponent(im.instrument)}`}>
                        {inst?.sym ?? im.instrument}
                      </Link>
                    </td>
                    <td className={dirc}>
                      {im.expected > 0 ? "▲ +" : im.expected < 0 ? "▼ " : "▬ "}
                      {im.expected.toFixed(2)}%
                    </td>
                    {!compact && <td style={{ color: "var(--muted)" }}>
                      {im.b68![0].toFixed(1)} · {im.b68![1].toFixed(1)}
                    </td>}
                    <td>{Math.round((im.probUp ?? 0) * 100)}%</td>
                    <td style={{ color: im.n < 12 ? "var(--warn)" : undefined }}>{im.n}</td>
                    {!compact && <td><Conf v={im.conf ?? 0} /></td>}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="ifoot">
        <span>analog + event-study ensemble</span>
        <span>impact-v1.4.2</span>
        <Link href="/methodology" style={{ color: "var(--accent)" }}>how this is built →</Link>
      </div>
    </div>
  );
}
