'use client';

import { useState } from 'react';
import { Button } from './Button';

export function CopyField({ value, label }: { value: string; label: string }) {
    const [copied, setCopied] = useState(false);

    async function copy() {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Clipboard API unavailable; the value remains selectable in the input for manual copy.
        }
    }

    return (
        <div>
            <p className="mb-1.5 text-[13px] font-medium text-ink-soft">{label}</p>
            <div className="flex gap-2">
                <input
                    readOnly
                    value={value}
                    onFocus={(e) => e.currentTarget.select()}
                    aria-label={label}
                    className="min-h-[44px] flex-1 rounded-lg border border-border bg-bg px-3 text-[14px] text-ink"
                />
                <Button type="button" variant="secondary" onClick={copy} aria-live="polite">
                    {copied ? '복사됨' : '복사'}
                </Button>
            </div>
        </div>
    );
}
