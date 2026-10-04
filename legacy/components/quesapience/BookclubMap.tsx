import React, { useEffect, useRef } from 'react';
import { Bookclub } from '../../types';

interface Props {
  bookclubs: Bookclub[];
  onSelectBookclub?: (bookclub: Bookclub) => void;
  selectedId?: string | null;
  userLatLng?: { lat: number; lng: number } | null;
}

const THEME: Record<string, { bg: string; light: string; label: string }> = {
  almostFull: { bg: '#DC5D3C', light: '#FEE8E2', label: '마감 임박' },
  open:       { bg: '#C2874F', light: '#FEF3E7', label: '모집 중' },
  closed:     { bg: '#9CA3AF', light: '#F3F4F6', label: '마감' },
  ended:      { bg: '#9CA3AF', light: '#F3F4F6', label: '종료' },
  online:     { bg: '#7C6BB0', light: '#F0EDFA', label: '온라인' },
};

function pinHtml(color: string, label: string, selected: boolean) {
  const pulse = selected
    ? `<div style="
        position:absolute;top:50%;left:50%;
        transform:translate(-50%,-50%);
        width:56px;height:56px;border-radius:50%;
        background:${color};opacity:0.25;
        animation:ping 1.2s cubic-bezier(0,0,.2,1) infinite;
      "></div>` : '';

  return `
    <style>
      @keyframes ping{75%,100%{transform:translate(-50%,-50%) scale(2);opacity:0}}
    </style>
    <div style="position:relative;width:44px;height:56px;cursor:pointer;">
      ${pulse}
      <svg width="44" height="56" viewBox="0 0 44 56" fill="none"
           xmlns="http://www.w3.org/2000/svg"
           style="filter:drop-shadow(0 4px 10px rgba(0,0,0,0.28));position:absolute;top:0;left:0;">
        <!-- pin body -->
        <path d="M22,52 C22,52 4,30 4,19 A18,18 0 0 1 40,19 C40,30 22,52 22,52 Z"
              fill="${color}"/>
        <!-- inner highlight -->
        <circle cx="22" cy="19" r="10" fill="white" fill-opacity="0.18"/>
        <!-- ring if selected -->
        ${selected ? `<circle cx="22" cy="19" r="17" stroke="white" stroke-width="2.5" fill="none" stroke-opacity="0.7"/>` : ''}
      </svg>
      <!-- label inside pin -->
      <div style="
        position:absolute;top:8px;left:0;right:0;
        text-align:center;
        font-family:'Apple SD Gothic Neo',system-ui,sans-serif;
        font-size:${label.length > 1 ? '10' : '13'}px;
        font-weight:800;color:white;
        line-height:1;letter-spacing:-0.3px;
      ">${label}</div>
    </div>`;
}

function userPinHtml() {
  return `
    <div style="position:relative;width:22px;height:22px;">
      <div style="
        position:absolute;inset:0;border-radius:50%;
        background:rgba(59,130,246,0.25);
        animation:ripple 1.8s ease-out infinite;
      "></div>
      <div style="
        position:absolute;inset:4px;border-radius:50%;
        background:#3B82F6;border:2.5px solid white;
        box-shadow:0 2px 8px rgba(59,130,246,0.5);
      "></div>
      <style>@keyframes ripple{0%{transform:scale(1);opacity:.6}100%{transform:scale(3);opacity:0}}</style>
    </div>`;
}

function popupHtml(b: Bookclub, theme: typeof THEME[string]) {
  const seatsLeft = b.capacity - b.currentMembers;
  const isOnline = b.locationName.includes('온라인');
  const statusText = isOnline
    ? '온라인 참여'
    : seatsLeft > 0
    ? `${seatsLeft}자리 남음`
    : '마감';

  return `
    <div style="
      width:230px;border-radius:14px;overflow:hidden;
      font-family:'Apple SD Gothic Neo',system-ui,sans-serif;
      box-shadow:0 8px 24px rgba(0,0,0,0.12);
    ">
      <!-- header -->
      <div style="background:${theme.bg};padding:13px 15px 11px;">
        <div style="font-weight:800;font-size:13.5px;color:white;line-height:1.3;margin-bottom:3px;">
          ${b.title}
        </div>
        <div style="font-size:10.5px;color:rgba(255,255,255,0.85);line-height:1.4;">
          📖 ${b.bookTitle}
        </div>
      </div>
      <!-- body -->
      <div style="padding:11px 15px 13px;background:white;">
        <div style="font-size:11px;color:#78716C;margin-bottom:3px;">
          📍 ${b.locationName}
        </div>
        <div style="font-size:11px;color:#78716C;margin-bottom:9px;">
          📅 ${b.date}&nbsp;&nbsp;${b.time}
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <span style="
            background:${theme.light};color:${theme.bg};
            font-size:11px;font-weight:700;
            padding:4px 10px;border-radius:20px;
          ">${statusText}</span>
          <span style="font-size:10px;color:#A8A29E;">${b.leaderName} 리더</span>
        </div>
      </div>
    </div>`;
}

export default function BookclubMap({ bookclubs, onSelectBookclub, selectedId, userLatLng }: Props) {
  const mapRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const userMarkerRef = useRef<any>(null);

  const defaultCenter: [number, number] = [37.494, 127.01];

  // Rebuild a single marker's icon to reflect selection state
  const refreshMarkerIcon = (L: any, b: Bookclub, selected: boolean) => {
    const isOnline = b.locationName.includes('온라인');
    const theme = isOnline ? THEME.online : THEME[b.status] ?? THEME.open;
    const seatsLeft = b.capacity - b.currentMembers;
    const label = isOnline ? '온' : seatsLeft > 0 ? String(seatsLeft) : '✕';

    const icon = L.divIcon({
      className: '',
      html: pinHtml(theme.bg, label, selected),
      iconSize: [44, 56],
      iconAnchor: [22, 56],
      popupAnchor: [0, -58],
    });

    const marker = markersRef.current.get(b.id);
    marker?.setIcon(icon);
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    import('leaflet').then((L) => {
      if (mapRef.current) return;

      delete (L.Icon.Default.prototype as any)._getIconUrl;

      const center: [number, number] = userLatLng
        ? [userLatLng.lat, userLatLng.lng]
        : defaultCenter;

      const map = L.map(containerRef.current!, {
        center,
        zoom: 14,
        zoomControl: false,
        scrollWheelZoom: false,
        attributionControl: false,
      });
      mapRef.current = map;

      // CartoDB Positron — clean, minimal, no API key
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        {
          subdomains: 'abcd',
          maxZoom: 19,
          attribution:
            '© <a href="https://www.openstreetmap.org/copyright">OSM</a> © <a href="https://carto.com/">CARTO</a>',
        }
      ).addTo(map);

      // Custom zoom control (bottom-right, styled)
      L.control.zoom({ position: 'bottomright' }).addTo(map);
      L.control.attribution({ position: 'bottomleft', prefix: false }).addTo(map);

      // User location
      if (userLatLng) {
        const icon = L.divIcon({
          className: '',
          html: userPinHtml(),
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        });
        userMarkerRef.current = L.marker([userLatLng.lat, userLatLng.lng], { icon })
          .addTo(map)
          .bindTooltip('<b>내 위치</b>', { direction: 'top', className: 'qs-tooltip' });
      }

      // Bookclub markers
      bookclubs.forEach((b) => {
        const isOnline = b.locationName.includes('온라인');
        const theme = isOnline ? THEME.online : THEME[b.status] ?? THEME.open;
        const seatsLeft = b.capacity - b.currentMembers;
        const label = isOnline ? '온' : seatsLeft > 0 ? String(seatsLeft) : '✕';
        const isSelected = b.id === selectedId;

        const icon = L.divIcon({
          className: '',
          html: pinHtml(theme.bg, label, isSelected),
          iconSize: [44, 56],
          iconAnchor: [22, 56],
          popupAnchor: [0, -58],
        });

        const marker = L.marker([b.lat, b.lng], { icon })
          .addTo(map)
          .bindPopup(popupHtml(b, theme), {
            maxWidth: 240,
            className: 'qs-popup',
            closeButton: false,
          });

        marker.on('click', () => onSelectBookclub?.(b));
        (marker as any)._bookclubId = b.id;
        markersRef.current.set(b.id, marker);
      });
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current.clear();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refresh all markers when selectedId changes
  useEffect(() => {
    if (!mapRef.current) return;
    import('leaflet').then((L) => {
      bookclubs.forEach((b) => refreshMarkerIcon(L, b, b.id === selectedId));

      if (selectedId) {
        const club = bookclubs.find((c) => c.id === selectedId);
        if (club && !club.locationName.includes('온라인')) {
          mapRef.current.flyTo([club.lat, club.lng], 15, { duration: 0.55 });
          markersRef.current.get(selectedId)?.openPopup();
        }
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  // Re-center + update user pin on location change
  useEffect(() => {
    if (!mapRef.current || !userLatLng) return;
    import('leaflet').then((L) => {
      mapRef.current.flyTo([userLatLng.lat, userLatLng.lng], 14, { duration: 0.8 });
      const icon = L.divIcon({
        className: '',
        html: userPinHtml(),
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });
      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng([userLatLng.lat, userLatLng.lng]).setIcon(icon);
      } else {
        userMarkerRef.current = L.marker([userLatLng.lat, userLatLng.lng], { icon })
          .addTo(mapRef.current)
          .bindTooltip('<b>내 위치</b>', { direction: 'top', className: 'qs-tooltip' });
      }
    });
  }, [userLatLng]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-stone-100" style={{ height: 440 }}>
      {/* Map container */}
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      {/* Top-left badge */}
      <div className="absolute top-3 left-3 z-[1000] flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm border border-stone-100 pointer-events-none">
        <span className="text-[10px] font-bold text-stone-500 tracking-wide uppercase">LIVE MAP</span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      </div>

      {/* Bottom legend bar */}
      <div className="absolute bottom-0 left-0 right-0 z-[1000] bg-white/92 backdrop-blur-sm border-t border-stone-100 px-4 py-2 flex items-center gap-5 pointer-events-none">
        {[
          { color: THEME.open.bg, label: '모집 중' },
          { color: THEME.almostFull.bg, label: '마감 임박' },
          { color: THEME.online.bg, label: '온라인' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <svg width="14" height="18" viewBox="0 0 14 18">
              <path d="M7,16.5 C7,16.5 1,9.5 1,6 A6,6 0 0 1 13,6 C13,9.5 7,16.5 7,16.5 Z" fill={color} />
            </svg>
            <span className="text-[11px] text-stone-500 font-medium">{label}</span>
          </div>
        ))}
        <span className="ml-auto text-[10px] text-stone-300">숫자 = 남은 자리</span>
      </div>

      {/* Global popup / tooltip styles injected once */}
      <style>{`
        .qs-popup .leaflet-popup-content-wrapper {
          padding: 0; border-radius: 14px; overflow: hidden;
          box-shadow: 0 8px 28px rgba(0,0,0,0.14);
          border: none;
        }
        .qs-popup .leaflet-popup-content { margin: 0; }
        .qs-popup .leaflet-popup-tip { display: none; }
        .qs-tooltip {
          background: #1C1917; color: white; border: none;
          border-radius: 6px; font-size: 11px; padding: 4px 8px;
        }
        .qs-tooltip::before { display: none; }
        .leaflet-control-zoom a {
          border-radius: 8px !important;
          border: 1px solid #E7E5E4 !important;
          color: #57534E !important;
          font-weight: 700 !important;
          box-shadow: 0 2px 6px rgba(0,0,0,0.08) !important;
        }
        .leaflet-control-zoom { border: none !important; }
        .leaflet-control-zoom-in { margin-bottom: 3px !important; }
        .leaflet-control-attribution {
          font-size: 9px !important;
          background: rgba(255,255,255,0.7) !important;
          border-radius: 4px !important;
          margin: 0 0 48px 6px !important;
        }
      `}</style>
    </div>
  );
}
