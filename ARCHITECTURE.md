# AI Publisher SaaS — Architecture Documentation

## Overview
AI Publisher SaaS is a web-to-print publishing platform (InDesign-Killer) that enables users to create professional publications with AI-assisted editing, with export to PDF and EPUB formats.

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v3 + shadcn/ui |
| Editor | Tiptap (ProseMirror AST-based block editor) |
| State Management | Zustand v5 with Persist middleware (localStorage auto-save) |
| Database | PostgreSQL + Prisma ORM |
| Authentication | Auth.js (NextAuth v5) — OAuth Google/GitHub + Magic Links (Resend) |
| Rate Limiting | Upstash Redis (`@upstash/ratelimit`) |
| Security | DOMPurify + jsdom (server-side XSS sanitization of all HTML output) |
| Payments | Stripe API — one-time credit purchases + recurring Pro subscriptions |
| PDF Engine | Puppeteer (Headless Chrome) + Paged.js (CSS Paged Media) |
| EPUB Engine | epub-gen-memory |
| AI | OpenAI SDK with Structured Outputs (GPT-4o) |

## Folder Structure

```
├── prisma/
│   └── schema.prisma              # DB schema: User, Project, Subscription, AiCredit
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── (auth)/
│   │   │   └── login/page.tsx     # Sign-in page (Google, GitHub, Magic Link)
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx         # Shell: sidebar + top navbar (protected)
│   │   │   └── editor/
│   │   │       ├── page.tsx       # Redirects to latest project or creates one
│   │   │       └── [projectId]/page.tsx
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── projects/
│   │   │   │   ├── save/route.ts  # POST: upsert Project (auth-gated)
│   │   │   │   └── list/route.ts  # GET: list user projects
│   │   │   ├── ai/
│   │   │   │   └── modify/route.ts  # POST: OpenAI block edit (credit-gated, rate-limited)
│   │   │   ├── export/route.ts      # POST: PDF+EPUB render (tier-gated, rate-limited)
│   │   │   └── webhooks/
│   │   │       └── stripe/route.ts  # POST: Stripe webhook (raw body, sig verified)
│   │   ├── globals.css
│   │   ├── layout.tsx             # Root HTML shell + Inter font
│   │   └── page.tsx               # Redirects to /editor
│   ├── components/
│   │   ├── ui/                    # shadcn/ui primitives (button, badge, card, etc.)
│   │   ├── layout/
│   │   │   ├── sidebar.tsx        # Projects list + Themes panel
│   │   │   ├── top-navbar.tsx     # Credit balance, Export btn, Auth menu
│   │   │   └── main-canvas.tsx    # A4 paper canvas + Tiptap mount + auto-save
│   │   ├── editor/                # Tiptap extensions (Phase 2)
│   │   └── auth/
│   │       └── sign-in-button.tsx
│   ├── lib/
│   │   ├── auth.ts                # NextAuth config (providers, callbacks, adapter)
│   │   ├── prisma.ts              # Singleton PrismaClient
│   │   ├── redis.ts               # Upstash Redis + Ratelimit helpers
│   │   ├── stripe.ts              # Stripe singleton + helpers
│   │   ├── sanitize.ts            # DOMPurify server-side wrapper (JSDOM)
│   │   └── utils.ts               # cn() helper (clsx + tailwind-merge)
│   ├── store/
│   │   └── editor-store.ts        # Zustand store with localStorage persist
│   └── types/
│       └── index.ts               # Shared TypeScript interfaces
├── middleware.ts                   # Route protection via auth()
└── ARCHITECTURE.md                 # This file
```

## Data Models

```prisma
User          → Account[], Session[], Project[], Subscription?, AiCredit?
Project       → userId, title, content (Json Tiptap AST), timestamps
Subscription  → userId, stripeCustomerId, tier (FREE|PRO), status, periodEnd
AiCredit      → userId, balance (Int, default 10 for FREE tier)
```

## API Security Matrix

| Route | Auth | Rate Limit | Extra |
|-------|------|-----------|-------|
| `POST /api/projects/save` | Session required | — | userId ownership check |
| `POST /api/ai/modify` | Session required | 10 req/hour/user | AiCredit balance ≥ 1 → deduct 1; else 402 |
| `POST /api/export` | Session required | 3 req/hour/user (Free) / 10 (Pro) | DOMPurify sanitize; watermark if FREE |
| `POST /api/webhooks/stripe` | Stripe sig | — | Raw body; `constructEvent` verification |

## XSS / SSRF Threat Model

| Threat | Mitigation |
|--------|-----------|
| XSS via Tiptap AST | DOMPurify on every AST→HTML conversion before PDF/EPUB render |
| SSRF via Puppeteer | `--disable-javascript` + `--no-sandbox` flags; only sanitized internal HTML fed to browser |
| API key abuse (OpenAI) | Redis sliding-window rate limiter, credit balance enforced |
| Stripe webhook spoofing | `stripe.webhooks.constructEvent` with `STRIPE_WEBHOOK_SECRET` |
| Unauthorized project access | `userId === session.user.id` check on every DB write |

## Subscription Tiers

| Feature | Free | Pro |
|---------|------|-----|
| AI Credits (starting) | 10 | 500 |
| PDF Export | Watermarked | Clean |
| EPUB Export | ✗ | ✓ |
| Projects | 3 | Unlimited |
| Export rate limit | 3 / hour | 10 / hour |

## Environment Variables

See `.env.example`. Critical vars:
- `DATABASE_URL` — PostgreSQL connection string
- `NEXTAUTH_SECRET` — generate: `openssl rand -base64 32`
- `NEXTAUTH_URL` — public URL (e.g. `http://localhost:3000`)
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`
- `RESEND_API_KEY` / `RESEND_FROM_EMAIL`
- `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` / `STRIPE_PRO_PRICE_ID`
- `OPENAI_API_KEY`
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`

## Execution Phases

| Phase | Scope |
|-------|-------|
| 1 | Project setup, Auth.js, Prisma schema, UI shell |
| 2 | Tiptap editor, Zustand persist, `/api/projects/save` |
| 3 | AI Bubble Menu, `/api/ai/modify`, credit deduction |
| 4 | PDF + EPUB export engine, watermarking, rate limiting |
| 5 | Stripe checkout, webhooks, pricing modal |
