'use client';

import { deleteProduct } from './actions';

export function DeleteProductButton({ id }: { id: string }) {
  return (
    <form
      action={deleteProduct}
      onSubmit={(e) => {
        if (!confirm('Delete this product? This can\'t be undone.')) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="text-xs text-blush underline">
        Delete
      </button>
    </form>
  );
}
