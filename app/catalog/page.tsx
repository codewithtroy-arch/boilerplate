import { createClient } from '@/lib/supabase/server';
import { CartProvider } from '@/lib/cart-context';
import { ProductGrid } from '@/components/product-grid';
import { CartDrawer } from '@/components/cart-drawer';

// Revalidate every 60s so new/edited products show up without a full redeploy.
export const revalidate = 60;

export default async function CatalogPage() {
  const supabase = createClient();
  const { data: products } = await supabase
    .from('products')
    .select('id, name, price, image_url')
    .eq('in_stock', true)
    .order('created_at', { ascending: false });

  return (
    <CartProvider>
      <main className="mx-auto max-w-2xl p-4 pb-24">
        <h1 className="mb-4 text-2xl font-semibold">Catalog</h1>
        <ProductGrid products={products ?? []} />
        <CartDrawer />
      </main>
    </CartProvider>
  );
}
