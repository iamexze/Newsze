import Link from "next/link";
import { Story } from "@/lib/data";
import { ago } from "@/lib/format";
import { Tier } from "./Bits";
import Thumb from "./Thumb";

/** Card anatomy follows the pattern proven on large news sites: visual, headline,
 *  one-line summary, then a metadata line of timestamp and section. */
export default function StoryTile({ s, size = "md", visual = true }:
  { s: Story; size?: "lg" | "md" | "sm"; visual?: boolean }) {
  const hsize = size === "lg" ? 26 : size === "md" ? 16.5 : 14.5;
  return (
    <Link href={`/story/${s.slug}`} className="tile">
      {visual && <Thumb s={s} h={size === "lg" ? 190 : size === "md" ? 118 : 86} />}
      <h3 style={{ fontSize: hsize, lineHeight: 1.24, marginTop: visual ? 10 : 0 }}>
        {s.hi ? (<><span data-l="en">{s.headline}</span><span data-l="hi">{s.hi.headline}</span></>) : s.headline}
      </h3>
      {size !== "sm" && <p className="tiledek">
        {s.hi ? (<><span data-l="en">{s.dek}</span><span data-l="hi">{s.hi.dek}</span></>) : s.dek}
      </p>}
      <div className="storyline" style={{ marginTop: 7 }}>
        <Tier t={s.tier} />
        <span>{ago(s.minsAgo)}</span>
        <span>|</span>
        <span style={{ color: "var(--accent)", fontWeight: 600 }}>{s.section}</span>
        {s.certainty === "rumoured" && <span className="chip r">Unverified</span>}
      </div>
    </Link>
  );
}
