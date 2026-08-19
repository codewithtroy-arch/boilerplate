# How to apply the Lumina UI (IMPORTANT)

The changes ARE in this zip. If you still see the old UI, the files were not replaced or Next.js is serving a cache.

## Option A — Clean install (recommended)

1. Stop `npm run dev` (Ctrl+C)
2. Unzip into a **new folder**
3. Copy your `.env.local` into that folder
4. Run:
```bash
rm -rf .next node_modules
npm install
npm run dev
```
5. Open **http://localhost:3000/catalog**
6. Hard refresh: **Cmd+Shift+R** or **Ctrl+Shift+R**

## Option B — Overwrite files in your existing repo

Copy these from the zip **over** your project:

- app/catalog/page.tsx
- app/globals.css
- app/layout.tsx
- components/cart-drawer.tsx
- components/product-grid.tsx
- components/mobile-menu.tsx
- components/theme-toggle.tsx
- components/quick-view-modal.tsx
- components/announcement-bar.tsx
- components/newsletter-form.tsx  (NEW)

Then:
```bash
rm -rf .next
npm run dev
```

## Verify the new UI loaded

You must see:
- Hero: "Illuminate Your Radiance"
- Category chips under Shop
- Star Ingredients section
- Daily Ritual with big pink 01 / 02 / 03 (centered)
- Join the Glow List newsletter
- Full 4-column footer
- Cart with product photo thumbnails

If not → `.next` cache or wrong folder. Delete `.next` and hard-refresh.
