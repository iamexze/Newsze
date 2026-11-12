import Link from "next/link";
import TickerStrip from "./TickerStrip";
import ThemeToggle from "./ThemeToggle";
import NavLink from "./NavLink";
import LangToggle from "./LangToggle";
import T from "./T";
import { INSTRUMENTS, STRIP, chg, AS_OF_LABEL } from "@/lib/data";

const NAV: { href: string; label: string; hi?: string }[] = [
  { href: "/", label: "Today", hi: "आज" },
  { href: "/india", label: "India", hi: "भारत" },
  { href: "/global-factors", label: "Global factors", hi: "वैश्विक कारक" },
  { href: "/outlook", label: "Outlook", hi: "आउटलुक" },
  { href: "/bridge", label: "Overnight Bridge", hi: "ओवरनाइट ब्रिज" },
  { href: "/wire", label: "Live wire", hi: "लाइव वायर" },
  { href: "/options", label: "Options", hi: "ऑप्शन" },
  { href: "/india/derivatives", label: "Derivatives", hi: "डेरिवेटिव" },
  { href: "/scenarios", label: "Scenarios", hi: "परिदृश्य" },
  { href: "/heatmap", label: "Heatmap", hi: "हीटमैप" },
  { href: "/sectors", label: "Sectors", hi: "क्षेत्र" },
  { href: "/commodities", label: "Commodities", hi: "कमोडिटी" },
  { href: "/economy", label: "Economy", hi: "अर्थव्यवस्था" },
  { href: "/markets", label: "Markets", hi: "बाज़ार" },
  { href: "/transmission", label: "Transmission", hi: "संचरण" },
  { href: "/patterns", label: "Patterns", hi: "पैटर्न" },
  { href: "/statistics", label: "Statistics", hi: "सांख्यिकी" },
  { href: "/signals", label: "Signals", hi: "संकेत" },
  { href: "/forecasts", label: "Forecasts", hi: "पूर्वानुमान" },
  { href: "/regulations", label: "Regulation", hi: "नियमन" },
  { href: "/screener", label: "Screener", hi: "स्क्रीनर" },
  { href: "/explain", label: "Explained", hi: "समझें" },
  { href: "/learn", label: "Study", hi: "अध्ययन" },
  { href: "/track-record", label: "Track record", hi: "ट्रैक रिकॉर्ड" },
];

export default function Masthead() {
  const rows = STRIP.map((id) => {
    const i = INSTRUMENTS.find((x) => x.id === id)!;
    return { id: i.id, sym: i.sym, last: i.last, chg: chg(i), cur: i.cur };
  });
  return (
    <>
      {/* utility strip */}
      <div className="utility">
        <div className="wrap">
          <span className="live"><i /><T en="NSE open · closes 15:30 IST" hi="NSE खुला · 15:30 IST बंद" /></span>
          <span>{AS_OF_LABEL}</span>
          <span style={{ marginLeft: "auto" }}>
            <Link href="/methodology">Methodology</Link>
          </span>
          <span><Link href="/track-record">Our track record</Link></span>
          <span><Link href="/disclaimer">Sample data</Link></span>
        </div>
      </div>

      <TickerStrip rows={rows} />

      <header className="masthead">
        <div className="wrap">
          <div className="mhtop">
            <Link href="/" className="logo" aria-label="Newze home">
              <span className="dot" />
              <span>Newze</span>
              <sup>BETA</sup>
            </Link>

            <Link href="/search" className="searchbox">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
              </svg>
              <span><T en="Search companies, events, indicators…" hi="कंपनी, घटनाएँ, संकेतक खोजें…" /></span>
            </Link>

            <div className="mhtools">
              <LangToggle />
              <ThemeToggle />
              <Link href="/pricing" className="probtn">
                <span className="star">★</span> <T en="Go Pro" hi="प्रो लें" />
              </Link>
            </div>
          </div>

          <nav className="mhnav" aria-label="Sections">
            {NAV.map((n) => <NavLink key={n.href} href={n.href} label={n.label} hi={n.hi} />)}
          </nav>
        </div>
      </header>
    </>
  );
}
