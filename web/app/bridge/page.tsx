import Link from "next/link";
import { BRIDGE, storyBySlug, byId, OPTION_CHAIN } from "@/lib/data";
import { num } from "@/lib/format";
import Waterfall from "@/components/Waterfall";
import ImpactCard from "@/components/ImpactCard";
import { SectionHead, Stat, Notice, Tier } from "@/components/Bits";
import Explain from "@/components/Explain";

export const metadata = { title: "Overnight Bridge" };

export default function BridgePage() {
  const [nifty, bank] = BRIDGE.estimates;
  const stories = BRIDGE.topStories.map((s) => storyBySlug(s)!).filter(Boolean);
  const hist = BRIDGE.history;
  const maxErr = Math.max(...hist.map((h) => Math.abs(h.err)));

  return (
    <div className="wrap" style={{ paddingTop: 18 }}>
      <div className="breadcrumb"><Link href="/">Today</Link> / Overnight Bridge</div>
      <div className="between mb16">
        <div>
          <div className="kicker">Published {BRIDGE.publishedAt} · every trading day</div>
          <h1 style={{ fontSize: 34, marginTop: 4 }}>The Overnight Bridge</h1>
          <p className="sub" style={{ maxWidth: 680, marginTop: 6 }}>
            What happened globally between yesterday&apos;s close and this morning, converted into
            an expected Indian open — with every component of the gap named, and the whole
            estimate scored against the actual open at 09:16.
          </p>
        </div>
      </div>

      <div className="cols">
        <div className="min0">
          {/* estimates */}
          <div className="grid g2">
            {BRIDGE.estimates.map((e) => {
              const inst = byId(e.id)!;
              const span = e.b95[1] - e.b95[0];
              const pos = ((e.open - e.b95[0]) / span) * 100;
              const b68l = ((e.b68[0] - e.b95[0]) / span) * 100;
              const b68w = ((e.b68[1] - e.b68[0]) / span) * 100;
              return (
                <div key={e.id} className="card">
                  <div className="hero">
                    <div className="sym">{inst.name} · expected open</div>
                    <div className={`big ${e.gapPct < 0 ? "down" : "up"}`}>{num(e.open, 0)}</div>
                    <div className={`dl ${e.gapPct < 0 ? "down" : "up"}`}>
                      {e.gapPct < 0 ? "▼" : "▲"} {Math.abs(e.gapPct).toFixed(2)}% ·{" "}
                      {num(e.open - e.prevClose, 0)} pts from {num(e.prevClose, 0)}
                    </div>
                  </div>
                  {/* probability cone */}
                  <div style={{ position: "relative", height: 22, marginTop: 14 }}>
                    <div style={{ position: "absolute", inset: "7px 0", background: "var(--sunken)", borderRadius: 4 }} />
                    <div style={{ position: "absolute", top: 7, bottom: 7, left: `${b68l}%`, width: `${b68w}%`,
                      background: "var(--border-strong)", borderRadius: 4 }} />
                    <div style={{ position: "absolute", top: 0, bottom: 0, left: `${pos}%`, width: 2,
                      background: e.gapPct < 0 ? "var(--down)" : "var(--up)", transform: "translateX(-1px)" }} />
                  </div>
                  <div className="between meta mt4">
                    <span>{num(e.b95[0], 0)}</span>
                    <span style={{ color: "var(--muted)" }}>68% {num(e.b68[0], 0)}–{num(e.b68[1], 0)}</span>
                    <span>{num(e.b95[1], 0)}</span>
                  </div>
                  <hr className="mt12 mb12" />
                  <div className="between"><span className="sub">Confidence</span><span className="num">{e.conf.toFixed(2)}</span></div>
                  <div className="between mt4"><span className="sub"><Explain metric="gap-fill">Gap fills same session</Explain></span>
                    <span className="num">{Math.round(e.gapFill * 100)}% <span className="meta">(n={e.gapFillN})</span></span></div>
                </div>
              );
            })}
          </div>

          {/* waterfall */}
          <div className="card mt16">
            <div className="cardhead"><h2>Why — attribution of the gap</h2>
              <span className="tag">index points</span></div>
            <Waterfall rows={BRIDGE.attribution} />
            <p className="sub mt12">
              Each component is the model&apos;s estimate of that driver&apos;s contribution,
              holding the others fixed. They sum to the net gap by construction. Components
              linked to an event open its story.
            </p>
          </div>

          {/* top events */}
          <div className="mt32">
            <SectionHead title="What matters today" href="/wire" more="Live wire" />
            <div className="stack" style={{ gap: 16 }}>
              {stories.map((s) => (
                <div key={s.id} className="card">
                  <div className="storyline mb8">
                    <Tier t={s.tier} /><span>{s.outlets[0]} +{s.sourceCount - 1}</span>
                    <span className="chip a">{s.type}</span>
                  </div>
                  <h3 style={{ fontSize: 19, marginBottom: 6 }}>
                    <Link href={`/story/${s.slug}`}>{s.headline}</Link>
                  </h3>
                  <p className="sub mb12">{s.dek}</p>
                  <ImpactCard story={s} horizon="1d" compact />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* rail */}
        <aside className="stack" style={{ gap: 16 }}>
          <div className="card">
            <div className="cardhead"><h2>Key levels</h2><span className="tag">from yesterday&apos;s OI</span></div>
            <table>
              <tbody>
                <tr><td><Explain metric="max-pain">Max pain</Explain></td><td className="num">{num(BRIDGE.levels.maxPain, 0)}</td></tr>
                <tr><td>High OI put</td><td className="num">{num(BRIDGE.levels.highOiPE, 0)}</td></tr>
                <tr><td>High OI call</td><td className="num">{num(BRIDGE.levels.highOiCE, 0)}</td></tr>
                <tr><td><Explain metric="pcr">Put-call ratio</Explain></td><td className="num">{BRIDGE.levels.pcr.toFixed(2)}</td></tr>
                <tr><td>Prior VWAP</td><td className="num">{num(BRIDGE.levels.prevVwap, 0)}</td></tr>
              </tbody>
            </table>
            <p className="meta mt12">Levels are data, not recommendations.</p>
          </div>

          <div className="card">
            <div className="cardhead"><h2>Our record on this</h2><span className="tag">30 days</span></div>
            <div className="grid g2" style={{ gap: 12 }}>
              <Stat big={`${BRIDGE.mae30}`} label="Mean error, pts" />
              <Stat big={`${BRIDGE.onTime30}/30`} label="Published on time" />
            </div>
            <hr className="mt12 mb12" />
            <div className="stack" style={{ gap: 6 }}>
              {hist.map((h) => (
                <div key={h.d} className="row" style={{ gap: 8, fontSize: 11.5 }}>
                  <span className="meta" style={{ width: 44, flex: "0 0 auto" }}>{h.d}</span>
                  <span className="wfb" style={{ flex: 1, height: 12 }}>
                    <i style={{
                      [h.err >= 0 ? "left" : "right"]: "50%",
                      width: `${(Math.abs(h.err) / maxErr) * 50}%`,
                      background: h.hit ? "var(--up)" : "var(--down)",
                    } as React.CSSProperties} />
                  </span>
                  <span className="num" style={{ width: 58, textAlign: "right", flex: "0 0 auto" }}>
                    {h.err > 0 ? "+" : ""}{h.err} {h.hit ? "✓" : "✗"}
                  </span>
                </div>
              ))}
            </div>
            <p className="meta mt12">✓ = the actual open fell inside our 68% range. Misses stay on the record.</p>
            <Link href="/track-record" className="sub mt8" style={{ color: "var(--accent)", fontWeight: 600 }}>
              Full Accuracy Ledger →
            </Link>
          </div>

          <div className="card">
            <div className="cardhead"><h2>Method</h2></div>
            <p className="sub">
              Inputs: GIFT Nifty level and basis, the US close and after-hours, the Asian
              session, ADR dislocation against the Indian close, DXY and USD/INR, Brent in
              rupee terms, UST and G-Sec yields, overnight events and their impacts,
              prior-day FII/DII flows, prior-day open-interest structure, India VIX and days
              to expiry.
            </p>
            <Link href="/methodology" className="sub mt8" style={{ color: "var(--accent)", fontWeight: 600 }}>
              Read the methodology →
            </Link>
          </div>
        </aside>
      </div>

      <div className="mt32">
        <Notice>
          The Bridge is a statistical estimate of the opening level, not a prediction of the
          trading day and not a trading instruction. It is wrong regularly; the 30-day record
          above is published precisely so you can judge how wrong.
        </Notice>
      </div>
    </div>
  );
}
