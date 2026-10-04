'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deletePosterAction, setStatusAction } from '@/app/admin/actions';
import type { PosterStatus } from '@/types/database';

export function StatusButtons({ id, status }: { id: string; status: PosterStatus }) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    function toggle() {
        const next: PosterStatus = status === 'published' ? 'unpublished' : 'published';
        startTransition(async () => {
            await setStatusAction(id, next);
            router.refresh();
        });
    }

    return (
        <button type="button" disabled={isPending} onClick={toggle} className="mr-3 text-xs text-stone underline decoration-line underline-offset-4 hover:text-ink">
            {status === 'published' ? 'Unpublish' : 'Publish'}
        </button>
    );
}

export function DeleteButton({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    function handleDelete() {
        if (!window.confirm('이 포스터를 삭제하시겠습니까? 되돌릴 수 없습니다.')) return;
        startTransition(async () => {
            await deletePosterAction(id);
            router.refresh();
        });
    }

    return (
        <button type="button" disabled={isPending} onClick={handleDelete} className="text-xs text-red-800 underline decoration-line underline-offset-4">
            Delete
        </button>
    );
}
