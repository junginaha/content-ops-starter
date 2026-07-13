'use client';

import { useState } from 'react';
import classNames from 'classnames';
import { REACTION_LABELS } from '@/lib/constants';
import { fetchJson } from '@/lib/client/http';

type ReactionType = 'heard' | 'same_here' | 'support' | 'needs_help';
type ReactionCounts = Record<ReactionType, number>;

const ORDER: ReactionType[] = ['heard', 'same_here', 'support', 'needs_help'];

export function ReactionBar({ shareId, initialCounts }: { shareId: string; initialCounts: ReactionCounts }) {
    const [counts, setCounts] = useState(initialCounts);
    const [sent, setSent] = useState<Set<ReactionType>>(new Set());
    const [pending, setPending] = useState<ReactionType | null>(null);

    async function react(reactionType: ReactionType) {
        if (pending || sent.has(reactionType)) return;
        setPending(reactionType);
        try {
            const result = await fetchJson<{ reactions: ReactionCounts }>(`/api/posts/${shareId}/react`, {
                method: 'POST',
                body: JSON.stringify({ reactionType })
            });
            setCounts(result.reactions);
            setSent((prev) => new Set(prev).add(reactionType));
        } catch {
            // Silently ignore: reactions are non-critical and the button simply stays available to retry.
        } finally {
            setPending(null);
        }
    }

    return (
        <div className="grid grid-cols-2 gap-2" role="group" aria-label="반응 남기기">
            {ORDER.map((type) => (
                <button
                    key={type}
                    type="button"
                    onClick={() => react(type)}
                    disabled={pending === type || sent.has(type)}
                    aria-pressed={sent.has(type)}
                    className={classNames(
                        'flex min-h-[48px] flex-col items-center justify-center gap-0.5 rounded-xl border px-2 py-2 text-[13px] transition-colors duration-150 disabled:cursor-not-allowed',
                        sent.has(type) ? 'border-action bg-action text-white' : 'border-border bg-surface text-ink hover:bg-bg'
                    )}
                >
                    <span>{REACTION_LABELS[type]}</span>
                    <span className={classNames('text-[12px]', sent.has(type) ? 'text-white/70' : 'text-ink-soft')}>{counts[type]}</span>
                </button>
            ))}
        </div>
    );
}
