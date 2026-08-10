import { createClient } from '@/lib/supabase/server';
import { getSettings } from '@/lib/get-settings';
import { CartProvider } from '@/lib/cart-context';
import { ProductGrid } from '@/components/product-grid';
import { CartDrawer } from '@/components/cart-drawer';
import Script from 'next/script';

// Revalidate every 60s so new/edited products and settings show up
// without a full redeploy.
export const revalidate = 60;

export default async function CatalogPage() {
  const supabase = createClient();
  const [{ data: products }, settings] = await Promise.all([
    supabase
      .from('products')
      .select('id, name, price, image_url')
      .eq('in_stock', true)
      .order('created_at', { ascending: false }),
    getSettings(),
  ]);

  return (
    <CartProvider>
      <Script src="https://js.paystack.co/v1/inline.js" strategy="afterInteractive" />
      <main className="min-h-screen bg-paper pb-28">
        <header className="relative border-b border-ink/10 px-6 py-10 text-center">
          <div className="gold-seal relative mx-auto mb-4 h-14 w-14 text-[9px] font-medium uppercase tracking-widest text-gold">
            100%
            <br />
            Original
          </div>

          <h1 className="font-display text-4xl italic text-ink">
            {settings.business_name}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {settings.tagline} — order straight to WhatsApp
          </p>
        </header>

        <div className="mx-auto max-w-2xl p-5">
          <ProductGrid products={products ?? []} />
        </div>

        <CartDrawer
          businessName={settings.business_name}
          whatsappNumber={settings.whatsapp_number}
        />
      </main>
    </CartProvider>
  );
}
