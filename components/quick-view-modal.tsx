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
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-[0_40px_80px_rgba(0,0,0,0.25)] dark:bg-[#1e1d1c] sm:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-black/5 bg-white/90 text-ink shadow-sm transition-colors hover:bg-white dark:border-white/10 dark:bg-[#1e1d1c] dark:text-[#f2f0ed]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative aspect-square w-full bg-pink-soft dark:bg-[#3a2a2e] sm:w-1/2">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="font-display text-5xl italic text-ink/20 dark:text-white/20">
                {product.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col justify-center gap-3 p-7 sm:p-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-pink-dark">
            Product
          </p>

          <h2 className="font-display text-2xl font-medium leading-tight text-ink dark:text-[#f2f0ed] sm:text-3xl">
            {product.name}
          </h2>

          <p className="text-xl font-semibold text-ink dark:text-[#f2f0ed]">
            ₦{product.price.toLocaleString()}
          </p>

          {product.avgRating !== null && (
            <div className="flex items-center gap-1.5 text-sm text-text-light dark:text-[#a8a49e]">
              <span className="text-[#f5c542]">★</span>
              <span className="font-medium text-ink dark:text-[#f2f0ed]">
                {product.avgRating.toFixed(1)}
              </span>
              <span className="opacity-60">({product.reviewCount} reviews)</span>
            </div>
          )}

          <p className="mt-1 text-[15px] leading-relaxed text-text-light dark:text-[#a8a49e]">
            {product.description || 'No description added yet.'}
          </p>

          <button
            onClick={() => {
              addItem(product);
              onClose();
            }}
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-pink px-7 py-3.5 text-sm font-medium text-white shadow-[0_8px_24px_rgba(232,154,170,0.35)] transition-all hover:scale-[1.02] hover:bg-pink-dark"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
