import Link from "next/link";
import { SectionHead, Stat, Notice } from "@/components/Bits";
import { LEDGER, stats } from "@/lib/data";

export const metadata = { title: "Methodology" };

const STAGES = [
  { n: "1", t: "Ingest", b: "Wires, exchange feeds, regulatory filings, central bank channels, macro calendars and company releases. Every item is written to immutable storage before anything touches it, so the whole pipeline can be replayed against a better model later without re-fetching a single source." },
  { n: "2", t: "Normalise", b: "One schema. Timestamps are tri-coded — when the thing happened, when the source published it, and when we received it. Currencies are tagged and never implicitly converted. Units are explicit. Each source carries a credibility tier from 0 (the exchange itself) to 4 (unverified social)." },
  { n: "3", t: "Resolve entities", b: "Free text becomes canonical identifiers. 'HDFC Bank', 'HDFCBANK' and the NYSE depositary receipt 'HDB' are one company. A dictionary handles the common cases, fuzzy matching the awkward ones, and a language model only the genuine ambiguities. Where a name is genuinely ambiguous — 'HDFC' alone, after the merger — we resolve to nothing rather than guess." },
  { n: "4", t: "Cluster", b: "Forty outlets reporting one rate decision become one story with forty sources attached, a timeline, and a visible source-tier mix. You see the event once." },
  { n: "5", t: "Classify", b: "Each story is typed against a fixed taxonomy of roughly 120 event types. Where a consensus forecast exists, we compute the standardised surprise — the difference from consensus divided by its historical dispersion. This is the single most predictive field we have, and almost no sentiment product computes it." },
  { n: "6", t: "Score", b: "The engine retrieves the historical events most similar to this one — matching on event type, surprise, volatility regime, trend state, positioning and days to expiry — and reports the empirical distribution of what followed. A statistical event-study estimate is blended in. No language model produces any number that appears in an estimate." },
  { n: "7", t: "Publish", b: "An estimate is published only if it clears the gate: at least twelve analogs, and a class whose rolling calibration is inside tolerance. Otherwise you see 'not enough history to call this' and the raw context. High-impact and low-confidence items are held for human review before release." },
  { n: "8", t: "Settle", b: "At each horizon the estimate is joined to what the price actually did, scored, and written to the Accuracy Ledger. Append-only. There is no delete path in the schema, the API or the admin console." },
];

export default function Methodology() {
  return (
    <div className="wrap" style={{ paddingTop: 18 }}>
      <div className="breadcrumb"><Link href="/">Today</Link> / Methodology</div>
      <div className="mb24" style={{ maxWidth: 760 }}>
        <div className="kicker">How the numbers are made</div>
        <h1 style={{ fontSize: 34, marginTop: 4 }}>Methodology</h1>
        <p className="sub" style={{ marginTop: 8, fontSize: 15 }}>
          Newze publishes probabilistic descriptions of how markets have historically behaved
          after events of a given kind. This page explains exactly how those descriptions are
          produced, what they do and do not mean, and where the method is weak.
        </p>
      </div>

      <div className="grid g4 mb24">
        <Stat big="8" label="Pipeline stages" />
        <Stat big="~120" label="Event types" />
        <Stat big={stats.corpusEvents.toLocaleString("en-IN")} label="Events in corpus" />
        <Stat big={`${(LEDGER.overall.dirAcc * 100).toFixed(1)}%`} label="Published hit rate" />
      </div>

      <div className="cols">
        <div className="min0">
          <SectionHead title="The pipeline" />
          <div className="stack mb24" style={{ gap: 0 }}>
            {STAGES.map((s) => (
              <div key={s.n} style={{ display: "grid", gridTemplateColumns: "44px 1fr", gap: 16,
                padding: "16px 0", borderBottom: "1px solid var(--border)" }}>
                <div style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 700,
                  color: "var(--border-strong)", lineHeight: 1 }}>{s.n}</div>
                <div>
                  <h3 style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700,
                    letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 6 }}>{s.t}</h3>
                  <p className="sub" style={{ fontSize: 14 }}>{s.b}</p>
                </div>
              </div>
            ))}
          </div>

          <SectionHead title="What the numbers mean" />
          <div className="article mb24">
            <p>
              An estimate of &ldquo;Bank Nifty, 1 day, −0.41%, 68% range −1.3% to +0.5%,
              34 analogs&rdquo; is a statement about the past, not the future. It says: of the
              34 historical events most similar to this one, the median next-day move in Bank
              Nifty was about −0.35%, two-thirds of outcomes fell between −1.3% and +0.5%, and
              62% of them were negative.
            </p>
            <p>
              The width of that range is doing most of the work. A tilt of 0.4% inside a spread
              of nearly two percentage points is a weak statement, and we would rather publish a
              weak statement honestly than a strong one dishonestly.
            </p>
            <p>
              The confidence figure is calibrated, not editorial. A set of estimates published
              at 0.60 confidence should be right about 60% of the time, and the{" "}
              <Link href="/track-record" style={{ color: "var(--accent)" }}>Accuracy Ledger</Link>{" "}
              shows whether they are.
            </p>
          </div>

          <SectionHead title="Where this method is weak" />
          <div className="article">
            <p>
              <strong>Small samples.</strong> Many event classes simply do not occur often
              enough. A regulator&apos;s circular of a particular kind may have four precedents in
              fifteen years. Four is not a sample, and the publication gate suppresses it.
            </p>
            <p>
              <strong>Regime concentration.</strong> Thirty analogs drawn from one eighteen-month
              period are closer to one observation than thirty. Every estimate carries a
              concentration measure and we show a warning above a threshold.
            </p>
            <p>
              <strong>Unprecedented events.</strong> The method is structurally blind to things
              that have not happened before. Its novelty score flags them; it cannot price them.
            </p>
            <p>
              <strong>Decay with horizon.</strong> Accuracy falls as the horizon lengthens,
              from {(LEDGER.byHorizon[0].dir * 100).toFixed(1)}% at fifteen minutes to{" "}
              {(LEDGER.byHorizon[4].dir * 100).toFixed(1)}% at twenty days — the latter being
              close enough to a coin flip that it should be treated as one.
            </p>
            <p>
              <strong>Our own mistakes.</strong> Entity mis-resolution, duplicate ingestion and
              bad consensus data have all produced wrong estimates. Each is listed, with its
              cause, on the Accuracy Ledger.
            </p>
          </div>
        </div>

        <aside className="stack" style={{ gap: 16 }}>
          <div className="card">
            <div className="cardhead"><h2>Source tiers</h2></div>
            {[["t0","T0","Exchange, regulator or the company itself"],
              ["t1","T1","News wire"],["t2","T2","Major outlet"],
              ["t3","T3","Aggregator"],["t4","T4","Social — unverified"]].map(([c, t, d]) => (
              <div key={c} style={{ display: "grid", gridTemplateColumns: "16px 28px 1fr", gap: 8,
                padding: "7px 0", borderBottom: "1px solid var(--border)", alignItems: "start" }}>
                <span className={`dot ${c}`} style={{ marginTop: 5 }} />
                <span className="num" style={{ fontSize: 11.5 }}>{t}</span>
                <span className="sub" style={{ fontSize: 12.5 }}>{d}</span>
              </div>
            ))}
            <p className="meta mt12">
              A tier-4 source can never produce a published estimate. It can only produce a
              story marked unverified.
            </p>
          </div>

          <div className="card">
            <div className="cardhead"><h2>The publication gate</h2></div>
            <p className="sub">An estimate is shown only if:</p>
            <ul className="bullets mt8" style={{ marginBottom: 0 }}>
              <li>at least 12 historical analogs exist</li>
              <li>the event class&apos;s rolling 90-day calibration is inside tolerance</li>
              <li>the source tier permits an estimate at all</li>
            </ul>
            <p className="meta mt12">
              Otherwise you see the honest empty state. Two event classes are suppressed right
              now, and both appear on the Ledger with the date and the reason.
            </p>
          </div>

          <Notice>
            No language model produces any figure that appears in an estimate. Models classify,
            extract and summarise; every number comes from deterministic statistical code, so
            that every published figure is reproducible and auditable.
          </Notice>
        </aside>
      </div>
    </div>
  );
}
