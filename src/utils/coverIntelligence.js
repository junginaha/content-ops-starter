// ooOS Cover Intelligence — rule-based editorial QA, not a sales predictor.
// Reference examples are prompts for editorial research, not copied cover assets.
export const COVER_GENRES = {
  practical: { label: '실용·자기계발', focus: '제목의 즉시 이해와 효익', layouts: ['타이포 중심','여백 중심','단일 상징'] },
  literature: { label: '문학·에세이', focus: '정서와 이미지의 일관성', layouts: ['이미지 중심','여백 중심','타이포 중심'] },
  business: { label: '비즈니스·경제', focus: '신뢰감과 정보 위계', layouts: ['타이포 중심','단일 상징','여백 중심'] },
  art: { label: '예술·사진', focus: '시각 작품과 권리 확인', layouts: ['이미지 중심','여백 중심','타이포 중심'] },
  academic: { label: '전문·교육', focus: '가독성과 시리즈 확장성', layouts: ['타이포 중심','그리드 중심','단일 상징'] }
};
export function evaluateCover(input = {}) {
  const title = String(input.title || '').trim();
  const subtitle = String(input.subtitle || '').trim();
  const author = String(input.author || '').trim();
  const genre = COVER_GENRES[input.genre] ? input.genre : 'practical';
  const colors = Array.isArray(input.colors) ? input.colors.filter(Boolean) : [];
  const layout = String(input.layout || '타이포 중심');
  const flags = [];
  let score = 100;
  const flag = (code, message, points, severity='warn') => { flags.push({code,message,severity}); score-=points; };
  if (!title) flag('TITLE_REQUIRED','제목이 없어 인쇄 승인을 진행할 수 없습니다.',30,'block');
  if (!author) flag('AUTHOR_REQUIRED','저자명이 필요합니다.',12,'block');
  if (title.length > 24) flag('THUMBNAIL_TITLE','제목이 길어 모바일 축소 시 판독이 어려울 수 있습니다.',12);
  if (subtitle.length > 65) flag('SUBTITLE_LENGTH','부제는 표지보다 상세페이지로 옮겨 간결하게 만드세요.',7);
  if (colors.length > 4) flag('COLOR_OVERLOAD','컬러가 많습니다. 주조색·보조색·강조색 위주로 줄이세요.',12);
  if (!COVER_GENRES[genre].layouts.includes(layout)) flag('GENRE_LAYOUT','선택한 장르의 대표적 정보 위계와 다릅니다. 의도적으로 사용했는지 검토하세요.',5);
  if (!input.thumbnailChecked) flag('THUMBNAIL_UNVERIFIED','모바일 120px 축소판의 실제 가독성은 사람이 확인해야 합니다.',10);
  if (!input.rightsChecked) flag('RIGHTS_UNVERIFIED','이미지·폰트·삽화 사용권 확인이 필요합니다.',15,'block');
  if (!input.printChecked) flag('PRINT_UNVERIFIED','도련·재단·색상 모드·책등·PDF 프리플라이트 확인이 필요합니다.',15,'block');
  return { score: Math.max(0,score), genre, genreFocus: COVER_GENRES[genre].focus, flags,
    approval: flags.some(x=>x.severity==='block') ? 'HOLD' : (flags.length ? 'REVIEW' : 'EDITORIAL_READY'),
    note: '이 점수는 편집 위험 신호일 뿐 판매 성과나 인쇄 적합성을 보증하지 않습니다.' };
}
