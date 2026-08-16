import { createClient } from '@/lib/supabase/server';
import { getSettings } from '@/lib/get-settings';
import { CartProvider } from '@/lib/cart-context';
import { ProductGrid } from '@/components/product-grid';
import { CartDrawer } from '@/components/cart-drawer';
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
  const [{ data: products }, settings] = await Promise.all([
    supabase
      .from('products')
      .select('id, name, price, image_url')
      .eq('in_stock', true)
      .order('created_at', { ascending: false }),
    getSettings(),
  ]);

  return (
    <CartProvider>
      <Script src="https://js.paystack.co/v1/inline.js" strategy="afterInteractive" />
      <main className="scroll-smooth bg-paper pb-28">
        {/* Nav */}
        <nav className="sticky top-0 z-30 flex items-center justify-between bg-paper/95 px-5 py-4 backdrop-blur">
          <span className="font-display text-lg font-bold text-ink">
            {settings.business_name}
          </span>
          <div className="flex gap-4 text-xs font-semibold text-ink/60">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="hover:text-cobalt">
                {link.label}
              </a>
            ))}
          </div>
        </nav>

        {/* Hero */}
        <section id="home" className="gradient-hero scroll-mt-16 px-6 pb-14 pt-8 text-white">
          <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
            ✨ New arrivals
          </span>
          <h1 className="mt-4 max-w-xs font-display text-4xl font-bold leading-tight">
            {settings.business_name}
          </h1>
          <p className="mt-3 max-w-xs text-sm text-white/85">{settings.tagline}</p>

          <a
            href="#products"
            className="mt-6 inline-block rounded-full bg-white px-7 py-3 text-sm font-bold text-cobalt shadow-lg"
          >
            Shop now →
          </a>

          <div className="mt-8 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/20 px-3 py-1.5 text-xs font-medium">
              ✓ 100% Original
            </span>
            <span className="rounded-full bg-white/20 px-3 py-1.5 text-xs font-medium">
              ✓ Verified Seller
            </span>
            <span className="rounded-full bg-white/20 px-3 py-1.5 text-xs font-medium">
              ✓ WhatsApp Checkout
            </span>
          </div>
        </section>

        {/* Products */}
        <div id="products" className="mx-auto max-w-2xl scroll-mt-16 px-5 pt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-ink">Shop the range</h2>
            <span className="text-xs font-medium text-ink/40">
              {(products ?? []).length} items
            </span>
          </div>
          <ProductGrid products={products ?? []} />
        </div>

        {/* About */}
        <section id="about" className="mx-auto mt-16 max-w-2xl scroll-mt-16 px-5">
          <h2 className="mb-3 font-display text-2xl font-bold text-ink">About us</h2>
          <p className="max-w-xl text-sm leading-relaxed text-ink/70">
            {settings.about_text}
          </p>
        </section>

        {/* Contact */}
        <section id="contact" className="mx-auto mt-16 max-w-2xl scroll-mt-16 px-5">
          <h2 className="mb-3 font-display text-2xl font-bold text-ink">Contact</h2>
          <p className="max-w-xl text-sm leading-relaxed text-ink/70">
            Questions before you order? Message us directly on WhatsApp.
          </p>
          {settings.whatsapp_number && (
            <a
              href={`https://wa.me/${settings.whatsapp_number}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block rounded-full bg-cobalt px-7 py-3 text-sm font-bold text-white shadow-lg"
            >
              Chat on WhatsApp
            </a>
          )}
        </section>

        <CartDrawer
          businessName={settings.business_name}
          whatsappNumber={settings.whatsapp_number}
        />
      </main>
    </CartProvider>
  );
}
