import React from 'react';

const ASKERS = [
  {
    name: '박지수',
    profile: '30대 · 마케터',
    avatar: '🧑‍💼',
    joinedSeason: '2024년 봄 시즌',
    question: '나는 지금 내가 원하는 삶을 살고 있는가?',
    story:
      '회사에서 바쁜 날들을 보내다 문득 멈추게 되었어요. 북클럽에서 낯선 사람과 이 질문을 나눴을 때, 처음으로 제 이야기를 제대로 들어준 사람을 만난 것 같았어요.',
    tags: ['철학', '자기발견', '서초'],
  },
  {
    name: '이준호',
    profile: '20대 · 대학원생',
    avatar: '👨‍🎓',
    joinedSeason: '2024년 여름 시즌',
    question: '지식은 쌓이는데 왜 더 공허해질까?',
    story:
      '논문과 책으로 가득 찬 삶인데 정작 깊은 대화를 나눌 곳이 없었어요. 북클럽에서 처음으로 "그게 나예요"라고 말하는 사람을 만났습니다.',
    tags: ['인문학', '글쓰기', '온라인'],
  },
  {
    name: '김서연',
    profile: '40대 · 교사',
    avatar: '👩‍🏫',
    joinedSeason: '2024년 가을 시즌',
    question: '내가 아이들에게 가르치는 것이 정말 중요한 것일까?',
    story:
      '매일 아이들에게 무언가를 가르치면서도 정작 스스로를 잃어가고 있었어요. 북클럽에서 다시 질문하는 사람으로 돌아왔습니다.',
    tags: ['교육', '사회과학', '주말'],
  },
  {
    name: '최민준',
    profile: '30대 · 스타트업 창업자',
    avatar: '🧑‍💻',
    joinedSeason: '2025년 봄 시즌',
    question: '성공하면 행복해질 거라고 생각했는데, 왜 아직도 불안할까?',
    story:
      '원하는 것을 다 이루었다고 생각했는데 밤마다 이 질문이 떠올랐어요. 북클럽에서 같은 질문을 가진 사람들을 처음 만났습니다.',
    tags: ['철학', '심리', '강남'],
  },
  {
    name: '윤하은',
    profile: '20대 · 직장 1년차',
    avatar: '👩‍💼',
    joinedSeason: '2025년 봄 시즌',
    question: '어른이 되면 다 알 줄 알았는데, 모르는 게 더 많아지는 건 왜일까?',
    story:
      '친구들과는 이런 이야기를 나눌 수 없어서 혼자 끌어안고 있었어요. 북클럽에서 모르는 것을 함께 모른다는 게 이렇게 편할 수 있는지 처음 알았어요.',
    tags: ['에세이', '자기발견', '온라인'],
  },
  {
    name: '정다은',
    profile: '50대 · 전업주부',
    avatar: '👩‍🦱',
    joinedSeason: '2024년 겨울 시즌',
    question: '아이들이 다 자라고 나면, 나는 누구일까?',
    story:
      '아이들을 키우는 20년 동안 나 자신을 잊었다는 걸, 책 한 권이 일깨워줬어요. 북클럽은 그 이후의 저를 찾아가는 공간이 되었습니다.',
    tags: ['에세이', '자기발견', '주말'],
  },
];

export default function QuestionAskersSection() {
  return (
    <section id="question-askers" className="bg-amber-50 py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-amber-200 text-amber-700 text-xs font-medium mb-4">
            🙋 질문하는 사람들
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 mb-5">
            그들은 이런 질문을 품고 왔습니다
          </h2>
          <p className="text-stone-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Quesapience에는 좋은 질문을 가진 사람들이 있습니다.
            <br />
            당신의 질문도 여기서 환영받습니다.
          </p>
        </div>

        {/* Member cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
          {ASKERS.map((asker) => (
            <div
              key={asker.name}
              className="bg-white rounded-2xl border border-stone-100 shadow-sm p-7 flex flex-col hover:shadow-md transition-shadow"
            >
              {/* Profile row */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-2xl shrink-0">
                  {asker.avatar}
                </div>
                <div>
                  <p className="font-semibold text-stone-900 leading-tight">{asker.name}</p>
                  <p className="text-stone-400 text-xs mt-0.5">{asker.profile} · {asker.joinedSeason}</p>
                </div>
              </div>

              {/* Question */}
              <blockquote className="font-serif text-base text-amber-800 leading-relaxed bg-amber-50 rounded-xl px-5 py-4 mb-4 border-l-4 border-amber-300">
                &ldquo;{asker.question}&rdquo;
              </blockquote>

              {/* Story */}
              <p className="text-stone-600 text-sm leading-relaxed flex-1 mb-5">
                {asker.story}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {asker.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Stats strip */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm px-6 py-6 mb-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { number: '1,200+', label: '질문하는 사람들' },
              { number: '48개', label: '활성 북클럽' },
              { number: '3,600+', label: '나눈 질문들' },
              { number: '96%', label: '다음 시즌 재참여율' },
            ].map(({ number, label }) => (
              <div key={label}>
                <p className="text-2xl sm:text-3xl font-bold text-amber-700 mb-1">{number}</p>
                <p className="text-stone-500 text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-stone-600 mb-6 text-lg">
            당신에게도 꺼내지 못한 질문이 있나요?
          </p>
          <a
            href="#nearby-bookclubs"
            className="inline-flex items-center gap-2 px-8 py-4 bg-amber-700 hover:bg-amber-800 text-white font-semibold rounded-xl text-lg transition-colors shadow-lg shadow-amber-700/20"
          >
            질문하는 사람들과 함께하기
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
