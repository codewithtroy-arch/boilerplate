import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCurrentProfile } from '@/lib/get-profile';
import { updateProduct } from './actions';
import { DeleteProductButton } from './delete-button';
import { AddProductForm } from './add-product-form';

const LOW_STOCK_THRESHOLD = 5;

export default async function AdminProductsPage() {
  const { user, role } = await getCurrentProfile();

  if (!user) redirect('/login');
  if (role !== 'admin') redirect('/dashboard');

  const supabase = createClient();

  const { data } = await supabase
    .from('products')
    .select('id, name, price, in_stock, stock_quantity')
    .order('created_at', { ascending: false });

  const products = data ?? [];
  const lowStockCount = products.filter(
    (p) => p.stock_quantity <= LOW_STOCK_THRESHOLD
  ).length;

  return (
    <main className="mx-auto max-w-2xl p-6 pb-24">
      <h1 className="font-display text-3xl italic text-ink">Manage products</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Changes here show up on your live catalog within a minute.
      </p>

      {lowStockCount > 0 && (
        <div className="mt-4 rounded-md border border-blush/40 bg-blush/10 px-4 py-2 text-sm text-blush">
          {lowStockCount} product{lowStockCount > 1 ? 's are' : ' is'} running low on
          stock — check the highlighted rows below.
        </div>
      )}

      <AddProductForm />

      <div className="mt-8 flex flex-col gap-3">
        {products.map((product) => {
          const isLow = product.stock_quantity <= LOW_STOCK_THRESHOLD;
          return (
            <form
              key={product.id}
              action={updateProduct}
              className={`refined-card flex flex-col gap-2 rounded-lg bg-paper p-4 sm:flex-row sm:items-center sm:gap-3 ${
                isLow ? 'border-blush/50' : ''
              }`}
            >
              <input type="hidden" name="id" value={product.id} />

              <input
                name="name"
                defaultValue={product.name}
                className="flex-1 rounded-md border border-ink/15 px-3 py-2 text-sm"
              />
              <input
                name="price"
                type="number"
                step="1"
                min="1"
                defaultValue={product.price}
                className="w-24 rounded-md border border-ink/15 px-3 py-2 text-sm"
              />
              <div className="flex flex-col items-start">
                <input
                  name="stock_quantity"
                  type="number"
                  step="1"
                  min="0"
                  defaultValue={product.stock_quantity}
                  className={`w-20 rounded-md border px-3 py-2 text-sm ${
                    isLow ? 'border-blush text-blush' : 'border-ink/15'
                  }`}
                />
                {isLow && <span className="mt-0.5 text-[10px] text-blush">Low stock</span>}
              </div>

              <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <input type="checkbox" name="in_stock" defaultChecked={product.in_stock} />
                Visible
              </label>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="rounded-md border border-ink/15 px-3 py-1.5 text-xs font-medium text-ink"
                >
                  Save
                </button>
                <DeleteProductButton id={product.id} />
              </div>
            </form>
          );
        })}

        {products.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No products yet — add your first one above.
          </p>
        )}
      </div>
    </main>
  );
}
