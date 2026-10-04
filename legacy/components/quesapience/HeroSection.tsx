import React from 'react';
import WaxSealButton from './WaxSealButton';

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-stone-50 to-white overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-48 -right-48 w-96 h-96 bg-amber-50 rounded-full opacity-50 blur-3xl" />
        <div className="absolute top-1/2 -left-24 w-72 h-72 bg-stone-100 rounded-full opacity-40 blur-2xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-28 sm:pb-24 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" aria-hidden="true" />
          서초구 선정 미래혁신형 북클럽
        </div>

        {/* Headline */}
        <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-stone-900 leading-tight mb-6">
          좋은 질문은
          <br />
          <span className="text-amber-700">좋은 사람을</span> 데려옵니다
        </h1>

        {/* Subtitle */}
        <p className="text-xl sm:text-2xl text-stone-600 mb-5 leading-relaxed">
          내 근처에서 열리는 북클럽에 참여해보세요
        </p>

        {/* Body */}
        <p className="text-stone-500 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          책을 다 읽지 못해도 괜찮습니다.
          <br />
          한 문장, 하나의 질문이면 충분합니다.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <a
            href="#nearby-bookclubs"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-700 hover:bg-amber-800 text-white font-semibold rounded-xl text-lg transition-colors shadow-lg shadow-amber-700/20"
          >
            가까운 북클럽 보기
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <a
            href="#featured-bookclubs"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border-2 border-stone-800 text-stone-800 hover:bg-stone-50 font-semibold rounded-xl text-lg transition-colors"
          >
            이번 달 모임 참여하기
          </a>
        </div>

        {/* Wax seal CTA */}
        <div className="flex justify-center mb-10">
          <WaxSealButton href="#featured-bookclubs" />
        </div>

        {/* Trust signals */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 text-stone-500 text-sm">
          {[
            { icon: '👋', label: '첫 참여 환영' },
            { icon: '📖', label: '책을 다 못 읽어도 가능' },
            { icon: '💬', label: '깊은 대화, 안전한 분위기' },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="text-lg" aria-hidden="true">{icon}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
