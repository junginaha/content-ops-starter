import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';

/**
 * Anonymous Supabase client for public archive reads (RLS-restricted to
 * status = 'published'). Safe to use in Server Components; carries no
 * service-role privileges.
 */
export function createSupabasePublicClient() {
    if (!env.supabaseUrl || !env.supabaseAnonKey) {
        throw new Error('Supabase is not configured: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
    }
    return createClient(env.supabaseUrl, env.supabaseAnonKey, {
        auth: { persistSession: false, autoRefreshToken: false }
    });
}
