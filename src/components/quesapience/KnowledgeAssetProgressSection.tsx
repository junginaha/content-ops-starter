import React from 'react';

const journeySteps = [
  {
    num: '01',
    title: '질문 남기기',
    body: '오늘 읽은 책에서 떠오른 질문을 기록합니다',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
      </svg>
    ),
  },
  {
    num: '02',
    title: '답변 기록하기',
    body: '질문에 대한 나만의 생각을 글로 씁니다',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
      </svg>
    ),
  },
  {
    num: '03',
    title: '생각 정리하기',
    body: 'AI가 초안을 구조화하고, 운영자가 검수합니다',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
  },
  {
    num: '04',
    title: '리포트 생성하기',
    body: '한 시즌의 질문이 나만의 리포트가 됩니다',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    num: '05',
    title: '전자책 발간하기',
    body: '리포트가 깊어지면 한 권의 책이 됩니다',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
];

const PROGRESS = 42;
const REMAINING = 3;

export default function KnowledgeAssetProgressSection() {
  return (
    <section id="knowledge-progress" className="bg-stone-900 py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-900/40 border border-amber-700/40 text-amber-400 text-xs font-medium mb-4">
            지식 자산 여정
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4">
            당신의 질문은 사라지지 않습니다
          </h2>
          <p className="text-stone-400 text-lg max-w-3xl mx-auto leading-relaxed">
            읽고, 말하고, 사라지는 모임이 아닙니다.
            <br />
            질문하는 사람들은 대화를 지식 자산으로 남깁니다.
          </p>
        </div>

        {/* Part 1: Journey Steps */}
        <div className="mb-16">
          {/* Desktop: horizontal timeline */}
          <div className="hidden md:block relative">
            {/* Connector line */}
            <div className="absolute top-8 left-0 right-0 h-px bg-stone-700" aria-hidden="true" />

            <div className="grid grid-cols-5 gap-4 relative">
              {journeySteps.map((step, i) => (
                <div key={step.num} className="flex flex-col items-center text-center">
                  {/* Step node */}
                  <div
                    className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center mb-4 border-2 transition-colors ${
                      i < 2
                        ? 'bg-amber-700 border-amber-600 text-white'
                        : i === 2
                        ? 'bg-stone-700 border-amber-600 text-amber-400'
                        : 'bg-stone-800 border-stone-600 text-stone-500'
                    }`}
                  >
                    {step.icon}
                  </div>
                  <span className="text-amber-500 text-xs font-mono font-medium mb-1.5">{step.num}</span>
                  <h3 className="text-white text-sm font-semibold mb-1.5 leading-tight">{step.title}</h3>
                  <p className="text-stone-500 text-xs leading-relaxed">{step.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: vertical steps */}
          <div className="md:hidden space-y-0">
            {journeySteps.map((step, i) => (
              <div key={step.num} className="flex gap-4">
                {/* Left: node + connector */}
                <div className="flex flex-col items-center shrink-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0 ${
                      i < 2
                        ? 'bg-amber-700 border-amber-600 text-white'
                        : i === 2
                        ? 'bg-stone-700 border-amber-600 text-amber-400'
                        : 'bg-stone-800 border-stone-600 text-stone-500'
                    }`}
                  >
                    {step.icon}
                  </div>
                  {i < journeySteps.length - 1 && (
                    <div className="w-px flex-1 bg-stone-700 my-1" />
                  )}
                </div>
                {/* Right: content */}
                <div className="pb-6 pt-1">
                  <span className="text-amber-500 text-xs font-mono font-medium">{step.num}</span>
                  <h3 className="text-white text-base font-semibold mt-0.5 mb-1">{step.title}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Journey narrative */}
          <div className="mt-10 text-center">
            <p className="text-stone-500 text-sm leading-loose">
              질문 하나가 쌓이면 기록이 됩니다.&nbsp;&nbsp;기록이 모이면 리포트가 됩니다.&nbsp;&nbsp;리포트가 깊어지면 한 권의 책이 됩니다.
            </p>
          </div>
        </div>

        {/* Part 2: Progress Card */}
        <div className="mb-16 max-w-2xl mx-auto">
          <div className="bg-stone-800 rounded-2xl border border-stone-700 p-8">
            {/* Card header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-700">
              <div>
                <p className="text-stone-400 text-xs font-medium uppercase tracking-widest mb-1">나의 지식 자산 현황</p>
                <p className="text-white font-serif text-lg font-semibold">김서연 님의 기록</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-amber-900/40 border border-amber-700/40 flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-4 mb-7">
              {[
                { label: '남긴 질문', value: '7개' },
                { label: '작성한 답변', value: '5개' },
                { label: '저장한 문장', value: '12개' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-white text-2xl font-bold font-serif mb-0.5">{stat.value}</p>
                  <p className="text-stone-500 text-xs">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-stone-400 text-xs">리포트 완성도</p>
                <p className="text-amber-400 text-xs font-semibold font-mono">{PROGRESS}%</p>
              </div>
              <div className="w-full h-1 bg-stone-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all"
                  style={{ width: `${PROGRESS}%` }}
                />
              </div>
            </div>

            {/* Gauge text */}
            <div className="bg-stone-700/50 rounded-xl border border-stone-700 px-4 py-3 mb-6 text-center">
              <p className="text-stone-300 text-sm leading-relaxed">
                당신의 지식 자산이 <span className="text-amber-400 font-semibold">{PROGRESS}%</span> 축적되었습니다
              </p>
              <p className="text-stone-500 text-xs mt-0.5">
                책 1권을 발간하기까지 <span className="text-white font-medium">{REMAINING}개</span>의 질문이 남았습니다
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="#today-question"
                className="flex-1 inline-flex items-center justify-center px-5 py-3 bg-amber-700 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors text-sm"
              >
                오늘의 질문에 답하기
              </a>
              <a
                href="#"
                className="flex-1 inline-flex items-center justify-center px-5 py-3 border border-stone-600 text-stone-300 hover:text-white hover:border-stone-400 rounded-xl font-medium transition-colors text-sm"
              >
                나의 리포트 미리보기
              </a>
            </div>
          </div>
        </div>

        {/* Part 3: Pull quote strip */}
        <div className="text-center border-t border-stone-800 pt-14">
          <p className="text-2xl sm:text-3xl font-serif text-amber-400 leading-relaxed max-w-2xl mx-auto">
            &ldquo;오늘의 답변이 한 페이지의 원고가 됩니다.&rdquo;
          </p>
        </div>

      </div>
    </section>
  );
}
