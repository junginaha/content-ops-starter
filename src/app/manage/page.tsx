'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { TopBar } from '@/components/ui/TopBar';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { fetchJson } from '@/lib/client/http';

type Kind = 'post' | 'room';

function DeleteForm({ kind }: { kind: Kind }) {
    const searchParams = useSearchParams();
    const [id, setId] = useState(kind === 'post' ? (searchParams.get('shareId') ?? '') : '');
    const [deleteKey, setDeleteKey] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
    const [message, setMessage] = useState('');

    async function handleDelete() {
        setStatus('loading');
        try {
            const endpoint = kind === 'post' ? `/api/posts/${id}/delete` : `/api/rooms/${id}/delete`;
            await fetchJson(endpoint, { method: 'POST', body: JSON.stringify({ deleteKey }) });
            setStatus('done');
            setMessage(kind === 'post' ? '글이 삭제되었습니다.' : '의견함이 삭제되었습니다.');
        } catch {
            setStatus('error');
            setMessage('삭제할 수 없습니다. 코드와 삭제 키를 다시 확인해 주세요.');
        }
    }

    return (
        <div className="flex flex-col gap-3">
            <label htmlFor={`${kind}-id`} className="text-[13px] font-medium text-ink-soft">
                {kind === 'post' ? '글 링크 코드' : '의견함 코드'}
            </label>
            <input
                id={`${kind}-id`}
                value={id}
                onChange={(e) => setId(e.target.value.trim())}
                className="min-h-[48px] rounded-xl border border-border bg-surface px-4 text-[15px] text-ink focus-visible:outline-2 focus-visible:outline-action"
            />
            <label htmlFor={`${kind}-key`} className="text-[13px] font-medium text-ink-soft">
                삭제 키
            </label>
            <input
                id={`${kind}-key`}
                value={deleteKey}
                onChange={(e) => setDeleteKey(e.target.value.trim())}
                type="password"
                className="min-h-[48px] rounded-xl border border-border bg-surface px-4 text-[15px] text-ink focus-visible:outline-2 focus-visible:outline-action"
            />
            {status !== 'idle' && (
                <p role="status" className={status === 'error' ? 'text-[13px] text-accent' : 'text-[13px] text-ink'}>
                    {status === 'loading' ? '처리 중...' : message}
                </p>
            )}
            <Button variant="danger" onClick={handleDelete} disabled={!id || !deleteKey || status === 'loading'} fullWidth>
                삭제하기
            </Button>
        </div>
    );
}

export default function ManagePage() {
    const [tab, setTab] = useState<Kind>('post');

    return (
        <div className="min-h-screen">
            <TopBar backHref="/" title="관리하기" />
            <Container className="flex flex-col gap-6 py-6">
                <p className="text-[14px] leading-relaxed text-ink-soft">
                    글 또는 의견함을 만들 때 발급된 삭제 키로 직접 삭제할 수 있습니다. 삭제 키는 서버에 원문 그대로 저장되지 않으며, 분실 시 복구할 수 없습니다.
                </p>
                <div className="flex gap-2 rounded-xl border border-border bg-surface p-1">
                    <button
                        type="button"
                        onClick={() => setTab('post')}
                        className={`min-h-[40px] flex-1 rounded-lg text-[14px] font-medium transition-colors duration-150 ${tab === 'post' ? 'bg-action text-white' : 'text-ink-soft'}`}
                    >
                        글 삭제
                    </button>
                    <button
                        type="button"
                        onClick={() => setTab('room')}
                        className={`min-h-[40px] flex-1 rounded-lg text-[14px] font-medium transition-colors duration-150 ${tab === 'room' ? 'bg-action text-white' : 'text-ink-soft'}`}
                    >
                        의견함 삭제
                    </button>
                </div>
                <Suspense>
                    <DeleteForm key={tab} kind={tab} />
                </Suspense>
            </Container>
        </div>
    );
}
