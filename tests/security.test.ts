import { describe, expect, it } from 'vitest';
import { hashSecret, verifySecret } from '@/lib/security/password';
import { generateDeleteKey, generatePublicId, generateSessionToken } from '@/lib/security/ids';
import { verifyAdminPassword } from '@/lib/security/adminSession';
import { issueChallenge, verifyAndConsumeChallenge } from '@/lib/security/pow';
import { csrfTokensMatch, generateCsrfToken } from '@/lib/security/csrf';
import { checkRateLimit } from '@/lib/security/rateLimit';
import { createHash } from 'node:crypto';

describe('delete-key hashing and verification', () => {
    it('verifies a matching delete key', async () => {
        const key = generateDeleteKey();
        const hash = await hashSecret(key);
        expect(await verifySecret(key, hash)).toBe(true);
    });

    it('rejects a non-matching delete key', async () => {
        const key = generateDeleteKey();
        const hash = await hashSecret(key);
        expect(await verifySecret('wrong-key-123456', hash)).toBe(false);
    });

    it('never stores the delete key in plaintext', async () => {
        const key = generateDeleteKey();
        const hash = await hashSecret(key);
        expect(hash).not.toContain(key);
    });

    it('generates non-sequential, sufficiently random public ids', () => {
        const ids = new Set(Array.from({ length: 50 }, () => generatePublicId()));
        expect(ids.size).toBe(50);
        for (const id of ids) {
            expect(id).toMatch(/^[A-Za-z0-9]{14}$/);
        }
    });
});

describe('admin authentication', () => {
    it('accepts the correct password from ADMIN_PASSWORD', () => {
        expect(verifyAdminPassword(process.env.ADMIN_PASSWORD!)).toBe(true);
    });

    it('rejects an incorrect password', () => {
        expect(verifyAdminPassword('definitely-not-the-password')).toBe(false);
    });

    it('rejects an empty password', () => {
        expect(verifyAdminPassword('')).toBe(false);
    });
});

describe('proof-of-work challenge', () => {
    it('accepts a correctly solved challenge exactly once', () => {
        const { challenge, difficulty } = issueChallenge();
        let nonce = 0;
        while (!createHash('sha256').update(`${challenge}:${nonce}`).digest('hex').startsWith('0'.repeat(difficulty))) {
            nonce += 1;
        }
        expect(verifyAndConsumeChallenge(challenge, String(nonce))).toBe(true);
        // Replaying the same solved challenge must fail (one-time use).
        expect(verifyAndConsumeChallenge(challenge, String(nonce))).toBe(false);
    });

    it('rejects an unknown challenge', () => {
        expect(verifyAndConsumeChallenge('not-a-real-challenge', '0')).toBe(false);
    });
});

describe('CSRF double-submit check', () => {
    it('matches identical cookie and header tokens', () => {
        const token = generateCsrfToken();
        expect(csrfTokensMatch(token, token)).toBe(true);
    });

    it('rejects mismatched tokens', () => {
        expect(csrfTokensMatch(generateCsrfToken(), generateCsrfToken())).toBe(false);
    });

    it('rejects a missing header token', () => {
        expect(csrfTokensMatch(generateCsrfToken(), null)).toBe(false);
    });
});

describe('ephemeral rate limiting', () => {
    it('allows requests under the limit and blocks once exceeded', () => {
        const key = `test-${generateSessionToken()}`;
        expect(checkRateLimit(key, 2, 60_000).allowed).toBe(true);
        expect(checkRateLimit(key, 2, 60_000).allowed).toBe(true);
        expect(checkRateLimit(key, 2, 60_000).allowed).toBe(false);
    });
});
