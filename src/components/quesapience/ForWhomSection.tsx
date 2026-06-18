import React from 'react';

const targets = [
  {
    icon: (
      <svg className="w-6 h-6 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    ),
    title: '책을 쓰고 싶은 예비 저자',
    desires: [
      '언젠가 내 이름으로 책을 내고 싶다',
      '내 생각을 정리하고 싶다',
      '글을 쓰고 싶은데 어디서부터 시작할지 모르겠다',
    ],
    copy: '책을 쓰고 싶지만, 첫 문장을 시작하지 못한 분께. 질문에 답하는 것부터 시작해보세요. 당신의 답변은 한 페이지의 원고가 됩니다.',
    accentBorder: 'border-l-amber-400',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    title: '깊이 있는 모임을 만들고 싶은 북클럽 리더',
    desires: [
      '좋은 질문으로 모임의 질을 높이고 싶다',
      '참여자들의 대화를 기록으로 남기고 싶다',
      '단순 친목이 아니라 성장하는 모임을 만들고 싶다',
    ],
    copy: '좋은 질문이 있는 모임은 오래 남습니다. 북클럽 리더를 위한 질문, 기록, 아카이빙 도구를 제공합니다.',
    accentBorder: 'border-l-stone-300',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
      </svg>
    ),
    title: '내 경험을 정리하고 싶은 전문직',
    desires: [
      '내 경험과 통찰을 정리하고 싶다',
      '커리어를 글과 리포트로 자산화하고 싶다',
      '나만의 관점과 전문성을 보여주고 싶다',
    ],
    copy: '당신의 경험은 사라질 이야기가 아닙니다. 질문을 통해 커리어의 언어를 정리하고, 지식 자산으로 남겨보세요.',
    accentBorder: 'border-l-amber-400',
  },
];

export default function ForWhomSection() {
  return (
    <section className="bg-stone-50 py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-stone-200 text-stone-500 text-xs font-medium mb-4">
            정확한 한 사람을 위한 서비스
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 mb-5">
            이런 분께 필요합니다
          </h2>
          <p className="text-stone-600 text-lg max-w-2xl mx-auto leading-relaxed">
            누구나를 위한 서비스가 아닙니다.
            <br />
            정확한 한 사람을 위한 서비스입니다.
          </p>
        </div>

        {/* Target cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {targets.map((target) => (
            <div
              key={target.title}
              className={`bg-white rounded-2xl border border-stone-100 border-l-4 ${target.accentBorder} shadow-sm p-8 hover:shadow-md transition-shadow flex flex-col`}
            >
              {/* Icon */}
              <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-5 shrink-0">
                {target.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-stone-900 mb-4 leading-snug">
                {target.title}
              </h3>

              {/* Desire bullets */}
              <ul className="space-y-2 mb-6 flex-1">
                {target.desires.map((desire) => (
                  <li
                    key={desire}
                    className="flex items-start gap-2.5 text-stone-600 text-sm leading-relaxed"
                  >
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                    {desire}
                  </li>
                ))}
              </ul>

              {/* Copy */}
              <div className="border-t border-stone-100 pt-5">
                <p className="text-stone-700 text-sm leading-relaxed font-serif italic">
                  &ldquo;{target.copy}&rdquo;
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <a
            href="#nearby-bookclubs"
            className="inline-flex items-center gap-2 px-8 py-4 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-xl transition-colors"
          >
            내가 여기 해당된다면 →
          </a>
        </div>
      </div>
    </section>
  );
}
