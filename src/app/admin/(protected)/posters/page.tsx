import Link from 'next/link';
import { listAllPosters } from '@/lib/admin-data';
import { StatusButtons, DeleteButton } from '@/app/admin/(protected)/posters/PosterRowActions';

export const dynamic = 'force-dynamic';

export default async function AdminPostersPage() {
    const posters = await listAllPosters();

    return (
        <div>
            <div className="flex items-center justify-between">
                <h1 className="font-serif text-3xl text-ink">Posters ({posters.length})</h1>
                <Link href="/admin/posters/new" className="btn-charcoal w-auto px-6">
                    + New Poster
                </Link>
            </div>

            <table className="mt-8 w-full text-left text-sm">
                <thead>
                    <tr className="border-b border-line text-xs uppercase tracking-widest2 text-stone">
                        <th className="py-2">City</th>
                        <th className="py-2">Viewpoint</th>
                        <th className="py-2">Status</th>
                        <th className="py-2">Price</th>
                        <th className="py-2" />
                    </tr>
                </thead>
                <tbody>
                    {posters.map((poster) => (
                        <tr key={poster.id} className="border-b border-line/60">
                            <td className="py-3">
                                <Link href={`/admin/posters/${poster.id}`} className="font-serif text-base text-ink hover:underline">
                                    {poster.city}
                                </Link>
                                <p className="text-xs text-stone">{poster.country}</p>
                            </td>
                            <td className="py-3 text-stone">{poster.viewpoint}</td>
                            <td className="py-3">
                                <span className={`rounded-full px-2.5 py-0.5 text-xs ${poster.status === 'published' ? 'bg-ink text-ivory' : 'bg-line text-stone'}`}>{poster.status}</span>
                            </td>
                            <td className="py-3">₩{poster.price_krw.toLocaleString('ko-KR')}</td>
                            <td className="py-3 text-right">
                                <StatusButtons id={poster.id} status={poster.status} />
                                <DeleteButton id={poster.id} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
