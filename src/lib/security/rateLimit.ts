/**
 * Ephemeral, in-memory rate limiting keyed by a non-persisted identifier (e.g. request IP).
 * Entries are never written to the database and are purged after at most 10 minutes.
 */
const WINDOW_TTL_MS = 10 * 60 * 1000;

interface Bucket {
    count: number;
    resetAt: number;
}

const buckets = new Map<string, Bucket>();

function purgeExpired(now: number) {
    for (const [key, bucket] of buckets) {
        if (bucket.resetAt <= now) buckets.delete(key);
    }
}

export function checkRateLimit(key: string, limit: number, windowMs: number): { allowed: boolean; remaining: number } {
    const now = Date.now();
    if (buckets.size > 5000) purgeExpired(now);

    const effectiveWindow = Math.min(windowMs, WINDOW_TTL_MS);
    const existing = buckets.get(key);

    if (!existing || existing.resetAt <= now) {
        buckets.set(key, { count: 1, resetAt: now + effectiveWindow });
        return { allowed: true, remaining: limit - 1 };
    }

    if (existing.count >= limit) {
        return { allowed: false, remaining: 0 };
    }

    existing.count += 1;
    return { allowed: true, remaining: limit - existing.count };
}

export function requestKeyFromHeaders(headers: Headers): string {
    const forwarded = headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : (headers.get('x-real-ip') ?? 'unknown');
    return ip;
}
