import React, { useState } from 'react';

const QUESTION = '당신은 마지막으로 언제, 진심으로 울었나요?';

const ANSWERS = [
  {
    name: '익명 참여자',
    profile: '30대 · 직장인',
    text: '작년 가을, 할머니 댁에서 오래된 사진첩을 보다가. 사진 속 내가 너무 행복해 보여서 울었어요. 지금도 그렇게 살고 있는지 모르겠어서.',
  },
  {
    name: '이서연',
    profile: '20대 · 대학원생',
    text: '북클럽에서 누군가 내 이야기를 "그거 내 얘기예요"라고 했을 때. 처음으로 누군가에게 이해받은 느낌이었어요.',
  },
];

export default function TodayQuestionSection() {
  const [showForm, setShowForm] = useState(false);

  return (
    <section id="todays-question" className="bg-stone-50 py-16 sm:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-stone-200 text-stone-500 text-xs font-medium mb-4">
            💭 오늘의 질문
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mb-3">
            오늘의 질문
          </h2>
          <p className="text-stone-500">
            북클럽에 참여하기 전, 하나의 질문에 잠시 머물러 보세요.
          </p>
        </div>

        {/* Question card */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-10 mb-8 text-center">
          <p className="font-serif text-2xl sm:text-3xl text-stone-900 leading-relaxed mb-8">
            &ldquo;{QUESTION}&rdquo;
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setShowForm((v) => !v)}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-stone-300 text-stone-700 hover:bg-stone-50 font-medium rounded-xl transition-colors"
            >
              {showForm ? '닫기' : '질문 남겨보기'}
            </button>
            <a
              href="#"
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-3 text-stone-500 hover:text-stone-700 text-sm transition-colors"
            >
              전체 질문 보기 →
            </a>
          </div>

          {showForm && (
            <div className="mt-6 text-left">
              <textarea
                placeholder="잠시 머물러 답해보세요. 여기에 쓴 내용은 저장되지 않습니다."
                className="w-full p-4 rounded-xl border border-stone-200 text-stone-800 placeholder-stone-400 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
                rows={4}
              />
              <p className="text-xs text-stone-400 mt-2">
                * 이 답변은 기록되지 않습니다. 진짜 대화는 북클럽에서 나눠요.
              </p>
            </div>
          )}
        </div>

        {/* Answer previews */}
        <p className="text-xs text-stone-400 text-center mb-4">다른 참여자들의 이야기</p>
        <div className="space-y-4">
          {ANSWERS.map((a, i) => (
            <div key={i} className="bg-white rounded-xl border border-stone-100 p-6">
              <p className="text-stone-700 leading-relaxed mb-4 font-serif">&ldquo;{a.text}&rdquo;</p>
              <p className="text-sm text-stone-400">
                <span className="font-medium text-stone-600">{a.name}</span>
                {' · '}
                {a.profile}
              </p>
            </div>
          ))}
        </div>

        {/* Lower-priority CTA */}
        <div className="mt-10 text-center">
          <a
            href="#nearby-bookclubs"
            className="text-amber-700 hover:text-amber-900 font-medium text-sm underline-offset-4 hover:underline"
          >
            이런 대화를 직접 나누고 싶다면 → 북클럽 참여하기
          </a>
        </div>
      </div>
    </section>
  );
}
