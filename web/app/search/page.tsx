import Link from "next/link";
import { STORIES, INSTRUMENTS, chg } from "@/lib/data";
import { num, ago } from "@/lib/format";
import { SectionHead, Tier, Delta, Spark } from "@/components/Bits";

export const metadata = { title: "Search" };

export default async function Search({ searchParams }:
  { searchParams?: Promise<Record<string, string | undefined>> }) {
  const q = ((await searchParams)?.q ?? "").trim();
  const ql = q.toLowerCase();
  const stories = q ? STORIES.filter((s) =>
    (s.headline + s.dek + s.type + s.section).toLowerCase().includes(ql)) : [];
  const instruments = q ? INSTRUMENTS.filter((i) =>
    (i.sym + i.name + (i.sector ?? "")).toLowerCase().includes(ql)) : [];

  return (
    <div className="wrap" style={{ paddingTop: 18 }}>
      <div className="breadcrumb"><Link href="/">Today</Link> / Search</div>
      <h1 style={{ fontSize: 30 }}>Search</h1>

      <form action="/search" className="card mt16 mb24" style={{ background: "var(--raised)" }}>
        <div className="row" style={{ gap: 10 }}>
          <input name="q" defaultValue={q} placeholder="Company, index, event type, or a phrase"
            aria-label="Search" autoFocus
            style={{ flex: 1, minWidth: 0, padding: "11px 14px", fontSize: 15,
              fontFamily: "var(--sans)", background: "var(--surface)", color: "var(--fg)",
              border: "1px solid var(--border)", borderRadius: 6 }} />
          <button type="submit" className="cta" style={{ flex: "0 0 auto" }}>Search</button>
        </div>
        <div className="row mt12" style={{ gap: 7 }}>
          <span className="meta">Try:</span>
          {["Fed","HDFC Bank","RATE_DECISION","open interest","CPI","Nifty"].map((t) => (
            <Link key={t} href={`/search?q=${encodeURIComponent(t)}`} className="chip">{t}</Link>
          ))}
        </div>
      </form>

      {!q && (
        <p className="sub">
          Full-text and semantic search runs over every story, event, filing and transcript in
          the corpus. This prototype searches the sample dataset.
        </p>
      )}

      {q && (
        <div className="cols">
          <div className="min0">
            <SectionHead title={`Stories — ${stories.length}`} />
            {stories.length === 0 && <p className="sub">No stories matched &ldquo;{q}&rdquo;.</p>}
            {stories.map((s) => (
              <Link key={s.id} href={`/story/${s.slug}`} className="story">
                <div className="storyline">
                  <Tier t={s.tier} /><span>{s.outlets[0]}</span><span>|</span>
                  <span>{ago(s.minsAgo)}</span><span>|</span>
                  <span style={{ color: "var(--accent)" }}>{s.section}</span>
                </div>
                <h3>{s.headline}</h3>
                <p className="dek">{s.dek}</p>
              </Link>
            ))}
          </div>
          <aside>
            <SectionHead title={`Instruments — ${instruments.length}`} />
            <div className="card pad0">
              {instruments.length === 0 && <p className="sub" style={{ padding: 14 }}>No match.</p>}
              {instruments.map((i) => {
                const c = chg(i);
                return (
                  <Link key={i.id} href={`/ticker/${encodeURIComponent(i.id)}`} className="between"
                    style={{ padding: "10px 14px", borderBottom: "1px solid var(--border)" }}>
                    <div className="min0">
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{i.sym}</div>
                      <div className="meta">{i.name}</div>
                    </div>
                    <Spark data={i.hist} w={56} h={22} up={c >= 0} />
                    <div style={{ textAlign: "right" }}>
                      <div className="num" style={{ fontSize: 12.5 }}>{num(i.last, 0)}</div>
                      <Delta v={c} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
