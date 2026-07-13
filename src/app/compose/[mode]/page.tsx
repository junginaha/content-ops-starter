import { notFound } from 'next/navigation';
import { ComposerFlow } from '@/components/composer/ComposerFlow';

const VALID_MODES = ['confess', 'ask_opinion', 'anonymous_say', 'propose_to_org'] as const;
type Mode = (typeof VALID_MODES)[number];

export function generateStaticParams() {
    return VALID_MODES.map((mode) => ({ mode }));
}

export default async function ComposePage({ params }: { params: Promise<{ mode: string }> }) {
    const { mode } = await params;
    if (!VALID_MODES.includes(mode as Mode)) {
        notFound();
    }
    return <ComposerFlow mode={mode as Mode} />;
}
