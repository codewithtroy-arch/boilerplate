import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { SetupForm } from './setup-form';

export default async function SetupPage() {
  const supabase = createClient();
  const { count } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('role', 'admin');

  const alreadySetUp = (count ?? 0) > 0;

  if (alreadySetUp) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="font-display text-2xl font-bold uppercase tracking-tight text-ink">Already set up</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          This shop already has an admin account. Sign in instead, or edit
          your business details from Settings once you're in.
        </p>
        <Link href="/login" className="rounded-md bg-ink px-4 py-2 text-sm text-paper">
          Sign in
        </Link>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-sm">
        <h1 className="mb-1 font-display text-3xl font-bold uppercase tracking-tight text-ink">Set up your shop</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Three things and you&apos;re in. Everything else (WhatsApp number,
          payments) you can fill in later from Settings.
        </p>
        <SetupForm />
      </div>
    </main>
  );
}
