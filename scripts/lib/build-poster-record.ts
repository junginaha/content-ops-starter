import { slugify } from './slugify';
import { CITY_EN, COUNTRY_EN, VIEWPOINT_EN } from '../data/romanization';
import type { PosterSeed } from '../data/posters';

export interface PosterRecord extends PosterSeed {
    cityEn: string;
    countryEn: string;
    viewpointEn: string;
    continentSlug: string;
    countrySlug: string;
    citySlug: string;
    slug: string;
    mapQuery: string;
    originalFilename: string;
}

export function buildPosterRecord(seed: PosterSeed): PosterRecord {
    const cityEn = CITY_EN[seed.city];
    const countryEn = COUNTRY_EN[seed.country];
    const viewpointEn = VIEWPOINT_EN[seed.viewpoint];

    if (!cityEn || !countryEn || !viewpointEn) {
        throw new Error(`Missing romanization for ${seed.city} / ${seed.country} / ${seed.viewpoint}`);
    }

    const continentSlug = slugify(seed.continent);
    const countrySlug = slugify(countryEn);
    const citySlug = slugify(cityEn);
    const slug = `${citySlug}-${slugify(viewpointEn)}`;

    return {
        ...seed,
        cityEn,
        countryEn,
        viewpointEn,
        continentSlug,
        countrySlug,
        citySlug,
        slug,
        mapQuery: `${viewpointEn}, ${cityEn}`,
        originalFilename: `travelog-${slug}-high-resolution.jpg`
    };
}
