import Link from "next/link";
import { IPOS, IPO_NOTES } from "@/lib/india";
import { SectionHead, Notice } from "@/components/Bits";
import ProGate from "@/components/Pro";

export const metadata = { title: "IPO tracker" };

export default function Ipo() {
  const open = IPOS.filter((i) => i.status === "open");
  const upcoming = IPOS.filter((i) => i.status === "upcoming");
  const closed = IPOS.filter((i) => i.status === "closed");

  return (
    <>
      <section className="band" style={{ paddingBlock: "42px 36px" }}>
        <div className="wrap">
          <div className="kicker accent">Primary market · mainboard &amp; SME</div>
          <h1 className="reveal" style={{ fontSize: "clamp(30px,4.8vw,52px)", marginTop: 10, maxWidth: 940 }}>
            Subscription numbers describe funding, not conviction
          </h1>
          <p className="sub reveal d1" style={{ fontSize: 16.5, maxWidth: 760, marginTop: 14, lineHeight: 1.55 }}>
            A sixty-times non-institutional book and a three-times institutional book are two
            completely different signals sitting in the same headline. We separate the three
            categories, because only one of them cannot be withdrawn.
          </p>
          <div className="grid g4 mt32" style={{ gap: 20 }}>
            <div className="reveal"><div className="figure lg">{open.length}</div><div className="statlbl">Open now</div></div>
            <div className="reveal d1"><div className="figure lg">{upcoming.length}</div><div className="statlbl">Upcoming</div></div>
            <div className="reveal d2"><div className="figure lg">{IPOS.filter(i=>i.board==="SME").length}</div>
              <div className="statlbl">SME issues in the window</div></div>
            <div className="reveal d3"><div className="figure lg">0</div>
              <div className="statlbl">Grey market premiums published — it is an unregulated market</div></div>
          </div>
        </div>
      </section>

      <div className="wrap" style={{ paddingTop: 28 }}>
        <div className="breadcrumb"><Link href="/">Today</Link> / <Link href="/india">India</Link> / IPO</div>

        {[["Open now", open], ["Upcoming", upcoming], ["Recently closed", closed]].map(([t, list]) => {
          const rows = list as typeof IPOS;
          if (!rows.length) return null;
          return (
            <section key={t as string} className="mb24 reveal">
              <SectionHead title={t as string} />
              <div className="card pad0">
                <div className="scrollx">
                  <table>
                    <thead><tr>
                      <th style={{ paddingLeft: 16 }}>Issue</th><th>Board</th><th>Size</th><th>Band</th>
                      <th>Window</th><th>QIB</th><th>NII</th><th>Retail</th>
                      <th style={{ paddingRight: 16 }}>Total</th>
                    </tr></thead>
                    <tbody>
                      {rows.map((i) => (
                        <tr key={i.name} className="hoverable">
                          <td style={{ paddingLeft: 16 }}>{i.name}</td>
                          <td><span className={`chip ${i.board === "SME" ? "w" : ""}`}>{i.board}</span></td>
                          <td className="num">{i.size}</td>
                          <td className="num">{i.band}</td>
                          <td className="num" style={{ fontSize: 11.5 }}>{i.opens}–{i.closes}</td>
                          <td className="num" style={{ fontWeight: 600,
                            color: i.qib > 10 ? "var(--up)" : undefined }}>
                            {i.qib ? `${i.qib}×` : "—"}</td>
                          <td className="num">{i.nii ? `${i.nii}×` : "—"}</td>
                          <td className="num">{i.retail ? `${i.retail}×` : "—"}</td>
                          <td className="num" style={{ paddingRight: 16, fontWeight: 600 }}>
                            {i.total ? `${i.total}×` : "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          );
        })}

        <SectionHead title="How to read a book" />
        <div className="grid g2 mb32">
          {IPO_NOTES.map((n, i) => (
            <div key={n.h} className={`card reveal ${i % 2 ? "d1" : ""}`}>
              <h3 style={{ fontSize: 18 }}>{n.h}</h3>
              <p className="sub mt8">{n.p}</p>
            </div>
          ))}
        </div>

        <SectionHead title="Listing-day analytics" />
        <div className="mb32">
          <ProGate title="What happened to issues that looked like this one"
            what={["Listing-day return distribution conditioned on QIB subscription, board and size",
              "Anchor book composition and lock-in expiry calendar",
              "Six-month post-listing performance by subscription bucket",
              "Alerts on anchor allocation disclosures and lock-in expiries",
              "SME and mainboard treated as separate populations, because they are"]}>
            <table>
              <thead><tr><th>QIB bucket</th><th>n</th><th>Median listing gain</th>
                <th>Positive</th><th>Median 6m</th></tr></thead>
              <tbody>
                {[["<2×",48,-2.1,34,-11.4],["2–5×",62,4.8,58,-3.2],["5–15×",71,11.2,69,2.8],
                  ["15–40×",44,22.6,82,9.1],[">40×",29,38.4,90,14.7]].map((r) => (
                  <tr key={r[0] as string}>
                    <td>{r[0]}</td><td className="num">{r[1]}</td>
                    <td className={`num ${(r[2] as number) >= 0 ? "up" : "down"}`}>{r[2]}%</td>
                    <td className="num">{r[3]}%</td>
                    <td className={`num ${(r[4] as number) >= 0 ? "up" : "down"}`}>{r[4]}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ProGate>
        </div>

        <div className="mb32">
          <Notice>
            We do not publish grey market premium. It refers to an unofficial, unregulated
            market with no reporting obligations and no verifiable prices. Anyone quoting it to
            you as a price signal is quoting a market that cannot be checked.
          </Notice>
        </div>
      </div>
    </>
  );
}
