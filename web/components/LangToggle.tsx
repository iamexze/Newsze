"use client";
import { useEffect, useState } from "react";

export default function LangToggle() {
  const [lang, setLang] = useState<"en" | "hi">("en");
  useEffect(() => {
    try {
      const l = localStorage.getItem("newze-lang");
      if (l === "hi" || l === "en") setLang(l);
    } catch { /* private mode */ }
  }, []);
  function set(l: "en" | "hi") {
    setLang(l);
    document.documentElement.setAttribute("data-lang", l);
    try { localStorage.setItem("newze-lang", l); } catch {}
  }
  return (
    <div className="langtoggle" role="group" aria-label="Language">
      <button onClick={() => set("en")} aria-pressed={lang === "en"} title="English">EN</button>
      <button onClick={() => set("hi")} aria-pressed={lang === "hi"} title="हिंदी">हिं</button>
    </div>
  );
}
