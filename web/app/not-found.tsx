import Link from "next/link";
import { STORIES } from "@/lib/data";
import StoryTile from "@/components/StoryTile";
import { SectionHead } from "@/components/Bits";

export default function NotFound() {
  return (
    <div className="wrap" style={{ paddingTop: 40 }}>
      <div style={{ maxWidth: 620 }}>
        <div className="kicker">404</div>
        <h1 style={{ fontSize: 36, marginTop: 6 }}>That page isn&apos;t here</h1>
        <p className="sub mt12" style={{ fontSize: 15 }}>
          The link may be old, or the story may have been merged into another one — we cluster
          stories about the same event, so a URL can fold into its parent.
        </p>
        <div className="row mt16" style={{ gap: 8 }}>
          <Link href="/" className="cta">Today</Link>
          <Link href="/wire" className="chip" style={{ padding: "8px 14px" }}>Live wire</Link>
          <Link href="/search" className="chip" style={{ padding: "8px 14px" }}>Search</Link>
        </div>
      </div>
      <div className="mt32">
        <SectionHead title="Latest" href="/wire" more="Live wire" />
        <div className="tilegrid four">
          {[...STORIES].sort((a, b) => a.minsAgo - b.minsAgo).slice(0, 4)
            .map((s) => <StoryTile key={s.id} s={s} />)}
        </div>
      </div>
    </div>
  );
}
