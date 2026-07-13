import { NextRequest, NextResponse } from 'next/server';
import { checkCsrf } from '@/lib/security/apiGuard';
import { ADMIN_SESSION_COOKIE, revokeAdminSession } from '@/lib/security/adminSession';

export async function POST(request: NextRequest) {
    const csrfResponse = checkCsrf(request);
    if (csrfResponse) return csrfResponse;

    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    await revokeAdminSession(token);

    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_SESSION_COOKIE, '', { path: '/', maxAge: 0 });
    return response;
}
