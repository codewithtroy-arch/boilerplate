'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'signing-in' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('signing-in');
    setErrorMsg('');

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setStatus('error');
      setErrorMsg(error.message);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-paper p-8">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 font-display text-3xl font-bold uppercase tracking-tight text-ink">Sign in</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-ink/15 px-3 py-2.5 text-sm"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-ink/15 px-3 py-2.5 text-sm"
          />
          <button
            type="submit"
            disabled={status === 'signing-in'}
            className="mt-1 w-full rounded-md bg-ink px-3 py-3 text-sm font-medium tracking-wide text-paper transition-colors hover:bg-blush disabled:opacity-50"
          >
            {status === 'signing-in' ? 'Signing in...' : 'Sign in'}
          </button>
          {status === 'error' && <p className="text-sm text-blush">{errorMsg}</p>}
        </form>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          No account yet?{' '}
          <a href="/setup" className="text-ink underline">
            Set up your shop
          </a>
        </p>
      </div>
    </main>
  );
}
