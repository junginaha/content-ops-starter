import React, { useState } from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import SectionLabel from '../ui/SectionLabel';

export default function StoryboardTab({ project }) {
    const [openScene, setOpenScene] = useState(1);

    return (
        <div className="max-w-4xl">
            <div className="flex items-center justify-between mb-8">
                <SectionLabel className="mb-0">25 Scene Storyboard</SectionLabel>
                <span className="text-xs text-studio-muted">
                    {project.scenes.reduce((sum, s) => sum + s.duration, 0)}s estimated runtime
                </span>
            </div>
            <div className="space-y-2">
                {project.scenes.map((scene) => {
                    const isOpen = openScene === scene.number;
                    return (
                        <Card key={scene.number} className="overflow-hidden">
                            <button
                                onClick={() => setOpenScene(isOpen ? null : scene.number)}
                                className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-studio-charcoal/40 transition-colors"
                            >
                                <span className="font-studio-serif text-studio-gold text-sm w-8 shrink-0">
                                    {String(scene.number).padStart(2, '0')}
                                </span>
                                <span className="flex-1 min-w-0 truncate text-studio-ink">{scene.subtitle}</span>
                                <Badge tone="muted" className="shrink-0">{scene.purpose}</Badge>
                                <span className="text-xs text-studio-muted shrink-0">{scene.duration}s</span>
                            </button>
                            {isOpen && (
                                <div className="px-5 pb-6 pt-1 grid sm:grid-cols-2 gap-x-8 gap-y-4 border-t border-studio-line">
                                    <div className="sm:col-span-2 pt-4">
                                        <span className="text-xs uppercase tracking-[0.12em] text-studio-muted">Narration</span>
                                        <p className="text-studio-ink mt-1 leading-relaxed">{scene.narration}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs uppercase tracking-[0.12em] text-studio-muted">Visual</span>
                                        <p className="text-studio-ink mt-1 leading-relaxed">{scene.visual}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs uppercase tracking-[0.12em] text-studio-muted">Camera Movement</span>
                                        <p className="text-studio-ink mt-1">{scene.camera}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs uppercase tracking-[0.12em] text-studio-muted">Lighting</span>
                                        <p className="text-studio-ink mt-1">{scene.lighting}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs uppercase tracking-[0.12em] text-studio-muted">Transition</span>
                                        <p className="text-studio-ink mt-1">{scene.transition}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs uppercase tracking-[0.12em] text-studio-muted">Sound Design</span>
                                        <p className="text-studio-ink mt-1">{scene.sound}</p>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <span className="text-xs uppercase tracking-[0.12em] text-studio-muted">Image Prompt</span>
                                        <p className="text-studio-ink/80 mt-1 leading-relaxed font-mono text-xs bg-studio-charcoal rounded-lg p-3 border border-studio-line">
                                            {scene.imagePrompt}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
