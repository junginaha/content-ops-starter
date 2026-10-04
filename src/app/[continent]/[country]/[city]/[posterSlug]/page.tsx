import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { PurchaseSection } from '@/components/PurchaseSection';
import { RelatedPosters } from '@/components/RelatedPosters';
import { getPosterBySlugPath, getRelatedPosters } from '@/lib/posters';
import { env } from '@/lib/env';

export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{ continent: string; country: string; city: string; posterSlug: string }>;
}

async function loadPoster(params: Awaited<Props['params']>) {
    return getPosterBySlugPath(params.continent, params.country, params.city, params.posterSlug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolved = await params;
    const poster = await loadPoster(resolved);
    if (!poster) return {};

    const title = `${poster.city} – ${poster.viewpoint} 여행 포스터`;
    const description = `${poster.city} ${poster.viewpoint}의 실제 조망 지점을 바탕으로 제작한 펜화·수채화 여행 포스터입니다. 고해상도 디지털 이미지를 ${poster.price_krw}원에 소장하세요.`;
    const canonicalPath = `/${poster.continent_slug}/${poster.country_slug}/${poster.city_slug}/${poster.slug}`;

    return {
        title,
        description,
        alternates: { canonical: canonicalPath },
        openGraph: {
            title: `${title} | Travelog`,
            description,
            url: canonicalPath,
            type: 'website'
        },
        twitter: {
            card: 'summary_large_image',
            title: `${title} | Travelog`,
            description
        }
    };
}

export default async function PosterDetailPage({ params }: Props) {
    const resolved = await params;
    const poster = await loadPoster(resolved);
    if (!poster) notFound();

    const related = await getRelatedPosters(poster);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${poster.latitude},${poster.longitude}`)}`;
    const canonicalPath = `/${poster.continent_slug}/${poster.country_slug}/${poster.city_slug}/${poster.slug}`;
    const canonicalUrl = `${env.siteUrl}${canonicalPath}`;
    const absoluteImageUrl = poster.preview_image_url.startsWith('http') ? poster.preview_image_url : `${env.siteUrl}${poster.preview_image_url}`;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: env.siteUrl },
                    { '@type': 'ListItem', position: 2, name: poster.continent, item: `${env.siteUrl}/${poster.continent_slug}` },
                    { '@type': 'ListItem', position: 3, name: poster.country, item: `${env.siteUrl}/${poster.continent_slug}/${poster.country_slug}` },
                    { '@type': 'ListItem', position: 4, name: poster.city, item: `${env.siteUrl}/${poster.continent_slug}/${poster.country_slug}/${poster.city_slug}` },
                    { '@type': 'ListItem', position: 5, name: poster.viewpoint, item: canonicalUrl }
                ]
            },
            {
                '@type': 'ImageObject',
                contentUrl: absoluteImageUrl,
                url: absoluteImageUrl,
                width: poster.width,
                height: poster.height,
                name: `${poster.city} — ${poster.viewpoint}`,
                description: poster.description
            },
            {
                '@type': 'Product',
                name: `${poster.city} – ${poster.viewpoint} 여행 포스터`,
                description: poster.description,
                image: absoluteImageUrl,
                sku: poster.slug,
                offers: {
                    '@type': 'Offer',
                    url: canonicalUrl,
                    price: poster.price_krw,
                    priceCurrency: 'KRW',
                    availability: 'https://schema.org/InStock'
                }
            }
        ]
    };

    return (
        <div>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            <div className="container-editorial py-12 sm:py-16">
                <Breadcrumbs
                    items={[
                        { label: 'Home', href: '/' },
                        { label: poster.continent, href: `/${poster.continent_slug}` },
                        { label: poster.country, href: `/${poster.continent_slug}/${poster.country_slug}` },
                        { label: poster.city, href: `/${poster.continent_slug}/${poster.country_slug}/${poster.city_slug}` },
                        { label: poster.viewpoint }
                    ]}
                />

                <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
                    <div className="relative aspect-[5/7] w-full overflow-hidden rounded-sm border border-line bg-beige shadow-soft lg:sticky lg:top-24 lg:self-start">
                        <Image src={poster.preview_image_url} alt={`${poster.city}, ${poster.country} — ${poster.viewpoint}`} fill sizes="(min-width: 1024px) 50vw, 100vw" priority className="object-cover" />
                    </div>

                    <div>
                        <p className="eyebrow">
                            {poster.continent} · {poster.country}
                        </p>
                        <h1 className="mt-2 text-4xl text-ink sm:text-5xl">{poster.city}</h1>
                        <p className="mt-1 text-lg text-stone">{poster.viewpoint}</p>

                        <p className="mt-6 text-sm leading-relaxed text-ink">{poster.description}</p>

                        <dl className="mt-6 grid grid-cols-2 gap-y-3 border-y border-line py-6 text-sm">
                            <dt className="text-stone">Country</dt>
                            <dd className="text-ink">{poster.country}</dd>
                            <dt className="text-stone">City</dt>
                            <dd className="text-ink">{poster.city}</dd>
                            <dt className="text-stone">Viewpoint</dt>
                            <dd className="text-ink">{poster.viewpoint}</dd>
                            <dt className="text-stone">Researched viewpoints</dt>
                            <dd className="text-ink">{poster.researched_viewpoint_count}곳</dd>
                        </dl>

                        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-line underline-offset-4 transition-colors hover:text-ink">
                                Google 지도에서 보기
                            </a>
                            <Link href={`/${poster.continent_slug}/${poster.country_slug}/${poster.city_slug}`} className="underline decoration-line underline-offset-4 transition-colors hover:text-ink">
                                Browse the series
                            </Link>
                        </div>

                        <div className="mt-10">
                            <PurchaseSection posterId={poster.id} priceKrw={poster.price_krw} />
                        </div>
                    </div>
                </div>
            </div>

            <RelatedPosters sameCity={related.sameCity} sameCountry={related.sameCountry} sameContinent={related.sameContinent} cityName={poster.city} countryName={poster.country} continentName={poster.continent} />
        </div>
    );
}
