import React from 'react';
import StudioShell from '../../components/studio/StudioShell';
import Card from '../../components/studio/ui/Card';
import Badge from '../../components/studio/ui/Badge';
import SectionLabel from '../../components/studio/ui/SectionLabel';
import CopyButton from '../../components/studio/ui/CopyButton';
import { useSettings } from '../../utils/studio/store';

const PIPELINE = [
    'Research', 'Script', 'Storyboard', 'Image Prompts', 'Voice Prompt', 'Music Prompt', 'Thumbnail Prompt', 'SEO Package', 'Save Everything Inside The Project'
];

export default function AutomationPage() {
    const { settings, update, hydrated } = useSettings({ n8nEnabled: false, n8nWebhook: '' });

    const endpoint = 'https://your-instance.questionstudio.app/api/automation/webhook';

    return (
        <StudioShell pageTitle="Automation" eyebrow="System" title="Automation">
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card className="p-8">
                        <SectionLabel>Pipeline</SectionLabel>
                        <p className="text-sm text-studio-muted mb-8 leading-relaxed">
                            When a project&rsquo;s status changes to <span className="text-studio-ink">GENERATE</span>, the studio
                            runs every stage below automatically and stores the results inside the project.
                        </p>
                        <ol className="relative border-l border-studio-line pl-6 space-y-6">
                            {PIPELINE.map((step, i) => (
                                <li key={step} className="relative">
                                    <span className="absolute -left-[29px] top-1 w-2.5 h-2.5 rounded-full bg-studio-gold" />
                                    <span className="text-studio-ink">{step}</span>
                                </li>
                            ))}
                        </ol>
                    </Card>

                    <Card className="p-8">
                        <SectionLabel>n8n Integration</SectionLabel>
                        <p className="text-sm text-studio-muted mb-6 leading-relaxed">
                            Point an n8n workflow at this webhook to trigger external rendering, publishing, or delivery whenever
                            a project completes generation.
                        </p>
                        <div className="flex items-center gap-3 bg-studio-charcoal border border-studio-line rounded-xl px-4 py-3">
                            <code className="text-xs text-studio-ink/80 flex-1 truncate">{endpoint}</code>
                            <CopyButton text={endpoint} />
                        </div>
                        {hydrated && (
                            <label className="flex items-center gap-3 mt-6 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.n8nEnabled}
                                    onChange={(e) => update({ n8nEnabled: e.target.checked })}
                                    className="accent-studio-gold w-4 h-4"
                                />
                                <span className="text-sm text-studio-ink">Trigger n8n automatically when a project is generated</span>
                            </label>
                        )}
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card className="p-6">
                        <SectionLabel>Status</SectionLabel>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-studio-ink">n8n Connection</span>
                            <Badge tone="muted">Not Connected</Badge>
                        </div>
                    </Card>
                    <Card className="p-6">
                        <p className="text-xs text-studio-muted leading-relaxed">
                            The generation pipeline already runs entirely inside Question Studio — no external service is
                            required to produce research, script, scenes, prompts, or SEO. Automation is for what happens
                            after: rendering, uploading, and publishing.
                        </p>
                    </Card>
                </div>
            </div>
        </StudioShell>
    );
}
