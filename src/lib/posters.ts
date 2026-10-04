import { createSupabasePublicClient } from '@/lib/supabase/public';
import type { Poster } from '@/types/database';

export const PAGE_SIZE = 24;

export interface BrowseFilters {
    q?: string;
    continent?: string;
    country?: string;
    page?: number;
}

export interface BrowseResult {
    posters: Poster[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}

/** Paginated, filtered gallery query. Never ships the full archive in one response. */
export async function browsePosters(filters: BrowseFilters): Promise<BrowseResult> {
    const supabase = createSupabasePublicClient();
    const page = Math.max(1, filters.page ?? 1);
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase.from('posters').select('*', { count: 'exact' }).eq('status', 'published');

    if (filters.continent) {
        query = query.eq('continent_slug', filters.continent);
    }
    if (filters.country) {
        query = query.eq('country_slug', filters.country);
    }
    if (filters.q && filters.q.trim()) {
        const term = filters.q.trim();
        query = query.or(
            `city.ilike.%${term}%,country.ilike.%${term}%,continent.ilike.%${term}%,viewpoint.ilike.%${term}%,slug.ilike.%${term}%`
        );
    }

    const { data, error, count } = await query.order('sort_order', { ascending: true }).range(from, to);

    if (error) {
        throw new Error(`Failed to load posters: ${error.message}`);
    }

    const total = count ?? 0;
    return {
        posters: data ?? [],
        total,
        page,
        pageSize: PAGE_SIZE,
        hasMore: from + (data?.length ?? 0) < total
    };
}

export async function getPosterBySlugPath(continentSlug: string, countrySlug: string, citySlug: string, posterSlug: string): Promise<Poster | null> {
    const supabase = createSupabasePublicClient();
    const { data, error } = await supabase
        .from('posters')
        .select('*')
        .eq('status', 'published')
        .eq('continent_slug', continentSlug)
        .eq('country_slug', countrySlug)
        .eq('city_slug', citySlug)
        .eq('slug', posterSlug)
        .maybeSingle();

    if (error) throw new Error(`Failed to load poster: ${error.message}`);
    return data;
}

export async function getPosterById(id: string): Promise<Poster | null> {
    const supabase = createSupabasePublicClient();
    const { data, error } = await supabase.from('posters').select('*').eq('id', id).maybeSingle();
    if (error) throw new Error(`Failed to load poster: ${error.message}`);
    return data;
}

export async function getFeaturedPosters(limit = 8): Promise<Poster[]> {
    const supabase = createSupabasePublicClient();
    const { data, error } = await supabase.from('posters').select('*').eq('status', 'published').order('sort_order', { ascending: true }).limit(limit);
    if (error) throw new Error(error.message);
    return data ?? [];
}

export async function getArchiveStats() {
    const supabase = createSupabasePublicClient();
    const [{ count: posterCount }, { data: cities }] = await Promise.all([
        supabase.from('posters').select('*', { count: 'exact', head: true }).eq('status', 'published'),
        supabase.from('posters').select('city_slug, viewpoint').eq('status', 'published')
    ]);

    const uniqueCities = new Set((cities ?? []).map((row) => row.city_slug));
    const totalViewpoints = (cities ?? []).length;

    return {
        totalPosters: posterCount ?? 0,
        totalCities: uniqueCities.size,
        totalViewpoints
    };
}

export interface ContinentSummary {
    continent: string;
    continent_slug: string;
    posterCount: number;
    coverImage: string;
}

export async function listContinents(): Promise<ContinentSummary[]> {
    const supabase = createSupabasePublicClient();
    const { data, error } = await supabase.from('posters').select('continent, continent_slug, preview_image_url').eq('status', 'published').order('sort_order', { ascending: true });
    if (error) throw new Error(error.message);

    const map = new Map<string, ContinentSummary>();
    for (const row of data ?? []) {
        const key = row.continent_slug;
        if (!map.has(key)) {
            map.set(key, { continent: row.continent, continent_slug: row.continent_slug, posterCount: 0, coverImage: row.preview_image_url });
        }
        map.get(key)!.posterCount += 1;
    }
    return Array.from(map.values()).sort((a, b) => a.continent.localeCompare(b.continent));
}

export interface CountrySummary {
    country: string;
    country_slug: string;
    continent: string;
    continent_slug: string;
    posterCount: number;
    coverImage: string;
}

export async function listCountries(continentSlug?: string): Promise<CountrySummary[]> {
    const supabase = createSupabasePublicClient();
    let query = supabase.from('posters').select('country, country_slug, continent, continent_slug, preview_image_url').eq('status', 'published');
    if (continentSlug) query = query.eq('continent_slug', continentSlug);
    const { data, error } = await query.order('sort_order', { ascending: true });
    if (error) throw new Error(error.message);

    const map = new Map<string, CountrySummary>();
    for (const row of data ?? []) {
        const key = `${row.continent_slug}/${row.country_slug}`;
        if (!map.has(key)) {
            map.set(key, { country: row.country, country_slug: row.country_slug, continent: row.continent, continent_slug: row.continent_slug, posterCount: 0, coverImage: row.preview_image_url });
        }
        map.get(key)!.posterCount += 1;
    }
    return Array.from(map.values()).sort((a, b) => a.country.localeCompare(b.country));
}

export interface CitySummary {
    city: string;
    city_slug: string;
    country: string;
    country_slug: string;
    continent: string;
    continent_slug: string;
    posterCount: number;
    coverImage: string;
}

export async function listCities(continentSlug: string, countrySlug?: string): Promise<CitySummary[]> {
    const supabase = createSupabasePublicClient();
    let query = supabase
        .from('posters')
        .select('city, city_slug, country, country_slug, continent, continent_slug, preview_image_url')
        .eq('status', 'published')
        .eq('continent_slug', continentSlug);
    if (countrySlug) query = query.eq('country_slug', countrySlug);
    const { data, error } = await query.order('sort_order', { ascending: true });
    if (error) throw new Error(error.message);

    const map = new Map<string, CitySummary>();
    for (const row of data ?? []) {
        const key = `${row.country_slug}/${row.city_slug}`;
        if (!map.has(key)) {
            map.set(key, {
                city: row.city,
                city_slug: row.city_slug,
                country: row.country,
                country_slug: row.country_slug,
                continent: row.continent,
                continent_slug: row.continent_slug,
                posterCount: 0,
                coverImage: row.preview_image_url
            });
        }
        map.get(key)!.posterCount += 1;
    }
    return Array.from(map.values()).sort((a, b) => a.city.localeCompare(b.city));
}

export async function getPostersByCity(continentSlug: string, countrySlug: string, citySlug: string): Promise<Poster[]> {
    const supabase = createSupabasePublicClient();
    const { data, error } = await supabase
        .from('posters')
        .select('*')
        .eq('status', 'published')
        .eq('continent_slug', continentSlug)
        .eq('country_slug', countrySlug)
        .eq('city_slug', citySlug)
        .order('sort_order', { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
}

/** Deterministic related-poster sets: same city, then same country, then same continent, excluding the current poster. */
export async function getRelatedPosters(poster: Poster) {
    const supabase = createSupabasePublicClient();

    async function fetchSet(column: 'city_slug' | 'country_slug' | 'continent_slug', limit: number) {
        const { data, error } = await supabase
            .from('posters')
            .select('*')
            .eq('status', 'published')
            .eq(column, poster[column])
            .neq('id', poster.id)
            .order('sort_order', { ascending: true })
            .order('id', { ascending: true })
            .limit(limit);
        if (error) throw new Error(error.message);
        return data ?? [];
    }

    const [sameCity, sameCountry, sameContinent] = await Promise.all([fetchSet('city_slug', 6), fetchSet('country_slug', 8), fetchSet('continent_slug', 20)]);

    return { sameCity, sameCountry, sameContinent };
}
