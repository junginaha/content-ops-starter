import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);
const KEY_LENGTH = 64;

/** Hashes a secret (delete key, admin password, session token) with a random salt using scrypt. */
export async function hashSecret(secret: string): Promise<string> {
    const salt = randomBytes(16);
    const derived = (await scryptAsync(secret, salt, KEY_LENGTH)) as Buffer;
    return `${salt.toString('hex')}:${derived.toString('hex')}`;
}

/** Verifies a secret against a stored `salt:hash` value using a constant-time comparison. */
export async function verifySecret(secret: string, stored: string): Promise<boolean> {
    const [saltHex, hashHex] = stored.split(':');
    if (!saltHex || !hashHex) return false;
    const salt = Buffer.from(saltHex, 'hex');
    const expected = Buffer.from(hashHex, 'hex');
    const derived = (await scryptAsync(secret, salt, KEY_LENGTH)) as Buffer;
    if (derived.length !== expected.length) return false;
    return timingSafeEqual(derived, expected);
}
