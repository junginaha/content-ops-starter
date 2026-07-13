import { randomBytes } from 'node:crypto';

const BASE62 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function randomBase62(length: number): string {
    const bytes = randomBytes(length);
    let result = '';
    for (let i = 0; i < length; i++) {
        result += BASE62[bytes[i] % BASE62.length];
    }
    return result;
}

/** Random, non-sequential public identifier for posts/rooms/reports (URL-safe, unguessable). */
export function generatePublicId(): string {
    return randomBase62(14);
}

/** Internal primary-key id. Not exposed in URLs. */
export function generateInternalId(): string {
    return randomBase62(21);
}

/** One-time delete key shown to the user exactly once. Only its hash is stored. */
export function generateDeleteKey(): string {
    return `${randomBase62(6)}-${randomBase62(6)}-${randomBase62(6)}`;
}

/** Opaque admin session token. Only its hash is stored server-side. */
export function generateSessionToken(): string {
    return randomBase62(32);
}
