import Link from "next/link";
import { STORIES, byId } from "@/lib/data";
import { SectionHead, Notice } from "@/components/Bits";
import ProGate, { ProTag } from "@/components/Pro";
import T from "@/components/T";

export const metadata = { title: "Alerts & Radar" };

const RULES = [
  { name: "Impact on my holdings", cond: "Any event with |expected move| ≥ 0.8% and confidence ≥ 0.55 on a watched symbol",
    ch: "Push, WhatsApp", fires: "3–8 / week", pro: true },
  { name: "Entering F&O ban", cond: "Market-wide OI crosses 90% of MWPL on a watched symbol",
    ch: "Push", fires: "1–2 / month", pro: true },
  { name: "Surveillance stage change", cond: "ASM or GSM stage changes on a watched symbol",
    ch: "Email", fires: "2–4 / month", pro: true },
  { name: "Scenario goes live", cond: "A saved scenario's trigger condition becomes active",
    ch: "Push", fires: "4–10 / week", pro: true },
  { name: "Pre-open briefing", cond: "The Overnight Bridge publishes at 07:30 IST",
    ch: "Push, email", fires: "Daily", pro: false },
  { name: "Post-close wrap", cond: "16:00 IST summary of what moved the watchlist and why",
    ch: "Email", fires: "Daily", pro: false },
  { name: "Macro surprise", cond: "A scheduled release prints more than 1.5σ from consensus",
    ch: "Push", fires: "2–5 / month", pro: true },
  { name: "Index review candidate", cond: "A watched symbol enters the MSCI or domestic index candidate screen",
    ch: "Email", fires: "Quarterly", pro: true },
];

export default function Alerts() {
  const recent = STORIES.filter((s) => s.impacts.some((i) => (i.expected ?? 0) !== 0)).slice(0, 5);
  return (
    <>
      <section className="band" style={{ paddingBlock: "42px 36px" }}>
        <div className="wrap">
          <div className="kicker accent">Alerts · Radar</div>
          <h1 className="reveal" style={{ fontSize: "clamp(30px,4.8vw,54px)", marginTop: 10, maxWidth: 950 }}>
            <T en="Five a day, not fifty" hi="दिन में पाँच, पचास नहीं" />
          </h1>
          <p className="sub reveal d1" style={{ fontSize: 17, maxWidth: 760, marginTop: 14, lineHeight: 1.55 }}>
            Radar surfaces only news whose predicted impact on something you actually hold
            exceeds a threshold you set. The default daily cap is five, and the cap is yours to
            move. An alert system that fires on every headline is a notification system, and
            notification systems get muted.
          </p>
          <div className="grid g4 mt32" style={{ gap: 20 }}>
            <div className="reveal"><div className="figure lg">5</div>
              <div className="statlbl">Default daily cap, user-settable</div></div>
            <div className="reveal d1"><div className="figure lg">30m</div>
              <div className="statlbl">Dedupe window per instrument</div></div>
            <div className="reveal d2"><div className="figure lg">0</div>
              <div className="statlbl">Alerts from tier-4 sources, ever</div></div>
            <div className="reveal d3"><div className="figure lg">4</div>
              <div className="statlbl">Delivery channels</div></div>
          </div>
        </div>
      </section>

      <div className="wrap" style={{ paddingTop: 28 }}>
        <div className="breadcrumb"><Link href="/">Today</Link> / Alerts</div>

        <SectionHead title="Rule library" />
        <div className="card pad0 mb32 reveal">
          <div className="scrollx">
            <table>
              <thead><tr><th style={{ paddingLeft: 16 }}>Rule</th><th>Condition</th><th>Channels</th>
                <th>Typical frequency</th><th style={{ paddingRight: 16 }}>Tier</th></tr></thead>
              <tbody>
                {RULES.map((r) => (
                  <tr key={r.name} className="hoverable">
                    <td style={{ paddingLeft: 16 }}>{r.name}</td>
                    <td style={{ fontFamily: "var(--sans)", fontSize: 12, color: "var(--muted)",
                      whiteSpace: "normal", textAlign: "left", maxWidth: 380 }}>{r.cond}</td>
                    <td style={{ fontFamily: "var(--sans)", fontSize: 11.5 }}>{r.ch}</td>
                    <td className="num" style={{ fontSize: 11.5 }}>{r.fires}</td>
                    <td style={{ paddingRight: 16 }}>
                      {r.pro ? <ProTag /> : <span className="chip up">Free</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="cols mb32">
          <div className="min0">
            <SectionHead title="What an alert looks like" />
            <div className="stack" style={{ gap: 12 }}>
              {recent.map((s) => {
                const im = s.impacts.find((i) => i.expected !== null)!;
                const inst = byId(im.instrument);
                return (
                  <Link key={s.id} href={`/story/${s.slug}`} className="card tile reveal"
                    style={{ borderLeft: "3px solid var(--accent)" }}>
                    <div className="row mb8" style={{ gap: 8 }}>
                      <span className="chip a">Radar</span>
                      <span className="meta">{inst?.sym} · impact above your threshold</span>
                    </div>
                    <h3 style={{ fontSize: 16 }}>{s.headline}</h3>
                    <p className="sub mt8" style={{ fontSize: 13 }}>
                      {inst?.sym} {im.expected! > 0 ? "+" : ""}{im.expected!.toFixed(2)}% expected
                      over {im.horizon} · {im.n} analogs · {Math.round((im.hitRate ?? 0) * 100)}% hit rate
                      · confidence {im.conf?.toFixed(2)}
                    </p>
                  </Link>
                );
              })}
            </div>
            <p className="meta mt12">
              Every alert carries the sample size and the confidence. An alert without them is a
              push notification pretending to be information.
            </p>
          </div>
          <aside className="stack" style={{ gap: 16 }}>
            <div className="ink reveal">
              <div className="label mb12">Fatigue rules, built in</div>
              <ul className="arrowlist">
                {["Maximum one alert per instrument per 30 minutes",
                  "Hard daily cap, default five, you set it",
                  "Quiet hours — no push outside them, ever",
                  "A developing story updates its existing alert rather than firing again",
                  "One tap on any alert to get fewer like it"].map((x) => <li key={x}>{x}</li>)}
              </ul>
            </div>
            <div className="card">
              <div className="cardhead"><h2>Never alerted</h2></div>
              <ul className="arrowlist">
                {["Tier-4 social sources",
                  "Anything with fewer than 12 historical analogs",
                  "Event classes currently suppressed on the Ledger",
                  "Price moves with no event attached"].map((x) => <li key={x}>{x}</li>)}
              </ul>
            </div>
          </aside>
        </div>

        <SectionHead title="Rule builder" />
        <div className="mb32">
          <ProGate title="Compose any condition you can describe"
            what={["Event type, instrument, sector, region and source tier",
              "Price, open interest, implied volatility, delivery and flow thresholds",
              "Impact magnitude and model confidence floors",
              "Surveillance status and index-review candidacy",
              "Quiet hours, dedupe windows and per-rule channel routing",
              "Backtest how often a rule would have fired before you enable it"]}>
            <table>
              <thead><tr><th>Field</th><th>Operator</th><th>Value</th><th>Would have fired</th></tr></thead>
              <tbody>
                {[["Event type","in","RATE_DECISION, CPI","18 / year"],
                  ["Instrument","in","Watchlist","—"],
                  ["|Expected move|","≥","0.80%","41 / year"],
                  ["Confidence","≥","0.55","28 / year"],
                  ["Source tier","≤","1","24 / year"],
                  ["Quiet hours","between","22:00–07:00","—"]].map((r, i) => (
                  <tr key={i}>
                    <td>{r[0]}</td><td className="num">{r[1]}</td><td className="num">{r[2]}</td>
                    <td className="num">{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ProGate>
        </div>

        <div className="mb32">
          <Notice>
            Alerts describe events and historical distributions. They are never instructions to
            trade, and no alert on this platform contains a recommendation.
          </Notice>
        </div>
      </div>
    </>
  );
}
