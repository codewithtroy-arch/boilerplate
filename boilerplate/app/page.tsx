import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-3xl font-semibold">Coded App Boilerplate</h1>
      <p className="max-w-md text-muted-foreground">
        Next.js App Router + Supabase (Auth, Postgres, Storage) + Tailwind.
        Clone this per client, swap the core feature, ship in hours.
      </p>
      <Link
        href="/login"
        className="rounded-lg bg-primary px-5 py-2.5 text-primary-foreground"
      >
        Sign in
      </Link>
    </main>
  );
}
