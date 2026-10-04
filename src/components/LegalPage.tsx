export function LegalPage({ eyebrow, title, updated, children }: { eyebrow: string; title: string; updated: string; children: React.ReactNode }) {
    return (
        <div className="container-editorial max-w-3xl py-16 sm:py-20">
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="mt-2 text-4xl text-ink sm:text-5xl">{title}</h1>
            <p className="mt-2 text-xs text-stone">최종 업데이트: {updated}</p>
            <div className="prose-legal mt-10 space-y-8 text-sm leading-relaxed text-ink [&_h2]:font-serif [&_h2]:text-xl [&_h2]:text-ink [&_p]:mt-2 [&_p]:text-stone [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_ul]:text-stone">
                {children}
            </div>
        </div>
    );
}
