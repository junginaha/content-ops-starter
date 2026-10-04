function required(name: string, value: string | undefined): string {
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

export const env = {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    get supabaseServiceRoleKey() {
        return required('SUPABASE_SERVICE_ROLE_KEY', process.env.SUPABASE_SERVICE_ROLE_KEY);
    },
    tossClientKey: process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY ?? '',
    get tossSecretKey() {
        return required('TOSS_SECRET_KEY', process.env.TOSS_SECRET_KEY);
    },
    privateStorageBucket: process.env.PRIVATE_STORAGE_BUCKET ?? 'poster-originals',
    adminEmails: (process.env.ADMIN_EMAIL ?? '')
        .split(',')
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean)
};
