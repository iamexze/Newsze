import Link from "next/link";
import { STORIES, stats, byId } from "@/lib/data";
import { SectionHead, Stat, Notice } from "@/components/Bits";

export const metadata = { title: "Analog engine" };

const PRESETS = [
  { q: "Hawkish Fed cut with India VIX below 15", n: 34, up: 0.38, med: -0.35, conc: 0.26,
    inst: "Bank Nifty", h: "1 day" },
  { q: "CPI undershoot of more than 1.5σ", n: 46, up: 0.63, med: 0.21, conc: 0.17,
    inst: "Nifty 50", h: "1 day" },
  { q: "Bank Nifty short build-up above the 90th percentile, 10–20 days to expiry", n: 23,
    up: 0.61, med: 0.58, conc: 0.35, inst: "Bank Nifty", h: "5 day" },
  { q: "ADR discount wider than 1.5% on an Indian IT name", n: 44, up: 0.32, med: -1.12,
    conc: 0.15, inst: "Infosys", h: "1 day" },
  { q: "FII net selling above ₹3,000cr with DII absorbing in full", n: 602, up: 0.46,
    med: -0.14, conc: 0.09, inst: "Nifty 50", h: "5 day" },
  { q: "Brent up more than 2% on a supply headline", n: 31, up: 0.38, med: -0.26,
    conc: 0.21, inst: "Nifty 50", h: "1 day" },
];

function Fan({ up, med }: { up: number; med: number }) {
  const bars = [3, 6, 11, 19, 30, 41, 46, 38, 26, 16, 9, 4];
  const centre = 6 + Math.round(med * 1.4);
  return (
    <svg viewBox="0 0 240 56" style={{ width: "100%", height: 56 }} aria-hidden="true">
      {bars.map((h, i) => (
        <rect key={i} x={4 + i * 19.6} y={50 - h} width="16" height={h} rx="1.6"
          fill={i <= centre ? "var(--down)" : "var(--up)"} opacity={.26 + (h / 46) * .5} />
      ))}
      <line x1={4 + centre * 19.6 + 8} y1="2" x2={4 + centre * 19.6 + 8} y2="52"
        stroke={med >= 0 ? "var(--up)" : "var(--down)"} strokeWidth="2" />
    </svg>
  );
}

export default function Analogs() {
  return (
    <div className="wrap" style={{ paddingTop: 18 }}>
      <div className="breadcrumb"><Link href="/">Today</Link> / Analog engine</div>
      <div className="mb24">
        <div className="kicker">{stats.corpusEvents.toLocaleString("en-IN")} events · {stats.corpusYears} years</div>
        <h1 style={{ fontSize: 34, marginTop: 4 }}>What happened last time?</h1>
        <p className="sub" style={{ maxWidth: 760, marginTop: 8, fontSize: 15 }}>
          Describe a set of conditions and the engine finds the historical occasions that most
          resemble them, then shows the distribution of what followed. The distribution is the
          answer. A single number pulled out of it is not.
        </p>
      </div>

      <div className="card mb24" style={{ background: "var(--raised)" }}>
        <div className="row" style={{ gap: 10 }}>
          <span className="label" style={{ flex: "0 0 auto" }}>Query</span>
          <div className="min0" style={{ flex: 1, background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: 6, padding: "10px 13px", fontSize: 14, color: "var(--muted)" }}>
            Hawkish Fed cut with India VIX below 15 → Bank Nifty, 1 day
          </div>
          <span className="cta" style={{ flex: "0 0 auto" }}>Run</span>
        </div>
        <p className="meta mt8">
          Prototype: the six queries below are pre-computed. In the product this box takes free
          text and compiles it into a feature filter over the corpus.
        </p>
      </div>

      <div className="grid g2">
        {PRESETS.map((p) => (
          <div key={p.q} className="card">
            <h3 style={{ fontFamily: "var(--serif)", fontSize: 17, lineHeight: 1.3 }}>{p.q}</h3>
            <div className="row mt8" style={{ gap: 8 }}>
              <span className="chip a">{p.inst}</span>
              <span className="chip">{p.h}</span>
              <span className="chip">n = {p.n}</span>
            </div>
            <div className="mt16"><Fan up={p.up} med={p.med} /></div>
            <div className="between meta" style={{ marginTop: -4 }}>
              <span>−3%</span><span>forward return distribution</span><span>+3%</span>
            </div>
            <hr className="mt12 mb12" />
            <div className="grid g3" style={{ gap: 10 }}>
              <Stat big={`${Math.round(p.up * 100)}%`} label="Moved up" tone={p.up >= 0.5 ? "up" : "down"} />
              <Stat big={`${p.med > 0 ? "+" : ""}${p.med.toFixed(2)}%`} label="Median move"
                tone={p.med >= 0 ? "up" : "down"} />
              <Stat big={p.n.toString()} label="Occurrences" />
            </div>
            {p.conc > 0.3 && (
              <div className="nohist mt12">
                <span>⚠</span>
                <span>{Math.round(p.conc * 100)}% of these fall in one six-month window. The
                  effective sample is smaller than {p.n}.</span>
              </div>
            )}
            {p.n < 30 && (
              <div className="nohist mt8">
                <span>⚠</span>
                <span>Below our publication threshold for a standalone estimate. Shown here as
                  context only.</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt32">
        <SectionHead title="How to read these" />
        <div className="grid g3">
          {[
            { h: "The spread is the point", b: "A median of −0.35% with outcomes running from −3% to +2% is not a forecast of −0.35%. It is a statement that the distribution is wide and slightly tilted. Act on the tilt only if the tilt is large relative to the spread." },
            { h: "Count the regimes, not the cases", b: "Thirty-four occurrences clustered into two market regimes is closer to two observations than thirty-four. Every result here carries a concentration warning when that applies." },
            { h: "Conditions, not stories", b: "The engine matches on measurable features — surprise, volatility regime, trend state, positioning, days to expiry. It does not match on narrative similarity, because narratives are not measurable and would make every past event look relevant." },
          ].map((c) => (
            <div key={c.h} className="card">
              <h3 style={{ fontFamily: "var(--serif)", fontSize: 17, marginBottom: 8 }}>{c.h}</h3>
              <p className="sub">{c.b}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt24">
        <Notice>
          Historical analogs describe the past. They are not predictions, and the sample sizes
          here are small enough that the honest conclusion is often &ldquo;we cannot
          tell&rdquo;. We say that where it applies.
        </Notice>
      </div>
    </div>
  );
}
