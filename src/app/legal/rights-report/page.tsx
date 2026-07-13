'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { TopBar } from '@/components/ui/TopBar';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { fetchJson } from '@/lib/client/http';

const REASONS: Array<{ value: string; label: string }> = [
    { value: 'personal_data', label: '개인정보 노출' },
    { value: 'defamation', label: '명예훼손' },
    { value: 'impersonation', label: '사칭' },
    { value: 'copyright', label: '저작권 침해' },
    { value: 'other', label: '기타' }
];

function ReportForm() {
    const searchParams = useSearchParams();
    const [targetPostPublicId, setTargetPostPublicId] = useState(searchParams.get('target') ?? '');
    const [reason, setReason] = useState('personal_data');
    const [description, setDescription] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

    async function handleSubmit() {
        setStatus('loading');
        try {
            await fetchJson('/api/reports', {
                method: 'POST',
                body: JSON.stringify({ targetPostPublicId, reason, description, contactEmail: contactEmail || undefined })
            });
            setStatus('done');
        } catch {
            setStatus('error');
        }
    }

    if (status === 'done') {
        return <p className="text-[15px] text-ink">신고가 접수되었습니다. 운영팀이 검토 후 필요한 조치를 취합니다.</p>;
    }

    return (
        <div className="flex flex-col gap-4">
            <p className="text-[13px] leading-relaxed text-ink-soft">
                신고 접수를 위해 최소한의 정보만 수집합니다. 연락처는 답변이 필요한 경우에만 선택적으로 입력해 주세요.
            </p>

            <label htmlFor="target" className="text-[13px] font-medium text-ink-soft">
                신고 대상 글 코드
            </label>
            <input
                id="target"
                value={targetPostPublicId}
                onChange={(e) => setTargetPostPublicId(e.target.value.trim())}
                className="min-h-[48px] rounded-xl border border-border bg-surface px-4 text-[15px] text-ink focus-visible:outline-2 focus-visible:outline-action"
            />

            <label htmlFor="reason" className="text-[13px] font-medium text-ink-soft">
                신고 사유
            </label>
            <select
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="min-h-[48px] rounded-xl border border-border bg-surface px-4 text-[15px] text-ink focus-visible:outline-2 focus-visible:outline-action"
            >
                {REASONS.map((r) => (
                    <option key={r.value} value={r.value}>
                        {r.label}
                    </option>
                ))}
            </select>

            <label htmlFor="description" className="text-[13px] font-medium text-ink-soft">
                상세 내용
            </label>
            <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, 2000))}
                rows={6}
                className="resize-none rounded-xl border border-border bg-surface p-3.5 text-[14px] text-ink focus-visible:outline-2 focus-visible:outline-action"
            />

            <label htmlFor="contact" className="text-[13px] font-medium text-ink-soft">
                답변받을 이메일 (선택)
            </label>
            <input
                id="contact"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value.trim())}
                className="min-h-[48px] rounded-xl border border-border bg-surface px-4 text-[15px] text-ink focus-visible:outline-2 focus-visible:outline-action"
            />

            {status === 'error' && (
                <p role="alert" className="text-[13px] text-accent">
                    접수 중 문제가 발생했습니다. 글 코드를 확인한 뒤 다시 시도해 주세요.
                </p>
            )}

            <Button onClick={handleSubmit} disabled={!targetPostPublicId || !description || status === 'loading'} fullWidth>
                {status === 'loading' ? '접수하는 중...' : '신고 접수하기'}
            </Button>
        </div>
    );
}

export default function RightsReportPage() {
    return (
        <div className="min-h-screen">
            <TopBar backHref="/" title="권리침해 신고" />
            <Container className="flex flex-col gap-4 py-6">
                <Suspense>
                    <ReportForm />
                </Suspense>
            </Container>
        </div>
    );
}
