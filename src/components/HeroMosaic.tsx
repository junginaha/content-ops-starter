'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import type { Poster } from '@/types/database';

interface Tile {
    widthClass: string;
    translateClass: string;
    speed: number;
    hiddenOnMobile?: boolean;
}

const TILE_LAYOUT: Tile[] = [
    { widthClass: 'w-[15vw] min-w-[130px]', translateClass: '-translate-y-6', speed: -60 },
    { widthClass: 'w-[19vw] min-w-[160px]', translateClass: 'translate-y-10', speed: 40 },
    { widthClass: 'w-[13vw] min-w-[110px]', translateClass: '-translate-y-16', speed: -30, hiddenOnMobile: true },
    { widthClass: 'w-[21vw] min-w-[180px]', translateClass: 'translate-y-4', speed: 70 },
    { widthClass: 'w-[15vw] min-w-[130px]', translateClass: '-translate-y-10', speed: -45 },
    { widthClass: 'w-[13vw] min-w-[110px]', translateClass: 'translate-y-16', speed: 30, hiddenOnMobile: true },
    { widthClass: 'w-[18vw] min-w-[150px]', translateClass: '-translate-y-4', speed: -55 },
    { widthClass: 'w-[14vw] min-w-[120px]', translateClass: 'translate-y-8', speed: 50, hiddenOnMobile: true }
];

function MosaicTile({ poster, tile, scrollYProgress, reduceMotion }: { poster: Poster; tile: Tile; scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress']; reduceMotion: boolean }) {
    const y = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : tile.speed]);

    return (
        <motion.div
            style={{ y }}
            className={`group relative ${tile.widthClass} ${tile.translateClass} ${tile.hiddenOnMobile ? 'hidden sm:block' : ''} aspect-[5/7] shrink-0 overflow-hidden rounded-sm border border-line bg-beige shadow-soft`}
        >
            <Image src={poster.preview_image_url} alt={`${poster.city} — ${poster.viewpoint}`} fill sizes="20vw" className="object-cover" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/60 to-transparent p-2.5">
                <p className="font-serif text-sm text-ivory">{poster.city}</p>
                <p className="text-[10px] uppercase tracking-widest2 text-ivory/80">{poster.viewpoint}</p>
            </div>
        </motion.div>
    );
}

export function HeroMosaic({ posters }: { posters: Poster[] }) {
    const ref = useRef<HTMLDivElement>(null);
    const reduceMotion = Boolean(useReducedMotion());
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
    const tiles = posters.slice(0, TILE_LAYOUT.length);

    return (
        <section ref={ref} className="relative isolate overflow-hidden bg-ivory">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-ivory/10 to-ivory" />
            <div className="container-editorial flex min-h-[100svh] flex-col items-center justify-center gap-10 py-24 sm:gap-14">
                <motion.div
                    initial={reduceMotion ? undefined : { opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    className="z-10 max-w-2xl text-center"
                >
                    <p className="eyebrow">TRAVEL SKETCH ARCHIVE</p>
                    <h1 className="mt-4 text-6xl text-ink sm:text-7xl md:text-8xl">Travelog</h1>
                    <p className="mx-auto mt-6 max-w-md text-balance text-sm leading-relaxed text-stone sm:text-base">
                        Beautiful world landmarks and travel destinations, collected as source-backed pen-and-watercolor poster images.
                    </p>
                    <Link href="/browse" className="btn-browse mt-8 inline-flex">
                        BROWSE POSTERS
                    </Link>
                </motion.div>

                <div className="z-0 -mx-6 flex w-[calc(100%+3rem)] items-center justify-center gap-3 overflow-x-hidden px-2 sm:gap-4">
                    {tiles.map((poster, i) => (
                        <MosaicTile key={poster.id} poster={poster} tile={TILE_LAYOUT[i]} scrollYProgress={scrollYProgress} reduceMotion={reduceMotion} />
                    ))}
                </div>
            </div>
        </section>
    );
}
