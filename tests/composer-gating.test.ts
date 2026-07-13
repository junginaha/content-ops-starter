import { describe, expect, it } from 'vitest';
import { isDestinationAllowed } from '@/lib/moderation';

describe('mobile composer destination gating', () => {
    it('allows every destination when risk is low or medium', () => {
        for (const risk of ['low', 'medium'] as const) {
            expect(isDestinationAllowed('private', risk)).toBe(true);
            expect(isDestinationAllowed('unlisted', risk)).toBe(true);
            expect(isDestinationAllowed('inbox', risk)).toBe(true);
            expect(isDestinationAllowed('public_review', risk)).toBe(true);
            expect(isDestinationAllowed('crisis', risk)).toBe(true);
        }
    });

    it('still allows every destination at high risk (gating happens via moderation status, not the button)', () => {
        expect(isDestinationAllowed('public_review', 'high')).toBe(true);
    });

    it('restricts urgent risk to only private saving or crisis resources', () => {
        expect(isDestinationAllowed('private', 'urgent')).toBe(true);
        expect(isDestinationAllowed('crisis', 'urgent')).toBe(true);
        expect(isDestinationAllowed('unlisted', 'urgent')).toBe(false);
        expect(isDestinationAllowed('inbox', 'urgent')).toBe(false);
        expect(isDestinationAllowed('public_review', 'urgent')).toBe(false);
    });
});
