import React from 'react';
import { knowledgeAssetProducts } from '../../data/knowledgeAssets';
import { KnowledgeAssetProduct } from '../../types';

const TYPE_CONFIG: Record<KnowledgeAssetProduct['type'], { icon: string; bg: string }> = {
  report:       { icon: '📊', bg: 'bg-blue-900/30 border-blue-700/40' },
  ebook:        { icon: '📕', bg: 'bg-amber-900/30 border-amber-700/40' },
  groupArchive: { icon: '🗂️', bg: 'bg-emerald-900/30 border-emerald-700/40' },
};

export default function KnowledgeAssetEngineSection() {
  return (
    <section className="bg-stone-900 py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-900/40 border border-amber-700/40 text-amber-400 text-xs font-medium mb-4">
            ✨ 차별화 기능
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4">
            지식 자산화 엔진
          </h2>
          <p className="text-2xl sm:text-3xl font-serif text-amber-400 mb-6">
            당신의 질문은 사라지지 않습니다.
          </p>
          <p className="text-stone-400 text-lg max-w-3xl mx-auto leading-relaxed">
            북클럽에서 나눈 깊이 있는 질문과 답변은 한 시즌의 기록으로 정리됩니다.
            원한다면 나만의 질문 리포트, 개인 E-Book, 그룹 아카이브북으로 남길 수 있습니다.
          </p>
        </div>

        {/* Product cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {knowledgeAssetProducts.map((p) => {
            const cfg = TYPE_CONFIG[p.type];
            return (
              <div
                key={p.id}
                className="bg-stone-800 rounded-2xl border border-stone-700 p-8 hover:border-stone-500 transition-colors flex flex-col"
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl border ${cfg.bg} mb-6 text-2xl`}>
                  {cfg.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{p.title}</h3>
                <p className="text-stone-400 leading-relaxed flex-1 mb-6">{p.description}</p>
                <div className="mt-auto">
                  <p className="text-amber-400 text-sm font-medium mb-4">{p.priceLabel}</p>
                  <a
                    href="#"
                    className="inline-flex items-center gap-1 text-stone-300 hover:text-white text-sm font-medium transition-colors group"
                  >
                    {p.ctaLabel}
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust signals */}
        <div className="bg-stone-800/60 rounded-2xl border border-stone-700 p-6 mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-sm">
            {[
              { icon: '🤖', title: 'AI 초안 편집', body: '대화 내용을 AI가 구조화하여 초안을 만듭니다.' },
              { icon: '✅', title: '운영자 검수', body: '전문 운영자가 내용을 확인하고 최종 검수합니다.' },
              { icon: '🔒', title: '동의 기반 공개', body: '공개 여부, 실명/익명 수록을 직접 선택합니다.' },
            ].map(({ icon, title, body }) => (
              <div key={title} className="text-stone-400">
                <span className="text-white font-medium block mb-1">{icon} {title}</span>
                {body}
              </div>
            ))}
          </div>
        </div>

        {/* Legal / consent note */}
        <p className="text-stone-500 text-sm text-center leading-relaxed mb-10">
          내 기록의 공개 여부를 선택할 수 있습니다. 실명/닉네임/익명 수록을 직접 결정합니다.
          <br />
          그룹 아카이브북에 수록되는 경우 별도 동의를 받습니다.
          {/* TODO: 실제 동의 플로우 구현 필요 (개인정보 동의, 저작권 동의 등) */}
        </p>

        {/* CTAs */}
        <div className="text-center flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-stone-600 text-stone-300 hover:text-white hover:border-stone-400 rounded-xl font-medium transition-colors"
          >
            샘플 리포트 보기
          </a>
          <a
            href="#nearby-bookclubs"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white rounded-xl font-semibold transition-colors"
          >
            나의 기록 만들기
          </a>
        </div>
      </div>
    </section>
  );
}
