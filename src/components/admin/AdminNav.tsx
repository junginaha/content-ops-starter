'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import classNames from 'classnames';
import { fetchJson } from '@/lib/client/http';

const LINKS = [
    { href: '/admin', label: '검토 큐' },
    { href: '/admin/reports', label: '신고' },
    { href: '/admin/summary', label: '통계' }
];

export function AdminNav() {
    const pathname = usePathname();
    const router = useRouter();

    async function handleLogout() {
        await fetchJson('/api/admin/logout', { method: 'POST' });
        router.push('/admin/login');
        router.refresh();
    }

    return (
        <nav className="flex items-center justify-between border-b border-border bg-surface px-5 py-3">
            <div className="flex gap-4">
                {LINKS.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={classNames('text-[14px] font-medium', pathname === link.href ? 'text-ink' : 'text-ink-soft hover:text-ink')}
                    >
                        {link.label}
                    </Link>
                ))}
            </div>
            <button type="button" onClick={handleLogout} className="text-[13px] text-ink-soft hover:text-ink">
                로그아웃
            </button>
        </nav>
    );
}
