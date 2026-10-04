import { listPurchases } from '@/lib/admin-data';

export const dynamic = 'force-dynamic';

export default async function AdminPurchasesPage() {
    const purchases = await listPurchases();

    return (
        <div>
            <h1 className="font-serif text-3xl text-ink">Purchases ({purchases.length})</h1>

            <table className="mt-8 w-full text-left text-sm">
                <thead>
                    <tr className="border-b border-line text-xs uppercase tracking-widest2 text-stone">
                        <th className="py-2">Order</th>
                        <th className="py-2">Poster</th>
                        <th className="py-2">Amount</th>
                        <th className="py-2">Status</th>
                        <th className="py-2">Downloads</th>
                        <th className="py-2">Purchased</th>
                    </tr>
                </thead>
                <tbody>
                    {purchases.map((p) => (
                        <tr key={p.id} className="border-b border-line/60">
                            <td className="py-3 font-mono text-xs">{p.order_id}</td>
                            <td className="py-3">
                                {p.posters?.city ?? '—'}
                                <p className="text-xs text-stone">{p.posters?.viewpoint}</p>
                            </td>
                            <td className="py-3">₩{p.amount.toLocaleString('ko-KR')}</td>
                            <td className="py-3">
                                <span className={`rounded-full px-2.5 py-0.5 text-xs ${p.payment_status === 'paid' ? 'bg-ink text-ivory' : 'bg-line text-stone'}`}>{p.payment_status}</span>
                            </td>
                            <td className="py-3">
                                {p.download_count} / {p.download_limit}
                            </td>
                            <td className="py-3 text-stone">{new Date(p.purchased_at).toLocaleString('ko-KR')}</td>
                        </tr>
                    ))}
                    {purchases.length === 0 && (
                        <tr>
                            <td colSpan={6} className="py-6 text-center text-stone">
                                아직 구매 내역이 없습니다.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
