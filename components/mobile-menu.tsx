'use client';

import { useState } from 'react';

const LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#products', label: 'Shop' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="flex h-9 w-9 items-center justify-center text-ink dark:text-[#f2f0ed] md:hidden"
      >
        ☰
      </button>

      {open && (
        <div className="fixed inset-0 z-[105] flex flex-col items-center justify-center gap-8 bg-white/95 backdrop-blur-xl dark:bg-[#1c1b1a]/95">
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="absolute right-6 top-6 text-2xl text-ink dark:text-[#f2f0ed]"
          >
            ✕
          </button>
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="font-display text-3xl italic tracking-wide text-ink transition-colors hover:text-pink-dark dark:text-[#f2f0ed]"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}
