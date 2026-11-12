import type { Metadata } from "next";
import "./globals.css";
import Masthead from "@/components/Masthead";
import SiteFooter from "@/components/SiteFooter";
import { MotionRoot, ScrollProgress } from "@/components/Motion";

export const metadata: Metadata = {
  title: {
    default: "Newze — world events, measured market consequences",
    template: "%s · Newze",
  },
  description:
    "Newze turns world events into measured market consequences — global news, global trading analytics and Indian trading analytics — and publishes its own accuracy while doing it.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Public+Sans:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        {/* Apply the stored theme before paint so there is no flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('newze-theme');
              if(t)document.documentElement.setAttribute('data-theme',t);
              var l=localStorage.getItem('newze-lang');
              if(l)document.documentElement.setAttribute('data-lang',l);}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <a href="#main" className="sr">Skip to content</a>
        <ScrollProgress />
        <MotionRoot />
        <Masthead />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
