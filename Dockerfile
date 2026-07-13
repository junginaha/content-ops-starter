# syntax=docker/dockerfile:1
FROM node:22-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# Placeholder build-time values so `next build` can prerender pages that read env vars.
# Real secrets are provided at runtime via the container environment.
ENV DATABASE_URL=postgres://placeholder:placeholder@localhost:5432/placeholder
ENV ADMIN_PASSWORD=placeholder-build-only
ENV SESSION_SECRET=placeholder-build-only-secret
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 jinjoo

COPY --from=builder /app/public ./public
COPY --from=builder --chown=jinjoo:nodejs /app/.next/standalone ./
COPY --from=builder --chown=jinjoo:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER jinjoo
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
