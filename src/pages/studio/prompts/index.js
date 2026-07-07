import React, { useMemo, useState } from 'react';
import StudioShell from '../../../components/studio/StudioShell';
import Button from '../../../components/studio/ui/Button';
import Card from '../../../components/studio/ui/Card';
import Badge from '../../../components/studio/ui/Badge';
import SectionLabel from '../../../components/studio/ui/SectionLabel';
import CopyButton from '../../../components/studio/ui/CopyButton';
import { Field, Input, Select, Textarea } from '../../../components/studio/ui/Fields';
import { usePromptsStore } from '../../../utils/studio/store';
import { SEED_PROMPTS } from '../../../utils/studio/seed';
import { PROMPT_CATEGORIES } from '../../../utils/studio/constants';
import classNames from 'classnames';

function PromptCard({ prompt, onToggleFavorite, onSave, onRemove }) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(prompt.body);

    function handleSave() {
        onSave(prompt.id, draft);
        setEditing(false);
    }

    return (
        <Card className="p-6">
            <div className="flex items-start justify-between gap-3 mb-3">
                <Badge tone="muted">{prompt.category}</Badge>
                <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-studio-muted">v{prompt.version}</span>
                    <button onClick={() => onToggleFavorite(prompt.id)} aria-label="Toggle favorite" className={classNames('text-lg leading-none', prompt.favorite ? 'text-studio-gold' : 'text-studio-line hover:text-studio-muted')}>
                        ★
                    </button>
                </div>
            </div>
            <h3 className="font-studio-serif text-lg text-studio-ivory mb-3">{prompt.title}</h3>
            {editing ? (
                <>
                    <Textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={5} />
                    <div className="flex gap-2 mt-3">
                        <Button size="sm" onClick={handleSave}>Save</Button>
                        <Button size="sm" variant="ghost" onClick={() => { setDraft(prompt.body); setEditing(false); }}>Cancel</Button>
                    </div>
                </>
            ) : (
                <>
                    <p className="text-sm text-studio-ink/80 leading-relaxed font-mono whitespace-pre-wrap">{prompt.body}</p>
                    <div className="flex gap-2 mt-4">
                        <CopyButton text={prompt.body} />
                        <Button size="sm" variant="ghost" onClick={() => setEditing(true)}>Edit</Button>
                        <Button size="sm" variant="ghost" onClick={() => onRemove(prompt.id)}>Delete</Button>
                    </div>
                </>
            )}
        </Card>
    );
}

export default function PromptsPage() {
    const { items: prompts, add, update, remove } = usePromptsStore(SEED_PROMPTS);
    const [category, setCategory] = useState('All');
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ category: PROMPT_CATEGORIES[0], title: '', body: '' });

    const filtered = useMemo(() => {
        let list = category === 'All' ? prompts : prompts.filter((p) => p.category === category);
        return [...list].sort((a, b) => (b.favorite === a.favorite ? 0 : b.favorite ? 1 : -1));
    }, [prompts, category]);

    function toggleFavorite(id) {
        update(id, (p) => ({ favorite: !p.favorite }));
    }

    function saveBody(id, body) {
        update(id, (p) => ({ body, version: (p.version || 1) + 1 }));
    }

    function handleAdd(e) {
        e.preventDefault();
        if (!form.title.trim() || !form.body.trim()) return;
        add({ ...form, favorite: false, version: 1 });
        setForm({ category: PROMPT_CATEGORIES[0], title: '', body: '' });
        setShowForm(false);
    }

    return (
        <StudioShell
            pageTitle="Prompt Library"
            eyebrow="Library"
            title="Prompt Library"
            actions={<Button onClick={() => setShowForm((s) => !s)}>{showForm ? 'Cancel' : 'Add Prompt'}</Button>}
        >
            {showForm && (
                <Card className="p-8 mb-10">
                    <SectionLabel>New Prompt</SectionLabel>
                    <form onSubmit={handleAdd} className="grid gap-5">
                        <div className="grid sm:grid-cols-2 gap-5">
                            <Field label="Category">
                                <Select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                                    {PROMPT_CATEGORIES.map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </Select>
                            </Field>
                            <Field label="Title">
                                <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
                            </Field>
                        </div>
                        <Field label="Prompt Body">
                            <Textarea value={form.body} onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))} rows={4} required />
                        </Field>
                        <div className="flex justify-end">
                            <Button type="submit">Save Prompt</Button>
                        </div>
                    </form>
                </Card>
            )}

            <div className="flex items-center gap-2 mb-8 overflow-x-auto no-scrollbar">
                {['All', ...PROMPT_CATEGORIES].map((c) => (
                    <button
                        key={c}
                        onClick={() => setCategory(c)}
                        className={classNames(
                            'whitespace-nowrap px-4 py-2 rounded-full text-xs uppercase tracking-wide border transition-colors',
                            category === c ? 'border-studio-gold text-studio-gold bg-studio-gold/10' : 'border-studio-line text-studio-muted hover:text-studio-ink'
                        )}
                    >
                        {c}
                    </button>
                ))}
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((p) => (
                    <PromptCard key={p.id} prompt={p} onToggleFavorite={toggleFavorite} onSave={saveBody} onRemove={remove} />
                ))}
            </div>
        </StudioShell>
    );
}
