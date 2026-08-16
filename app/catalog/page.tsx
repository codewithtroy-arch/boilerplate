import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { getSettings } from '@/lib/get-settings';
import { CartProvider } from '@/lib/cart-context';
import { ProductGrid } from '@/components/product-grid';
import { CartDrawer } from '@/components/cart-drawer';
import { ThemeToggle } from '@/components/theme-toggle';
import { MobileMenu } from '@/components/mobile-menu';
import { Toast } from '@/components/toast';
import Script from 'next/script';

// Revalidate every 60s so new/edited products and settings show up
// without a full redeploy.
export const revalidate = 60;

const NAV_LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#products', label: 'Shop' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

export default async function CatalogPage() {
  const supabase = createClient();
  const [{ data: products }, { data: reviews }, settings] = await Promise.all([
    supabase
      .from('products')
      .select('id, name, price, image_url')
      .eq('in_stock', true)
      .order('created_at', { ascending: false }),
    supabase.from('reviews').select('product_id, rating'),
    getSettings(),
  ]);

  // Real averages only — never fabricated. Products with zero reviews
  // simply show no rating at all.
  const ratingsByProduct = new Map<string, { total: number; count: number }>();
  for (const r of reviews ?? []) {
    const entry = ratingsByProduct.get(r.product_id) ?? { total: 0, count: 0 };
    entry.total += r.rating;
    entry.count += 1;
    ratingsByProduct.set(r.product_id, entry);
  }

  const productsWithRatings = (products ?? []).map((p) => {
    const entry = ratingsByProduct.get(p.id);
    return {
      ...p,
      avgRating: entry ? entry.total / entry.count : null,
      reviewCount: entry?.count ?? 0,
    };
  });

  return (
    <CartProvider>
      <Script src="https://js.paystack.co/v1/inline.js" strategy="afterInteractive" />
      <div className="marble-bg min-h-screen pb-28">
        {/* Nav */}
        <nav className="sticky top-0 z-30 flex h-[64px] items-center justify-between border-b border-black/5 bg-white/90 px-6 backdrop-blur-md dark:border-white/5 dark:bg-[#1c1b1a]/90">
          <span className="font-display text-2xl tracking-wide text-ink dark:text-[#f2f0ed]">
            {settings.business_name}
          </span>

          <div className="hidden gap-8 text-sm text-ink/80 dark:text-[#f2f0ed]/80 md:flex">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="hover:text-pink-dark">
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            <MobileMenu />
          </div>
        </nav>

        {/* Hero */}
        <section
          id="home"
          className="grid scroll-mt-16 grid-cols-1 items-center gap-8 px-6 py-14 md:grid-cols-2 md:px-12"
        >
          <div>
            <p className="font-display text-lg italic text-pink-dark">
              {settings.tagline}
            </p>
            <h1 className="mt-2 font-display text-5xl font-medium leading-[1.05] text-ink dark:text-[#f2f0ed]">
              {settings.business_name}
            </h1>
            <p className="mt-4 max-w-sm text-sm text-text-light dark:text-[#a8a49e]">
              Order straight to WhatsApp — {settings.about_text.slice(0, 90)}
              {settings.about_text.length > 90 ? '…' : ''}
            </p>
            <a
              href="#products"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-marble transition-transform hover:scale-[1.03] dark:bg-pink-dark dark:text-[#1a1510]"
            >
              Shop now →
            </a>
          </div>

          <div className="overflow-hidden rounded-2xl shadow-2xl">
            <Image
              src="/images/hero-serum.jpg"
              alt={settings.business_name}
              width={800}
              height={800}
              className="h-full w-full object-cover"
              priority
            />
          </div>
        </section>

        {/* Products */}
        <section id="products" className="scroll-mt-16 px-6 py-10 md:px-12">
          <div className="mb-6 flex items-baseline justify-between">
            <h2 className="font-display text-3xl text-ink dark:text-[#f2f0ed]">Shop</h2>
            <span className="text-xs text-text-light dark:text-[#a8a49e]">
              {(products ?? []).length} products
            </span>
          </div>
          <ProductGrid products={productsWithRatings} />
        </section>

        {/* About */}
        <section id="about" className="scroll-mt-16 px-6 py-10 md:px-12">
          <h2 className="mb-3 font-display text-3xl text-ink dark:text-[#f2f0ed]">About</h2>
          <p className="max-w-xl text-sm leading-relaxed text-text-light dark:text-[#a8a49e]">
            {settings.about_text}
          </p>
        </section>

        {/* Contact */}
        <section id="contact" className="scroll-mt-16 px-6 py-10 md:px-12">
          <h2 className="mb-3 font-display text-3xl text-ink dark:text-[#f2f0ed]">Contact</h2>
          <p className="max-w-xl text-sm leading-relaxed text-text-light dark:text-[#a8a49e]">
            Questions before you order? Message us directly on WhatsApp.
          </p>
          {settings.whatsapp_number && (
            <a
              href={`https://wa.me/${settings.whatsapp_number}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block rounded-full bg-sage px-7 py-3.5 text-sm font-medium text-ink transition-transform hover:scale-[1.03]"
            >
              Chat on WhatsApp
            </a>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-10 border-t border-black/5 px-6 py-10 dark:border-white/5 md:px-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="col-span-2">
              <span className="font-display text-xl text-ink dark:text-[#f2f0ed]">
                {settings.business_name}
              </span>
              <p className="mt-2 max-w-xs text-xs text-text-light dark:text-[#a8a49e]">
                {settings.tagline}
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-ink dark:text-[#f2f0ed]">
                Shop
              </h4>
              <a href="#products" className="mt-2 block text-xs text-text-light dark:text-[#a8a49e]">
                All products
              </a>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-ink dark:text-[#f2f0ed]">
                Help
              </h4>
              <a href="#contact" className="mt-2 block text-xs text-text-light dark:text-[#a8a49e]">
                Contact us
              </a>
            </div>
          </div>
          <p className="mt-8 text-xs text-text-light dark:text-[#a8a49e]">
            © {new Date().getFullYear()} {settings.business_name}. All rights reserved.
          </p>
        </footer>

        <CartDrawer
          businessName={settings.business_name}
          whatsappNumber={settings.whatsapp_number}
        />
        <Toast />
      </div>
    </CartProvider>
  );
}
