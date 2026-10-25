import React, { useState } from 'react';
import StudioShell from '../../components/studio/StudioShell';
import Card from '../../components/studio/ui/Card';
import Button from '../../components/studio/ui/Button';
import SectionLabel from '../../components/studio/ui/SectionLabel';
import { Field, Input, Select } from '../../components/studio/ui/Fields';
import { useSettings } from '../../utils/studio/store';
import { LANGUAGE_OPTIONS, TONE_OPTIONS } from '../../utils/studio/constants';

export default function SettingsPage() {
    const { settings, update, hydrated } = useSettings({
        openaiApiKey: '',
        sunoApiKey: '',
        imageApiKey: '',
        defaultLanguage: LANGUAGE_OPTIONS[0],
        defaultTone: TONE_OPTIONS[0],
        creatorName: ''
    });
    const [saved, setSaved] = useState(false);

    function handleSave(e) {
        e.preventDefault();
        setSaved(true);
        setTimeout(() => setSaved(false), 1800);
    }

    if (!hydrated) {
        return (
            <StudioShell pageTitle="Settings" eyebrow="System" title="Settings">
                <p className="text-studio-muted">Loading…</p>
            </StudioShell>
        );
    }

    return (
        <StudioShell pageTitle="Settings" eyebrow="System" title="Settings">
            <form onSubmit={handleSave} className="max-w-2xl space-y-8">
                <Card className="p-8">
                    <SectionLabel>Studio Defaults</SectionLabel>
                    <div className="grid sm:grid-cols-2 gap-6">
                        <Field label="Creator Name">
                            <Input value={settings.creatorName} onChange={(e) => update({ creatorName: e.target.value })} />
                        </Field>
                        <Field label="Default Language">
                            <Select value={settings.defaultLanguage} onChange={(e) => update({ defaultLanguage: e.target.value })}>
                                {LANGUAGE_OPTIONS.map((l) => (
                                    <option key={l} value={l}>{l}</option>
                                ))}
                            </Select>
                        </Field>
                        <Field label="Default Tone">
                            <Select value={settings.defaultTone} onChange={(e) => update({ defaultTone: e.target.value })}>
                                {TONE_OPTIONS.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </Select>
                        </Field>
                    </div>
                </Card>

                <Card className="p-8">
                    <SectionLabel>Generation Providers</SectionLabel>
                    <p className="text-xs text-studio-muted mb-6 leading-relaxed">
                        Keys are stored only in this browser. Connect them to enable audio rendering (OpenAI TTS), music
                        rendering (Suno), and image rendering from the prompts the studio already generates.
                    </p>
                    <div className="space-y-5">
                        <Field label="OpenAI API Key">
                            <Input type="password" placeholder="sk-…" value={settings.openaiApiKey} onChange={(e) => update({ openaiApiKey: e.target.value })} />
                        </Field>
                        <Field label="Suno API Key">
                            <Input type="password" placeholder="suno-…" value={settings.sunoApiKey} onChange={(e) => update({ sunoApiKey: e.target.value })} />
                        </Field>
                        <Field label="Image Generation API Key">
                            <Input type="password" placeholder="…" value={settings.imageApiKey} onChange={(e) => update({ imageApiKey: e.target.value })} />
                        </Field>
                    </div>
                </Card>

                <div className="flex items-center gap-4">
                    <Button type="submit">{saved ? 'Saved' : 'Save Settings'}</Button>
                </div>
            </form>
        </StudioShell>
    );
}
