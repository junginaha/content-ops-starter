import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import SectionLabel from '../ui/SectionLabel';
import { PROJECT_STATUSES } from '../../../utils/studio/constants';

export default function OverviewTab({ project, onUpdate }) {
    const { input } = project;
    const fields = [
        ['Trend', input.trend],
        ['Book', input.book],
        ['Audience', input.audience],
        ['Runtime', input.runtime],
        ['Language', input.language],
        ['Tone', input.tone]
    ];

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <Card className="p-8">
                    <SectionLabel>Human Question</SectionLabel>
                    <h2 className="font-studio-serif text-3xl text-studio-ivory leading-snug">{input.question}</h2>
                </Card>
                <Card className="p-8">
                    <SectionLabel>Project Details</SectionLabel>
                    <dl className="grid sm:grid-cols-2 gap-6">
                        {fields.map(([label, value]) => (
                            <div key={label}>
                                <dt className="text-xs uppercase tracking-[0.12em] text-studio-muted mb-1">{label}</dt>
                                <dd className="text-studio-ink">{value}</dd>
                            </div>
                        ))}
                    </dl>
                </Card>
                <Card className="p-8">
                    <SectionLabel>Outline</SectionLabel>
                    <ol className="space-y-4">
                        {project.outline.map((o, i) => (
                            <li key={o.section} className="flex gap-4">
                                <span className="font-studio-serif text-studio-gold text-sm w-6 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                                <div>
                                    <p className="text-studio-ink">{o.section}</p>
                                    <p className="text-sm text-studio-muted mt-1 leading-relaxed">{o.summary}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </Card>
            </div>
            <div className="space-y-8">
                <Card className="p-6">
                    <SectionLabel>Status</SectionLabel>
                    <select
                        value={project.status}
                        onChange={(e) => onUpdate({ status: e.target.value })}
                        className="w-full rounded-xl bg-studio-charcoal border border-studio-line text-studio-ink px-4 py-3 text-sm focus:outline-none focus:border-studio-gold/70"
                    >
                        {PROJECT_STATUSES.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                </Card>
                <Card className="p-6">
                    <SectionLabel>At a Glance</SectionLabel>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-studio-muted">Scenes</span>
                            <span className="text-studio-ink">{project.scenes.length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-studio-muted">Image Prompts</span>
                            <span className="text-studio-ink">{project.imagePrompts.length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-studio-muted">Script Words</span>
                            <span className="text-studio-ink">{project.script.wordCount}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-studio-muted">Export Files</span>
                            <span className="text-studio-ink">{project.exportManifest.length}</span>
                        </div>
                    </div>
                </Card>
                <Badge tone="gold">Generated Automatically</Badge>
            </div>
        </div>
    );
}
