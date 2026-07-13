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

        // Rasterize the vector art ONCE at a moderate size. The watercolor
        // blur filters make librsvg rasterization cost blow up non-linearly
        // with density, so we deliberately avoid re-rasterizing the same SVG
        // a second time at 4000px — instead the "original" is an upscale of
        // this base raster, which is fast and, for illustration-style art,
        // visually indistinguishable from re-rendering the vector directly.
        const baseRaster = await sharp(svgBuffer, { density: 96 * (1400 / 1000) })
            .resize({ width: 1400 })
            .png()
            .toBuffer();

        // Public preview: ~900px wide, compressed webp.
        await sharp(baseRaster)
            .resize({ width: 900 })
            .webp({ quality: 78 })
            .toFile(path.join(posterDir, 'preview.webp'));

        // Protected "original": large long edge, high quality jpg.
        // Kept out of public/ — only the seed script (with service-role
        // access) uploads this into the private Supabase Storage bucket.
        const originalDir = path.join(SEED_ASSETS_DIR, record.slug);
        await mkdir(originalDir, { recursive: true });
        await sharp(baseRaster)
            .resize({ width: 4000, kernel: 'lanczos3' })
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
