import { createHash, randomBytes } from 'node:crypto';

/**
 * Lightweight proof-of-work challenge to slow down scripted abuse without persisting anything.
 * Challenges live only in memory for up to 5 minutes and are consumed on first use.
 */
const CHALLENGE_TTL_MS = 5 * 60 * 1000;
const DIFFICULTY = 3; // required leading hex zeros

interface Challenge {
    expiresAt: number;
    difficulty: number;
}

const challenges = new Map<string, Challenge>();

function purgeExpired(now: number) {
    for (const [key, value] of challenges) {
        if (value.expiresAt <= now) challenges.delete(key);
    }
}

export function issueChallenge(): { challenge: string; difficulty: number } {
    const now = Date.now();
    if (challenges.size > 2000) purgeExpired(now);

    const challenge = randomBytes(16).toString('hex');
    challenges.set(challenge, { expiresAt: now + CHALLENGE_TTL_MS, difficulty: DIFFICULTY });
    return { challenge, difficulty: DIFFICULTY };
}

export function verifyAndConsumeChallenge(challenge: string, nonce: string): boolean {
    const record = challenges.get(challenge);
    if (!record) return false;
    challenges.delete(challenge);

    if (record.expiresAt <= Date.now()) return false;

    const hash = createHash('sha256').update(`${challenge}:${nonce}`).digest('hex');
    return hash.startsWith('0'.repeat(record.difficulty));
}
