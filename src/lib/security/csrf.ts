import { randomBytes, timingSafeEqual } from 'node:crypto';

export const CSRF_COOKIE_NAME = 'jinjoo_csrf';
export const CSRF_HEADER_NAME = 'x-csrf-token';

export function generateCsrfToken(): string {
    return randomBytes(24).toString('hex');
}

export function csrfTokensMatch(cookieToken: string | undefined, headerToken: string | null): boolean {
    if (!cookieToken || !headerToken) return false;
    const a = Buffer.from(cookieToken);
    const b = Buffer.from(headerToken);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
}
