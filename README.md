# Travelog — Travel Sketch Archive & Poster Store

A production-oriented Next.js (App Router) archive of pen-and-watercolor travel posters, with a real ₩990 Toss Payments checkout and secure high-resolution downloads.

> **Note on origin:** this app was built independently from a written design brief describing the visual structure of a reference site. The reference site itself could not be reached from the build environment (network policy), so layout, spacing, and copy follow the brief rather than pixel-for-pixel screenshots. All artwork in this repo is procedurally generated placeholder art — replace it with your own before shipping.

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS + Framer Motion
- Supabase (Postgres + Auth + Storage)
- Toss Payments (server-verified checkout)
- Deployed on Vercel

## 1. Install

```bash
npm install
```

## 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In **Project Settings → API**, copy the Project URL, `anon` public key, and `service_role` secret key.
3. In the SQL editor, run the migration in [`supabase/migrations/0001_init.sql`](./supabase/migrations/0001_init.sql). It creates the `posters`, `orders`, and `purchases` tables, their indexes/uniqueness constraints, and Row Level Security policies (public read access only to `posters` where `status = 'published'`; `orders`/`purchases` have no public policies and are only ever touched by server code using the service-role key).
4. In **Authentication → Providers**, make sure **Email** is enabled, and turn **off** "Allow new users to sign up" if you want the admin login to be strictly invite-only — the app also enforces an `ADMIN_EMAIL` allowlist server-side regardless.
5. Copy `.env.example` to `.env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`.

## 3. Set up Toss Payments

1. Create an account at [developers.tosspayments.com](https://developers.tosspayments.com) and grab your **test** client key and secret key from the dashboard.
2. Set `NEXT_PUBLIC_TOSS_CLIENT_KEY` and `TOSS_SECRET_KEY` in `.env.local`.
3. When you're ready for real payments, switch both keys to the **live** key pair in your production environment variables (Vercel), never in code.
4. The checkout flow (`990원에 소장하기` → Toss checkout → `/purchase/success`) always re-derives the price from `posters.price_krw` on the server and re-verifies the confirmed amount/currency/status against Toss's `/v1/payments/confirm` API before granting a download — see `src/lib/payments/toss.ts`.

## 4. Seed sample content

The repo ships with 30 sample posters (`scripts/data/posters.ts`) across all six continents, plus procedurally generated placeholder artwork (original, non-proprietary abstract line-art — not scraped from any site).

```bash
# 1. Render preview (public/posters/**/preview.webp) and original (seed-assets/**/original.jpg) art.
npm run seed:generate-art

# 2. Upload originals to a private Supabase Storage bucket and upsert the posters table.
#    Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to be set.
npm run seed
```

Re-run `npm run seed` any time — it upserts on `slug`, so it's safe to run repeatedly.

## 5. Run locally

```bash
npm run dev
```

Visit `http://localhost:3000`. `/browse`, the archive pages, and poster detail pages read live from Supabase (`export const dynamic = 'force-dynamic'`), so nothing is pre-baked at build time — the catalog can change without a redeploy.

## 6. Admin

`/admin` is protected by Supabase Auth + the `ADMIN_EMAIL` allowlist (comma-separated in `.env.local`), enforced both in `src/middleware.ts` and again in every admin server component/action (`src/lib/admin-auth.ts`). There is no public registration form — sign-in is a Supabase magic link sent only to allowlisted addresses.

From `/admin` you can create/edit/unpublish/delete posters, upload preview and original images, and see purchases with revenue totals and per-poster sales.

## 7. How the payment → download flow works

1. Visitor clicks **990원에 소장하기** (disabled until the usage-terms checkbox is checked).
2. `POST /api/orders` creates a pending order server-side, pricing it from `posters.price_krw` — the client never supplies or influences the amount.
3. The browser opens Toss Payments' hosted checkout for that order.
4. Toss redirects to `/purchase/success?paymentKey=...&orderId=...&amount=...`.
5. The success page (server-rendered) looks up the stored order, compares the redirected amount against it, calls Toss's `/v1/payments/confirm` API with the server-trusted amount, and verifies the response status/orderId/amount/currency — **only then** does it render the download button. The query string alone is never treated as proof of payment.
6. Confirmation is idempotent (unique `orders.order_id` / `purchases.payment_key`), so a refreshed success page or a duplicate confirm never double-charges or double-grants.
7. Downloads go through `POST /api/download`, which looks up the purchase's `poster_id` server-side (no client-supplied poster ID, so there's no path-traversal or poster-substitution surface), checks `download_count < download_limit` (5), and issues a Supabase Storage signed URL that expires in 10 minutes with `Content-Disposition: attachment` and a readable filename.

## 8. Deploy to Vercel

1. Push this repo to GitHub.
2. Import it in [Vercel](https://vercel.com/new).
3. Add all variables from `.env.example` in the Vercel project's Environment Variables settings (production Toss keys, production Supabase project, `NEXT_PUBLIC_SITE_URL` set to your real domain).
4. Deploy. Because every data-fetching route is server-rendered per request, no rebuild is required when you add or edit posters through `/admin`.

## Project structure

```
src/app/                     Routes (App Router)
  (marketing)/...            home, /browse, archive + detail pages, legal pages
  admin/                     Protected admin panel + server actions
  api/orders, api/payments,  Order creation, Toss confirmation, secure downloads
  api/download/
  purchase/success, /fail    Server-verified post-checkout pages
  sitemap.ts, robots.ts,
  sitemap-images.xml/        SEO
src/components/               UI components
src/lib/                      Supabase clients, data access, payments, storage
supabase/migrations/          SQL schema
scripts/                      Placeholder-art generation + seed script
```

## Known limitations / next steps

- Placeholder artwork is procedurally generated abstract line-art, not real illustration — swap in licensed or commissioned artwork before launch.
- The reference site that inspired the visual brief could not be reached from this build environment, so the layout follows the written specification rather than a pixel-diff against the live site. Do a side-by-side visual QA pass against the real reference before shipping.
- The Toss Payments and Supabase Storage flows are fully implemented and security-reviewed but have not been exercised against live test credentials in this environment — run a real ₩990 test-mode payment end to end before going live.
