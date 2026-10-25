import React from 'react';
import Card from '../ui/Card';
import SectionLabel from '../ui/SectionLabel';
import CopyButton from '../ui/CopyButton';

export default function ImagesTab({ project }) {
    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <SectionLabel className="mb-0">25 Image Prompts</SectionLabel>
                <CopyButton text={project.imagePrompts.map((p) => `Scene ${p.sceneNumber}: ${p.prompt}`).join('\n\n')} label="Copy All" />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.imagePrompts.map((p) => (
                    <Card key={p.sceneNumber} className="p-5 flex flex-col">
                        <div className="aspect-video rounded-lg bg-studio-charcoal border border-studio-line flex items-center justify-center mb-4">
                            <span className="font-studio-serif text-studio-line text-3xl">{String(p.sceneNumber).padStart(2, '0')}</span>
                        </div>
                        <p className="text-xs text-studio-ink/80 leading-relaxed flex-1">{p.prompt}</p>
                        <CopyButton text={p.prompt} className="mt-3 self-start -ml-3" />
                    </Card>
                ))}
            </div>
        </div>
    );
}
