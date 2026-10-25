import React from 'react';
import Card from '../ui/Card';
import SectionLabel from '../ui/SectionLabel';
import CopyButton from '../ui/CopyButton';

export default function ScriptTab({ project }) {
    const { script } = project;
    const fullText = script.sections.map((s) => `${s.heading}\n\n${s.content}`).join('\n\n');

    return (
        <div className="max-w-3xl">
            <div className="flex items-start justify-between gap-4 mb-8">
                <div>
                    <SectionLabel>Documentary Script</SectionLabel>
                    <h2 className="font-studio-serif text-3xl text-studio-ivory leading-snug">{script.title}</h2>
                    <p className="text-sm text-studio-muted mt-2">{script.subtitle} · {script.wordCount} words</p>
                </div>
                <CopyButton text={fullText} label="Copy Script" />
            </div>
            <div className="space-y-10">
                {script.sections.map((s) => (
                    <div key={s.heading}>
                        <h3 className="font-studio-serif text-lg text-studio-gold mb-3">{s.heading}</h3>
                        <p className="text-studio-ink leading-relaxed">{s.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
