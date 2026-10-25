import React, { useState } from 'react';
import StudioShell from '../../../components/studio/StudioShell';
import Button from '../../../components/studio/ui/Button';
import Card from '../../../components/studio/ui/Card';
import Badge from '../../../components/studio/ui/Badge';
import SectionLabel from '../../../components/studio/ui/SectionLabel';
import { Field, Input, Select } from '../../../components/studio/ui/Fields';
import { useQuestionsStore, useTrendsStore } from '../../../utils/studio/store';
import { SEED_QUESTIONS, SEED_TRENDS } from '../../../utils/studio/seed';

export default function QuestionsPage() {
    const { items: questions, add, remove } = useQuestionsStore(SEED_QUESTIONS);
    const { items: trends } = useTrendsStore(SEED_TRENDS);
    const [showForm, setShowForm] = useState(false);
    const [text, setText] = useState('');
    const [trend, setTrend] = useState(trends[0]?.name || '');

    function handleAdd(e) {
        e.preventDefault();
        if (!text.trim()) return;
        add({ text, trend, status: 'New', bookId: null });
        setText('');
        setShowForm(false);
    }

    return (
        <StudioShell
            pageTitle="Questions"
            eyebrow="Library"
            title="Questions"
            actions={<Button onClick={() => setShowForm((s) => !s)}>{showForm ? 'Cancel' : 'Add Question'}</Button>}
        >
            {showForm && (
                <Card className="p-8 mb-10">
                    <SectionLabel>New Question</SectionLabel>
                    <form onSubmit={handleAdd} className="grid sm:grid-cols-3 gap-5 items-end">
                        <Field label="Question" className="sm:col-span-2">
                            <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="What human question should we explore?" required />
                        </Field>
                        <Field label="Trend">
                            <Select value={trend} onChange={(e) => setTrend(e.target.value)}>
                                {trends.map((t) => (
                                    <option key={t.id} value={t.name}>
                                        {t.name}
                                    </option>
                                ))}
                            </Select>
                        </Field>
                        <div className="sm:col-span-3 flex justify-end">
                            <Button type="submit">Save Question</Button>
                        </div>
                    </form>
                </Card>
            )}

            <Card className="divide-y divide-studio-line">
                {questions.map((q) => (
                    <div key={q.id} className="flex items-center justify-between gap-4 px-6 py-5">
                        <div className="min-w-0">
                            <p className="text-studio-ink">{q.text}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <Badge tone="muted">{q.trend}</Badge>
                                <Badge tone={q.status === 'Explored' ? 'gold' : q.status === 'In Progress' ? 'blue' : 'ivory'}>{q.status}</Badge>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                            <Button href={`/studio/projects/new?question=${encodeURIComponent(q.text)}&trend=${encodeURIComponent(q.trend)}`} variant="secondary" size="sm">
                                Explore
                            </Button>
                            <button onClick={() => remove(q.id)} className="text-xs text-studio-muted hover:text-studio-ink">
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </Card>
        </StudioShell>
    );
}
