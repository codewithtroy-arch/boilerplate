'use client';

import { useState } from 'react';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes('@')) return;
    setDone(true);
    setEmail('');
    setTimeout(() => setDone(false), 3000);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        className="flex-1 rounded-full border border-black/10 bg-white/80 px-5 py-3.5 text-sm text-ink outline-none transition-colors placeholder:text-text-light focus:border-pink dark:border-white/10 dark:bg-white/5 dark:text-[#f2f0ed]"
      />
      <button
        type="submit"
        className="rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-marble transition-all hover:scale-[1.02] dark:bg-pink-dark dark:text-[#1a1510]"
      >
        {done ? 'Subscribed ✓' : 'Subscribe'}
      </button>
    </form>
  );
}
