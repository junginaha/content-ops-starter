import React from 'react';
import Card from '../ui/Card';
import SectionLabel from '../ui/SectionLabel';
import CopyButton from '../ui/CopyButton';

export default function ThumbnailTab({ project }) {
    return (
        <div>
            <SectionLabel>Thumbnail Concepts</SectionLabel>
            <div className="grid sm:grid-cols-3 gap-5">
                {project.thumbnails.map((t, i) => (
                    <Card key={i} className="p-5 flex flex-col">
                        <div className="aspect-[16/10] rounded-lg bg-studio-charcoal border border-studio-line flex items-center justify-center mb-4">
                            <span className="font-studio-serif text-studio-line text-3xl">{i + 1}</span>
                        </div>
                        <p className="font-studio-serif text-studio-ivory leading-snug mb-2">{t.headline}</p>
                        <p className="text-xs text-studio-ink/80 leading-relaxed flex-1">{t.imagePrompt}</p>
                        <p className="text-xs text-studio-gold mt-3">{t.ctrNote}</p>
                        <CopyButton text={t.imagePrompt} className="mt-3 self-start -ml-3" />
                    </Card>
                ))}
            </div>
        </div>
    );
}
