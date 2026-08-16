'use client';

import { useState, useTransition } from 'react';
import { addProduct } from './actions';
import { generateProductDescription } from './ai-actions';

export function AddProductForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [generating, startGenerating] = useTransition();

  function handleGenerate() {
    if (!name.trim()) return;
    startGenerating(async () => {
      const generated = await generateProductDescription(name);
      if (generated) setDescription(generated);
    });
  }

  return (
    <form
      action={addProduct}
      className="label-card mt-6 flex flex-col gap-3 rounded-lg bg-paper p-4"
    >
      <p className="text-sm font-medium text-ink">Add a product</p>

      <input
        name="name"
        placeholder="Product name"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="rounded-md border border-ink/15 px-3 py-2 text-sm"
      />

      <div className="flex gap-2">
        <input
          name="price"
          type="number"
          step="1"
          min="1"
          placeholder="Price (₦)"
          required
          className="flex-1 rounded-md border border-ink/15 px-3 py-2 text-sm"
        />
        <input
          name="stock_quantity"
          type="number"
          step="1"
          min="0"
          placeholder="Stock qty"
          defaultValue={20}
          className="w-28 rounded-md border border-ink/15 px-3 py-2 text-sm"
        />
      </div>

      <textarea
        name="description"
        placeholder="Short description (optional)"
        rows={2}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="rounded-md border border-ink/15 px-3 py-2 text-sm"
      />

      <div>
        <label className="text-xs text-muted-foreground">Product photo</label>
        <input
          name="image"
          type="file"
          accept="image/*"
          className="mt-1 block w-full text-sm"
        />
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        disabled={!name.trim() || generating}
        className="self-start text-xs text-cobalt underline disabled:opacity-40"
      >
        {generating ? 'Writing...' : '✨ Write description with AI'}
      </button>

      <button
        type="submit"
        className="rounded-md bg-ink px-3 py-2 text-sm font-medium text-paper"
      >
        Add product
      </button>
    </form>
  );
}
