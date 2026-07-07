import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import SectionLabel from '../ui/SectionLabel';
import CopyButton from '../ui/CopyButton';

export default function SEOTab({ project }) {
    const { seo } = project;
    return (
        <div className="max-w-3xl space-y-8">
            <Card className="p-8">
                <div className="flex items-center justify-between mb-4">
                    <SectionLabel className="mb-0">20 Optimized Titles</SectionLabel>
                    <CopyButton text={seo.titles.join('\n')} label="Copy All" />
                </div>
                <ol className="space-y-2">
                    {seo.titles.map((t, i) => (
                        <li key={i} className="flex gap-3 text-sm">
                            <span className="text-studio-muted w-6 shrink-0">{i + 1}.</span>
                            <span className="text-studio-ink">{t}</span>
                        </li>
                    ))}
                </ol>
            </Card>

            <Card className="p-8">
                <div className="flex items-center justify-between mb-4">
                    <SectionLabel className="mb-0">Description</SectionLabel>
                    <CopyButton text={seo.description} />
                </div>
                <pre className="whitespace-pre-wrap font-studio-sans text-studio-ink text-sm leading-relaxed">{seo.description}</pre>
            </Card>

            <div className="grid sm:grid-cols-2 gap-8">
                <Card className="p-8">
                    <SectionLabel>Tags</SectionLabel>
                    <div className="flex flex-wrap gap-2">
                        {seo.tags.map((t) => (
                            <Badge key={t} tone="muted">
                                {t}
                            </Badge>
                        ))}
                    </div>
                </Card>
                <Card className="p-8">
                    <SectionLabel>Hashtags</SectionLabel>
                    <div className="flex flex-wrap gap-2">
                        {seo.hashtags.map((t) => (
                            <Badge key={t} tone="gold">
                                {t}
                            </Badge>
                        ))}
                    </div>
                </Card>
            </div>

            <Card className="p-8">
                <SectionLabel>Chapters</SectionLabel>
                <ul className="space-y-1.5 font-mono text-sm text-studio-ink">
                    {seo.chapters.map((c) => (
                        <li key={c}>{c}</li>
                    ))}
                </ul>
            </Card>

            <Card className="p-8">
                <SectionLabel>Pinned Comment</SectionLabel>
                <p className="text-studio-ink leading-relaxed">{seo.pinnedComment}</p>
            </Card>

            <Card className="p-8">
                <SectionLabel>Search Keywords</SectionLabel>
                <div className="flex flex-wrap gap-2">
                    {seo.keywords.map((k) => (
                        <Badge key={k} tone="ivory">
                            {k}
                        </Badge>
                    ))}
                </div>
            </Card>
        </div>
    );
}
