import React, { useState } from 'react';

const NAV = [
  { label: '북클럽', href: '#featured-bookclubs' },
  { label: '가까운 북클럽', href: '#nearby-bookclubs' },
  { label: '아카이빙', href: '#archive' },
  { label: '질문', href: '#todays-question' },
  { label: '거인의 어깨', href: '#giants' },
];

export default function QuesapienceHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-stone-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex flex-col leading-tight group">
            <span className="text-base font-bold text-stone-900 tracking-tight group-hover:text-amber-700 transition-colors">
              질문하는 사람들
            </span>
            <span className="text-[10px] text-stone-400 tracking-[0.15em] font-medium">QUESAPIENCE</span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7" aria-label="주 내비게이션">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-stone-600 hover:text-stone-900 font-medium transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <a
            href="#nearby-bookclubs"
            className="hidden lg:inline-flex items-center px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            북클럽 참여하기
          </a>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
            aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={open}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden border-t border-stone-100 py-4">
            <nav className="flex flex-col gap-1" aria-label="모바일 내비게이션">
              {NAV.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="px-3 py-3 text-stone-700 hover:text-stone-900 hover:bg-stone-50 rounded-lg transition-colors text-base"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#nearby-bookclubs"
                onClick={() => setOpen(false)}
                className="mt-3 px-5 py-3.5 bg-amber-700 text-white text-center font-semibold rounded-xl"
              >
                북클럽 참여하기
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
