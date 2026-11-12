import type { ReactNode } from "react";

/**
 * Bilingual text.
 *
 * Both languages are rendered into the HTML and one is hidden with CSS, keyed
 * off `data-lang` on <html>. That choice matters architecturally: it keeps every
 * page a server component (no client-side translation state, no re-render, no
 * hydration flash) and makes switching language instant. The cost is a little
 * duplicated markup, which is cheap for interface chrome and headlines.
 *
 * Prose is NOT translated this way. Per the content design rules we translate
 * the structured payload, never the generated prose — a machine-translated
 * analysis would lose the citation and advice-language guarantees that the
 * English passes through.
 */
export default function T({ en, hi }: { en: ReactNode; hi?: ReactNode }) {
  if (!hi) return <>{en}</>;
  return (
    <>
      <span data-l="en">{en}</span>
      <span data-l="hi">{hi}</span>
    </>
  );
}
