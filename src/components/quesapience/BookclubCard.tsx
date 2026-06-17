import React from 'react';
import { Bookclub } from '../../types';

interface Props {
  bookclub: Bookclub;
  showDistance?: boolean;
  showRecommendedFor?: boolean;
}

const statusConfig = {
  open: { label: '모집중', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  almostFull: { label: '마감 임박', className: 'bg-red-50 text-red-600 border-red-200' },
  closed: { label: '마감', className: 'bg-stone-100 text-stone-500 border-stone-200' },
  ended: { label: '종료', className: 'bg-stone-100 text-stone-400 border-stone-200' },
};

export default function BookclubCard({ bookclub, showDistance = false, showRecommendedFor = false }: Props) {
  const seatsLeft = bookclub.capacity - bookclub.currentMembers;
  const statusCfg = statusConfig[bookclub.status];
  const isClosed = bookclub.status === 'closed' || bookclub.status === 'ended';

  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="p-6 flex-1 flex flex-col">
        {/* Status badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusCfg.className}`}>
            {statusCfg.label}
          </span>
          {bookclub.isBeginnerFriendly && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-50 text-sky-600 border border-sky-200">
              첫 참여 환영
            </span>
          )}
          {bookclub.canJoinWithoutReading && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-50 text-violet-600 border border-violet-200">
              책 못 읽어도 가능
            </span>
          )}
          {seatsLeft > 0 && seatsLeft <= 2 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-600 border border-orange-200">
              {seatsLeft}자리 남음
            </span>
          )}
        </div>

        {/* Category */}
        <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
          {bookclub.category}
        </p>

        {/* Title & Book */}
        <h3 className="text-lg font-bold text-stone-900 mb-1 leading-snug">{bookclub.title}</h3>
        <p className="text-sm text-stone-500 mb-3">📖 {bookclub.bookTitle}</p>

        {/* Description */}
        {bookclub.description && (
          <p className="text-sm text-stone-600 mb-4 leading-relaxed line-clamp-3">
            {bookclub.description}
          </p>
        )}

        {/* Recommended for */}
        {showRecommendedFor && bookclub.recommendedFor.length > 0 && (
          <div className="mb-4 bg-stone-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">
              이런 분께 좋아요
            </p>
            <ul className="space-y-1.5">
              {bookclub.recommendedFor.map((item, i) => (
                <li key={i} className="text-sm text-stone-700 flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5 shrink-0">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-y-2 gap-x-3 text-sm text-stone-600 mb-3">
          <div className="flex items-start gap-1.5">
            <span className="shrink-0">📍</span>
            <span className="truncate">{bookclub.locationName}</span>
          </div>
          <div className="flex items-start gap-1.5">
            <span className="shrink-0">📅</span>
            <span>{bookclub.date}</span>
          </div>
          <div className="flex items-start gap-1.5">
            <span className="shrink-0">👤</span>
            <span>리더 {bookclub.leaderName}</span>
          </div>
          <div className="flex items-start gap-1.5">
            <span className="shrink-0">⏰</span>
            <span>{bookclub.time}</span>
          </div>
        </div>

        {/* Seats */}
        <div className="flex items-center gap-3 mb-1">
          <div className="flex-1 bg-stone-100 rounded-full h-1.5">
            <div
              className="bg-amber-500 h-1.5 rounded-full transition-all"
              style={{ width: `${(bookclub.currentMembers / bookclub.capacity) * 100}%` }}
            />
          </div>
          <span className="text-xs text-stone-500 shrink-0">
            {bookclub.currentMembers}/{bookclub.capacity}명
          </span>
        </div>

        {showDistance && bookclub.distanceLabel && (
          <p className="text-xs text-stone-400 mt-1">
            현재 위치에서 약 {bookclub.distanceLabel}
          </p>
        )}

        <div className="flex-1" />
      </div>

      {/* Card footer */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
          <span className="text-base font-bold text-stone-900">{bookclub.price}</span>
          <div className="flex gap-2">
            <a
              href={bookclub.detailUrl}
              className="px-3 py-2 text-sm border border-stone-200 text-stone-600 rounded-lg hover:bg-stone-50 transition-colors"
            >
              상세보기
            </a>
            <a
              href={bookclub.applyUrl}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                isClosed
                  ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                  : 'bg-amber-700 hover:bg-amber-800 text-white'
              }`}
            >
              참여하기
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
