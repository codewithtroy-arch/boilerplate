import type { Metadata, Viewport } from 'next';
import { Baloo_2, Inter } from 'next/font/google';
import './globals.css';
import { ServiceWorkerRegister } from '@/components/service-worker-register';

const display = Baloo_2({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-display',
});

const body = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
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
  themeColor: '#FF4785',
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
      <body className="min-h-screen font-body antialiased">
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
