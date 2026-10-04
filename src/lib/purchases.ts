import 'server-only';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import type { Purchase } from '@/types/database';

const DOWNLOAD_LIMIT = 5;
const DOWNLOAD_WINDOW_MS = 10 * 60 * 1000;

export async function getPurchaseByPaymentKey(paymentKey: string): Promise<Purchase | null> {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.from('purchases').select('*').eq('payment_key', paymentKey).maybeSingle();
    if (error) throw new Error(error.message);
    return data;
}

export async function getPurchaseByOrderId(orderId: string): Promise<Purchase | null> {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.from('purchases').select('*').eq('order_id', orderId).maybeSingle();
    if (error) throw new Error(error.message);
    return data;
}

export interface CreatePurchaseInput {
    orderId: string;
    posterId: string;
    paymentKey: string;
    transactionId: string | null;
    amount: number;
    customerEmail?: string | null;
}

/**
 * Idempotent purchase creation keyed on the unique payment_key / order_id
 * columns — a duplicate confirm() call for the same payment returns the
 * existing row instead of creating a second grant.
 */
export async function createPurchaseIdempotent(input: CreatePurchaseInput): Promise<Purchase> {
    const existing = await getPurchaseByOrderId(input.orderId);
    if (existing) return existing;

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
        .from('purchases')
        .insert({
            order_id: input.orderId,
            poster_id: input.posterId,
            payment_key: input.paymentKey,
            transaction_id: input.transactionId,
            customer_email: input.customerEmail ?? null,
            amount: input.amount,
            currency: 'KRW',
            payment_status: 'paid',
            download_count: 0,
            download_limit: DOWNLOAD_LIMIT
        })
        .select('*')
        .single();

    if (error) {
        // Unique-constraint race: another request already inserted this order/payment.
        const raceExisting = await getPurchaseByOrderId(input.orderId);
        if (raceExisting) return raceExisting;
        throw new Error(`Failed to record purchase: ${error.message}`);
    }
    return data;
}

export async function registerDownload(purchase: Purchase): Promise<Purchase> {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
        .from('purchases')
        .update({
            download_count: purchase.download_count + 1,
            download_expires_at: new Date(Date.now() + DOWNLOAD_WINDOW_MS).toISOString()
        })
        .eq('id', purchase.id)
        .eq('download_count', purchase.download_count) // optimistic concurrency guard
        .select('*')
        .single();

    if (error || !data) throw new Error('Failed to register download (concurrent download in progress, try again).');
    return data;
}

export { DOWNLOAD_LIMIT, DOWNLOAD_WINDOW_MS };
