'use client';

import { useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setStatus('sending');
        const supabase = createSupabaseBrowserClient();
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/admin` }
        });
        setStatus(error ? 'error' : 'sent');
    }

    return (
        <div className="container-editorial flex min-h-[70vh] flex-col items-center justify-center py-20">
            <div className="w-full max-w-sm">
                <p className="eyebrow text-center">Travelog Admin</p>
                <h1 className="mt-2 text-center text-3xl text-ink">관리자 로그인</h1>
                <p className="mt-3 text-center text-sm text-stone">허용된 관리자 이메일로 매직 링크를 보내드립니다. 공개 회원가입은 지원하지 않습니다.</p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                    <label htmlFor="admin-email" className="sr-only">
                        이메일
                    </label>
                    <input
                        id="admin-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@example.com"
                        className="w-full rounded-full border border-line bg-transparent px-4 py-2.5 text-sm text-ink focus:border-ink"
                    />
                    <button type="submit" disabled={status === 'sending'} className="btn-charcoal">
                        {status === 'sending' ? '전송 중…' : '로그인 링크 받기'}
                    </button>
                </form>

                {status === 'sent' && <p className="mt-4 text-center text-sm text-stone">이메일로 전송된 링크를 확인해 주세요.</p>}
                {status === 'error' && <p className="mt-4 text-center text-sm text-red-800">로그인에 실패했습니다. 다시 시도해 주세요.</p>}
            </div>
        </div>
    );
}
