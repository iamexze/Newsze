import Link from "next/link";
import { CENTRAL_BANKS, STORIES } from "@/lib/data";
import { SectionHead, Stat } from "@/components/Bits";
import StoryTile from "@/components/StoryTile";

export const metadata = { title: "Central banks" };

export default function CentralBanks() {
  const stories = STORIES.filter((s) => s.section === "Central banks");
  return (
    <div className="wrap" style={{ paddingTop: 18 }}>
      <div className="breadcrumb"><Link href="/">Today</Link> / <Link href="/markets">Markets</Link> / Central banks</div>
      <div className="mb24">
        <div className="kicker">Policy rates and market-implied paths</div>
        <h1 style={{ fontSize: 32, marginTop: 4 }}>Central banks</h1>
        <p className="sub" style={{ maxWidth: 720, marginTop: 6 }}>
          Six central banks, their current rate, their next meeting and what the market is
          pricing. The implied path matters more than the level — a decision in line with
          pricing moves nothing.
        </p>
      </div>

      <div className="grid g2 mb24">
        {CENTRAL_BANKS.map((b) => {
          const easing = b.implied12m < 0;
          return (
            <div key={b.code} className="card">
              <div className="between mb12">
                <div>
                  <div className="label">{b.code}</div>
                  <div style={{ fontFamily: "var(--serif)", fontSize: 17, fontWeight: 600, marginTop: 2 }}>
                    {b.bank}</div>
                </div>
                <span className={`chip ${easing ? "dn" : "up"}`}>{b.stance}</span>
              </div>
              <div className="row" style={{ gap: 22, alignItems: "flex-end" }}>
                <Stat big={`${b.rate.toFixed(2)}%`} label="Policy rate" />
                <div>
                  <div className="num" style={{ fontSize: 15, color: "var(--muted)" }}>
                    from {b.prev.toFixed(2)}%
                  </div>
                  <div className="statlbl">Previous</div>
                </div>
              </div>
              <hr className="mt16 mb12" />
              <div className="stack" style={{ gap: 9 }}>
                {[["3 months", b.implied3m], ["12 months", b.implied12m]].map(([l, v]) => {
                  const val = v as number;
                  return (
                    <div key={l as string}>
                      <div className="between" style={{ marginBottom: 3 }}>
                        <span className="sub">Implied change, {l}</span>
                        <span className={`num ${val >= 0 ? "up" : "down"}`}>
                          {val > 0 ? "+" : ""}{(val * 100).toFixed(0)}bp</span>
                      </div>
                      <span className="wfb" style={{ display: "block", height: 13 }}>
                        <i style={{ [val >= 0 ? "left" : "right"]: "50%",
                          width: `${Math.min(50, Math.abs(val) * 80)}%`,
                          background: val >= 0 ? "var(--up)" : "var(--down)" } as React.CSSProperties} />
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="between mt12">
                <span className="meta">Next decision</span>
                <span className="num" style={{ fontSize: 12 }}>{b.next}</span>
              </div>
              <p className="sub mt8">{b.note}</p>
            </div>
          );
        })}
      </div>

      {stories.length > 0 && (<>
        <SectionHead title="Central bank stories" />
        <div className="tilegrid">{stories.map((s) => <StoryTile key={s.id} s={s} />)}</div>
      </>)}
    </div>
  );
}
