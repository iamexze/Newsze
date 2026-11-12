import Link from "next/link";
import { MACRO_IN, CENTRAL_BANKS, STORIES, byId } from "@/lib/data";
import { SectionHead, Stat, QuoteRow } from "@/components/Bits";
import StoryTile from "@/components/StoryTile";

export const metadata = { title: "Indian macro" };

export default function Macro() {
  const stories = STORIES.filter((s) => s.section === "Economy" && s.region === "IN");
  const rbi = CENTRAL_BANKS.find((b) => b.code === "RBI")!;

  return (
    <div className="wrap" style={{ paddingTop: 18 }}>
      <div className="breadcrumb"><Link href="/">Today</Link> / <Link href="/india">India</Link> / Macro</div>
      <div className="mb24">
        <div className="kicker">MoSPI · RBI · Ministry of Finance · S&amp;P Global</div>
        <h1 style={{ fontSize: 32, marginTop: 4 }}>Indian macro</h1>
        <p className="sub" style={{ maxWidth: 720, marginTop: 6 }}>
          Every series with its consensus and its surprise. The surprise is the number that
          moves markets — an inflation print exactly in line with forecasts moves nothing,
          however dramatic the level.
        </p>
      </div>

      <div className="grid g4 mb24">
        <Stat big="4.40%" label="CPI inflation, Oct" tone="down" />
        <Stat big="5.75%" label="RBI repo rate" />
        <Stat big="6.80%" label="GDP growth, Q1 FY27" tone="up" />
        <Stat big="6.74%" label="10-year G-Sec" />
      </div>

      <div className="cols">
        <div className="min0">
          <SectionHead title="Latest prints" />
          <div className="card pad0 mb24">
            <div className="scrollx">
              <table>
                <thead><tr><th style={{ paddingLeft: 14 }}>Series</th><th>Actual</th><th>Consensus</th>
                  <th>Prior</th><th>Surprise</th><th>Period</th><th style={{ paddingRight: 14 }}>Source</th></tr></thead>
                <tbody>
                  {MACRO_IN.map((m) => (
                    <tr key={m.name} className="hoverable">
                      <td style={{ paddingLeft: 14 }}>{m.name}</td>
                      <td style={{ fontWeight: 600 }}>{m.value.toLocaleString("en-IN")}
                        <span style={{ color: "var(--faint)", fontSize: 10 }}> {m.unit}</span></td>
                      <td style={{ color: "var(--muted)" }}>{m.consensus ?? "—"}</td>
                      <td style={{ color: "var(--muted)" }}>{m.prior}</td>
                      <td>
                        {m.surprise === null ? <span style={{ color: "var(--faint)" }}>—</span> : (
                          <span className="row" style={{ justifyContent: "flex-end", gap: 7 }}>
                            <span className="wfb" style={{ width: 48, height: 11 }}>
                              <i style={{ [m.surprise >= 0 ? "left" : "right"]: "50%",
                                width: `${Math.min(50, Math.abs(m.surprise) * 25)}%`,
                                background: m.surprise >= 0 ? "var(--up)" : "var(--down)" } as React.CSSProperties} />
                            </span>
                            <span className={m.surprise > 0 ? "up" : m.surprise < 0 ? "down" : "flat"}>
                              {m.surprise > 0 ? "+" : ""}{m.surprise.toFixed(1)}σ</span>
                          </span>
                        )}
                      </td>
                      <td style={{ color: "var(--muted)", fontSize: 11.5 }}>{m.period}</td>
                      <td style={{ paddingRight: 14, color: "var(--faint)", fontSize: 11 }}>{m.src}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ padding: "11px 14px", borderTop: "1px solid var(--border)" }}>
              <p className="meta">
                σ is the standardised surprise: the difference between the actual figure and
                the consensus, divided by the historical dispersion of that difference. A
                surprise of ±1.5σ or more is in the top decile.
              </p>
            </div>
          </div>

          {stories.length > 0 && (<>
            <SectionHead title="Economy stories" />
            <div className="tilegrid">{stories.map((s) => <StoryTile key={s.id} s={s} />)}</div>
          </>)}
        </div>

        <aside className="stack" style={{ gap: 16 }}>
          <div className="card">
            <div className="cardhead"><h2>RBI</h2><span className="tag">next {rbi.next}</span></div>
            <div className="hero" style={{ padding: "4px 0" }}>
              <div className="sym">Repo rate</div>
              <div className="big">{rbi.rate.toFixed(2)}%</div>
              <div className="dl down">▼ from {rbi.prev.toFixed(2)}%</div>
            </div>
            <table className="mt12">
              <tbody>
                <tr><td>Stance</td><td className="num">{rbi.stance}</td></tr>
                <tr><td>3m implied</td><td className="num down">{(rbi.implied3m * 100).toFixed(0)}bp</td></tr>
                <tr><td>12m implied</td><td className="num down">{(rbi.implied12m * 100).toFixed(0)}bp</td></tr>
              </tbody>
            </table>
            <p className="sub mt12">{rbi.note}</p>
          </div>

          <div className="card">
            <div className="cardhead"><h2>Rates &amp; currency</h2></div>
            {["RT:IN10Y","FX:USDINR","RT:US10Y","FX:DXY"].map((id) => <QuoteRow key={id} id={id} />)}
          </div>

          <div className="card">
            <div className="cardhead"><h2>Crude in rupee terms</h2></div>
            <p className="sub">
              India imports roughly 88% of its crude. The dollar price is only half the story;
              what matters for the current account and for inflation is the rupee-denominated
              cost, which combines Brent with USD/INR.
            </p>
            <div className="grid g2 mt12" style={{ gap: 12 }}>
              <Stat big="₹6,453" label="Brent per barrel, ₹" />
              <Stat big="+2.4%" label="1 day, in ₹" tone="up" />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
