'use client';

import { useCart, type Product } from '@/lib/cart-context';

export function ProductGrid({ products }: { products: Product[] }) {
  const { addItem } = useCart();

  if (products.length === 0) {
    return (
      <div className="signboard-border rounded-lg bg-paper p-6 text-center">
        <p className="font-display text-lg text-ink">Nothing on the shelf yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Add products in Supabase&apos;s Table Editor and they&apos;ll show up here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
      {products.map((product, i) => (
        <div
          key={product.id}
          className="signboard-border relative flex flex-col gap-2 rounded-lg bg-paper p-3"
          style={{ transform: `rotate(${i % 2 === 0 ? '-0.6deg' : '0.6deg'})` }}
        >
          <div className="price-sticker absolute -right-2 -top-3 z-10 h-14 w-14 bg-sun p-1 text-center text-[11px] font-bold leading-tight text-ink">
            ₦{product.price.toLocaleString()}
          </div>

          <div className="flex aspect-square w-full items-center justify-center rounded-md border-2 border-ink/20 bg-sun/20">
            <span className="font-display text-2xl text-ink/20">
              {product.name.charAt(0)}
            </span>
          </div>

          <p className="font-display text-sm leading-snug text-ink">
            {product.name}
          </p>

          <button
            onClick={() => addItem(product)}
            className="mt-auto rounded-md border-2 border-ink bg-leaf px-3 py-1.5 text-sm font-semibold text-paper transition-transform active:scale-95"
          >
            Add to cart
          </button>
        </div>
      ))}
    </div>
  );
}
