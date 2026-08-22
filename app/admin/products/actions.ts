'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { getCurrentProfile } from '@/lib/get-profile';

async function uploadProductImage(file: File): Promise<{ url: string | null; error: string | null }> {
  if (!file || file.size === 0) return { url: null, error: null };

  let service;
  try {
    service = createServiceClient();
  } catch (err) {
    return {
      url: null,
      error:
        err instanceof Error
          ? `Image upload not configured: ${err.message}`
          : 'Image upload not configured.',
    };
  }

  const ext = file.name.split('.').pop() || 'jpg';
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await service.storage
    .from('product-images')
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) {
    return { url: null, error: `Image upload failed: ${error.message}` };
  }

  const { data } = service.storage.from('product-images').getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}

export async function addProduct(formData: FormData) {
  const { role } = await getCurrentProfile();
  if (role !== 'admin') return;

  const supabase = createClient();

  const name = String(formData.get('name') || '').trim();
  const price = Number(formData.get('price'));
  const description = String(formData.get('description') || '').trim();
  const stockQuantity = Number(formData.get('stock_quantity')) || 20;
  const category = String(formData.get('category') || 'other');
  const imageFile = formData.get('image') as File | null;

  if (!name || !price || price <= 0) {
    redirect('/admin/products?error=' + encodeURIComponent('Name and a valid price are required.'));
  }

  let imageUrl: string | null = null;
  if (imageFile && imageFile.size > 0) {
    const result = await uploadProductImage(imageFile);
    if (result.error) {
      redirect('/admin/products?error=' + encodeURIComponent(result.error));
    }
    imageUrl = result.url;
  }

  const { error } = await supabase.from('products').insert({
    name,
    price,
    description: description || null,
    stock_quantity: stockQuantity,
    category,
    image_url: imageUrl,
  });

  revalidatePath('/admin/products');
  revalidatePath('/catalog');

  if (error) {
    redirect('/admin/products?error=' + encodeURIComponent(error.message));
  }
  redirect('/admin/products?saved=true');
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
  const category = String(formData.get('category') || 'other');
  const imageFile = formData.get('image') as File | null;

  if (!id || !name || !price || price <= 0) {
    redirect('/admin/products?error=' + encodeURIComponent('Name and a valid price are required.'));
  }

  const update: Record<string, unknown> = {
    name,
    price,
    in_stock: inStock,
    stock_quantity: stockQuantity,
    category,
  };

  // Only overwrite the image if a new one was actually chosen — leaves
  // the existing photo alone otherwise.
  if (imageFile && imageFile.size > 0) {
    const result = await uploadProductImage(imageFile);
    if (result.error) {
      redirect('/admin/products?error=' + encodeURIComponent(result.error));
    }
    if (result.url) update.image_url = result.url;
  }

  const { error } = await supabase.from('products').update(update).eq('id', id);

  revalidatePath('/admin/products');
  revalidatePath('/catalog');

  if (error) {
    redirect('/admin/products?error=' + encodeURIComponent(error.message));
  }
  redirect('/admin/products?saved=true');
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
  redirect('/admin/products?saved=true');
}
