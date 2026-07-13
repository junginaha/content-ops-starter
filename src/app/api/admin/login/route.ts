import { NextRequest, NextResponse } from 'next/server';
import { checkCsrf, checkRateLimited } from '@/lib/security/apiGuard';
import { adminLoginRequestSchema } from '@/lib/validation/schemas';
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_TTL_MS, createAdminSession, verifyAdminPassword } from '@/lib/security/adminSession';
import { logEvent } from '@/lib/logging/logger';

export async function POST(request: NextRequest) {
    const csrfResponse = checkCsrf(request);
    if (csrfResponse) return csrfResponse;

    const rateLimitResponse = checkRateLimited(request, 'admin_login', 5, 15 * 60_000);
    if (rateLimitResponse) return rateLimitResponse;

    const json = await request.json().catch(() => null);
    const parsed = adminLoginRequestSchema.safeParse(json);
    if (!parsed.success) {
        return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
    }

    if (!verifyAdminPassword(parsed.data.password)) {
        logEvent('admin_login_failed');
        return NextResponse.json({ error: 'invalid_credentials' }, { status: 401 });
    }

    const { token, expiresAt } = await createAdminSession();
    logEvent('admin_login_success');

    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        expires: expiresAt,
        maxAge: ADMIN_SESSION_TTL_MS / 1000
    });
    return response;
}
