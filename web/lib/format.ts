/** Formatting helpers. Indian number conventions are the default. */

export const inr = (n: number, dp = 2) =>
  "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: dp, maximumFractionDigits: dp });

/** 1,23,45,678 → "1.23 cr" ; Indian grouping throughout the site. */
export function crore(n: number, dp = 0) {
  const a = Math.abs(n);
  if (a >= 1e7) return (n / 1e7).toFixed(dp || 2) + " cr";
  if (a >= 1e5) return (n / 1e5).toFixed(dp || 2) + " L";
  if (a >= 1e3) return (n / 1e3).toFixed(dp || 1) + "k";
  return n.toFixed(dp);
}

export const num = (n: number, dp = 2) =>
  n.toLocaleString("en-IN", { minimumFractionDigits: dp, maximumFractionDigits: dp });

export const pct = (n: number, dp = 2) => (n >= 0 ? "+" : "") + n.toFixed(dp) + "%";

export const signed = (n: number, dp = 0) => (n >= 0 ? "+" : "") + n.toFixed(dp);

export const dir = (n: number) => (n > 0 ? "up" : n < 0 ? "down" : "flat");

export const arrow = (n: number) => (n > 0 ? "▲" : n < 0 ? "▼" : "▬");

/** Relative time under an hour, absolute after. Dual-coded IST where it matters. */
export function ago(minutes: number) {
  if (minutes < 1) return "now";
  if (minutes < 60) return `${Math.round(minutes)}m ago`;
  if (minutes < 1440) return `${Math.round(minutes / 60)}h ago`;
  return `${Math.round(minutes / 1440)}d ago`;
}

export const IST = "Asia/Kolkata";
