import Link from "next/link";
import { CALENDAR, MACRO_IN, MACRO_GLOBAL } from "@/lib/data";
import { SectionHead, Notice } from "@/components/Bits";

export const metadata = { title: "Macro calendar" };

export default function Calendar() {
  const recent = [...MACRO_IN.slice(0, 6), ...MACRO_GLOBAL.slice(0, 5)]
    .filter((m) => m.surprise !== null)
    .sort((a, b) => Math.abs(b.surprise!) - Math.abs(a.surprise!));

  return (
    <div className="wrap" style={{ paddingTop: 18 }}>
      <div className="breadcrumb"><Link href="/">Today</Link> / Calendar</div>
      <div className="mb24">
        <div className="kicker">Scheduled releases · all times IST</div>
        <h1 style={{ fontSize: 32, marginTop: 4 }}>Macro calendar</h1>
        <p className="sub" style={{ maxWidth: 720, marginTop: 6 }}>
          What is scheduled, what the consensus expects, and — once the number lands — how far
          it missed. Expiry dates and policy meetings are included because they shape an Indian
          trading day as much as any print.
        </p>
      </div>

      <div className="cols">
        <div className="min0">
          <SectionHead title="Upcoming" />
          <div className="card pad0 mb24">
            {CALENDAR.map((c, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "150px 1fr auto",
                gap: 14, padding: "12px 16px", borderBottom: "1px solid var(--border)",
                alignItems: "center" }}>
                <div>
                  <div className="num" style={{ fontSize: 12 }}>{c.when}</div>
                  <span className="chip mt4" style={{ marginTop: 4 }}>{c.region}</span>
                </div>
                <div className="min0">
                  <div style={{ fontSize: 14.5, fontWeight: 500 }}>{c.event}</div>
                  {c.consensus !== "—" && (
                    <div className="meta mt4">consensus {c.consensus} · prior {c.prior}</div>
                  )}
                </div>
                <div style={{ textAlign: "right" }}>
                  <span className="row" style={{ gap: 2, justifyContent: "flex-end" }}>
                    {[1, 2, 3].map((n) => (
                      <span key={n} style={{ width: 5, height: 14, borderRadius: 1,
                        background: n <= c.impact ? (c.impact === 3 ? "var(--warn)" : "var(--accent)")
                          : "var(--sunken)", display: "inline-block" }} />
                    ))}
                  </span>
                  <div className="meta" style={{ fontSize: 9, marginTop: 3 }}>impact</div>
                </div>
              </div>
            ))}
          </div>

          <SectionHead title="Recent surprises, ranked" />
          <div className="card pad0">
            <div className="scrollx">
              <table>
                <thead><tr><th style={{ paddingLeft: 14 }}>Series</th><th>Actual</th><th>Consensus</th>
                  <th>Surprise</th><th style={{ paddingRight: 14 }}>Period</th></tr></thead>
                <tbody>
                  {recent.map((m) => (
                    <tr key={m.name} className="hoverable">
                      <td style={{ paddingLeft: 14 }}>{m.name}</td>
                      <td style={{ fontWeight: 600 }}>{m.value}</td>
                      <td style={{ color: "var(--muted)" }}>{m.consensus}</td>
                      <td>
                        <span className="row" style={{ justifyContent: "flex-end", gap: 8 }}>
                          <span className="wfb" style={{ width: 54, height: 12 }}>
                            <i style={{ [m.surprise! >= 0 ? "left" : "right"]: "50%",
                              width: `${Math.min(50, Math.abs(m.surprise!) * 25)}%`,
                              background: m.surprise! >= 0 ? "var(--up)" : "var(--down)" } as React.CSSProperties} />
                          </span>
                          <span className={m.surprise! > 0 ? "up" : "down"}>
                            {m.surprise! > 0 ? "+" : ""}{m.surprise!.toFixed(1)}σ</span>
                        </span>
                      </td>
                      <td style={{ paddingRight: 14, color: "var(--faint)", fontSize: 11.5 }}>{m.period}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <aside className="stack" style={{ gap: 16 }}>
          <div className="card">
            <div className="cardhead"><h2>Why surprise, not level</h2></div>
            <p className="sub">
              Markets price expectations. A 25 basis point cut that everyone forecast is already
              in the price before it is announced; the same cut when nobody expected it is a
              different event entirely.
            </p>
            <p className="sub mt12">
              Every scheduled release in our system carries its consensus. When the actual
              number arrives we compute the standardised surprise automatically, and that
              figure — not the headline level — is the main input to the impact estimate.
            </p>
            <Link href="/methodology" className="sub mt12"
              style={{ color: "var(--accent)", fontWeight: 600, display: "block" }}>
              Read the methodology →</Link>
          </div>
          <Notice>
            Indian weekly and monthly expiry dates are included because expiry-day behaviour is
            statistically distinct, not because we are suggesting a position.
          </Notice>
        </aside>
      </div>
    </div>
  );
}
