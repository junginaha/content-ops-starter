import { ImageResponse } from 'next/og';
import { getPosterBySlugPath } from '@/lib/posters';
import { env } from '@/lib/env';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

interface Props {
    params: Promise<{ continent: string; country: string; city: string; posterSlug: string }>;
}

export default async function OgImage({ params }: Props) {
    const { continent, country, city, posterSlug } = await params;
    const poster = await getPosterBySlugPath(continent, country, city, posterSlug);

    const imageUrl = poster ? (poster.preview_image_url.startsWith('http') ? poster.preview_image_url : `${env.siteUrl}${poster.preview_image_url}`) : null;

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    background: '#F6F1E7',
                    fontFamily: 'Georgia, serif'
                }}
            >
                {imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imageUrl} alt="" width={472} height={630} style={{ objectFit: 'cover', height: '100%', width: 472 }} />
                )}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '64px', flex: 1 }}>
                    <div style={{ fontSize: 22, letterSpacing: 6, color: '#9A7C43', textTransform: 'uppercase' }}>Travelog</div>
                    <div style={{ fontSize: 64, color: '#171512', marginTop: 16 }}>{poster?.city ?? 'Travelog'}</div>
                    <div style={{ fontSize: 28, color: '#6E675D', marginTop: 12 }}>{poster?.viewpoint ?? ''}</div>
                </div>
            </div>
        ),
        { ...size }
    );
}
