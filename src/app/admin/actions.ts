'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdminUser } from '@/lib/admin-auth';
import { upsertPoster, deletePoster, setPosterStatus } from '@/lib/admin-data';
import { uploadPreviewImage, uploadOriginalImage } from '@/lib/storage';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { slugify } from '@/types/database';
import type { PosterStatus } from '@/types/database';

function str(formData: FormData, key: string) {
    return String(formData.get(key) ?? '').trim();
}
function num(formData: FormData, key: string) {
    return Number(formData.get(key) ?? 0);
}

export async function savePosterAction(id: string | null, formData: FormData) {
    await requireAdminUser();

    const slug = str(formData, 'slug') || `${slugify(str(formData, 'city'))}-${slugify(str(formData, 'viewpoint'))}`;

    let previewImageUrl = str(formData, 'existingPreviewUrl');
    const previewFile = formData.get('previewFile') as File | null;
    if (previewFile && previewFile.size > 0) {
        previewImageUrl = await uploadPreviewImage(slug, previewFile);
    }

    let originalStoragePath = str(formData, 'existingOriginalPath');
    let originalFilename = str(formData, 'existingOriginalFilename');
    const originalFile = formData.get('originalFile') as File | null;
    if (originalFile && originalFile.size > 0) {
        const uploaded = await uploadOriginalImage(slug, originalFile);
        originalStoragePath = uploaded.storagePath;
        originalFilename = uploaded.filename;
    }

    if (!previewImageUrl || !originalStoragePath) {
        throw new Error('미리보기 이미지와 원본 이미지를 모두 업로드해야 합니다.');
    }

    const poster = await upsertPoster(id, {
        slug,
        continent: str(formData, 'continent'),
        country: str(formData, 'country'),
        city: str(formData, 'city'),
        viewpoint: str(formData, 'viewpoint'),
        description: str(formData, 'description'),
        latitude: num(formData, 'latitude'),
        longitude: num(formData, 'longitude'),
        mapQuery: str(formData, 'mapQuery') || `${str(formData, 'viewpoint')}, ${str(formData, 'city')}`,
        previewImageUrl,
        originalStoragePath,
        originalFilename,
        width: num(formData, 'width') || 4000,
        height: num(formData, 'height') || 5600,
        researchedViewpointCount: num(formData, 'researchedViewpointCount') || 1,
        priceKrw: num(formData, 'priceKrw') || 990,
        status: str(formData, 'status') as PosterStatus,
        sortOrder: num(formData, 'sortOrder')
    });

    revalidatePath('/admin/posters');
    revalidatePath('/browse');
    redirect(`/admin/posters/${poster.id}`);
}

export async function deletePosterAction(id: string) {
    await requireAdminUser();
    await deletePoster(id);
    revalidatePath('/admin/posters');
    revalidatePath('/browse');
}

export async function setStatusAction(id: string, status: PosterStatus) {
    await requireAdminUser();
    await setPosterStatus(id, status);
    revalidatePath('/admin/posters');
    revalidatePath('/browse');
}

export async function signOutAction() {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
    redirect('/admin/login');
}
