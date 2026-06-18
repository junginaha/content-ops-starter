import React, { useEffect, useState } from 'react';
import BookclubCard from './BookclubCard';
import BookclubMapMock from './BookclubMapMock';
import { nearbyBookclubs } from '../../data/bookclubs';
import { Bookclub } from '../../types';

type LocationStatus = 'idle' | 'loading' | 'success' | 'error';

export default function NearbyBookclubsSection() {
  const [selectedBookclub, setSelectedBookclub] = useState<Bookclub | null>(null);
  const [locationStatus, setLocationStatus] = useState<LocationStatus>('idle');

  useEffect(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setLocationStatus('error');
      return;
    }
    setLocationStatus('loading');
    navigator.geolocation.getCurrentPosition(
      () => setLocationStatus('success'),
      () => setLocationStatus('error'),
      { timeout: 5000 }
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
  };

  return (
    <section id="nearby-bookclubs" className="bg-stone-50 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-stone-200 text-stone-500 text-xs font-medium mb-4">
            {locationLabel[locationStatus]}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 mb-3">
                내 주변 북클럽 찾기
              </h2>
              <p className="text-stone-600 text-lg max-w-2xl">
                가까운 곳에서 열리는 북클럽을 확인하고 바로 참여해보세요.
              </p>
            </div>
            <a
              href="#nearby-bookclubs"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-700 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors text-base shrink-0 shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              내 근처 북클럽 찾아가기
            </a>
          </div>
        </div>

        {/* Map + card list */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Mock map */}
          <div className="lg:col-span-3">
            <BookclubMapMock
              bookclubs={nearbyBookclubs}
              onSelectBookclub={handleSelectBookclub}
              selectedId={selectedBookclub?.id ?? null}
            />
            <p className="mt-2 text-xs text-stone-400 text-center">
              향후 카카오맵 / 네이버맵 API로 교체 예정 —{' '}
              <code className="font-mono bg-stone-100 px-1 rounded">BookclubMapMock</code> 컴포넌트 분리됨
            </p>
          </div>

          {/* Card list */}
          <div className="lg:col-span-2 space-y-4 lg:max-h-[540px] lg:overflow-y-auto lg:pr-1">
            {nearbyBookclubs.map((b) => (
              <div
                key={b.id}
                className={`transition-all rounded-2xl ${
                  selectedBookclub?.id === b.id ? 'ring-2 ring-amber-400 ring-offset-2' : ''
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
