import type { Metadata, Viewport } from 'next';
import { Alfa_Slab_One, Work_Sans, Space_Mono } from 'next/font/google';
import './globals.css';
import { ServiceWorkerRegister } from '@/components/service-worker-register';

const display = Alfa_Slab_One({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
});

const body = Work_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
});

const tag = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-tag',
});

export const metadata: Metadata = {
  title: 'Coded App Boilerplate',
  description: 'Next.js + Supabase boilerplate for custom-coded micro-SaaS apps',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Coded App',
  },
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/icon-192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#1e40af',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${tag.variable}`}>
      <body className="min-h-screen font-body antialiased">
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
