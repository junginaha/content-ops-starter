import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import BookclubCard from './BookclubCard';
import { nearbyBookclubs } from '../../data/bookclubs';
import { Bookclub } from '../../types';

// Leaflet cannot run on the server — import only on client
const BookclubMap = dynamic(() => import('./BookclubMap'), { ssr: false });

type LocationStatus = 'idle' | 'loading' | 'success' | 'error';

export default function NearbyBookclubsSection() {
  const [selectedBookclub, setSelectedBookclub] = useState<Bookclub | null>(null);
  const [locationStatus, setLocationStatus] = useState<LocationStatus>('idle');
  const [userLatLng, setUserLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const cardListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setLocationStatus('error');
      return;
    }
    setLocationStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLatLng({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationStatus('success');
      },
      () => setLocationStatus('error'),
      { timeout: 8000 }
    );
  }, []);

  const locationLabel: Record<LocationStatus, string> = {
    idle: '📍 서초 · 강남 중심',
    loading: '📍 위치 확인 중...',
    success: '📍 현재 위치 기반',
    error: '📍 서초 · 강남 중심 (기본값)',
  };

  const handleSelectBookclub = (b: Bookclub) => {
    setSelectedBookclub((prev) => (prev?.id === b.id ? null : b));
    // Scroll card into view on mobile
    if (cardListRef.current) {
      const card = cardListRef.current.querySelector(`[data-id="${b.id}"]`);
      card?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  return (
    <section id="nearby-bookclubs" className="bg-stone-50 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-stone-200 text-stone-500 text-xs font-medium mb-4">
            {locationLabel[locationStatus]}
            {locationStatus === 'loading' && (
              <span className="inline-block w-3 h-3 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
            )}
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 mb-3">
            내 주변 북클럽 찾기
          </h2>
          <p className="text-stone-600 text-lg max-w-2xl">
            지도에서 핀을 클릭하면 북클럽 정보를 바로 확인할 수 있어요.
          </p>
        </div>

        {/* Map + card list */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Real map */}
          <div className="lg:col-span-3">
            <BookclubMap
              bookclubs={nearbyBookclubs}
              onSelectBookclub={handleSelectBookclub}
              selectedId={selectedBookclub?.id ?? null}
              userLatLng={userLatLng}
            />
            <p className="mt-2 text-xs text-stone-400 text-center">
              © OpenStreetMap contributors · 핀 숫자 = 남은 자리 수
            </p>
          </div>

          {/* Card list */}
          <div
            ref={cardListRef}
            className="lg:col-span-2 space-y-4 lg:max-h-[440px] lg:overflow-y-auto lg:pr-1"
          >
            {nearbyBookclubs.map((b) => (
              <div
                key={b.id}
                data-id={b.id}
                className={`transition-all rounded-2xl cursor-pointer ${
                  selectedBookclub?.id === b.id
                    ? 'ring-2 ring-amber-400 ring-offset-2'
                    : 'hover:ring-1 hover:ring-stone-300 hover:ring-offset-1'
                }`}
                onClick={() => handleSelectBookclub(b)}
              >
                <BookclubCard bookclub={b} showDistance />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
