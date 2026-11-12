import Link from "next/link";
import { ECONOMY } from "@/lib/india";
import { MACRO_IN } from "@/lib/data";
import { SectionHead, Notice } from "@/components/Bits";
import { CountUp } from "@/components/Motion";

export const metadata = {
  title: "Indian economy",
  description: "Thirty indicators across growth, prices, the external account, fiscal, money and households — the macro state behind the market.",
};

export default function Economy() {
  const total = ECONOMY.reduce((a, g) => a + g.rows.length, 0);
  return (
    <>
      <section className="band" style={{ paddingBlock: "44px 38px" }}>
        <div className="wrap">
          <div className="kicker accent">Macro dashboard · India</div>
          <h1 className="reveal" style={{ fontSize: "clamp(31px,5vw,56px)", marginTop: 10, maxWidth: 940 }}>
            The economy behind the index
          </h1>
          <p className="sub reveal d1" style={{ fontSize: 17, maxWidth: 780, marginTop: 14, lineHeight: 1.55 }}>
            Growth, prices, the external account, fiscal and monetary conditions, and the
            household series that have quietly become the most important thing about this
            market. Every figure with its period and its direction of travel.
          </p>
          <div className="grid g4 mt32" style={{ gap: 20 }}>
            <div className="reveal"><div className="figure lg">
              <CountUp value={6.8} decimals={1} suffix="%" /></div>
              <div className="statlbl">Real GDP growth, Q1 FY27</div></div>
            <div className="reveal d1"><div className="figure lg">
              <CountUp value={4.4} decimals={1} suffix="%" /></div>
              <div className="statlbl">CPI inflation, inside the band</div></div>
            <div className="reveal d2"><div className="figure lg">
              ₹<CountUp value={26400} /> cr</div>
              <div className="statlbl">Monthly SIP inflow — a record</div></div>
            <div className="reveal d3"><div className="figure lg">
              <CountUp value={19.2} decimals={1} /> cr</div>
              <div className="statlbl">Demat accounts</div></div>
          </div>
        </div>
      </section>

      <div className="wrap" style={{ paddingTop: 28 }}>
        <div className="breadcrumb"><Link href="/">Today</Link> / Economy</div>

        <div className="stack mb32" style={{ gap: 24 }}>
          {ECONOMY.map((g) => (
            <section key={g.group} className="reveal">
              <SectionHead title={g.group} />
              <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(224px,1fr))", gap: 12 }}>
                {g.rows.map((r, i) => (
                  <div key={r.k} className={`card reveal ${i % 3 === 1 ? "d1" : i % 3 === 2 ? "d2" : ""}`}>
                    <div className="between mb8">
                      <span className="label" style={{ lineHeight: 1.3 }}>{r.k}</span>
                      <span className={r.t === "up" ? "up" : r.t === "down" ? "down" : "flat"}
                        style={{ fontSize: 13 }}>
                        {r.t === "up" ? "▲" : r.t === "down" ? "▼" : "▬"}</span>
                    </div>
                    <div className="num" style={{ fontSize: 21, fontWeight: 600 }}>{r.v}</div>
                    <div className="meta mt4">{r.p}</div>
                    {r.note && <p className="sub mt8" style={{ fontSize: 12 }}>{r.note}</p>}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="cols mb32">
          <div className="min0">
            <SectionHead title="Latest prints with surprise" href="/india/macro" more="Full macro" />
            <div className="card pad0 reveal">
              <div className="scrollx">
                <table>
                  <thead><tr><th style={{ paddingLeft: 16 }}>Series</th><th>Actual</th><th>Consensus</th>
                    <th>Prior</th><th style={{ paddingRight: 16 }}>Surprise</th></tr></thead>
                  <tbody>
                    {MACRO_IN.filter((m) => m.surprise !== null).map((m) => (
                      <tr key={m.name} className="hoverable">
                        <td style={{ paddingLeft: 16 }}>{m.name}</td>
                        <td style={{ fontWeight: 600 }}>{m.value}</td>
                        <td style={{ color: "var(--muted)" }}>{m.consensus ?? "—"}</td>
                        <td style={{ color: "var(--muted)" }}>{m.prior}</td>
                        <td style={{ paddingRight: 16 }}>
                          <span className="row" style={{ justifyContent: "flex-end", gap: 8 }}>
                            <span className="wfb" style={{ width: 50, height: 11 }}>
                              <i style={{ [m.surprise! >= 0 ? "left" : "right"]: "50%",
                                width: `${Math.min(50, Math.abs(m.surprise!) * 25)}%`,
                                background: m.surprise! >= 0 ? "var(--up)" : "var(--down)" } as React.CSSProperties} />
                            </span>
                            <span className={m.surprise! > 0 ? "up" : "down"}>
                              {m.surprise! > 0 ? "+" : ""}{m.surprise!.toFixed(1)}σ</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <aside>
            <div className="ink reveal">
              <div className="label mb12">The series that changed this market</div>
              <p className="sub">
                Monthly systematic investment plan inflows at a record rate, against roughly 19
                crore demat accounts, created a domestic bid that did not exist a decade ago.
              </p>
              <p className="sub mt12">
                It is the reason sustained foreign selling no longer produces the index falls it
                would have caused in 2013 or 2018 — and the reason FII flow data is far weaker
                as a signal than most traders still assume.
              </p>
              <Link href="/india/flows" style={{ color: "var(--accent-on-ink)", fontWeight: 600,
                fontSize: 13, display: "block", marginTop: 14 }}>See the flow data →</Link>
            </div>
          </aside>
        </div>

        <div className="mb32">
          <Notice>
            Macro series are revised by the agencies that publish them. Figures here are sample
            data for demonstration; in production each carries its source, release date and
            revision history.
          </Notice>
        </div>
      </div>
    </>
  );
}
