import React from 'react';

interface Props {
  href?: string;
  size?: number;
}

export default function WaxSealButton({ href = '#featured-bookclubs', size = 164 }: Props) {
  return (
    <a href={href} className="group inline-block" style={{ lineHeight: 0 }} aria-label="북클럽 둘러보기">
      <svg
        width={size}
        height={size}
        viewBox="0 0 164 164"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          display: 'block',
          filter: 'drop-shadow(0 8px 24px rgba(10,20,80,0.45)) drop-shadow(0 2px 6px rgba(0,0,0,0.22))',
          transition: 'transform 0.22s cubic-bezier(.34,1.56,.64,1)',
          transformOrigin: 'center',
        }}
        className="group-hover:scale-[1.08] group-active:scale-[0.94]"
      >
        <defs>
          {/* Outer rim — deep navy, light hits upper-left */}
          <radialGradient id="waxRim" cx="38%" cy="32%" r="65%" gradientUnits="objectBoundingBox">
            <stop offset="0%"   stopColor="#2A4BA0" />
            <stop offset="55%"  stopColor="#162B6E" />
            <stop offset="100%" stopColor="#0A1540" />
          </radialGradient>

          {/* Face — royal blue, brighter center */}
          <radialGradient id="waxFace" cx="40%" cy="35%" r="68%" gradientUnits="objectBoundingBox">
            <stop offset="0%"   stopColor="#2E55B8" />
            <stop offset="45%"  stopColor="#1B3A8A" />
            <stop offset="100%" stopColor="#0E1E52" />
          </radialGradient>

          {/* Subtle sheen */}
          <radialGradient id="waxSheen" cx="34%" cy="28%" r="52%" gradientUnits="objectBoundingBox">
            <stop offset="0%"   stopColor="white" stopOpacity="0.13" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ── Outer wax rim ── */}
        <circle cx="82" cy="82" r="80" fill="url(#waxRim)" />

        {/* ── Wax face ── */}
        <circle cx="82" cy="81" r="66" fill="url(#waxFace)" />

        {/* ── Sheen overlay ── */}
        <circle cx="82" cy="81" r="66" fill="url(#waxSheen)" />

        {/* ── Outer groove ring ── */}
        <circle cx="82" cy="81" r="70"
          fill="none" stroke="#0A1540" strokeWidth="1.8" strokeOpacity="0.5" />

        {/* ── Inner groove ring ── */}
        <circle cx="82" cy="81" r="56"
          fill="none" stroke="#D4B850" strokeWidth="0.7" strokeOpacity="0.35" />

        {/* ── "북클럽" — main text ── */}
        <text
          x="82" y="75"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#E8C860"
          fontSize="24"
          fontFamily="'Apple SD Gothic Neo','Noto Serif KR','Malgun Gothic',serif"
          fontWeight="700"
          letterSpacing="5"
        >
          북클럽
        </text>

        {/* ── Gold divider ── */}
        <line x1="50" y1="90" x2="114" y2="90" stroke="#D4B850" strokeWidth="0.8" strokeOpacity="0.65" />
        <circle cx="50"  cy="90" r="1.8" fill="#D4B850" opacity="0.55" />
        <circle cx="114" cy="90" r="1.8" fill="#D4B850" opacity="0.55" />

        {/* ── "둘러보기" — sub text ── */}
        <text
          x="82" y="107"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#D4B850"
          fontSize="14"
          fontFamily="'Apple SD Gothic Neo','Noto Serif KR','Malgun Gothic',serif"
          fontWeight="500"
          letterSpacing="3.5"
        >
          둘러보기
        </text>

        {/* ── Tiny dots top/bottom for seal feel ── */}
        <circle cx="82" cy="18"  r="2"   fill="#D4B850" opacity="0.45" />
        <circle cx="72" cy="20"  r="1.4" fill="#D4B850" opacity="0.3"  />
        <circle cx="92" cy="20"  r="1.4" fill="#D4B850" opacity="0.3"  />
        <circle cx="82" cy="146" r="2"   fill="#D4B850" opacity="0.45" />
        <circle cx="72" cy="144" r="1.4" fill="#D4B850" opacity="0.3"  />
        <circle cx="92" cy="144" r="1.4" fill="#D4B850" opacity="0.3"  />
      </svg>
    </a>
  );
}
