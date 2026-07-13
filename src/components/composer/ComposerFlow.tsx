'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import classNames from 'classnames';
import { TopBar } from '@/components/ui/TopBar';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { PrivacyStatus } from '@/components/ui/PrivacyStatus';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { AiDisclosure } from '@/components/ui/AiDisclosure';
import { CopyField } from '@/components/ui/CopyField';
import { fetchJson, withAntiAbuseFields, ApiError } from '@/lib/client/http';
import { MAX_TEXT_LENGTH } from '@/lib/validation/schemas';
import { MODE_LABELS, VISIBILITY_LABELS } from '@/lib/constants';
import { isDestinationAllowed } from '@/lib/moderation';
import type { DetectedIssue, RiskLevel } from '@/lib/ai/types';

type Mode = 'confess' | 'ask_opinion' | 'anonymous_say' | 'propose_to_org';
type Visibility = 'private' | 'unlisted' | 'inbox' | 'public_review';
type Step = 'input' | 'review' | 'destination' | 'inbox_target' | 'done';

interface SanitizeResponse {
    sanitizedText: string;
    riskLevel: RiskLevel;
    detectedIssues: DetectedIssue[];
    explanation: string;
    recommendedAction: string;
}

interface CreatePostResponse {
    publicId: string;
    deleteKey: string;
    riskLevel: RiskLevel;
    moderationStatus: string;
}

const DESTINATIONS: Array<{ key: Visibility | 'crisis'; label: string; description: string }> = [
    { key: 'private', label: VISIBILITY_LABELS.private, description: '나만 볼 수 있는 링크로 안전하게 보관해요.' },
    { key: 'unlisted', label: VISIBILITY_LABELS.unlisted, description: '링크를 아는 사람만 볼 수 있어요.' },
    { key: 'inbox', label: VISIBILITY_LABELS.inbox, description: '의견함 코드를 가진 곳으로 전달해요.' },
    { key: 'public_review', label: VISIBILITY_LABELS.public_review, description: '운영팀 검토 후 공개 여부가 결정돼요.' },
    { key: 'crisis', label: '공식 도움기관 확인', description: '전달 없이 도움받을 수 있는 곳을 안내해요.' }
];

export function ComposerFlow({ mode }: { mode: Mode }) {
    const router = useRouter();
    const [step, setStep] = useState<Step>('input');
    const [rawText, setRawText] = useState('');
    const [editedText, setEditedText] = useState('');
    const [result, setResult] = useState<SanitizeResponse | null>(null);
    const [targetRoomId, setTargetRoomId] = useState('');
    const [createResult, setCreateResult] = useState<CreatePostResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const modeLabel = MODE_LABELS[mode];

    async function handleSanitize() {
        setError(null);
        setLoading(true);
        try {
            const payload = await withAntiAbuseFields({ text: rawText });
            const res = await fetchJson<SanitizeResponse>('/api/sanitize', { method: 'POST', body: JSON.stringify(payload) });
            setResult(res);
            setEditedText(res.sanitizedText);
            setStep('review');
        } catch {
            setError('내용을 정리하는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.');
        } finally {
            setLoading(false);
        }
    }

    async function handleCreate(visibility: Visibility, roomId?: string) {
        setError(null);
        setLoading(true);
        try {
            const payload = await withAntiAbuseFields({
                sanitizedText: editedText,
                mode,
                visibility,
                targetRoomId: roomId
            });
            const res = await fetchJson<CreatePostResponse>('/api/posts', { method: 'POST', body: JSON.stringify(payload) });
            setCreateResult(res);
            setStep('done');
        } catch (e) {
            if (e instanceof ApiError && e.message === 'room_not_found') {
                setError('의견함 코드를 찾을 수 없습니다. 코드를 다시 확인해 주세요.');
            } else {
                setError('전달하는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.');
            }
        } finally {
            setLoading(false);
        }
    }

    function handleDestinationSelect(key: Visibility | 'crisis') {
        if (key === 'crisis') {
            router.push('/crisis');
            return;
        }
        if (key === 'inbox') {
            setStep('inbox_target');
            return;
        }
        handleCreate(key);
    }

    return (
        <div className="flex min-h-screen flex-col pb-28">
            <TopBar backHref={step === 'input' ? '/' : undefined} title={modeLabel} />

            {step === 'input' && (
                <Container className="flex flex-1 flex-col gap-4 py-6">
                    <PrivacyStatus />
                    <label htmlFor="composer-text" className="sr-only">
                        하고 싶은 말
                    </label>
                    <textarea
                        id="composer-text"
                        value={rawText}
                        onChange={(e) => setRawText(e.target.value.slice(0, MAX_TEXT_LENGTH))}
                        placeholder="하고 싶은 말을 그대로 적으세요."
                        rows={10}
                        maxLength={MAX_TEXT_LENGTH}
                        className="min-h-[240px] flex-1 resize-none rounded-2xl border border-border bg-surface p-4 text-[16px] leading-relaxed text-ink placeholder:text-ink-soft/70 focus-visible:outline-2 focus-visible:outline-action"
                    />
                    <p className="text-right text-[12px] text-ink-soft" aria-live="polite">
                        {rawText.length} / {MAX_TEXT_LENGTH}
                    </p>
                    {error && (
                        <p role="alert" className="text-[13px] text-accent">
                            {error}
                        </p>
                    )}
                </Container>
            )}

            {step === 'review' && result && (
                <Container className="flex flex-1 flex-col gap-5 py-6">
                    <div className="flex items-center justify-between">
                        <RiskBadge risk={result.riskLevel} />
                    </div>

                    {result.riskLevel === 'urgent' && (
                        <div className="rounded-xl border border-accent/30 bg-accent/5 p-4 text-[14px] leading-relaxed text-ink">
                            지금 작성하신 내용에 위험 신호가 감지되었습니다.{' '}
                            <Link href="/crisis" className="font-medium text-accent underline underline-offset-2">
                                공식 도움기관 정보
                            </Link>
                            를 꼭 확인해 주세요.
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <p className="mb-1.5 text-[13px] font-medium text-ink-soft">원문</p>
                            <div className="max-h-64 overflow-y-auto rounded-xl border border-border bg-bg p-3.5 text-[14px] leading-relaxed text-ink-soft">
                                {rawText}
                            </div>
                        </div>
                        <div>
                            <p className="mb-1.5 text-[13px] font-medium text-ink-soft">안전하게 다듬은 문장 (수정 가능)</p>
                            <textarea
                                value={editedText}
                                onChange={(e) => setEditedText(e.target.value.slice(0, MAX_TEXT_LENGTH))}
                                rows={8}
                                maxLength={MAX_TEXT_LENGTH}
                                className="min-h-[160px] w-full resize-none rounded-xl border border-action/30 bg-surface p-3.5 text-[14px] leading-relaxed text-ink focus-visible:outline-2 focus-visible:outline-action"
                            />
                        </div>
                    </div>

                    {result.detectedIssues.length > 0 && (
                        <ul className="space-y-1.5 text-[13px] text-ink-soft">
                            {result.detectedIssues.map((issue, index) => (
                                <li key={`${issue.type}-${index}`} className="flex gap-2">
                                    <span aria-hidden="true">·</span>
                                    <span>{issue.description}</span>
                                </li>
                            ))}
                        </ul>
                    )}

                    <p className="text-[14px] leading-relaxed text-ink">{result.explanation}</p>
                    <p className="text-[14px] font-medium leading-relaxed text-ink">{result.recommendedAction}</p>

                    <AiDisclosure />

                    {error && (
                        <p role="alert" className="text-[13px] text-accent">
                            {error}
                        </p>
                    )}

                    <div className="flex gap-3">
                        <Button variant="secondary" onClick={() => setStep('input')}>
                            다시 쓰기
                        </Button>
                        <Button onClick={() => setStep('destination')} disabled={editedText.trim().length === 0}>
                            다음
                        </Button>
                    </div>
                </Container>
            )}

            {step === 'destination' && result && (
                <Container className="flex flex-1 flex-col gap-4 py-6">
                    <p className="text-[15px] font-medium text-ink">어디로 전달할까요?</p>
                    <div className="flex flex-col gap-3">
                        {DESTINATIONS.map((dest) => {
                            const disabled = !isDestinationAllowed(dest.key, result.riskLevel);
                            return (
                                <button
                                    key={dest.key}
                                    type="button"
                                    disabled={disabled || loading}
                                    onClick={() => handleDestinationSelect(dest.key)}
                                    className={classNames(
                                        'flex flex-col gap-0.5 rounded-2xl border p-4 text-left transition-colors duration-150',
                                        disabled ? 'cursor-not-allowed border-border bg-bg opacity-50' : 'border-border bg-surface hover:border-action'
                                    )}
                                >
                                    <span className="text-[15px] font-medium text-ink">{dest.label}</span>
                                    <span className="text-[13px] text-ink-soft">
                                        {disabled ? '위험 신호가 감지되어 지금은 선택할 수 없어요.' : dest.description}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                    {error && (
                        <p role="alert" className="text-[13px] text-accent">
                            {error}
                        </p>
                    )}
                </Container>
            )}

            {step === 'inbox_target' && (
                <Container className="flex flex-1 flex-col gap-4 py-6">
                    <p className="text-[15px] font-medium text-ink">전달할 의견함 코드를 입력하세요.</p>
                    <input
                        value={targetRoomId}
                        onChange={(e) => setTargetRoomId(e.target.value.trim())}
                        placeholder="의견함 코드"
                        aria-label="의견함 코드"
                        className="min-h-[48px] rounded-xl border border-border bg-surface px-4 text-[15px] text-ink focus-visible:outline-2 focus-visible:outline-action"
                    />
                    <Link href="/inbox/new" className="text-[13px] text-ink-soft underline decoration-border underline-offset-4">
                        새 의견함 만들기
                    </Link>
                    {error && (
                        <p role="alert" className="text-[13px] text-accent">
                            {error}
                        </p>
                    )}
                    <div className="flex gap-3">
                        <Button variant="secondary" onClick={() => setStep('destination')}>
                            뒤로
                        </Button>
                        <Button onClick={() => handleCreate('inbox', targetRoomId)} disabled={!targetRoomId || loading}>
                            전달하기
                        </Button>
                    </div>
                </Container>
            )}

            {step === 'done' && createResult && (
                <Container className="flex flex-1 flex-col gap-5 py-6">
                    <p className="text-[17px] font-semibold text-ink">
                        {createResult.moderationStatus === 'pending' ? '검토 후 전달됩니다.' : '안전하게 전달되었습니다.'}
                    </p>
                    <p className="text-[14px] leading-relaxed text-ink-soft">
                        {createResult.moderationStatus === 'pending'
                            ? '민감한 내용이 포함되어 있어 운영팀 확인 후 전달됩니다. 조금만 기다려 주세요.'
                            : '선택하신 방식으로 안전하게 정리된 내용이 전달되었습니다.'}
                    </p>

                    <CopyField label="보기 링크" value={typeof window !== 'undefined' ? `${window.location.origin}/p/${createResult.publicId}` : `/p/${createResult.publicId}`} />

                    <div className="rounded-xl border border-accent/30 bg-accent/5 p-4">
                        <p className="mb-2 text-[13px] font-medium text-accent">이 삭제 키는 지금 한 번만 표시됩니다. 반드시 저장해 주세요.</p>
                        <CopyField label="삭제 키" value={createResult.deleteKey} />
                    </div>

                    <Button variant="secondary" onClick={() => router.push('/')}>
                        처음으로
                    </Button>
                </Container>
            )}

            {step === 'input' && (
                <div className="fixed inset-x-0 bottom-0 border-t border-border bg-surface/95 backdrop-blur">
                    <Container className="py-3">
                        <Button onClick={handleSanitize} disabled={rawText.trim().length === 0 || loading} fullWidth>
                            {loading ? '정리하는 중...' : '안전하게 다듬기'}
                        </Button>
                    </Container>
                </div>
            )}
        </div>
    );
}
