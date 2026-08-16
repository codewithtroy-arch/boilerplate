'use client';

import Image from 'next/image';
import { useCart, type Product } from '@/lib/cart-context';

type ProductWithRating = Product & {
  avgRating: number | null;
  reviewCount: number;
};

export function ProductGrid({ products }: { products: ProductWithRating[] }) {
  const { addItem } = useCart();

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

  // Alternates the accent color per card, like the uploaded design.
  const accents: Array<'pink' | 'sage'> = ['pink', 'sage'];

  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
      {products.map((product, i) => {
        const accent = accents[i % accents.length];
        return (
          <article
            key={product.id}
            className="label-card overflow-hidden bg-white transition-shadow hover:shadow-lg dark:bg-[#1e1d1c]"
          >
            <div className="relative aspect-square w-full bg-pink-soft dark:bg-[#3a2a2e]">
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
            </div>

            <div className="flex flex-col gap-1.5 p-3.5">
              <h3 className="font-display text-base text-ink dark:text-[#f2f0ed]">
                {product.name}
              </h3>

              {/* Real ratings only — no rating shown at all until a
                  product actually has a review. */}
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
  );
}
