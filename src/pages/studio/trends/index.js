import React, { useState } from 'react';
import StudioShell from '../../../components/studio/StudioShell';
import Button from '../../../components/studio/ui/Button';
import Card from '../../../components/studio/ui/Card';
import Badge from '../../../components/studio/ui/Badge';
import SectionLabel from '../../../components/studio/ui/SectionLabel';
import { Field, Input } from '../../../components/studio/ui/Fields';
import { useTrendsStore, useBooksStore } from '../../../utils/studio/store';
import { SEED_TRENDS, SEED_BOOKS } from '../../../utils/studio/seed';

export default function TrendsPage() {
    const { items: trends, add, remove } = useTrendsStore(SEED_TRENDS);
    const { items: books } = useBooksStore(SEED_BOOKS);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: '', description: '', momentum: 'Rising' });

    function handleAdd(e) {
        e.preventDefault();
        if (!form.name.trim()) return;
        add(form);
        setForm({ name: '', description: '', momentum: 'Rising' });
        setShowForm(false);
    }

    return (
        <StudioShell
            pageTitle="Trends"
            eyebrow="Library"
            title="Trends"
            actions={<Button onClick={() => setShowForm((s) => !s)}>{showForm ? 'Cancel' : 'Add Trend'}</Button>}
        >
            {showForm && (
                <Card className="p-8 mb-10">
                    <SectionLabel>New Trend</SectionLabel>
                    <form onSubmit={handleAdd} className="grid sm:grid-cols-2 gap-5">
                        <Field label="Name"><Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required /></Field>
                        <Field label="Momentum"><Input value={form.momentum} onChange={(e) => setForm((f) => ({ ...f, momentum: e.target.value }))} /></Field>
                        <Field label="Description" className="sm:col-span-2">
                            <Input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
                        </Field>
                        <div className="sm:col-span-2 flex justify-end">
                            <Button type="submit">Save Trend</Button>
                        </div>
                    </form>
                </Card>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {trends.map((t) => {
                    const matchedBooks = books.filter((b) => b.trendMatch === t.name);
                    return (
                        <Card key={t.id} className="p-6">
                            <div className="flex items-start justify-between gap-2 mb-3">
                                <Badge tone={t.momentum === 'Rising' ? 'gold' : 'muted'}>{t.momentum}</Badge>
                                <button onClick={() => remove(t.id)} className="text-xs text-studio-muted hover:text-studio-ink">
                                    Remove
                                </button>
                            </div>
                            <h3 className="font-studio-serif text-xl text-studio-ivory">{t.name}</h3>
                            <p className="text-sm text-studio-muted mt-2 leading-relaxed">{t.description}</p>
                            {matchedBooks.length > 0 && (
                                <p className="text-xs text-studio-gold mt-4 uppercase tracking-wide">
                                    {matchedBooks.length} matched book{matchedBooks.length > 1 ? 's' : ''}
                                </p>
                            )}
                            <Button href={`/studio/projects/new?trend=${encodeURIComponent(t.name)}`} variant="secondary" size="sm" className="mt-5">
                                Explore Trend
                            </Button>
                        </Card>
                    );
                })}
            </div>
        </StudioShell>
    );
}
