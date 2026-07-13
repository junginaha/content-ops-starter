import 'server-only';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { env } from '@/lib/env';

/** Defense-in-depth check re-run inside every admin server component/action, in addition to middleware. */
export async function requireAdminUser() {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user }
    } = await supabase.auth.getUser();

    const email = user?.email?.toLowerCase();
    if (!email || !env.adminEmails.includes(email)) {
        redirect('/admin/login');
    }

    return { email };
}
