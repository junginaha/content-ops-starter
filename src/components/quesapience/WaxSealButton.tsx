import React from 'react';

interface Props {
  href?: string;
}

export default function WaxSealButton({ href = '#featured-bookclubs' }: Props) {
  return (
    <a
      href={href}
      aria-label="북클럽 둘러보기"
      className="group inline-block select-none"
      style={{ lineHeight: 0 }}
    >
      {/* ── 외부 왁스 림: 두꺼운 볼록한 테두리 ── */}
      <div
        style={{
          width: 192,
          height: 192,
          borderRadius: '50%',
          background:
            'radial-gradient(circle at 36% 30%, #2B4FAD 0%, #14297A 48%, #08143E 100%)',
          boxShadow: [
            '0 12px 36px rgba(8,20,80,0.55)',       // 외부 드롭 섀도
            '0 4px 10px rgba(0,0,0,0.3)',
            'inset 0 8px 18px rgba(255,255,255,0.13)', // 상단 하이라이트 (볼록)
            'inset 0 -10px 22px rgba(0,0,0,0.55)',    // 하단 그림자 (볼록)
            'inset 4px 0 10px rgba(0,0,0,0.2)',
            'inset -4px 0 10px rgba(0,0,0,0.15)',
          ].join(', '),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.22s cubic-bezier(.34,1.56,.64,1)',
        }}
        className="group-hover:scale-[1.08] group-active:scale-[0.93]"
      >
        {/* ── 내부 페이스: 약간 오목한 중심 ── */}
        <div
          style={{
            width: 156,
            height: 156,
            borderRadius: '50%',
            background:
              'radial-gradient(circle at 42% 38%, #2D5CC4 0%, #1B3D96 40%, #0D1F5C 100%)',
            boxShadow: [
              'inset 0 4px 12px rgba(255,255,255,0.1)',
              'inset 0 -6px 14px rgba(0,0,0,0.45)',
              '0 0 0 1.5px rgba(8,16,56,0.7)',       // 테두리 선
            ].join(', '),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0,
            position: 'relative',
          }}
        >
          {/* 내부 미세 링 */}
          <div
            style={{
              position: 'absolute',
              inset: 10,
              borderRadius: '50%',
              border: '0.8px solid rgba(212,184,80,0.28)',
              pointerEvents: 'none',
            }}
          />

          {/* 북클럽 */}
          <span
            style={{
              color: '#EDD170',
              fontSize: 26,
              fontWeight: 800,
              fontFamily: "'Apple SD Gothic Neo','Noto Serif KR','Malgun Gothic',sans-serif",
              letterSpacing: '0.18em',
              textShadow: '0 2px 6px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.4)',
              lineHeight: 1,
              marginBottom: 10,
            }}
          >
            북클럽
          </span>

          {/* 골드 구분선 */}
          <div
            style={{
              width: 72,
              height: 1,
              background:
                'linear-gradient(to right, transparent, #D4B850 30%, #D4B850 70%, transparent)',
              marginBottom: 10,
              opacity: 0.75,
            }}
          />

          {/* 둘러보기 */}
          <span
            style={{
              color: '#D4B850',
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "'Apple SD Gothic Neo','Noto Serif KR','Malgun Gothic',sans-serif",
              letterSpacing: '0.22em',
              textShadow: '0 1px 4px rgba(0,0,0,0.5)',
              lineHeight: 1,
            }}
          >
            둘러보기
          </span>
        </div>
      </div>
    </a>
  );
}
