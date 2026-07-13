import 'server-only';
import { randomBytes } from 'node:crypto';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import type { Order, Poster } from '@/types/database';

export function generateOrderId(): string {
    return `TL${Date.now().toString(36).toUpperCase()}${randomBytes(6).toString('hex').toUpperCase()}`;
}

/**
 * Creates a pending order priced strictly from the poster's server-side
 * price_krw — the client never supplies or influences the amount.
 */
export async function createOrder(poster: Poster): Promise<Order> {
    const supabase = createSupabaseAdminClient();
    const orderId = generateOrderId();

    const { data, error } = await supabase
        .from('orders')
        .insert({
            order_id: orderId,
            poster_id: poster.id,
            amount: poster.price_krw,
            currency: 'KRW',
            status: 'pending'
        })
        .select('*')
        .single();

    if (error || !data) throw new Error(`Failed to create order: ${error?.message}`);
    return data;
}

export async function getOrderByOrderId(orderId: string): Promise<Order | null> {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.from('orders').select('*').eq('order_id', orderId).maybeSingle();
    if (error) throw new Error(error.message);
    return data;
}

export async function markOrderStatus(orderId: string, status: Order['status']): Promise<void> {
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.from('orders').update({ status }).eq('order_id', orderId);
    if (error) throw new Error(error.message);
}
