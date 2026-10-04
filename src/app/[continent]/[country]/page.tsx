import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ArchiveCard } from '@/components/ArchiveCard';
import { listCountries, listCities } from '@/lib/posters';

export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{ continent: string; country: string }>;
}

async function loadData(continentSlug: string, countrySlug: string) {
    const countries = await listCountries(continentSlug);
    const country = countries.find((c) => c.country_slug === countrySlug);
    if (!country) return null;
    const cities = await listCities(continentSlug, countrySlug);
    return { country, cities };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { continent, country } = await params;
    const data = await loadData(continent, country);
    if (!data) return {};
    return {
        title: `${data.country.country} 여행 포스터 아카이브`,
        description: `${data.country.country}의 취재 기반 펜화·수채화 여행 포스터를 도시별로 살펴보세요.`,
        alternates: { canonical: `/${data.country.continent_slug}/${data.country.country_slug}` }
    };
}

export default async function CountryPage({ params }: Props) {
    const { continent: continentSlug, country: countrySlug } = await params;
    const data = await loadData(continentSlug, countrySlug);
    if (!data) notFound();

    return (
        <div className="container-editorial py-16 sm:py-20">
            <Breadcrumbs
                items={[
                    { label: 'Home', href: '/' },
                    { label: data.country.continent, href: `/${continentSlug}` },
                    { label: data.country.country }
                ]}
            />
            <header className="mb-12">
                <p className="eyebrow">Country Archive</p>
                <h1 className="mt-2 text-4xl text-ink sm:text-5xl">{data.country.country}</h1>
                <p className="mt-3 text-sm text-stone">포스터 {data.country.posterCount.toLocaleString()}개 · 도시 {data.cities.length.toLocaleString()}개</p>
            </header>

            <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3">
                {data.cities.map((city) => (
                    <ArchiveCard key={city.city_slug} href={`/${continentSlug}/${countrySlug}/${city.city_slug}`} image={city.coverImage} title={city.city} subtitle={`${city.posterCount} posters`} />
                ))}
            </div>
        </div>
    );
}
