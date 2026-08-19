import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { getSettings } from '@/lib/get-settings';
import { CartProvider } from '@/lib/cart-context';
import { ProductGrid } from '@/components/product-grid';
import { CartDrawer } from '@/components/cart-drawer';
import { ThemeToggle } from '@/components/theme-toggle';
import { MobileMenu } from '@/components/mobile-menu';
import { AnnouncementBar } from '@/components/announcement-bar';
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

const TRUST_BADGES = [
  { icon: '✓', label: '100% Original' },
  { icon: '✓', label: 'Verified Seller' },
  { icon: '💬', label: 'WhatsApp Support' },
];

export default async function CatalogPage() {
  const supabase = createClient();
  const [{ data: products }, { data: reviews }, settings] = await Promise.all([
    supabase
      .from('products')
      .select('id, name, price, image_url, category, description')
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
        <AnnouncementBar text={settings.announcement_text} />

        {/* Nav */}
        <nav className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-black/[0.04] bg-white/90 px-6 backdrop-blur-xl dark:border-white/[0.06] dark:bg-[#1c1b1a]/90 md:px-12">
          <a
            href="#home"
            className="font-display text-[1.65rem] font-semibold tracking-[0.12em] text-ink dark:text-[#f2f0ed]"
          >
            {settings.business_name}
          </a>

          <div className="hidden items-center gap-10 text-[13px] font-medium tracking-wide text-ink/75 dark:text-[#f2f0ed]/75 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-pink-dark"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <MobileMenu />
          </div>
        </nav>

        {/* Hero — premium Lumina-style banner */}
        <section
          id="home"
          className="relative scroll-mt-16 overflow-hidden px-6 py-16 md:px-12 md:py-20 lg:py-24"
        >
          {/* Soft pink radial glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-[10%] -top-[20%] z-0 h-[140%] w-[55%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(248,180,196,0.18)_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(232,160,176,0.10)_0%,transparent_70%)]"
          />

          <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
            {/* Copy */}
            <div className="max-w-lg">
              <p className="mb-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-pink-dark">
                <span>{settings.tagline || 'Glow, refined'}</span>
                <span aria-hidden className="text-[10px]">
                  ✦
                </span>
              </p>

              <h1 className="font-display text-4xl font-medium leading-[1.08] tracking-tight text-ink dark:text-[#f2f0ed] sm:text-5xl lg:text-[3.5rem]">
                Illuminate
                <br />
                Your Radiance
              </h1>

              <div className="mt-4 h-px w-12 bg-pink-dark/70" />

              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-text-light dark:text-[#a8a49e]">
                {settings.about_text.length > 140
                  ? `${settings.about_text.slice(0, 140).trim()}…`
                  : settings.about_text}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#products"
                  className="inline-flex items-center gap-2 rounded-full bg-pink px-8 py-3.5 text-sm font-medium text-white shadow-[0_8px_24px_rgba(232,154,170,0.35)] transition-all hover:scale-[1.03] hover:bg-pink-dark"
                >
                  Discover Now
                  <span aria-hidden>→</span>
                </a>
                <a
                  href="#about"
                  className="text-sm font-medium text-ink/70 underline-offset-4 transition-colors hover:text-pink-dark hover:underline dark:text-[#f2f0ed]/70"
                >
                  Our story
                </a>
              </div>
            </div>

            {/* Product visual */}
            <div className="group relative mx-auto w-full max-w-md md:max-w-none">
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-pink/20 via-transparent to-sage/10 opacity-60 blur-2xl dark:from-pink/10 dark:to-sage/5" />
              <div className="relative overflow-hidden rounded-[1.5rem] bg-white/40 shadow-[0_40px_80px_rgba(0,0,0,0.12)] ring-1 ring-black/5 backdrop-blur-sm dark:bg-[#1e1d1c]/50 dark:shadow-[0_40px_80px_rgba(0,0,0,0.4)] dark:ring-white/5">
                <Image
                  src="/images/hero-serum.jpg"
                  alt={settings.business_name}
                  width={900}
                  height={900}
                  className="h-full w-full object-cover transition-transform duration-[9000ms] ease-out group-hover:scale-[1.04]"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Trust badges */}
        <section className="border-y border-black/5 bg-white/40 px-6 py-5 backdrop-blur-sm dark:border-white/5 dark:bg-[#1e1d1c]/40">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-3 md:justify-between md:px-6">
            {TRUST_BADGES.map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-2.5 text-[13px] font-medium tracking-wide text-ink/80 dark:text-[#f2f0ed]/80"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-pink-soft text-xs text-pink-dark dark:bg-white/10">
                  {badge.icon}
                </span>
                {badge.label}
              </div>
            ))}
          </div>
        </section>

        {/* Products */}
        <section id="products" className="scroll-mt-16 px-6 py-14 md:px-12 lg:py-16">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.15em] text-pink-dark">
                  Collection
                </p>
                <h2 className="font-display text-3xl font-medium text-ink dark:text-[#f2f0ed] sm:text-4xl">
                  Shop
                </h2>
              </div>
              <span className="pb-1 text-xs text-text-light dark:text-[#a8a49e]">
                {(products ?? []).length} products
              </span>
            </div>
            <ProductGrid products={productsWithRatings} />
          </div>
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
