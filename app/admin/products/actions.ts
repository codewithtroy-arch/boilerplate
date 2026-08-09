'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function addProduct(formData: FormData) {
  const supabase = createClient();

  const name = String(formData.get('name') || '').trim();
  const price = Number(formData.get('price'));
  const description = String(formData.get('description') || '').trim();
  const stockQuantity = Number(formData.get('stock_quantity')) || 20;

  if (!name || !price || price <= 0) return;

  await supabase.from('products').insert({
    name,
    price,
    description: description || null,
    stock_quantity: stockQuantity,
  });

  revalidatePath('/admin/products');
  revalidatePath('/catalog');
}

export async function updateProduct(formData: FormData) {
  const supabase = createClient();

  const id = String(formData.get('id'));
  const name = String(formData.get('name') || '').trim();
  const price = Number(formData.get('price'));
  const stockQuantity = Number(formData.get('stock_quantity'));
  const inStock = formData.get('in_stock') === 'on';

  if (!id || !name || !price || price <= 0) return;

  await supabase
    .from('products')
    .update({ name, price, in_stock: inStock, stock_quantity: stockQuantity })
    .eq('id', id);

  revalidatePath('/admin/products');
  revalidatePath('/catalog');
}

export async function deleteProduct(formData: FormData) {
  const supabase = createClient();
  const id = String(formData.get('id'));
  if (!id) return;

  await supabase.from('products').delete().eq('id', id);

  revalidatePath('/admin/products');
  revalidatePath('/catalog');
}
