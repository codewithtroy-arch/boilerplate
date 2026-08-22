'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart, type Product } from '@/lib/cart-context';
import { QuickViewModal } from './quick-view-modal';

type ProductWithRating = Product & {
  category: string;
  description: string | null;
  avgRating: number | null;
  reviewCount: number;
};

const CATEGORIES = ['all', 'essence', 'serum', 'cream', 'cleanser', 'other'];
const CATEGORY_LABELS: Record<string, string> = {
  all: 'All',
  essence: 'Essences',
  serum: 'Serums',
  cream: 'Creams',
  cleanser: 'Cleansers',
  other: 'Other',
};

function pageHref(category: string, page: number, search: string) {
  const params = new URLSearchParams();
  if (category !== 'all') params.set('category', category);
  if (search) params.set('search', search);
  if (page > 1) params.set('page', String(page));
  const query = params.toString();
  return `/catalog${query ? `?${query}` : ''}#products`;
}

export function ProductGrid({
  products,
  activeCategory,
  searchQuery,
  currentPage,
  totalPages,
}: {
  products: ProductWithRating[];
  activeCategory: string;
  searchQuery: string;
  currentPage: number;
  totalPages: number;
}) {
  const { addItem } = useCart();
  const [quickViewProduct, setQuickViewProduct] = useState<ProductWithRating | null>(null);

  const accents: Array<'pink' | 'sage'> = ['pink', 'sage'];

  return (
    <>
      {/* Plain GET form — works without JS, filters server-side */}
      <form action="/catalog" method="GET" className="mb-4">
        {activeCategory !== 'all' && (
          <input type="hidden" name="category" value={activeCategory} />
        )}
        <div className="relative">
          <input
            type="text"
            name="search"
            defaultValue={searchQuery}
            placeholder="Search products..."
            className="w-full rounded-full border border-black/10 bg-white px-4 py-2.5 pr-10 text-sm text-ink outline-none transition-colors placeholder:text-text-light focus:border-pink dark:border-white/10 dark:bg-[#1e1d1c] dark:text-[#f2f0ed]"
          />
          <button
            type="submit"
            aria-label="Search"
            className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-ink/60 hover:bg-pink-soft dark:text-[#a8a49e] dark:hover:bg-white/10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </button>
        </div>
        {searchQuery && (
          <div className="mt-2 flex items-center gap-2 text-xs text-text-light dark:text-[#a8a49e]">
            <span>Showing results for &quot;{searchQuery}&quot;</span>
            <Link href={pageHref(activeCategory, 1, '')} className="underline">
              Clear
            </Link>
          </div>
        )}
      </form>

      {/* Category chips — real links, filtering happens server-side so
          it works correctly together with pagination. */}
      <div className="mb-5 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={pageHref(cat, 1, searchQuery)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-ink text-marble dark:bg-pink-dark dark:text-[#1a1510]'
                : 'bg-pink-soft text-ink dark:bg-white/10 dark:text-[#f2f0ed]'
            }`}
          >
            {CATEGORY_LABELS[cat] ?? cat}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="label-card bg-white p-8 text-center dark:bg-[#1e1d1c]">
          <p className="font-display text-xl text-ink dark:text-[#f2f0ed]">
            {searchQuery ? `No results for "${searchQuery}"` : 'Nothing here yet'}
          </p>
          <p className="mt-1 text-sm text-text-light dark:text-[#a8a49e]">
            {searchQuery ? (
              <>Try a different search, or <Link href={pageHref(activeCategory, 1, '')} className="underline">clear it</Link>.</>
            ) : (
              <>Try a different category, or add products in{' '}
              <Link href="/admin/products" className="underline">admin</Link>.</>
            )}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          {products.map((product, i) => {
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
                      sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 20vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="font-display text-xl italic text-ink/20 dark:text-white/20">
                        {product.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </button>

                <div className="flex flex-col gap-1 p-2">
                  <h3 className="font-display text-xs leading-snug text-ink dark:text-[#f2f0ed] line-clamp-1">
                    {product.name}
                  </h3>

                  {product.avgRating !== null && (
                    <div className="flex items-center gap-0.5 text-[10px] text-text-light dark:text-[#a8a49e]">
                      <span className="text-pink-dark">★</span>
                      <span className="font-medium text-ink dark:text-[#f2f0ed]">
                        {product.avgRating.toFixed(1)}
                      </span>
                    </div>
                  )}

                  <div className="mt-0.5 flex items-center justify-between">
                    <span className="text-xs font-semibold text-ink dark:text-[#f2f0ed]">
                      ₦{product.price.toLocaleString()}
                    </span>
                    <button
                      onClick={() => addItem(product)}
                      aria-label={`Add ${product.name} to cart`}
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs text-ink transition-transform active:scale-90 ${
                        accent === 'pink' ? 'bg-pink' : 'bg-sage'
                      }`}
                    >
                      +
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Numbered pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {currentPage > 1 && (
            <Link
              href={pageHref(activeCategory, currentPage - 1, searchQuery)}
              className="rounded-full px-3 py-1.5 text-xs font-medium text-ink hover:bg-pink-soft dark:text-[#f2f0ed] dark:hover:bg-white/10"
            >
              ← Prev
            </Link>
          )}

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Link
              key={page}
              href={pageHref(activeCategory, page, searchQuery)}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                page === currentPage
                  ? 'bg-ink text-marble dark:bg-pink-dark dark:text-[#1a1510]'
                  : 'text-ink hover:bg-pink-soft dark:text-[#f2f0ed] dark:hover:bg-white/10'
              }`}
            >
              {page}
            </Link>
          ))}

          {currentPage < totalPages && (
            <Link
              href={pageHref(activeCategory, currentPage + 1, searchQuery)}
              className="rounded-full px-3 py-1.5 text-xs font-medium text-ink hover:bg-pink-soft dark:text-[#f2f0ed] dark:hover:bg-white/10"
            >
              Next →
            </Link>
          )}
        </div>
      )}

      {quickViewProduct && (
        <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}
    </>
  );
}
