"use client";
import { useState } from "react";
import Link from "next/link";

// "/#id" links work from any page: on the home page they scroll, on admin pages they go home first
const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Treatments", href: "/#treatments" },
  { label: "About", href: "/#about" },
  { label: "Admin login", href: "/admin/login" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-extrabold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-white">+</span>
          CareSlot
        </Link>

        {/* Desktop menu */}
        <nav className="hidden items-center gap-7 text-sm font-semibold md:flex">
          {NAV_LINKS.map((item) => (
            <Link key={item.label} href={item.href} className="text-ink/70 transition hover:text-brand">{item.label}</Link>
          ))}
          <Link href="/book" className="btn !px-4 !py-2">Book now</Link>
        </nav>

        {/* Mobile menu button */}
        <button type="button" aria-label="Toggle menu" className="grid h-10 w-10 place-items-center rounded-lg border border-line md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <nav className="flex flex-col gap-1 border-t border-line bg-white px-5 py-3 md:hidden">
          {NAV_LINKS.map((item) => (
            // Close the menu after a tap, otherwise it stays open over the page
            <Link key={item.label} href={item.href} onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2.5 font-semibold hover:bg-mint">{item.label}</Link>
          ))}
          <Link href="/book" onClick={() => setMenuOpen(false)} className="btn mt-2 text-center">Book now</Link>
        </nav>
      )}
    </header>
  );
}
