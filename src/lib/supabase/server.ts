import { createServerClient, type SetAllCookies } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { env } from '@/lib/env';

/**
 * Server-side Supabase client bound to the request's cookies (used in
 * server components / route handlers that need the signed-in user's session,
 * e.g. the admin area). Respects RLS.
 */
export async function createSupabaseServerClient() {
    const cookieStore = await cookies();

    const setAll: SetAllCookies = (cookiesToSet) => {
        try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
            // Called from a Server Component render; middleware refreshes the session instead.
        }
    };

    return createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
        cookies: {
            getAll() {
                return cookieStore.getAll();
            },
            setAll
        }
    });
}
