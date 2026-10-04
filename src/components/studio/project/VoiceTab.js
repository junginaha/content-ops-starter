import React, { useState } from 'react';
import Card from '../ui/Card';
import SectionLabel from '../ui/SectionLabel';
import Button from '../ui/Button';
import { Field, Select } from '../ui/Fields';
import { TTS_VOICES, TTS_EMOTIONS, TTS_PAUSE_STYLES } from '../../../utils/studio/constants';

export default function VoiceTab({ project, onUpdate }) {
    const { voice } = project;
    const [notice, setNotice] = useState(false);

    function set(patch) {
        onUpdate({ voice: { ...voice, ...patch } });
    }

    return (
        <div className="max-w-2xl space-y-8">
            <Card className="p-8">
                <SectionLabel>Voice Studio</SectionLabel>
                <div className="grid sm:grid-cols-2 gap-6">
                    <Field label="Voice">
                        <Select value={voice.voice} onChange={(e) => set({ voice: e.target.value })}>
                            {TTS_VOICES.map((v) => (
                                <option key={v} value={v}>
                                    {v}
                                </option>
                            ))}
                        </Select>
                    </Field>
                    <Field label="Emotion">
                        <Select value={voice.emotion} onChange={(e) => set({ emotion: e.target.value })}>
                            {TTS_EMOTIONS.map((v) => (
                                <option key={v} value={v}>
                                    {v}
                                </option>
                            ))}
                        </Select>
                    </Field>
                    <Field label="Speaking Speed">
                        <Select value={voice.speed} onChange={(e) => set({ speed: Number(e.target.value) })}>
                            {[0.8, 0.85, 0.9, 0.95, 1.0, 1.05, 1.1].map((v) => (
                                <option key={v} value={v}>
                                    {v}x
                                </option>
                            ))}
                        </Select>
                    </Field>
                    <Field label="Pause Style">
                        <Select value={voice.pauseStyle} onChange={(e) => set({ pauseStyle: e.target.value })}>
                            {TTS_PAUSE_STYLES.map((v) => (
                                <option key={v} value={v}>
                                    {v}
                                </option>
                            ))}
                        </Select>
                    </Field>
                </div>
            </Card>

            <Card className="p-8">
                <SectionLabel>Narrator Direction</SectionLabel>
                <p className="text-studio-ink leading-relaxed">{voice.direction}</p>
            </Card>

            <Card className="p-8 flex items-center justify-between gap-4">
                <div>
                    <p className="text-studio-ink">Generate MP3</p>
                    <p className="text-xs text-studio-muted mt-1">Connect an OpenAI API key in Settings to render audio.</p>
                </div>
                <Button
                    variant="secondary"
                    onClick={() => {
                        setNotice(true);
                        setTimeout(() => setNotice(false), 2500);
                    }}
                >
                    {notice ? 'Connect API key first' : 'Generate MP3'}
                </Button>
            </Card>
        </div>
    );
}
