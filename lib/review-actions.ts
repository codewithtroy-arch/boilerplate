'use server';

import { revalidatePath } from 'next/cache';
import { createServiceClient } from '@/lib/supabase/service';

export async function submitReview(formData: FormData) {
  const productId = String(formData.get('product_id') || '');
  const rating = Number(formData.get('rating'));
  const reviewerName = String(formData.get('reviewer_name') || '').trim();
  const comment = String(formData.get('comment') || '').trim();

  if (!productId || !rating || rating < 1 || rating > 5) {
    return { error: 'Pick a star rating first.' };
  }

  const supabase = createServiceClient();
  const { error } = await supabase.from('reviews').insert({
    product_id: productId,
    rating,
    reviewer_name: reviewerName || null,
    comment: comment || null,
  });

  if (error) {
    return { error: 'Could not submit review — try again.' };
  }

  revalidatePath('/catalog');
  return { success: true };
}
