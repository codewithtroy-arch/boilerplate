export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 p-8 text-center">
      <h1 className="text-xl font-semibold">You&apos;re offline</h1>
      <p className="max-w-sm text-muted-foreground">
        Check your connection and try again. Anything you already loaded
        will still work.
      </p>
    </main>
  );
}
