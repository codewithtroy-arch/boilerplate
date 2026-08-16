'use client';

import { useCart, type Product } from '@/lib/cart-context';

// Deterministic short code from the product id, styled like a batch/REF
// number on an ingredient label — also just genuinely useful for you and
// the customer to reference the same item unambiguously over WhatsApp.
function refCode(id: string) {
  return id.replace(/-/g, '').slice(0, 6).toUpperCase();
}

export function ProductGrid({ products }: { products: Product[] }) {
  const { addItem } = useCart();

  if (products.length === 0) {
    return (
      <div className="label-card p-8 text-center">
        <p className="font-display text-lg font-bold uppercase text-ink">
          Nothing listed yet
        </p>
        <p className="mt-1 text-sm text-ink/60">
          Add products in Supabase&apos;s Table Editor and they&apos;ll appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {products.map((product) => (
        <div key={product.id} className="label-card flex flex-col bg-paper">
          <div className="flex aspect-square w-full items-center justify-center border-b-[1.5px] border-ink bg-cobalt/5">
            <span className="font-display text-3xl font-bold text-cobalt/30">
              {product.name.charAt(0)}
            </span>
          </div>

          <div className="flex flex-1 flex-col gap-1.5 p-3">
            <p className="ref-tag text-[10px] text-ink/40">REF {refCode(product.id)}</p>
            <p className="font-display text-sm font-bold leading-snug text-ink">
              {product.name}
            </p>

            <div className="mt-auto flex items-center justify-between pt-2">
              <p className="ref-tag text-sm font-medium text-ink">
                ₦{product.price.toLocaleString()}
              </p>
              <button
                onClick={() => addItem(product)}
                aria-label={`Add ${product.name} to cart`}
                className="border-[1.5px] border-ink bg-ink px-2.5 py-1 text-xs font-medium uppercase text-paper transition-colors hover:bg-cobalt hover:border-cobalt"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
