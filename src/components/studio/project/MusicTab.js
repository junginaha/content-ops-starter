import React from 'react';
import Card from '../ui/Card';
import SectionLabel from '../ui/SectionLabel';
import CopyButton from '../ui/CopyButton';

export default function MusicTab({ project }) {
    const { music } = project;
    return (
        <div className="max-w-2xl space-y-8">
            <Card className="p-8">
                <SectionLabel>Music Studio</SectionLabel>
                <dl className="grid sm:grid-cols-2 gap-6">
                    <div>
                        <dt className="text-xs uppercase tracking-[0.12em] text-studio-muted mb-1">Mood</dt>
                        <dd className="text-studio-ink">{music.mood}</dd>
                    </div>
                    <div>
                        <dt className="text-xs uppercase tracking-[0.12em] text-studio-muted mb-1">Tempo</dt>
                        <dd className="text-studio-ink">{music.tempo} BPM</dd>
                    </div>
                    <div className="sm:col-span-2">
                        <dt className="text-xs uppercase tracking-[0.12em] text-studio-muted mb-1">Instrumentation</dt>
                        <dd className="text-studio-ink">{music.instrumentation}</dd>
                    </div>
                    <div className="sm:col-span-2">
                        <dt className="text-xs uppercase tracking-[0.12em] text-studio-muted mb-1">Structure</dt>
                        <dd className="text-studio-ink">{music.structure}</dd>
                    </div>
                    <div>
                        <dt className="text-xs uppercase tracking-[0.12em] text-studio-muted mb-1">Runtime</dt>
                        <dd className="text-studio-ink">{music.runtime}</dd>
                    </div>
                </dl>
            </Card>
            <Card className="p-8">
                <div className="flex items-center justify-between mb-3">
                    <SectionLabel className="mb-0">Ready-to-Use Suno Prompt</SectionLabel>
                    <CopyButton text={music.prompt} />
                </div>
                <p className="text-studio-ink/90 leading-relaxed font-mono text-sm bg-studio-charcoal rounded-lg p-4 border border-studio-line">
                    {music.prompt}
                </p>
            </Card>
        </div>
    );
}
