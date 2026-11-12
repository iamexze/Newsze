import Link from "next/link";
import { SCREENS } from "@/lib/india";
import { OI_TABLE, BUILDUP_LABEL, byId } from "@/lib/data";
import { SectionHead, Notice } from "@/components/Bits";
import ProGate, { ProTag } from "@/components/Pro";

export const metadata = { title: "Screener" };

export default function Screener() {
  return (
    <>
      <section className="band" style={{ paddingBlock: "40px 34px" }}>
        <div className="wrap">
          <div className="kicker accent">Screener</div>
          <h1 className="reveal" style={{ fontSize: "clamp(30px,4.8vw,52px)", marginTop: 10, maxWidth: 920 }}>
            Eight screens that would take a desk an afternoon each
          </h1>
          <p className="sub reveal d1" style={{ fontSize: 16.5, maxWidth: 760, marginTop: 14, lineHeight: 1.55 }}>
            Every screen here is built on something measurable and ranked against each
            symbol&apos;s own history rather than against other symbols. Where a screen has no
            evidence behind it as a signal, it says so — a scanner that finds things is not the
            same as a scanner that finds edges.
          </p>
        </div>
      </section>

      <div className="wrap" style={{ paddingTop: 28 }}>
        <div className="breadcrumb"><Link href="/">Today</Link> / Screener</div>

        <SectionHead title="Prebuilt screens" />
        <div className="grid g2 mb32">
          {SCREENS.map((s, i) => (
            <div key={s.name} className={`card reveal ${i % 2 ? "d1" : ""}`}>
              <div className="between mb8">
                <h3 style={{ fontSize: 17, lineHeight: 1.3 }}>{s.name}</h3>
                <span className="row" style={{ gap: 8, flex: "0 0 auto" }}>
                  <span className="num" style={{ fontSize: 15, fontWeight: 600, color: "var(--accent)" }}>
                    {s.hits}</span>
                  <ProTag />
                </span>
              </div>
              <p className="sub" style={{ fontSize: 13 }}>{s.desc}</p>
            </div>
          ))}
        </div>

        <SectionHead title="Free preview — derivatives build-up" href="/india/derivatives" more="Full derivatives" />
        <div className="card pad0 mb32 reveal">
          <div className="scrollx">
            <table>
              <thead><tr><th style={{ paddingLeft: 16 }}>Symbol</th><th>Price</th><th>OI</th>
                <th>Classification</th><th>PCR</th><th>IV %ile</th>
                <th style={{ paddingRight: 16 }}>250d %ile</th></tr></thead>
              <tbody>
                {OI_TABLE.filter((r) => r.pctile > 60).map((r) => {
                  const i = byId(r.id)!;
                  const t = r.buildup === "LONG_BUILDUP" || r.buildup === "SHORT_COVERING"
                    ? "var(--up)" : r.buildup === "SHORT_BUILDUP" ? "var(--down)" : "var(--muted)";
                  return (
                    <tr key={r.id} className="hoverable">
                      <td style={{ paddingLeft: 16 }}>
                        <Link href={`/ticker/${encodeURIComponent(r.id)}`}>{i.sym}</Link></td>
                      <td className={r.priceChg >= 0 ? "up" : "down"}>
                        {r.priceChg > 0 ? "+" : ""}{r.priceChg.toFixed(2)}%</td>
                      <td>{r.oiChg > 0 ? "+" : ""}{r.oiChg.toFixed(1)}%</td>
                      <td style={{ fontFamily: "var(--sans)", fontSize: 12, color: t, fontWeight: 500 }}>
                        {BUILDUP_LABEL[r.buildup]}</td>
                      <td>{r.pcr.toFixed(2)}</td><td>{r.ivPct}</td>
                      <td style={{ paddingRight: 16, color: r.pctile > 85 ? "var(--warn)" : undefined,
                        fontWeight: r.pctile > 85 ? 600 : 400 }}>{r.pctile}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)" }}>
            <p className="meta">
              Free shows build-up extremes on indices and the largest names, end of day. Pro adds
              the full F&amp;O universe, real-time, with custom conditions and saved screens.
            </p>
          </div>
        </div>

        <SectionHead title="Custom screen builder" />
        <div className="mb32">
          <ProGate title="Build, save and schedule your own screens"
            what={["Any combination of price, OI, IV, delivery, flows, surveillance status and events",
              "Ranked against each symbol's own history, never cross-symbol",
              "Backtest the screen before you trust it, with round-turn costs applied",
              "Schedule it and receive results as an alert",
              "Export to CSV"]}>
            <table>
              <thead><tr><th>Condition</th><th>Operator</th><th>Value</th><th>Universe</th><th>Hits</th></tr></thead>
              <tbody>
                {[["OI change percentile",">","90","F&O universe","14"],
                  ["Days to expiry","between","10–20","—","—"],
                  ["IV percentile","<","25","—","9"],
                  ["Delivery % vs 20d",">","2σ","Nifty 500","6"],
                  ["Surveillance status","=","None","—","—"],
                  ["Impact estimate","≥","0.8%","—","3"]].map((r, i) => (
                  <tr key={i}>
                    <td>{r[0]}</td><td className="num">{r[1]}</td><td className="num">{r[2]}</td>
                    <td style={{ fontFamily: "var(--sans)", fontSize: 12 }}>{r[3]}</td>
                    <td className="num">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ProGate>
        </div>

        <div className="mb32">
          <Notice>
            A screen finds conditions, not opportunities. Several of these describe states with
            no demonstrated predictive power — see the{" "}
            <Link href="/signals" style={{ color: "var(--warn)", fontWeight: 600 }}>evidence review</Link>{" "}
            before treating any of them as a signal.
          </Notice>
        </div>
      </div>
    </>
  );
}
