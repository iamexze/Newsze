import Link from "next/link";
import { SectionHead, Notice, Stat } from "@/components/Bits";
import { CountUp } from "@/components/Motion";
import { ProTag } from "@/components/Pro";
import { LEDGER, stats } from "@/lib/data";
import { SCREENS } from "@/lib/india";

export const metadata = {
  title: "Newze Pro",
  description: "Everything Pro unlocks — real-time Indian analytics, the full derivatives stack, scanners, workbenches, alerts and exports.",
};

const GROUPS = [
  { g: "Live Indian market data", icon: "IN", items: [
    ["Real-time indices, F&O and option chain", "End-of-day on Free, live on Pro, with the latency class shown on every figure"],
    ["Participant-wise open interest", "FII, DII, Pro and Client positioning in index futures, index options and stock futures"],
    ["Implied volatility surface", "IV rank and percentile, 25-delta skew, term structure, per symbol"],
    ["Rollover analytics", "Rollover percentage, cost of carry, against the three-month average"],
    ["Delivery percentage anomalies", "Flagged against each symbol's own 20-day mean"],
    ["Bulk, block and insider disclosures", "Parsed from exchange files into structured events within minutes"],
  ]},
  { g: "The impact engine, in full", icon: "IE", items: [
    ["Every analog behind every estimate", "Free shows the count; Pro shows all of them, dated and clickable"],
    ["All five horizons", "15 minutes, 1 hour, 1 day, 5 days, 20 days on every published estimate"],
    ["Analog engine queries", "Describe conditions in plain language and get the forward distribution"],
    ["Regime-conditioned analogs", "Restrict matches to the current volatility and trend regime"],
    ["Impact history per instrument", "Every estimate we have ever published on a symbol, with its outcome"],
  ]},
  { g: "Scanners", icon: "SC", items: [
    ["Pattern scanner", "Candlestick patterns across the F&O universe, scored net of round-turn costs"],
    ["Derivatives scanner", "Build-up extremes, IV percentile, PCR, max-pain distance, ban proximity"],
    ["Surveillance scanner", "ASM and GSM stage changes, F&O ban entries and exits, margin changes"],
    ["Index-flow scanner", "Candidates for the next MSCI and domestic index review"],
    ["Custom screens", "Save and schedule any combination; results delivered by alert"],
  ]},
  { g: "Research workbenches", icon: "WB", items: [
    ["Seasonality workbench", "Day, month, expiry-week and pre-holiday tests with multiple-comparison correction"],
    ["Factor workbench", "Crude-in-rupee, gold import parity, sector FX sensitivity, rate beta"],
    ["Correlation explorer", "Rolling correlations and regime-shift detection across any instrument set"],
    ["Backtest-lite", "If this condition had fired every time, what followed — with costs applied"],
    ["Point-in-time data access", "Query the corpus as it stood on any past date, with no look-ahead"],
  ]},
  { g: "Alerts and delivery", icon: "AL", items: [
    ["Radar thresholds", "Only news whose predicted impact on your holdings exceeds a level you set"],
    ["Composable alert rules", "Event type, instrument, price, OI, IV, surveillance status, impact and confidence"],
    ["Quiet hours and fatigue caps", "A hard daily ceiling you control; the default is five"],
    ["WhatsApp and web push", "Plus email on every tier"],
    ["Pre-open briefing push", "The Bridge, at 07:30 IST, before you open anything else"],
  ]},
  { g: "Outlook & path analysis", icon: "OL", items: [
    ["Full possibility trees", "Every branch to three levels deep with joint probability down each path"],
    ["Path expectancy, net of costs", "A 58% branch still loses money if the move is small — we subtract the round turn before showing it"],
    ["The dates behind every base rate", "Click any historical frequency and see the matched sessions"],
    ["Regime-filtered branches", "Restrict base rates to the current volatility and trend state"],
    ["Intraday branch alerts", "Notified the moment a branch condition triggers, not at the close"],
    ["Custom level trees", "Build a tree around your own levels and get the conditional probabilities"],
  ]},
  { g: "Market intelligence", icon: "MI", items: [
    ["Index-flow candidate screen", "MSCI and domestic review candidates before the announcement, with estimated passive flow"],
    ["Surveillance tracker", "ASM, GSM, ban-list and concentration-margin changes the evening they are circulated"],
    ["Circular parser", "SEBI, NSE and BSE circulars turned into structured events, filtered to what you hold"],
    ["Concall and filing summaries", "Earnings transcripts and exchange filings summarised with citations"],
    ["Narrative divergence alerts", "When a theme accelerates while its basket stops responding"],
    ["Cross-asset mood components", "The six inputs behind the risk-mood composite, individually trackable"],
  ]},
  { g: "Review & discipline", icon: "RV", items: [
    ["Decision journal", "Log the view you held and the reason; the system scores it at your stated horizon"],
    ["Your own accuracy ledger", "The same scoring we apply to ourselves, applied to your logged calls"],
    ["Bias report", "Whether your calls skew long, skew short, or cluster after a loss"],
    ["Alert-to-action trace", "Which alerts you opened, and what you did in the hour after"],
    ["Weekly review digest", "What you believed, what happened, and where the gap was"],
  ]},
  { g: "Export and workspace", icon: "EX", items: [
    ["CSV and PDF export", "Any table, any chart, any screen result"],
    ["Full Bridge archive", "Every daily briefing ever published, with its scored outcome"],
    ["Multi-pane workspace", "Terminal tier — several surfaces side by side on one screen"],
    ["API read access", "Terminal tier — events and impacts, not licensed price data"],
    ["Point-in-time query", "Ask the corpus what it knew on any past date, with no look-ahead"],
    ["Scheduled reports", "Any screen, any tree, any workbench — delivered on your cadence"],
    ["Four themes and bilingual UI", "Light, Dark, Paper and Terminal; English and Hindi"],
  ]},
];

export default function Pro() {
  return (
    <>
      <section className="band" style={{ paddingBlock: "48px 42px" }}>
        <div className="wrap">
          <span className="protag">★ Newze Pro</span>
          <h1 className="reveal" style={{ fontSize: "clamp(32px,5.4vw,62px)", marginTop: 14, maxWidth: 1000 }}>
            The free tier tells you what happened. Pro tells you how often that has mattered.
          </h1>
          <p className="sub reveal d1" style={{ fontSize: 17, maxWidth: 780, marginTop: 14, lineHeight: 1.55 }}>
            Live Indian market data, every analog behind every estimate, scanners across the F&amp;O
            universe, research workbenches and alerts you control. All of the research on this
            site stays free — Pro is the tools, not the knowledge.
          </p>
          <div className="grid g4 mt32" style={{ gap: 20 }}>
            <div className="reveal"><div className="figure lg"><CountUp value={LEDGER.overall.n} /></div>
              <div className="statlbl">Scored calls you can inspect</div></div>
            <div className="reveal d1"><div className="figure lg"><CountUp value={stats.corpusEvents} /></div>
              <div className="statlbl">Events in the searchable corpus</div></div>
            <div className="reveal d2"><div className="figure lg"><CountUp value={SCREENS.length} /></div>
              <div className="statlbl">Prebuilt scanners, plus your own</div></div>
            <div className="reveal d3"><div className="figure lg">₹249</div>
              <div className="statlbl">Per month · 14-day trial, no card</div></div>
          </div>
          <div className="row mt32" style={{ gap: 10 }}>
            <Link href="/pricing" className="probtn" style={{ padding: "11px 20px", fontSize: 14 }}>
              <span className="star">★</span> Start the trial
            </Link>
            <Link href="/track-record" className="chip" style={{ padding: "10px 16px", fontSize: 13 }}>
              Check our record first →
            </Link>
          </div>
        </div>
      </section>

      <div className="wrap" style={{ paddingTop: 30 }}>
        <div className="breadcrumb"><Link href="/">Today</Link> / Pro</div>

        <div className="stack mb32" style={{ gap: 26 }}>
          {GROUPS.map((g, gi) => (
            <section key={g.g} className="reveal">
              <SectionHead title={g.g} />
              <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(286px,1fr))", gap: 14 }}>
                {g.items.map(([t, d], i) => (
                  <div key={t} className={`card reveal ${i % 3 === 1 ? "d1" : i % 3 === 2 ? "d2" : ""}`}>
                    <div className="row mb8" style={{ gap: 8 }}>
                      <span className="protag">★ Pro</span>
                    </div>
                    <h3 style={{ fontSize: 16.5, lineHeight: 1.28 }}>{t}</h3>
                    <p className="sub mt8" style={{ fontSize: 13 }}>{d}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="band reveal" style={{ paddingBlock: 38 }}>
          <div className="wrap">
            <div className="kicker accent">Prebuilt scanners</div>
            <h2 style={{ fontSize: "clamp(24px,3.2vw,36px)", marginTop: 8, maxWidth: 760 }}>
              Eight screens that would take a desk an afternoon each
            </h2>
            <div className="grid mt24" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))", gap: 16 }}>
              {SCREENS.map((s, i) => (
                <div key={s.name} className="reveal" style={{ borderLeft: "2px solid var(--accent-on-ink)", paddingLeft: 14 }}>
                  <div className="between mb4">
                    <h3 style={{ fontSize: 15.5 }}>{s.name}</h3>
                    <span className="num" style={{ fontSize: 13, color: "var(--accent-on-ink)" }}>{s.hits}</span>
                  </div>
                  <p className="sub" style={{ fontSize: 12.5 }}>{s.desc}</p>
                </div>
              ))}
            </div>
            <Link href="/screener" className="chip mt24" style={{ padding: "9px 15px", fontSize: 13 }}>
              Open the screener →</Link>
          </div>
        </section>

        <div className="mt32">
          <SectionHead title="What stays free, permanently" />
          <div className="grid g3 mb32">
            {[
              { h: "All the research", b: "Every global-factor study, the transmission work, the pattern and seasonality evidence reviews, the methodology and every lesson. These are the reason to trust the product; gating them would be self-defeating." },
              { h: "The entire Accuracy Ledger", b: "Every call we have published, scored, sliceable, including the two suppressed classes. You should be able to audit us before you pay us, and after." },
              { h: "Today's Overnight Bridge", b: "The 07:30 briefing, the attribution waterfall and yesterday's scored result are free every day. Pro adds the archive and the push." },
            ].map((c) => (
              <div key={c.h} className="card reveal">
                <h3 style={{ fontSize: 18 }}>{c.h}</h3>
                <p className="sub mt8">{c.b}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb32">
          <Notice>
            Prototype — no payment is processed and no account is created. Real-time data
            features depend on exchange data licensing that is still being arranged; every
            price on the site shows its latency class so you always know what you are seeing.
          </Notice>
        </div>
      </div>
    </>
  );
}
