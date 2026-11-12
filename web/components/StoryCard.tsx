import Link from "next/link";
import { Story } from "@/lib/data";
import { ago } from "@/lib/format";
import { Tier } from "./Bits";

export default function StoryCard({ s, size = "md" }: { s: Story; size?: "md" | "sm" }) {
  const top = s.impacts.find((i) => i.expected !== null);
  return (
    <Link href={`/story/${s.slug}`} className={`story ${size === "sm" ? "sm" : ""}`}>
      <div className="storyline">
        <Tier t={s.tier} />
        <span>{s.outlets[0]}{s.sourceCount > 1 ? ` +${s.sourceCount - 1}` : ""}</span>
        <span>·</span><span>{ago(s.minsAgo)}</span>
        <span>·</span><span style={{ color: "var(--accent)" }}>{s.section}</span>
        {s.certainty === "rumoured" && <span className="chip r">Unverified</span>}
      </div>
      <h3>{s.hi ? (<><span data-l="en">{s.headline}</span><span data-l="hi">{s.hi.headline}</span></>) : s.headline}</h3>
      {size === "md" && <p className="dek">
        {s.hi ? (<><span data-l="en">{s.dek}</span><span data-l="hi">{s.hi.dek}</span></>) : s.dek}</p>}
      {top && (
        <div className="storyline" style={{ marginTop: 7 }}>
          <span className={top.expected! > 0 ? "up" : "down"}>
            {top.expected! > 0 ? "▲ +" : "▼ "}{top.expected!.toFixed(2)}%
          </span>
          <span>{top.horizon}</span>
          <span>·</span><span>{top.n} analogs</span>
          {top.conf !== null && <><span>·</span><span>conf {top.conf.toFixed(2)}</span></>}
        </div>
      )}
    </Link>
  );
}
