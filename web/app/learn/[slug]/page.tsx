import Link from "next/link";
import { notFound } from "next/navigation";
import { LESSONS, lessonBySlug } from "@/lib/research";
import { SectionHead, Notice } from "@/components/Bits";

export function generateStaticParams() {
  return LESSONS.map((l) => ({ slug: l.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const l = lessonBySlug((await params).slug);
  return { title: l?.title ?? "Lesson", description: l?.dek };
}

export default async function Lesson({ params }: { params: Promise<{ slug: string }> }) {
  const l = lessonBySlug((await params).slug);
  if (!l) notFound();
  const others = LESSONS.filter((x) => x.slug !== l.slug).slice(0, 3);

  return (
    <div className="wrap" style={{ paddingTop: 20 }}>
      <div className="breadcrumb">
        <Link href="/">Today</Link> / <Link href="/learn">Market study</Link> / {l.topic}
      </div>

      <div className="cols">
        <article className="min0">
          <div className="row mb12" style={{ gap: 8 }}>
            <span className="chip">{l.topic}</span>
            <span className="chip a">{l.level}</span>
            <span className="meta">{l.minutes} min read</span>
          </div>
          <h1 style={{ fontSize: "clamp(30px,4.6vw,50px)", lineHeight: 1.03 }}>{l.title}</h1>
          <p style={{ fontFamily: "var(--serif)", fontSize: 21, color: "var(--fg-soft)",
            lineHeight: 1.38, marginTop: 12, maxWidth: "62ch" }}>{l.dek}</p>

          <hr className="mt24 mb24" />

          <div className="lesson">
            {l.body.map((b, i) => (
              <div key={i}>
                {b.h && <h3>{b.h}</h3>}
                {b.p && <p>{b.p}</p>}
                {b.list && <ul>{b.list.map((x) => <li key={x}>{x}</li>)}</ul>}
                {b.callout && <div className="callout">{b.callout}</div>}
              </div>
            ))}
          </div>

          <div className="disclaimer">
            This explainer describes mechanisms and published research. It is educational
            material, not investment advice, and nothing in it is a recommendation to take any
            position.
          </div>
        </article>

        <aside className="stack" style={{ gap: 16 }}>
          <div className="ink">
            <div className="label mb12">In short</div>
            <p className="sub">{l.dek}</p>
          </div>
          <div className="card">
            <div className="cardhead"><h2>More study</h2></div>
            {others.map((o) => (
              <Link key={o.slug} href={`/learn/${o.slug}`}
                style={{ display: "block", padding: "11px 0", borderBottom: "1px solid var(--border)" }}>
                <div className="row" style={{ gap: 7 }}>
                  <span className="chip">{o.topic}</span>
                  <span className="meta">{o.minutes} min</span>
                </div>
                <h3 style={{ fontFamily: "var(--serif)", fontSize: 17, marginTop: 5 }}>{o.title}</h3>
              </Link>
            ))}
            <Link href="/learn" className="sub mt12" style={{ color: "var(--accent)", fontWeight: 600 }}>
              All lessons →</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
