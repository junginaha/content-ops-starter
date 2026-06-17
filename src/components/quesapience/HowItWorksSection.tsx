import React from 'react';

const steps = [
  {
    num: '01',
    icon: '🔍',
    title: '마음에 드는 북클럽을 고릅니다',
    body: '책의 주제, 장소, 시간, 분위기를 보고 나에게 맞는 모임을 선택해요.',
  },
  {
    num: '02',
    icon: '📖',
    title: '책 한 권 또는 문장 하나를 준비합니다',
    body: '완독하지 않아도 괜찮습니다. 인상 깊었던 문장 하나면 충분해요.',
  },
  {
    num: '03',
    icon: '💬',
    title: '질문을 가지고 사람들과 대화합니다',
    body: '중요한 건 정답이 아니라, 당신에게 남은 질문입니다.',
  },
];

export default function HowItWorksSection() {
  return (
    <section className="bg-stone-50 py-16 sm:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 mb-4">
            어떻게 참여하나요?
          </h2>
          <p className="text-stone-600 text-lg">3단계면 충분합니다</p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 mb-14">
          {steps.map((step, i) => (
            <div key={step.num} className="flex flex-col items-center text-center">
              {/* Step circle */}
              <div className="relative mb-6">
                <div className="w-28 h-28 rounded-full bg-white border-2 border-stone-200 flex items-center justify-center shadow-sm">
                  <span className="text-4xl">{step.icon}</span>
                </div>
                <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-700 text-white text-sm font-bold flex items-center justify-center">
                  {step.num}
                </span>
              </div>

              {/* Connector arrow (mobile) */}
              {i < steps.length - 1 && (
                <div className="md:hidden text-stone-300 text-2xl mb-6">↓</div>
              )}

              <h3 className="text-xl font-semibold text-stone-900 mb-3 leading-snug">
                {step.title}
              </h3>
              <p className="text-stone-600 leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>

        {/* Closing note */}
        <div className="text-center bg-white rounded-2xl border border-stone-100 p-8">
          <p className="text-stone-700 text-lg leading-relaxed">
            완독하지 않아도 괜찮습니다.
            <br />
            <strong className="text-stone-900">
              중요한 건 정답이 아니라, 당신에게 남은 질문입니다.
            </strong>
          </p>
          <div className="mt-6">
            <a
              href="#nearby-bookclubs"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-700 hover:bg-amber-800 text-white font-medium rounded-xl transition-colors"
            >
              지금 북클럽 찾기
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
