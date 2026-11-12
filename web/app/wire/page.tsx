import Link from "next/link";
import { STORIES, SECTIONS, byId, STRIP, chg } from "@/lib/data";
import { ago } from "@/lib/format";
import { Tier, SectionHead, QuoteRow } from "@/components/Bits";

export const metadata = { title: "Live wire" };

export default async function Wire({ searchParams }:
  { searchParams?: Promise<Record<string, string | undefined>> }) {
  const sp = (await searchParams) ?? {};
  const section = sp.section;
  const region = sp.region;
  let list = [...STORIES].sort((a, b) => a.minsAgo - b.minsAgo);
  if (section) list = list.filter((s) => s.section === section);
  if (region) list = list.filter((s) => s.region === region);

  return (
    <div className="wrap" style={{ paddingTop: 18 }}>
      <div className="breadcrumb"><Link href="/">Today</Link> / Live wire</div>
      <div className="between mb16">
        <div>
          <div className="kicker">Updating continuously</div>
          <h1 style={{ fontSize: 30, marginTop: 4 }}>Live wire</h1>
          <p className="sub">One card per story, not forty copies of the same article.
            Source tier is shown on every item; tier-4 items never carry an impact estimate.</p>
        </div>
      </div>

      <div className="cols3">
        {/* filters */}
        <aside className="railL stack" style={{ gap: 16 }}>
          <div className="card">
            <div className="cardhead"><h2>Section</h2></div>
            <div className="stack" style={{ gap: 2 }}>
              <Link href="/wire" className="sub" style={{ fontWeight: !section ? 700 : 400,
                color: !section ? "var(--accent)" : undefined, padding: "3px 0" }}>All sections</Link>
              {SECTIONS.map((s) => (
                <Link key={s} href={`/wire?section=${encodeURIComponent(s)}`} className="sub"
                  style={{ fontWeight: section === s ? 700 : 400,
                    color: section === s ? "var(--accent)" : undefined, padding: "3px 0" }}>{s}</Link>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="cardhead"><h2>Region</h2></div>
            <div className="stack" style={{ gap: 2 }}>
              {["IN","US","EU","ASIA","GLOBAL"].map((r) => (
                <Link key={r} href={`/wire?region=${r}`} className="sub"
                  style={{ fontWeight: region === r ? 700 : 400,
                    color: region === r ? "var(--accent)" : undefined, padding: "3px 0" }}>{r}</Link>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="cardhead"><h2>Source tiers</h2></div>
            {[["t0","T0 Exchange / primary"],["t1","T1 Wire"],["t2","T2 Major outlet"],
              ["t3","T3 Aggregator"],["t4","T4 Social — unverified"]].map(([c, l]) => (
              <div key={c} className="row" style={{ gap: 8, padding: "3px 0" }}>
                <span className={`dot ${c}`} /><span className="sub">{l}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* feed */}
        <div className="min0">
          <div className="card pad0">
            {list.map((s) => {
              const top = s.impacts.find((i) => i.expected !== null);
              const mag = top ? Math.min(1, Math.abs(top.expected!) / 2) : 0;
              return (
                <Link key={s.id} href={`/story/${s.slug}`}
                  style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 14,
                    padding: "13px 16px", borderBottom: "1px solid var(--border)", alignItems: "start" }}>
                  <div className="min0">
                    <div className="storyline">
                      <Tier t={s.tier} />
                      <span>{s.outlets[0]}{s.sourceCount > 1 ? ` +${s.sourceCount - 1}` : ""}</span>
                      <span>·</span><span>{ago(s.minsAgo)}</span>
                      <span className="chip">{s.type}</span>
                      {s.certainty === "rumoured" && <span className="chip r">Unverified</span>}
                    </div>
                    <h3 style={{ fontSize: 16, margin: "6px 0 4px", lineHeight: 1.3 }}>{s.headline}</h3>
                    <p className="sub" style={{ fontSize: 13 }}>{s.dek}</p>
                    {top ? (
                      <div className="storyline mt8">
                        <span className={top.expected! > 0 ? "up" : "down"} style={{ fontWeight: 600 }}>
                          {byId(top.instrument)?.sym} {top.expected! > 0 ? "+" : ""}{top.expected!.toFixed(2)}%
                        </span>
                        <span>{top.horizon}</span><span>·</span>
                        <span>{top.n} analogs</span><span>·</span>
                        <span>conf {top.conf?.toFixed(2)}</span>
                      </div>
                    ) : (
                      <div className="storyline mt8"><span className="warnc">no impact published</span></div>
                    )}
                  </div>
                  <div style={{ width: 54, flex: "0 0 auto", paddingTop: 20 }}>
                    <div className="bar" style={{ height: 4 }}>
                      <i style={{ width: `${mag * 100}%`,
                        background: !top ? "var(--border-strong)"
                          : top.expected! > 0 ? "var(--up)" : "var(--down)" }} />
                    </div>
                    <div className="meta" style={{ textAlign: "right", marginTop: 4, fontSize: 9.5 }}>impact</div>
                  </div>
                </Link>
              );
            })}
            {!list.length && <div style={{ padding: 24 }} className="sub">No stories match that filter.</div>}
          </div>
        </div>

        {/* rail */}
        <aside className="railR stack" style={{ gap: 16 }}>
          <div className="card">
            <div className="cardhead"><h2>Markets</h2></div>
            {STRIP.slice(0, 8).map((id) => <QuoteRow key={id} id={id} />)}
          </div>
          <div className="card">
            <div className="cardhead"><h2>How this feed works</h2></div>
            <p className="sub">
              Stories arrive from wires, exchange filings, regulators and company releases.
              Items reporting the same event are clustered into one card, so forty articles
              about one Fed decision appear once, with all forty sources listed on the story
              page.
            </p>
            <p className="sub mt8">
              The impact bar on the right of each row is the magnitude of the largest
              published estimate for that story. A grey bar means no estimate was published —
              either the source tier forbids it or there was not enough history.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
