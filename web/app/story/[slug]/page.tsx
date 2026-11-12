import Link from "next/link";
import { notFound } from "next/navigation";
import { STORIES, storyBySlug, byId, chg } from "@/lib/data";
import { ago, num } from "@/lib/format";
import ImpactCard from "@/components/ImpactCard";
import { Tier, SectionHead, Spark, Delta, Conf, Notice } from "@/components/Bits";

export function generateStaticParams() {
  return STORIES.map((s) => ({ slug: s.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const s = storyBySlug((await params).slug);
  return { title: s?.headline ?? "Story", description: s?.dek };
}

const TIER_NAME = ["Exchange / primary", "Wire", "Major outlet", "Aggregator", "Social — unverified"];

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const s = storyBySlug((await params).slug);
  if (!s) notFound();
  const related = STORIES.filter((x) => x.id !== s.id && (x.section === s.section || x.region === s.region)).slice(0, 5);
  const horizons = Array.from(new Set(s.impacts.map((i) => i.horizon)));
  const maxAnalog = Math.max(1, ...s.analogs.map((a) => Math.abs(a.move)));

  return (
    <div className="wrap" style={{ paddingTop: 18 }}>
      <div className="breadcrumb">
        <Link href="/">Today</Link> / <Link href="/wire">Live wire</Link> /{" "}
        <Link href={`/wire?section=${encodeURIComponent(s.section)}`}>{s.section}</Link>
      </div>

      <div className="cols">
        <article className="min0">
          <div className="row mb12" style={{ gap: 8 }}>
            <span className="chip a">{s.type}{s.subtype ? ` · ${s.subtype}` : ""}</span>
            <span className="chip">{s.region}</span>
            {s.certainty === "rumoured"
              ? <span className="chip r">Unverified — tracked, not estimated</span>
              : <span className="chip up">{s.certainty}</span>}
            {s.surpriseZ !== null && (
              <span className="chip w">surprise z {s.surpriseZ > 0 ? "+" : ""}{s.surpriseZ.toFixed(1)}</span>
            )}
          </div>

          <h1 style={{ fontSize: "clamp(28px,4vw,42px)", lineHeight: 1.12 }}>
            {s.hi ? (<><span data-l="en">{s.headline}</span><span data-l="hi">{s.hi.headline}</span></>) : s.headline}
          </h1>
          <p className="dek" style={{ fontFamily: "var(--serif)", fontSize: 19, color: "var(--fg-soft)",
            marginTop: 12, lineHeight: 1.45 }}>
            {s.hi ? (<><span data-l="en">{s.dek}</span><span data-l="hi">{s.hi.dek}</span></>) : s.dek}</p>

          <div className="row mt16" style={{ gap: 10, paddingBottom: 14, borderBottom: "1px solid var(--border)" }}>
            <Tier t={s.tier} />
            <span className="meta">Tier {s.tier} · {TIER_NAME[s.tier]}</span>
            <span className="meta">·</span>
            <span className="meta">{s.sourceCount} sources</span>
            <span className="meta">·</span>
            <span className="meta">{ago(s.minsAgo)}</span>
            <span className="meta">·</span>
            <span className="meta">novelty {s.novelty.toFixed(2)}</span>
          </div>

          {/* key facts */}
          {s.bullets.length > 0 && (
            <ul className="bullets mt24">
              {s.bullets.map((b, i) => (
                <li key={i}>{b.text}<span>{b.src}</span></li>
              ))}
            </ul>
          )}

          {/* impacts */}
          <div className="mb24">
            <SectionHead title="Expected impact" />
            {horizons.length > 1 && (
              <div className="row mb12" style={{ gap: 6 }}>
                {horizons.map((h) => <span key={h} className="pill">{h}</span>)}
                <span className="meta">all published horizons shown below</span>
              </div>
            )}
            <div className="stack" style={{ gap: 12 }}>
              {horizons.map((h) => <ImpactCard key={h} story={s} horizon={h} />)}
            </div>
          </div>

          {/* analogs */}
          {s.analogs.length > 0 && (
            <div className="mb24">
              <SectionHead title="The historical analogs" />
              <div className="card">
                <p className="sub mb16">
                  These are the past events our estimate is drawn from. The distribution is what
                  the number means; the number alone is not the claim.
                </p>
                <div className="stack" style={{ gap: 7 }}>
                  {s.analogs.map((a) => (
                    <div key={a.date} className="row" style={{ gap: 10 }}>
                      <span className="meta" style={{ width: 92, flex: "0 0 auto" }}>{a.date}</span>
                      <span className="sub" style={{ width: 150, flex: "0 0 auto" }}>{a.label}</span>
                      <span className="wfb" style={{ flex: 1, height: 13 }}>
                        <i style={{
                          [a.move >= 0 ? "left" : "right"]: "50%",
                          width: `${(Math.abs(a.move) / maxAnalog) * 50}%`,
                          background: a.move >= 0 ? "var(--up)" : "var(--down)",
                        } as React.CSSProperties} />
                      </span>
                      <span className={`num ${a.move >= 0 ? "up" : "down"}`}
                        style={{ width: 58, textAlign: "right", flex: "0 0 auto" }}>
                        {a.move > 0 ? "+" : ""}{a.move.toFixed(2)}%
                      </span>
                    </div>
                  ))}
                </div>
                {s.impacts[0]?.regimeConc && s.impacts[0].regimeConc > 0.35 && (
                  <div className="nohist mt16">
                    <span>⚠</span>
                    <span>{Math.round(s.impacts[0].regimeConc * 100)}% of the analogs fall inside a
                      single six-month window. Treat them as correlated observations, not as
                      independent ones — the effective sample is smaller than the count.</span>
                  </div>
                )}
                <Link href="/analogs" className="sub mt12"
                  style={{ color: "var(--accent)", fontWeight: 600, display: "inline-block" }}>
                  Open in the analog engine →
                </Link>
              </div>
            </div>
          )}

          {/* body */}
          <div className="article">
            <SectionHead title="Analysis" />
            {s.body.map((p, i) => <p key={i}>{p}</p>)}
          </div>

          <div className="disclaimer">
            Newze writes its own summary and analysis and links to the original reporting. We do
            not republish source text. Figures are attributed inline. This article contains
            information and statistical analysis only; it is not investment advice, not a
            research report, and not a recommendation to buy or sell any security.
          </div>
        </article>

        {/* rail */}
        <aside className="stack" style={{ gap: 16 }}>
          <div className="card">
            <div className="cardhead"><h2>Event payload</h2><span className="tag">machine-readable</span></div>
            <table>
              <tbody>
                <tr><td>Type</td><td className="num">{s.type}</td></tr>
                {s.subtype && <tr><td>Subtype</td><td className="num">{s.subtype}</td></tr>}
                {s.magnitude && <tr><td>Magnitude</td><td className="num">{s.magnitude}</td></tr>}
                {s.consensus && <tr><td>Consensus</td><td className="num" style={{ whiteSpace: "normal" }}>{s.consensus}</td></tr>}
                {s.surpriseZ !== null && <tr><td>Surprise</td><td className="num">z {s.surpriseZ.toFixed(1)}</td></tr>}
                <tr><td>Novelty</td><td className="num">{s.novelty.toFixed(2)}</td></tr>
                <tr><td>Certainty</td><td className="num">{s.certainty}</td></tr>
                <tr><td>Scope</td><td className="num">{s.region}</td></tr>
              </tbody>
            </table>
          </div>

          <div className="card">
            <div className="cardhead"><h2>Sources</h2><span className="tag">{s.sourceCount} total</span></div>
            <ul className="timeline">
              {s.outlets.map((o, i) => (
                <li key={o}>
                  <div className="row" style={{ gap: 7 }}>
                    <Tier t={i === 0 ? s.tier : (Math.min(4, s.tier + (i > 2 ? 1 : 0)) as 0|1|2|3|4)} />
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{o}</span>
                  </div>
                  <div className="meta">{ago(s.minsAgo + i * 7)} · original ↗</div>
                </li>
              ))}
            </ul>
            <p className="meta mt8">
              Each source links to its own page. We quote at most 200 characters from any single
              source.
            </p>
          </div>

          {related.length > 0 && (
            <div className="card">
              <div className="cardhead"><h2>Related</h2></div>
              {related.map((r) => (
                <Link key={r.id} href={`/story/${r.slug}`} className="story sm" style={{ paddingTop: 10 }}>
                  <div className="storyline"><Tier t={r.tier} /><span>{ago(r.minsAgo)}</span></div>
                  <h3 style={{ fontSize: 14 }}>{r.headline}</h3>
                </Link>
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
