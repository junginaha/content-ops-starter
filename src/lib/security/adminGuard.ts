import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from './adminSession';

export async function requireAdminPage(): Promise<void> {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
    const valid = await verifyAdminSession(token);
    if (!valid) redirect('/admin/login');
}
