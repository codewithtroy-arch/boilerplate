'use client';

import { useState, useTransition } from 'react';
import { submitNewsletterSignup } from '@/lib/newsletter-actions';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes('@')) return;
    setError('');

    startTransition(async () => {
      const result = await submitNewsletterSignup(email);
      if (result.error) {
        setError(result.error);
        return;
      }
      setDone(true);
      setEmail('');
      setTimeout(() => setDone(false), 3000);
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-7 flex w-full max-w-[480px] flex-col gap-3 sm:flex-row sm:gap-3"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        className="flex-1 rounded-full border border-black/10 bg-marble px-5 py-4 text-sm text-ink outline-none transition-colors placeholder:text-text-light focus:border-pink dark:border-white/10 dark:bg-white/5 dark:text-[#f2f0ed]"
      />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-pink px-7 py-4 text-sm font-medium text-white transition-colors hover:bg-pink-dark whitespace-nowrap disabled:opacity-60"
      >
        {done ? 'Subscribed ✓' : isPending ? 'Saving...' : 'Subscribe'}
      </button>
      {error && <p className="text-xs text-blush sm:absolute sm:mt-14">{error}</p>}
    </form>
  );
}
