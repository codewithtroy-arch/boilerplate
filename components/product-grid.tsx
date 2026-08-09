'use client';

import { useCart, type Product } from '@/lib/cart-context';

export function ProductGrid({ products }: { products: Product[] }) {
  const { addItem } = useCart();

  if (products.length === 0) {
    return (
      <div className="refined-card rounded-lg bg-paper p-8 text-center">
        <p className="font-display text-xl italic text-ink">Nothing listed yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Add products in Supabase&apos;s Table Editor and they&apos;ll appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {products.map((product) => (
        <div
          key={product.id}
          className="refined-card flex flex-col gap-3 rounded-lg bg-paper p-4"
        >
          <div className="flex aspect-square w-full items-center justify-center rounded-md bg-blush/10">
            <span className="font-display text-3xl italic text-blush/40">
              {product.name.charAt(0)}
            </span>
          </div>

          <div>
            <p className="font-display text-base leading-snug text-ink">
              {product.name}
            </p>
            <p className="mt-0.5 text-sm tracking-wide text-muted-foreground">
              ₦{product.price.toLocaleString()}
            </p>
          </div>

          <button
            onClick={() => addItem(product)}
            className="mt-auto rounded-md border border-ink/15 bg-ink px-3 py-2 text-sm font-medium tracking-wide text-paper transition-colors hover:bg-blush"
          >
            Add to cart
          </button>
        </div>
      ))}
    </div>
  );
}
