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
import { NewsletterForm } from '@/components/newsletter-form';
import Script from 'next/script';

export const revalidate = 60;

const NAV_LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#products', label: 'Shop' },
  { href: '#ingredients', label: 'Ingredients' },
  { href: '#about', label: 'About' },
  { href: '#routine', label: 'Ritual' },
  { href: '#contact', label: 'Contact' },
];

const TRUST_BADGES = [
  {
    label: 'Clean Formulas',
    path: 'M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z',
  },
  {
    label: 'Cruelty Free',
    path: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z',
  },
  {
    label: 'Verified Seller',
    path: 'M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z',
  },
  {
    label: 'WhatsApp Support',
    path: 'M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z M21 12c0 4.97-4.03 9-9 9a8.96 8.96 0 0 1-4.27-1.07L3 21l1.13-4.6A8.96 8.96 0 0 1 3 12c0-4.97 4.03-9 9-9s9 4.03 9 9Z',
  },
];

const REVIEWS = [
  {
    text: 'The Vitamin C serum completely transformed my dull winter skin. I’ve never received so many compliments.',
    author: 'Sophia M.',
  },
  {
    text: 'Night Repair Cream is pure magic. Woke up with plump, glowing skin after just one week.',
    author: 'Elena R.',
  },
  {
    text: 'Finally a clean brand that actually works. The Hydrating Essence is now my holy grail.',
    author: 'Amara K.',
  },
];

const INGREDIENTS = [
  {
    icon: '✦',
    title: 'Vitamin C',
    desc: 'Brightens, protects, and visibly even tone with stable, potent ascorbic acid.',
  },
  {
    icon: '✧',
    title: 'Hyaluronic Acid',
    desc: 'Multi-weight molecules that deeply hydrate and plump from within.',
  },
  {
    icon: '☾',
    title: 'Retinol',
    desc: 'Encapsulated retinol that renews overnight for smoother, firmer skin.',
  },
  {
    icon: '❀',
    title: 'Botanical Complex',
    desc: 'Rare plant extracts that calm, nourish, and support the skin barrier.',
  },
];

const ROUTINE = [
  {
    step: '01',
    title: 'Cleanse',
    desc: 'Start with our Hydrating Essence to gently purify and prep the skin.',
  },
  {
    step: '02',
    title: 'Treat',
    desc: 'Apply Vitamin C Serum for brightening and antioxidant protection.',
  },
  {
    step: '03',
    title: 'Nourish',
    desc: 'Seal with Night Repair Cream to restore and renew while you sleep.',
  },
];

const JOURNAL = [
  {
    tag: 'Science',
    title: 'Why Vitamin C is the ultimate glow booster',
    desc: 'Discover how this powerful antioxidant transforms dull skin in just weeks.',
  },
  {
    tag: 'Ritual',
    title: 'The 3-step night routine for radiant mornings',
    desc: 'Simple steps that deliver visible results while you rest.',
  },
  {
    tag: 'Ingredients',
    title: 'Meet our star botanicals',
    desc: 'Rare extracts chosen for purity, potency, and skin compatibility.',
  },
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

  const brand = settings.business_name || 'LUMINA';
  const tagline = settings.tagline || 'Glow, refined';
  const about =
    settings.about_text ||
    'Born from a passion for clean science and nature’s most potent botanicals, we create high-performance skincare that delivers visible radiance without compromise.';

  return (
    <CartProvider>
      <Script src="https://js.paystack.co/v1/inline.js" strategy="afterInteractive" />
      <div className="marble-bg min-h-screen pb-28">
        <AnnouncementBar
          text={
            settings.announcement_text ||
            'Free shipping on orders over ₦50,000 · New arrivals just dropped'
          }
        />

        {/* ─── Nav ─── */}
        <nav className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-black/[0.04] bg-white/90 px-6 backdrop-blur-xl dark:border-white/[0.06] dark:bg-[#1c1b1a]/90 md:px-12">
          <a
            href="#home"
            className="logo-lumina text-[1.75rem] text-ink dark:text-[#f2f0ed]"
          >
            {brand}
          </a>

          <div className="hidden items-center gap-8 text-[13px] font-medium tracking-wide text-ink/75 dark:text-[#f2f0ed]/75 lg:flex">
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

        {/* ─── Hero ─── */}
        <section
          id="home"
          className="relative scroll-mt-16 overflow-hidden px-6 py-16 md:px-12 md:py-20 lg:py-24"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-[10%] -top-[20%] z-0 h-[140%] w-[55%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(248,180,196,0.18)_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(232,160,176,0.10)_0%,transparent_70%)]"
          />

          <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
            <div className="max-w-lg">
              <p className="mb-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-pink-dark">
                <span>{tagline}</span>
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
                Premium skincare. Science-led botanicals. Visible results.
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

            <div className="group relative mx-auto w-full max-w-md md:max-w-none">
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-pink/20 via-transparent to-sage/10 opacity-60 blur-2xl dark:from-pink/10 dark:to-sage/5" />
              <div className="relative overflow-hidden rounded-[1.5rem] bg-white/40 shadow-[0_40px_80px_rgba(0,0,0,0.12)] ring-1 ring-black/5 backdrop-blur-sm dark:bg-[#1e1d1c]/50 dark:shadow-[0_40px_80px_rgba(0,0,0,0.4)] dark:ring-white/5">
                <Image
                  src="/images/hero-serum.jpg"
                  alt={brand}
                  width={900}
                  height={900}
                  className="h-full w-full object-cover transition-transform duration-[9000ms] ease-out group-hover:scale-[1.04]"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* ─── Shop ─── */}
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

        {/* ─── Trust + Reviews ─── */}
        <section id="trust" className="scroll-mt-16 px-6 py-16 md:px-12">
          <div className="mx-auto max-w-6xl">
            {/* Trust badges */}
            <div className="mb-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {TRUST_BADGES.map((badge) => (
                <div
                  key={badge.label}
                  className="flex flex-col items-center gap-3 rounded-2xl border border-black/[0.04] bg-white/60 px-4 py-6 text-center backdrop-blur-sm dark:border-white/[0.06] dark:bg-[#1e1d1c]/50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-7 w-7 text-pink-dark"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d={badge.path} />
                  </svg>
                  <span className="text-[13px] font-medium tracking-wide text-ink dark:text-[#f2f0ed]">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="mb-8 text-center">
              <h2 className="font-display text-3xl font-medium text-ink dark:text-[#f2f0ed] sm:text-4xl">
                Loved by thousands
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {REVIEWS.map((review) => (
                <div
                  key={review.author}
                  className="rounded-2xl border border-black/[0.04] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] dark:border-white/[0.06] dark:bg-[#1e1d1c]"
                >
                  <div className="mb-3 text-sm tracking-wide text-[#f5c542]">★★★★★</div>
                  <p className="text-[15px] leading-relaxed text-ink/80 dark:text-[#f2f0ed]/85">
                    “{review.text}”
                  </p>
                  <p className="mt-4 text-xs font-medium tracking-wide text-text-light dark:text-[#a8a49e]">
                    — {review.author}
                  </p>
                </div>
              ))}
            </div>

            {/* As seen in */}
            <div className="mt-14 text-center">
              <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.2em] text-text-light dark:text-[#a8a49e]">
                As seen in
              </p>
              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14">
                {['VOGUE', 'ELLE', 'Byrdie', 'Allure'].map((name) => (
                  <span
                    key={name}
                    className="font-display text-xl tracking-[0.15em] text-ink/30 dark:text-[#f2f0ed]/25 sm:text-2xl"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── Star Ingredients ─── */}
        <section id="ingredients" className="scroll-mt-16 px-6 py-16 md:px-12">
          <div className="mx-auto max-w-6xl">
            <div className="mb-3 text-center">
              <h2 className="font-display text-3xl font-medium text-ink dark:text-[#f2f0ed] sm:text-4xl">
                Star Ingredients
              </h2>
              <p className="mx-auto mt-3 max-w-md text-[15px] text-text-light dark:text-[#a8a49e]">
                Science-backed actives paired with rare botanicals for visible results.
              </p>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {INGREDIENTS.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-black/[0.04] bg-white p-7 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(0,0,0,0.07)] dark:border-white/[0.06] dark:bg-[#1e1d1c]"
                >
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-pink-soft text-xl text-pink-dark dark:bg-white/10">
                    {item.icon}
                  </div>
                  <h3 className="mb-2 text-base font-medium text-ink dark:text-[#f2f0ed]">
                    {item.title}
                  </h3>
                  <p className="text-[13px] leading-relaxed text-text-light dark:text-[#a8a49e]">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── About ─── */}
        <section id="about" className="scroll-mt-16 px-6 py-16 md:px-12">
          <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:items-center md:gap-16">
            <div>
              <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-pink-dark">
                Our Story
              </p>
              <h2 className="font-display text-3xl font-medium leading-tight text-ink dark:text-[#f2f0ed] sm:text-4xl lg:text-[2.75rem]">
                About {brand}
              </h2>
              <div className="mt-4 h-px w-12 bg-pink-dark/70" />
              <p className="mt-6 text-[15px] leading-relaxed text-text-light dark:text-[#a8a49e]">
                {about}
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-text-light dark:text-[#a8a49e]">
                Every formula is developed with care, using clinically-proven actives paired with
                rare plant extracts. We believe great skin starts with purity, precision, and a
                touch of quiet luxury.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-text-light dark:text-[#a8a49e]">
                No harsh chemicals. No empty promises. Just results you can see and feel —
                illuminated skin, day after day.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { num: '100%', label: 'Clean formulas' },
                { num: '12+', label: 'Botanical actives' },
                { num: '4.8★', label: 'Average rating' },
                { num: '50k+', label: 'Happy customers' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-black/[0.04] bg-white p-6 text-center dark:border-white/[0.06] dark:bg-[#1e1d1c]"
                >
                  <span className="font-display text-3xl font-medium text-pink-dark sm:text-4xl">
                    {stat.num}
                  </span>
                  <p className="mt-2 text-xs font-medium tracking-wide text-text-light dark:text-[#a8a49e]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Daily Ritual — exact Lumina layout ─── */}
        <section
          id="routine"
          className="scroll-mt-16 border-y border-black/5 bg-white/50 py-20 backdrop-blur-sm dark:border-white/5 dark:bg-[#1e1d1c]/40"
        >
          <div className="mx-auto max-w-6xl px-6 md:px-12">
            <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <h2 className="font-display text-3xl font-medium tracking-wide text-ink dark:text-[#f2f0ed] sm:text-4xl">
                Your Daily Ritual
              </h2>
              <a
                href="#products"
                className="text-sm font-medium text-pink-dark transition-colors hover:underline"
              >
                Shop the routine →
              </a>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-8">
              {ROUTINE.map((step) => (
                <div key={step.step} className="px-4 py-6 text-center">
                  <div className="font-display text-[42px] font-medium leading-none text-pink opacity-85 dark:text-pink-dark">
                    {step.step}
                  </div>
                  <h3 className="mt-4 text-xl font-medium text-ink dark:text-[#f2f0ed]">
                    {step.title}
                  </h3>
                  <p className="mx-auto mt-3 max-w-[260px] text-sm leading-relaxed text-text-light dark:text-[#a8a49e]">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Journal ─── */}
        <section id="blog" className="scroll-mt-16 px-6 py-16 md:px-12">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 flex items-end justify-between gap-4">
              <h2 className="font-display text-3xl font-medium text-ink dark:text-[#f2f0ed] sm:text-4xl">
                From the Journal
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {JOURNAL.map((post) => (
                <article
                  key={post.title}
                  className="group cursor-default rounded-2xl border border-black/[0.04] bg-white p-7 transition-all hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] dark:border-white/[0.06] dark:bg-[#1e1d1c]"
                >
                  <span className="inline-block rounded-full bg-pink-soft px-3 py-1 text-[11px] font-medium tracking-wide text-pink-dark dark:bg-white/10">
                    {post.tag}
                  </span>
                  <h3 className="mt-4 font-display text-xl font-medium leading-snug text-ink dark:text-[#f2f0ed]">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-text-light dark:text-[#a8a49e]">
                    {post.desc}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Contact ─── */}
        <section id="contact" className="scroll-mt-16 px-6 py-16 md:px-12">
          <div className="mx-auto max-w-6xl">
            <div className="rounded-3xl border border-black/[0.04] bg-white/70 px-8 py-12 text-center backdrop-blur-sm dark:border-white/[0.06] dark:bg-[#1e1d1c]/70 md:px-16 md:py-16">
              <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-pink-dark">
                Get in touch
              </p>
              <h2 className="font-display text-3xl font-medium text-ink dark:text-[#f2f0ed] sm:text-4xl">
                Contact
              </h2>
              <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-text-light dark:text-[#a8a49e]">
                Questions before you order? Message us directly on WhatsApp — we&apos;re here to
                help you find your perfect glow.
              </p>
              {settings.whatsapp_number ? (
                <a
                  href={`https://wa.me/${settings.whatsapp_number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-sage px-8 py-3.5 text-sm font-medium text-ink shadow-lg transition-all hover:scale-[1.03] hover:brightness-95"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 1.77.46 3.43 1.27 4.88L2 22l5.27-1.24A9.96 9.96 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2Zm4.64 13.59c-.2.56-1.16 1.03-1.6 1.1-.41.06-.93.1-1.5-.1-.35-.12-.8-.26-1.37-.5-2.41-1.04-3.98-3.5-4.1-3.66-.12-.16-1-1.33-1-2.54s.63-1.8.86-2.05c.22-.24.49-.3.65-.3h.47c.15 0 .35-.06.55.42.2.5.69 1.72.75 1.85.06.12.1.27.02.43-.08.16-.12.27-.24.41-.12.14-.25.31-.36.42-.12.12-.24.25-.1.49.14.24.62 1.02 1.33 1.65.91.82 1.68 1.07 1.92 1.19.24.12.38.1.52-.06.14-.16.6-.7.76-.94.16-.24.32-.2.54-.12.22.08 1.4.66 1.64.78.24.12.4.18.46.28.06.1.06.58-.14 1.14Z" />
                  </svg>
                  Chat on WhatsApp
                </a>
              ) : (
                <p className="mt-6 text-sm text-text-light dark:text-[#a8a49e]">
                  Add your WhatsApp number in Admin → Settings to enable chat.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ─── Newsletter — Lumina card style ─── */}
        <section className="px-6 pb-16 pt-4 md:px-12">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col items-center rounded-3xl border border-black/[0.04] bg-white px-8 py-14 text-center shadow-[0_4px_24px_rgba(0,0,0,0.03)] dark:border-white/[0.06] dark:bg-[#1e1d1c] md:px-16">
              <h2 className="font-display text-3xl font-medium tracking-wide text-ink dark:text-[#f2f0ed] sm:text-4xl">
                Join the Glow List
              </h2>
              <p className="mx-auto mt-3 max-w-[420px] text-[15px] text-text-light dark:text-[#a8a49e]">
                Be the first to know about new launches, exclusive offers, and skincare rituals.
              </p>
              <NewsletterForm />
            </div>
          </div>
        </section>

        {/* ─── Footer — full Lumina layout ─── */}
        <footer className="border-t border-black/5 bg-white/60 px-6 py-16 backdrop-blur-sm dark:border-white/5 dark:bg-[#1e1d1c]/50 md:px-12 md:py-16">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-10">
              {/* Brand */}
              <div>
                <a href="#home" className="logo-lumina block text-2xl text-ink dark:text-[#f2f0ed]">
                  {brand}
                </a>
                <p className="mt-4 max-w-[280px] text-[13px] leading-relaxed text-text-light dark:text-[#a8a49e]">
                  Premium skincare crafted with science-led botanicals for visible, lasting
                  radiance.
                </p>
                <div className="mt-5 flex gap-3.5">
                  <a href="#" aria-label="Instagram" className="text-ink/70 transition-opacity hover:opacity-100 dark:text-[#f2f0ed]/70">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75h9A3.75 3.75 0 0 1 20.25 7.5v9a3.75 3.75 0 0 1-3.75 3.75h-9A3.75 3.75 0 0 1 3.75 16.5v-9A3.75 3.75 0 0 1 7.5 3.75Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75h.008v.008H17.25V6.75Z" />
                    </svg>
                  </a>
                  <a href="#" aria-label="TikTok" className="text-ink/70 transition-opacity hover:opacity-100 dark:text-[#f2f0ed]/70">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 9v10.5a3 3 0 0 0 3 3 3 3 0 0 0 3-3V9m0 0V6.75A2.25 2.25 0 0 1 17.25 4.5h.75" />
                    </svg>
                  </a>
                  <a href="#" aria-label="Pinterest" className="text-ink/70 transition-opacity hover:opacity-100 dark:text-[#f2f0ed]/70">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-3.75a.75.75 0 0 1-.75-.75V12a.75.75 0 0 1 1.5 0v4.5a.75.75 0 0 1-.75.75Z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Shop */}
              <div>
                <h4 className="text-[13px] font-semibold uppercase tracking-[0.06em] text-ink dark:text-[#f2f0ed]">
                  Shop
                </h4>
                <div className="mt-[18px] flex flex-col gap-2.5">
                  {[
                    { href: '#products', label: 'Bestsellers' },
                    { href: '#products', label: 'Serums' },
                    { href: '#products', label: 'Moisturizers' },
                    { href: '#products', label: 'Gift Sets' },
                  ].map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="text-[13px] text-text-light transition-colors hover:text-pink-dark dark:text-[#a8a49e]"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* About */}
              <div>
                <h4 className="text-[13px] font-semibold uppercase tracking-[0.06em] text-ink dark:text-[#f2f0ed]">
                  About
                </h4>
                <div className="mt-[18px] flex flex-col gap-2.5">
                  {[
                    { href: '#about', label: 'Our Story' },
                    { href: '#routine', label: 'The Ritual' },
                    { href: '#blog', label: 'Journal' },
                    { href: '#ingredients', label: 'Ingredients' },
                  ].map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="text-[13px] text-text-light transition-colors hover:text-pink-dark dark:text-[#a8a49e]"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Help */}
              <div>
                <h4 className="text-[13px] font-semibold uppercase tracking-[0.06em] text-ink dark:text-[#f2f0ed]">
                  Help
                </h4>
                <div className="mt-[18px] flex flex-col gap-2.5">
                  {[
                    { href: '#contact', label: 'Shipping & Returns' },
                    { href: '#contact', label: 'FAQ' },
                    { href: '#contact', label: 'Contact Us' },
                    { href: '#contact', label: 'Privacy Policy' },
                  ].map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="text-[13px] text-text-light transition-colors hover:text-pink-dark dark:text-[#a8a49e]"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-black/5 pt-7 text-[13px] text-text-light dark:border-white/5 dark:text-[#a8a49e] sm:flex-row">
              <span>© {new Date().getFullYear()} {brand}. All rights reserved.</span>
              <span>Crafted with care for radiant skin</span>
            </div>
          </div>
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
