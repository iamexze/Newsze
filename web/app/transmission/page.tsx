import Link from "next/link";
import { CHANNELS } from "@/lib/research";
import { BRIDGE, byId, chg } from "@/lib/data";
import { num } from "@/lib/format";
import Waterfall from "@/components/Waterfall";
import { SectionHead, Stat, Notice, Delta } from "@/components/Bits";

export const metadata = {
  title: "How global markets move India",
  description: "The eight channels through which overnight global trading enters Indian prices — what the evidence says about each, and where it breaks down.",
};

const STRENGTH_N = { strong: 4, moderate: 3, conditional: 2, weak: 1 } as const;

function Meter({ s }: { s: keyof typeof STRENGTH_N }) {
  const n = STRENGTH_N[s];
  return (
    <span className="meter" title={`Evidence strength: ${s}`}>
      {[1, 2, 3, 4].map((i) => <i key={i} className={i <= n ? "on" : ""} />)}
    </span>
  );
}

export default function Transmission() {
  const nifty = byId("IDX:NIFTY50")!;

  return (
    <>
      {/* ── black hero band ───────────────────────────────────────────── */}
      <section className="band" style={{ paddingBlock: "42px 36px" }}>
        <div className="wrap">
          <div className="kicker accent">Market study · India ↔ global</div>
          <h1 style={{ fontSize: "clamp(34px,5.6vw,62px)", marginTop: 10, maxWidth: 1000 }}>
            Seven hours of global trading happen while India sleeps. The gap is where it lands.
          </h1>
          <p className="sub" style={{ fontSize: 17, maxWidth: 760, marginTop: 14, lineHeight: 1.55 }}>
            The Indian cash market trades six and a quarter hours a day. Everything that happens
            in the other seventeen and three-quarter hours has to enter prices somewhere — and it
            enters at the open. This page sets out the eight channels it travels through, what
            the published evidence says about each, and where each one stops working.
          </p>
          <div className="grid g4 mt32" style={{ gap: 20 }}>
            <div><div className="figure lg">14.3%</div>
              <div className="statlbl">Of Indian market variance attributed to US shocks, 2023–25</div></div>
            <div><div className="figure lg">0.39</div>
              <div className="statlbl">Nifty / S&amp;P correlation, recent estimate vs 0.54 ten-year</div></div>
            <div><div className="figure lg">one-way</div>
              <div className="statlbl">Direction of causality, US → Nifty</div></div>
            <div><div className="figure lg">27→18%</div>
              <div className="statlbl">FII ownership of Nifty 50, 2015 → end-2024</div></div>
          </div>
        </div>
      </section>

      <div className="wrap" style={{ paddingTop: 28 }}>
        <div className="breadcrumb"><Link href="/">Today</Link> / Transmission</div>

        {/* the finding */}
        <div className="cols mb32">
          <div className="min0">
            <SectionHead title="The central finding" />
            <div className="article">
              <p>
                Research on US and Indian index data finds unidirectional Granger causality
                running from the S&amp;P 500 and Nasdaq to the Nifty — not the other way. That
                much is unsurprising given the time zones and the relative size of the two
                markets.
              </p>
              <p>
                The useful part is narrower and less well known: <strong>the volatility of the
                Nifty&apos;s overnight return is imported from the US.</strong> The intraday
                Indian session is substantially domestic. The transmission happens in the gap.
              </p>
              <p>
                That is the single most actionable fact in this entire study, and it is why the
                product&apos;s core daily artifact is an opening-gap model rather than a
                day-ahead direction call. We model the part of the day where the global signal
                actually lives, and we leave alone the part where it does not.
              </p>
            </div>
          </div>
          <aside>
            <div className="ink">
              <div className="label mb12">Correlation is unstable — and that matters</div>
              <p className="sub">
                One brokerage estimate puts the Nifty / S&amp;P correlation near 0.39 against a
                ten-year average of about 0.54. Studies covering 2023–2025 find correlation low
                on average but <strong style={{ color: "var(--on-ink)" }}>rising sharply during
                stress</strong>.
              </p>
              <hr className="mt16 mb16" />
              <p className="sub">
                So the channel is weakest on a quiet day and strongest exactly when it matters.
                Any model fitted on calm periods will understate precisely the episodes you
                most need it for — which is why we publish a confidence figure per estimate
                rather than one headline correlation.
              </p>
            </div>
          </aside>
        </div>

        {/* channels */}
        <SectionHead title="The eight channels" />
        <div className="stack mb32" style={{ gap: 16 }}>
          {CHANNELS.map((c, i) => (
            <article key={c.id} className="card" id={c.id}>
              <div className="between mb12" style={{ alignItems: "flex-start" }}>
                <div className="min0">
                  <div className="row" style={{ gap: 10 }}>
                    <span className="figure" style={{ fontSize: 30, color: "var(--border-strong)" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h2 style={{ fontFamily: "var(--serif)", fontSize: 27 }}>{c.name}</h2>
                  </div>
                </div>
                <div className="row" style={{ gap: 10, flex: "0 0 auto" }}>
                  <Meter s={c.strength} />
                  <span className={`ev ${c.strength === "strong" ? "supported"
                    : c.strength === "moderate" ? "mixed" : c.strength === "weak" ? "none" : "mixed"}`}>
                    {c.strength}
                  </span>
                </div>
              </div>
              <div className="meta mb16">{c.window}{c.lagHours > 0 ? ` · ~${c.lagHours}h lag` : " · continuous"}</div>

              <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(270px,1fr))", gap: 22 }}>
                <div className="min0">
                  <div className="label mb8">What it is</div>
                  <p className="sub">{c.what}</p>
                  <div className="label mb8 mt16">How it transmits</div>
                  <p className="sub">{c.how}</p>
                </div>
                <div className="min0">
                  <div className="label mb8">What to watch</div>
                  <ul style={{ listStyle: "none" }}>
                    {c.watch.map((w) => (
                      <li key={w} className="sub" style={{ padding: "5px 0 5px 16px", position: "relative",
                        borderBottom: "1px solid var(--border)" }}>
                        <span style={{ position: "absolute", left: 0, color: "var(--faint)" }}>—</span>{w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {c.sensitivity && (
                <div className="mt16">
                  <div className="label mb8">Published sensitivities</div>
                  <div className="scrollx">
                    <table>
                      <tbody>
                        {c.sensitivity.map((s) => (
                          <tr key={s.driver}>
                            <td style={{ whiteSpace: "normal", width: "40%" }}>{s.driver}</td>
                            <td style={{ whiteSpace: "normal", textAlign: "left",
                              fontFamily: "var(--sans)", fontSize: 12.5, color: "var(--muted)" }}>{s.effect}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {c.evidence && (
                <div className="callout mt16" style={{ fontSize: 14.5 }}>{c.evidence}</div>
              )}

              <div className="nohist mt12" style={{ borderTop: "1px solid var(--border)", paddingTop: 12 }}>
                <span>⚠</span><span><strong>Where it breaks down.</strong> {c.caveat}</span>
              </div>

              <details className="mt12">
                <summary className="meta" style={{ cursor: "pointer" }}>
                  Sources ({c.sources.length})</summary>
                <ul className="sources mt8">
                  {c.sources.map((s) => (
                    <li key={s.label}><b>{s.who}</b><span>{s.label}</span></li>
                  ))}
                </ul>
              </details>
            </article>
          ))}
        </div>

        {/* worked example */}
        <section className="band" style={{ paddingBlock: 36 }}>
          <div className="wrap">
            <div className="kicker accent">Worked example</div>
            <h2 style={{ fontSize: "clamp(26px,3.4vw,40px)", marginTop: 8, maxWidth: 820 }}>
              All eight channels, on one morning, summed into a number
            </h2>
            <p className="sub mt12" style={{ maxWidth: 700 }}>
              This is the attribution from today&apos;s Overnight Bridge. Each channel contributes
              a signed quantity in index points; the components sum to the estimate by
              construction. The residual is shown rather than hidden — it is the part the model
              does not explain.
            </p>
            <div className="grid mt24" style={{ gridTemplateColumns: "minmax(0,1.4fr) minmax(0,1fr)", gap: 30 }}>
              <div className="min0"><Waterfall rows={BRIDGE.attribution} /></div>
              <div>
                <div className="figure xl">{num(BRIDGE.estimates[0].open, 0)}</div>
                <div className="statlbl">Expected Nifty open · 68% range{" "}
                  {num(BRIDGE.estimates[0].b68[0], 0)}–{num(BRIDGE.estimates[0].b68[1], 0)}</div>
                <p className="sub mt16">
                  Scored against the actual open at 09:16 IST, every trading day, on the public
                  record. Yesterday we were {BRIDGE.yesterday.errorPts} points off — inside the
                  68% range.
                </p>
                <Link href="/bridge" className="chip mt12" style={{ padding: "8px 14px", fontSize: 12.5 }}>
                  Today&apos;s Bridge →</Link>
              </div>
            </div>
          </div>
        </section>

        {/* how to use */}
        <div className="mt32">
          <SectionHead title="How an Indian trader should use this" />
          <div className="grid g3">
            {[
              { h: "Decompose, never quote one number", b: "Morning commentary reduces the whole overnight world to 'GIFT Nifty up 40 points'. That number already contains the US close, the dollar, crude and every overnight event, mixed together and unattributable. A decomposition tells you which driver to watch during the session; a single number tells you nothing you can act on when it reverses at 09:20." },
              { h: "Weight by regime, not by habit", b: "The US channel is weak on a quiet day and strong in stress. Checking it with the same intensity every morning means over-weighting it on 80% of days and under-weighting it on the 20% that determine your year. Volatility regime is the variable that should set how much attention each channel gets." },
              { h: "Separate the gap from the session", b: "The evidence says the global signal lives in the overnight gap and the intraday session is substantially domestic. A global headline that has already been absorbed into the opening price is not a reason to trade at 11:00. Most of the damage retail traders do to themselves is trading the open's news at midday." },
              { h: "Distrust the flow narrative", b: "FII selling is the most over-read number in Indian markets. Foreign ownership of the Nifty 50 has fallen from about 27% to about 18% in a decade, and a long-run study across roughly 4,400 sessions found flows co-move with returns rather than causing them. Always read FII against DII on the same day." },
              { h: "Convert crude to rupees", b: "The dollar oil price is half the information. The rupee cost combines Brent with USD/INR, and the two often move together unhelpfully. Published estimates put roughly 49 basis points on CPI per $10 per barrel — but they vary by study, base price and tax policy, so treat the coefficient as indicative." },
              { h: "Watch the basis, not the level", b: "GIFT Nifty up 40 points when fair value says it should be up 70 is a weak signal dressed as a positive one. The premium or discount to theoretical fair value, given carry and days to expiry, is the number with information in it." },
            ].map((c) => (
              <div key={c.h} className="card">
                <h3 style={{ fontFamily: "var(--serif)", fontSize: 21, marginBottom: 9 }}>{c.h}</h3>
                <p className="sub">{c.b}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt32">
          <SectionHead title="Sources" />
          <div className="card">
            <p className="sub mb12">
              The mechanisms and published findings on this page are real and attributed. Every
              live figure elsewhere on this site is sample data. The two are kept separate
              deliberately.
            </p>
            <ul className="sources">
              {Array.from(new Map(CHANNELS.flatMap((c) => c.sources).map((s) => [s.label, s])).values())
                .map((s) => <li key={s.label}><b>{s.who}</b><span>{s.label}</span></li>)}
            </ul>
            <p className="meta mt12">
              Correlation and sensitivity estimates vary substantially with window, method and
              base period. Where sources disagree we have said so rather than picking the
              convenient figure.
            </p>
          </div>
        </div>

        <div className="mt24 mb32">
          <Notice>
            This page explains mechanisms. It is not a trading strategy, and the existence of a
            transmission channel does not mean it can be traded profitably after costs.
          </Notice>
        </div>
      </div>
    </>
  );
}
