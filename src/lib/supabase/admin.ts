import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';

/**
 * Service-role Supabase client. Bypasses RLS entirely — only ever import this
 * from server-only code (route handlers, server actions, the seed script).
 * NEVER import this from a Client Component or expose the key to the browser.
 *
 * Intentionally untyped (no generated Database schema) — see the note in
 * src/types/database.ts. Callers annotate their own return types.
 */
export function createSupabaseAdminClient() {
    if (!env.supabaseUrl) {
        throw new Error('Supabase is not configured: set NEXT_PUBLIC_SUPABASE_URL.');
    }
    return createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
        auth: { persistSession: false, autoRefreshToken: false }
    });
}
