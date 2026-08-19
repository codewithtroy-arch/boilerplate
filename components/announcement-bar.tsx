'use client';

import { useEffect, useState } from 'react';

export function AnnouncementBar({ text }: { text: string | null }) {
  const [dismissed, setDismissed] = useState(true); // hidden until we check storage

  useEffect(() => {
    if (!text) return;
    setDismissed(sessionStorage.getItem('announcement-dismissed') === 'true');
  }, [text]);

  if (!text || dismissed) return null;

  return (
    <div className="relative z-40 flex items-center justify-center bg-ink px-12 py-2.5 text-center text-[12px] font-medium tracking-wide text-marble dark:bg-pink-dark dark:text-[#1a1510]">
      <span className="max-w-3xl">{text}</span>
      <button
        onClick={() => {
          setDismissed(true);
          sessionStorage.setItem('announcement-dismissed', 'true');
        }}
        aria-label="Dismiss announcement"
        className="absolute right-4 flex h-6 w-6 items-center justify-center rounded-full text-base leading-none opacity-70 transition-opacity hover:opacity-100"
      >
        ×
      </button>
    </div>
  );
}
