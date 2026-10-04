'use client';

import { useEffect, useState } from 'react';
import { rememberPurchase } from '@/lib/purchase-storage.client';

export function SuccessDownloadButton({ posterId, orderId, downloadCount, downloadLimit }: { posterId: string; orderId: string; downloadCount: number; downloadLimit: number }) {
    const [status, setStatus] = useState<'idle' | 'downloading' | 'error' | 'exhausted'>('idle');
    const [remaining, setRemaining] = useState(downloadLimit - downloadCount);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        rememberPurchase(posterId, orderId);
    }, [posterId, orderId]);

    async function handleDownload() {
        setStatus('downloading');
        setErrorMessage(null);
        try {
            const res = await fetch('/api/download', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId })
            });
            const data = await res.json();
            if (!res.ok) {
                if (res.status === 403 && typeof data.downloadCount === 'number') {
                    setStatus('exhausted');
                    setRemaining(0);
                    setErrorMessage('다운로드 가능 횟수를 모두 사용했습니다.');
                    return;
                }
                throw new Error(data.error ?? 'download-failed');
            }
            setRemaining(data.downloadLimit - data.downloadCount);
            window.location.href = data.url;
            setStatus('idle');
        } catch {
            setStatus('error');
            setErrorMessage('다운로드에 실패했습니다. 다시 시도해주세요.');
        }
    }

    return (
        <div>
            <button type="button" onClick={handleDownload} disabled={status === 'downloading' || status === 'exhausted'} className="btn-charcoal">
                {status === 'downloading' ? '다운로드 준비 중…' : '고해상도 이미지 다운로드'}
            </button>
            <p className="mt-3 text-xs text-stone">다운로드 링크는 보안을 위해 일정 시간이 지나면 만료됩니다. 남은 다운로드 횟수: {remaining}회</p>
            {errorMessage && (
                <p role="alert" className="mt-2 text-sm text-red-800">
                    {errorMessage}
                </p>
            )}
        </div>
    );
}
