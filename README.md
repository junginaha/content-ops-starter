# 진주 (眞珠) — 진실의 주둥이

by 시대정신

A privacy-first, Korean-language conversational service. People write things they couldn't
say openly; an AI (with a deterministic local fallback) strips personal data, profanity,
threats, doxxing, defamation risk, and excessive wording while preserving meaning and emotion.
The author reviews the safe version and chooses where — if anywhere — it goes.

## Tech stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- PostgreSQL + Drizzle ORM
- Zod validation
- Vitest

## Prerequisites

- Node.js 22+
- A PostgreSQL 16 database (local via Docker, or your own instance)

## 1. Install

```bash
npm install
```

## 2. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

| Variable         | Required | Notes                                                                                     |
| ---------------- | -------- | ------------------------------------------------------------------------------------------- |
| `DATABASE_URL`   | yes      | PostgreSQL connection string.                                                              |
| `ADMIN_PASSWORD` | yes      | Password for the single `/admin` account. Use a long, random value.                        |
| `SESSION_SECRET` | yes      | HMAC key for admin session tokens. Generate with `openssl rand -hex 32`.                   |
| `AI_API_KEY`     | no       | Anthropic API key. If unset, the app uses the deterministic local redaction engine.        |
| `AI_MODEL`       | no       | A Claude model id (e.g. `claude-sonnet-5`). Required alongside `AI_API_KEY` to enable AI.   |

The app never hard-codes a model name — set `AI_MODEL` yourself. When `AI_API_KEY`/`AI_MODEL`
are missing, or the AI call fails or times out, the app **automatically falls back** to
`src/lib/ai/local-redaction.ts`, a deterministic, dependency-free regex/heuristic engine that
strips phone numbers, emails, addresses, account numbers, names, profanity, hate speech, threats,
self-harm signals, and unverified crime accusations. Even when AI is used, its output is always
re-run through this local engine as a defense-in-depth pass before anything is stored.

**AI provider & data retention:** the AI integration targets the Anthropic Messages API
(`https://api.anthropic.com/v1/messages`). Text sent to it is used only to produce the safety
rewrite for that single request; see Anthropic's API data usage terms for their retention policy
(prompts are not used to train Anthropic's models by default for API customers, and Anthropic
documents its own abuse-monitoring retention window in its terms). Raw user text is never logged,
stored in the database, or sent anywhere except this one call — see [Privacy](#privacy) below.

## 3. Start PostgreSQL locally

```bash
docker compose up -d db
```

This starts Postgres on `localhost:5432` with the credentials already wired into
`.env.example` (`postgres://jinjoo:jinjoo@localhost:5432/jinjoo`).

## 4. Run migrations and seed demo content

```bash
npm run db:migrate
npm run db:seed
```

The seed script inserts a handful of posts and one topic inbox, all clearly prefixed with
`[데모]` so they're trivially identifiable and safe to delete.

## 5. Run the app

```bash
npm run dev
```

Visit `http://localhost:3000`. The admin moderation queue is at `/admin` (login with
`ADMIN_PASSWORD`).

## Quality gate

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

`npm test` requires a reachable Postgres database — see `.env.test` for the connection string it
uses (a local `jinjoo_test` database with the same credentials as above:
`createdb -h localhost -U jinjoo jinjoo_test`, then `DATABASE_URL=postgres://jinjoo:jinjoo@localhost:5432/jinjoo_test npm run db:migrate`).

## Docker deployment

Build and run the full stack (app + Postgres):

```bash
cp .env.example .env
# fill in ADMIN_PASSWORD and SESSION_SECRET in .env
docker compose up -d --build
docker compose exec app npm run db:migrate
```

In production, run `npm run db:migrate` once against your real `DATABASE_URL` before starting
traffic (from the running container, or any machine that can reach the database).

### Retention job

Run periodically (e.g. a daily cron/scheduled task) to enforce the documented retention windows:

```bash
npm run db:retention
```

This deletes private/unlisted posts past their 90-day retention window, moderation-event records
older than 180 days, and expired admin sessions.

## Product flow

1. Visitor picks a mode on the home page: 털어놓기 / 의견 묻기 / 익명으로 말해주기 / 조직에 제안하기.
2. They write freely in the composer. Nothing is sent until they tap **안전하게 다듬기**.
3. The server (AI or local fallback) returns `{ sanitizedText, riskLevel, detectedIssues[],
explanation, recommendedAction }`. Original and sanitized text are shown side by side; the
   sanitized version is editable.
4. The author picks a destination: 나만 확인 / 링크로 공유 / 익명 의견함에 전달 / 공개 검토 신청 /
   공식 도움기관 확인. When risk is **urgent**, only 나만 확인 and 공식 도움기관 확인 are enabled.
5. On submit, the server **re-runs the local safety guard on the final text** (never trusting the
   client) to decide the moderation status. High/urgent risk and every 공개 검토 신청 request are
   held as `pending` until an admin approves them — nothing risky auto-publishes.
6. A one-time delete key is shown once and only its hash is stored. Losing it means the content
   can no longer be self-service deleted (an admin can still hide/reject it via the queue).

## Privacy

- No accounts, no login, no tracking pixels, no third-party analytics, no external fonts.
- Raw user text exists only in memory for the duration of the sanitize/create request; it is
  never written to the database, logs, or error traces (`src/lib/logging/logger.ts` only accepts
  non-identifying, enum/count-style fields by type).
- IP addresses are used only for ephemeral, in-memory rate limiting (`src/lib/security/rateLimit.ts`)
  and are purged automatically within 10 minutes; they are never persisted.
- Delete keys and admin session tokens are stored only as hashes
  (`src/lib/security/password.ts`, `src/lib/security/adminSession.ts`).
- Full details: `/legal/privacy` in the running app.

## Project structure

```
src/
  app/                  Routes (App Router): public pages, /admin, /api/*
  components/            UI components (ui/, composer/, admin/, legal/)
  lib/
    ai/                  AI provider call + deterministic local redaction engine
    db/                   Drizzle schema and client
    security/             CSRF, rate limiting, proof-of-work, hashing, sessions
    validation/            Zod schemas
    moderation.ts          Moderation-status and retention-window rules
scripts/                 migrate / seed / retention CLI scripts
tests/                   Vitest unit + integration tests
drizzle/                 Generated SQL migrations
```

## Security notes

- CSRF: double-submit cookie (`middleware.ts` issues a token; mutating requests must echo it in
  the `x-csrf-token` header).
- A lightweight proof-of-work challenge (`/api/challenge`) plus a honeypot field guard the
  sanitize/post/room/report endpoints against scripted abuse.
- Admin sessions use HttpOnly, Secure (in production), SameSite=Strict cookies.
- Security headers (CSP, HSTS, X-Frame-Options, etc.) are set in `next.config.js`.
