'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchJson } from '@/lib/client/http';

const STATUSES = [
    { value: 'open', label: '접수됨' },
    { value: 'reviewing', label: '검토 중' },
    { value: 'resolved', label: '처리 완료' },
    { value: 'dismissed', label: '기각' }
];

export function ReportStatusControl({ publicId, status }: { publicId: string; status: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleChange(next: string) {
        setLoading(true);
        try {
            await fetchJson(`/api/admin/reports/${publicId}`, { method: 'PATCH', body: JSON.stringify({ status: next }) });
            router.refresh();
        } finally {
            setLoading(false);
        }
    }

    return (
        <select
            value={status}
            disabled={loading}
            onChange={(e) => handleChange(e.target.value)}
            className="min-h-[36px] rounded-lg border border-border bg-bg px-2 text-[12px] text-ink"
        >
            {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                    {s.label}
                </option>
            ))}
        </select>
    );
}
