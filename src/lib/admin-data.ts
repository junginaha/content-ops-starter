import 'server-only';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { slugify } from '@/types/database';
import type { Poster, PosterStatus, Purchase } from '@/types/database';

export async function listAllPosters(): Promise<Poster[]> {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.from('posters').select('*').order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
}

export async function getAdminPoster(id: string): Promise<Poster | null> {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.from('posters').select('*').eq('id', id).maybeSingle();
    if (error) throw new Error(error.message);
    return data;
}

export interface PosterFormInput {
    slug?: string;
    continent: string;
    country: string;
    city: string;
    viewpoint: string;
    description: string;
    latitude: number;
    longitude: number;
    mapQuery: string;
    previewImageUrl: string;
    originalStoragePath: string;
    originalFilename: string;
    width: number;
    height: number;
    researchedViewpointCount: number;
    priceKrw: number;
    status: PosterStatus;
    sortOrder: number;
}

export async function upsertPoster(id: string | null, input: PosterFormInput): Promise<Poster> {
    const supabase = createSupabaseAdminClient();
    const slug = input.slug?.trim() || `${slugify(input.city)}-${slugify(input.viewpoint)}`;

    const row = {
        slug,
        continent: input.continent,
        continent_slug: slugify(input.continent),
        country: input.country,
        country_slug: slugify(input.country),
        city: input.city,
        city_slug: slugify(input.city),
        viewpoint: input.viewpoint,
        description: input.description,
        latitude: input.latitude,
        longitude: input.longitude,
        map_query: input.mapQuery,
        preview_image_url: input.previewImageUrl,
        original_storage_path: input.originalStoragePath,
        original_filename: input.originalFilename,
        width: input.width,
        height: input.height,
        researched_viewpoint_count: input.researchedViewpointCount,
        price_krw: input.priceKrw,
        status: input.status,
        sort_order: input.sortOrder
    };

    const query = id ? supabase.from('posters').update(row).eq('id', id) : supabase.from('posters').insert(row);

    const { data, error } = await query.select('*').single();
    if (error || !data) throw new Error(`Failed to save poster: ${error?.message}`);
    return data;
}

export async function deletePoster(id: string): Promise<void> {
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.from('posters').delete().eq('id', id);
    if (error) throw new Error(error.message);
}

export async function setPosterStatus(id: string, status: PosterStatus): Promise<void> {
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.from('posters').update({ status }).eq('id', id);
    if (error) throw new Error(error.message);
}

export interface PurchaseWithPoster extends Purchase {
    posters: Pick<Poster, 'city' | 'viewpoint' | 'country' | 'slug'> | null;
}

export async function listPurchases(): Promise<PurchaseWithPoster[]> {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.from('purchases').select('*, posters(city, viewpoint, country, slug)').order('purchased_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data as unknown as PurchaseWithPoster[]) ?? [];
}

export interface RevenueSummary {
    totalRevenue: number;
    totalPaidPurchases: number;
    byPoster: { posterId: string; city: string; viewpoint: string; revenue: number; count: number }[];
}

export async function getRevenueSummary(): Promise<RevenueSummary> {
    const purchases = await listPurchases();
    const paid = purchases.filter((p) => p.payment_status === 'paid');

    const byPosterMap = new Map<string, { posterId: string; city: string; viewpoint: string; revenue: number; count: number }>();
    for (const p of paid) {
        const key = p.poster_id;
        if (!byPosterMap.has(key)) {
            byPosterMap.set(key, { posterId: key, city: p.posters?.city ?? '—', viewpoint: p.posters?.viewpoint ?? '—', revenue: 0, count: 0 });
        }
        const entry = byPosterMap.get(key)!;
        entry.revenue += p.amount;
        entry.count += 1;
    }

    return {
        totalRevenue: paid.reduce((sum, p) => sum + p.amount, 0),
        totalPaidPurchases: paid.length,
        byPoster: Array.from(byPosterMap.values()).sort((a, b) => b.revenue - a.revenue)
    };
}
