import React, { useMemo } from 'react';
import StudioShell from '../../../components/studio/StudioShell';
import Button from '../../../components/studio/ui/Button';
import Card from '../../../components/studio/ui/Card';
import Badge from '../../../components/studio/ui/Badge';
import EmptyState from '../../../components/studio/ui/EmptyState';
import { useProjects } from '../../../utils/studio/store';

function statusTone(status) {
    if (status === 'Published') return 'gold';
    if (status === 'Ready' || status === 'In Edit') return 'blue';
    return 'muted';
}

export default function ProjectsIndex() {
    const { items: projects, hydrated } = useProjects();
    const sorted = useMemo(() => [...projects].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)), [projects]);

    return (
        <StudioShell pageTitle="Projects" eyebrow="Studio" title="Projects" actions={<Button href="/studio/projects/new">New Project</Button>}>
            {!hydrated ? (
                <p className="text-studio-muted">Loading…</p>
            ) : sorted.length === 0 ? (
                <EmptyState
                    title="No projects yet"
                    description="Every Question Studio project begins with a trend, a question, and a book."
                    actionLabel="Create Documentary"
                    actionHref="/studio/projects/new"
                />
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {sorted.map((p) => (
                        <Card key={p.id} as="a" href={`/studio/projects/${p.id}`} className="p-6 block hover:border-studio-gold/50 transition-colors">
                            <Badge tone={statusTone(p.status)}>{p.status}</Badge>
                            <h3 className="font-studio-serif text-xl text-studio-ivory mt-4 leading-snug">{p.input.question}</h3>
                            <p className="text-sm text-studio-muted mt-3">{p.input.book}</p>
                            <p className="text-xs text-studio-muted mt-1 uppercase tracking-wide">{p.input.trend}</p>
                        </Card>
                    ))}
                </div>
            )}
        </StudioShell>
    );
}
