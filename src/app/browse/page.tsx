import type { Metadata } from 'next';
import { BrowseFilters } from '@/components/BrowseFilters';
import { PosterCard } from '@/components/PosterCard';
import { Pagination } from '@/components/Pagination';
import { browsePosters, listContinents, listCountries } from '@/lib/posters';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Browse — Gallery',
    description: 'Travelog 전체 여행 포스터 아카이브를 도시, 국가, 대륙별로 검색하고 필터링하세요.'
};

interface BrowsePageProps {
    searchParams: Promise<Record<string, string | undefined>>;
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
    const params = await searchParams;
    const page = Math.max(1, Number(params.page ?? '1') || 1);

    const [result, continents, countries] = await Promise.all([
        browsePosters({ q: params.q, continent: params.continent, country: params.country, page }),
        listContinents(),
        listCountries()
    ]);

    const cityCount = new Set(result.posters.map((p) => p.city_slug)).size;
    const activeFilters = [params.q && `"${params.q}"`, params.continent && continents.find((c) => c.continent_slug === params.continent)?.continent, params.country && countries.find((c) => c.country_slug === params.country)?.country].filter(
        Boolean
    );

    return (
        <div className="container-editorial py-16 sm:py-20">
            <header className="mb-10">
                <p className="eyebrow">TRAVELOG BROWSE</p>
                <h1 className="mt-2 text-4xl text-ink sm:text-5xl">Gallery</h1>
            </header>

            <BrowseFilters continents={continents} countries={countries} />

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6 text-sm text-stone">
                <p>
                    포스터 {result.total.toLocaleString()}개 · 도시 {cityCount.toLocaleString()}개
                    {params.q && <> · 검색결과 {result.total.toLocaleString()}건</>}
                </p>
                {activeFilters.length > 0 && <p className="text-xs uppercase tracking-widest2">Filters: {activeFilters.join(', ')}</p>}
            </div>

            {result.posters.length === 0 ? (
                <div className="mt-24 flex flex-col items-center gap-3 py-24 text-center">
                    <p className="font-serif text-2xl text-ink">일치하는 포스터가 없습니다</p>
                    <p className="text-sm text-stone">검색어나 필터를 조정해 다시 시도해 보세요.</p>
                </div>
            ) : (
                <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
                    {result.posters.map((poster) => (
                        <PosterCard key={poster.id} poster={poster} />
                    ))}
                </div>
            )}

            <Pagination page={result.page} hasMore={result.hasMore} searchParams={params} />
        </div>
    );
}
