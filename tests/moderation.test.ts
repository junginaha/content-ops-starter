import { describe, expect, it } from 'vitest';
import { computeExpiresAt, computeModerationStatus, isViewableInFeed } from '@/lib/moderation';

describe('computeModerationStatus — high-risk auto-publication prevention', () => {
    it('never auto-approves high risk content for any public-facing visibility', () => {
        expect(computeModerationStatus('unlisted', 'high')).toBe('pending');
        expect(computeModerationStatus('inbox', 'high')).toBe('pending');
        expect(computeModerationStatus('public_review', 'high')).toBe('pending');
    });

    it('never auto-approves urgent risk content for any public-facing visibility', () => {
        expect(computeModerationStatus('unlisted', 'urgent')).toBe('pending');
        expect(computeModerationStatus('inbox', 'urgent')).toBe('pending');
        expect(computeModerationStatus('public_review', 'urgent')).toBe('pending');
    });

    it('always requires review for an explicit public-review request, regardless of risk', () => {
        expect(computeModerationStatus('public_review', 'low')).toBe('pending');
    });

    it('auto-approves low/medium risk private or unlisted content', () => {
        expect(computeModerationStatus('private', 'low')).toBe('auto_approved');
        expect(computeModerationStatus('private', 'urgent')).toBe('auto_approved');
        expect(computeModerationStatus('unlisted', 'medium')).toBe('auto_approved');
    });

    it('isViewableInFeed only allows auto_approved and approved statuses', () => {
        expect(isViewableInFeed('auto_approved')).toBe(true);
        expect(isViewableInFeed('approved')).toBe(true);
        expect(isViewableInFeed('pending')).toBe(false);
        expect(isViewableInFeed('rejected')).toBe(false);
        expect(isViewableInFeed('hidden')).toBe(false);
        expect(isViewableInFeed('blocked')).toBe(false);
    });
});

describe('computeExpiresAt — retention window', () => {
    it('gives private and unlisted posts a 90-day retention window', () => {
        const from = new Date('2026-01-01T00:00:00Z');
        expect(computeExpiresAt('private', from)).toEqual(new Date('2026-04-01T00:00:00Z'));
        expect(computeExpiresAt('unlisted', from)).toEqual(new Date('2026-04-01T00:00:00Z'));
    });

    it('does not set an expiry for inbox or public-review content', () => {
        expect(computeExpiresAt('inbox')).toBeNull();
        expect(computeExpiresAt('public_review')).toBeNull();
    });
});
