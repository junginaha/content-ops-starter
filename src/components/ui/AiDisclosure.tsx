import { AI_DISCLOSURE_TEXT } from '@/lib/constants';

export function AiDisclosure() {
    return (
        <p className="flex items-start gap-2 rounded-lg bg-bg px-3.5 py-3 text-[13px] leading-relaxed text-ink-soft">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0" aria-hidden="true">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                <path d="M12 11v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="8" r="1" fill="currentColor" />
            </svg>
            {AI_DISCLOSURE_TEXT}
        </p>
    );
}
