import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import StudioShell from '../../../components/studio/StudioShell';
import Card from '../../../components/studio/ui/Card';
import Button from '../../../components/studio/ui/Button';
import SectionLabel from '../../../components/studio/ui/SectionLabel';
import { Field, Input, Select } from '../../../components/studio/ui/Fields';
import { useProjects, useTrendsStore, useBooksStore } from '../../../utils/studio/store';
import { SEED_TRENDS, SEED_BOOKS } from '../../../utils/studio/seed';
import { AUDIENCE_OPTIONS, RUNTIME_OPTIONS, LANGUAGE_OPTIONS, TONE_OPTIONS } from '../../../utils/studio/constants';
import { generateProject } from '../../../utils/studio/generator';

const PIPELINE_STAGES = [
    'Deep Research',
    'Documentary Outline',
    '10-Minute Documentary Script',
    '25 Scene Storyboard',
    '25 Image Prompts',
    'Voice Prompt',
    'OpenAI TTS Configuration',
    'Suno Music Prompt',
    'Thumbnail Concepts',
    'SEO Package',
    'Filmora Asset Package'
];

export default function NewProject() {
    const router = useRouter();
    const { add: addProject } = useProjects();
    const { items: trends } = useTrendsStore(SEED_TRENDS);
    const { items: books } = useBooksStore(SEED_BOOKS);

    const [form, setForm] = useState({
        trend: SEED_TRENDS[0]?.name || '',
        question: '',
        book: SEED_BOOKS[0]?.title || '',
        audience: AUDIENCE_OPTIONS[0],
        runtime: RUNTIME_OPTIONS[2],
        language: LANGUAGE_OPTIONS[0],
        tone: TONE_OPTIONS[0]
    });
    const [generating, setGenerating] = useState(false);
    const [stageIndex, setStageIndex] = useState(-1);

    useEffect(() => {
        if (!router.isReady) return;
        const { trend, question, book } = router.query;
        if (trend || question || book) {
            setForm((f) => ({
                ...f,
                trend: typeof trend === 'string' && trend ? trend : f.trend,
                question: typeof question === 'string' && question ? question : f.question,
                book: typeof book === 'string' && book ? book : f.book
            }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.isReady]);

    function set(key, value) {
        setForm((f) => ({ ...f, [key]: value }));
    }

    async function handleGenerate(e) {
        e.preventDefault();
        if (!form.question.trim()) return;
        setGenerating(true);
        for (let i = 0; i < PIPELINE_STAGES.length; i++) {
            setStageIndex(i);
            // eslint-disable-next-line no-await-in-loop
            await new Promise((resolve) => setTimeout(resolve, 180));
        }
        const assets = generateProject(form);
        const project = addProject({
            input: form,
            status: 'Ready',
            createdAt: Date.now(),
            ...assets
        });
        router.push(`/studio/projects/${project.id}`);
    }

    return (
        <StudioShell pageTitle="New Project" eyebrow="Studio" title="New Project">
            <div className="max-w-3xl">
                <p className="text-studio-muted mb-10 leading-relaxed max-w-xl">
                    Give the studio a trend, a question, and a book. Everything else — research, script, storyboard, prompts,
                    voice, music, thumbnail, and SEO — is prepared automatically.
                </p>

                {!generating ? (
                    <Card className="p-8">
                        <form onSubmit={handleGenerate} className="space-y-6">
                            <div className="grid sm:grid-cols-2 gap-6">
                                <Field label="Trend">
                                    <Select value={form.trend} onChange={(e) => set('trend', e.target.value)}>
                                        {trends.map((t) => (
                                            <option key={t.id} value={t.name}>
                                                {t.name}
                                            </option>
                                        ))}
                                    </Select>
                                </Field>
                                <Field label="Book">
                                    <Select value={form.book} onChange={(e) => set('book', e.target.value)}>
                                        {books.map((b) => (
                                            <option key={b.id} value={b.title}>
                                                {b.title}
                                            </option>
                                        ))}
                                    </Select>
                                </Field>
                            </div>

                            <Field label="Human Question" hint="The timeless question this documentary explores.">
                                <Input
                                    placeholder="e.g. Why did we stop showing up for each other?"
                                    value={form.question}
                                    onChange={(e) => set('question', e.target.value)}
                                    required
                                />
                            </Field>

                            <div className="grid sm:grid-cols-2 gap-6">
                                <Field label="Audience">
                                    <Select value={form.audience} onChange={(e) => set('audience', e.target.value)}>
                                        {AUDIENCE_OPTIONS.map((a) => (
                                            <option key={a} value={a}>
                                                {a}
                                            </option>
                                        ))}
                                    </Select>
                                </Field>
                                <Field label="Runtime">
                                    <Select value={form.runtime} onChange={(e) => set('runtime', e.target.value)}>
                                        {RUNTIME_OPTIONS.map((r) => (
                                            <option key={r} value={r}>
                                                {r}
                                            </option>
                                        ))}
                                    </Select>
                                </Field>
                                <Field label="Language">
                                    <Select value={form.language} onChange={(e) => set('language', e.target.value)}>
                                        {LANGUAGE_OPTIONS.map((l) => (
                                            <option key={l} value={l}>
                                                {l}
                                            </option>
                                        ))}
                                    </Select>
                                </Field>
                                <Field label="Tone">
                                    <Select value={form.tone} onChange={(e) => set('tone', e.target.value)}>
                                        {TONE_OPTIONS.map((t) => (
                                            <option key={t} value={t}>
                                                {t}
                                            </option>
                                        ))}
                                    </Select>
                                </Field>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <Button type="submit" size="lg">
                                    Generate
                                </Button>
                            </div>
                        </form>
                    </Card>
                ) : (
                    <Card className="p-8">
                        <SectionLabel>Generating</SectionLabel>
                        <p className="font-studio-serif text-xl text-studio-ivory mb-8">Preparing every asset for &ldquo;{form.question}&rdquo;</p>
                        <ul className="space-y-3">
                            {PIPELINE_STAGES.map((stage, i) => (
                                <li key={stage} className="flex items-center gap-3 text-sm">
                                    <span
                                        className={
                                            i < stageIndex
                                                ? 'w-2 h-2 rounded-full bg-studio-gold'
                                                : i === stageIndex
                                                  ? 'w-2 h-2 rounded-full bg-studio-gold animate-pulse'
                                                  : 'w-2 h-2 rounded-full bg-studio-line'
                                        }
                                    />
                                    <span className={i <= stageIndex ? 'text-studio-ink' : 'text-studio-muted'}>{stage}</span>
                                </li>
                            ))}
                        </ul>
                    </Card>
                )}
            </div>
        </StudioShell>
    );
}
