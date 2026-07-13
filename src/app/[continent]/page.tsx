import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ArchiveCard } from '@/components/ArchiveCard';
import { listContinents, listCountries } from '@/lib/posters';

export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{ continent: string }>;
}

async function loadData(continentSlug: string) {
    const continents = await listContinents();
    const continent = continents.find((c) => c.continent_slug === continentSlug);
    if (!continent) return null;
    const countries = await listCountries(continentSlug);
    return { continent, countries };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { continent } = await params;
    const data = await loadData(continent);
    if (!data) return {};
    return {
        title: `${data.continent.continent} 여행 포스터 아카이브`,
        description: `${data.continent.continent} 지역의 취재 기반 펜화·수채화 여행 포스터를 국가별로 살펴보세요.`,
        alternates: { canonical: `/${data.continent.continent_slug}` }
    };
}

export default async function ContinentPage({ params }: Props) {
    const { continent: continentSlug } = await params;
    const data = await loadData(continentSlug);
    if (!data) notFound();

    return (
        <div className="container-editorial py-16 sm:py-20">
            <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Browse', href: '/browse' }, { label: data.continent.continent }]} />
            <header className="mb-12">
                <p className="eyebrow">Continent Archive</p>
                <h1 className="mt-2 text-4xl text-ink sm:text-5xl">{data.continent.continent}</h1>
                <p className="mt-3 text-sm text-stone">포스터 {data.continent.posterCount.toLocaleString()}개 · 국가 {data.countries.length.toLocaleString()}개</p>
            </header>

            <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3">
                {data.countries.map((country) => (
                    <ArchiveCard
                        key={country.country_slug}
                        href={`/${data.continent.continent_slug}/${country.country_slug}`}
                        image={country.coverImage}
                        title={country.country}
                        subtitle={`${country.posterCount} posters`}
                    />
                ))}
            </div>
        </div>
    );
}
