import { createHmac, timingSafeEqual } from 'node:crypto';
import { eq, lt } from 'drizzle-orm';
import { getDb } from '../db';
import { adminSessions } from '../db/schema';
import { generateInternalId, generateSessionToken } from './ids';

export const ADMIN_SESSION_COOKIE = 'jinjoo_admin_session';
export const ADMIN_SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

/**
 * Session tokens are 190+ bits of server-generated randomness (never user-chosen), so a fast
 * deterministic HMAC digest (keyed by SESSION_SECRET) is used for the lookup index instead of a
 * slow salted password hash. Keying it with SESSION_SECRET means stored token hashes are useless
 * without the server secret, even if the database were exposed.
 */
function digestToken(token: string): string {
    const secret = process.env.SESSION_SECRET;
    if (!secret) {
        throw new Error('SESSION_SECRET is not set');
    }
    return createHmac('sha256', secret).update(token).digest('hex');
}

export function verifyAdminPassword(candidate: string): boolean {
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected) return false;
    const a = Buffer.from(candidate);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
}

export async function createAdminSession(): Promise<{ token: string; expiresAt: Date }> {
    const db = getDb();
    const token = generateSessionToken();
    const expiresAt = new Date(Date.now() + ADMIN_SESSION_TTL_MS);
    await db.insert(adminSessions).values({
        id: generateInternalId(),
        tokenHash: digestToken(token),
        expiresAt
    });
    return { token, expiresAt };
}

export async function verifyAdminSession(token: string | undefined): Promise<boolean> {
    if (!token) return false;
    const db = getDb();
    const rows = await db.select().from(adminSessions).where(eq(adminSessions.tokenHash, digestToken(token))).limit(1);
    const session = rows[0];
    if (!session) return false;
    if (session.expiresAt.getTime() <= Date.now()) return false;
    return true;
}

export async function revokeAdminSession(token: string | undefined): Promise<void> {
    if (!token) return;
    const db = getDb();
    await db.delete(adminSessions).where(eq(adminSessions.tokenHash, digestToken(token)));
}

export async function purgeExpiredAdminSessions(): Promise<void> {
    const db = getDb();
    await db.delete(adminSessions).where(lt(adminSessions.expiresAt, new Date()));
}
