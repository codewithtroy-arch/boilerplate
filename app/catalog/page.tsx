import { createClient } from '@/lib/supabase/server';
import { CartProvider } from '@/lib/cart-context';
import { ProductGrid } from '@/components/product-grid';
import { CartDrawer } from '@/components/cart-drawer';
import { siteConfig } from '@/lib/site-config';

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
      <main className="min-h-screen bg-paper pb-28">
        <header className="relative border-b-[3px] border-ink bg-sun px-4 py-6">
          <div className="price-sticker absolute right-4 top-4 h-16 w-16 rotate-6 border-leaf bg-paper p-1 text-center text-[10px] font-bold leading-tight text-leaf">
            ✓ 100%
            <br />
            ORIGINAL
          </div>

          <h1 className="max-w-[70%] font-display text-3xl leading-none text-ink">
            {siteConfig.businessName}
          </h1>
          <p className="mt-1 max-w-[70%] text-sm text-ink/70">
            {siteConfig.tagline} — order straight to WhatsApp
          </p>
        </header>

        <div className="mx-auto max-w-2xl p-4">
          <ProductGrid products={products ?? []} />
        </div>

        <CartDrawer />
      </main>
    </CartProvider>
  );
}
