import React from 'react';

const reasons = [
  {
    icon: '📚',
    title: '혼자 읽다 멈추는 사람들을 위해',
    body: '읽다 멈추는 건 의지가 약한 게 아닙니다. 함께 읽을 사람이 없어서입니다. 북클럽은 멈추지 않게 하는 힘입니다.',
    accent: 'border-amber-300',
  },
  {
    icon: '🤝',
    title: '가벼운 친목보다 깊은 대화를 원하는 사람들을 위해',
    body: '좋은 날씨 이야기보다 더 깊은 대화를 나누고 싶은데 그럴 공간이 없었던 분들. 여기에 그런 사람들이 있습니다.',
    accent: 'border-stone-300',
  },
  {
    icon: '✍️',
    title: '내 생각을 정리하고 싶은 사람들을 위해',
    body: '머릿속에 생각이 가득한데 정리가 안 될 때, 좋은 질문 하나가 모든 것을 풀어냅니다.',
    accent: 'border-amber-300',
  },
  {
    icon: '🛡️',
    title: '좋은 사람을 안전하게 만나고 싶은 사람들을 위해',
    body: '책이라는 공통분모가 있어서 처음 만나는 사람도 어색하지 않습니다. 안전하고 따뜻한 분위기 속에서 진심으로 대화합니다.',
    accent: 'border-stone-300',
  },
];

export default function WhyPeopleNeedThisSection() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 mb-5">
            왜 지금, 이런 북클럽이 필요할까요?
          </h2>
          <p className="text-stone-600 text-lg max-w-2xl mx-auto leading-relaxed">
            사람들은 더 많은 정보보다,
            <br />
            나를 이해해주는 깊은 대화를 필요로 합니다.
          </p>
        </div>

        {/* Reason cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {reasons.map((r) => (
            <div
              key={r.title}
              className={`bg-white rounded-2xl border border-stone-100 border-l-4 ${r.accent} shadow-sm p-8 hover:shadow-md transition-shadow`}
            >
              <div className="text-3xl mb-4" aria-hidden="true">{r.icon}</div>
              <h3 className="text-xl font-semibold text-stone-900 mb-3 leading-snug">{r.title}</h3>
              <p className="text-stone-600 leading-relaxed">{r.body}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <a
            href="#nearby-bookclubs"
            className="inline-flex items-center px-8 py-4 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-xl transition-colors"
          >
            내 이야기인 것 같다면, 참여해보세요
          </a>
        </div>
      </div>
    </section>
  );
}
