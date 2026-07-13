import Image from 'next/image';
import Link from 'next/link';
import type { Poster } from '@/types/database';

export function posterHref(poster: Poster): string {
    return `/${poster.continent_slug}/${poster.country_slug}/${poster.city_slug}/${poster.slug}`;
}

export function PosterCard({ poster, priority = false, sizes = '(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw' }: { poster: Poster; priority?: boolean; sizes?: string }) {
    return (
        <Link href={posterHref(poster)} className="group block">
            <div className="relative aspect-[5/7] w-full overflow-hidden rounded-sm border border-line bg-beige shadow-soft">
                <Image
                    src={poster.preview_image_url}
                    alt={`${poster.city}, ${poster.country} — ${poster.viewpoint}`}
                    fill
                    sizes={sizes}
                    priority={priority}
                    className="object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.03]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent opacity-0 transition-opacity duration-500 ease-editorial group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 translate-y-1 p-4 opacity-0 transition-all duration-500 ease-editorial group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="font-serif text-lg text-ivory">{poster.city}</p>
                    <p className="text-xs uppercase tracking-widest2 text-ivory/80">{poster.viewpoint}</p>
                </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between gap-2">
                <div>
                    <p className="font-serif text-base text-ink">{poster.city}</p>
                    <p className="text-xs text-stone">{poster.country}</p>
                </div>
                <p className="max-w-[45%] truncate text-right text-xs text-stone">{poster.viewpoint}</p>
            </div>
        </Link>
    );
}
