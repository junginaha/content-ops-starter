import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import SectionLabel from '../ui/SectionLabel';
import { downloadTextFile } from '../../../utils/studio/download';

export default function ExportTab({ project }) {
    const { script, seo, exportManifest, input } = project;

    function handleDownloadScript() {
        const text = `${script.title}\n${script.subtitle}\n\n${script.sections.map((s) => `${s.heading}\n\n${s.content}`).join('\n\n')}`;
        downloadTextFile('Script.txt', text);
    }

    function handleDownloadSEO() {
        const text = [
            'TITLES', ...seo.titles, '',
            'DESCRIPTION', seo.description, '',
            'TAGS', seo.tags.join(', '), '',
            'CHAPTERS', ...seo.chapters, '',
            'PINNED COMMENT', seo.pinnedComment, '',
            'KEYWORDS', seo.keywords.join(', '), '',
            'HASHTAGS', seo.hashtags.join(' ')
        ].join('\n');
        downloadTextFile('SEO.txt', text);
    }

    return (
        <div className="max-w-3xl space-y-8">
            <Card className="p-8">
                <SectionLabel>Filmora Export Package</SectionLabel>
                <p className="text-studio-muted text-sm mb-6 leading-relaxed">
                    A project folder ready for Filmora — script, narration, music, scene stills, and SEO, all named and ordered
                    to match the storyboard. Text assets are ready to download now. Audio and image files require connecting
                    generation providers in Settings.
                </p>
                <div className="flex gap-3 mb-6">
                    <Button onClick={handleDownloadScript} size="sm">
                        Download Script
                    </Button>
                    <Button onClick={handleDownloadSEO} variant="secondary" size="sm">
                        Download SEO Package
                    </Button>
                </div>
                <div className="border border-studio-line rounded-xl divide-y divide-studio-line overflow-hidden">
                    {exportManifest.map((f) => (
                        <div key={f.name} className="flex items-center justify-between px-4 py-2.5 text-sm">
                            <span className="font-mono text-studio-ink">{f.name}</span>
                            <Badge tone={f.status === 'Ready' ? 'gold' : 'muted'}>{f.status}</Badge>
                        </div>
                    ))}
                </div>
            </Card>
            <p className="text-xs text-studio-muted">
                Project folder: <span className="font-mono">/{input.book.replace(/\s+/g, '-')}-{Date.now().toString(36)}/</span>
            </p>
        </div>
    );
}
