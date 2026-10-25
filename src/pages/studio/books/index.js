import React, { useState } from 'react';
import StudioShell from '../../../components/studio/StudioShell';
import Button from '../../../components/studio/ui/Button';
import Card from '../../../components/studio/ui/Card';
import Badge from '../../../components/studio/ui/Badge';
import SectionLabel from '../../../components/studio/ui/SectionLabel';
import { Field, Input, Textarea } from '../../../components/studio/ui/Fields';
import { useBooksStore } from '../../../utils/studio/store';
import { SEED_BOOKS } from '../../../utils/studio/seed';

const BLANK = { title: '', author: '', question: '', theme: '', symbols: '', emotion: '', visualStyle: '', trendMatch: '', publishingStatus: 'Draft', videoStatus: 'Not Started', notes: '' };

export default function BooksPage() {
    const { items: books, add, remove } = useBooksStore(SEED_BOOKS);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(BLANK);

    function set(key, value) {
        setForm((f) => ({ ...f, [key]: value }));
    }

    function handleAdd(e) {
        e.preventDefault();
        if (!form.title) return;
        add(form);
        setForm(BLANK);
        setShowForm(false);
    }

    return (
        <StudioShell
            pageTitle="Books"
            eyebrow="Library"
            title="Books"
            actions={<Button onClick={() => setShowForm((s) => !s)}>{showForm ? 'Cancel' : 'Add Book'}</Button>}
        >
            {showForm && (
                <Card className="p-8 mb-10">
                    <SectionLabel>New Book</SectionLabel>
                    <form onSubmit={handleAdd} className="grid sm:grid-cols-2 gap-5">
                        <Field label="Title"><Input value={form.title} onChange={(e) => set('title', e.target.value)} required /></Field>
                        <Field label="Author"><Input value={form.author} onChange={(e) => set('author', e.target.value)} /></Field>
                        <Field label="Question" className="sm:col-span-2"><Input value={form.question} onChange={(e) => set('question', e.target.value)} /></Field>
                        <Field label="Theme"><Input value={form.theme} onChange={(e) => set('theme', e.target.value)} /></Field>
                        <Field label="Trend Match"><Input value={form.trendMatch} onChange={(e) => set('trendMatch', e.target.value)} /></Field>
                        <Field label="Symbols"><Input value={form.symbols} onChange={(e) => set('symbols', e.target.value)} /></Field>
                        <Field label="Emotion"><Input value={form.emotion} onChange={(e) => set('emotion', e.target.value)} /></Field>
                        <Field label="Visual Style" className="sm:col-span-2"><Input value={form.visualStyle} onChange={(e) => set('visualStyle', e.target.value)} /></Field>
                        <Field label="Notes" className="sm:col-span-2"><Textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} /></Field>
                        <div className="sm:col-span-2 flex justify-end">
                            <Button type="submit">Save Book</Button>
                        </div>
                    </form>
                </Card>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {books.map((b) => (
                    <Card key={b.id} className="p-6">
                        <div className="flex items-start justify-between gap-2 mb-3">
                            <Badge tone="muted">{b.trendMatch}</Badge>
                            <button onClick={() => remove(b.id)} className="text-xs text-studio-muted hover:text-studio-ink">
                                Remove
                            </button>
                        </div>
                        <h3 className="font-studio-serif text-xl text-studio-ivory leading-snug">{b.title}</h3>
                        <p className="text-sm text-studio-muted mt-1">{b.author}</p>
                        {b.question && <p className="text-sm text-studio-ink/90 mt-4 italic">&ldquo;{b.question}&rdquo;</p>}
                        <div className="flex flex-wrap gap-2 mt-4">
                            <Badge tone="blue">{b.publishingStatus}</Badge>
                            <Badge tone="gold">{b.videoStatus}</Badge>
                        </div>
                        <Button href={`/studio/projects/new?book=${encodeURIComponent(b.title)}&trend=${encodeURIComponent(b.trendMatch || '')}&question=${encodeURIComponent(b.question || '')}`} variant="secondary" size="sm" className="mt-5">
                            Start Documentary
                        </Button>
                    </Card>
                ))}
            </div>
        </StudioShell>
    );
}
