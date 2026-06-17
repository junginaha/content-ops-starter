import React from 'react';

const SERVICE_LINKS = ['북클럽 참여하기', '가까운 북클럽 찾기', '아카이빙', '지식 자산화 엔진'];
const INFO_LINKS = ['거인의 어깨', '오늘의 질문', '서비스 소개', '운영자에게 문의'];

export default function QuesapienceFooter() {
  return (
    <footer className="bg-stone-900 text-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <span className="text-white text-xl font-bold">질문하는 사람들</span>
              <span className="block text-stone-500 text-xs tracking-widest mt-1">QUESAPIENCE</span>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed mb-4">
              책을 매개로 좋은 사람을 만나고, 깊은 질문과 답변을 나누며,
              그 대화를 기록하고 나아가 개인의 지식 자산으로 남기는
              북클럽 기반 지적 커뮤니티입니다.
            </p>
            <p className="text-stone-500 text-xs">
              서울특별시 서초구 · 서초구 선정 미래혁신형 북클럽
            </p>
          </div>

          {/* Service links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-5">서비스</h3>
            <ul className="space-y-3">
              {SERVICE_LINKS.map((label) => (
                <li key={label}>
                  <a href="#" className="text-sm text-stone-400 hover:text-white transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Info links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-5">정보</h3>
            <ul className="space-y-3">
              {INFO_LINKS.map((label) => (
                <li key={label}>
                  <a href="#" className="text-sm text-stone-400 hover:text-white transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-stone-500 text-xs">© 2025 Quesapience. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-stone-500">
            {['이용약관', '개인정보처리방침', '아카이빙 동의 정책'].map((t) => (
              <a key={t} href="#" className="hover:text-stone-300 transition-colors">
                {t}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
