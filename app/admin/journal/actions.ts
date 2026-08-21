'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function addPost(formData: FormData) {
  const supabase = createClient();
  const title = String(formData.get('title') || '').trim();
  const tag = String(formData.get('tag') || '').trim();
  const excerpt = String(formData.get('excerpt') || '').trim();

  if (!title) return;

  await supabase.from('posts').insert({
    title,
    tag: tag || null,
    excerpt: excerpt || null,
  });

  revalidatePath('/admin/journal');
  revalidatePath('/catalog');
}

export async function deletePost(formData: FormData) {
  const supabase = createClient();
  const id = String(formData.get('id'));
  if (!id) return;

  await supabase.from('posts').delete().eq('id', id);

  revalidatePath('/admin/journal');
  revalidatePath('/catalog');
}
