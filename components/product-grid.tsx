'use client';

import { useCart, type Product } from '@/lib/cart-context';

export function ProductGrid({ products }: { products: Product[] }) {
  const { addItem } = useCart();

  if (products.length === 0) {
    return (
      <p className="text-muted-foreground">
        No products yet — add some in Supabase's Table Editor.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {products.map((product) => (
        <div
          key={product.id}
          className="flex flex-col gap-2 rounded-lg border border-border p-3"
        >
          <div className="aspect-square w-full rounded-md bg-muted" />
          <p className="text-sm font-medium">{product.name}</p>
          <p className="text-sm text-muted-foreground">
            ₦{product.price.toLocaleString()}
          </p>
          <button
            onClick={() => addItem(product)}
            className="mt-auto rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground"
          >
            Add to cart
          </button>
        </div>
      ))}
    </div>
  );
}
