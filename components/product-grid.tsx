'use client';

import { useCart, type Product } from '@/lib/cart-context';

export function ProductGrid({ products }: { products: Product[] }) {
  const { addItem } = useCart();

  if (products.length === 0) {
    return (
      <div className="label-card bg-white p-8 text-center">
        <p className="font-display text-lg font-bold text-ink">Nothing listed yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Add products in Supabase&apos;s Table Editor and they&apos;ll appear here.
        </p>
      </div>
    );
  }

  // Rotating vivid gradient washes stand in for product photography.
  const tints = [
    'from-cobalt/15 to-violet/15',
    'from-violet/15 to-sun/15',
    'from-sun/15 to-cobalt/15',
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {products.map((product, i) => (
        <div key={product.id} className="label-card group relative flex flex-col bg-white">
          <button
            type="button"
            aria-label="Save for later"
            className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink/50 shadow-sm"
          >
            ♡
          </button>

          <div
            className={`flex aspect-square w-full items-center justify-center rounded-t-[1.25rem] bg-gradient-to-br ${tints[i % tints.length]}`}
          >
            <span className="font-display text-3xl font-bold text-ink/20">
              {product.name.charAt(0)}
            </span>
          </div>

          <div className="flex flex-1 flex-col gap-1 p-3">
            <p className="font-display text-sm font-bold leading-snug text-ink">
              {product.name}
            </p>
            <div className="mt-auto flex items-center justify-between pt-2">
              <p className="text-sm font-bold text-ink">
                ₦{product.price.toLocaleString()}
              </p>
              <button
                onClick={() => addItem(product)}
                aria-label={`Add ${product.name} to cart`}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-cobalt text-white shadow-sm transition-transform active:scale-90"
              >
                +
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
