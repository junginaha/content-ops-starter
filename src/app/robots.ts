import type { MetadataRoute } from 'next';
import { env } from '@/lib/env';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin', '/admin/', '/api/', '/purchase/success', '/purchase/fail', '/auth/']
        },
        sitemap: [`${env.siteUrl}/sitemap.xml`, `${env.siteUrl}/sitemap-images.xml`]
    };
}
