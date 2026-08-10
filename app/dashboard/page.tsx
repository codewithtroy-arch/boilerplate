import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentProfile } from '@/lib/get-profile';

export default async function DashboardPage() {
  const { user, role } = await getCurrentProfile();

  if (!user) {
    redirect('/login');
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">
        Signed in as {user.email}.
      </p>

      {role === 'admin' ? (
        <Link
          href="/admin/products"
          className="mt-4 inline-block rounded-md bg-ink px-4 py-2 text-sm text-paper"
        >
          Manage products
        </Link>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">
          This account doesn&apos;t have admin access.
        </p>
      )}
    </main>
  );
}
