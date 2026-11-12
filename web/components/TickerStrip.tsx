"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Row = { id: string; sym: string; last: number; chg: number; cur: string };

/** Live-ticks the strip so the page feels alive. Movement is simulated —
 *  the underlying dataset is sample data, which the banner states. */
export default function TickerStrip({ rows }: { rows: Row[] }) {
  const [vals, setVals] = useState(rows);
  const [flash, setFlash] = useState<Record<string, number>>({});

  useEffect(() => {
    const id = setInterval(() => {
      setVals((cur) => {
        const i = Math.floor(Math.random() * cur.length);
        const next = [...cur];
        const r = next[i];
        const step = (Math.random() - 0.5) * (r.last * 0.0009);
        const last = +(r.last + step).toFixed(r.last > 500 ? 2 : 3);
        next[i] = { ...r, last, chg: r.chg + (step / r.last) * 100 };
        setFlash((f) => ({ ...f, [r.id]: step > 0 ? 1 : -1 }));
        setTimeout(() => setFlash((f) => ({ ...f, [r.id]: 0 })), 700);
        return next;
      });
    }, 1400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="strip">
      <div className="wrap">
        <div className="stripinner" role="marquee" aria-label="Market snapshot">
          {vals.map((r) => {
            const f = flash[r.id];
            return (
              <Link key={r.id} href={`/ticker/${encodeURIComponent(r.id)}`} className="tk"
                style={{ background: f === 1 ? "var(--up-soft)" : f === -1 ? "var(--down-soft)" : undefined,
                         transition: "background .5s" }}>
                <b>{r.sym}</b>
                <span>{r.last.toLocaleString("en-IN", { minimumFractionDigits: r.last > 500 ? 2 : 3, maximumFractionDigits: r.last > 500 ? 2 : 3 })}</span>
                <span className={r.chg > 0 ? "up" : r.chg < 0 ? "down" : "flat"}>
                  {r.chg > 0 ? "▲" : r.chg < 0 ? "▼" : "▬"}{Math.abs(r.chg).toFixed(2)}%
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
