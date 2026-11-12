"use client";
import { useEffect, useState } from "react";

const THEMES = [
  { id: "light", label: "Light", glyph: "☀" },
  { id: "dark", label: "Dark", glyph: "☾" },
  { id: "paper", label: "Paper", glyph: "◐" },
  { id: "terminal", label: "Terminal", glyph: "▣" },
] as const;
type Id = (typeof THEMES)[number]["id"];

export default function ThemeToggle() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<Id | null>(null);

  useEffect(() => {
    try {
      const t = localStorage.getItem("newze-theme") as Id | null;
      if (t && THEMES.some((x) => x.id === t)) setTheme(t);
    } catch { /* private mode */ }
  }, []);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [open]);

  function pick(id: Id) {
    setTheme(id);
    document.documentElement.setAttribute("data-theme", id);
    try { localStorage.setItem("newze-theme", id); } catch {}
    setOpen(false);
  }

  const current = THEMES.find((t) => t.id === theme);
  return (
    <div className="themepick" onClick={(e) => e.stopPropagation()}>
      <button className="ibtn" onClick={() => setOpen((o) => !o)}
        aria-haspopup="true" aria-expanded={open} aria-label="Theme" title="Theme">
        <span style={{ fontSize: 14, lineHeight: 1 }}>{current?.glyph ?? "◑"}</span>
      </button>
      {open && (
        <div className="thememenu" role="menu">
          {THEMES.map((t) => (
            <button key={t.id} role="menuitem" onClick={() => pick(t.id)}
              aria-current={theme === t.id ? "true" : undefined}>
              <span style={{ width: 16, display: "inline-block" }}>{t.glyph}</span>{t.label}
            </button>
          ))}
          <button role="menuitem" onClick={() => {
            setTheme(null);
            document.documentElement.removeAttribute("data-theme");
            try { localStorage.removeItem("newze-theme"); } catch {}
            setOpen(false);
          }}>
            <span style={{ width: 16, display: "inline-block" }}>⌾</span>System
          </button>
        </div>
      )}
    </div>
  );
}
