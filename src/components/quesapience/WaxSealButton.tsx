import React from 'react';

interface Props {
  href?: string;
  size?: number;
}

export default function WaxSealButton({ href = '#featured-bookclubs', size = 164 }: Props) {
  // SVG viewBox is 164×164, center at (82,82)
  const cx = 82;
  const cy = 82;

  return (
    <a href={href} className="group inline-block" style={{ lineHeight: 0 }} aria-label="북클럽 둘러보기">
      <svg
        width={size}
        height={size}
        viewBox="0 0 164 164"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          display: 'block',
          filter:
            'drop-shadow(0 8px 22px rgba(58,22,4,0.42)) drop-shadow(0 3px 6px rgba(0,0,0,0.18))',
          transition: 'transform 0.22s cubic-bezier(.34,1.56,.64,1)',
          transformOrigin: 'center',
        }}
        className="group-hover:scale-[1.08] group-active:scale-[0.94]"
      >
        <defs>
          {/* ── Wax body: warm amber, upper-left light source ── */}
          <radialGradient id="waxBody" cx="38%" cy="32%" r="65%" gradientUnits="objectBoundingBox">
            <stop offset="0%"   stopColor="#C8864A" />
            <stop offset="42%"  stopColor="#934E22" />
            <stop offset="100%" stopColor="#4F1E06" />
          </radialGradient>

          {/* ── Wax face (lighter inner disc) ── */}
          <radialGradient id="waxFace" cx="40%" cy="34%" r="68%" gradientUnits="objectBoundingBox">
            <stop offset="0%"   stopColor="#D99050" />
            <stop offset="38%"  stopColor="#9E5828" />
            <stop offset="100%" stopColor="#5C2A0C" />
          </radialGradient>

          {/* ── Surface sheen (soft highlight) ── */}
          <radialGradient id="waxSheen" cx="36%" cy="28%" r="55%" gradientUnits="objectBoundingBox">
            <stop offset="0%"   stopColor="white" stopOpacity="0.14" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>

          {/* ── Text path: bottom arc, left→right through bottom ── */}
          {/* radius 50, center (82,82): from (32,82) to (132,82) clockwise through bottom */}
          <path id="bottomArc" d="M 32,82 A 50,50 0 0,1 132,82" />
        </defs>

        {/* ── 1. Outer wax rim ── */}
        <circle cx={cx} cy={cy} r="80" fill="url(#waxBody)" />

        {/* ── 2. Face disc (inset 3D effect) ── */}
        <circle cx={cx} cy={cy - 1} r="66" fill="url(#waxFace)" />

        {/* ── 3. Inner ring groove ── */}
        <circle cx={cx} cy={cy - 1} r="56"
          fill="none"
          stroke="#3A1406"
          strokeWidth="1.4"
          strokeOpacity="0.45"
        />

        {/* ── 4. Surface sheen ── */}
        <circle cx={cx} cy={cy - 1} r="66" fill="url(#waxSheen)" />

        {/* ── 5. Botanical emboss ── */}
        <g transform={`translate(${cx},${cy - 8})`} opacity="0.92">
          {/* Primary stem */}
          <path d="M-22,20 C-10,6 8,-8 22,-22"
            stroke="#E2C070" strokeWidth="2" fill="none" strokeLinecap="round"/>
          {/* Secondary branch */}
          <path d="M-24,8 C-16,-2 -4,-14 6,-22"
            stroke="#E2C070" strokeWidth="1.4" fill="none" strokeLinecap="round"/>

          {/* Leaves — each is a rotated ellipse */}
          <ellipse cx="-4"  cy="10"  rx="11" ry="4.5" fill="#E2C070" transform="rotate(-52,-4,10)"/>
          <ellipse cx="12"  cy="-4"  rx="11" ry="4.5" fill="#E2C070" transform="rotate(-50,12,-4)"/>
          <ellipse cx="-18" cy="16"  rx="8.5" ry="3.5" fill="#E2C070" transform="rotate(-38,-18,16)"/>
          <ellipse cx="20"  cy="-14" rx="8.5" ry="3.5" fill="#E2C070" transform="rotate(-50,20,-14)"/>
          <ellipse cx="26"  cy="-4"  rx="7.5" ry="3"   fill="#E2C070" transform="rotate(-18,26,-4)"/>
          <ellipse cx="-10" cy="22"  rx="7.5" ry="3"   fill="#E2C070" transform="rotate(-62,-10,22)"/>

          {/* Berry clusters — left */}
          <line x1="-26" y1="14" x2="-28" y2="10" stroke="#E2C070" strokeWidth="1.1"/>
          <line x1="-26" y1="14" x2="-30" y2="17" stroke="#E2C070" strokeWidth="1.1"/>
          <line x1="-26" y1="14" x2="-22" y2="19" stroke="#E2C070" strokeWidth="1.1"/>
          <circle cx="-28" cy="10"  r="3"   fill="#E2C070"/>
          <circle cx="-30" cy="17"  r="2.3" fill="#E2C070"/>
          <circle cx="-22" cy="19"  r="2.3" fill="#E2C070"/>

          {/* Berry clusters — right */}
          <line x1="26" y1="-22" x2="26" y2="-26" stroke="#E2C070" strokeWidth="1.1"/>
          <line x1="26" y1="-22" x2="30" y2="-18" stroke="#E2C070" strokeWidth="1.1"/>
          <line x1="26" y1="-22" x2="22" y2="-28" stroke="#E2C070" strokeWidth="1.1"/>
          <circle cx="26"  cy="-26" r="3"   fill="#E2C070"/>
          <circle cx="30"  cy="-18" r="2.3" fill="#E2C070"/>
          <circle cx="22"  cy="-28" r="2.3" fill="#E2C070"/>
        </g>

        {/* ── 6. Curved text at bottom ── */}
        <text
          fill="#E2C070"
          fontSize="11.5"
          fontFamily="'Apple SD Gothic Neo','Noto Serif KR','Malgun Gothic',serif"
          letterSpacing="2.5"
          fontWeight="600"
        >
          <textPath href="#bottomArc" startOffset="50%" textAnchor="middle">
            · 북클럽 둘러보기 ·
          </textPath>
        </text>

        {/* ── 7. Tiny decorative dots at top ── */}
        <circle cx={cx}      cy="18" r="2.2" fill="#E2C070" opacity="0.55"/>
        <circle cx={cx - 10} cy="20" r="1.5" fill="#E2C070" opacity="0.35"/>
        <circle cx={cx + 10} cy="20" r="1.5" fill="#E2C070" opacity="0.35"/>
      </svg>
    </a>
  );
}
