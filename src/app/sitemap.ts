import type { MetadataRoute } from 'next';
import { env } from '@/lib/env';
import { listContinents, listCountries, listCities, browsePosters } from '@/lib/posters';

export const dynamic = 'force-dynamic';

async function loadDynamicEntries(): Promise<MetadataRoute.Sitemap> {
    const entries: MetadataRoute.Sitemap = [];

    try {
        const continents = await listContinents();
        for (const c of continents) {
            entries.push({ url: `${env.siteUrl}/${c.continent_slug}`, changeFrequency: 'weekly', priority: 0.6 });
        }

        const countries = await listCountries();
        for (const c of countries) {
            entries.push({ url: `${env.siteUrl}/${c.continent_slug}/${c.country_slug}`, changeFrequency: 'weekly', priority: 0.6 });
        }

        for (const c of continents) {
            const cities = await listCities(c.continent_slug);
            for (const city of cities) {
                entries.push({ url: `${env.siteUrl}/${city.continent_slug}/${city.country_slug}/${city.city_slug}`, changeFrequency: 'weekly', priority: 0.6 });
            }
        }

        let page = 1;
        // Walk every page of the published archive so every poster detail URL is included.
        for (;;) {
            const result = await browsePosters({ page });
            for (const poster of result.posters) {
                entries.push({
                    url: `${env.siteUrl}/${poster.continent_slug}/${poster.country_slug}/${poster.city_slug}/${poster.slug}`,
                    lastModified: poster.updated_at,
                    changeFrequency: 'monthly',
                    priority: 0.8
                });
            }
            if (!result.hasMore) break;
            page += 1;
        }
    } catch {
        // Supabase not configured / unreachable — fall back to the static route list below
        // so the build never fails just because live content can't be read.
    }

    return entries;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticRoutes: MetadataRoute.Sitemap = [
        { url: env.siteUrl, changeFrequency: 'daily', priority: 1 },
        { url: `${env.siteUrl}/browse`, changeFrequency: 'daily', priority: 0.9 },
        { url: `${env.siteUrl}/license`, changeFrequency: 'yearly', priority: 0.3 },
        { url: `${env.siteUrl}/terms`, changeFrequency: 'yearly', priority: 0.3 },
        { url: `${env.siteUrl}/privacy`, changeFrequency: 'yearly', priority: 0.3 }
    ];

    return [...staticRoutes, ...(await loadDynamicEntries())];
}
