export const layoutModules = [
  {
    id: 'CLASSIC_READING',
    label: 'Classic Reading',
    purpose: '에세이·회고·교양의 안정적인 1단 본문',
    rules: ['단일 컬럼', '안정적 본문 폭', '넉넉한 바깥 여백', '최소 장식']
  },
  {
    id: 'ONE_SIDE_READING',
    label: 'One-side Reading',
    purpose: '본문과 주석·이미지·여백을 좌우 역할로 분리',
    rules: ['오른쪽 본문', '왼쪽 주석/이미지/여백', '페이지 역할 고정']
  },
  {
    id: 'PROGRESSIVE_TEXT',
    label: 'Progressive Text',
    purpose: '짧은 글을 시간과 리듬으로 확장',
    rules: ['1줄→2줄→3줄', '글자 크기 과대 확대 금지', '여백을 독서 시간으로 사용']
  },
  {
    id: 'DENSITY_SWITCH',
    label: 'Density Switch',
    purpose: '조밀한 본문과 이미지·색면을 교대',
    rules: ['본문 밀도 변화', '전면 이미지', '색면/인터루드']
  },
  {
    id: 'SECTION_OPENER',
    label: 'Section Opener',
    purpose: '짧은 글 묶음의 장 전환을 명확히 함',
    rules: ['키워드 1면', '사진 1면+제목 1면', '제한색']
  },
  {
    id: 'MULTI_TEXT_WIDTH',
    label: 'Multi Text Width',
    purpose: '글 길이에 따라 본문 폭을 제한적으로 변화',
    rules: ['3~5개 폭 프리셋', '서체/기본 마진 통일', '밀도 변화']
  },
  {
    id: 'MARGIN_NOTE_GRID',
    label: 'Margin Note Grid',
    purpose: '본문·주석·출처·캡션을 분리',
    rules: ['본문 중심축', '측면 주석', '공통 기준선']
  },
  {
    id: 'MULTI_COLUMN_REFERENCE_GRID',
    label: 'Multi-column Reference Grid',
    purpose: '본문·이미지·주석·출처가 많은 정보형 책',
    rules: ['다중 열', '정보 역할별 영역', '명확한 수직 기준선']
  },
  {
    id: 'TECHNICAL_ILLUSTRATION_GRID',
    label: 'Technical Illustration Grid',
    purpose: '도해와 설명문의 대응을 명확히 함',
    rules: ['도해/설명 연결', '큰 제목→설명→도해', '제한색']
  },
  {
    id: 'ARCHIVE_VS_PRESENT',
    label: 'Archive vs Present',
    purpose: '과거 자료와 현재 해설을 다른 시각 언어로 분리',
    rules: ['파크시밀리', '현대 조판', '자료/해설 시각 분리']
  },
  {
    id: 'REPEATABLE_CARD',
    label: 'Repeatable Card',
    purpose: '짧은 콘텐츠가 많은 책을 반복 가능한 모듈로 구성',
    rules: ['5~7개 유형', '매 페이지 새 디자인 금지', '장별 제한 변주']
  },
  {
    id: 'SINGLE_STRONG_RULE',
    label: 'Single Strong Rule',
    purpose: '한두 개의 강한 시각 규칙을 책 전체에 반복',
    rules: ['색/선/위치/재료 중 1~2개', '나머지는 절제', '일관된 정보 위계']
  }
];

export const designReferences = [
  {
    id: 'walking-as-research-practice',
    title: 'Walking as Research Practice',
    publisher: 'Soapbox',
    designer: 'Jana Sofie Liebe',
    year: 2024,
    module: 'ONE_SIDE_READING',
    tags: ['에세이', '여백형', '주석'],
    evidence: 'Stiftung Buchkunst · Goldene Letter',
    officialUrl: 'https://www.stiftung-buchkunst.de/en/best-book-design-from-all-over-the-world/the-awardees/detail/walking-as-research-practice/',
    previewUrl: 'https://goodpress.co.uk/cdn/shop/files/IMG_8031011_2048x.jpg?v=1728997882',
    rights: { layout: 'ADAPT', font: 'CHECK', images: 'NO', text: 'NO' }
  },
  {
    id: 'on-the-necessity-of-gardening',
    title: 'On the Necessity of Gardening',
    publisher: 'Valiz + Centraal Museum Utrecht',
    designer: 'Bart de Baets',
    year: 2021,
    module: 'DENSITY_SWITCH',
    tags: ['문화예술', '그리드형', '이미지인터루드'],
    evidence: 'Stiftung Buchkunst · Goldene Letter',
    officialUrl: 'https://www.stiftung-buchkunst.de/en/best-book-design-from-all-over-the-world/the-awardees/detail/on-the-necessity-of-gardening/',
    previewUrl: 'https://valiz.nl/images/igallery/resized/1601-1700/ISBN-9789493246003-OnTheNecessityOfGardening-Spread1-72dpi-1699-1250-750-90.jpg',
    rights: { layout: 'ADAPT', font: 'CHECK', images: 'NO', text: 'NO' }
  },
  {
    id: 'here-a-world-poem',
    title: 'HERE: A World Poem',
    publisher: 'Typotheque',
    designer: 'Atelier Carvalho Bernau',
    year: 2021,
    module: 'PROGRESSIVE_TEXT',
    tags: ['시', '짧은글', '생성형조판'],
    evidence: 'TDC68 + Best Dutch Book Designs',
    officialUrl: 'https://tdc.org/winner/here-a-world-poem-by-tishani-doshi/',
    previewUrl: 'https://carvalho-bernau.com/here/',
    rights: { layout: 'ADAPT', font: 'CHECK', images: 'NO', text: 'NO' }
  },
  {
    id: 'redaction',
    title: 'Redaction',
    publisher: 'W. W. Norton & Company',
    designer: 'James Goggin, Amanda Barrow / Practise',
    year: 2023,
    module: 'SECTION_OPENER',
    tags: ['시', '이미지인터루드', '레이어'],
    evidence: 'AIGA 50 Books | 50 Covers 2023',
    officialUrl: 'https://50books50covers.secure-platform.com/a/gallery/rounds/323/details/68624',
    previewUrl: 'https://www.redaction.us/',
    rights: { layout: 'ADAPT', font: 'USE/CHECK', images: 'NO', text: 'NO' }
  },
  {
    id: 'k-artists',
    title: 'K-Artists',
    publisher: 'Archive Books / The Floorplan',
    designer: 'Dokho Shin',
    year: 2023,
    module: 'MARGIN_NOTE_GRID',
    tags: ['인터뷰', '문화예술', '이미지목차'],
    evidence: '한국에서 가장 아름다운 책 2024',
    officialUrl: 'https://www.archivebooks.org/k-artists/',
    previewUrl: 'https://www.archivebooks.org/k-artists/',
    rights: { layout: 'ADAPT', font: 'CHECK', images: 'NO', text: 'NO' }
  },
  {
    id: 'hidden-heartache',
    title: 'Hidden Heartache',
    publisher: 'Jungle Books',
    designer: 'Samuel Bänziger, Rosario Florio, Larissa Kasper',
    year: 2024,
    module: 'MULTI_TEXT_WIDTH',
    tags: ['에세이', '여백형', '본문폭변주'],
    evidence: 'Stiftung Buchkunst · Bronze Medal',
    officialUrl: 'https://www.stiftung-buchkunst.de/en/best-book-design-from-all-over-the-world/the-awardees/detail/hidden-heartache/',
    previewUrl: 'https://www.stiftung-buchkunst.de/en/best-book-design-from-all-over-the-world/the-awardees/detail/hidden-heartache/',
    rights: { layout: 'ADAPT', font: 'CHECK', images: 'NO', text: 'NO' }
  },
  {
    id: 'raising-the-curtain',
    title: 'Raising the Curtain',
    publisher: 'Spector Books',
    designer: 'Lamm & Kirch, Caspar Reuss',
    year: 2024,
    module: 'MARGIN_NOTE_GRID',
    tags: ['문화예술', '주석', '그리드형'],
    evidence: 'Die Schönsten Deutschen Bücher 2025',
    officialUrl: 'https://www.spectorbooks.com/book/raising-the-curtain',
    previewUrl: 'https://www.spectorbooks.com/f/bookgallery/555f877efe.jpg',
    rights: { layout: 'ADAPT', font: 'CHECK', images: 'NO', text: 'NO' }
  },
  {
    id: 'collapsed-mythologies',
    title: 'Collapsed Mythologies: A Geofinancial Atlas',
    publisher: 'Spector Books / Page Not Found',
    designer: 'Dayna Casey',
    year: 2025,
    module: 'MULTI_COLUMN_REFERENCE_GRID',
    tags: ['문화예술', '글이미지50_50', '주석'],
    evidence: 'Stiftung Buchkunst 2026 · Bronze Medal',
    officialUrl: 'https://www.spectorbooks.com/book/collapsed-mythologies',
    previewUrl: 'https://www.spectorbooks.com/f/bookgallery/0cf19c5a64.jpg',
    rights: { layout: 'ADAPT', font: 'CHECK', images: 'NO', text: 'NO' }
  },
  {
    id: 'taiwan-letterpress-guide',
    title: 'The Visual Guide to Taiwan Letterpress Printing',
    publisher: 'Yuan-Liou Publishing',
    designer: 'Peng-Hsiang Kao',
    year: 2025,
    module: 'TECHNICAL_ILLUSTRATION_GRID',
    tags: ['문화예술', '도해', '그리드형'],
    evidence: 'Stiftung Buchkunst 2026 · Honorary Appreciation',
    officialUrl: 'https://www.stiftung-buchkunst.de/en/best-book-design-from-all-over-the-world/',
    previewUrl: 'https://img.ltn.com.tw/Upload/art/page/800/2026/05/24/128.jpg',
    rights: { layout: 'ADAPT', font: 'CHECK', images: 'NO', text: 'NO' }
  }
];

export function recommendDesignProfiles(analysis = {}) {
  const avgParagraphLength = analysis.paragraphCount
    ? Math.round((analysis.charCount || 0) / analysis.paragraphCount)
    : 0;
  const refsByModule = designReferences.reduce((map, ref) => {
    if (!map[ref.module]) map[ref.module] = [];
    map[ref.module].push(ref);
    return map;
  }, {});

  let moduleIds = ['CLASSIC_READING', 'SINGLE_STRONG_RULE'];

  if ((analysis.paragraphCount || 0) >= 40 && avgParagraphLength <= 260) {
    moduleIds = ['PROGRESSIVE_TEXT', 'REPEATABLE_CARD', 'SECTION_OPENER'];
  } else if ((analysis.headingCount || 0) >= 8) {
    moduleIds = ['SECTION_OPENER', 'MULTI_TEXT_WIDTH', 'DENSITY_SWITCH'];
  } else if ((analysis.estimatedPrintPages || 0) >= 180) {
    moduleIds = ['MULTI_TEXT_WIDTH', 'MARGIN_NOTE_GRID', 'SINGLE_STRONG_RULE'];
  } else if (avgParagraphLength > 700) {
    moduleIds = ['CLASSIC_READING', 'MARGIN_NOTE_GRID', 'SINGLE_STRONG_RULE'];
  } else {
    moduleIds = ['CLASSIC_READING', 'ONE_SIDE_READING', 'SECTION_OPENER'];
  }

  return moduleIds
    .map((id) => {
      const module = layoutModules.find((item) => item.id === id);
      if (!module) return null;
      return { ...module, references: refsByModule[id] || [] };
    })
    .filter(Boolean);
}
