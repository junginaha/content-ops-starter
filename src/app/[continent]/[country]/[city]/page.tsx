import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { PosterCard } from '@/components/PosterCard';
import { getPostersByCity } from '@/lib/posters';

export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{ continent: string; country: string; city: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { continent, country, city } = await params;
    const posters = await getPostersByCity(continent, country, city);
    if (posters.length === 0) return {};
    const first = posters[0];
    return {
        title: `${first.city} 여행 포스터 아카이브`,
        description: `${first.city}의 실제 조망 지점을 취재하여 제작한 펜화·수채화 여행 포스터 ${posters.length}점을 만나보세요.`,
        alternates: { canonical: `/${first.continent_slug}/${first.country_slug}/${first.city_slug}` }
    };
}

export default async function CityPage({ params }: Props) {
    const { continent: continentSlug, country: countrySlug, city: citySlug } = await params;
    const posters = await getPostersByCity(continentSlug, countrySlug, citySlug);
    if (posters.length === 0) notFound();
    const first = posters[0];

    return (
        <div className="container-editorial py-16 sm:py-20">
            <Breadcrumbs
                items={[
                    { label: 'Home', href: '/' },
                    { label: first.continent, href: `/${continentSlug}` },
                    { label: first.country, href: `/${continentSlug}/${countrySlug}` },
                    { label: first.city }
                ]}
            />
            <header className="mb-12">
                <p className="eyebrow">City Archive</p>
                <h1 className="mt-2 text-4xl text-ink sm:text-5xl">{first.city}</h1>
                <p className="mt-3 text-sm text-stone">조망 지점 {posters.length.toLocaleString()}곳 취재 · {first.country}</p>
            </header>

            <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
                {posters.map((poster) => (
                    <PosterCard key={poster.id} poster={poster} />
                ))}
            </div>
        </div>
    );
}
