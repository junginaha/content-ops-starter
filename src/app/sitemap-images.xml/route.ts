import { env } from '@/lib/env';
import { browsePosters } from '@/lib/posters';

export const dynamic = 'force-dynamic';

function escapeXml(value: string): string {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export async function GET() {
    const urls: { loc: string; imageLoc: string; title: string }[] = [];

    try {
        let page = 1;
        for (;;) {
            const result = await browsePosters({ page });
            for (const poster of result.posters) {
                const loc = `${env.siteUrl}/${poster.continent_slug}/${poster.country_slug}/${poster.city_slug}/${poster.slug}`;
                const imageLoc = poster.preview_image_url.startsWith('http') ? poster.preview_image_url : `${env.siteUrl}${poster.preview_image_url}`;
                urls.push({ loc, imageLoc, title: `${poster.city} — ${poster.viewpoint}` });
            }
            if (!result.hasMore) break;
            page += 1;
        }
    } catch {
        // Supabase not configured / unreachable — return an empty (still valid) image sitemap.
    }

    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls
    .map(
        (u) => `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <image:image>
      <image:loc>${escapeXml(u.imageLoc)}</image:loc>
      <image:title>${escapeXml(u.title)}</image:title>
    </image:image>
  </url>`
    )
    .join('\n')}
</urlset>`;

    return new Response(body, {
        headers: { 'Content-Type': 'application/xml' }
    });
}
