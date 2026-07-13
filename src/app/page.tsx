import Link from 'next/link';
import { HeroMosaic } from '@/components/HeroMosaic';
import { ArchiveStats } from '@/components/ArchiveStats';
import { PosterCard } from '@/components/PosterCard';
import { getArchiveStats, getFeaturedPosters } from '@/lib/posters';

// Data is read live from Supabase per request rather than baked in at build
// time, since the catalog changes independently of deploys.
export const dynamic = 'force-dynamic';

export default async function HomePage() {
    const [featured, stats] = await Promise.all([getFeaturedPosters(8), getArchiveStats()]);

    return (
        <>
            <HeroMosaic posters={featured} />
            <ArchiveStats totalPosters={stats.totalPosters} totalViewpoints={stats.totalViewpoints} totalCities={stats.totalCities} />

            {featured.length > 0 && (
                <section className="container-editorial py-20 sm:py-28">
                    <div className="mb-10 flex items-end justify-between">
                        <div>
                            <p className="eyebrow">Recently Archived</p>
                            <h2 className="mt-2 text-3xl text-ink sm:text-4xl">최근 기록된 조망 지점</h2>
                        </div>
                        <Link href="/browse" className="hidden text-sm text-stone underline decoration-line underline-offset-4 transition-colors hover:text-ink sm:inline-block">
                            전체 보기
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
                        {featured.map((poster, i) => (
                            <PosterCard key={poster.id} poster={poster} priority={i < 4} />
                        ))}
                    </div>
                </section>
            )}
        </>
    );
}
