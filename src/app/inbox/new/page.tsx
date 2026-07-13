'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TopBar } from '@/components/ui/TopBar';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { CopyField } from '@/components/ui/CopyField';
import { fetchJson, withAntiAbuseFields } from '@/lib/client/http';

interface CreateRoomResponse {
    publicId: string;
    deleteKey: string;
    kind: string;
}

export default function NewInboxPage() {
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<CreateRoomResponse | null>(null);

    async function handleCreate() {
        setLoading(true);
        setError(null);
        try {
            const payload = await withAntiAbuseFields({ title: title.trim() || undefined, kind: 'personal_inbox' as const });
            const res = await fetchJson<CreateRoomResponse>('/api/rooms', { method: 'POST', body: JSON.stringify(payload) });
            setResult(res);
        } catch {
            setError('의견함을 만드는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen">
            <TopBar backHref="/" title="의견함 만들기" />
            <Container className="flex flex-col gap-4 py-6">
                {!result ? (
                    <>
                        <p className="text-[14px] leading-relaxed text-ink-soft">
                            사람들이 익명으로 이야기를 전할 수 있는 나만의 의견함을 만듭니다. 이름은 선택 사항이며, 다른 사람에게 공개됩니다.
                        </p>
                        <label htmlFor="inbox-title" className="text-[13px] font-medium text-ink-soft">
                            의견함 이름 (선택)
                        </label>
                        <input
                            id="inbox-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value.slice(0, 80))}
                            placeholder="예: 우리 팀 의견함"
                            className="min-h-[48px] rounded-xl border border-border bg-surface px-4 text-[15px] text-ink focus-visible:outline-2 focus-visible:outline-action"
                        />
                        {error && (
                            <p role="alert" className="text-[13px] text-accent">
                                {error}
                            </p>
                        )}
                        <Button onClick={handleCreate} disabled={loading} fullWidth>
                            {loading ? '만드는 중...' : '의견함 만들기'}
                        </Button>
                    </>
                ) : (
                    <>
                        <p className="text-[15px] font-medium text-ink">의견함이 만들어졌습니다.</p>
                        <CopyField label="의견함 링크" value={typeof window !== 'undefined' ? `${window.location.origin}/inbox/${result.publicId}` : `/inbox/${result.publicId}`} />
                        <CopyField label="의견함 코드 (전달받을 때 공유)" value={result.publicId} />
                        <div className="rounded-xl border border-accent/30 bg-accent/5 p-4">
                            <p className="mb-2 text-[13px] font-medium text-accent">이 삭제 키는 지금 한 번만 표시됩니다. 반드시 저장해 주세요.</p>
                            <CopyField label="삭제 키" value={result.deleteKey} />
                        </div>
                        <Link href={`/inbox/${result.publicId}`}>
                            <Button variant="secondary" fullWidth>
                                의견함으로 이동
                            </Button>
                        </Link>
                    </>
                )}
            </Container>
        </div>
    );
}
