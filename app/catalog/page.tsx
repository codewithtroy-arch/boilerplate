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
  { href: '#about', label: 'About Us' },
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
        {/* Nav — every link scrolls to a section on this same page */}
        <nav className="sticky top-0 z-30 flex items-center justify-between border-b border-ink/10 bg-paper/90 px-5 py-3 backdrop-blur">
          <span className="font-display text-lg italic text-ink">
            {settings.business_name}
          </span>
          <div className="flex gap-4 text-xs font-medium text-ink/70">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="hover:text-rose">
                {link.label}
              </a>
            ))}
          </div>
        </nav>

        {/* Hero */}
        <section id="home" className="relative scroll-mt-14 overflow-hidden bg-blossom">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-rose/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 top-32 h-56 w-56 rounded-full bg-gold/20 blur-3xl" />
          <div className="pointer-events-none absolute right-20 -bottom-16 h-48 w-48 rounded-full bg-sage/20 blur-3xl" />

          <div className="relative mx-auto max-w-2xl px-6 pb-12 pt-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-rose">
              New arrivals
            </p>
            <h1 className="mt-2 max-w-xs font-display text-4xl italic leading-tight text-ink">
              {settings.business_name}
            </h1>
            <p className="mt-3 max-w-xs text-sm text-ink/70">{settings.tagline}</p>

            <a
              href="#products"
              className="mt-6 inline-block rounded-full bg-ink px-6 py-3 text-sm font-medium tracking-wide text-paper"
            >
              Shop now
            </a>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs text-ink/70">
              <span>✓ 100% Original</span>
              <span>✓ Verified Seller</span>
              <span>✓ Order via WhatsApp</span>
            </div>
          </div>
        </section>

        {/* Products */}
        <div id="products" className="mx-auto max-w-2xl scroll-mt-14 px-5 pt-8">
          <h2 className="mb-4 font-display text-xl italic text-ink">Shop the range</h2>
          <ProductGrid products={products ?? []} />
        </div>

        {/* About */}
        <section id="about" className="mx-auto mt-16 max-w-2xl scroll-mt-14 px-5">
          <h2 className="mb-3 font-display text-xl italic text-ink">About Us</h2>
          <p className="max-w-xl text-sm leading-relaxed text-ink/70">
            {settings.about_text}
          </p>
        </section>

        {/* Contact */}
        <section id="contact" className="mx-auto mt-16 max-w-2xl scroll-mt-14 px-5">
          <h2 className="mb-3 font-display text-xl italic text-ink">Contact</h2>
          <p className="max-w-xl text-sm leading-relaxed text-ink/70">
            Questions before you order? Message us directly on WhatsApp.
          </p>
          {settings.whatsapp_number && (
            <a
              href={`https://wa.me/${settings.whatsapp_number}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block rounded-full bg-ink px-6 py-3 text-sm font-medium tracking-wide text-paper"
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
