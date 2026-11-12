import Link from "next/link";
import { SectionHead, Notice } from "@/components/Bits";
import { LEDGER } from "@/lib/data";

export const metadata = { title: "Pricing" };

const TIERS = [
  { name: "Free", price: "₹0", per: "", cta: "Start reading", accent: false,
    who: "Anyone following markets",
    has: ["Live wire and all story pages","Today's Overnight Bridge","The full Accuracy Ledger",
      "6 impact cards a day","End-of-day India and global analytics",
      "All eight global-factor studies in full","Patterns, statistics and transmission research",
      "1 watchlist, 10 symbols","Daily 07:30 email"],
    hasnt: ["Real-time analytics","Analog engine","Alerts and Radar","Export"] },
  { name: "Pro", price: "₹249", per: "per month · ₹2,490 a year", cta: "Start 14-day trial", accent: true,
    who: "The serious retail trader",
    has: ["Everything in Free","Unlimited impact cards and every analog behind them",
      "Real-time India analytics","Full derivatives stack — participant OI, IV surface, rollovers",
      "Alert rules and Radar thresholds you set","Narrative tracker and analog engine",
      "Crude-in-rupee, gold import parity, sector FX sensitivity",
      "Pattern scanner across the F&O universe, net of costs",
      "Seasonality workbench with corrected significance",
      "10 watchlists, unlimited symbols","Bridge archive, all history","CSV and PDF export"],
    hasnt: [] },
  { name: "Terminal", price: "₹1,999", per: "per seat, per month", cta: "Talk to us", accent: false,
    who: "Analysts, RIAs, family offices",
    has: ["Everything in Pro","Multi-pane workspace","API read access","PDF research export",
      "Team sharing and SSO","Priority support","Point-in-time data access"],
    hasnt: [] },
];

export default function Pricing() {
  return (
    <div className="wrap" style={{ paddingTop: 18 }}>
      <div className="breadcrumb"><Link href="/">Today</Link> / Pricing</div>
      <div style={{ maxWidth: 720 }}>
        <div className="kicker">Subscriptions. No ads, no sponsored content.</div>
        <h1 style={{ fontSize: 34, marginTop: 4 }}>Pricing</h1>
        <p className="sub" style={{ marginTop: 8, fontSize: 15 }}>
          Our revenue comes from readers, which is the only model whose incentive is being
          right. Before you decide, the most useful thing to look at is not this page — it is
          our <Link href="/track-record" style={{ color: "var(--accent)", fontWeight: 600 }}>track record</Link>.
        </p>
      </div>

      <div className="card mt24 mb32" style={{ background: "var(--raised)" }}>
        <div className="row" style={{ gap: 26, alignItems: "center" }}>
          <div>
            <div className="statbig">{(LEDGER.overall.dirAcc * 100).toFixed(1)}%</div>
            <div className="statlbl">Direction accuracy, 1 day</div>
          </div>
          <div>
            <div className="statbig">{(LEDGER.overall.coverage68 * 100).toFixed(1)}%</div>
            <div className="statlbl">68% band coverage</div>
          </div>
          <div>
            <div className="statbig">{LEDGER.overall.n.toLocaleString("en-IN")}</div>
            <div className="statlbl">Calls scored, none removed</div>
          </div>
          <p className="sub min0" style={{ flex: 1, minWidth: 220 }}>
            Two event classes are currently suppressed because their accuracy fell below our
            bar. We publish that too. If those numbers do not persuade you, the price should
            not either.
          </p>
        </div>
      </div>

      <div className="card mb24 reveal" style={{ borderColor: "var(--accent)" }}>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 22 }}>
          <div className="min0">
            <div className="label mb8">Why ₹249 and not ₹799</div>
            <p className="sub" style={{ fontSize: 13.5 }}>
              A serious Indian retail trader already pays ₹1,200–2,500 a month across a charting
              subscription, an options tool and a data service. A fourth product at ₹799 competes
              for the top of that budget. At ₹249 it does not have to — it sits alongside what
              they already use instead of replacing something.
            </p>
          </div>
          <div className="min0">
            <div className="label mb8">What it costs us to be wrong about this</div>
            <p className="sub" style={{ fontSize: 13.5 }}>
              Pricing at a third of the original figure roughly triples the subscriber count
              needed to cover fixed data-licensing costs. That is the trade: a far larger
              addressable base against a much longer path to break-even. We would rather be
              used widely and reach break-even on volume than priced for a market that is
              smaller than it looks.
            </p>
          </div>
          <div className="min0">
            <div className="label mb8">What stays free regardless</div>
            <p className="sub" style={{ fontSize: 13.5 }}>
              Every research study, the transmission work, the evidence reviews, the
              methodology and the entire Accuracy Ledger. You should be able to audit us
              before you pay us — and after.
            </p>
          </div>
        </div>
      </div>

      <div className="grid g3" style={{ alignItems: "start" }}>
        {TIERS.map((t) => (
          <div key={t.name} className="card"
            style={{ borderColor: t.accent ? "var(--accent)" : undefined,
              borderWidth: t.accent ? 2 : 1 }}>
            {t.accent && <div className="kicker mb8">Most popular</div>}
            <h3 style={{ fontFamily: "var(--serif)", fontSize: 22 }}>{t.name}</h3>
            <p className="sub" style={{ fontSize: 12.5 }}>{t.who}</p>
            <div className="row mt16" style={{ gap: 7, alignItems: "baseline" }}>
              <span className="statbig">{t.price}</span>
              <span className="meta">{t.per}</span>
            </div>
            <Link href="/" className={t.accent ? "cta" : "chip"}
              style={{ display: "block", textAlign: "center", marginTop: 16,
                padding: t.accent ? "10px 14px" : "9px 14px", fontSize: 13 }}>
              {t.cta}
            </Link>
            <hr className="mt16 mb12" />
            <div className="stack" style={{ gap: 7 }}>
              {t.has.map((f) => (
                <div key={f} className="row" style={{ gap: 8, alignItems: "flex-start" }}>
                  <span className="up" style={{ fontSize: 12, lineHeight: 1.5 }}>✓</span>
                  <span className="sub" style={{ fontSize: 12.5 }}>{f}</span>
                </div>
              ))}
              {t.hasnt.map((f) => (
                <div key={f} className="row" style={{ gap: 8, alignItems: "flex-start", opacity: .55 }}>
                  <span style={{ fontSize: 12, lineHeight: 1.5, color: "var(--faint)" }}>—</span>
                  <span className="sub" style={{ fontSize: 12.5 }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt32" style={{ maxWidth: 760 }}>
        <SectionHead title="Questions people actually ask" />
        <div className="stack" style={{ gap: 0 }}>
          {[
            { q: "Will you tell me what to buy?", a: "No. We describe what has historically followed events like today's, with the sample size and the spread. What to do with that is your decision, and legally it has to be." },
            { q: "Why publish your own hit rate? Nobody else does.", a: "Because a number without a track record is an opinion. Publishing the record is the only way to let you calibrate how much weight to give our estimates — including when the honest answer is 'not much'." },
            { q: "What happens when you are wrong?", a: "It stays on the ledger. We have no mechanism to remove an individual call. When a whole event class degrades, we stop publishing it and say so, with the date and the reason." },
            { q: "Can I cancel?", a: "Any time, from your account, in two clicks. No retention call, no dark pattern. You keep access until the end of the period you paid for." },
            { q: "Is the Indian data real-time?", a: "Real-time analytics are a Pro feature and depend on exchange data licensing. Every price on the site shows its latency class, so you always know how fresh what you are looking at is." },
            { q: "What stays free?", a: "All the research. Every global-factor study, the transmission work, the pattern and seasonality evidence reviews, the methodology and the full Accuracy Ledger are free and always will be. Pro is the live data, the scanners and the workbenches — the tools, not the knowledge." },
          ].map((f) => (
            <div key={f.q} style={{ padding: "16px 0", borderBottom: "1px solid var(--border)" }}>
              <h3 style={{ fontFamily: "var(--serif)", fontSize: 17, marginBottom: 6 }}>{f.q}</h3>
              <p className="sub">{f.a}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt24">
        <Notice>
          Prototype — no payment is processed and no account is created. Prices shown are
          illustrative.
        </Notice>
      </div>
    </div>
  );
}
