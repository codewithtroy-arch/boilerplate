'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });

    if (error) {
      setStatus('error');
      setErrorMsg(error.message);
    } else {
      setStatus('sent');
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold">Sign in</h1>

        {status === 'sent' ? (
          <p className="text-sm text-muted-foreground">
            Check your email for a magic link. Click it to sign in — no password
            needed.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-border px-3 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground disabled:opacity-50"
            >
              {status === 'sending' ? 'Sending link...' : 'Send magic link'}
            </button>
            {status === 'error' && (
              <p className="text-sm text-red-600">{errorMsg}</p>
            )}
          </form>
        )}
      </div>
    </main>
  );
}
