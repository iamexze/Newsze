import Link from "next/link";
import { STORIES, leadStory, BRIDGE, LEDGER, byId, chg, SECTORS, OI_TABLE,
  BUILDUP_LABEL, FLOWS, CALENDAR, NARRATIVES, stats, DATA_NOTICE, CENTRAL_BANKS } from "@/lib/data";
import { num, crore, ago } from "@/lib/format";
import StoryTile from "@/components/StoryTile";
import Thumb from "@/components/Thumb";
import ImpactCard from "@/components/ImpactCard";
import Waterfall from "@/components/Waterfall";
import { SectionHead, Delta, QuoteRow, Tier, Spark, Stat, Notice } from "@/components/Bits";
import { FORECASTERS, CHANNELS } from "@/lib/research";
import { FACTORS, PATTERNS } from "@/lib/factors";
import { ProTag } from "@/components/Pro";
import { CountUp } from "@/components/Motion";
import { MSCI, HEATMAP } from "@/lib/india";
import { SCENARIOS, VERDICT_META, MOOD } from "@/lib/scenarios";
import { CHAINS, outlook, INDEX_LINKS } from "@/lib/options";
import { ImpliedDistribution } from "@/components/OptionCharts";
import { TREES } from "@/lib/outlook";
import Tree from "@/components/Tree";
import { MoodGauge, MoodHistory } from "@/components/Mood";
import Explain from "@/components/Explain";

export default function Home() {
  const lead = leadStory;
  const rest = STORIES.filter((s) => s.id !== lead.id);
  const secondary = rest.slice(0, 3);
  const latest = [...rest].sort((a, b) => a.minsAgo - b.minsAgo).slice(0, 4);
  const indiaStories = rest.filter((s) => s.region === "IN").slice(0, 4);
  const globalStories = rest.filter((s) => s.region !== "IN").slice(0, 4);
  const mostRead = [...STORIES].sort((a, b) => b.novelty - a.novelty).slice(0, 6);
  const nifty = byId("IDX:NIFTY50")!;
  const est = BRIDGE.estimates[0];

  return (
    <div className="wrap" style={{ paddingTop: 16, paddingBottom: 10 }}>
      <Notice>
        <b>Prototype.</b> {DATA_NOTICE} Newze publishes information and statistical analysis
        only — never investment advice.
      </Notice>

      {/* ══ HERO ══════════════════════════════════════════════════════ */}
      <section className="mt24" style={{ display: "grid", gridTemplateColumns: "minmax(0,2.1fr) minmax(0,1fr)", gap: 28 }}>
        <article className="min0">
          <Link href={`/story/${lead.slug}`}>
            <Thumb s={lead} h={330} />
          </Link>
          <div className="storyline" style={{ marginTop: 12 }}>
            <Tier t={lead.tier} />
            <span>{lead.outlets.slice(0, 3).join(", ")} +{lead.sourceCount - 3}</span>
            <span>|</span><span>{ago(lead.minsAgo)}</span>
            <span>|</span>
            <span style={{ color: "var(--accent)", fontWeight: 600 }}>{lead.section}</span>
          </div>
          <h1 style={{ fontSize: "clamp(28px,3.6vw,42px)", lineHeight: 1.1, marginTop: 8 }}>
            <Link href={`/story/${lead.slug}`}>{lead.headline}</Link>
          </h1>
          <p style={{ fontFamily: "var(--serif)", fontSize: 18.5, color: "var(--fg-soft)",
            lineHeight: 1.46, marginTop: 10 }}>{lead.dek}</p>
          <div className="mt16"><ImpactCard story={lead} horizon="1d" /></div>
        </article>

        <aside className="min0 stack" style={{ gap: 0 }}>
          {secondary.map((s, i) => (
            <div key={s.id} style={{ paddingBottom: 16, marginBottom: 16,
              borderBottom: i < secondary.length - 1 ? "1px solid var(--border)" : "none" }}>
              <StoryTile s={s} size="sm" visual={i === 0} />
            </div>
          ))}
          <Link href="/wire" className="chip a" style={{ padding: "7px 14px", fontSize: 12.5, alignSelf: "flex-start" }}>
            More stories →
          </Link>
        </aside>
      </section>

      {/* ══ BLACK BAND — where the market stands ══════════════════════ */}
      <section className="band mt32 reveal" style={{ paddingBlock: 34 }}>
        <div className="wrap">
          <div className="grid" style={{ gridTemplateColumns: "minmax(0,1fr) minmax(0,1.25fr)", gap: 36 }}>
            <div className="min0">
              <div className="kicker accent">Expected open · 07:30 IST</div>
              <div className="figure xl mt8">{num(est.open, 0)}</div>
              <div className="statlbl">
                Nifty 50 · {est.gapPct < 0 ? "▼" : "▲"} {Math.abs(est.gapPct).toFixed(2)}% ·
                68% range {num(est.b68[0], 0)}–{num(est.b68[1], 0)}
              </div>
              <p className="sub mt16" style={{ maxWidth: 420 }}>
                Built from the US close, the Fed guidance surprise, crude, the rupee and ADR
                dislocation — each contribution named, and the whole estimate scored against
                the actual open at 09:16.
              </p>
              <Link href="/bridge" className="chip mt16" style={{ padding: "8px 14px", fontSize: 12.5 }}>
                Full attribution →</Link>
            </div>

            <div className="min0">
              <div className="kicker accent">Where the forecasters stand</div>
              <div className="between mb8 mt12">
                <span className="label">{FORECASTERS.length} tracked forecasters</span>
                <span className="meta">weighted by their own hit rates</span>
              </div>
              {(() => {
                const up = FORECASTERS.filter((f) => f.view === "up");
                const dn = FORECASTERS.filter((f) => f.view === "down");
                const nu = FORECASTERS.filter((f) => f.view === "neutral");
                const n = FORECASTERS.length;
                const wU = up.reduce((a, f) => a + f.record.hit, 0);
                const wD = dn.reduce((a, f) => a + f.record.hit, 0);
                const wT = FORECASTERS.reduce((a, f) => a + f.record.hit, 0);
                const skew = ((wU - wD) / wT) * 100;
                return (
                  <>
                    <div className="gauge" style={{ height: 34 }}>
                      <span className="seg" style={{ left: 0, width: `${(dn.length / n) * 100}%`,
                        background: "var(--down)", opacity: .85 }} />
                      <span className="seg" style={{ left: `${(dn.length / n) * 100}%`,
                        width: `${(nu.length / n) * 100}%`, background: "#3A3A3A" }} />
                      <span className="seg" style={{ left: `${((dn.length + nu.length) / n) * 100}%`,
                        width: `${(up.length / n) * 100}%`, background: "var(--up)", opacity: .85 }} />
                      <span className="mark" style={{ left: `${50 + skew / 2}%` }} />
                    </div>
                    <div className="between meta mt8">
                      <span>{dn.length} lower</span><span>{nu.length} neutral</span>
                      <span>{up.length} higher</span>
                    </div>
                  </>
                );
              })()}
              <div className="scrollx mt16">
                <table>
                  <thead><tr><th>Forecaster</th><th>View</th><th>Horizon</th><th>Hit rate</th></tr></thead>
                  <tbody>
                    {FORECASTERS.slice(0, 5).map((f) => (
                      <tr key={f.id}>
                        <td style={{ color: "var(--on-ink)" }}>{f.name}</td>
                        <td className={f.view === "up" ? "up" : f.view === "down" ? "down" : "flat"}>
                          {f.view === "up" ? "▲ higher" : f.view === "down" ? "▼ lower" : "▬ neutral"}</td>
                        <td style={{ color: "var(--on-ink-faint)" }}>{f.horizon}</td>
                        <td style={{ color: f.record.hit < 0.5 ? "var(--down)" : "var(--on-ink)" }}>
                          {(f.record.hit * 100).toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Link href="/forecasts" className="chip mt16" style={{ padding: "8px 14px", fontSize: 12.5 }}>
                All forecasts &amp; the scoreboard →</Link>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ══ LATEST (4-across) ═════════════════════════════════════════ */}
      <section className="reveal">
        <SectionHead title="Latest" href="/wire" more="Live wire" />
        <div className="tilegrid four">
          {latest.map((s) => <StoryTile key={s.id} s={s} />)}
        </div>
      </section>

      <div className="divider" />

      {/* ══ INDIA + RAIL ══════════════════════════════════════════════ */}
      <div className="cols">
        <div className="min0">
          <SectionHead title="India" href="/india" more="India hub" />
          <div className="tilegrid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(236px,1fr))" }}>
            {indiaStories.map((s) => <StoryTile key={s.id} s={s} />)}
          </div>

          <div className="grid g2 mt32">
            <div className="card">
              <div className="cardhead"><h2>What moved the index</h2><span className="tag">index points</span></div>
              <div className="row mb12" style={{ gap: 16 }}>
                <div>
                  <div className="meta">NIFTY 50</div>
                  <div className="num" style={{ fontSize: 19, fontWeight: 600 }}>{num(nifty.last, 2)}</div>
                  <Delta v={chg(nifty)} />
                </div>
                <Spark data={nifty.hist} w={124} h={38} />
              </div>
              <Waterfall rows={[
                { name: "HDFC Bank", pts: 18.4 }, { name: "Infosys", pts: -14.1 },
                { name: "Reliance", pts: 11.2 }, { name: "TCS", pts: -9.8 },
                { name: "Bajaj Finance", pts: 8.1 }, { name: "Maruti", pts: -6.4 },
              ]} />
            </div>

            <div className="card">
              <div className="cardhead"><h2>Open interest build-up</h2>
                <Link href="/india/derivatives" className="tag" style={{ color: "var(--accent)" }}>all →</Link></div>
              <div className="scrollx">
                <table>
                  <thead><tr><th>Symbol</th><th>Price</th><th>OI</th><th>Build-up</th><th>%ile</th></tr></thead>
                  <tbody>
                    {OI_TABLE.slice(0, 7).map((r) => {
                      const i = byId(r.id)!;
                      const tone = r.buildup === "LONG_BUILDUP" || r.buildup === "SHORT_COVERING"
                        ? "var(--up)" : r.buildup === "SHORT_BUILDUP" ? "var(--down)" : "var(--muted)";
                      return (
                        <tr key={r.id} className="hoverable">
                          <td><Link href={`/ticker/${encodeURIComponent(r.id)}`}>{i.sym}</Link></td>
                          <td className={r.priceChg >= 0 ? "up" : "down"}>{r.priceChg.toFixed(2)}%</td>
                          <td>{r.oiChg > 0 ? "+" : ""}{r.oiChg.toFixed(1)}%</td>
                          <td style={{ fontFamily: "var(--sans)", fontSize: 11.5, color: tone }}>
                            {BUILDUP_LABEL[r.buildup]}</td>
                          <td style={{ color: r.pctile > 85 ? "var(--warn)" : undefined }}>{r.pctile}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* right rail */}
        <aside className="stack" style={{ gap: 20 }}>
          {/* Bridge */}
          <div className="card" style={{ borderColor: "var(--accent)" }}>
            <div className="cardhead">
              <h2 style={{ color: "var(--accent)" }}>Overnight Bridge</h2>
              <span className="tag">{BRIDGE.publishedAt}</span>
            </div>
            <div className="hero" style={{ padding: "2px 0 6px" }}>
              <div className="sym">Nifty 50 · expected open</div>
              <div className="big down">{num(est.open, 0)}</div>
              <div className="dl down">▼ {Math.abs(est.gapPct).toFixed(2)}% · {num(est.open - est.prevClose, 0)} pts</div>
            </div>
            <div className="meta" style={{ textAlign: "center", marginBottom: 12 }}>
              68% range {num(est.b68[0], 0)} – {num(est.b68[1], 0)} · conf {est.conf.toFixed(2)}
            </div>
            <Waterfall rows={BRIDGE.attribution} />
            <hr className="mt12 mb12" />
            <div className="between"><span className="sub">Yesterday</span>
              <span className="num up">{BRIDGE.yesterday.errorPts} pts off ✓ in range</span></div>
            <Link href="/bridge" className="chip a mt12" style={{ padding: "7px 13px", fontSize: 12 }}>
              Full briefing →
            </Link>
          </div>

          {/* Most read */}
          <div>
            <SectionHead title="Most read" />
            <div className="mostread">
              {mostRead.map((s) => (
                <Link key={s.id} href={`/story/${s.slug}`}>
                  <h4>{s.headline}</h4>
                </Link>
              ))}
            </div>
          </div>

          {/* Markets */}
          <div className="card">
            <div className="cardhead"><h2>Markets</h2><span className="tag">15m delayed</span></div>
            {["IDX:NIFTY50","IDX:NIFTYBANK","FX:USDINR","CMD:BRENT","IDX:SPX","CMD:XAU","RT:US10Y"]
              .map((id) => <QuoteRow key={id} id={id} />)}
            <Link href="/markets" className="sub mt12" style={{ color: "var(--accent)", fontWeight: 600 }}>
              All markets →</Link>
          </div>
        </aside>
      </div>

      <div className="divider" />

      {/* ══ GLOBAL ════════════════════════════════════════════════════ */}
      <section className="reveal">
        <SectionHead title="Global markets" href="/markets" more="Cross-asset" />
        <div className="tilegrid four">
          {globalStories.map((s) => <StoryTile key={s.id} s={s} />)}
        </div>

        <div className="grid g2 mt32">
          <div className="card">
            <div className="cardhead"><h2>Central bank policy</h2>
              <Link href="/global/central-banks" className="tag" style={{ color: "var(--accent)" }}>all →</Link></div>
            <div className="scrollx">
              <table>
                <thead><tr><th>Bank</th><th>Rate</th><th>Next</th><th>3m implied</th><th>Stance</th></tr></thead>
                <tbody>
                  {CENTRAL_BANKS.map((b) => (
                    <tr key={b.code} className="hoverable">
                      <td>{b.code}</td>
                      <td>{b.rate.toFixed(2)}%</td>
                      <td style={{ fontSize: 11.5 }}>{b.next.split(" ").slice(0, 2).join(" ")}</td>
                      <td className={b.implied3m >= 0 ? "up" : "down"}>
                        {b.implied3m > 0 ? "+" : ""}{(b.implied3m * 100).toFixed(0)}bp</td>
                      <td style={{ fontFamily: "var(--sans)", fontSize: 11.5, color: "var(--muted)" }}>{b.stance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div className="cardhead"><h2>What the market is talking about</h2>
              <Link href="/narratives" className="tag" style={{ color: "var(--accent)" }}>tracker →</Link></div>
            <div className="stack" style={{ gap: 9 }}>
              {NARRATIVES.slice(0, 6).map((n) => (
                <div key={n.label}>
                  <div className="between" style={{ marginBottom: 3 }}>
                    <span style={{ fontSize: 13 }}>{n.label}</span>
                    <span className={`num ${n.wow >= 0 ? "up" : "down"}`} style={{ fontSize: 11.5 }}>
                      {n.wow > 0 ? "+" : ""}{n.wow}% w/w
                    </span>
                  </div>
                  <div className="bar"><i style={{ width: `${(n.share / 15) * 100}%` }} /></div>
                </div>
              ))}
            </div>
            <p className="meta mt12">Share of market conversation, week on week change.</p>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ══ GLOBAL FACTORS ════════════════════════════════════════════ */}
      <section className="reveal">
        <SectionHead title="What moves India from outside" href="/global-factors" more="All factors" />
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(192px,1fr))", gap: 14 }}>
          {FACTORS.map((f) => {
            const inst = f.instruments[0] ? byId(f.instruments[0]) : undefined;
            const c = inst ? chg(inst) : 0;
            return (
              <Link key={f.slug} href={`/global-factors/${f.slug}`} className="card tile">
                <div className="between mb8">
                  <span className="label">{f.mark}</span>
                  <span className={`ev ${f.impact === "high" ? "supported"
                    : f.impact === "medium" ? "mixed" : "none"}`}>{f.impact}</span>
                </div>
                <h3 style={{ fontSize: 17 }}>{f.name}</h3>
                {inst && (
                  <div className="row mt8" style={{ gap: 9 }}>
                    <span className="num" style={{ fontSize: 14, fontWeight: 600 }}>
                      {num(inst.last, inst.last > 500 ? 0 : 2)}</span>
                    <Delta v={c} />
                  </div>
                )}
                {inst && <div className="mt8"><Spark data={inst.hist} w={168} h={26} up={c >= 0} /></div>}
                <p className="meta mt8" style={{ fontSize: 10.5, lineHeight: 1.45 }}>{f.kicker}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="divider" />

      {/* ══ BLACK BAND — transmission study ═══════════════════════════ */}
      <section className="band reveal" style={{ paddingBlock: 36 }}>
        <div className="wrap">
          <div className="grid" style={{ gridTemplateColumns: "minmax(0,1.3fr) minmax(0,1fr)", gap: 36 }}>
            <div className="min0">
              <div className="kicker accent">Market study</div>
              <h2 style={{ fontSize: "clamp(26px,3.6vw,42px)", marginTop: 8, maxWidth: 620 }}>
                Seven hours of global trading happen while India sleeps. The gap is where it lands.
              </h2>
              <p className="sub mt12" style={{ maxWidth: 560 }}>
                Research finds the volatility of the Nifty&apos;s overnight return is imported
                from the US, with causality running one way. The intraday session is
                substantially domestic. We map the eight channels it travels through — and
                where each one stops working.
              </p>
              <Link href="/transmission" className="chip mt16" style={{ padding: "9px 15px", fontSize: 13 }}>
                Read the transmission study →</Link>
            </div>
            <div className="min0">
              <div className="scrollx">
                <table>
                  <thead><tr><th>Channel</th><th>Window</th><th style={{ textAlign: "right" }}>Evidence</th></tr></thead>
                  <tbody>
                    {CHANNELS.slice(0, 6).map((c) => (
                      <tr key={c.id}>
                        <td style={{ color: "var(--on-ink)" }}>{c.name}</td>
                        <td style={{ color: "var(--on-ink-faint)", fontSize: 11 }}>
                          {c.lagHours > 0 ? `~${c.lagHours}h lag` : "continuous"}</td>
                        <td style={{ textAlign: "right" }}>
                          <span className="meter">
                            {[1,2,3,4].map((i) => (
                              <i key={i} className={i <= ({strong:4,moderate:3,conditional:2,weak:1} as const)[c.strength] ? "on" : ""} />
                            ))}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ══ TOOLS ═════════════════════════════════════════════════════ */}
      <section className="reveal">
        <SectionHead title="Newze intelligence" />
        <div className="tilegrid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))" }}>
          {[
            { href: "/track-record", t: "Accuracy Ledger",
              d: `Every one of ${LEDGER.overall.n.toLocaleString("en-IN")} published calls, scored and kept. Two event classes are currently suppressed for poor calibration — that is shown too.`,
              s: `${(LEDGER.overall.dirAcc * 100).toFixed(1)}% direction` },
            { href: "/analogs", t: "Analog engine",
              d: "Ask what happened the last time conditions looked like today, and see the distribution rather than a single number.",
              s: `${stats.corpusEvents.toLocaleString("en-IN")} events` },
            { href: "/narratives", t: "Narrative tracker",
              d: "What the market is arguing about, how fast it is spreading, and where the story has detached from the price.",
              s: "8 live themes" },
            { href: "/signals", t: "What predicts direction",
              d: "An honest evidence review of every indicator traders watch — including the ones with no demonstrated predictive power at all.",
              s: "10 indicators rated" },
            { href: "/forecasts/scoreboard", t: "Forecaster scoreboard",
              d: "Who called it right. Every tracked forecaster ranked by hit rate, our own Bridge scored on the same basis.",
              s: `${FORECASTERS.length} tracked` },
            { href: "/patterns", t: "Candlestick patterns",
              d: "Eight patterns drawn from their real geometry, each rated against twenty years of published research. Most verdicts are unflattering.",
              s: `${PATTERNS.length} reviewed` },
            { href: "/statistics", t: "Market statistics",
              d: "Calendar anomalies and seasonality checked against the Indian literature — including the day-of-week effect that settlement reform killed.",
              s: "6 claims checked" },
            { href: "/learn", t: "Market study",
              d: "Short explainers on the mechanics: what a surprise is, how an opening gap forms, how to read open interest without fooling yourself.",
              s: "6 lessons" },
            { href: "/calendar", t: "Macro calendar",
              d: "Scheduled releases with consensus, prior and the surprise computed the moment the number lands.",
              s: `${CALENDAR.length} upcoming` },
          ].map((c) => (
            <Link key={c.href} href={c.href} className="card tile" style={{ display: "block" }}>
              <span className="kicker">{c.s}</span>
              <h3 style={{ fontSize: 18, marginTop: 7 }}>{c.t}</h3>
              <p className="tiledek">{c.d}</p>
              <span className="sub mt8" style={{ color: "var(--accent)", fontWeight: 600, display: "block" }}>
                Open →</span>
            </Link>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* ══ INDICES · OPTIONS · THE IMPLIED READ ══════════════════════ */}
      <section className="reveal">
        <SectionHead title="Nifty · Sensex · Bank Nifty — and what the option market implies"
          href="/options" more="All chains" />
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(310px,1fr))", gap: 14 }}>
          {CHAINS.filter((c) => ["nifty","sensex","banknifty","crudeoil","naturalgas","gold"].includes(c.slug))
            .map((c, i) => {
            const o = outlook(c);
            const inst = byId(c.instrument);
            return (
              <Link key={c.slug} href={`/options/${c.slug}`}
                className={`card tile reveal ${i % 3 === 1 ? "d1" : i % 3 === 2 ? "d2" : ""}`}>
                <div className="between mb8">
                  <span className="label">{c.name}</span>
                  <span className="meta">{c.venue} · {c.dte}d</span>
                </div>
                <div className="row" style={{ gap: 12, alignItems: "baseline" }}>
                  <span className="num" style={{ fontSize: 21, fontWeight: 600 }}>{num(c.spot, 0)}</span>
                  {inst && <Delta v={chg(inst)} />}
                </div>
                <div className="mt12"><ImpliedDistribution c={c} h={116} /></div>
                <div className="odds mt8" style={{ gridTemplateColumns: "1fr 1fr" }}>
                  <div style={{ padding: "9px 10px" }}>
                    <div className="num up" style={{ fontSize: 17, fontWeight: 700 }}>
                      {(o.up * 100).toFixed(1)}%</div>
                    <div className="statlbl" style={{ marginTop: 3 }}>May finish higher</div>
                  </div>
                  <div style={{ padding: "9px 10px" }}>
                    <div className="num down" style={{ fontSize: 17, fontWeight: 700 }}>
                      {(o.down * 100).toFixed(1)}%</div>
                    <div className="statlbl" style={{ marginTop: 3 }}>May finish lower</div>
                  </div>
                </div>
                <div className="row mt8" style={{ gap: 12 }}>
                  <span className="meta">±{num(o.em, 0)} expected</span>
                  <span className="meta">IV {c.atmIv}%</span>
                  <span className="meta"><Explain metric="pcr">PCR {c.pcr}</Explain></span>
                  <span className="meta">MP {num(c.maxPain, 0)}</span>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="card mt16 reveal" style={{ background: "var(--raised)" }}>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 22 }}>
            <div className="min0">
              <div className="label mb8">These are risk-neutral, not forecasts</div>
              <p className="sub" style={{ fontSize: 13 }}>
                The percentages come from option prices, which embed the premium investors
                demand for bearing risk. The distribution is tilted relative to what the
                underlying has historically done. At the money the odds sit near even by
                construction — the information is in the <em>width</em>, not the tilt.
              </p>
            </div>
            <div className="min0">
              <div className="label mb8">If Nifty moves, these move with it</div>
              <div className="scrollx">
                <table>
                  <tbody>
                    {INDEX_LINKS.pairs.slice(0, 3).map((p) => (
                      <tr key={p.a + p.b}>
                        <td style={{ fontSize: 12.5 }}>{p.a} ↔ {p.b}</td>
                        <td className="num">ρ {p.corr.toFixed(2)}</td>
                        <td className="num">β {p.beta.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Link href="/india/correlation" className="sub mt8"
                style={{ color: "var(--accent)", fontWeight: 600, display: "block" }}>
                Why divergence is composition, not a signal →</Link>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ══ OUTLOOK BAND ══════════════════════════════════════════════ */}
      <section className="band reveal" style={{ paddingBlock: 38 }}>
        <div className="wrap">
          <div className="grid" style={{ gridTemplateColumns: "minmax(0,1fr) minmax(0,1.25fr)", gap: 40 }}>
            <div className="min0">
              <div className="kicker accent">Outlook · possibility trees</div>
              <h2 style={{ fontSize: "clamp(25px,3.4vw,38px)", marginTop: 10, maxWidth: 520 }}>
                If it goes up it may break down. If it breaks down it may go up.
              </h2>
              <p className="sub mt12" style={{ maxWidth: 500 }}>
                Markets do not have one outcome, they have a tree of them. Every branch carries
                a probability and the basis for it — the option market&apos;s own pricing, or
                the historical frequency in our corpus.
              </p>
              <ul className="arrowlist mt16">
                <li>Each probability is conditional — multiply down the path</li>
                <li>The modal Nifty path is 46%: less likely than not</li>
                <li>The false-breakout branch is frequently the modal one</li>
                <li>No number here was generated by a language model</li>
              </ul>
              <Link href="/outlook" className="chip mt16" style={{ padding: "9px 15px", fontSize: 13 }}>
                All possibility trees →</Link>
            </div>
            <div className="min0">
              <div className="label mb12">{TREES[0].name} · {TREES[0].horizon}</div>
              <Tree nodes={TREES[0].root.map((r) => ({ ...r, children: undefined }))} />
              <p className="meta mt12">{TREES[0].modal}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ══ SCENARIOS BAND ════════════════════════════════════════════ */}
      <section className="band reveal" style={{ paddingBlock: 38 }}>
        <div className="wrap">
          <div className="grid" style={{ gridTemplateColumns: "minmax(0,1.25fr) minmax(0,1fr)", gap: 40 }}>
            <div className="min0">
              <div className="kicker accent">Scenarios · if this, then what</div>
              <h2 style={{ fontSize: "clamp(25px,3.4vw,38px)", marginTop: 10, maxWidth: 560 }}>
                Crude falls and India rises. Wall Street crashes and India does not hold up.
              </h2>
              <p className="sub mt12" style={{ maxWidth: 530 }}>
                Ten conditions traders act on every week, tested against what actually followed.
                Four of the most repeated beliefs come out backwards — and those are the rows
                that cost money.
              </p>
              <div className="scrollx mt20">
                <table>
                  <thead><tr><th>Condition</th><th>Common belief</th><th style={{ textAlign: "right" }}>Verdict</th></tr></thead>
                  <tbody>
                    {SCENARIOS.slice(0, 6).map((sc) => (
                      <tr key={sc.slug}>
                        <td style={{ color: "var(--on-ink)" }}>
                          <Link href={`/scenarios/${sc.slug}`}>{sc.triggerShort}</Link></td>
                        <td style={{ color: "var(--on-ink-faint)", fontFamily: "var(--sans)",
                          fontSize: 11.5, whiteSpace: "normal" }}>
                          {sc.belief.length > 54 ? sc.belief.slice(0, 52) + "…" : sc.belief}</td>
                        <td style={{ textAlign: "right" }}>
                          <span className={`ev ${VERDICT_META[sc.verdict].tone}`}>
                            {VERDICT_META[sc.verdict].label}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Link href="/scenarios" className="chip mt20" style={{ padding: "9px 15px", fontSize: 13 }}>
                All ten scenarios →</Link>
            </div>
            <div className="min0">
              <MoodGauge />
              <div className="mt16"><MoodHistory /></div>
              <p className="meta mt8">21 sessions · above the line is risk-on</p>
              <hr className="mt16 mb12" />
              <div className="label mb8">Active right now</div>
              <ul className="arrowlist">
                {SCENARIOS.filter((x) => x.live).map((x) => (
                  <li key={x.slug}>{x.triggerShort} — {VERDICT_META[x.verdict].label.toLowerCase()}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ══ INDIA DEEP DIVES ══════════════════════════════════════════ */}
      <section className="reveal">
        <SectionHead title="Inside the Indian market" href="/india" more="India hub" />
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(238px,1fr))", gap: 14 }}>
          {[
            { href: "/india/index-flows", t: "Index flows & MSCI",
              d: `India's EM weight moved ${MSCI.weight.from}% → ${MSCI.weight.to}% in the ${MSCI.review}, an estimated ${MSCI.netFlow} of forced passive flow. The only genuinely price-insensitive buying in public markets.`,
              s: MSCI.netFlow },
            { href: "/india/microstructure", t: "Microstructure & surveillance",
              d: "F&O ban at 95% of MWPL, ASM margins up to 100%, GSM call auctions, concentration margin. The rules that decide what you can actually trade.",
              s: "4 frameworks" },
            { href: "/heatmap", t: "Market heatmap",
              d: "Sized by index weight, coloured by move — so you see what moved the index, not merely what moved the most.",
              s: `${HEATMAP.length} sectors` },
            { href: "/economy", t: "Economy dashboard",
              d: "Thirty indicators across growth, prices, the external account, fiscal, money and the household series that quietly reshaped this market.",
              s: "30 indicators" },
            { href: "/india/ipo", t: "IPO tracker",
              d: "Mainboard and SME, with the three subscription categories separated — only one of them cannot be withdrawn.",
              s: "6 in window" },
            { href: "/india/valuation", t: "Valuation",
              d: "Every metric against its own ten-year distribution, with the honest note that none of it has short-horizon predictive power.",
              s: "8 metrics" },
          ].map((c, i) => (
            <Link key={c.href} href={c.href} className={`card tile reveal ${i % 3 === 1 ? "d1" : i % 3 === 2 ? "d2" : ""}`}>
              <span className="kicker">{c.s}</span>
              <h3 style={{ fontSize: 17, marginTop: 7 }}>{c.t}</h3>
              <p className="tiledek" style={{ fontSize: 13 }}>{c.d}</p>
              <span className="sub mt8" style={{ color: "var(--accent)", fontWeight: 600, display: "block" }}>
                Open →</span>
            </Link>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* ══ PRO BAND ══════════════════════════════════════════════════ */}
      <section className="band reveal" style={{ paddingBlock: 38 }}>
        <div className="wrap">
          <div className="grid" style={{ gridTemplateColumns: "minmax(0,1.15fr) minmax(0,1fr)", gap: 40 }}>
            <div className="min0">
              <span className="protag">★ Newze Pro</span>
              <h2 style={{ fontSize: "clamp(26px,3.6vw,40px)", marginTop: 12, maxWidth: 560 }}>
                The free tier tells you what happened. Pro tells you how often that has mattered.
              </h2>
              <p className="sub mt12" style={{ maxWidth: 540 }}>
                Real-time Indian analytics, the full derivatives stack, every historical analog,
                alert thresholds you set yourself, and the research workbenches behind the
                factor, pattern and seasonality pages.
              </p>
              <div className="row mt20" style={{ gap: 10 }}>
                <Link href="/pricing" className="probtn" style={{ padding: "10px 18px", fontSize: 13.5 }}>
                  <span className="star">★</span> Start 14-day trial — ₹249/mo
                </Link>
                <Link href="/pro" className="chip" style={{ padding: "9px 15px", fontSize: 12.5 }}>
                  Everything in Pro →
                </Link>
              </div>
              <p className="meta mt12">No card for the trial. Cancel in two clicks, any time.</p>
            </div>
            <div className="min0">
              <div className="label mb12">What Pro unlocks</div>
              <ul className="arrowlist">
                {["Real-time India analytics — OI, option chain, participant positioning",
                  "Full possibility trees with joint path probability and cost-adjusted expectancy",
                  "Every analog behind every estimate, with the dates clickable",
                  "Option strategy analytics — payoff, greeks, probability of profit, margin",
                  "Index-flow candidates before the MSCI announcement",
                  "Surveillance tracker — ASM, GSM, ban list, margin changes the evening they circulate",
                  "Decision journal scored on the same basis we score ourselves",
                  "Alert rules and Radar thresholds you set yourself",
                  "Seasonality and factor workbenches with corrected significance",
                  "CSV and PDF export, point-in-time queries, scheduled reports"].map((x) => <li key={x}>{x}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ══ CORPUS ════════════════════════════════════════════════════ */}
      <section className="card reveal" style={{ background: "var(--raised)" }}>
        <div className="grid g4">
          <Stat big={stats.corpusEvents.toLocaleString("en-IN")} label="Events in the corpus" />
          <Stat big={`${stats.corpusYears} years`} label="Of scored history" />
          <Stat big={stats.sourcesLive.toString()} label="Sources live now" />
          <Stat big={stats.settledToday.toString()} label="Impacts settled today" />
        </div>
        <p className="sub mt16" style={{ maxWidth: 780 }}>
          Every event we ingest is joined to what prices actually did afterwards. That record is
          what the estimates are drawn from, and it is why every number on this site carries a
          sample size.{" "}
          <Link href="/methodology" style={{ color: "var(--accent)", fontWeight: 600 }}>How it works →</Link>
        </p>
      </section>
    </div>
  );
}
