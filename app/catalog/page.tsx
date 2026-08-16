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
        <nav className="sticky top-0 z-30 flex items-center justify-between border-b-[1.5px] border-ink bg-paper px-5 py-3">
          <span className="font-display text-lg font-bold uppercase tracking-tight text-ink">
            {settings.business_name}
          </span>
          <div className="flex gap-5 text-xs font-medium uppercase tracking-wide text-ink/70">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="hover:text-cobalt">
                {link.label}
              </a>
            ))}
          </div>
        </nav>

        {/* Hero — flat solid block, not a soft blur, like a label's cover panel */}
        <section id="home" className="scroll-mt-14 bg-cobalt px-6 py-14 text-paper">
          <p className="ref-tag text-xs uppercase tracking-widest text-paper/70">
            Ref: New-Arrivals
          </p>
          <h1 className="mt-3 max-w-sm font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight">
            {settings.business_name}
          </h1>
          <p className="mt-3 max-w-xs text-sm text-paper/80">{settings.tagline}</p>

          <a
            href="#products"
            className="mt-6 inline-block border-[1.5px] border-paper bg-ink px-6 py-3 text-sm font-medium uppercase tracking-wide text-paper transition-colors hover:bg-paper hover:text-ink"
          >
            Shop now
          </a>

          <div className="ref-tag mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[11px] uppercase tracking-wide text-paper/70">
            <span>[✓] 100% Original</span>
            <span>[✓] Verified Seller</span>
            <span>[✓] WhatsApp Checkout</span>
          </div>
        </section>

        {/* Products */}
        <div id="products" className="mx-auto max-w-2xl scroll-mt-14 px-5 pt-8">
          <div className="mb-4 flex items-baseline justify-between border-b-[1.5px] border-ink pb-2">
            <h2 className="font-display text-xl font-bold uppercase tracking-tight text-ink">
              Shop the range
            </h2>
            <span className="ref-tag text-xs text-ink/50">
              {(products ?? []).length} items
            </span>
          </div>
          <ProductGrid products={products ?? []} />
        </div>

        {/* About */}
        <section id="about" className="mx-auto mt-16 max-w-2xl scroll-mt-14 px-5">
          <h2 className="mb-3 border-b-[1.5px] border-ink pb-2 font-display text-xl font-bold uppercase tracking-tight text-ink">
            About
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-ink/70">
            {settings.about_text}
          </p>
        </section>

        {/* Contact */}
        <section id="contact" className="mx-auto mt-16 max-w-2xl scroll-mt-14 px-5">
          <h2 className="mb-3 border-b-[1.5px] border-ink pb-2 font-display text-xl font-bold uppercase tracking-tight text-ink">
            Contact
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-ink/70">
            Questions before you order? Message us directly on WhatsApp.
          </p>
          {settings.whatsapp_number && (
            <a
              href={`https://wa.me/${settings.whatsapp_number}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block border-[1.5px] border-ink bg-ink px-6 py-3 text-sm font-medium uppercase tracking-wide text-paper transition-colors hover:bg-paper hover:text-ink"
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
