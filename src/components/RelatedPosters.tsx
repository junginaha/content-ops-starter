import { PosterCard } from '@/components/PosterCard';
import type { Poster } from '@/types/database';

function RelatedGroup({ title, posters }: { title: string; posters: Poster[] }) {
    if (posters.length === 0) return null;
    return (
        <div className="border-t border-line pt-10">
            <h2 className="mb-6 font-serif text-2xl text-ink">{title}</h2>
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
                {posters.map((poster) => (
                    <PosterCard key={poster.id} poster={poster} />
                ))}
            </div>
        </div>
    );
}

export function RelatedPosters({ sameCity, sameCountry, sameContinent, cityName, countryName, continentName }: { sameCity: Poster[]; sameCountry: Poster[]; sameContinent: Poster[]; cityName: string; countryName: string; continentName: string }) {
    return (
        <section className="container-editorial space-y-16 py-20 sm:py-28">
            <RelatedGroup title={`${cityName}의 다른 조망 지점`} posters={sameCity} />
            <RelatedGroup title={`${countryName}의 다른 포스터`} posters={sameCountry} />
            <RelatedGroup title={`${continentName}의 다른 포스터`} posters={sameContinent} />
        </section>
    );
}
