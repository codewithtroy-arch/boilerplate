'use client';

import Image from 'next/image';
import { useCart } from '@/lib/cart-context';

export type QuickViewProduct = {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  description: string | null;
  avgRating: number | null;
  reviewCount: number;
};

export function QuickViewModal({
  product,
  onClose,
}: {
  product: QuickViewProduct;
  onClose: () => void;
}) {
  const { addItem } = useCart();

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-[#1e1d1c] sm:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm"
        >
          ✕
        </button>

        <div className="relative aspect-square w-full bg-pink-soft dark:bg-[#3a2a2e] sm:w-1/2">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="400px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="font-display text-4xl italic text-ink/20 dark:text-white/20">
                {product.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-3 p-6">
          <h2 className="font-display text-2xl text-ink dark:text-[#f2f0ed]">
            {product.name}
          </h2>

          <p className="text-lg font-semibold text-ink dark:text-[#f2f0ed]">
            ₦{product.price.toLocaleString()}
          </p>

          {product.avgRating !== null && (
            <div className="flex items-center gap-1 text-sm text-text-light dark:text-[#a8a49e]">
              <span className="text-pink-dark">★</span>
              <span className="font-medium text-ink dark:text-[#f2f0ed]">
                {product.avgRating.toFixed(1)}
              </span>
              <span>({product.reviewCount} reviews)</span>
            </div>
          )}

          <p className="text-sm leading-relaxed text-text-light dark:text-[#a8a49e]">
            {product.description || 'No description added yet.'}
          </p>

          <button
            onClick={() => {
              addItem(product);
              onClose();
            }}
            className="mt-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-marble dark:bg-pink-dark dark:text-[#1a1510]"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
