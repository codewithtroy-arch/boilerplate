import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCurrentProfile } from '@/lib/get-profile';

export default async function AdminNewsletterPage() {
  const { user, role } = await getCurrentProfile();
  if (!user) redirect('/login');
  if (role !== 'admin') redirect('/dashboard');

  const supabase = createClient();
  const { data } = await supabase
    .from('newsletter_signups')
    .select('id, email, created_at')
    .order('created_at', { ascending: false });

  const signups = data ?? [];

  const csvHref =
    'data:text/csv;charset=utf-8,' +
    encodeURIComponent(
      ['email,signed_up_at', ...signups.map((s) => `${s.email},${s.created_at}`)].join('\n')
    );

  return (
    <main className="mx-auto max-w-2xl p-6 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-ink">
          Newsletter signups
        </h1>
        {signups.length > 0 && (
          <a
            href={csvHref}
            download="newsletter-signups.csv"
            className="rounded-full bg-ink px-4 py-2 text-xs font-medium text-marble dark:bg-pink-dark dark:text-[#1a1510]"
          >
            Download CSV
          </a>
        )}
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        {signups.length} total signup{signups.length === 1 ? '' : 's'}.
      </p>

      <div className="mt-6 flex flex-col gap-2">
        {signups.map((s) => (
          <div
            key={s.id}
            className="label-card flex items-center justify-between bg-paper px-4 py-3"
          >
            <span className="text-sm text-ink">{s.email}</span>
            <span className="text-xs text-muted-foreground">
              {new Date(s.created_at).toLocaleDateString()}
            </span>
          </div>
        ))}

        {signups.length === 0 && (
          <p className="text-sm text-muted-foreground">No signups yet.</p>
        )}
      </div>
    </main>
  );
}
