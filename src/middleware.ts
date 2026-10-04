import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type SetAllCookies } from '@supabase/ssr';
import { env } from '@/lib/env';

export async function middleware(request: NextRequest) {
    if (!request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname === '/admin/login') {
        return NextResponse.next();
    }

    let response = NextResponse.next({ request });

    if (!env.supabaseUrl || !env.supabaseAnonKey) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const setAll: SetAllCookies = (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
    };

    const supabase = createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
        cookies: {
            getAll() {
                return request.cookies.getAll();
            },
            setAll
        }
    });

    const {
        data: { user }
    } = await supabase.auth.getUser();

    const isAllowlisted = Boolean(user?.email && env.adminEmails.includes(user.email.toLowerCase()));

    if (!isAllowlisted) {
        const loginUrl = new URL('/admin/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    return response;
}

export const config = {
    matcher: ['/admin/:path*']
};
