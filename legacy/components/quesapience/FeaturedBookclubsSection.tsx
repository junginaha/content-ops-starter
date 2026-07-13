import React from 'react';
import BookclubCard from './BookclubCard';
import { featuredBookclubs } from '../../data/bookclubs';

export default function FeaturedBookclubsSection() {
  return (
    <section id="featured-bookclubs" className="bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium mb-4">
              🎯 이번 달 추천
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 mb-3">
              이번 달 바로 참여 가능한 북클럽
            </h2>
            <p className="text-stone-600 text-lg max-w-2xl">
              지금 신청할 수 있는 모임만 선별해 보여드립니다.
              선택 피로 없이 큐레이션된 리스트예요.
            </p>
          </div>
          <a
            href="#"
            className="shrink-0 text-sm text-amber-700 hover:text-amber-900 font-medium underline-offset-4 hover:underline whitespace-nowrap"
          >
            전체 북클럽 보기 →
          </a>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
          {featuredBookclubs.map((b) => (
            <BookclubCard key={b.id} bookclub={b} showRecommendedFor />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <a
            href="#nearby-bookclubs"
            className="inline-flex items-center gap-2 px-8 py-4 bg-amber-700 hover:bg-amber-800 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-amber-700/20"
          >
            모든 북클럽 신청하기
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
