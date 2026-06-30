import React, { useEffect, useRef } from 'react';
import { Bookclub } from '../../types';

interface Props {
  bookclubs: Bookclub[];
  onSelectBookclub?: (bookclub: Bookclub) => void;
  selectedId?: string | null;
  userLatLng?: { lat: number; lng: number } | null;
}

const STATUS_COLOR: Record<string, string> = {
  almostFull: '#DC5D3C',
  open: '#C2874F',
  closed: '#9CA3AF',
  ended: '#9CA3AF',
};

export default function BookclubMap({ bookclubs, onSelectBookclub, selectedId, userLatLng }: Props) {
  const mapRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<any[]>([]);
  const userMarkerRef = useRef<any>(null);

  // Seocho / Gangnam center as fallback
  const defaultCenter: [number, number] = [37.494, 127.01];

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    // Dynamic import so SSR doesn't break
    import('leaflet').then((L) => {
      if (mapRef.current) return; // already initialised

      // Fix default marker icon paths broken by webpack
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const center: [number, number] = userLatLng
        ? [userLatLng.lat, userLatLng.lng]
        : defaultCenter;

      const map = L.map(containerRef.current!, {
        center,
        zoom: 14,
        zoomControl: true,
        scrollWheelZoom: false,
      });
      mapRef.current = map;

      // OpenStreetMap tiles — no API key needed
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // User location marker
      if (userLatLng) {
        const userIcon = L.divIcon({
          className: '',
          html: `<div style="
            width:16px;height:16px;border-radius:50%;
            background:#3B82F6;border:3px solid white;
            box-shadow:0 0 0 4px rgba(59,130,246,0.3);
          "></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });
        userMarkerRef.current = L.marker([userLatLng.lat, userLatLng.lng], { icon: userIcon })
          .addTo(map)
          .bindTooltip('내 위치', { permanent: false, direction: 'top' });
      }

      // Bookclub markers
      bookclubs.forEach((b) => {
        const isOnline = b.locationName.includes('온라인');
        const color = isOnline ? '#7C6BB0' : STATUS_COLOR[b.status] ?? '#C2874F';
        const seatsLeft = b.capacity - b.currentMembers;

        const icon = L.divIcon({
          className: '',
          html: `<div style="
            position:relative;
            width:36px;height:36px;
            display:flex;align-items:center;justify-content:center;
          ">
            <div style="
              width:34px;height:34px;border-radius:50%;
              background:${color};border:2.5px solid white;
              box-shadow:0 2px 8px rgba(0,0,0,0.22);
              display:flex;align-items:center;justify-content:center;
              font-size:11px;font-weight:700;color:white;font-family:sans-serif;
              cursor:pointer;
            ">${isOnline ? '온' : seatsLeft > 0 ? seatsLeft : '✗'}</div>
          </div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });

        const popupHtml = `
          <div style="min-width:180px;font-family:sans-serif;">
            <div style="font-weight:700;font-size:13px;margin-bottom:4px;color:#1C1917;">${b.title}</div>
            <div style="font-size:11px;color:#78716C;margin-bottom:2px;">📖 ${b.bookTitle}</div>
            <div style="font-size:11px;color:#78716C;margin-bottom:2px;">📍 ${b.locationName}</div>
            <div style="font-size:11px;color:#78716C;margin-bottom:6px;">📅 ${b.date} · ${b.time}</div>
            <div style="font-size:11px;color:${color};font-weight:600;">
              ${isOnline ? '온라인 참여' : seatsLeft > 0 ? `${seatsLeft}자리 남음` : '마감'}
            </div>
          </div>`;

        const marker = L.marker([b.lat, b.lng], { icon })
          .addTo(map)
          .bindPopup(popupHtml, { maxWidth: 240 });

        marker.on('click', () => {
          onSelectBookclub?.(b);
        });

        (marker as any)._bookclubId = b.id;
        markersRef.current.push(marker);
      });
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current = [];
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pan to selected bookclub
  useEffect(() => {
    if (!mapRef.current || !selectedId) return;
    const club = bookclubs.find((b) => b.id === selectedId);
    if (!club || club.locationName.includes('온라인')) return;

    import('leaflet').then((L) => {
      mapRef.current.flyTo([club.lat, club.lng], 15, { duration: 0.6 });
      const marker = markersRef.current.find((m) => m._bookclubId === selectedId);
      if (marker) {
        marker.openPopup();
      }
    });
  }, [selectedId, bookclubs]);

  // Re-center when user location arrives
  useEffect(() => {
    if (!mapRef.current || !userLatLng) return;
    import('leaflet').then((L) => {
      mapRef.current.flyTo([userLatLng.lat, userLatLng.lng], 14, { duration: 0.8 });
      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng([userLatLng.lat, userLatLng.lng]);
      } else {
        const userIcon = L.divIcon({
          className: '',
          html: `<div style="
            width:16px;height:16px;border-radius:50%;
            background:#3B82F6;border:3px solid white;
            box-shadow:0 0 0 4px rgba(59,130,246,0.3);
          "></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });
        userMarkerRef.current = L.marker([userLatLng.lat, userLatLng.lng], { icon: userIcon })
          .addTo(mapRef.current)
          .bindTooltip('내 위치', { permanent: false, direction: 'top' });
      }
    });
  }, [userLatLng]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-stone-200 shadow-sm" style={{ height: 420 }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
