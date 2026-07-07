import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Button from '../../components/studio/ui/Button';

const WORKFLOW = [
    'Current Trend',
    'Human Question',
    'Book Selection',
    'Deep Research',
    'Documentary Script',
    'Scene Storyboard',
    'Image Prompts',
    'Voice Generation',
    'Music Generation',
    'Thumbnail Design',
    'SEO Package',
    'Filmora Export',
    'YouTube Publishing'
];

export default function StudioHome() {
    return (
        <div className="studio-root min-h-screen bg-studio-black text-studio-ink font-studio-sans">
            <Head>
                <title>Question Studio — Explore Questions. Create Documentary.</title>
                <meta
                    name="description"
                    content="Question Studio is the AI creative operating system for producing cinematic documentary-style YouTube videos based on books."
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <header className="flex items-center justify-between px-6 lg:px-12 py-7">
                <span className="font-studio-serif text-lg tracking-wide text-studio-ivory">Question Studio</span>
                <Link href="/studio/dashboard" className="text-sm text-studio-muted hover:text-studio-ivory transition-colors">
                    Enter Studio →
                </Link>
            </header>

            <section className="relative px-6 lg:px-12 pt-20 pb-28 max-w-5xl mx-auto text-center">
                <div className="absolute inset-x-0 top-0 h-[520px] bg-gradient-to-b from-studio-blue/10 via-transparent to-transparent pointer-events-none" />
                <span className="relative inline-block text-xs uppercase tracking-[0.3em] text-studio-gold mb-8">
                    An AI Documentary Operating System
                </span>
                <h1 className="relative font-studio-serif text-[13vw] leading-[0.95] sm:text-7xl md:text-8xl text-studio-ivory tracking-tight">
                    QUESTION
                    <br />
                    STUDIO
                </h1>
                <p className="relative mt-8 text-xl md:text-2xl text-studio-ink/90 font-studio-serif italic">
                    Explore Questions. Create Documentary.
                </p>
                <p className="relative mt-6 max-w-xl mx-auto text-studio-muted leading-relaxed">
                    Books are not the destination. Books are evidence used to explore timeless human questions.
                </p>
                <div className="relative mt-12 flex flex-wrap items-center justify-center gap-4">
                    <Button href="/studio/projects/new" size="lg">
                        Create Documentary
                    </Button>
                    <Button href="/studio/dashboard" variant="secondary" size="lg">
                        Continue Project
                    </Button>
                </div>
            </section>

            <section className="border-t border-studio-line px-6 lg:px-12 py-24">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-start">
                    <div>
                        <span className="text-xs uppercase tracking-[0.2em] text-studio-gold">Philosophy</span>
                        <h2 className="font-studio-serif text-3xl md:text-4xl text-studio-ivory mt-4 leading-tight">
                            The book is evidence.
                            <br />
                            The question is the story.
                        </h2>
                    </div>
                    <p className="text-studio-muted leading-relaxed pt-2">
                        Question Studio is a creative operating system for a solo creator to produce cinematic, documentary-style
                        YouTube videos rooted in books — without ever making a book summary. Every project begins with a trend,
                        sharpens into a human question, and is explored through a book chosen as evidence. From there, the studio
                        prepares every asset a documentary needs: research, script, storyboard, image prompts, voice, music,
                        thumbnail, and SEO — organized, cinematic, and ready to edit.
                    </p>
                </div>
            </section>

            <section className="border-t border-studio-line px-6 lg:px-12 py-24">
                <div className="max-w-5xl mx-auto">
                    <span className="text-xs uppercase tracking-[0.2em] text-studio-gold">The Workflow</span>
                    <h2 className="font-studio-serif text-3xl md:text-4xl text-studio-ivory mt-4 mb-14">One question, fully produced.</h2>
                    <ol className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-6">
                        {WORKFLOW.map((step, i) => (
                            <li key={step} className="flex items-baseline gap-4 border-b border-studio-line pb-4">
                                <span className="font-studio-serif text-studio-gold text-sm w-6 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                                <span className="text-studio-ink">{step}</span>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            <footer className="border-t border-studio-line px-6 lg:px-12 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-studio-muted">
                <span>© {new Date().getFullYear()} Question Studio.</span>
                <span className="font-studio-serif italic text-studio-ink/70">&ldquo;Explore the questions a book asks.&rdquo;</span>
            </footer>
        </div>
    );
}
