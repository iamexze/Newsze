"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Scroll-reveal. Deliberately progressive: the page is COMPLETE AT REST.
 * Elements render visible by default; only once this component confirms JS is
 * running does it add `js-anim` to <html>, which is what hides un-revealed
 * elements. If JS fails, is slow, or the reader prefers reduced motion, they
 * get the whole page immediately instead of a blank screen.
 */
export function MotionRoot() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    document.documentElement.classList.add("js-anim");

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 }
    );
    const scan = () => document.querySelectorAll<HTMLElement>(".reveal:not(.in)")
      .forEach((el) => io.observe(el));
    scan();
    // anything above the fold on load is revealed immediately
    requestAnimationFrame(() => {
      document.querySelectorAll<HTMLElement>(".reveal").forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("in");
      });
    });
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, []);
  return null;
}

/** Thin reading-progress bar. Pure transform, no layout thrash. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        const p = h > 0 ? Math.min(1, window.scrollY / h) : 0;
        if (ref.current) ref.current.style.transform = `scaleX(${p})`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);
  return <div className="progress"><div ref={ref} /></div>;
}

/**
 * Count-up figure. Renders the FINAL value in the server HTML so the number is
 * correct for search engines, screen readers and anyone with JS off; the
 * animation only replays it on first view.
 */
export function CountUp({ value, decimals = 0, prefix = "", suffix = "", duration = 900 }:
  { value: number; decimals?: number; prefix?: string; suffix?: string; duration?: number }) {
  const [v, setV] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => {
      for (const e of es) {
        if (!e.isIntersecting || done.current) continue;
        done.current = true;
        io.disconnect();
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setV(value * eased);
          if (p < 1) requestAnimationFrame(tick);
          else setV(value);
        };
        setV(0);
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref}>
      {prefix}{v.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}
    </span>
  );
}
