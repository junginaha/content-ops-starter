import React from 'react';
import Card from '../ui/Card';
import SectionLabel from '../ui/SectionLabel';

export default function ResearchTab({ project }) {
    const { research } = project;
    return (
        <div className="max-w-3xl space-y-8">
            <Card className="p-8">
                <SectionLabel>Historical Context</SectionLabel>
                <p className="text-studio-ink leading-relaxed">{research.historicalContext}</p>
            </Card>
            <Card className="p-8">
                <SectionLabel>Author Context</SectionLabel>
                <p className="text-studio-ink leading-relaxed">{research.authorContext}</p>
            </Card>
            <Card className="p-8">
                <SectionLabel>Key Passages</SectionLabel>
                <ul className="space-y-4">
                    {research.keyPassages.map((p, i) => (
                        <li key={i} className="flex gap-3 text-studio-ink leading-relaxed">
                            <span className="text-studio-gold font-studio-serif">&ldquo;</span>
                            <span>{p}</span>
                        </li>
                    ))}
                </ul>
            </Card>
            <Card className="p-8">
                <SectionLabel>Contrasting Interpretations</SectionLabel>
                <ul className="space-y-4">
                    {research.interpretations.map((p, i) => (
                        <li key={i} className="text-studio-ink leading-relaxed">
                            {p}
                        </li>
                    ))}
                </ul>
            </Card>
            <Card className="p-8">
                <SectionLabel>Modern Case Study</SectionLabel>
                <p className="text-studio-ink leading-relaxed">{research.caseStudy}</p>
            </Card>
        </div>
    );
}
