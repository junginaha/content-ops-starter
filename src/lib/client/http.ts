'use client';

export class ApiError extends Error {
    status: number;
    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

export function getCsrfToken(): string {
    const match = document.cookie.match(/(?:^|; )jinjoo_csrf=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : '';
}

export async function solveChallenge(challenge: string, difficulty: number): Promise<string> {
    const target = '0'.repeat(difficulty);
    const encoder = new TextEncoder();
    let nonce = 0;
    // Bounded to avoid a pathological infinite loop; difficulty 3-4 resolves in well under this.
    while (nonce < 5_000_000) {
        const data = encoder.encode(`${challenge}:${nonce}`);
        const digest = await crypto.subtle.digest('SHA-256', data);
        const hex = Array.from(new Uint8Array(digest))
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('');
        if (hex.startsWith(target)) return String(nonce);
        nonce += 1;
    }
    throw new Error('challenge_unsolved');
}

export async function fetchChallenge(): Promise<{ challenge: string; difficulty: number }> {
    return fetchJson('/api/challenge', { method: 'POST' });
}

export async function withAntiAbuseFields<T extends Record<string, unknown>>(fields: T): Promise<T & { website: string; challenge: string; nonce: string }> {
    const { challenge, difficulty } = await fetchChallenge();
    const nonce = await solveChallenge(challenge, difficulty);
    return { ...fields, website: '', challenge, nonce };
}

export async function fetchJson<T>(url: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
        'content-type': 'application/json',
        'x-csrf-token': getCsrfToken()
    };
    if (options.headers) {
        Object.assign(headers, options.headers as Record<string, string>);
    }

    const res = await fetch(url, { ...options, headers });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new ApiError(res.status, (body as { error?: string }).error || 'request_failed');
    }
    return body as T;
}
