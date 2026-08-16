'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { getCurrentProfile } from '@/lib/get-profile';

async function uploadProductImage(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null;

  const service = createServiceClient();
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await service.storage
    .from('product-images')
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) {
    console.error('Image upload failed:', error);
    return null;
  }

  const { data } = service.storage.from('product-images').getPublicUrl(path);
  return data.publicUrl;
}

export async function addProduct(formData: FormData) {
  const { role } = await getCurrentProfile();
  if (role !== 'admin') return;

  const supabase = createClient();

  const name = String(formData.get('name') || '').trim();
  const price = Number(formData.get('price'));
  const description = String(formData.get('description') || '').trim();
  const stockQuantity = Number(formData.get('stock_quantity')) || 20;
  const imageFile = formData.get('image') as File | null;

  if (!name || !price || price <= 0) return;

  const imageUrl = imageFile ? await uploadProductImage(imageFile) : null;

  await supabase.from('products').insert({
    name,
    price,
    description: description || null,
    stock_quantity: stockQuantity,
    image_url: imageUrl,
  });

  revalidatePath('/admin/products');
  revalidatePath('/catalog');
}

export async function updateProduct(formData: FormData) {
  const { role } = await getCurrentProfile();
  if (role !== 'admin') return;

  const supabase = createClient();

  const id = String(formData.get('id'));
  const name = String(formData.get('name') || '').trim();
  const price = Number(formData.get('price'));
  const stockQuantity = Number(formData.get('stock_quantity'));
  const inStock = formData.get('in_stock') === 'on';
  const imageFile = formData.get('image') as File | null;

  if (!id || !name || !price || price <= 0) return;

  const update: Record<string, unknown> = {
    name,
    price,
    in_stock: inStock,
    stock_quantity: stockQuantity,
  };

  // Only overwrite the image if a new one was actually chosen — leaves
  // the existing photo alone otherwise.
  if (imageFile && imageFile.size > 0) {
    const imageUrl = await uploadProductImage(imageFile);
    if (imageUrl) update.image_url = imageUrl;
  }

  await supabase.from('products').update(update).eq('id', id);

  revalidatePath('/admin/products');
  revalidatePath('/catalog');
}

export async function deleteProduct(formData: FormData) {
  const { role } = await getCurrentProfile();
  if (role !== 'admin') return;

  const supabase = createClient();
  const id = String(formData.get('id'));
  if (!id) return;

  await supabase.from('products').delete().eq('id', id);

  revalidatePath('/admin/products');
  revalidatePath('/catalog');
}
