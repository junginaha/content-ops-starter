import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import StudioShell from '../../components/studio/StudioShell';
import Button from '../../components/studio/ui/Button';
import Card from '../../components/studio/ui/Card';
import Badge from '../../components/studio/ui/Badge';
import SectionLabel from '../../components/studio/ui/SectionLabel';
import EmptyState from '../../components/studio/ui/EmptyState';
import { Input, Select } from '../../components/studio/ui/Fields';
import { useProjects, useTrendsStore, useBooksStore, useQuestionsStore } from '../../utils/studio/store';
import { SEED_TRENDS, SEED_BOOKS, SEED_QUESTIONS } from '../../utils/studio/seed';
import { generateProject } from '../../utils/studio/generator';

function statusTone(status) {
    if (status === 'Published') return 'gold';
    if (status === 'Ready' || status === 'In Edit') return 'blue';
    return 'muted';
}

export default function Dashboard() {
    const router = useRouter();
    const { items: projects, add: addProject } = useProjects();
    const { items: trends } = useTrendsStore(SEED_TRENDS);
    const { items: books } = useBooksStore(SEED_BOOKS);
    const { items: questions } = useQuestionsStore(SEED_QUESTIONS);

    const [quick, setQuick] = useState({ trend: SEED_TRENDS[0]?.name || '', question: '', book: SEED_BOOKS[0]?.title || '' });
    const [generating, setGenerating] = useState(false);

    const sorted = useMemo(() => [...projects].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)), [projects]);
    const active = sorted.filter((p) => p.status !== 'Published').slice(0, 4);
    const recent = sorted.slice(0, 6);

    function handleQuickCreate(e) {
        e.preventDefault();
        if (!quick.question) return;
        setGenerating(true);
        const input = {
            trend: quick.trend,
            question: quick.question,
            book: quick.book,
            audience: 'Documentary Viewers',
            runtime: '10 min',
            language: 'English',
            tone: 'Contemplative'
        };
        const assets = generateProject(input);
        const project = addProject({
            input,
            status: 'Ready',
            createdAt: Date.now(),
            ...assets
        });
        setGenerating(false);
        router.push(`/studio/projects/${project.id}`);
    }

    return (
        <StudioShell
            pageTitle="Dashboard"
            eyebrow="Studio"
            title="Dashboard"
            actions={<Button href="/studio/projects/new">New Project</Button>}
        >
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-12">
                    <section>
                        <SectionLabel>Quick Create</SectionLabel>
                        <Card className="p-6">
                            <form onSubmit={handleQuickCreate} className="grid sm:grid-cols-3 gap-4 items-end">
                                <div>
                                    <span className="block mb-2 text-xs uppercase tracking-[0.12em] text-studio-muted">Trend</span>
                                    <Select value={quick.trend} onChange={(e) => setQuick((q) => ({ ...q, trend: e.target.value }))}>
                                        {trends.map((t) => (
                                            <option key={t.id} value={t.name}>
                                                {t.name}
                                            </option>
                                        ))}
                                    </Select>
                                </div>
                                <div className="sm:col-span-1">
                                    <span className="block mb-2 text-xs uppercase tracking-[0.12em] text-studio-muted">Question</span>
                                    <Input
                                        placeholder="What human question are we exploring?"
                                        value={quick.question}
                                        onChange={(e) => setQuick((q) => ({ ...q, question: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <span className="block mb-2 text-xs uppercase tracking-[0.12em] text-studio-muted">Book</span>
                                    <Select value={quick.book} onChange={(e) => setQuick((q) => ({ ...q, book: e.target.value }))}>
                                        {books.map((b) => (
                                            <option key={b.id} value={b.title}>
                                                {b.title}
                                            </option>
                                        ))}
                                    </Select>
                                </div>
                                <div className="sm:col-span-3 flex justify-end">
                                    <Button type="submit" disabled={generating}>
                                        {generating ? 'Generating…' : 'Generate'}
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </section>

                    <section>
                        <SectionLabel>Continue Working</SectionLabel>
                        {active.length === 0 ? (
                            <EmptyState
                                title="No projects in progress"
                                description="Start from a trend and a question — Question Studio will prepare every creative asset automatically."
                                actionLabel="Create Documentary"
                                actionHref="/studio/projects/new"
                            />
                        ) : (
                            <div className="grid sm:grid-cols-2 gap-4">
                                {active.map((p) => (
                                    <Card key={p.id} as="a" href={`/studio/projects/${p.id}`} className="p-5 block hover:border-studio-gold/50 transition-colors">
                                        <Badge tone={statusTone(p.status)}>{p.status}</Badge>
                                        <h3 className="font-studio-serif text-lg text-studio-ivory mt-3 leading-snug">{p.input.question}</h3>
                                        <p className="text-sm text-studio-muted mt-2">{p.input.book}</p>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </section>

                    <section>
                        <SectionLabel>Recent Projects</SectionLabel>
                        {recent.length === 0 ? (
                            <p className="text-sm text-studio-muted">Nothing here yet.</p>
                        ) : (
                            <Card className="divide-y divide-studio-line">
                                {recent.map((p) => (
                                    <a
                                        key={p.id}
                                        href={`/studio/projects/${p.id}`}
                                        className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-studio-charcoal/50 transition-colors"
                                    >
                                        <div className="min-w-0">
                                            <p className="text-studio-ink truncate">{p.input.question}</p>
                                            <p className="text-xs text-studio-muted mt-1">
                                                {p.input.book} · {p.input.trend}
                                            </p>
                                        </div>
                                        <Badge tone={statusTone(p.status)}>{p.status}</Badge>
                                    </a>
                                ))}
                            </Card>
                        )}
                    </section>
                </div>

                <div className="space-y-12">
                    <section>
                        <SectionLabel>Trending Questions</SectionLabel>
                        <Card className="divide-y divide-studio-line">
                            {questions.slice(0, 6).map((q) => (
                                <div key={q.id} className="px-5 py-4">
                                    <p className="text-sm text-studio-ink leading-snug">{q.text}</p>
                                    <Badge tone="muted" className="mt-3">
                                        {q.trend}
                                    </Badge>
                                </div>
                            ))}
                        </Card>
                    </section>

                    <section>
                        <SectionLabel>Book Recommendations</SectionLabel>
                        <div className="space-y-3">
                            {books.slice(0, 4).map((b) => (
                                <Card key={b.id} className="p-4">
                                    <p className="font-studio-serif text-studio-ivory">{b.title}</p>
                                    <p className="text-xs text-studio-muted mt-1">{b.author}</p>
                                    <p className="text-xs text-studio-gold mt-2 uppercase tracking-wide">{b.trendMatch}</p>
                                </Card>
                            ))}
                        </div>
                    </section>

                    <section>
                        <SectionLabel>Automation Status</SectionLabel>
                        <Card className="p-5">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm text-studio-ink">n8n Pipeline</span>
                                <Badge tone="muted">Not Connected</Badge>
                            </div>
                            <p className="text-xs text-studio-muted leading-relaxed mb-4">
                                Every stage from Research to SEO already runs inside the studio. Connect n8n to trigger external
                                rendering, publishing, and asset delivery automatically.
                            </p>
                            <Button href="/studio/automation" variant="secondary" size="sm">
                                Configure Automation
                            </Button>
                        </Card>
                    </section>
                </div>
            </div>
        </StudioShell>
    );
}
