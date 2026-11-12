import Link from "next/link";
import { byId, chg, STORIES, OI_TABLE, BUILDUP_LABEL } from "@/lib/data";
import { num } from "@/lib/format";
import { SectionHead, Delta, Spark, Notice, Tier } from "@/components/Bits";
import { MoodGauge } from "@/components/Mood";
import ProGate from "@/components/Pro";
import T from "@/components/T";

export const metadata = { title: "Watchlist" };

const WATCHED = ["NSE:HDFCBANK","NSE:INFY","NSE:TATAMOTORS","NSE:RELIANCE","IDX:NIFTYBANK","CMD:BRENT"];

export default function Watchlist() {
  const rows = WATCHED.map((id) => byId(id)!).filter(Boolean);
  const events = STORIES.filter((s) =>
    s.impacts.some((i) => WATCHED.includes(i.instrument) && i.expected !== null));

  return (
    <>
      <section className="band" style={{ paddingBlock: "40px 34px" }}>
        <div className="wrap">
          <div className="kicker accent">Watchlist · Radar</div>
          <h1 className="reveal" style={{ fontSize: "clamp(29px,4.6vw,50px)", marginTop: 10, maxWidth: 900 }}>
            <T en="Only what affects what you hold" hi="केवल वही जो आपकी होल्डिंग को प्रभावित करे" />
          </h1>
          <p className="sub reveal d1" style={{ fontSize: 16.5, maxWidth: 740, marginTop: 14, lineHeight: 1.55 }}>
            A watchlist that shows prices is a quote screen. This one shows which of your
            symbols have an open impact estimate, which are approaching a surveillance or ban
            threshold, and which scenarios currently active touch them.
          </p>
        </div>
      </section>

      <div className="wrap" style={{ paddingTop: 28 }}>
        <div className="breadcrumb"><Link href="/">Today</Link> / Watchlist</div>

        <div className="cols">
          <div className="min0">
            <SectionHead title="Sample watchlist" />
            <div className="card pad0 mb24 reveal">
              <div className="scrollx">
                <table>
                  <thead><tr><th style={{ paddingLeft: 16 }}>Symbol</th><th>Last</th><th>Change</th>
                    <th>Trend</th><th>Open impacts</th><th>OI state</th>
                    <th style={{ paddingRight: 16 }}>Flags</th></tr></thead>
                  <tbody>
                    {rows.map((i) => {
                      const c = chg(i);
                      const open = STORIES.filter((s) => s.impacts.some(
                        (im) => im.instrument === i.id && im.expected !== null)).length;
                      const oi = OI_TABLE.find((o) => o.id === i.id);
                      return (
                        <tr key={i.id} className="hoverable">
                          <td style={{ paddingLeft: 16 }}>
                            <Link href={`/ticker/${encodeURIComponent(i.id)}`}>{i.sym}</Link></td>
                          <td className="num">{num(i.last, i.last > 500 ? 0 : 2)}</td>
                          <td><Delta v={c} /></td>
                          <td><Spark data={i.hist} w={62} h={20} up={c >= 0} /></td>
                          <td className="num" style={{ color: open ? "var(--accent)" : "var(--faint)" }}>
                            {open || "—"}</td>
                          <td style={{ fontFamily: "var(--sans)", fontSize: 11.5, color: "var(--muted)" }}>
                            {oi ? BUILDUP_LABEL[oi.buildup] : "—"}</td>
                          <td style={{ paddingRight: 16 }}>
                            {oi && oi.pctile > 85
                              ? <span className="chip w">OI {oi.pctile}%ile</span>
                              : <span className="meta">—</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <SectionHead title="Open impacts on these names" />
            <div className="stack mb24" style={{ gap: 12 }}>
              {events.map((s) => {
                const im = s.impacts.find((i) => WATCHED.includes(i.instrument) && i.expected !== null)!;
                const inst = byId(im.instrument);
                return (
                  <Link key={s.id} href={`/story/${s.slug}`} className="card tile reveal">
                    <div className="storyline mb8">
                      <Tier t={s.tier} /><span>{s.outlets[0]}</span>
                      <span className="chip a">{inst?.sym}</span>
                    </div>
                    <h3 style={{ fontSize: 16 }}>{s.headline}</h3>
                    <div className="row mt8" style={{ gap: 12 }}>
                      <span className={im.expected! > 0 ? "up" : "down"} style={{ fontWeight: 600 }}>
                        {im.expected! > 0 ? "+" : ""}{im.expected!.toFixed(2)}%</span>
                      <span className="meta">{im.horizon} · {im.n} analogs · conf {im.conf?.toFixed(2)}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <aside className="stack" style={{ gap: 16 }}>
            <div className="card reveal">
              <div className="cardhead"><h2>Risk mood</h2></div>
              <MoodGauge compact />
            </div>
            <div className="ink reveal">
              <div className="label mb12">What a watchlist should do</div>
              <ul className="arrowlist">
                {["Tell you which holdings have an open impact estimate right now",
                  "Warn before a symbol enters F&O ban, not after",
                  "Flag surveillance stage changes the evening they are circulated",
                  "Show which live scenarios touch your names",
                  "Stay quiet the rest of the time"].map((x) => <li key={x}>{x}</li>)}
              </ul>
            </div>
            <Link href="/alerts" className="card tile">
              <h3 style={{ fontSize: 17 }}>Alerts &amp; Radar</h3>
              <p className="tiledek" style={{ fontSize: 13 }}>
                Set the impact threshold that decides what reaches you.</p>
              <span className="sub mt8" style={{ color: "var(--accent)", fontWeight: 600, display: "block" }}>
                Open →</span>
            </Link>
          </aside>
        </div>

        <SectionHead title="Your own lists" />
        <div className="mb32">
          <ProGate title="Ten lists, unlimited symbols, imported from your broker"
            what={["Ten named watchlists against one on Free",
              "Import positions from a broker statement or CSV",
              "Per-list Radar thresholds and alert routing",
              "Correlation and factor exposure across the whole list",
              "Daily digest scoped to each list",
              "Export to CSV"]}>
            <table>
              <thead><tr><th>List</th><th>Symbols</th><th>Open impacts</th><th>Flags</th><th>Threshold</th></tr></thead>
              <tbody>
                {[["Core holdings",14,3,1,"0.8%"],["F&O book",8,5,2,"0.5%"],
                  ["Watching",22,2,0,"1.2%"],["Commodities",6,1,0,"1.0%"]].map((r, i) => (
                  <tr key={i}>
                    <td>{r[0]}</td><td className="num">{r[1]}</td>
                    <td className="num">{r[2]}</td><td className="num">{r[3]}</td>
                    <td className="num">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ProGate>
        </div>

        <div className="mb32">
          <Notice>
            Prototype — the watchlist above is a fixed sample. No account is created and no
            position data is collected.
          </Notice>
        </div>
      </div>
    </>
  );
}
