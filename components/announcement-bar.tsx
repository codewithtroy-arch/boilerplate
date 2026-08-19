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
    <div className="relative flex items-center justify-center bg-ink px-10 py-2.5 text-center text-xs font-medium text-marble dark:bg-pink-dark dark:text-[#1a1510]">
      {text}
      <button
        onClick={() => {
          setDismissed(true);
          sessionStorage.setItem('announcement-dismissed', 'true');
        }}
        aria-label="Dismiss"
        className="absolute right-3 text-base leading-none"
      >
        ×
      </button>
    </div>
  );
}
