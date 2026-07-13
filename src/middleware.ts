import { NextRequest, NextResponse } from 'next/server';
import { CSRF_COOKIE_NAME, generateCsrfToken } from './lib/security/csrf';

export function middleware(request: NextRequest) {
    const response = NextResponse.next();
    if (!request.cookies.get(CSRF_COOKIE_NAME)) {
        response.cookies.set(CSRF_COOKIE_NAME, generateCsrfToken(), {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 6
        });
    }
    return response;
}

export const runtime = 'nodejs';

export const config = {
    matcher: '/((?!_next/static|_next/image|favicon.ico).*)'
};
