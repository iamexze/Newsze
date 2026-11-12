import Link from "next/link";
import { DATA_NOTICE } from "@/lib/data";
import { Notice } from "@/components/Bits";

export const metadata = { title: "Disclaimer" };

export default function Disclaimer() {
  return (
    <div className="wrap" style={{ paddingTop: 18, maxWidth: 820 }}>
      <div className="breadcrumb"><Link href="/">Today</Link> / Disclaimer</div>
      <h1 style={{ fontSize: 34 }}>Disclaimer</h1>

      <div className="mt24"><Notice><b>Prototype.</b> {DATA_NOTICE}</Notice></div>

      <div className="article mt24">
        <p>
          Newze publishes market information and statistical analysis of historical market
          behaviour. Nothing on this site is investment advice, a research report, or a
          recommendation to buy, sell or hold any security.
        </p>
        <p>
          Estimates shown on this site are probabilistic descriptions of what has historically
          followed events of a given type. They are derived from a limited sample of past
          occurrences, they may be wrong, and they regularly are. Past market behaviour does not
          predict future results.
        </p>
        <p>
          Market data may be delayed. The latency of every price-bearing figure is displayed
          alongside it. Data may be incomplete, revised by its source, or affected by errors in
          ingestion. Figures described as provisional are subject to revision by the exchanges
          and agencies that publish them.
        </p>
        <p>
          Newze is not a registered investment adviser or research analyst. Readers should
          consult a registered investment adviser before making any investment decision, and
          should not rely on anything published here in place of professional advice
          appropriate to their own circumstances.
        </p>
        <p>
          Content on this site is produced in part by automated systems, including language
          models, operating under human oversight. Errors are corrected publicly in accordance
          with our{" "}
          <Link href="/editorial-policy" style={{ color: "var(--accent)" }}>editorial policy</Link>.
        </p>
        <p>
          Our published accuracy record describes the historical calibration of our estimates.
          It is not a performance claim, does not represent returns achievable by any investor,
          and should not be read as an indication of future accuracy.
        </p>
        <p>
          Third-party news is summarised and linked, not reproduced. Rights in the underlying
          reporting remain with the publishers. Market data is subject to the terms of the
          exchanges and vendors that license it.
        </p>
      </div>
    </div>
  );
}
