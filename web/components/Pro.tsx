import Link from "next/link";

/** Subscription marker. Used inline next to anything Pro unlocks. */
export function ProTag({ label = "Pro" }: { label?: string }) {
  return <span className="protag">★ {label}</span>;
}

/**
 * Paywall. Renders the real content blurred behind a gate so the reader can see
 * the shape of what they would get — no fake teaser, no bait. The gate always
 * names exactly what unlocks and links to the track record first, because the
 * record is the argument, not the feature list.
 */
export default function ProGate({
  title, what, children,
}: { title: string; what: string[]; children: React.ReactNode }) {
  return (
    <div className="prolock">
      <div className="blur" aria-hidden="true">{children}</div>
      <div className="gate">
        <div style={{ maxWidth: 430 }}>
          <span className="protag">★ Pro</span>
          <h3 style={{ fontSize: 21, marginTop: 10 }}>{title}</h3>
          <ul style={{ listStyle: "none", margin: "12px 0 0" }}>
            {what.map((w) => (
              <li key={w} className="sub" style={{ fontSize: 13, padding: "4px 0" }}>
                <span style={{ color: "var(--up)", marginRight: 7 }}>✓</span>{w}
              </li>
            ))}
          </ul>
          <div className="row" style={{ gap: 9, justifyContent: "center", marginTop: 16 }}>
            <Link href="/pricing" className="probtn">
              <span className="star">★</span> See Pro — ₹249/mo
            </Link>
            <Link href="/track-record" className="chip" style={{ padding: "8px 13px", fontSize: 12 }}>
              Check our record first →
            </Link>
          </div>
          <p className="meta mt12">14-day trial, no card. Cancel in two clicks.</p>
        </div>
      </div>
    </div>
  );
}
