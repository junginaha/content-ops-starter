import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { POSTERS } from './data/posters';
import { buildPosterRecord } from './lib/build-poster-record';
import { buildPosterSVG } from './lib/svg-poster';

const PUBLIC_DIR = path.join(process.cwd(), 'public', 'posters');
const SEED_ASSETS_DIR = path.join(process.cwd(), 'seed-assets');

async function main() {
    await mkdir(PUBLIC_DIR, { recursive: true });
    await mkdir(SEED_ASSETS_DIR, { recursive: true });

    for (const seed of POSTERS) {
        const record = buildPosterRecord(seed);
        const svg = buildPosterSVG(record);
        const svgBuffer = Buffer.from(svg);

        const posterDir = path.join(PUBLIC_DIR, record.slug);
        await mkdir(posterDir, { recursive: true });

        // Public preview: ~900px wide, compressed webp. Density is tuned so
        // librsvg rasterizes close to the target size directly (cheap) rather
        // than rendering oversized and downscaling.
        await sharp(svgBuffer, { density: 96 * (900 / 1000) })
            .resize({ width: 900 })
            .webp({ quality: 78 })
            .toFile(path.join(posterDir, 'preview.webp'));

        // Protected "original": large long edge, high quality jpg.
        // Kept out of public/ — only the seed script (with service-role
        // access) uploads this into the private Supabase Storage bucket.
        const originalDir = path.join(SEED_ASSETS_DIR, record.slug);
        await mkdir(originalDir, { recursive: true });
        await sharp(svgBuffer, { density: 96 * (4000 / 1000) })
            .resize({ width: 4000 })
            .jpeg({ quality: 92 })
            .toFile(path.join(originalDir, 'original.jpg'));

        console.log(`Generated art for ${record.slug}`);
    }

    console.log(`\nDone. ${POSTERS.length} posters rendered to public/posters/*/preview.webp and seed-assets/*/original.jpg`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
