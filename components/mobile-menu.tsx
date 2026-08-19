'use client';

import { useEffect, useState } from 'react';

const LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#products', label: 'Shop' },
  { href: '#ingredients', label: 'Ingredients' },
  { href: '#about', label: 'About' },
  { href: '#routine', label: 'Ritual' },
  { href: '#contact', label: 'Contact' },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="flex h-9 w-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-black/5 dark:text-[#f2f0ed] dark:hover:bg-white/10 md:hidden"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-[105] flex flex-col items-center justify-center gap-8 bg-white/95 backdrop-blur-2xl dark:bg-[#1c1b1a]/95">
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-black/5 dark:text-[#f2f0ed] dark:hover:bg-white/10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>

          <nav className="flex flex-col items-center gap-7">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-display text-3xl font-medium tracking-wide text-ink transition-colors hover:text-pink-dark dark:text-[#f2f0ed]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <p className="absolute bottom-10 text-[11px] tracking-[0.2em] text-text-light dark:text-[#a8a49e]">
            ILLUMINATE YOUR RADIANCE
          </p>
        </div>
      )}
    </>
  );
}
