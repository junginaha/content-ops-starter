import { notFound } from 'next/navigation';
import { getAdminPoster } from '@/lib/admin-data';
import { PosterForm } from '@/app/admin/(protected)/posters/PosterForm';

export const dynamic = 'force-dynamic';

export default async function EditPosterPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const poster = await getAdminPoster(id);
    if (!poster) notFound();

    return (
        <div>
            <h1 className="font-serif text-3xl text-ink">
                Edit — {poster.city} · {poster.viewpoint}
            </h1>
            <PosterForm poster={poster} />
        </div>
    );
}
