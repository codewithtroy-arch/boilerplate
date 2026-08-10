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
3. Sign-in uses email + password (set during `/setup`), not magic links —
   no extra auth configuration needed here. If you want faster local
   testing, you can turn off "Confirm email" under **Authentication →
   Providers → Email**, otherwise you'll need to click a confirmation
   link the first time you sign up.

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

Visit `http://localhost:3000`, click **Sign in** — first time, go to
`/setup` instead to create your account.

## 4. Deploy

Push to GitHub, import the repo on Vercel (free Hobby tier), add the same
two env vars there, set `NEXT_PUBLIC_SITE_URL` to your Vercel URL, and add
that URL's `/auth/callback` to Supabase's redirect list.

## Setup wizard (do this after your first deploy)

Once your app is live on Vercel with the base Supabase tables created
(steps 1-4 above), finish setup at **`your-site.vercel.app/setup`**
instead of manually editing SQL or hunting through code:

1. Run `supabase/setup_wizard_schema.sql` in Supabase's SQL Editor (no
   placeholders to edit — it works as-is).
2. Also run `supabase/about_section_schema.sql` (adds the About text field
   — also no placeholders).
3. Run `supabase/roles_migration.sql` too (this is what makes "first
   person to sign up = admin" work — see the Admin backend section below
   for the one placeholder it needs).
4. Visit `/setup` on your live site. Enter your business name, your
   email, and a password. That's it — you're signed in as admin and
   redirected straight to `/admin/products`.
5. Once in, go to **Settings** in the admin nav and add your WhatsApp
   number and an About paragraph — checkout won't work until the WhatsApp
   number is set. Add your Paystack keys in Vercel whenever you're ready
   to accept payments (see the Paystack section below).

`/setup` only works once — visiting it again after an admin account
exists just shows a "sign in instead" screen, so it can't be used to
hijack an existing shop. Business name, tagline, and WhatsApp number are
stored in the database now (not env vars or code), so you can change them
anytime from **Settings** — no redeploying, no editing files.

## Catalog vs Admin — deliberately different experiences

This boilerplate is split on purpose:

- **`/catalog` is a plain live URL.** No install prompt, no app-like
  framing — it's meant to be shared as a link (WhatsApp, Instagram bio,
  etc.) and opened in a normal browser tab. It still benefits from
  service-worker caching (`public/sw.js`) for faster repeat loads on poor
  connections, but nothing pushes the customer to "install" it.
- **`/admin` is the installable app.** It has its own manifest
  (`public/admin-manifest.json`) and its own icon
  (`public/icons/admin-icon-*.png`), scoped only to `/admin/`. "Add to
  Home Screen" from inside `/admin/products` installs it as a separate,
  distinctly-iconed app pointed straight at product management — separate
  from whatever's on the customer-facing site.

**Per-client checklist before handoff:**
1. Replace `public/icons/admin-icon-192.png` and `admin-icon-512.png`
   with a real icon design (same filenames, or update
   `admin-manifest.json`).
2. Edit `name` / `short_name` / `theme_color` in
   `public/admin-manifest.json`.
3. Update the title in `app/admin/layout.tsx`.
4. PWAs require HTTPS — Vercel gives you this automatically.

**How you install the admin app:** sign in, go to `/admin/products`, then
on Android/Chrome tap "Add to Home Screen" (or accept the browser
prompt); on iOS Safari, Share → "Add to Home Screen." Do this *from
`/admin/products`*, not from `/catalog` or `/dashboard` — that's what
makes it pick up the admin manifest instead of installing nothing (since
the catalog itself no longer offers an install prompt at all).

**Note:** iOS Safari's service worker support is more limited than
Android/Chrome (background sync and push are restricted), so treat iOS as
"installable shell + online functionality," and Android as getting the
fuller offline-caching benefit.

## Later: wrapping the admin app in Capacitor (native app store presence)

If you eventually want the admin app in a real app store instead of just
home-screen installed, or need native camera/push, wrap it with
[Capacitor](https://capacitorjs.com/):

```bash
npm install @capacitor/core @capacitor/cli
npx cap init
npx cap add android
npx cap add ios
```

Point Capacitor's `server.url` at `/admin` on your deployed Vercel URL —
same code, no rewrite. Treat this as a paid add-on per client, since it
adds app store fees ($99/yr Apple, $25 one-time Google) and a release
pipeline on top of what's already working.
top of the PWA.

## Paystack payment (Catalog app)

Checkout now collects real payment before the WhatsApp handoff: customer
enters email → pays via Paystack's popup → payment is verified on the
server → WhatsApp order message includes the payment reference as proof.

**Setup:**
1. Sign up at [paystack.com](https://paystack.com), go to **Settings → API
   Keys & Webhooks**. Copy the **Test Public Key** (`pk_test_...`) and
   **Test Secret Key** (`sk_test_...`) — use test keys while building.
2. Add both as environment variables — locally in `.env.local`, and in
   Vercel → Settings → Environment Variables:
   - `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` = the public key
   - `PAYSTACK_SECRET_KEY` = the secret key (never share this one, never
     prefix it with `NEXT_PUBLIC_`)
3. Redeploy if added after your last deploy.
4. Test the flow at `/catalog`: add items, open the bag, enter any email,
   click Pay. Use Paystack's test card: card number `4084084084084081`,
   any future expiry date, CVV `408`, PIN `0000`, OTP `123456`.
5. Once it works end to end, go live: in Paystack, complete their business
   verification, switch to **Live** keys, and swap the env vars in Vercel
   (Live Public Key and Live Secret Key), then redeploy. Real payments only
   flow once you're on live keys.

**How it stays safe:** the secret key only ever runs on the server (inside
`app/api/paystack/verify/route.ts`) — it's never sent to the browser. The
order is only treated as paid after that server route confirms it with
Paystack directly, not just from the popup closing.

## Admin backend

`/admin/products`, `/admin/orders`, and `/admin/settings` are protected
pages for managing the shop. Access is based on a real role system:
**the first person to ever sign in becomes admin automatically.** Everyone
who signs in after that gets a regular, non-admin account.

**For a brand-new shop:** just use the `/setup` wizard above — it handles
signup and makes you admin in one step.

**For an existing install being upgraded to this role system:** open
`supabase/roles_migration.sql`, replace `you@example.com` near the bottom
with the email you already use to sign in (this backfills your existing
account as admin, since the auto-admin trigger only applies to brand-new
signups), then run it in Supabase's SQL Editor.

**How it's enforced:** the page checks your role to decide what to show
you, but the real enforcement is in the database (`profiles` table + the
policies in `roles_migration.sql`), so it holds even if someone bypasses
the page directly.

**If you ever need a second admin:** in Supabase's Table Editor, open the
`profiles` table, find that person's row, change `role` from `customer`
to `admin`.

**Installing the admin section as its own app:** `/admin` has its own
manifest and icon, separate from the customer-facing catalog PWA. On your
phone: sign in, go to `/admin/products`, then "Add to Home Screen" (Chrome)
or Share → "Add to Home Screen" (iOS Safari) *from that page specifically*
— it installs with a dark "Admin" icon and opens straight into product
management, distinct from whatever icon you install from `/catalog`.

## Order history, low-stock alerts, and AI descriptions

Three additions on top of the admin backend:

- **Order history** (`/admin/orders`) — every paid checkout is now recorded
  server-side (email, items, total, Paystack reference), with a
  today/this-week/all-time revenue summary.
- **Low-stock warnings** — products track a real `stock_quantity`, which
  decrements automatically as orders come in. Anything at 5 or below is
  flagged in `/admin/products`. Change the threshold by editing
  `LOW_STOCK_THRESHOLD` at the top of `app/admin/products/page.tsx`.
- **AI description writer** — in the "Add a product" form, typing a name
  and clicking "✨ Write description with AI" drafts a short description
  using Claude, which you can edit before saving.

**Setup (do this in order):**
1. Open `supabase/orders_and_stock_schema.sql`, replace `you@example.com`
   with your admin email, then run it in Supabase's SQL Editor.
2. Get your **service role key**: Supabase → Project Settings → API Keys
   → `service_role`. Add it as `SUPABASE_SERVICE_ROLE_KEY` — locally and
   in Vercel. **This key is as powerful as full database access — never
   share it, never put it in a file that gets committed publicly, never
   prefix it with `NEXT_PUBLIC_`.**
3. Get an Anthropic API key at console.anthropic.com, add it as
   `ANTHROPIC_API_KEY` — locally and in Vercel.
4. Redeploy if you added these after your last deploy.
5. Test: place a test order (Paystack test card, as above) — it should
   show up in `/admin/orders`, and the product's stock count in
   `/admin/products` should have gone down by however many you ordered.

**Why order-recording is "best effort":** if writing to the `orders`
table fails for some reason, the customer's payment is still valid and
verified — the checkout still succeeds. You'd just be missing that one
row in your order history, not missing a sale. Worth knowing if your
order count ever looks slightly off from Paystack's own dashboard.

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
