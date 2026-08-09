# Coded App Boilerplate

Next.js (App Router) + Supabase (Auth, Postgres, Storage) + Tailwind CSS.
This is the shared foundation for the four apps in *The 100K Coded App
Blueprint*. Clone it per client, add the app-specific feature, deploy.

## What's already wired up

- Passwordless (magic-link) auth via Supabase Auth
- Session refresh middleware so Server Components always see a valid user
- Browser + server Supabase client helpers (`lib/supabase/client.ts`,
  `lib/supabase/server.ts`)
- A protected `/dashboard` route as the template for each app's main screen
- Tailwind configured with CSS-variable theming (swap colors per client fast)

## 1. Create the Supabase project

1. Go to https://supabase.com → New project.
2. Once it's up, go to **Project Settings → API** and copy:
   - Project URL
   - `anon` public key
3. Go to **Authentication → Providers → Email** and make sure "Email OTP" /
   magic link is enabled (it is by default). Under **Authentication → URL
   Configuration**, add `http://localhost:3000/auth/callback` and your future
   production URL as redirect URLs.

## 2. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from
step 1.

## 3. Install and run

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`, click **Sign in**, enter an email, and check
your inbox for the magic link. It'll redirect to `/dashboard`.

## 4. Deploy

Push to GitHub, import the repo on Vercel (free Hobby tier), add the same
two env vars there, set `NEXT_PUBLIC_SITE_URL` to your Vercel URL, and add
that URL's `/auth/callback` to Supabase's redirect list.

## PWA (installable app, no app store)

This boilerplate ships as an installable PWA out of the box:

- `public/manifest.json` — app name, icons, `standalone` display mode
- `public/sw.js` — service worker: caches the shell, serves `/offline` when
  there's no connection
- `components/service-worker-register.tsx` — registers the worker, wired
  into `app/layout.tsx`
- Placeholder icons at `public/icons/icon-192.png` and `icon-512.png`

**Per-client checklist before handoff:**
1. Replace the two placeholder icons with the client's real logo (same
   filenames/sizes, or update `manifest.json`).
2. Edit `name`, `short_name`, and `theme_color` in `public/manifest.json`.
3. Update the `<title>` / `appleWebApp.title` in `app/layout.tsx`.
4. PWAs require HTTPS — Vercel gives you this automatically, no extra setup.

**How the client installs it:** on Android/Chrome, visit the site and tap
"Add to Home Screen" (or the browser prompts automatically). On iOS Safari,
Share → "Add to Home Screen." No app store, no review process, no fee.

**Note:** iOS Safari's service worker support is more limited than
Android/Chrome (background sync and push are restricted), so treat iOS as
"installable shell + online functionality," and Android as getting the
fuller offline-caching benefit.

## Later: wrapping in Capacitor (native app store presence)

For clients who want a real App Store / Play Store listing, or who need
native camera/push (the POS barcode scanner, appointment reminders), wrap
this same codebase with [Capacitor](https://capacitorjs.com/):

```bash
npm install @capacitor/core @capacitor/cli
npx cap init
npx cap add android
npx cap add ios
```

Point Capacitor's `server.url` in `capacitor.config.ts` at your deployed
Vercel URL (or bundle a static export) — same code, no rewrite. Treat this
as a paid add-on per client rather than the default, since it adds app
store fees ($99/yr Apple, $25 one-time Google) and a release pipeline on
top of the PWA.

## Catalog & WhatsApp Checkout app

The `/catalog` route is a working first version: product grid → cart →
checkout via a pre-filled WhatsApp message to the merchant.

**Setup:**
1. In Supabase: **SQL Editor → New query**, paste the contents of
   `supabase/catalog_schema.sql`, click **Run**. This creates the
   `products` table with 3 sample products.
2. Add `NEXT_PUBLIC_WHATSAPP_NUMBER` as an environment variable (locally in
   `.env.local`, and in Vercel → Settings → Environment Variables) — the
   merchant's WhatsApp number in international format with no `+` or
   spaces, e.g. `2348031234567`.
3. Redeploy if you added the env var in Vercel after your last deploy.
4. Visit `/catalog` — you'll see the 3 sample products. Add to cart, open
   the cart button bottom-right, click **Checkout via WhatsApp** — it opens
   WhatsApp with the order pre-typed, ready for the merchant to confirm.
5. Replace the sample products: Supabase → **Table Editor → products** —
   edit rows directly, or delete the samples and add real ones (name,
   price, description). Add `image_url` values once you have product
   photos hosted somewhere (a Supabase Storage bucket works well).

**Not built yet (next steps from the playbook):** the webhook that
auto-parses orders and the Paystack payment step — this version sends the
order to WhatsApp for manual confirmation, which is enough for a first
working app most small merchants can use immediately.

## Building an app on top of this

Each of the four playbook apps reuses this exact skeleton:

| App | What you add |
|---|---|
| Client Portal & Payment Ledger | Storage bucket + milestone tables, Paystack Inline JS on the ledger view |
| Catalog & WhatsApp Checkout | Static product tables, cart state, WhatsApp URL builder on checkout |
| Appointment Scheduler | Bookings table + React-Calendar, Paystack redirect, Vercel Cron + Twilio/Resend |
| Inventory & POS | Products/sales tables with SQL stock triggers, barcode scanner component, Recharts dashboard, RBAC via Supabase roles |

Start every new app by duplicating this folder, running through steps 1–4
with a fresh Supabase project, then building the feature table(s) for that
app inside `app/dashboard/`.
