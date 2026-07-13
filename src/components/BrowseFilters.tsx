'use client';

import { useCallback, useMemo, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { ContinentSummary, CountrySummary } from '@/lib/posters';

export function BrowseFilters({ continents, countries }: { continents: ContinentSummary[]; countries: CountrySummary[] }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [q, setQ] = useState(searchParams.get('q') ?? '');

    const continentSlug = searchParams.get('continent') ?? '';
    const countrySlug = searchParams.get('country') ?? '';

    const countryOptions = useMemo(() => (continentSlug ? countries.filter((c) => c.continent_slug === continentSlug) : countries), [countries, continentSlug]);

    const updateParams = useCallback(
        (updates: Record<string, string | null>) => {
            const params = new URLSearchParams(searchParams.toString());
            for (const [key, value] of Object.entries(updates)) {
                if (value) params.set(key, value);
                else params.delete(key);
            }
            params.delete('page');
            startTransition(() => {
                router.push(`${pathname}?${params.toString()}`, { scroll: false });
            });
        },
        [pathname, router, searchParams]
    );

    const hasFilters = Boolean(q || continentSlug || countrySlug);

    return (
        <div className="space-y-6">
            <form
                role="search"
                onSubmit={(e) => {
                    e.preventDefault();
                    updateParams({ q: q || null });
                }}
                className="flex max-w-md items-center gap-2"
            >
                <label htmlFor="poster-search" className="sr-only">
                    도시, 국가, 대륙, 랜드마크, 조망 지점, 포스터명으로 검색
                </label>
                <input
                    id="poster-search"
                    type="search"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="City, country, landmark, viewpoint…"
                    className="w-full rounded-full border border-line bg-transparent px-4 py-2.5 text-sm text-ink placeholder:text-stone/70 focus:border-ink"
                />
                <button type="submit" className="btn-browse shrink-0 px-4 py-2.5">
                    검색
                </button>
            </form>

            <div className="flex flex-wrap items-center gap-2">
                <button
                    type="button"
                    onClick={() => updateParams({ continent: null, country: null })}
                    aria-pressed={!continentSlug}
                    className={`rounded-full border px-4 py-1.5 text-xs uppercase tracking-widest2 transition-colors ${
                        !continentSlug ? 'border-ink bg-ink text-ivory' : 'border-line text-stone hover:border-ink hover:text-ink'
                    }`}
                >
                    All Continents
                </button>
                {continents.map((c) => (
                    <button
                        key={c.continent_slug}
                        type="button"
                        onClick={() => updateParams({ continent: c.continent_slug, country: null })}
                        aria-pressed={continentSlug === c.continent_slug}
                        className={`rounded-full border px-4 py-1.5 text-xs uppercase tracking-widest2 transition-colors ${
                            continentSlug === c.continent_slug ? 'border-ink bg-ink text-ivory' : 'border-line text-stone hover:border-ink hover:text-ink'
                        }`}
                    >
                        {c.continent}
                    </button>
                ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <label htmlFor="country-select" className="text-xs uppercase tracking-widest2 text-stone">
                    Country
                </label>
                <select
                    id="country-select"
                    value={countrySlug}
                    onChange={(e) => updateParams({ country: e.target.value || null })}
                    className="rounded-full border border-line bg-transparent px-4 py-1.5 text-sm text-ink focus:border-ink"
                >
                    <option value="">All Countries</option>
                    {countryOptions.map((c) => (
                        <option key={`${c.continent_slug}-${c.country_slug}`} value={c.country_slug}>
                            {c.country}
                        </option>
                    ))}
                </select>

                {hasFilters && (
                    <button
                        type="button"
                        onClick={() => {
                            setQ('');
                            updateParams({ q: null, continent: null, country: null });
                        }}
                        className="text-xs text-stone underline decoration-line underline-offset-4 transition-colors hover:text-ink"
                    >
                        필터 초기화
                    </button>
                )}
                {isPending && <span className="text-xs text-stone">불러오는 중…</span>}
            </div>
        </div>
    );
}
