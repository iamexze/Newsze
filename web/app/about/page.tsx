import Link from "next/link";
import { SectionHead, Stat } from "@/components/Bits";
import { stats, LEDGER } from "@/lib/data";

export const metadata = { title: "About" };

export default function About() {
  return (
    <div className="wrap" style={{ paddingTop: 18 }}>
      <div className="breadcrumb"><Link href="/">Today</Link> / About</div>
      <div style={{ maxWidth: 760 }}>
        <div className="kicker">What this is</div>
        <h1 style={{ fontSize: 38, marginTop: 6, lineHeight: 1.1 }}>
          News tells you what happened. Charts tell you what prices did. Almost nothing tells
          you what this kind of event has historically done to these instruments.
        </h1>
        <div className="article mt24">
          <p>
            That gap is the reason Newze exists. A trader opening six tabs at 07:30 is not short
            of information — they are short of a way to convert the information into a
            consequence. The gap gets filled, at the moment, by people on messaging apps who
            keep no record of being wrong.
          </p>
          <p>
            Newze does three things. It gathers global news and clusters it so you see each
            event once rather than forty times. It converts significant events into measured
            consequences for named instruments, with a confidence band and the historical cases
            the estimate is drawn from. And it keeps a permanent public record of how accurate
            those estimates turn out to be.
          </p>
          <p>
            The third of those is the part nobody else does, and it is the part that matters
            most. A number without a track record is an opinion in a serif font.
          </p>
        </div>
      </div>

      <div className="grid g4 mt32 mb24">
        <Stat big={stats.corpusEvents.toLocaleString("en-IN")} label="Events in the corpus" />
        <Stat big={`${stats.corpusYears} years`} label="Of scored history" />
        <Stat big={LEDGER.overall.n.toLocaleString("en-IN")} label="Published calls scored" />
        <Stat big="2" label="Classes suppressed for poor accuracy" />
      </div>

      <SectionHead title="What we will not do" />
      <div className="grid g3">
        {[
          { h: "No buy, sell or hold", b: "We describe distributions of historical outcomes. We do not tell anyone what to do with their money, and there is no field in our data model where a recommendation could be stored." },
          { h: "No target prices", b: "Blocked at the schema level, the generation level and in review. A price target is a prediction dressed as a fact." },
          { h: "No hiding the misses", b: "There is no mechanism to remove an individual call from the Accuracy Ledger. Only whole event classes can be suppressed, and a suppression is published." },
          { h: "No paid promotion", b: "We do not take money to feature a security. Our revenue is subscriptions, which is the only model whose incentive is being right." },
          { h: "No engagement bait", b: "No infinite scroll, no notification spam, no clickbait headlines. Alerts are capped by default and the cap is yours to set." },
          { h: "No selling your data", b: "Behavioural data is used to improve the product and for nothing else. It is never sold, never shared with brokers, and never used to infer what you hold." },
        ].map((c) => (
          <div key={c.h} className="card">
            <h3 style={{ fontFamily: "var(--serif)", fontSize: 17, marginBottom: 8 }}>{c.h}</h3>
            <p className="sub">{c.b}</p>
          </div>
        ))}
      </div>

      <div className="mt32" style={{ maxWidth: 760 }}>
        <SectionHead title="Where we are" />
        <div className="article">
          <p>
            Newze is in development. This site is a working prototype: the layout, the analytics
            and the editorial model are real, and every figure on it is sample data generated for
            demonstration. Replacing it with licensed market data and live news feeds is the
            next phase of work, and depends on exchange data licensing that is being arranged.
          </p>
          <p>
            Read the <Link href="/methodology" style={{ color: "var(--accent)" }}>methodology</Link>{" "}
            for how the estimates are produced, the{" "}
            <Link href="/editorial-policy" style={{ color: "var(--accent)" }}>editorial policy</Link>{" "}
            for how content is handled, and the{" "}
            <Link href="/track-record" style={{ color: "var(--accent)" }}>Accuracy Ledger</Link>{" "}
            for the record itself.
          </p>
        </div>
      </div>
    </div>
  );
}
