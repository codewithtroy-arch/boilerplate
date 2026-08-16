import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';
import { ServiceWorkerRegister } from '@/components/service-worker-register';

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
});

const body = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Next.js + Supabase boilerplate for custom-coded micro-SaaS apps',
  icons: {
    icon: '/icons/icon-192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#F8B4C4',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-screen bg-marble font-body text-ink antialiased dark:bg-[#121110] dark:text-[#f2f0ed]">
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
