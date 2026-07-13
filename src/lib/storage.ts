import 'server-only';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { env } from '@/lib/env';

export const PREVIEW_BUCKET = 'poster-previews';

async function ensureBucket(name: string, isPublic: boolean) {
    const supabase = createSupabaseAdminClient();
    const { data: buckets } = await supabase.storage.listBuckets();
    if (!buckets?.some((b) => b.name === name)) {
        await supabase.storage.createBucket(name, { public: isPublic });
    }
}

export async function uploadPreviewImage(slug: string, file: File): Promise<string> {
    await ensureBucket(PREVIEW_BUCKET, true);
    const supabase = createSupabaseAdminClient();
    const ext = file.name.split('.').pop() || 'webp';
    const path = `${slug}/preview.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error } = await supabase.storage.from(PREVIEW_BUCKET).upload(path, buffer, { contentType: file.type || 'image/webp', upsert: true });
    if (error) throw new Error(`Preview upload failed: ${error.message}`);

    const { data } = supabase.storage.from(PREVIEW_BUCKET).getPublicUrl(path);
    return data.publicUrl;
}

export async function uploadOriginalImage(slug: string, file: File): Promise<{ storagePath: string; filename: string }> {
    await ensureBucket(env.privateStorageBucket, false);
    const supabase = createSupabaseAdminClient();
    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `travelog-${slug}-high-resolution.${ext}`;
    const path = `${slug}/original.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error } = await supabase.storage.from(env.privateStorageBucket).upload(path, buffer, { contentType: file.type || 'image/jpeg', upsert: true });
    if (error) throw new Error(`Original upload failed: ${error.message}`);

    return { storagePath: path, filename };
}
