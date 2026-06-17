import React from 'react';
import { archiveItems } from '../../data/archive';

export default function ArchiveSection() {
  return (
    <section id="archive" className="bg-stone-800 py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-700 text-stone-300 text-xs font-medium mb-4">
            📁 참여 후 변화의 증거
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-5">
            한 시즌이 지나면,
            <br />한 사람이 조금 바뀝니다.
          </h2>
          <p className="text-stone-400 text-lg max-w-2xl mx-auto leading-relaxed">
            질문하는 사람들의 북클럽은 모임이 끝난 뒤에도 기록으로 남습니다.
            <br />
            참여자들의 문장, 변화, 회복의 순간을 아카이빙합니다.
          </p>
        </div>

        {/* Archive cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {archiveItems.map((item) => (
            <div key={item.id} className="bg-stone-700/50 rounded-2xl border border-stone-600 p-8">
              <blockquote className="text-white text-lg font-serif leading-relaxed mb-6">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-stone-200 font-medium">{item.name}</p>
                  <p className="text-stone-400 text-sm mt-0.5">{item.profile} · {item.season}</p>
                </div>
                <div className="flex flex-wrap gap-1.5 justify-end">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full bg-stone-600 text-stone-300 text-xs shrink-0"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="text-center flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-stone-500 text-stone-300 hover:text-white hover:border-stone-300 rounded-xl font-medium transition-colors"
          >
            더 많은 기록 보기
          </a>
          <a
            href="#nearby-bookclubs"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-semibold transition-colors"
          >
            나도 기록 남기기
          </a>
        </div>
      </div>
    </section>
  );
}
