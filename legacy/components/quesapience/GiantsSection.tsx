import React from 'react';

const GIANTS = [
  {
    name: '소크라테스',
    quote: '나는 내가 아무것도 모른다는 것을 안다.',
    note: '모든 탐구는 모름에서 시작한다.',
  },
  {
    name: '몽테뉴',
    quote: '독서의 목적은 기억이 아니라, 생각하는 힘을 키우는 데 있다.',
    note: '읽기보다 읽은 것에 대해 이야기하라.',
  },
  {
    name: '한나 아렌트',
    quote: '생각하지 않음이 가장 큰 악이다.',
    note: '무지보다 무사유가 더 위험하다.',
  },
  {
    name: '헤르만 헤세',
    quote: '책 속에 아름다운 세계가 있다. 이 세계를 여행하는 것은 가장 행복한 일이다.',
    note: '독서는 가장 값싼 여행이다.',
  },
];

export default function GiantsSection() {
  return (
    <section id="giants" className="bg-white py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-100 text-stone-500 text-xs font-medium mb-4">
            🏛️ 거인의 어깨
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 mb-4">
            거인의 어깨 위에서
          </h2>
          <p className="text-stone-600 text-lg max-w-2xl mx-auto">
            수천 년의 지적 유산 위에서 우리는 더 멀리 봅니다.
          </p>
        </div>

        {/* Quote grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {GIANTS.map((g) => (
            <div key={g.name} className="bg-stone-50 rounded-2xl border border-stone-100 p-8">
              <blockquote className="font-serif text-lg text-stone-800 leading-relaxed mb-4">
                &ldquo;{g.quote}&rdquo;
              </blockquote>
              <p className="text-amber-700 font-semibold text-sm mb-1">— {g.name}</p>
              <p className="text-stone-400 text-sm italic">{g.note}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <a
            href="#"
            className="inline-flex items-center gap-2 px-6 py-3 border border-stone-300 text-stone-700 hover:bg-stone-50 font-medium rounded-xl transition-colors"
          >
            거인의 어깨 탐색하기
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
