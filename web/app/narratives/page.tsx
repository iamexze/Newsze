import Link from "next/link";
import { NARRATIVES, byId } from "@/lib/data";
import { SectionHead, Notice, Spark } from "@/components/Bits";

export const metadata = { title: "Narrative tracker" };

export default function Narratives() {
  const maxShare = Math.max(...NARRATIVES.map((n) => n.share));
  return (
    <div className="wrap" style={{ paddingTop: 18 }}>
      <div className="breadcrumb"><Link href="/">Today</Link> / Narratives</div>
      <div className="mb24">
        <div className="kicker">Share of market conversation · rolling 7 days</div>
        <h1 style={{ fontSize: 34, marginTop: 4 }}>Narrative tracker</h1>
        <p className="sub" style={{ maxWidth: 760, marginTop: 8, fontSize: 15 }}>
          What the market is arguing about, how fast each theme is spreading, and — the part
          that is actually useful — where a narrative has detached from the price it is supposed
          to be about.
        </p>
      </div>

      <div className="stack" style={{ gap: 14 }}>
        {NARRATIVES.map((n) => (
          <div key={n.label} className="card">
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 180px", gap: 20,
              alignItems: "center" }}>
              <div className="min0">
                <div className="between mb8">
                  <h3 style={{ fontFamily: "var(--serif)", fontSize: 19 }}>{n.label}</h3>
                  <span className="row" style={{ gap: 8 }}>
                    <span className={`chip ${n.wow > 50 ? "w" : n.wow >= 0 ? "up" : "dn"}`}>
                      {n.wow > 0 ? "+" : ""}{n.wow}% w/w
                    </span>
                    {n.divergence > 0.5 && <span className="chip w">price divergence</span>}
                  </span>
                </div>
                <div className="bar" style={{ height: 7 }}>
                  <i style={{ width: `${(n.share / maxShare) * 100}%` }} />
                </div>
                <div className="between meta mt4">
                  <span>{n.share.toFixed(1)}% share of conversation</span>
                  <span>sentiment {n.sentiment > 0 ? "+" : ""}{n.sentiment.toFixed(1)}</span>
                </div>
                {n.note && <p className="sub mt8">{n.note}</p>}
                <div className="row mt8" style={{ gap: 6 }}>
                  {n.instruments.map((id) => {
                    const i = byId(id);
                    return i ? (
                      <Link key={id} href={`/ticker/${encodeURIComponent(id)}`} className="chip">
                        {i.sym}
                      </Link>
                    ) : null;
                  })}
                </div>
              </div>
              <div>
                <div className="meta mb4">narrative vs price</div>
                <div style={{ position: "relative", height: 54, background: "var(--sunken)",
                  borderRadius: 4, overflow: "hidden", border: "1px solid var(--border)" }}>
                  <svg viewBox="0 0 100 40" preserveAspectRatio="none"
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden="true">
                    <polyline points="0,32 14,30 28,26 42,21 56,15 70,10 84,6 100,3"
                      fill="none" stroke="var(--accent)" strokeWidth="1.6" />
                    <polyline points={`0,30 14,29 28,28 42,${28 - n.divergence * 4} 56,${27 - n.divergence * 8} 70,${26 - n.divergence * 11} 84,${26 - n.divergence * 14} 100,${25 - n.divergence * 16}`}
                      fill="none" stroke="var(--muted)" strokeWidth="1.6" strokeDasharray="3 2" />
                  </svg>
                </div>
                <div className="meta mt4" style={{ fontSize: 9.5 }}>
                  <span style={{ color: "var(--accent)" }}>──</span> mentions{" "}
                  <span style={{ color: "var(--muted)" }}>- -</span> basket price
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt32">
        <SectionHead title="Why divergence matters" />
        <div className="grid g2">
          <div className="card">
            <p className="sub">
              A narrative that intensifies while the prices it concerns stop responding is
              information. It usually means one of two things: the market has finished pricing
              the idea and the commentary is lagging, or the idea is being talked into
              existence without a mechanism behind it.
            </p>
            <p className="sub mt12">
              Either way, the moment of divergence is more useful than the narrative itself.
              That is what the dashed line against the solid line on each card is showing.
            </p>
          </div>
          <div className="card">
            <p className="sub">
              The tracker measures share of conversation across the sources we ingest, not
              sentiment on social media. Tier-4 social sources are excluded from the share
              calculation entirely, for the same reason they never produce an impact estimate:
              they are trivially manipulable.
            </p>
            <Link href="/methodology" className="sub mt12"
              style={{ color: "var(--accent)", fontWeight: 600, display: "block" }}>
              Read the methodology →</Link>
          </div>
        </div>
      </div>

      <div className="mt24">
        <Notice>
          Narrative measures are descriptive. We publish no impact estimate from narrative data
          alone — it has never cleared our calibration bar as a standalone input.
        </Notice>
      </div>
    </div>
  );
}
