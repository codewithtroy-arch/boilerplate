'use client';

import { useCart, type Product } from '@/lib/cart-context';

export function ProductGrid({ products }: { products: Product[] }) {
  const { addItem } = useCart();

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-ink/10 bg-white p-8 text-center shadow-sm">
        <p className="font-display text-xl italic text-ink">Nothing listed yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Add products in Supabase&apos;s Table Editor and they&apos;ll appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {products.map((product, i) => {
        // Soft rotating color washes stand in for product photography.
        const tints = ['bg-rose/10', 'bg-sage/10', 'bg-gold/10'];
        const tint = tints[i % tints.length];

        return (
          <div
            key={product.id}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink/5 bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <button
              type="button"
              aria-label="Save for later"
              className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-ink/50 shadow-sm"
            >
              ♡
            </button>

            <div className={`flex aspect-square w-full items-center justify-center ${tint}`}>
              <span className="font-display text-3xl italic text-ink/25">
                {product.name.charAt(0)}
              </span>
            </div>

            <div className="flex flex-1 flex-col gap-1 p-3">
              <p className="font-display text-sm leading-snug text-ink">{product.name}</p>
              <div className="mt-auto flex items-center justify-between pt-2">
                <p className="text-sm font-medium text-ink">
                  ₦{product.price.toLocaleString()}
                </p>
                <button
                  onClick={() => addItem(product)}
                  aria-label={`Add ${product.name} to cart`}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-paper transition-colors group-hover:bg-rose"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
