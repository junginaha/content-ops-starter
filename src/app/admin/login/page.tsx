'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { fetchJson, ApiError } from '@/lib/client/http';

export default function AdminLoginPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await fetchJson('/api/admin/login', { method: 'POST', body: JSON.stringify({ password }) });
            router.push('/admin');
            router.refresh();
        } catch (err) {
            if (err instanceof ApiError && err.status === 429) {
                setError('시도 횟수가 많습니다. 잠시 후 다시 시도해 주세요.');
            } else {
                setError('비밀번호가 올바르지 않습니다.');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container className="flex min-h-screen flex-col items-center justify-center gap-6">
            <p className="text-[15px] font-semibold text-ink">진주 관리자</p>
            <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-3">
                <label htmlFor="password" className="text-[13px] font-medium text-ink-soft">
                    관리자 비밀번호
                </label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    className="min-h-[48px] rounded-xl border border-border bg-surface px-4 text-[15px] text-ink focus-visible:outline-2 focus-visible:outline-action"
                />
                {error && (
                    <p role="alert" className="text-[13px] text-accent">
                        {error}
                    </p>
                )}
                <Button type="submit" disabled={!password || loading} fullWidth>
                    {loading ? '확인 중...' : '로그인'}
                </Button>
            </form>
        </Container>
    );
}
