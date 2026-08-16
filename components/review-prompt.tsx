'use client';

import { useState, useTransition } from 'react';
import { submitReview } from '@/lib/review-actions';

export function ReviewPrompt({ productId, productName }: { productId: string; productName: string }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError('');
    startTransition(async () => {
      const result = await submitReview(formData);
      if (result?.error) {
        setError(result.error);
        return;
      }
      setSubmitted(true);
    });
  }

  if (submitted) {
    return (
      <p className="text-xs text-sage-dark">Thanks for rating {productName}! 🌿</p>
    );
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-1.5 rounded-xl bg-pink-soft p-3 dark:bg-white/5">
      <input type="hidden" name="product_id" value={productId} />
      <input type="hidden" name="rating" value={rating} />

      <p className="text-xs text-ink dark:text-[#f2f0ed]">Rate {productName}</p>

      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="text-lg leading-none"
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
          >
            <span className={(hovered || rating) >= star ? 'text-pink-dark' : 'text-ink/20'}>
              ★
            </span>
          </button>
        ))}

        {rating > 0 && (
          <button
            type="submit"
            disabled={isPending}
            className="ml-2 rounded-full bg-ink px-3 py-1 text-[11px] font-medium text-marble disabled:opacity-50 dark:bg-pink-dark dark:text-[#1a1510]"
          >
            {isPending ? 'Sending...' : 'Submit'}
          </button>
        )}
      </div>

      {error && <p className="text-[11px] text-blush">{error}</p>}
    </form>
  );
}
