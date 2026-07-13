import { describe, expect, it } from 'vitest';
import { sanitizeRequestSchema, createPostRequestSchema, MAX_TEXT_LENGTH } from '@/lib/validation/schemas';

const antiAbuse = { website: '', challenge: 'abc', nonce: '1' };

describe('sanitizeRequestSchema — input length limits', () => {
    it('accepts text within the limit', () => {
        const result = sanitizeRequestSchema.safeParse({ text: '안녕하세요', ...antiAbuse });
        expect(result.success).toBe(true);
    });

    it('rejects empty text', () => {
        const result = sanitizeRequestSchema.safeParse({ text: '', ...antiAbuse });
        expect(result.success).toBe(false);
    });

    it('rejects text longer than the maximum length', () => {
        const result = sanitizeRequestSchema.safeParse({ text: 'a'.repeat(MAX_TEXT_LENGTH + 1), ...antiAbuse });
        expect(result.success).toBe(false);
    });
});

describe('honeypot field', () => {
    it('rejects a request where the honeypot field is filled in', () => {
        const result = sanitizeRequestSchema.safeParse({ text: '안녕하세요', challenge: 'abc', nonce: '1', website: 'http://spam.example' });
        expect(result.success).toBe(false);
    });
});

describe('createPostRequestSchema', () => {
    it('never accepts a client-supplied risk level (server always recomputes it)', () => {
        const shape = createPostRequestSchema.shape as Record<string, unknown>;
        expect(shape.riskLevel).toBeUndefined();
    });

    it('requires a valid mode and visibility', () => {
        const result = createPostRequestSchema.safeParse({ sanitizedText: '내용', mode: 'not_a_mode', visibility: 'private', ...antiAbuse });
        expect(result.success).toBe(false);
    });

    it('accepts a well-formed request', () => {
        const result = createPostRequestSchema.safeParse({ sanitizedText: '내용', mode: 'confess', visibility: 'private', ...antiAbuse });
        expect(result.success).toBe(true);
    });
});
