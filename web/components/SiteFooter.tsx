import Link from "next/link";
import { DATA_NOTICE, stats } from "@/lib/data";

const COLS = [
  { h: "Markets", links: [["/markets","Global cross-asset"],["/markets/risk","Risk dashboard"],
      ["/markets/regime","Market regime"],["/global/central-banks","Central banks"],
      ["/calendar","Macro calendar"]] },
  { h: "India", links: [["/india","India hub"],["/india/derivatives","Derivatives & OI"],["/options","Option chains"],
      ["/india/correlation","Index relationships"],
      ["/india/flows","FII / DII flows"],["/india/index-flows","Index flows & MSCI"],
      ["/india/microstructure","Microstructure & surveillance"],["/india/macro","Indian macro"],
      ["/india/valuation","Valuation"],["/india/ipo","IPO tracker"],
      ["/economy","Economy dashboard"],["/heatmap","Market heatmap"],["/sectors","Sectors"],["/india/ipo","IPO tracker"],
      ["/regulations","Regulation tracker"]] },
  { h: "Global factors", links: [["/global-factors","All factors"],
      ["/global-factors/crude-oil","Crude oil"],["/global-factors/gold","Gold"],
      ["/global-factors/dollar","The US dollar"],["/global-factors/us-rates","US rates & the Fed"],
      ["/global-factors/china","China"],["/global-factors/crypto","Cryptocurrencies"],
      ["/global-factors/global-equities","Global equities"],
      ["/global-factors/geopolitics","Geopolitics"]] },
  { h: "Analysis", links: [["/outlook","Outlook — possibility trees"],
      ["/scenarios","Scenarios — if this, then what"],
      ["/transmission","Global → India transmission"],
      ["/patterns","Candlestick patterns"],["/statistics","Market statistics"],
      ["/signals","What predicts direction"],["/forecasts","Forecast aggregator"],
      ["/forecasts/scoreboard","Forecaster scoreboard"],["/analogs","Analog engine"],
      ["/narratives","Narrative tracker"]] },
  { h: "Pro & tools", links: [["/pro","Everything in Pro"],["/screener","Screener"],
      ["/alerts","Alerts & Radar"],["/watchlist","Watchlist"],["/commodities","Commodities"],
      ["/pricing","Pricing"],["/search","Search"]] },
  { h: "Study & record", links: [["/explain","Statistics explained"],["/learn","Market study"],["/track-record","Accuracy Ledger"],
      ["/bridge","Overnight Bridge"],["/methodology","Methodology"],["/about","About Newze"],
      ["/editorial-policy","Editorial policy"],["/disclaimer","Disclaimer"],["/pricing","Pricing"]] },
];

export default function SiteFooter() {
  return (
    <footer className="site">
      <div className="wrap">
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 24 }}>
          {COLS.map((c) => (
            <div key={c.h}>
              <h4>{c.h}</h4>
              {c.links.map(([href, label]) => (
                <Link key={href} href={href}>{label}</Link>
              ))}
            </div>
          ))}
        </div>
        <hr className="mt24 mb16" />
        <div className="row" style={{ gap: 18, alignItems: "flex-start" }}>
          <div style={{ flex: "1 1 320px", minWidth: 0 }}>
            <div className="logo" style={{ fontSize: 19 }}>Newze</div>
            <p className="sub mt8" style={{ maxWidth: 520 }}>
              World events, measured market consequences. Every estimate we publish is
              scored against what actually happened and kept on a permanent public record.
            </p>
          </div>
          <div className="meta" style={{ flex: "1 1 260px" }}>
            corpus {stats.corpusEvents.toLocaleString("en-IN")} events · {stats.corpusYears}y history<br />
            {stats.sourcesLive} sources live · {stats.settledToday} impacts settled today
          </div>
        </div>
        <div className="notice mt16">
          <b>⚠ Prototype</b>
          <span>{DATA_NOTICE} Newze publishes information and statistical analysis only.
            Nothing here is investment advice, a research report, or a recommendation to buy
            or sell any security.</span>
        </div>
        <p className="meta mt16">© 2026 Newze · <Link href="/disclaimer">Disclaimer</Link> ·{" "}
          <Link href="/editorial-policy">Editorial policy</Link> ·{" "}
          <Link href="/methodology">Methodology</Link></p>
      </div>
    </footer>
  );
}
