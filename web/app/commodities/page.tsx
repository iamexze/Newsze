import Link from "next/link";
import { byId, chg, STORIES } from "@/lib/data";
import { num } from "@/lib/format";
import { SectionHead, Delta, Spark, Stale, Notice } from "@/components/Bits";
import StoryTile from "@/components/StoryTile";
import ProGate from "@/components/Pro";
import T from "@/components/T";

export const metadata = {
  title: "Commodities",
  description: "MCX and global commodities — contracts, trading hours, and why the late-evening session changes the risk profile for an equity trader.",
};

const SESSIONS = [
  { seg: "Metals & energy", eg: "Gold, silver, copper, aluminium, crude oil, natural gas",
    open: "09:00", close: "23:30", winter: "23:55",
    note: "Closing time shifts with US daylight saving so the overlap with American hours is preserved." },
  { seg: "Select agri", eg: "Cotton, cotton oil, kapas", open: "09:00", close: "21:00", winter: "21:00",
    note: "" },
  { seg: "Other agri", eg: "Most other agricultural contracts", open: "09:00", close: "17:00", winter: "17:00",
    note: "" },
];

const SIZES = [
  { c: "Gold", variants: ["Gold (full)", "Gold M", "Gold Ten", "Gold Guinea", "Gold Petal"],
    note: "Five contract sizes, from institutional down to a retail-scale petal contract." },
  { c: "Silver", variants: ["Silver", "Silver M", "Silver Micro"], note: "Three sizes." },
  { c: "Crude oil", variants: ["Crude Oil", "Crude Oil Mini"], note: "Mini contracts lower the capital threshold substantially." },
  { c: "Natural gas", variants: ["Natural Gas", "Natural Gas Mini"], note: "" },
];

export default function Commodities() {
  const ids = ["CMD:BRENT","CMD:XAU","CMD:XAG","CMD:HG"];
  const stories = STORIES.filter((s) => s.section === "Commodities");
  return (
    <>
      <section className="band" style={{ paddingBlock: "44px 38px" }}>
        <div className="wrap">
          <div className="kicker accent">Commodities · MCX &amp; global</div>
          <h1 className="reveal" style={{ fontSize: "clamp(31px,5vw,56px)", marginTop: 10, maxWidth: 980 }}>
            <T en="A commodity position stays live after the equity market closes"
               hi="इक्विटी बाज़ार बंद होने के बाद भी कमोडिटी पोजीशन चालू रहती है" />
          </h1>
          <p className="sub reveal d1" style={{ fontSize: 17, maxWidth: 790, marginTop: 14, lineHeight: 1.55 }}>
            Indian non-agricultural commodity contracts trade until late evening, shifting with
            US daylight saving to preserve the overlap with American hours. For a trader used to
            a market that closes at 15:30 and absorbs overnight news as a gap, that changes the
            risk profile completely.
          </p>
          <div className="grid g4 mt32" style={{ gap: 20 }}>
            <div className="reveal"><div className="figure lg">50+</div>
              <div className="statlbl">Commodities listed on MCX</div></div>
            <div className="reveal d1"><div className="figure lg">23:30</div>
              <div className="statlbl">Non-agri close, IST · 23:55 in winter</div></div>
            <div className="reveal d2"><div className="figure lg">5</div>
              <div className="statlbl">Gold contract sizes, full down to petal</div></div>
            <div className="reveal d3"><div className="figure lg">≈88%</div>
              <div className="statlbl">Of India&apos;s crude, imported</div></div>
          </div>
        </div>
      </section>

      <div className="wrap" style={{ paddingTop: 28 }}>
        <div className="breadcrumb"><Link href="/">Today</Link> / Commodities</div>

        <div className="grid mb32" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(214px,1fr))", gap: 14 }}>
          {ids.map((id) => {
            const i = byId(id)!; const c = chg(i);
            return (
              <Link key={id} href={`/ticker/${encodeURIComponent(id)}`} className="card tile reveal">
                <div className="between mb8"><span className="label">{i.sym}</span><Stale l={i.latency} /></div>
                <div className="num" style={{ fontSize: 21, fontWeight: 600 }}>{num(i.last, 2)}</div>
                <div className="row mt4" style={{ gap: 8 }}><Delta v={c} /><span className="meta">{i.cur}</span></div>
                <div className="mt8"><Spark data={i.hist} w={186} h={30} up={c >= 0} /></div>
              </Link>
            );
          })}
        </div>

        <div className="cols mb32">
          <div className="min0">
            <SectionHead title="Trading sessions" />
            <div className="card pad0 mb24 reveal">
              <div className="scrollx">
                <table>
                  <thead><tr><th style={{ paddingLeft: 16 }}>Segment</th><th>Examples</th>
                    <th>Open</th><th>Close</th><th style={{ paddingRight: 16 }}>Winter close</th></tr></thead>
                  <tbody>
                    {SESSIONS.map((r) => (
                      <tr key={r.seg} className="hoverable">
                        <td style={{ paddingLeft: 16 }}>{r.seg}</td>
                        <td style={{ fontFamily: "var(--sans)", fontSize: 11.5, color: "var(--muted)",
                          whiteSpace: "normal", textAlign: "left" }}>{r.eg}</td>
                        <td className="num">{r.open}</td>
                        <td className="num">{r.close}</td>
                        <td className="num" style={{ paddingRight: 16 }}>{r.winter}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)" }}>
                <p className="meta">
                  All times IST. Published guides differ on some session details — one lists a
                  split morning and evening session for gold and silver that contradicts the
                  others. Confirm against the exchange before relying on a specific time.
                </p>
              </div>
            </div>

            <SectionHead title="Contract sizes" />
            <div className="grid g2 mb24">
              {SIZES.map((s, i) => (
                <div key={s.c} className={`card reveal ${i % 2 ? "d1" : ""}`}>
                  <h3 style={{ fontSize: 18 }}>{s.c}</h3>
                  <div className="row mt8" style={{ gap: 6 }}>
                    {s.variants.map((v) => <span key={v} className="chip">{v}</span>)}
                  </div>
                  {s.note && <p className="sub mt8" style={{ fontSize: 12.5 }}>{s.note}</p>}
                </div>
              ))}
            </div>

            {stories.length > 0 && (<>
              <SectionHead title="Commodity stories" href="/wire" more="Live wire" />
              <div className="tilegrid mb24">{stories.map((s) => <StoryTile key={s.id} s={s} />)}</div>
            </>)}
          </div>

          <aside className="stack" style={{ gap: 16 }}>
            <div className="ink reveal">
              <div className="label mb12">Why the late session matters</div>
              <p className="sub">
                An equity trader&apos;s overnight risk arrives once, as a gap, at 09:15. A
                commodity position carries through the entire US session — inventory data,
                OPEC headlines, Federal Reserve speakers — with the market open and the price
                moving.
              </p>
              <p className="sub mt12">
                That is an advantage if you intend to be at the screen, and a very different
                kind of exposure if you do not.
              </p>
            </div>

            <div className="card">
              <div className="cardhead"><h2>Related</h2></div>
              {[["/global-factors/crude-oil","Crude oil — the full study"],
                ["/global-factors/gold","Gold — the full study"],
                ["/scenarios/crude-falls","Scenario: crude falls 3%"],
                ["/india/macro","Crude in rupee terms"]].map(([h, l]) => (
                <Link key={h} href={h} className="between"
                  style={{ padding: "9px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{l}</span>
                  <span style={{ color: "var(--accent)" }}>→</span>
                </Link>
              ))}
            </div>
          </aside>
        </div>

        <SectionHead title="MCX analytics" />
        <div className="mb32">
          <ProGate title="Indian commodity microstructure"
            what={["MCX open interest and build-up classification per contract",
              "Crude and gold in rupee terms with the FX decomposition separated",
              "Contango and backwardation across the curve",
              "Inventory-report reaction history, conditioned on positioning",
              "Alerts on OPEC+, EIA and import-duty headlines"]}>
            <table>
              <thead><tr><th>Contract</th><th>Price</th><th>OI</th><th>Build-up</th><th>Basis</th></tr></thead>
              <tbody>
                {[["GOLD Dec","₹78,420","+6.2%","Long build-up","+0.42%"],
                  ["SILVER Dec","₹94,180","+11.4%","Long build-up","+0.61%"],
                  ["CRUDEOIL Nov","₹6,453","−4.1%","Short covering","−0.18%"],
                  ["NATURALGAS Nov","₹248","+18.6%","Short build-up","+1.24%"],
                  ["COPPER Nov","₹842","+2.8%","Long build-up","+0.22%"]].map((r, i) => (
                  <tr key={i}>
                    <td>{r[0]}</td><td className="num">{r[1]}</td>
                    <td className={String(r[2]).startsWith("−") ? "num down" : "num up"}>{r[2]}</td>
                    <td style={{ fontFamily: "var(--sans)", fontSize: 12 }}>{r[3]}</td>
                    <td className="num">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ProGate>
        </div>

        <div className="mb32">
          <Notice>
            Session times and contract specifications come from secondary guides that disagree
            on some details. Confirm against MCX before trading. Prices shown are sample data.
          </Notice>
        </div>
      </div>
    </>
  );
}
