import { NextRequest, NextResponse } from 'next/server';
import { csrfTokensMatch, CSRF_COOKIE_NAME, CSRF_HEADER_NAME } from './csrf';
import { checkRateLimit, requestKeyFromHeaders } from './rateLimit';
import { verifyAndConsumeChallenge } from './pow';

export function checkCsrf(request: NextRequest): NextResponse | null {
    const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value;
    const headerToken = request.headers.get(CSRF_HEADER_NAME);
    if (!csrfTokensMatch(cookieToken, headerToken)) {
        return NextResponse.json({ error: 'invalid_csrf' }, { status: 403 });
    }
    return null;
}

export function checkRateLimited(request: NextRequest, bucket: string, limit: number, windowMs: number): NextResponse | null {
    const ip = requestKeyFromHeaders(request.headers);
    const { allowed } = checkRateLimit(`${bucket}:${ip}`, limit, windowMs);
    if (!allowed) {
        return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
    }
    return null;
}

export function checkProofOfWork(challenge: string, nonce: string): NextResponse | null {
    if (!verifyAndConsumeChallenge(challenge, nonce)) {
        return NextResponse.json({ error: 'invalid_challenge' }, { status: 400 });
    }
    return null;
}
