'use client';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <html lang="ko">
            <body style={{ background: '#F6F1E7', color: '#171512', fontFamily: 'Georgia, serif' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '8rem 1.5rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '1.5rem' }}>문제가 발생했습니다</p>
                    <p style={{ maxWidth: '24rem', color: '#6E675D', fontFamily: 'sans-serif', fontSize: '0.875rem' }}>서비스를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.</p>
                    <button
                        type="button"
                        onClick={reset}
                        style={{ borderRadius: '9999px', border: '1px solid rgba(23,21,18,0.7)', padding: '0.625rem 1.5rem', fontFamily: 'sans-serif', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em', background: 'transparent', cursor: 'pointer' }}
                    >
                        다시 시도
                    </button>
                </div>
            </body>
        </html>
    );
}
