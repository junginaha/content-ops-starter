export type PosterStatus = 'draft' | 'published' | 'unpublished';
export type OrderStatus = 'pending' | 'confirmed' | 'failed' | 'cancelled';
export type PaymentStatus = 'paid' | 'refunded' | 'cancelled';

export interface Poster {
    id: string;
    slug: string;
    continent: string;
    continent_slug: string;
    country: string;
    country_slug: string;
    city: string;
    city_slug: string;
    viewpoint: string;
    description: string;
    latitude: number;
    longitude: number;
    map_query: string;
    preview_image_url: string;
    original_storage_path: string;
    original_filename: string;
    width: number;
    height: number;
    researched_viewpoint_count: number;
    price_krw: number;
    status: PosterStatus;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

export interface Order {
    id: string;
    order_id: string;
    poster_id: string;
    amount: number;
    currency: string;
    status: OrderStatus;
    customer_email: string | null;
    created_at: string;
    updated_at: string;
}

export interface Purchase {
    id: string;
    order_id: string;
    poster_id: string;
    payment_key: string;
    transaction_id: string | null;
    customer_email: string | null;
    amount: number;
    currency: string;
    payment_status: PaymentStatus;
    download_count: number;
    download_limit: number;
    download_expires_at: string | null;
    purchased_at: string;
    created_at: string;
}

// Note: we deliberately do NOT parameterize the Supabase client with a
// generated `Database` schema type. The installed @supabase/supabase-js
// (postgrest-js's newer generic `GenericSchema`/`ClientServerOptions`
// machinery) expects the exact shape produced by `supabase gen types
// typescript`, and a hand-written approximation reliably collapses query
// results to `never`. Instead, every data-access function in `src/lib`
// declares its own return type (Poster, Order, Purchase, ...) against an
// untyped client, which is simpler to keep correct by hand and just as safe
// at the boundary since those functions are the only place queries are built.

export const CONTINENTS = ['Europe', 'Asia', 'Oceania', 'North America', 'South America', 'Africa'] as const;
export type Continent = (typeof CONTINENTS)[number];

export function slugify(value: string): string {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}
