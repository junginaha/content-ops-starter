-- Travelog schema: posters, orders, purchases
-- Run via `supabase db push` or the Supabase SQL editor.

create extension if not exists "pgcrypto";

create table if not exists posters (
    id uuid primary key default gen_random_uuid(),
    slug text not null unique,
    continent text not null,
    continent_slug text not null,
    country text not null,
    country_slug text not null,
    city text not null,
    city_slug text not null,
    viewpoint text not null,
    description text not null default '',
    latitude double precision not null,
    longitude double precision not null,
    map_query text not null,
    preview_image_url text not null,
    original_storage_path text not null,
    original_filename text not null,
    width integer not null,
    height integer not null,
    researched_viewpoint_count integer not null default 1,
    price_krw integer not null default 990,
    status text not null default 'published' check (status in ('draft', 'published', 'unpublished')),
    sort_order integer not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists posters_continent_slug_idx on posters (continent_slug);
create index if not exists posters_country_slug_idx on posters (continent_slug, country_slug);
create index if not exists posters_city_slug_idx on posters (continent_slug, country_slug, city_slug);
create index if not exists posters_status_idx on posters (status);
create index if not exists posters_sort_order_idx on posters (sort_order);
create index if not exists posters_search_idx on posters using gin (
    to_tsvector('simple', city || ' ' || country || ' ' || continent || ' ' || viewpoint || ' ' || slug)
);

create table if not exists orders (
    id uuid primary key default gen_random_uuid(),
    order_id text not null unique,
    poster_id uuid not null references posters (id) on delete restrict,
    amount integer not null,
    currency text not null default 'KRW',
    status text not null default 'pending' check (status in ('pending', 'confirmed', 'failed', 'cancelled')),
    customer_email text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists orders_order_id_idx on orders (order_id);
create index if not exists orders_poster_id_idx on orders (poster_id);
create index if not exists orders_status_idx on orders (status);

create table if not exists purchases (
    id uuid primary key default gen_random_uuid(),
    order_id text not null references orders (order_id) on delete restrict,
    poster_id uuid not null references posters (id) on delete restrict,
    payment_key text not null unique,
    transaction_id text,
    customer_email text,
    amount integer not null,
    currency text not null default 'KRW',
    payment_status text not null default 'paid' check (payment_status in ('paid', 'refunded', 'cancelled')),
    download_count integer not null default 0,
    download_limit integer not null default 5,
    download_expires_at timestamptz,
    purchased_at timestamptz not null default now(),
    created_at timestamptz not null default now()
);

create unique index if not exists purchases_order_id_idx on purchases (order_id);
create index if not exists purchases_poster_id_idx on purchases (poster_id);
create index if not exists purchases_payment_key_idx on purchases (payment_key);

create or replace function set_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

drop trigger if exists posters_set_updated_at on posters;
create trigger posters_set_updated_at before update on posters
    for each row execute function set_updated_at();

drop trigger if exists orders_set_updated_at on orders;
create trigger orders_set_updated_at before update on orders
    for each row execute function set_updated_at();

-- Row Level Security: public can only read published posters.
-- All writes and all order/purchase access happen through the service-role key on the server.
alter table posters enable row level security;
alter table orders enable row level security;
alter table purchases enable row level security;

drop policy if exists "Public can read published posters" on posters;
create policy "Public can read published posters" on posters
    for select using (status = 'published');

-- No public policies exist for orders/purchases: they are only ever accessed
-- with the service-role key from trusted server code (API routes / server actions).
