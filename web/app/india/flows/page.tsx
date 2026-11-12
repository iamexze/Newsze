import Link from "next/link";
import { FLOWS, PARTICIPANTS, MACRO_IN, STORIES } from "@/lib/data";
import { crore } from "@/lib/format";
import { SectionHead, Stat, Notice } from "@/components/Bits";
import StoryTile from "@/components/StoryTile";
import Explain from "@/components/Explain";

export const metadata = { title: "FII / DII flows" };

export default function Flows() {
  const max = Math.max(...FLOWS.flatMap((f) => [Math.abs(f.fii), Math.abs(f.dii)]));
  const fiiSum = FLOWS.reduce((a, f) => a + f.fii, 0);
  const diiSum = FLOWS.reduce((a, f) => a + f.dii, 0);
  const sip = MACRO_IN.find((m) => m.name === "SIP inflows")!;
  const stories = STORIES.filter((s) => s.section === "Flows");

  return (
    <div className="wrap" style={{ paddingTop: 18 }}>
      <div className="breadcrumb"><Link href="/">Today</Link> / <Link href="/india">India</Link> / Flows</div>
      <div className="mb24">
        <div className="kicker">Provisional exchange data · daily</div>
        <h1 style={{ fontSize: 32, marginTop: 4 }}>Institutional flows</h1>
        <p className="sub" style={{ maxWidth: 720, marginTop: 6 }}>
          Who is buying and who is selling. For the last three years the single most important
          structural fact about this market has been that domestic flows are large enough to
          absorb foreign selling.
        </p>
      </div>

      <div className="grid g4 mb24">
        <Explain metric="fii-flow"><Stat big={crore(fiiSum * 1e7, 0)} label="FII net, 15 sessions" tone="down" /></Explain>
        <Stat big={crore(diiSum * 1e7, 0)} label="DII net, 15 sessions" tone="up" />
        <Stat big={`₹${(sip.value / 1000).toFixed(1)}k cr`} label="Monthly SIP inflow" />
        <Stat big="11 / 13" label="Sessions DII absorbed FII" />
      </div>

      <div className="cols">
        <div className="min0">
          <SectionHead title="Daily net flows — cash segment" />
          <div className="card mb24">
            <div className="row mb16" style={{ gap: 16 }}>
              <span className="row" style={{ gap: 6 }}>
                <span className="dot" style={{ background: "var(--down)" }} />
                <span className="sub">FII (foreign)</span></span>
              <span className="row" style={{ gap: 6 }}>
                <span className="dot" style={{ background: "var(--up)" }} />
                <span className="sub">DII (domestic)</span></span>
              <span className="meta" style={{ marginLeft: "auto" }}>₹ crore</span>
            </div>
            <div className="stack" style={{ gap: 7 }}>
              {FLOWS.map((f) => (
                <div key={f.d} className="row" style={{ gap: 10 }}>
                  <span className="meta" style={{ width: 52, flex: "0 0 auto" }}>{f.d}</span>
                  <span className="wfb" style={{ flex: 1, height: 16 }}>
                    <i style={{ right: "50%", width: `${(Math.max(0, -f.fii) / max) * 50}%`, background: "var(--down)" }} />
                    <i style={{ left: "50%", width: `${(Math.max(0, f.fii) / max) * 50}%`, background: "var(--down)", opacity: .55 }} />
                    <i style={{ left: "50%", width: `${(Math.max(0, f.dii) / max) * 50}%`, background: "var(--up)" }} />
                    <i style={{ right: "50%", width: `${(Math.max(0, -f.dii) / max) * 50}%`, background: "var(--up)", opacity: .55 }} />
                  </span>
                  <span className="num" style={{ width: 150, textAlign: "right", flex: "0 0 auto", fontSize: 12 }}>
                    <span className="down">{f.fii > 0 ? "+" : ""}{f.fii.toLocaleString("en-IN")}</span>
                    <span style={{ color: "var(--faint)" }}> / </span>
                    <span className="up">{f.dii > 0 ? "+" : ""}{f.dii.toLocaleString("en-IN")}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <SectionHead title="Participant-wise open interest" />
          <div className="card pad0 mb24">
            <div className="scrollx">
              <table>
                <thead>
                  <tr>
                    <th style={{ paddingLeft: 14 }}>Participant</th>
                    <th>Index fut net</th><th>Index opt net</th><th>Stock fut net</th>
                    <th style={{ paddingRight: 14 }}>Read</th>
                  </tr>
                </thead>
                <tbody>
                  {PARTICIPANTS.map((p) => {
                    const f = p.idxFutLong - p.idxFutShort;
                    const o = p.idxOptLong - p.idxOptShort;
                    const s = p.stkFutLong - p.stkFutShort;
                    return (
                      <tr key={p.who} className="hoverable">
                        <td style={{ paddingLeft: 14 }}>{p.who}</td>
                        <td className={f >= 0 ? "up" : "down"}>{f > 0 ? "+" : ""}{(f / 1000).toFixed(1)}k</td>
                        <td className={o >= 0 ? "up" : "down"}>{o > 0 ? "+" : ""}{(o / 1000).toFixed(1)}k</td>
                        <td className={s >= 0 ? "up" : "down"}>{s > 0 ? "+" : ""}{(s / 1000).toFixed(1)}k</td>
                        <td style={{ paddingRight: 14, fontFamily: "var(--sans)", fontSize: 11.5,
                          color: "var(--muted)", whiteSpace: "normal", textAlign: "right" }}>
                          {p.who === "FII" ? "Net short index futures" :
                           p.who === "DII" ? "Net long, steadily" :
                           p.who === "Pro" ? "Roughly flat, option-heavy" : "Net long futures, net short stock futures"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ padding: "11px 14px", borderTop: "1px solid var(--border)" }}>
              <p className="meta">
                The FII versus Client divergence is what most people come to this table for:
                foreign institutions are net short index futures while retail clients are net
                long. That divergence has historically been informative at extremes, and
                uninformative in the middle — our ledger for this event class shows a 57.8%
                hit rate, which is why it carries a low confidence.
              </p>
            </div>
          </div>

          {stories.length > 0 && (<>
            <SectionHead title="Flow stories" />
            <div className="tilegrid">{stories.map((s) => <StoryTile key={s.id} s={s} />)}</div>
          </>)}
        </div>

        <aside className="stack" style={{ gap: 16 }}>
          <div className="card">
            <div className="cardhead"><h2>Why this matters</h2></div>
            <p className="sub">
              India has roughly 19 crore demat accounts and systematic investment plans running
              at a record monthly rate. That domestic bid is the reason sustained foreign
              selling has not produced the index falls it would have caused a decade ago.
            </p>
            <p className="sub mt12">
              The practical consequence for a trader is that FII selling alone is a far weaker
              signal than it used to be. It has to be read against what domestic institutions
              are doing on the same day.
            </p>
          </div>
          <Notice>
            Flow data is provisional on the day of publication and is revised by the exchanges.
            Figures here are sample data for demonstration.
          </Notice>
        </aside>
      </div>
    </div>
  );
}
