import Link from "next/link";
import { INSTRUMENTS, byId, chg, MACRO_GLOBAL, RISK, STORIES, CENTRAL_BANKS } from "@/lib/data";
import { num } from "@/lib/format";
import { SectionHead, Delta, Spark, Stale, Stat } from "@/components/Bits";
import StoryTile from "@/components/StoryTile";

export const metadata = { title: "Global markets" };

const GROUPS: { title: string; ids: string[] }[] = [
  { title: "Equity indices", ids: ["IDX:SPX","IDX:NDX","IDX:DJI","IDX:SX5E","IDX:N225","IDX:HSI","IDX:NIFTY50","IDX:SENSEX"] },
  { title: "Rates", ids: ["RT:US10Y","RT:IN10Y"] },
  { title: "Currencies", ids: ["FX:DXY","FX:EURUSD","FX:USDJPY","FX:USDINR"] },
  { title: "Commodities", ids: ["CMD:BRENT","CMD:XAU","CMD:XAG","CMD:HG"] },
  { title: "Volatility & crypto", ids: ["IDX:VIX","IDX:INDIAVIX","CRY:BTC"] },
];

export default function Markets() {
  const stories = STORIES.filter((s) => s.region !== "IN").slice(0, 4);
  return (
    <div className="wrap" style={{ paddingTop: 18 }}>
      <div className="breadcrumb"><Link href="/">Today</Link> / Global markets</div>
      <div className="mb24">
        <div className="kicker">Cross-asset · 15-minute delayed</div>
        <h1 style={{ fontSize: 32, marginTop: 4 }}>Global markets</h1>
        <p className="sub" style={{ maxWidth: 720, marginTop: 6 }}>
          Equities, rates, currencies, commodities and volatility on one screen — because the
          question that matters at 07:30 in Mumbai is what all of them did together overnight.
        </p>
      </div>

      <div className="stack" style={{ gap: 26 }}>
        {GROUPS.map((g) => (
          <section key={g.title}>
            <SectionHead title={g.title} />
            <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(214px,1fr))" }}>
              {g.ids.map((id) => {
                const i = byId(id)!;
                const c = chg(i);
                return (
                  <Link key={id} href={`/ticker/${encodeURIComponent(id)}`} className="card">
                    <div className="between mb8">
                      <span className="label">{i.sym}</span>
                      <Stale l={i.latency} />
                    </div>
                    <div className="num" style={{ fontSize: 21, fontWeight: 600 }}>
                      {num(i.last, i.last > 500 ? 2 : 3)}
                    </div>
                    <div className="row mt4" style={{ gap: 8 }}>
                      <Delta v={c} />
                      <span className="meta">{i.cur}</span>
                    </div>
                    <div className="mt8"><Spark data={i.hist} w={186} h={32} up={c >= 0} /></div>
                    <div className="meta mt4">{i.name}</div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <div className="divider" />

      <div className="cols">
        <div className="min0">
          <SectionHead title="Global macro prints" href="/calendar" more="Calendar" />
          <div className="card pad0 mb24">
            <div className="scrollx">
              <table>
                <thead><tr><th style={{ paddingLeft: 14 }}>Series</th><th>Actual</th><th>Consensus</th>
                  <th>Prior</th><th>Surprise</th><th style={{ paddingRight: 14 }}>Period</th></tr></thead>
                <tbody>
                  {MACRO_GLOBAL.map((m) => (
                    <tr key={m.name} className="hoverable">
                      <td style={{ paddingLeft: 14 }}>{m.name}</td>
                      <td style={{ fontWeight: 600 }}>{m.value}</td>
                      <td style={{ color: "var(--muted)" }}>{m.consensus}</td>
                      <td style={{ color: "var(--muted)" }}>{m.prior}</td>
                      <td className={m.surprise > 0 ? "up" : m.surprise < 0 ? "down" : "flat"}>
                        {m.surprise > 0 ? "+" : ""}{m.surprise.toFixed(1)}σ</td>
                      <td style={{ paddingRight: 14, color: "var(--faint)", fontSize: 11.5 }}>{m.period}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <SectionHead title="Global stories" href="/wire" more="Live wire" />
          <div className="tilegrid">{stories.map((s) => <StoryTile key={s.id} s={s} />)}</div>
        </div>

        <aside className="stack" style={{ gap: 16 }}>
          <div className="card">
            <div className="cardhead"><h2>Risk dashboard</h2>
              <Link href="/markets/risk" className="tag" style={{ color: "var(--accent)" }}>detail →</Link></div>
            <div className="stack" style={{ gap: 10 }}>
              {RISK.slice(0, 6).map((r) => (
                <div key={r.name}>
                  <div className="between" style={{ marginBottom: 3 }}>
                    <span style={{ fontSize: 12.5 }}>{r.name}</span>
                    <span className="num" style={{ fontSize: 12 }}>{r.value}</span>
                  </div>
                  <div className="bar">
                    <i style={{ width: `${r.pct}%`,
                      background: r.pct > 70 ? "var(--warn)" : "var(--accent)" }} />
                  </div>
                  <div className="meta" style={{ fontSize: 9.5, marginTop: 2 }}>
                    {r.pct}th percentile vs 5 years
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="cardhead"><h2>Central banks</h2>
              <Link href="/global/central-banks" className="tag" style={{ color: "var(--accent)" }}>all →</Link></div>
            <table>
              <tbody>
                {CENTRAL_BANKS.map((b) => (
                  <tr key={b.code}>
                    <td style={{ fontSize: 12.5 }}>{b.code}</td>
                    <td className="num">{b.rate.toFixed(2)}%</td>
                    <td className={b.implied3m >= 0 ? "num up" : "num down"}>
                      {b.implied3m > 0 ? "+" : ""}{(b.implied3m * 100).toFixed(0)}bp</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="meta mt8">3-month market-implied change</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
