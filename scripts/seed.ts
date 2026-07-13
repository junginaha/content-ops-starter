import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';
import { POSTERS } from './data/posters';
import { buildPosterRecord } from './lib/build-poster-record';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = process.env.PRIVATE_STORAGE_BUCKET ?? 'poster-originals';

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running the seed script.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false }
});

async function ensureBucket() {
    const { data: buckets } = await supabase.storage.listBuckets();
    if (!buckets?.some((b) => b.name === BUCKET)) {
        const { error } = await supabase.storage.createBucket(BUCKET, { public: false });
        if (error) throw error;
        console.log(`Created private storage bucket "${BUCKET}"`);
    }
}

async function main() {
    await ensureBucket();

    let index = 0;
    for (const seed of POSTERS) {
        index += 1;
        const record = buildPosterRecord(seed);
        const originalPath = path.join(process.cwd(), 'seed-assets', record.slug, 'original.jpg');
        const originalBuffer = await readFile(originalPath).catch(() => {
            throw new Error(`Missing ${originalPath} — run "npm run seed:generate-art" first.`);
        });

        const storagePath = `${record.slug}/original.jpg`;
        const { error: uploadError } = await supabase.storage.from(BUCKET).upload(storagePath, originalBuffer, {
            contentType: 'image/jpeg',
            upsert: true
        });
        if (uploadError) throw uploadError;

        const { error: upsertError } = await supabase
            .from('posters')
            .upsert(
                {
                    slug: record.slug,
                    continent: record.continent,
                    continent_slug: record.continentSlug,
                    country: record.country,
                    country_slug: record.countrySlug,
                    city: record.city,
                    city_slug: record.citySlug,
                    viewpoint: record.viewpoint,
                    description: record.description,
                    latitude: record.latitude,
                    longitude: record.longitude,
                    map_query: record.mapQuery,
                    // Relative path (same-origin, ships in public/) so next/image
                    // doesn't need this host allowlisted in images.remotePatterns.
                    preview_image_url: `/posters/${record.slug}/preview.webp`,
                    original_storage_path: storagePath,
                    original_filename: record.originalFilename,
                    width: 4000,
                    height: 5600,
                    researched_viewpoint_count: record.researchedViewpointCount,
                    price_krw: 990,
                    status: 'published',
                    sort_order: index
                },
                { onConflict: 'slug' }
            );
        if (upsertError) throw upsertError;

        console.log(`Seeded ${record.slug}`);
    }

    console.log(`\nSeeded ${POSTERS.length} posters.`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
