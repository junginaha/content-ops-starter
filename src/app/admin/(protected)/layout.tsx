import Link from 'next/link';
import { requireAdminUser } from '@/lib/admin-auth';
import { signOutAction } from '@/app/admin/actions';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const { email } = await requireAdminUser();

    return (
        <div className="container-editorial py-10">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
                <nav className="flex items-center gap-6 text-sm">
                    <Link href="/admin" className="font-serif text-lg text-ink">
                        Travelog Admin
                    </Link>
                    <Link href="/admin/posters" className="text-stone transition-colors hover:text-ink">
                        Posters
                    </Link>
                    <Link href="/admin/purchases" className="text-stone transition-colors hover:text-ink">
                        Purchases
                    </Link>
                </nav>
                <div className="flex items-center gap-4 text-xs text-stone">
                    <span>{email}</span>
                    <form action={signOutAction}>
                        <button type="submit" className="underline decoration-line underline-offset-4 hover:text-ink">
                            로그아웃
                        </button>
                    </form>
                </div>
            </div>
            {children}
        </div>
    );
}
