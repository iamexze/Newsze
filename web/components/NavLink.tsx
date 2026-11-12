"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({ href, label, hi }: { href: string; label: string; hi?: string }) {
  const path = usePathname();
  const active = href === "/" ? path === "/" : path.startsWith(href);
  return (
    <Link href={href} aria-current={active ? "page" : undefined}>
      {hi ? (<><span data-l="en">{label}</span><span data-l="hi">{hi}</span></>) : label}
    </Link>
  );
}
