import Link from 'next/link';
import { listAllPosters, getRevenueSummary } from '@/lib/admin-data';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
    const [posters, revenue] = await Promise.all([listAllPosters(), getRevenueSummary()]);
    const published = posters.filter((p) => p.status === 'published').length;

    return (
        <div>
            <h1 className="font-serif text-3xl text-ink">Dashboard</h1>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <StatCard label="Total revenue" value={`₩${revenue.totalRevenue.toLocaleString('ko-KR')}`} />
                <StatCard label="Paid purchases" value={String(revenue.totalPaidPurchases)} />
                <StatCard label="Published posters" value={String(published)} />
                <StatCard label="Total posters" value={String(posters.length)} />
            </div>

            <div className="mt-10 flex gap-4">
                <Link href="/admin/posters/new" className="btn-charcoal w-auto px-6">
                    + New Poster
                </Link>
                <Link href="/admin/posters" className="btn-browse">
                    Manage Posters
                </Link>
            </div>

            <div className="mt-12">
                <h2 className="font-serif text-2xl text-ink">Sales by poster</h2>
                <table className="mt-4 w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-line text-xs uppercase tracking-widest2 text-stone">
                            <th className="py-2">City</th>
                            <th className="py-2">Viewpoint</th>
                            <th className="py-2">Sales</th>
                            <th className="py-2">Revenue</th>
                        </tr>
                    </thead>
                    <tbody>
                        {revenue.byPoster.map((row) => (
                            <tr key={row.posterId} className="border-b border-line/60">
                                <td className="py-2">{row.city}</td>
                                <td className="py-2 text-stone">{row.viewpoint}</td>
                                <td className="py-2">{row.count}</td>
                                <td className="py-2">₩{row.revenue.toLocaleString('ko-KR')}</td>
                            </tr>
                        ))}
                        {revenue.byPoster.length === 0 && (
                            <tr>
                                <td colSpan={4} className="py-6 text-center text-stone">
                                    아직 판매 데이터가 없습니다.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function StatCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-sm border border-line bg-beige p-5">
            <p className="text-xs uppercase tracking-widest2 text-stone">{label}</p>
            <p className="mt-2 font-serif text-2xl text-ink">{value}</p>
        </div>
    );
}
