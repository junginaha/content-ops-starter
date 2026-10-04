import React, { useState } from 'react';
import { Bookclub } from '../../types';

interface Props {
  bookclubs: Bookclub[];
  onSelectBookclub?: (bookclub: Bookclub) => void;
  selectedId?: string | null;
}

// Mock pixel positions within 400×270 SVG viewBox (roughly Seocho/Gangnam area)
const PIN_POSITIONS: Record<string, { x: number; y: number }> = {
  '1': { x: 242, y: 162 }, // 서초 서쪽
  '2': { x: 292, y: 133 }, // 강남
  '3': { x: 55, y: 88 },  // 온라인 A
  '4': { x: 222, y: 183 }, // 서초 남쪽
  '5': { x: 308, y: 152 }, // 강남역 인근
  '6': { x: 80, y: 108 },  // 온라인 B
};

export default function BookclubMapMock({ bookclubs, onSelectBookclub, selectedId }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const offlineClubs = bookclubs.filter((b) => !b.locationName.includes('온라인'));
  const onlineClubs = bookclubs.filter((b) => b.locationName.includes('온라인'));

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-stone-200 shadow-sm bg-[#EDE8DF]">
      <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-sm pointer-events-none">
        <p className="text-xs text-stone-500 font-medium">서울 서초·강남 중심</p>
      </div>

      <svg
        viewBox="0 0 400 270"
        className="w-full h-full"
        style={{ minHeight: 220 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="400" height="270" fill="#EDE8DF" />

        {/* Han River */}
        <path
          d="M -10,52 Q 100,38 200,46 Q 300,54 410,48"
          fill="none"
          stroke="#B8CDD9"
          strokeWidth="18"
          strokeLinecap="round"
          opacity="0.65"
        />
        <text x="190" y="46" textAnchor="middle" fill="#8BA8BB" fontSize="7.5" fontFamily="sans-serif">
          한 강
        </text>

        {/* Park areas */}
        <ellipse cx="188" cy="202" rx="26" ry="16" fill="#C4D9A8" opacity="0.45" />
        <ellipse cx="348" cy="218" rx="18" ry="12" fill="#C4D9A8" opacity="0.38" />

        {/* Major roads */}
        <line x1="272" y1="58" x2="272" y2="270" stroke="#D4CEC4" strokeWidth="2.5" />
        <line x1="148" y1="133" x2="400" y2="128" stroke="#D4CEC4" strokeWidth="2.5" />
        <line x1="118" y1="163" x2="400" y2="158" stroke="#D4CEC4" strokeWidth="2" />
        <line x1="0" y1="197" x2="400" y2="193" stroke="#D4CEC4" strokeWidth="2" />
        <line x1="178" y1="78" x2="268" y2="197" stroke="#D4CEC4" strokeWidth="1.5" />
        <line x1="198" y1="78" x2="198" y2="270" stroke="#DDD8D0" strokeWidth="1.2" />
        <line x1="318" y1="78" x2="318" y2="270" stroke="#DDD8D0" strokeWidth="1.2" />
        <line x1="148" y1="80" x2="400" y2="98" stroke="#DDD8D0" strokeWidth="1" />

        {/* District labels */}
        <text x="237" y="176" fill="#B8B3A8" fontSize="9.5" fontFamily="sans-serif" fontWeight="600">서초구</text>
        <text x="290" y="118" fill="#B8B3A8" fontSize="9.5" fontFamily="sans-serif" fontWeight="600">강남구</text>

        {/* Online zone */}
        <rect x="28" y="72" width="82" height="56" rx="8" fill="#E8E4F0" opacity="0.55" stroke="#C4B8E8" strokeWidth="1" strokeDasharray="4,3" />
        <text x="69" y="97" textAnchor="middle" fill="#8B7EC8" fontSize="8.5" fontFamily="sans-serif" fontWeight="600">온라인 모임</text>
        <text x="69" y="110" textAnchor="middle" fill="#9D93D4" fontSize="7.5" fontFamily="sans-serif">전국 어디서나</text>

        {/* Offline pins */}
        {offlineClubs.map((b) => {
          const pos = PIN_POSITIONS[b.id];
          if (!pos) return null;
          const isHovered = hoveredId === b.id;
          const isSelected = selectedId === b.id;
          const seatsLeft = b.capacity - b.currentMembers;
          const pinColor = b.status === 'almostFull' ? '#DC5D3C' : '#C2874F';

          return (
            <g
              key={b.id}
              transform={`translate(${pos.x},${pos.y})`}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredId(b.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onSelectBookclub?.(b)}
            >
              {/* Shadow */}
              <ellipse cx="0" cy="17" rx="5" ry="2.5" fill="black" opacity="0.08" />
              {/* Ring for selected */}
              {isSelected && (
                <circle cx="0" cy="0" r="16" fill="none" stroke="#FBBF24" strokeWidth="2.5" opacity="0.8" />
              )}
              <circle
                cx="0"
                cy="0"
                r={isHovered || isSelected ? 13 : 10}
                fill={pinColor}
                stroke="white"
                strokeWidth="2"
                style={{ transition: 'r 0.12s ease' }}
              />
              <text x="0" y="1" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="8" fontFamily="sans-serif" fontWeight="700">
                {seatsLeft > 0 ? seatsLeft : '✗'}
              </text>

              {/* Hover tooltip */}
              {isHovered && (
                <g transform="translate(-58,-66)">
                  <rect x="0" y="0" width="116" height="54" rx="8" fill="white" stroke="#E8E3DC" strokeWidth="1" style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.12))' }} />
                  <text x="9" y="17" fill="#1C1917" fontSize="8.5" fontFamily="sans-serif" fontWeight="700">
                    {b.title.length > 15 ? b.title.slice(0, 15) + '…' : b.title}
                  </text>
                  <text x="9" y="31" fill="#78716C" fontSize="7.5" fontFamily="sans-serif">
                    📍 {b.locationName.length > 17 ? b.locationName.slice(0, 17) + '…' : b.locationName}
                  </text>
                  <text x="9" y="45" fill="#78716C" fontSize="7.5" fontFamily="sans-serif">
                    📅 {b.date} · {seatsLeft > 0 ? `${seatsLeft}자리 남음` : '마감'}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Online pins */}
        {onlineClubs.map((b, i) => {
          const x = 43 + i * 28;
          const y = 86 + i * 14;
          const isHovered = hoveredId === b.id;

          return (
            <g
              key={b.id}
              transform={`translate(${x},${y})`}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredId(b.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onSelectBookclub?.(b)}
            >
              <circle
                cx="0"
                cy="0"
                r={isHovered ? 10 : 8}
                fill="#7C6BB0"
                stroke="white"
                strokeWidth="2"
                style={{ transition: 'r 0.12s ease' }}
              />
              <text x="0" y="1" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="7.5" fontFamily="sans-serif" fontWeight="700">온</text>
            </g>
          );
        })}

        {/* Legend */}
        <g transform="translate(10,242)">
          <circle cx="6" cy="6" r="5" fill="#C2874F" />
          <text x="14" y="10" fill="#78716C" fontSize="7.5" fontFamily="sans-serif">오프라인</text>
          <circle cx="72" cy="6" r="5" fill="#DC5D3C" />
          <text x="80" y="10" fill="#78716C" fontSize="7.5" fontFamily="sans-serif">마감 임박</text>
          <circle cx="140" cy="6" r="5" fill="#7C6BB0" />
          <text x="148" y="10" fill="#78716C" fontSize="7.5" fontFamily="sans-serif">온라인</text>
          <text x="210" y="10" fill="#B8B3A8" fontSize="7" fontFamily="sans-serif">숫자 = 남은 자리</text>
        </g>
      </svg>
    </div>
  );
}
