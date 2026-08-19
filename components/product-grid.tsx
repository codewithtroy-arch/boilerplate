'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCart, type Product } from '@/lib/cart-context';
import { QuickViewModal } from './quick-view-modal';

type ProductWithRating = Product & {
  category: string;
  description: string | null;
  avgRating: number | null;
  reviewCount: number;
};

const CATEGORY_LABELS: Record<string, string> = {
  all: 'All',
  essence: 'Essences',
  serum: 'Serums',
  cream: 'Creams',
  cleanser: 'Cleansers',
  other: 'Other',
};

export function ProductGrid({ products }: { products: ProductWithRating[] }) {
  const { addItem } = useCart();
  const [activeCategory, setActiveCategory] = useState('all');
  const [quickViewProduct, setQuickViewProduct] = useState<ProductWithRating | null>(null);

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-black/5 bg-white/80 p-10 text-center backdrop-blur-sm dark:border-white/5 dark:bg-[#1e1d1c]/80">
        <p className="font-display text-2xl text-ink dark:text-[#f2f0ed]">Nothing listed yet</p>
        <p className="mt-2 text-sm text-text-light dark:text-[#a8a49e]">
          Add products in Supabase&apos;s Table Editor and they&apos;ll appear here.
        </p>
      </div>
    );
  }

  const categoriesPresent = Array.from(new Set(products.map((p) => p.category)));
  const filtered =
    activeCategory === 'all' ? products : products.filter((p) => p.category === activeCategory);

  const accents: Array<'pink' | 'sage' | 'cream'> = ['pink', 'sage', 'cream'];

  const chipBase =
    'rounded-full border px-[18px] py-2 text-[13px] font-medium transition-all duration-200';
  const chipIdle =
    'border-black/[0.08] bg-transparent text-text-light hover:border-pink hover:text-ink dark:border-white/10 dark:text-[#a8a49e] dark:hover:text-[#f2f0ed]';
  const chipActive =
    'border-ink bg-ink text-marble dark:border-pink-dark dark:bg-pink-dark dark:text-[#1a1510]';

  return (
    <>
      {/* Category filters — match Lumina exactly */}
      <div className="mb-9 flex flex-wrap gap-2.5">
        <button
          onClick={() => setActiveCategory('all')}
          className={`${chipBase} ${activeCategory === 'all' ? chipActive : chipIdle}`}
        >
          All
        </button>
        {categoriesPresent.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`${chipBase} capitalize ${
              activeCategory === cat ? chipActive : chipIdle
            }`}
          >
            {CATEGORY_LABELS[cat] ?? cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-5 sm:gap-7 md:grid-cols-3">
        {filtered.map((product, i) => {
          const accent = accents[i % accents.length];
          const btnClass =
            accent === 'pink'
              ? 'bg-pink hover:bg-pink-dark text-white'
              : accent === 'sage'
                ? 'bg-sage hover:bg-sage-dark text-ink'
                : 'bg-cream hover:brightness-95 text-[#3a2a1a]';

          return (
            <article
              key={product.id}
              className="group flex flex-col overflow-hidden rounded-[20px] border border-black/[0.04] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] dark:border-white/[0.06] dark:bg-[#1e1d1c]"
            >
              <button
                onClick={() => setQuickViewProduct(product)}
                className="relative block aspect-[4/5] w-full overflow-hidden bg-pink-soft dark:bg-[#3a2a2e]"
                aria-label={`Quick view ${product.name}`}
              >
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="font-display text-4xl italic text-ink/20 dark:text-white/20">
                      {product.name.charAt(0)}
                    </span>
                  </div>
                )}
              </button>

              <div className="flex flex-1 flex-col gap-1.5 p-4 sm:p-5">
                <h3 className="font-display text-[17px] font-medium leading-snug tracking-wide text-ink dark:text-[#f2f0ed]">
                  {product.name}
                </h3>

                {product.avgRating !== null && (
                  <div className="flex items-center gap-1 text-xs text-text-light dark:text-[#a8a49e]">
                    <span className="text-[#f5c542]">★</span>
                    <span className="font-medium text-ink dark:text-[#f2f0ed]">
                      {product.avgRating.toFixed(1)}
                    </span>
                    <span className="opacity-60">({product.reviewCount})</span>
                  </div>
                )}

                <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                  <span className="text-[15px] font-semibold text-ink dark:text-[#f2f0ed]">
                    ₦{product.price.toLocaleString()}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addItem(product);
                    }}
                    className={`rounded-full px-3.5 py-2 text-[11px] font-medium transition-all active:scale-95 sm:px-4 sm:text-xs ${btnClass}`}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {quickViewProduct && (
        <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}
    </>
  );
}
