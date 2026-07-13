'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchJson } from '@/lib/client/http';

const ACTIONS: Array<{ key: string; label: string }> = [
    { key: 'approve', label: '승인' },
    { key: 'reject', label: '거부' },
    { key: 'hide', label: '숨김' },
    { key: 'block', label: '차단' },
    { key: 'unblock', label: '차단 해제' }
];

export function ModerationActions({ publicId }: { publicId: string }) {
    const router = useRouter();
    const [pending, setPending] = useState<string | null>(null);

    async function apply(action: string) {
        setPending(action);
        try {
            await fetchJson(`/api/admin/posts/${publicId}`, { method: 'PATCH', body: JSON.stringify({ action }) });
            router.refresh();
        } finally {
            setPending(null);
        }
    }

    return (
        <div className="flex flex-wrap gap-2">
            {ACTIONS.map((action) => (
                <button
                    key={action.key}
                    type="button"
                    onClick={() => apply(action.key)}
                    disabled={pending !== null}
                    className="min-h-[36px] rounded-lg border border-border bg-bg px-3 text-[12px] font-medium text-ink transition-colors duration-150 hover:border-action disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {pending === action.key ? '처리 중...' : action.label}
                </button>
            ))}
        </div>
    );
}
