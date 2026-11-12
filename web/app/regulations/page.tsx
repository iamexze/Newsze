import Link from "next/link";
import { MICRO } from "@/lib/india";
import { SectionHead, Notice } from "@/components/Bits";
import ProGate from "@/components/Pro";
import T from "@/components/T";

export const metadata = {
  title: "Regulation tracker",
  description: "SEBI and exchange rule changes that alter what retail traders can do — with the detail flagged where published sources disagree.",
};

const CHANGES = [
  { area: "Index contract size", what: "Minimum index derivatives contract value moved into a roughly ₹15–20 lakh band — reported as the first revision in about nine years.",
    effect: "Raises the capital floor for a single index option position materially. The stated rationale is reducing retail exposure to leveraged index derivatives.",
    status: "reported", dispute: "" },
  { area: "Lot sizes", what: "Nifty lot size reported falling from 75 to 65 for January 2026 contracts. Bank Nifty is listed across accounts as 30 (Nov 2024) → 35 (Jul 2025) → 30 (Jan 2026).",
    effect: "Changes margin per lot and the granularity of position sizing.",
    status: "disputed", dispute: "At least one widely-read source still lists Nifty at 75. Verify against the exchange contract specification before sizing a position." },
  { area: "Weekly expiry", what: "Each exchange retains weekly contracts on only one benchmark index.",
    effect: "Fewer weekly settlement events, concentrating expiry-day flow into a single series per exchange.",
    status: "disputed", dispute: "Sources disagree on which days apply — one reports Nifty on Tuesday for NSE and Sensex on Thursday for BSE; another reports Nifty on Thursday. They also disagree on whether Bank Nifty weeklies were discontinued or moved to monthly settlement." },
  { area: "Margin treatment", what: "A 50:50 cash margin rule reported, alongside upfront collection of option premium from 1 April 2026.",
    effect: "Reduces the ability to fund margin entirely with pledged securities, and removes intraday premium float.",
    status: "reported", dispute: "" },
  { area: "Transaction tax", what: "Securities transaction tax reported at 0.05% on futures and 0.15% on option premium.",
    effect: "Directly raises the round-turn cost, which is what erases most reported statistical edges.",
    status: "reported", dispute: "" },
  { area: "Retail algo trading", what: "Retail algorithmic trading reported to require registered applications and static IP addresses.",
    effect: "Raises the operational bar for automated retail strategies.",
    status: "reported", dispute: "" },
  { area: "Expiry settlement price", what: "From 7 December 2026, F&O expiry settlement prices reported to return to a 30-minute volume-weighted average.",
    effect: "Changes the settlement window that expiry-day flow concentrates around.",
    status: "reported", dispute: "" },
];

export default function Regulations() {
  const disputed = CHANGES.filter((c) => c.status === "disputed").length;
  return (
    <>
      <section className="band" style={{ paddingBlock: "44px 38px" }}>
        <div className="wrap">
          <div className="kicker accent">Regulation tracker · SEBI &amp; exchanges</div>
          <h1 className="reveal" style={{ fontSize: "clamp(31px,5vw,56px)", marginTop: 10, maxWidth: 1000 }}>
            <T en="The rules changed. The reporting of them did not agree."
               hi="नियम बदले। उनकी रिपोर्टिंग में सहमति नहीं है।" />
          </h1>
          <p className="sub reveal d1" style={{ fontSize: 17, maxWidth: 800, marginTop: 14, lineHeight: 1.55 }}>
            India&apos;s derivatives framework has been substantially rewritten — bigger
            contracts, fewer weekly expiries, tighter margin, higher transaction tax. We
            report the direction with confidence and flag every specific where published
            sources contradict each other, which is more of them than you would expect.
          </p>
          <div className="grid g4 mt32" style={{ gap: 20 }}>
            <div className="reveal"><div className="figure lg">{CHANGES.length}</div>
              <div className="statlbl">Rule areas tracked</div></div>
            <div className="reveal d1"><div className="figure lg">{disputed}</div>
              <div className="statlbl">Where sources disagree on the detail</div></div>
            <div className="reveal d2"><div className="figure lg">₹15–20L</div>
              <div className="statlbl">Reported minimum index contract value</div></div>
            <div className="reveal d3"><div className="figure lg">0</div>
              <div className="statlbl">Impact estimates published — six analogs is not a sample</div></div>
          </div>
        </div>
      </section>

      <div className="wrap" style={{ paddingTop: 28 }}>
        <div className="breadcrumb"><Link href="/">Today</Link> / Regulation</div>

        <div className="card mb24 reveal" style={{ borderColor: "var(--warn)" }}>
          <div className="row mb8" style={{ gap: 8 }}>
            <span className="ev mixed">Editorial note</span>
          </div>
          <p className="sub">
            Everything on this page comes from secondary reporting. We retrieved no primary
            SEBI or exchange document, and the available sources disagree with one another on
            lot sizes, expiry days and effective dates — some still quote figures that others
            describe as superseded. <strong>Confirm every number against the exchange contract
            specification and the relevant circular before you trade on it.</strong> We are
            publishing the disagreement rather than resolving it arbitrarily, because
            arbitrarily resolving it is how a wrong number gets repeated.
          </p>
        </div>

        <SectionHead title="What changed" />
        <div className="stack mb32" style={{ gap: 14 }}>
          {CHANGES.map((c, i) => (
            <article key={c.area} className="card reveal">
              <div className="between mb12" style={{ alignItems: "flex-start" }}>
                <div className="row" style={{ gap: 10 }}>
                  <span className="figure" style={{ fontSize: 24, color: "var(--border-strong)" }}>
                    {String(i + 1).padStart(2, "0")}</span>
                  <h2 style={{ fontSize: 21 }}>{c.area}</h2>
                </div>
                <span className={`ev ${c.status === "disputed" ? "weak" : "mixed"}`}
                  style={{ flex: "0 0 auto" }}>{c.status}</span>
              </div>
              <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 18 }}>
                <div className="min0">
                  <div className="label mb4">Reported change</div>
                  <p className="sub" style={{ fontSize: 13.5 }}>{c.what}</p>
                </div>
                <div className="min0">
                  <div className="label mb4">What it does to a trader</div>
                  <p className="sub" style={{ fontSize: 13.5 }}>{c.effect}</p>
                </div>
              </div>
              {c.dispute && (
                <div className="nohist mt12" style={{ borderTop: "1px solid var(--border)", paddingTop: 12 }}>
                  <span>⚠</span><span><strong>Sources disagree.</strong> {c.dispute}</span>
                </div>
              )}
            </article>
          ))}
        </div>

        <SectionHead title="Exchange surveillance frameworks" href="/india/microstructure" more="Full detail" />
        <div className="grid g2 mb32">
          {MICRO.map((r, i) => (
            <Link key={r.slug} href={`/india/microstructure#${r.slug}`} className={`card tile reveal ${i % 2 ? "d1" : ""}`}>
              <h3 style={{ fontSize: 18 }}>{r.name}</h3>
              <p className="tiledek" style={{ fontSize: 13 }}>{r.trigger}</p>
              <p className="meta mt8">{r.effect.slice(0, 110)}…</p>
            </Link>
          ))}
        </div>

        <SectionHead title="Rule-change alerts" />
        <div className="mb32">
          <ProGate title="Know the evening a circular lands, not the morning it bites"
            what={["SEBI, NSE and BSE circulars parsed into structured events within minutes",
              "Only the ones that affect contracts or symbols you hold",
              "Margin impact estimated per position",
              "Effective-date calendar so nothing arrives as a surprise",
              "Full circular history per symbol"]}>
            <table>
              <thead><tr><th>Date</th><th>Issuer</th><th>Subject</th><th>Effective</th><th>Affects you</th></tr></thead>
              <tbody>
                {[["12 Nov","SEBI","Index option position limits","Feb expiry","2 positions"],
                  ["09 Nov","NSE","ST-ASM stage change, 4 securities","Immediate","1 position"],
                  ["06 Nov","NSE","Revised lot sizes, Jan series","Jan 2026","All index"],
                  ["01 Nov","BSE","Weekly expiry schedule","Immediate","—"],
                  ["28 Oct","NSE","Concentration margin list","Next day","1 position"]].map((r, i) => (
                  <tr key={i}>
                    <td>{r[0]}</td><td className="num">{r[1]}</td>
                    <td style={{ fontFamily: "var(--sans)", fontSize: 12 }}>{r[2]}</td>
                    <td className="num">{r[3]}</td>
                    <td className="num" style={{ color: r[4] !== "—" ? "var(--warn)" : undefined }}>{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ProGate>
        </div>

        <div className="mb32">
          <Notice>
            Secondary sources only. Verify against exchange contract specifications and SEBI
            circulars before acting. Where reports conflict we have shown the conflict rather
            than choosing.
          </Notice>
        </div>
      </div>
    </>
  );
}
