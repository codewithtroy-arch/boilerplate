'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { completeSetup } from './actions';

export function SetupForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const [confirmMessage, setConfirmMessage] = useState('');

  function handleSubmit(formData: FormData) {
    setError('');
    setConfirmMessage('');

    startTransition(async () => {
      const result = await completeSetup(formData);

      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.needsEmailConfirm) {
        setConfirmMessage(result.message ?? 'Check your email to confirm.');
        return;
      }
      router.push('/admin/products');
      router.refresh();
    });
  }

  if (confirmMessage) {
    return (
      <div className="refined-card rounded-lg bg-paper p-6 text-center">
        <p className="text-sm text-ink">{confirmMessage}</p>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-3">
      <div>
        <label className="text-xs text-muted-foreground">Your business name</label>
        <input
          name="businessName"
          required
          placeholder="e.g. Ivie's Glow Corner"
          className="mt-1 w-full rounded-md border border-ink/15 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="text-xs text-muted-foreground">Your email</label>
        <input
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className="mt-1 w-full rounded-md border border-ink/15 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="text-xs text-muted-foreground">Choose a password</label>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          placeholder="At least 8 characters"
          className="mt-1 w-full rounded-md border border-ink/15 px-3 py-2 text-sm"
        />
      </div>

      {error && <p className="text-sm text-blush">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 rounded-md bg-ink px-3 py-3 text-sm font-medium text-paper disabled:opacity-50"
      >
        {isPending ? 'Setting up...' : 'Create my shop'}
      </button>
    </form>
  );
}
