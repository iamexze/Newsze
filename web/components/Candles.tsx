import type { Candle } from "@/lib/factors";

/** Candlestick diagram drawn from [open, high, low, close] on a 0–100 scale.
 *  No charting library: these are eight shapes, and hand-drawing them keeps the
 *  colour semantics consistent with every other direction cue on the site. */
export default function Candles({ candles, w = 190, h = 118, label }:
  { candles: Candle[]; w?: number; h?: number; label?: string }) {
  const n = candles.length;
  const slot = w / n;
  const bodyW = Math.min(26, slot * 0.52);
  const y = (v: number) => h - 10 - (v / 100) * (h - 24);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", maxWidth: w, height: "auto" }}
      role="img" aria-label={label ?? `${n}-candle pattern diagram`}>
      {candles.map(([o, hi, lo, c], i) => {
        const cx = slot * i + slot / 2;
        const up = c >= o;
        const col = up ? "var(--up)" : "var(--down)";
        const top = y(Math.max(o, c));
        const bot = y(Math.min(o, c));
        const bh = Math.max(2, bot - top);
        return (
          <g key={i}>
            <line x1={cx} y1={y(hi)} x2={cx} y2={y(lo)} stroke={col} strokeWidth="1.6" />
            <rect x={cx - bodyW / 2} y={top} width={bodyW} height={bh} rx="1.5"
              fill={up ? col : col} opacity={up ? .92 : .92} />
            {up && <rect x={cx - bodyW / 2} y={top} width={bodyW} height={bh} rx="1.5"
              fill="var(--bg)" opacity=".55" />}
            <rect x={cx - bodyW / 2} y={top} width={bodyW} height={bh} rx="1.5"
              fill="none" stroke={col} strokeWidth="1.4" />
          </g>
        );
      })}
    </svg>
  );
}
