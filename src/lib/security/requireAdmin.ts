import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from './adminSession';

export async function requireAdminSession(request: NextRequest): Promise<NextResponse | null> {
    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const valid = await verifyAdminSession(token);
    if (!valid) {
        return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }
    return null;
}
