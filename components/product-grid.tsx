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
      <div className="label-card bg-white p-8 text-center dark:bg-[#1e1d1c]">
        <p className="font-display text-xl text-ink dark:text-[#f2f0ed]">
          Nothing listed yet
        </p>
        <p className="mt-1 text-sm text-text-light dark:text-[#a8a49e]">
          Add products in Supabase&apos;s Table Editor and they&apos;ll appear here.
        </p>
      </div>
    );
  }

  const categoriesPresent = Array.from(new Set(products.map((p) => p.category)));
  const filtered =
    activeCategory === 'all' ? products : products.filter((p) => p.category === activeCategory);

  const accents: Array<'pink' | 'sage'> = ['pink', 'sage'];

  return (
    <>
      <div className="mb-5 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory('all')}
          className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
            activeCategory === 'all'
              ? 'bg-ink text-marble dark:bg-pink-dark dark:text-[#1a1510]'
              : 'bg-pink-soft text-ink dark:bg-white/10 dark:text-[#f2f0ed]'
          }`}
        >
          All
        </button>
        {categoriesPresent.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium capitalize transition-colors ${
              activeCategory === cat
                ? 'bg-ink text-marble dark:bg-pink-dark dark:text-[#1a1510]'
                : 'bg-pink-soft text-ink dark:bg-white/10 dark:text-[#f2f0ed]'
            }`}
          >
            {CATEGORY_LABELS[cat] ?? cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
        {filtered.map((product, i) => {
          const accent = accents[i % accents.length];
          return (
            <article
              key={product.id}
              className="label-card overflow-hidden bg-white transition-shadow hover:shadow-lg dark:bg-[#1e1d1c]"
            >
              <button
                onClick={() => setQuickViewProduct(product)}
                className="relative block aspect-square w-full bg-pink-soft dark:bg-[#3a2a2e]"
                aria-label={`Quick view ${product.name}`}
              >
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="font-display text-3xl italic text-ink/20 dark:text-white/20">
                      {product.name.charAt(0)}
                    </span>
                  </div>
                )}
              </button>

              <div className="flex flex-col gap-1.5 p-3.5">
                <h3 className="font-display text-base text-ink dark:text-[#f2f0ed]">
                  {product.name}
                </h3>

                {product.avgRating !== null && (
                  <div className="flex items-center gap-1 text-xs text-text-light dark:text-[#a8a49e]">
                    <span className="text-pink-dark">★</span>
                    <span className="font-medium text-ink dark:text-[#f2f0ed]">
                      {product.avgRating.toFixed(1)}
                    </span>
                    <span>({product.reviewCount})</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm font-semibold text-ink dark:text-[#f2f0ed]">
                    ₦{product.price.toLocaleString()}
                  </span>
                  <button
                    onClick={() => addItem(product)}
                    className={`rounded-full px-3.5 py-2 text-xs font-medium text-ink transition-transform active:scale-95 ${
                      accent === 'pink' ? 'bg-pink' : 'bg-sage'
                    }`}
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
