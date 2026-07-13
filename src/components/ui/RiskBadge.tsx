import classNames from 'classnames';
import { RISK_LABELS } from '@/lib/constants';
import type { RiskLevel } from '@/lib/ai/types';

export function RiskBadge({ risk }: { risk: RiskLevel }) {
    const isSevere = risk === 'high' || risk === 'urgent';
    return (
        <span
            className={classNames('inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[13px] font-medium', {
                'border-border bg-surface text-ink-soft': !isSevere,
                'border-accent/30 bg-accent/10 text-accent': isSevere
            })}
        >
            <span className={classNames('h-1.5 w-1.5 rounded-full', isSevere ? 'bg-accent' : 'bg-ink-soft')} aria-hidden="true" />
            {RISK_LABELS[risk]}
        </span>
    );
}
