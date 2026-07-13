import type { RiskLevel } from './ai/types';

export type Visibility = 'private' | 'unlisted' | 'inbox' | 'public_review';
export type ModerationStatus = 'auto_approved' | 'pending' | 'approved' | 'rejected' | 'hidden' | 'blocked';

/**
 * Content is never auto-published when risk is high/urgent, and any explicit public-review
 * request always goes through the moderation queue regardless of risk.
 */
export function computeModerationStatus(visibility: Visibility, riskLevel: RiskLevel): ModerationStatus {
    // A private save is never "published" to anyone but the link holder, so it is exempt from
    // the risk-based review gate below (the person can always keep their own words for themselves).
    if (visibility === 'private') return 'auto_approved';
    if (visibility === 'public_review') return 'pending';
    if (riskLevel === 'high' || riskLevel === 'urgent') return 'pending';
    return 'auto_approved';
}

export function isViewableInFeed(status: ModerationStatus): boolean {
    return status === 'auto_approved' || status === 'approved';
}

/**
 * When the reviewed text carries urgent risk (e.g. self-harm signals), the composer only allows
 * a private, personal save or a jump to crisis resources — every other destination is disabled
 * so nothing that risky can be pushed toward another person, even accidentally.
 */
export function isDestinationAllowed(destination: Visibility | 'crisis', riskLevel: RiskLevel): boolean {
    if (riskLevel !== 'urgent') return true;
    return destination === 'private' || destination === 'crisis';
}

const PRIVATE_CONTENT_RETENTION_MS = 90 * 24 * 60 * 60 * 1000; // 90 days

/**
 * Private/unlisted posts are personal, unlisted-by-nature content with no owner account to prompt
 * renewal, so they carry a fixed retention window that a periodic job (scripts/retention.ts)
 * enforces. Content meant for others (inbox submissions, public-review requests) has no fixed
 * expiry — its lifecycle is driven by moderation instead.
 */
export function computeExpiresAt(visibility: Visibility, from: Date = new Date()): Date | null {
    if (visibility === 'private' || visibility === 'unlisted') {
        return new Date(from.getTime() + PRIVATE_CONTENT_RETENTION_MS);
    }
    return null;
}
