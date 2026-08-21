import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop Admin',
  manifest: '/admin-manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black',
    title: 'Admin',
  },
  icons: {
    icon: '/icons/admin-icon-192.png',
    apple: '/icons/admin-icon-192.png',
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper">
      <nav className="flex gap-4 border-b border-ink/10 px-6 py-4">
        <Link href="/admin/products" className="text-sm font-medium text-ink">
          Products
        </Link>
        <Link href="/admin/orders" className="text-sm font-medium text-ink">
          Orders
        </Link>
        <Link href="/admin/settings" className="text-sm font-medium text-ink">
          Settings
        </Link>
        <Link href="/admin/newsletter" className="text-sm font-medium text-ink">
          Newsletter
        </Link>
        <Link href="/admin/journal" className="text-sm font-medium text-ink">
          Journal
        </Link>
      </nav>
      {children}
    </div>
  );
}
