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
  },
  {
    id: 'dirty-old-river',
    title: 'Dirty Old River',
    publisher: 'Park Books',
    designer: 'John Morgan Studio',
    year: 2025,
    module: 'MULTI_TEXT_WIDTH',
    tags: ['에세이', '여백형', '본문폭변주', '이미지인터루드'],
    evidence: 'The Most Beautiful Swiss Books 2025',
    officialUrl: 'https://www.schweizerkulturpreise.ch/en/dirty-old-river-en',
    previewUrl: 'https://pub-mediabox-storage.rxweb-prd.com/exhibitor/document/exh-35712cc4-9f72-420a-ba85-8f9698d65902/62f68f72-7202-4e06-8fc9-478ea2b72c81.pdf',
    rights: { layout: 'ADAPT', font: 'CHECK', images: 'NO', text: 'NO' }
  },
  {
    id: 'superior-and-inferior',
    title: 'Superior and Inferior',
    publisher: 'Crackers',
    designer: 'Sabo Day',
    year: 2025,
    module: 'ARCHIVE_VS_PRESENT',
    tags: ['인터뷰', '회고', '여백형', '원자료대조'],
    evidence: 'The Most Beautiful Swiss Books 2025',
    officialUrl: 'https://www.schweizerkulturpreise.ch/en/superior-and-inferior-en',
    previewUrl: 'https://en.aohatabooks.com/products/superior-and-inferior-carla-accardi',
    rights: { layout: 'ADAPT', font: 'CHECK', images: 'NO', text: 'NO' }
  },
  {
    id: 'house-of-doctor-koolhaas',
    title: 'The House of Doctor Koolhaas',
    publisher: 'Park Books',
    designer: 'John Morgan Studio',
    year: 2025,
    module: 'DENSITY_SWITCH',
    tags: ['문화예술', '그리드형', '이미지인터루드', '소형판형'],
    evidence: 'The Most Beautiful Swiss Books 2025',
    officialUrl: 'https://www.schweizerkulturpreise.ch/en/the-house-of-dr-koolhaas-en',
    previewUrl: 'https://pub-mediabox-storage.rxweb-prd.com/exhibitor/document/exh-35712cc4-9f72-420a-ba85-8f9698d65902/62f68f72-7202-4e06-8fc9-478ea2b72c81.pdf',
    rights: { layout: 'ADAPT', font: 'CHECK', images: 'NO', text: 'NO' }
  },
  {
    id: 'die-anrufung-der-riesin',
    title: 'Die Anrufung der Riesin',
    publisher: 'starfruit publications',
    designer: 'StudioNearMe / Karin Kolb',
    year: 2024,
    module: 'DENSITY_SWITCH',
    tags: ['에세이', '회고', '여백형', '이미지인터루드'],
    evidence: 'Die Schönsten Deutschen Bücher 2025 — Stiftung Buchkunst',
    officialUrl: 'https://www.stiftung-buchkunst.de/die-schoensten-deutschen-buecher/die-praemierten/die-anrufung-der-riesin/',
    galleryUrl: 'https://studio-near.me/home/',
    previewUrl: 'https://studio-near.me/wp-content/uploads/2024/09/Riesin04-1-265x224.webp',
    dimensionsMm: [140, 210],
    pageCount: 128,
    typefaces: [
      { name: 'Kalice', status: 'CHECK' },
      { name: 'Elza', status: 'CHECK' },
      { name: 'Noto Serif CJK KR', status: 'SUBSTITUTE' }
    ],
    palette: 'Apple-green linen cover, deep purple typography, cream paper; monochrome and muted photographic accents',
    layoutNotes: 'Readable essay columns, unconventional footnotes, full-page and double-page photography; exact margins and leading not published',
    editorialIdea: 'Alternate stable essay text with occasional photographic interludes; maintain readable body width and footnote hierarchy',
    rights: { layout: 'ADAPT', font: 'CHECK', images: 'NO', text: 'NO' }
  },
  {
    id: 'logorrhea-jean-michel-wicker',
    title: 'logorrhea',
    publisher: 'a bouncing people planet',
    designer: 'Marietta Eugster',
    year: 2024,
    module: 'PROGRESSIVE_TEXT',
    tags: ['짧은글', '시', '여백형', '타이포그래피'],
    evidence: 'The Most Beautiful Swiss Books 2024 — Swiss Federal Office of Culture',
    officialUrl: 'https://www.schweizerkulturpreise.ch/en/logorrhea-4',
    galleryUrl: 'https://www.schweizerkulturpreise.ch/en/logorrhea-4',
    previewUrl: 'https://www.lespressesdureel.com/EN/img_hd/img/ouvrage/11499/logorrhea_double_page_for_pdr_17.jpg',
    dimensionsMm: [140, 210],
    pageCount: 468,
    pageCountNote: 'Distributor: 468 pages; Swiss jury: 466 black-and-white pages',
    typefaces: [
      { name: 'Gill Sans Bold', status: 'CHECK' },
      { name: 'Unidentified introductory serif', status: 'CHECK' },
      { name: 'Noto Sans CJK KR', status: 'SUBSTITUTE' }
    ],
    palette: 'Black on warm white, occasional fluorescent yellow',
    layoutNotes: 'Very short text at top of page or freely positioned; generous negative space; occasional oversized glyphs; exact leading unpublished',
    editorialIdea: 'Use short statements and sparse placement to create rhythm; avoid gratuitous blank-page inflation',
    rights: { layout: 'ADAPT', font: 'CHECK', images: 'NO', text: 'NO' }
  },
  {
    id: 'freinet-techniques',
    title: 'Freinet Techniques, Freinettechnieken, Techniques Freinet',
    publisher: 'Rollo Press / Drukkerij Raddraaier SSP',
    designer: 'Paul Gangloff',
    year: 2024,
    module: 'ARCHIVE_VS_PRESENT',
    tags: ['문화예술', '짧은글', '그리드형', '자료대조'],
    evidence: 'The Most Beautiful Swiss Books 2024 — Swiss Federal Office of Culture',
    officialUrl: 'https://www.schweizerkulturpreise.ch/en/freinet-techniques-freinettechnieken-techniques-freinet-4',
    galleryUrl: 'https://www.schweizerkulturpreise.ch/en/freinet-techniques-freinettechnieken-techniques-freinet-4',
    previewUrl: 'https://draw-down.com/cdn/shop/files/FreinetTechniques7_2048x2048.jpg?v=1752865152',
    dimensionsMm: [170, 210],
    pageCount: 296,
    typefaces: [
      { name: 'Original sans-serif (unidentified)', status: 'CHECK' },
      { name: 'Noto Sans CJK KR', status: 'SUBSTITUTE' }
    ],
    palette: 'Yellow cloth cover, black type, black-and-white archive sheets, translucent paper',
    layoutNotes: 'Archival student text per page paired with translation, short introductory essays and multilingual columns; exact leading unpublished',
    editorialIdea: 'Pair source image with transcription or translation on facing page; preserve source attribution',
    rights: { layout: 'ADAPT', font: 'CHECK', images: 'NO', text: 'NO' }
  },
  {
    id: 'the-ginny-suite',
    title: 'The Ginny Suite',
    author: 'Stacy Skolnik',
    publisher: 'Montez Press',
    designer: 'JMMP / Julian Mader, Max Prediger',
    year: 2024,
    dimensionsMm: [117, 180],
    pageCount: 168,
    module: 'REPEATABLE_CARD',
    tags: ['짧은글', '시', '여백형', '내지'],
    evidence: 'Die Schönsten Deutschen Bücher 2026 — Stiftung Buchkunst',
    officialUrl: 'https://www.stiftung-buchkunst.de/die-schoensten-deutschen-buecher/die-praemierten/the-ginny-suite/?view=list&year=2026',
    galleryUrl: 'https://goodpress.co.uk/products/the-ginny-suite-by-stacy-skolnik',
    publisherUrl: 'https://montezpress.com/catalogue/books/the-ginny-suite/',
    previewUrl: null,
    previewStatus: 'Retail gallery publicly listed; direct JPG not confirmed; editable original not available',
    typefaces: [
      { name: 'LL Bradford Regular', status: 'CHECK', source: 'https://lineto.com/typefaces/bradford-mono' },
      { name: 'Salzmann Antiqua', status: 'CHECK' },
      { name: 'Noto Serif CJK KR', status: 'SUBSTITUTE', source: 'https://notofonts.github.io/noto-docs/website/use/' }
    ],
    palette: 'Black/gray interior, holographic/silver-black cover',
    layoutNotes: 'Large margins and readable line length; mixed prose, poetry, diary, online fragments use consistent body style with periodic type changes; exact body width, leading, grid measurements unpublished',
    editorialIdea: 'Mixed short-text book: repeat 3–4 types of content pages instead of giving each piece a unique design',
    rights: { layout: 'ADAPT', font: 'CHECK', images: 'NO', text: 'NO' }
  },
  {
    id: 'agnes-von-ungarn',
    title: 'Agnes von Ungarn, 1280–1364. Die einflussreichste Habsburgerin des Mittelalters',
    author: 'Bruno Meier',
    publisher: 'Hier und Jetzt Verlag',
    designer: 'Naima Schalcher',
    year: 2025,
    dimensionsMm: [135, 195],
    pageCount: 280,
    module: 'CLASSIC_READING',
    tags: ['회고', '문화예술', '여백형', '이미지인터루드', '내지'],
    evidence: 'The Most Beautiful Swiss Books 2025, awarded 2026 — Swiss Federal Office of Culture',
    officialUrl: 'https://www.schweizerkulturpreise.ch/en/agnes-von-ungarn-en',
    galleryUrl: 'https://www.hierundjetzt.ch/fr/catalogue/agnes-von-ungarn-1280-1364_24000048/',
    previewUrl: 'https://prod-schwzkulturpr-hcms-sdweb.imgix.net/dam/fr/sd-web/Yz7qqpbV6Y13/CL_PBL~3.JPG?auto=format&w=1024',
    previewStatus: 'Public JPG preview of a real spread; not editable source or reuse permission',
    typefaces: [
      { name: 'Original serif/sans families', status: 'CHECK' },
      { name: 'Noto Serif CJK KR', status: 'SUBSTITUTE', source: 'https://notofonts.github.io/noto-docs/website/use/' }
    ],
    palette: 'Dark velvety cover, monochrome body on white, historic picture insert',
    layoutNotes: 'Compact book with readable serif body, some text blocks shifted up or centered, reserved initial spaces at chapter openings, 24 color images in inserted coated section; exact leading and grid measurements unpublished',
    editorialIdea: 'Text-led memoir or biography with a single photo insert and generous opening space',
    rights: { layout: 'ADAPT', font: 'CHECK', images: 'NO', text: 'NO' }
  },
  {
    id: 'heatwave-bahrain-pavilion',
    title: 'HEATWAVE',
    publisher: 'The National Pavilion of the Kingdom of Bahrain, Venice Biennale',
    designer: 'Samuel Bänziger, Rosario Florio, Larissa Kasper',
    editor: 'Andrea Faraguna',
    year: 2025,
    dimensionsMm: null,
    pageCount: null,
    module: 'SECTION_OPENER',
    tags: ['문화예술', '글이미지50_50', '이미지인터루드', '그리드형'],
    evidence: 'The Most Beautiful Swiss Books 2025, awarded 2026 — Swiss Federal Office of Culture',
    officialUrl: 'https://www.schweizerkulturpreise.ch/en/heatwave2-en',
    galleryUrl: 'https://www.schweizerkulturpreise.ch/en/heatwave2-en',
    previewUrl: null,
    previewStatus: 'Official jury gallery has multiple photographs; direct JPG and editable source not verified',
    typefaces: [
      { name: 'Original fonts not identified', status: 'CHECK' },
      { name: 'Noto Sans CJK KR', status: 'SUBSTITUTE', source: 'https://notofonts.github.io/noto-docs/website/use/' }
    ],
    palette: 'Red uncoated cover, two paper tones, sparing colors',
    layoutNotes: 'Six nested small-format booklets, seven short scholarly essays, three visual essays, two image sections; English left-to-right and Arabic right-to-left; exact page count, format, leading and grid not published',
    editorialIdea: 'Group short essays and visual sections into six coherent chapters; adapt only modular organization, not costly or intentionally degrading materials',
    rights: { layout: 'ADAPT', font: 'CHECK', images: 'NO', text: 'NO' }
  },
  {
    id: 'library-of-artistic-print-on-demand',
    title: 'Library of Artistic Print on Demand: Post-Digital Publishing in Times of Platform Capitalism',
    publisher: 'Spector Books',
    editor: 'Annette Gilbert, Andreas Bülhoff',
    designer: 'Lyosha Kritsouk / Spector Books',
    year: 2025,
    dimensionsMm: [220, 290],
    pageCount: 720,
    module: 'MULTI_COLUMN_REFERENCE_GRID',
    tags: ['문화예술', '그리드형', '내지', '출판', 'POD'],
    evidence: 'Die Schönsten Deutschen Bücher 2026 — Stiftung Buchkunst (design award)',
    officialUrl: 'https://www.stiftung-buchkunst.de/die-schoensten-deutschen-buecher/die-praemierten/library-of-artistic-print-on-demand/?view=grid&year=2026',
    publisherUrl: 'https://www.spectorbooks.com/book/library-of-artistic-print-on-demand',
    galleryUrl: 'https://www.graphic-design-books.com/en/products/library-of-artistic-print-on-demand',
    previewUrl: 'https://www.graphic-design-books.com/cdn/shop/files/5_51dbc1ea-7bcc-43ac-88c0-d137634bb0d2.jpg?v=1763614976&width=1920',
    previewStatus: 'Public JPG of actual interior spread; not an editable source or reuse license',
    typefaces: [
      { name: 'Akzidenz Grotesk Book Pro', status: 'CHECK' },
      { name: 'GT Alpina Regular', status: 'CHECK', source: 'https://cdn.grillitype.com/typeface/gt-alpina' },
      { name: 'GT Alpina Typewriter', status: 'CHECK', source: 'https://cdn.grillitype.com/typeface/gt-alpina' },
      { name: 'Noto Serif CJK KR', status: 'SUBSTITUTE' }
    ],
    palette: 'White paper, black text and rules, prominent yellow titles and chapter gradients',
    layoutNotes: 'Multi-column bibliographic tables and image cells with consistent horizontal rules, oversized yellow names overlaying data hierarchy, essay sections embedded in same grid; exact body width and leading not disclosed',
    editorialIdea: 'For ooOS, reuse metadata-driven content roles: title, source, summary, visual evidence and rights status as fixed columns, with generous chapter opener',
    rights: { layout: 'ADAPT', font: 'CHECK', images: 'NO', text: 'NO' }
  },
  {
    id: 'bruchstuecke-leerstellen-blinde-flecken',
    title: 'Bruchstücke, Leerstellen, Blinde Flecken (HGB Magazine #3)',
    publisher: 'Hochschule für Grafik und Buchkunst Leipzig',
    editor: 'Julia Blume, Nanne Buurman, Julia Kurz',
    designer: 'Emil Kowalczyk, Merle Petsch',
    year: 2026,
    dimensionsMm: [238, 322],
    pageCount: 232,
    pageCountNote: 'Stiftung Buchkunst records 232 pages and 238 × 322 mm; publisher describes 228 pages and 235 × 325 mm',
    module: 'MARGIN_NOTE_GRID',
    tags: ['문화예술', '그리드형', '회지', '내지', '주석'],
    evidence: 'Die Schönsten Deutschen Bücher 2026 — Stiftung Buchkunst (design award)',
    officialUrl: 'https://www.stiftung-buchkunst.de/die-schoensten-deutschen-buecher/die-praemierten/bruchstuecke-leerstellen-blinde-flecken/?view=grid&year=2026',
    publisherUrl: 'https://www.hgb-leipzig.de/hochschule/presse/hgbmagazine/',
    galleryUrl: 'https://www.hgb-leipzig.de/hochschule/presse/hgbmagazine/',
    previewUrl: null,
    previewStatus: 'Publisher cover image and jury layout description verified; directly downloadable interior JPG/PDF not verified',
    typefaces: [
      { name: 'ReformGrotesk', status: 'CHECK', source: 'https://forgotten-shapes.com/' },
      { name: 'Sabon', status: 'CHECK', source: 'https://www.myfonts.com/collections/sabon-font-monotype-imaging' },
      { name: 'Noto Serif CJK KR', status: 'SUBSTITUTE' }
    ],
    palette: 'Black recurring orientation bars, white and grayscale archival material, occasional restrained color',
    layoutNotes: 'Changing orientation, dense archive image layers and articles; black edge bars anchor navigation, fine footnotes and concealed flap contents; numeric body width, leading and margins not published',
    editorialIdea: 'Use a stable black navigation rail and dedicated footnote grid to reconcile archival fragments with editorial interpretation',
    rights: { layout: 'ADAPT', font: 'CHECK', images: 'NO', text: 'NO' }
  },
  {
    id: 'the-tinklers-charts-and-stories',
    title: 'The Tinklers Charts and Stories',
    publisher: 'Rollo Press',
    designer: 'Olivier Lebrun, Urs Lehni',
    editor: 'Olivier Lebrun, Urs Lehni',
    year: 2025,
    dimensionsMm: [240, 320],
    pageCount: 216,
    module: 'REPEATABLE_CARD',
    tags: ['짧은글', '문화예술', '글이미지50_50', '이미지인터루드', '내지'],
    evidence: 'The Most Beautiful Swiss Books 2025, announced 13 May 2026 — Swiss Federal Office of Culture',
    officialUrl: 'https://www.schweizerkulturpreise.ch/en/the-tinklers-en',
    galleryUrl: 'https://librairiesanstitre.com/en/products/the-tinklers-charts-and-stories',
    previewUrl: 'https://librairiesanstitre.com/cdn/shop/files/636bc9c0-4148-4ce7-b2f9-07b859b91e39.jpg?v=1778689068&width=1445',
    previewStatus: 'Public JPG of actual interior spread; not an editable source or reuse license',
    typefaces: [
      { name: 'Original facsimile handwriting/typewriter lettering', status: 'CHECK' },
      { name: 'Original modern typesetting font unidentified', status: 'CHECK' },
      { name: 'Noto Serif CJK KR', status: 'SUBSTITUTE' }
    ],
    palette: 'White softcover, colored papers in alternating sections, monochrome hand-drawn illustrations and black type',
    layoutNotes: 'Five source publications unified in size and production, separated by minimal title pages and changing colored sheets; hand-written illustrated narratives alternate with typed blocks; exact margins and leading not published',
    editorialIdea: 'Combine five small text-and-illustration sequences using shared title-page rules and controlled paper/color section rhythm',
    rights: { layout: 'ADAPT', font: 'CHECK', images: 'NO', text: 'NO' }
  },
  {
    id: 'how-to-do-things-with-valie-export',
    title: 'How to Do Things with VALIE EXPORT',
    publisher: 'Spector Books',
    designer: 'Malin Gewinner',
    year: 2025,
    module: 'MULTI_COLUMN_REFERENCE_GRID',
    tags: ['문화예술', '글이미지50_50', '그리드형', '이미지인터루드', '내지'],
    evidence: 'Die Schönsten Deutschen Bücher 2026 — Stiftung Buchkunst',
    officialUrl: 'https://www.stiftung-buchkunst.de/die-schoensten-deutschen-buecher/die-praemierten/how-to-do-things-with-valie-export/?view=list&year=2026',
    galleryUrl: 'https://www.spectorbooks.com/de/buch/how-to-do-things-with-valie-export-de',
    previewUrl: 'https://www.spectorbooks.com/f/bookgallery/89b1293a84.jpg',
    previewStatus: 'Publisher JPG of actual spread; public preview only, not editable source or reuse license',
    dimensionsMm: [227, 276],
    pageCount: 240,
    isbn: '978-3-95905-890-2',
    specificationNote: 'Award source lists thread-sewn hardcover; publisher lists softcover. Verify actual edition before manufacturing.',
    typefaces: [
      { name: 'EK Modena Heavy Italic', status: 'CHECK', source: 'https://erkinkaramemet.com/' },
      { name: 'Intra Regular Dots', status: 'CHECK' },
      { name: 'Periodica Light/Regular/Italic', status: 'CHECK' },
      { name: 'Noto Sans CJK KR', status: 'SUBSTITUTE', source: 'https://notofonts.github.io/noto-docs/website/use/' }
    ],
    palette: 'Black and white typography, black-and-white film stills, sparing color images',
    layoutNotes: 'Dense multi-column serif body; film-strip-like rounded image corners, large typographic chapter openers, unusual folio system; exact margins and leading unpublished',
    editorialIdea: 'Use repeatable title–essay–image–caption page roles in interview or culture books; avoid copying dense typesetting into small-format reading pages',
    rights: { layout: 'ADAPT', font: 'CHECK', images: 'NO', text: 'NO' }
  },
  {
    id: 'wald-ohne-baeume',
    title: 'Wald ohne Bäume',
    publisher: 'Carlsen Verlag',
    designer: 'Hanna Harms',
    year: 2026,
    module: 'TECHNICAL_ILLUSTRATION_GRID',
    tags: ['문화예술', '짧은글', '여백형', '그리드형', '내지'],
    evidence: 'Die Schönsten Deutschen Bücher 2026 — Stiftung Buchkunst',
    officialUrl: 'https://www.stiftung-buchkunst.de/die-schoensten-deutschen-buecher/die-praemierten/wald-ohne-baeume/?view=list&year=2026',
    galleryUrl: 'https://www.carlsen.de/hardcover/wald-ohne-baume/978-3-551-80448-8',
    previewUrl: 'https://www.carlsen.de/sites/default/files/styles/s_265_auto/public/produkt/innenansicht/wald-ohne-baume_6.jpg?itok=fHOe2RAF',
    previewStatus: 'Small publisher JPG of actual spread; public preview only, not editable source or reuse license',
    dimensionsMm: [173, 245],
    pageCount: 192,
    isbn: '978-3-551-80448-8',
    specificationNote: 'Publisher 173×245mm; award page rounds to 170×240mm. Confirm physical trim before production.',
    typefaces: [
      { name: 'Futura Std', status: 'CHECK' },
      { name: 'Gotham Book', status: 'CHECK' },
      { name: 'Hanna Harms hand lettering', status: 'CHECK' },
      { name: 'Noto Sans CJK KR', status: 'SUBSTITUTE', source: 'https://notofonts.github.io/noto-docs/website/use/' }
    ],
    palette: 'Warm white, black, gray, muted green and orange; color principles adaptable',
    layoutNotes: 'Short explanatory text near diagrams, large negative space, varied widths according to graphic roles; clear infographics and illustration-based page rhythm; exact leading and margins unpublished',
    editorialIdea: 'Turn short nonfiction into a coherent sequence of thesis, concise explanation and informative diagram; never inflate page count with decorative filler',
    rights: { layout: 'ADAPT', font: 'CHECK', images: 'NO', text: 'NO' }
  },
  {
    id: 'taxi-nach-leipzig',
    title: 'Taxi nach Leipzig: Die Stadt als Spielfeld',
    author: 'Gunnar Volkmann',
    publisher: 'M BOOKS',
    designer: 'Copa-Ipa',
    photographer: 'Christian Rothe',
    year: 2025,
    dimensionsMm: [120, 180],
    pageCount: 416,
    module: 'DENSITY_SWITCH',
    tags: ['에세이', '문화예술', '그리드형', '이미지인터루드', '내지'],
    evidence: 'Die Schönsten Deutschen Bücher 2026 — Stiftung Buchkunst, official jury report',
    officialUrl: 'https://www.stiftung-buchkunst.de/die-schoensten-deutschen-buecher/die-praemierten/taxi-nach-leipzig/?view=list&year=2026',
    galleryUrl: 'https://www.stiftung-buchkunst.de/die-schoensten-deutschen-buecher/die-praemierten/taxi-nach-leipzig/?view=list&year=2026',
    previewUrl: null,
    previewStatus: 'Official award page and cover listing verified; individual interior JPG/PDF direct link not verified; no editable source',
    typefaces: [
      { name: 'Rosart', status: 'CHECK', source: 'https://camelot-typefaces.com/rosart' },
      { name: 'Monument Grotesk', status: 'CHECK', source: 'https://abcdinamo.com/typefaces/monument-grotesk' },
      { name: 'Noto Serif KR', status: 'SUBSTITUTE', source: 'https://github.com/notofonts/noto-cjk' }
    ],
    palette: 'Black-and-white photographs and body text, sparing red chapter separators and emphasis; general color system ADAPT',
    layoutNotes: 'Compact 120x180mm portrait, carefully set text, repeated red chapter separators, two typefaces, alternating monochrome images including full spreads; exact margins and leading unpublished',
    editorialIdea: 'For long essay or travel nonfiction, retain one reading grid, insert monochrome images at measured intervals, and use restrained chapter color as navigational pause',
    rights: { layout: 'ADAPT', font: 'CHECK', images: 'NO', text: 'NO' }
  },
  {
    id: 'chien-fou-selected-writings',
    title: 'Chien fou: Selected Writings',
    author: 'Germaine Krull',
    editor: 'Kerstin Meincke, Petra Steinhardt',
    publisher: 'MACK / Museum Folkwang',
    designer: 'Helmut Völter',
    year: 2025,
    dimensionsMm: [165, 240],
    dimensionsNote: 'Stiftung Buchkunst 165x240mm; MACK publisher lists 170x240mm',
    pageCount: 320,
    pageCountNote: 'Stiftung jury lists German 320 and English/French 288; MACK lists 320 for its English product. Verify edition before production use.',
    module: 'MARGIN_NOTE_GRID',
    tags: ['회고', '에세이', '문화예술', '여백형', '이미지인터루드', '내지'],
    evidence: 'Die Schönsten Deutschen Bücher 2026 — Stiftung Buchkunst, official jury report',
    officialUrl: 'https://www.stiftung-buchkunst.de/die-schoensten-deutschen-buecher/die-praemierten/chien-fou/?view=list&year=2026',
    galleryUrl: 'https://mackbooks.co.uk/products/chien-fou-selected-writings-germaine-krull',
    previewUrl: null,
    previewStatus: 'Publisher product page publicly viewable; direct individual JPG/PDF not confirmed; editable originals not provided',
    typefaces: [
      { name: 'Martina Plantijn Regular/Italic', status: 'CHECK', source: 'https://klim.co.nz/fonts/martina-plantijn/' },
      { name: 'Neutral Regular/Italic', status: 'CHECK', source: 'https://www.typotheque.com/fonts/neutral' },
      { name: 'Noto Serif KR', status: 'SUBSTITUTE', source: 'https://github.com/notofonts/noto-cjk' }
    ],
    palette: 'Distinctive cover colors per language edition; monochrome archive images and partial/full color fields',
    layoutNotes: 'Readable text-led memoir/reportage with small monochrome archival images on uncoated paper; controlled colored fields and edition-wide visual system; exact leading, margins and image ratio unpublished',
    editorialIdea: 'Long memoir: establish body-text rhythm first, then insert documentary images in a few consistent sizes; use one restrained color system to differentiate sections or editions',
    rights: { layout: 'ADAPT', font: 'CHECK', images: 'NO', text: 'NO' }
  },
  {
    id: 'oskar-fiala-prinzip-der-kleinsten-wirkung',
    title: 'Oskar Fiala und das Prinzip der kleinsten Wirkung',
    author: 'Oswald Egger',
    publisher: 'Suhrkamp Verlag',
    designer: 'Oswald Egger (interior); Oswald Egger and Nina Knapitsch (cover)',
    year: 2025,
    dimensionsMm: [135, 215],
    dimensionsNote: 'Stiftung Buchkunst 135x215mm; publisher product page lists approximately 142x221mm',
    pageCount: 208,
    module: 'SINGLE_STRONG_RULE',
    tags: ['짧은글', '에세이', '회고', '여백형', '내지', '표지'],
    evidence: 'Die Schönsten Deutschen Bücher 2026 — Stiftung Buchkunst, official jury report',
    officialUrl: 'https://www.stiftung-buchkunst.de/die-schoensten-deutschen-buecher/die-praemierten/oskar-fiala-und-das-prinzip-der-kleinsten-wirkung/?view=list&year=2026',
    galleryUrl: 'https://www.suhrkamp.de/buch/oswald-egger-oskar-fiala-und-das-prinzip-der-kleinsten-wirkung-t-9783518432501',
    previewUrl: null,
    previewStatus: 'Publisher offers a reading sample entry; a directly accessible interior JPG/PDF URL was not confirmed; no editable source',
    typefaces: [
      { name: 'Stempel Garamond', status: 'CHECK', source: 'https://www.myfonts.com/collections/stempel-garamond-lt-font-linotype/' },
      { name: 'Noto Serif KR', status: 'SUBSTITUTE', source: 'https://github.com/notofonts/noto-cjk' }
    ],
    palette: 'Black/white body with sparse line-grid vignettes; contrasting front and back endpaper colors; moire cover (do not copy artwork)',
    layoutNotes: 'Book-to-type-area proportion praised by jury; interlocking grid vignettes preface paragraphs as breathing spaces; sparse illustrations and deliberate endpaper color difference; exact text block and leading unpublished',
    editorialIdea: 'For 150–220pp poetic prose, use a consistent serif reading grid with one restrained recurring chapter/paragraph motif instead of filler images or enlarged text',
    rights: { layout: 'ADAPT', font: 'CHECK', images: 'NO', text: 'NO' }
  },
  {
    id: 'haesslichkeit-moshtari-hilal',
    title: 'Hässlichkeit',
    author: 'Moshtari Hilal',
    publisher: 'Carl Hanser Verlag',
    designer: 'Moshtari Hilal; Iris Kochinka (interior typography); Peter-Andreas Hassiepen (cover)',
    year: 2023,
    isbn: '9783446276826',
    dimensionsMm: [125, 205],
    pageCount: 224,
    module: 'DENSITY_SWITCH',
    tags: ['에세이', '회고', '이미지인터루드', '여백형', '내지'],
    evidence: 'Die Schönsten Deutschen Bücher 2024 — Stiftung Buchkunst, official jury critique and production specifications',
    officialUrl: 'https://www.stiftung-buchkunst.de/die-schoensten-deutschen-buecher/die-praemierten/haesslichkeit/',
    galleryUrl: 'https://ciao-miao.de/produkt/moshtari-hilal-haesslichkeit-2/',
    previewUrl: null,
    previewStatus: 'Gallery is for the 2026 paperback edition, not the award-winning 2023 hardcover; original hardcover direct JPG/PDF not verified; editable original not available',
    typefaces: [
      { name: 'Sabon Next LT Pro', status: 'CHECK', source: 'https://www.myfonts.com/collections/sabon-next-font-linotype/' },
      { name: 'Effra Bold', status: 'CHECK', source: 'https://www.daltonmaag.com/font-library/effra.html' },
      { name: 'Noto Serif KR', status: 'SUBSTITUTE', source: 'https://github.com/notofonts/noto-cjk' }
    ],
    palette: 'Black-and-white archival imagery with muted flesh/powder tones across cover, endpapers and section dividers; general palette ADAPT',
    layoutNotes: 'Readable serif-led essays alternate with memoir fragments, artist drawings, collage and historical image quotations. Consistent colored chapter separators. Exact body width, leading and image area ratio unpublished.',
    editorialIdea: 'For a 200-page essay collection, fix one body typeface and one chapter color; classify source images and memoir fragments into repeatable modules.',
    rights: { layout: 'ADAPT', font: 'CHECK', images: 'NO', text: 'NO' }
  },
  {
    id: 'sabina-rekonstruktion-einer-recherche',
    title: 'Sabina, Rekonstruktion einer Recherche',
    author: 'Wiebke Elzel',
    publisher: 'Textem Verlag',
    designer: 'arc / Timo Grimberg',
    year: 2023,
    isbn: '9783864852909',
    dimensionsMm: [164, 235],
    pageCount: 416,
    module: 'ARCHIVE_VS_PRESENT',
    tags: ['문화예술', '회고', '그리드형', '이미지인터루드', '내지'],
    evidence: 'Die Schönsten Deutschen Bücher 2024 — Stiftung Buchkunst, official jury critique and specifications',
    officialUrl: 'https://www.stiftung-buchkunst.de/die-schoensten-deutschen-buecher/die-praemierten/sabina-rekonstruktion-einer-recherche/?view=grid&year=2024',
    galleryUrl: 'https://www.wiebke-elzel.de/en/publication/sabina-rekonstruktion-einer-recherche-reconstructing-a-research/',
    previewUrl: null,
    previewStatus: 'Artist-hosted gallery of original published edition; stable direct JPG URL not verified; not editable production source',
    imageCount: 194,
    typefaces: [
      { name: 'ABC Monument Grotesk', status: 'CHECK', source: 'https://abcdinamo.com/typefaces/monument-grotesk' },
      { name: 'Suisse Works', status: 'CHECK', source: 'https://www.swisstypefaces.com/fonts/suisse/' },
      { name: 'Colonna MT', status: 'CHECK' },
      { name: 'Graebenbach', status: 'CHECK' },
      { name: 'Rosart', status: 'CHECK' },
      { name: 'Noto Serif KR / Noto Sans KR', status: 'SUBSTITUTE', source: 'https://github.com/notofonts/noto-cjk' }
    ],
    palette: 'Emerald green, white, black; green chapter-opening and secondary notebook text; general palette ADAPT',
    layoutNotes: 'Two typographic narrative levels: larger black serif for investigation, smaller green sans for notebook excerpts; meticulously reproduced archival imagery and green section openers. Exact margins, leading and image/text area ratio unpublished.',
    editorialIdea: 'Separate a long memoir or archival biography into primary narrative, quotations, photographs and captions; use no more than two font families for Korean adaptation.',
    rights: { layout: 'ADAPT', font: 'CHECK', images: 'NO', text: 'NO' }
  },
  {
    id: 'fukt-17-the-words-issue',
    title: 'Fukt No. 17 — The Words Issue: Written Drawings',
    publisher: 'Fukt Magazine',
    designer: 'Ariane Spanier',
    year: 2018,
    isbn: '9783982009803',
    dimensionsMm: [165, 230],
    pageCount: 224,
    module: 'REPEATABLE_CARD',
    tags: ['문화예술', '짧은글', '인터뷰', '그리드형', '내지'],
    evidence: 'MarkLives design review (2018-10-19) specifically praised the cover design; official designer portfolio includes actual spreads',
    officialUrl: 'https://www.marklives.com/2018/10/media-design-edgar-fukt-time-cosmo-india-wall-sheet-journal/',
    galleryUrl: 'https://www.arianespanier.com/fukt-no-17-the-words-issue-written-drawings',
    previewUrl: 'https://images.squarespace-cdn.com/content/v1/59ce1fee7131a576a1b0cbe8/1541968754198-O5M4CP818MJ42Q3KQLEI/FUKT17_SPREADS_0009_Ebene-6.jpg',
    previewStatus: 'Direct published-spread JPG opened; public preview only, not editable original or reuse licence',
    typefaces: [
      { name: 'Original fonts unidentified', status: 'CHECK' },
      { name: 'Noto Sans KR', status: 'SUBSTITUTE', source: 'https://github.com/notofonts/noto-cjk' }
    ],
    palette: 'Predominantly black ink on white pages; varied artwork; color and general layout principles ADAPT',
    layoutNotes: 'Editorial magazine with artist interviews and word-based drawing. White space and controlled spread boundaries frame variable lettering and visual work. Exact text widths, leading, font families and image area ratios not verified.',
    editorialIdea: 'For short text and illustrated cultural essays, rotate a limited set of page modules (interview, image, short prose, full-page typographic work) without copying artists’ works.',
    rights: { layout: 'ADAPT', font: 'CHECK', images: 'NO', text: 'NO' }
  },
  {
    id: 'words-rather-than-pictures',
    title: 'Words Rather than Pictures',
    author: 'John Baldessari (text excerpts)',
    publisher: 'Optimo, Genève',
    designer: 'Studio Optimo — Gilles Gavillet, Joana Siniavskaja',
    year: 2025,
    dimensionsMm: null,
    pageCount: 48,
    module: 'SINGLE_STRONG_RULE',
    tags: ['짧은글', '문화예술', '여백형', '표지', '내지'],
    evidence: 'The Most Beautiful Swiss Books 2025 (awarded 2026); Swiss Federal Office of Culture, jury commentary published 2026-05-13',
    officialUrl: 'https://www.schweizerkulturpreise.ch/en/words-rather-than-pictures-en',
    galleryUrl: 'https://www.schweizerkulturpreise.ch/en/words-rather-than-pictures-en',
    previewUrl: null,
    previewStatus: 'Official award gallery contains photographs of actual printed spreads; individual direct JPG not independently verified; no editable source or reuse licence verified',
    typefaces: [
      { name: 'SuperScotch (François Rappo)', status: 'CHECK', note: 'Original typeface identified in official jury commentary; commercial printing, PDF and EPUB rights not independently verified' },
      { name: 'Noto Serif CJK KR', status: 'SUBSTITUTE', source: 'https://github.com/notofonts/noto-cjk', note: 'OFL 1.1: permitted for commercial print subject to licence conditions' }
    ],
    palette: 'Strong black ink with varying paper whites and warm paper tones; restrained visual palette (ADAPT)',
    layoutNotes: '48-page large-format letterpress type specimen. Excerpts from John Baldessari books, widely varying type sizes and text placements; unified through a single type family and controlled black ink. Six paper stocks; exact trim size, body measure, leading and grid not verified. This is not a standard long-form reading model.',
    editorialIdea: 'Use one consistent type family and a few carefully scaled text treatments for section openers or short quotations; retain conventional readable body settings in Korean editions.',
    rights: { layout: 'ADAPT', font: 'CHECK', images: 'NO', text: 'NO' }
  },
  {
    id: 'florian-graf-school-models',
    title: 'Florian Graf. School Models',
    author: 'Various; edited by Florian Graf',
    publisher: 'Scheidegger & Spiess',
    designer: 'A Language — Martin Stoecklin, Melina Wilson',
    year: 2025,
    dimensionsMm: [195, 290],
    pageCount: 132,
    module: 'SECTION_OPENER',
    tags: ['문화예술', '그리드형', '이미지인터루드', '내지'],
    evidence: 'The Most Beautiful Swiss Books 2025 (awarded 2026); Swiss Federal Office of Culture, jury commentary published 2026-05-13',
    officialUrl: 'https://www.schweizerkulturpreise.ch/en/school-model-en',
    galleryUrl: 'https://www.schweizerkulturpreise.ch/en/school-model-en',
    previewUrl: null,
    previewStatus: 'Official award gallery contains photographs of printed cover and interior. No direct JPG or editable original independently verified.',
    typefaces: [
      { name: 'Original typeface families unidentified', status: 'CHECK' },
      { name: 'Noto Sans CJK KR', status: 'SUBSTITUTE', source: 'https://github.com/notofonts/noto-cjk', note: 'OFL 1.1: commercial print permitted subject to licence conditions' }
    ],
    palette: 'White, vivid green and salmon pink; color-coding by language (ADAPT)',
    layoutNotes: 'Bilingual texts: German in green, English in salmon; occasional headings aligned with edge-positioned contents information. Image essays document art production and use. Hardcover has extended edges with visible table of contents. Published page counts vary by distributor (128 vs 132); 132 cited by UChicago Press distribution listing. Image count around 87, so use as a selective color-coded editorial reference, not a model for text-dominant books.',
    editorialIdea: 'For interview collections or bilingual cultural essays, assign a restrained consistent color to each language or text role; preserve readable type and conventional margins rather than copying protruding covers.',
    rights: { layout: 'ADAPT', font: 'CHECK', images: 'NO', text: 'NO' }
  },
  {
    id: 'ein-recht-grosses-stueck-himmel',
    title: 'Ein recht großes Stück Himmel',
    author: 'Fanti Baum, Heike Schuppelius, Marc Ries and HfG Offenbach students',
    publisher: 'Hochschule für Gestaltung Offenbach',
    designer: 'Bruno Jacoby, Lukas Marstaller',
    year: 2026,
    dimensionsMm: [120, 180],
    pageCount: 444,
    module: 'DENSITY_SWITCH',
    tags: ['에세이', '짧은글', '여백형', '이미지인터루드', '내지'],
    evidence: 'Die Schönsten Deutschen Bücher 2026; Stiftung Buchkunst official jury commentary and production specification',
    officialUrl: 'https://www.stiftung-buchkunst.de/die-schoensten-deutschen-buecher/die-praemierten/ein-recht-grosses-stueck-himmel/?view=grid&year=2026',
    galleryUrl: 'https://www.designforschung.org/2026/06/23/quite-a-large-piece-of-sky',
    previewUrl: null,
    previewStatus: 'Official university and design research pages show photographs; verified direct JPG/PDF interior download not established; editable originals unavailable',
    typefaces: [
      { name: 'Times New Roman Bold', status: 'CHECK', note: 'Identified by official jury specification; confirm desktop print and embedding rights for installed version' },
      { name: 'Noto Serif CJK KR', status: 'SUBSTITUTE', source: 'https://github.com/notofonts/noto-cjk', note: 'OFL 1.1 terms apply' }
    ],
    palette: 'Black text, white/uncoated stock, Cherry, Baby Blue, Pistachio, Spring Green and Light Blue divider sheets; general palette ADAPT',
    layoutNotes: 'Compact 120×180 mm, 444 pages. Greek and German observations/essays balanced typographically; restrained layouts, photo sequences and blank colored sheets regulate pacing. Exact margins, body measure, line spacing and text/image proportion unpublished.',
    editorialIdea: 'For short essays or travel notes, alternate stable reading pages, documentary image sequences and restrained section separators; translate color-sheet rhythm into standard single-stock POD when cost-sensitive.',
    rights: { layout: 'ADAPT', font: 'CHECK', images: 'NO', text: 'NO' }
  },
  {
    id: 'suche-nach-dem-unbestimmten',
    title: 'Suche nach dem Unbestimmten',
    author: 'Steffen Kunkel',
    publisher: 'Spector Books',
    designer: 'Markus Dreßen',
    year: 2026,
    dimensionsMm: [230, 330],
    pageCount: 384,
    module: 'MARGIN_NOTE_GRID',
    tags: ['문화예술', '그리드형', '이미지인터루드', '내지'],
    evidence: 'Die Schönsten Deutschen Bücher 2026; Stiftung Buchkunst official jury commentary and specification',
    officialUrl: 'https://www.stiftung-buchkunst.de/die-schoensten-deutschen-buecher/die-praemierten/suche-nach-dem-unbestimmten/?view=grid&year=2026',
    galleryUrl: 'https://www.spectorbooks.com/book/steffen-kunkel-suche-nach-dem-unbestimmten',
    previewUrl: null,
    previewStatus: 'Publisher gallery exposes printed interior previews; direct JPG/PDF and editable source not independently verified',
    typefaces: [
      { name: 'Agipo Bold (RP Digital Type Foundry)', status: 'CHECK', note: 'Official title face; commercial desktop and embedding rights require verification' },
      { name: 'Syncro Book / Syncro Italic (Out of the Dark)', status: 'CHECK', note: 'Official body faces; commercial desktop and embedding rights require verification' },
      { name: 'Noto Serif CJK KR', status: 'SUBSTITUTE', source: 'https://github.com/notofonts/noto-cjk', note: 'OFL 1.1 terms apply' }
    ],
    palette: 'Matte uncoated white stock, monochrome typography, archival greyscale and selected color images; general palette ADAPT',
    layoutNotes: '230×330 mm, 384 pp. Historical photographs, architectural plans and text use cross-references; page numbers centered in lower margin. Serif body with sans title/metadata, tight but legible leading. Exact grid, text width and image ratio unpublished.',
    editorialIdea: 'Use fixed body, image, caption and source-number positions in memoirs with archives; reserve centered folios and cross-reference keys, but avoid expensive linen binding and large trim for routine POD.',
    rights: { layout: 'ADAPT', font: 'CHECK', images: 'NO', text: 'NO' }
  },
  {
    id: 'flametti-dandyism-of-the-poor',
    title: 'Flametti, or the Dandyism of the Poor',
    author: 'Hugo Ball; translated and read by Catherine Schelbert',
    publisher: 'edition fink / Fucking Good Art',
    designer: 'Nienke Terpsma',
    year: 2024,
    dimensionsMm: [110, 180],
    pageCount: 196,
    module: 'SINGLE_STRONG_RULE',
    tags: ['에세이', '짧은글', '여백형', '표지', '내지'],
    evidence: 'The Most Beautiful Swiss Books 2024 (awarded 2025); Swiss Federal Office of Culture jury review published 2025-06-13',
    officialUrl: 'https://www.schweizerkulturpreise.ch/en/flametti-or-the-dandyism-of-the-poor-translated-and-read-by-catherine-schelber-4',
    galleryUrl: 'https://www.schweizerkulturpreise.ch/en/flametti-or-the-dandyism-of-the-poor-translated-and-read-by-catherine-schelber-4',
    previewUrl: null,
    previewStatus: 'Official jury gallery shows actual book and accompanying vinyl; direct JPG/PDF and editable originals not verified. Some retailers list 208 pages; book publisher listing specifies 196.',
    typefaces: [
      { name: 'Original serif typeface (family not disclosed)', status: 'CHECK' },
      { name: 'Noto Serif CJK KR', status: 'SUBSTITUTE', source: 'https://github.com/notofonts/noto-cjk', note: 'OFL 1.1 terms apply' }
    ],
    palette: 'Red/yellow dust jacket, record sleeve and insert in intentionally varied yellows; general color relationships ADAPT',
    layoutNotes: 'Small 110×180 mm prose paperback, around 196 pp, dust jacket and 10-inch LP. Repeated serif typography and red/yellow accents connect mismatched media; exact body measure, leading, margins and text/image proportion not published.',
    editorialIdea: 'Maintain a restrained readable text block and connect the book to optional audio via QR code; adapt cross-media color and type consistency without replicating the vinyl package or QR placement.',
    rights: { layout: 'ADAPT', font: 'CHECK', images: 'NO', text: 'NO' }
  },
  {
    id: 'on-the-edges-of-graphic-design-a-z-infinity',
    title: 'On the Edges of Graphic Design from A—Z—∞',
    author: 'Anja Lutz; edited by Anja Lutz and Soraya Guimarães Hoepfner',
    publisher: "Set Margins' publications",
    designer: 'Anja Lutz',
    year: 2025,
    dimensionsMm: [120, 165],
    pageCount: 548,
    module: 'REPEATABLE_CARD',
    tags: ['짧은글', '문화예술', '그리드형', '이미지인터루드', '내지'],
    evidence: 'AIGA 50 Books | 50 Covers 2025 Book winner (announced August 2026); AIGA official winners gallery and official AIGA announcement naming Anja Lutz; PAGE magazine design review (2026-08-07). Published 2025-09-27.',
    officialUrl: 'https://50books50covers.secure-platform.com/a/gallery?roundId=417',
    awardEvidenceUrl: 'https://www.linkedin.com/posts/aiga_aiga-50-books-50-covers-2025-winner-gallery-activity-7492603365323964416-i_Or',
    galleryUrl: 'https://www.setmargins.press/books/on-the-edges-of-graphic-design-from-a-z-%E2%88%9E/',
    interiorGalleryUrl: 'https://www.printmag.com/daily-heller/the-daily-heller-anja-lutz/',
    previewUrl: null,
    previewStatus: 'Publisher project page and PRINT magazine feature contain book photographs; direct public interior JPG/PNG/PDF and editable original not independently verified. Relative specimen PDF is a type specimen, NOT a book interior.',
    typefaces: [
      { name: 'Relative (Colophon Foundry)', status: 'CHECK', source: 'https://a.storyblok.com/f/146262/x/3da0a12f8d/relative-specimen-v2-002.pdf', note: 'Publisher explicitly identifies Relative. Desktop DTP license described in foundry specimen; verify current Monotype license and PDF/EPUB embedding terms.' },
      { name: 'Noto Sans CJK KR', status: 'SUBSTITUTE', source: 'https://github.com/notofonts/noto-cjk', note: 'SIL OFL 1.1; commercial print allowed under license terms.' }
    ],
    palette: 'Yellow and silver book sections with black type, varied full-color images; general color relationships ADAPT.',
    layoutNotes: '120×165 mm, 548 pp, over 100 alphabetically indexed cross-referenced short entries followed by 36 future-facing contributions; 500 color and 24 B&W images per publisher. Small format and modular text/image sequencing unify many contributors. Exact body measure, leading, margins and image-to-text area ratio not independently measured.',
    editorialIdea: 'For many short essays or community contributions, use repeatable entry templates: keyword, 1–3 paragraphs, optional image, cross-reference and consistent folio. Group sections by limited accent colors; do not reproduce expensive Swiss binding as a default POD specification.',
    rights: { layout: 'ADAPT', palette: 'ADAPT', font: 'CHECK', substituteFont: 'USE', images: 'NO', text: 'NO' }
  },
  {
    id: 'making-of-modern-korean-art-letters',
    title: 'The Making of Modern Korean Art: The Letters of Kim Tschang-Yeul, Kim Whanki, Lee Ufan, and Park Seo-Bo, 1961–1982',
    author: 'Edited by Yeon Shim Chung and Doryun Chong; essay by Kyung An',
    publisher: 'Gregory R. Miller & Co. / Tina Kim Gallery',
    designer: 'Studio Lin',
    year: 2025,
    dimensionsMm: [247, 323],
    pageCount: 336,
    module: 'ARCHIVE_VS_PRESENT',
    tags: ['회고', '문화예술', '한글조판', '그리드형', '이미지인터루드', '내지'],
    evidence: 'AIGA 50 Books | 50 Covers 2025 Book winner (announced August 2026); official AIGA winners gallery. Gallery/publisher confirms published 2025. Distributor states 336 pp, commissioning gallery lists 338 pp: edition/metadata discrepancy.',
    officialUrl: 'https://50books50covers.secure-platform.com/a/gallery?roundId=417',
    galleryUrl: 'https://tinakimgallery.com/store/products/25-the-making-of-modern-korean-art-the-letters-of-kim-tschang-yeul-kim-whanki-lee/',
    interiorGalleryUrl: 'https://news.artnet.com/art-world/modern-korean-art-book-exhibition-2653829',
    previewUrl: null,
    previewStatus: 'Artnet (2025-06-06) displays a verified photograph of the opened printed book with fold-out facsimile letters, credited to Studio Lin. Individual JPG/PDF direct download and editable production source not independently verified. Tina Kim Gallery says 338 pages, D.A.P. says 336.',
    typefaces: [
      { name: 'Original Latin/Korean typeface families (not disclosed)', status: 'CHECK', note: 'No reliable family names in the verified publisher/AIGA information; do not infer.' },
      { name: 'Noto Serif CJK KR', status: 'SUBSTITUTE', source: 'https://github.com/notofonts/noto-cjk', note: 'SIL OFL 1.1; commercial print allowed under license terms.' },
      { name: 'Noto Sans CJK KR', status: 'SUBSTITUTE', source: 'https://github.com/notofonts/noto-cjk', note: 'SIL OFL 1.1; use for captions and archival metadata.' }
    ],
    palette: 'Three verified cover variants: light blue, dark blue and gray; archival paper tones, monochrome handwritten letters and artworks. Palette ADAPT, source artwork/letters NO.',
    layoutNotes: 'Large approximately 247×323 mm hardcover, 336 pp per distributor (338 per commissioning gallery), 130 color illustrations. Actual-size facsimile reproductions of original Korean correspondence and selected fold-out archival material interleaved with contemporary essays/artworks. Exact body text width, leading, grid and image-area ratio not independently verified.',
    editorialIdea: 'For Korean memoirs, give handwritten letters or historic documents dedicated facsimile pages and clearly separated contemporary transcription, translation and commentary; use captions/source IDs and optional fold-outs only where printing costs and binding allow.',
    rights: { layout: 'ADAPT', palette: 'ADAPT', font: 'CHECK', substituteFont: 'USE', images: 'NO', text: 'NO', letters: 'CHECK' }
  },
{
  "id": "rhona-muehlebach-obstacles-for-cows",
  "title": "Rhona Mühlebach. Obstacles for Cows",
  "publisher": "Jungle Books",
  "designer": "Samuel Bänziger, Rosario Florio, Larissa Kasper",
  "year": 2023,
  "dimensionsMm": [
    257,
    364
  ],
  "pageCount": 100,
  "module": "PROGRESSIVE_TEXT",
  "tags": [
    "짧은글",
    "문화예술",
    "여백형",
    "이미지인터루드",
    "내지"
  ],
  "evidence": "The Most Beautiful Swiss Books 2023 (awarded 2024); Swiss Federal Office of Culture jury review and technical index, official catalogue pp. 28–29: 100 pp, 8 images, 257×364 mm, Helvetica Bold and Quadrant Mono.",
  "officialUrl": "https://www.schweizerkulturpreise.ch/en/rhona-muehlebach-obstacles-for-cows-4",
  "galleryUrl": "https://www.schweizerkulturpreise.ch/en/rhona-muehlebach-obstacles-for-cows-4",
  "publisherUrl": "https://www.jungle-books.com/products/obstacles-for-cows",
  "previewUrl": "https://www.schweizerkulturpreise.ch/dam/en/sd-web/SaBtNIDsBLcY/THE%20MOST%20BEAUTIFUL%20SWISS%20BOOKS%202023%20(awarded%202024).pdf",
  "previewStatus": "Verified public award catalogue PDF with printed-book photos and design specs on pp. 28–29; not an editable production file or a freely reusable book PDF. Individual direct JPG image URL not independently retrievable.",
  "typefaces": [
    {
      "name": "Helvetica Bold (Linotype)",
      "status": "CHECK",
      "note": "Original face verified in Swiss official catalogue; desktop and embedding licences must be checked."
    },
    {
      "name": "Quadrant Mono (Matter of Sorts)",
      "status": "CHECK",
      "note": "Original face verified in Swiss official catalogue; licensing needs verification."
    },
    {
      "name": "Noto Sans CJK KR",
      "status": "SUBSTITUTE",
      "source": "https://github.com/notofonts/noto-cjk",
      "note": "OFL 1.1 applies; usable for commercial print subject to licence terms."
    }
  ],
  "palette": "Cream/beige patterned cover, blue title, black essay text, occasional green-tinted stills; general palette ADAPT.",
  "layoutNotes": "Eight score-like chapters; large typographic dialogue and music notation, with running essay in a narrow outer-edge column on chapter openers. Each chapter includes one loose green-tinted still, 8 images across 100 pp. Exact leading, text width and page margins unpublished.",
  "editorialIdea": "For short essays and interview collections, make 6–8 modular chapters with stable narrow sidebar text and a separate single image per chapter. Substitute ordinary printed image pages for costly loose inserts; retain source text and verify permissions.",
  "rights": {
    "layout": "ADAPT",
    "palette": "ADAPT",
    "font": "CHECK",
    "substituteFont": "USE",
    "images": "NO",
    "text": "NO",
    "editableOriginal": "NO"
  }
},
{
  "id": "langfristperspektiven-archaeologischer-staetten",
  "title": "Langfristperspektiven archäologischer Stätten",
  "publisher": "Hirmer Verlag",
  "designer": "Hubertus Design — Kerstin Landis, Jonas Voegeli, Scott Vander Zee",
  "year": 2017,
  "dimensionsMm": [
    245,
    340
  ],
  "pageCount": 368,
  "module": "MULTI_COLUMN_REFERENCE_GRID",
  "tags": [
    "문화예술",
    "그리드형",
    "이미지인터루드",
    "여백형",
    "내지"
  ],
  "evidence": "The Most Beautiful Swiss Books 2017 (juried 2018); Swiss Federal Office of Culture official jury commentary on almost twenty essays and their carefully aligned two-column Sabon typography; published 2017.",
  "officialUrl": "https://www.schweizerkulturpreise.ch/en/langfristperspektiven-archaeologischer-staetten-3",
  "galleryUrl": "https://www.schweizerkulturpreise.ch/en/langfristperspektiven-archaeologischer-staetten-3",
  "previewUrl": null,
  "previewStatus": "Official Swiss award gallery includes photographs of the printed cover and spreads. No publicly accessible full interior PDF or editable production source independently verified. A university-hosted chapter PDF was access-blocked and is intentionally omitted.",
  "typefaces": [
    {
      "name": "Sabon (variant undisclosed)",
      "status": "CHECK",
      "note": "Swiss official jury identifies Sabon; exact vendor/weight and desktop/PDF/EPUB embedding licence not established."
    },
    {
      "name": "Noto Serif CJK KR",
      "status": "SUBSTITUTE",
      "source": "https://github.com/notofonts/noto-cjk",
      "note": "OFL 1.1 applies for Korean body substitute."
    },
    {
      "name": "Noto Sans CJK KR",
      "status": "SUBSTITUTE",
      "source": "https://github.com/notofonts/noto-cjk",
      "note": "OFL 1.1 applies for captions and notes."
    }
  ],
  "palette": "Restrained black text on light paper, colour-coded endpapers and selected archive images; general neutral palette ADAPT.",
  "layoutNotes": "Nearly twenty essays in two Sabon columns with centered uppercase chapter titles and generous leading. Separate uncoated illustration leaves carry 1–6 images with ample white space; embedded illustrations align exactly to a text column; reference markers and small footnotes form a disciplined grid. Approx 338 illustrations per distributor, 245×340 mm, 368 pp; exact text measure, line height and page-image ratio not published.",
  "editorialIdea": "For cultural nonfiction or memoir with archives, use two-column text only where the trim size supports it, align figures to column width, and isolate visual documents on spacious plates. On 140×210 mm books prefer single-column body plus occasional image interludes.",
  "rights": {
    "layout": "ADAPT",
    "palette": "ADAPT",
    "font": "CHECK",
    "substituteFont": "USE",
    "images": "NO",
    "text": "NO",
    "editableOriginal": "NO"
  }
},
{
  "id": "dear-aisha-can-i-have-a-minute",
  "title": "Dear Aisha, Volume 1. Can i have a minute of your time",
  "publisher": "Ligature Press",
  "designer": "Studio Mathias Clottu — Mathias Clottu",
  "year": 2021,
  "pageCountApprox": 150,
  "module": "PROGRESSIVE_TEXT",
  "tags": [
    "짧은글",
    "에세이",
    "여백형",
    "이미지인터루드",
    "내지"
  ],
  "evidence": "Swiss Federal Office of Culture: The Most Beautiful Swiss Books 2021 (awarded 2022). Jury describes ~150 pages of email correspondence with broad white space and small loose fake-ad inserts; precise, restrained design decisions. ISBN 978-0-578-80626-6.",
  "officialUrl": "https://www.schweizerkulturpreise.ch/en/dear-aisha-volume-1-can-i-have-a-minute-of-your-time-4",
  "galleryUrl": "https://www.schweizerkulturpreise.ch/en/dear-aisha-volume-1-can-i-have-a-minute-of-your-time-4",
  "previewStatus": "Official award-page photo gallery includes cover and interior; individual image URLs not independently verified. No public editable original or full book PDF confirmed.",
  "typefaces": [
    {
      "name": "Original calligraphic/serif text face (name not disclosed)",
      "status": "CHECK",
      "note": "Official jury mentions calligraphic script; no verified font family or license."
    },
    {
      "name": "Noto Serif CJK KR",
      "status": "SUBSTITUTE",
      "source": "https://github.com/notofonts/noto-cjk",
      "note": "SIL OFL 1.1, commercial print permitted subject to license terms."
    }
  ],
  "palette": "Beige hardcover, large white paper fields, occasional vivid multicolor advertisement slips; palette ADAPT.",
  "layoutNotes": "Epistolary/email exchanges, short message blocks on spacious pages; minimal decoration, wide white fields and occasional small colored loose inserts; specific baseline grid, text width, leading and trim dimensions not published. No claim of 50:50 image ratio.",
  "editorialIdea": "Short interview or letter-style books: give each exchange a clear typographic role, alternate brief message pages and generous white space, and place rare visual documents as deliberate interludes rather than padding. For affordable production, replace loose inserts with printed full/half pages. Keep original content unchanged.",
  "rights": {
    "layout": "ADAPT",
    "palette": "ADAPT",
    "font": "CHECK",
    "substituteFont": "USE",
    "images": "NO",
    "text": "NO",
    "editableOriginal": "NO"
  }
},
{
  "id": "swiss-graphic-design-histories",
  "title": "Swiss Graphic Design Histories",
  "publisher": "Scheidegger & Spiess",
  "designer": "Simone Farner, Naima Schalcher",
  "year": 2021,
  "dimensionsMm": [
    170,
    240
  ],
  "pageCount": 688,
  "module": "MARGIN_NOTE_GRID",
  "tags": [
    "인터뷰",
    "문화예술",
    "그리드형",
    "여백형",
    "이미지인터루드",
    "내지"
  ],
  "evidence": "Swiss Federal Office of Culture: The Most Beautiful Swiss Books 2021 (awarded 2022). Jury specifically praises shifting vertical title/text alignment, varying upper margins, keyword-based navigation, playful grids and careful image editing. Designer and editor sites state four volumes in slipcase, 17×24 cm, 688 pages; some distributor listings instead report 814 pages, so verify edition before production.",
  "officialUrl": "https://www.schweizerkulturpreise.ch/en/swiss-graphic-design-histories-4",
  "galleryUrl": "https://www.schweizerkulturpreise.ch/en/swiss-graphic-design-histories-4",
  "designerUrl": "https://www.farnerschalcher.ch/",
  "authorGalleryUrl": "https://www.davidefornari.eu/swiss-graphic-design-histories/",
  "openAccessInfoUrl": "https://www.davidefornari.eu/swiss-graphic-design-histories/",
  "previewStatus": "Official award and editor photo galleries available. Editor states Open Access under CC BY-NC-ND 4.0, which does not authorize commercial adaptation. Direct book PDF download endpoint and editable source were not independently confirmed.",
  "typefaces": [
    {
      "name": "Original print font (family not publicly verified)",
      "status": "CHECK",
      "note": "No reliable original typeface name or commercial license found in official jury/designer descriptions."
    },
    {
      "name": "Noto Sans CJK KR",
      "status": "SUBSTITUTE",
      "source": "https://github.com/notofonts/noto-cjk",
      "note": "SIL OFL 1.1, usable in commercial print with license compliance."
    },
    {
      "name": "Noto Serif CJK KR",
      "status": "SUBSTITUTE",
      "source": "https://github.com/notofonts/noto-cjk",
      "note": "SIL OFL 1.1, optional Korean reading face."
    }
  ],
  "palette": "White soft covers, small black typography and distinct accent title colors by volume; neutral interiors with archival image tones. General palette ADAPT.",
  "layoutNotes": "Three text-and-image volumes plus glossary/index booklet. Cover titles occupy different vertical positions; internal text areas align to corresponding heights, producing intentionally variable top whitespace. Keywords form a navigational grid. Image and essay sections vary in density. Exact type size, leading and grid measurements unpublished; image ratio not quantified.",
  "editorialIdea": "For essay/interview collections, assign a consistent keyword navigator, move the chapter opener's title height between thematic parts, and align the text block to that position while retaining a stable reading width. Give archival images separate spacious pages and an index; on 140×210 mm choose single-column body over forced multi-column layout.",
  "rights": {
    "layout": "ADAPT",
    "palette": "ADAPT",
    "font": "CHECK",
    "substituteFont": "USE",
    "images": "NO",
    "text": "NO",
    "editableOriginal": "NO",
    "openAccess": "CHECK — CC BY-NC-ND 4.0: attribution, noncommercial, no derivatives; verify third-party image rights."
  }
},
{
  "id": "sophie-taeuber-arp-briefe-1905-1942",
  "title": "Sophie Taeuber-Arp. Briefe 1905–1942",
  "publisher": "NIMBUS. Kunst und Bücher AG",
  "designer": "Hubertus Design — Kerstin Landis, Romy Strasser, Jonas Voegeli",
  "year": 2021,
  "pageCount": 1832,
  "volumes": 3,
  "imageCount": 100,
  "dimensionsMmApprox": [
    185,
    259
  ],
  "module": "ARCHIVE_VS_PRESENT",
  "tags": [
    "회고",
    "문화예술",
    "여백형",
    "이미지인터루드",
    "내지"
  ],
  "evidence": "Swiss Federal Office of Culture: The Most Beautiful Swiss Books 2021 (awarded 2022). Jury praises carefully restrained design of nearly 500 letters with scholarly annotations, photos inserted between letters and end-of-volume essays; orderly yet not monotonous. Publisher confirms 3 volumes, 1,832 pp, 100 illustrations, ISBN 978-3-03850-080-3.",
  "officialUrl": "https://www.schweizerkulturpreise.ch/en/sophie-taeuber-arp-briefe-1905-1942-4",
  "galleryUrl": "https://www.schweizerkulturpreise.ch/en/sophie-taeuber-arp-briefe-1905-1942-4",
  "publisherUrl": "https://www.nimbusbooks.ch/content/newsletter-42021-%E2%80%93-neues-aus-dem-verlag",
  "previewStatus": "Official award page has cover/interior photographs, not an editable production file. 185×259 mm approximate trade-listing dimensions (unconfirmed by publisher); do not treat as verified trim spec. No full public PDF independently verified.",
  "typefaces": [
    {
      "name": "Original body typeface (unpublished)",
      "status": "CHECK",
      "note": "No verified family or license in jury or publisher records."
    },
    {
      "name": "Noto Serif CJK KR",
      "status": "SUBSTITUTE",
      "source": "https://github.com/notofonts/noto-cjk",
      "note": "SIL OFL 1.1, commercial print use subject to license."
    },
    {
      "name": "Noto Sans CJK KR",
      "status": "SUBSTITUTE",
      "source": "https://github.com/notofonts/noto-cjk",
      "note": "For caption, date and archival notes; OFL 1.1."
    }
  ],
  "palette": "White half-linen volumes with restrained different-color cloth spines/covers; black text and neutral historical photographs; general palette ADAPT.",
  "layoutNotes": "Consistent letter blocks, scholarly notes and end essays across three volumes; photographs appear between letters, not at a fixed 50:50 ratio. Controlled hierarchy and repetition without monotony; exact body width, leading, margins and grid dimensions unpublished.",
  "editorialIdea": "For memoir and collected letters, establish three text levels (original letter / editor's context / source notes), add occasional photographs at narrative transitions, and separate interpretive essays at chapter ends. Maintain readable 1-column body and consistent date/sender metadata; protect manuscript and image captions from automatic rewriting.",
  "rights": {
    "layout": "ADAPT",
    "palette": "ADAPT",
    "font": "CHECK",
    "substituteFont": "USE",
    "images": "NO",
    "text": "NO",
    "editableOriginal": "NO"
  }
},
{
  "id": "les-deserteuses-johana-blanc",
  "title": "Les déserteuses",
  "publisher": "Éditions Clinamen",
  "designer": "Elorah Connil",
  "year": 2023,
  "dimensionsMm": [
    110,
    165
  ],
  "pageCount": 251,
  "imageCount": 0,
  "module": "SINGLE_STRONG_RULE",
  "tags": [
    "짧은글",
    "에세이",
    "문화예술",
    "여백형",
    "내지"
  ],
  "evidence": "Swiss Federal Office of Culture: The Most Beautiful Swiss Books 2023 (awarded 2024). Jury explicitly praises eight consistently designed chapters mixing letters, long quotations, art-historical explanations and fictional text, warm serif typography and a smaller loose erratum page. Official 2023 awards catalogue, pp. 22–23, records 251 pp, 0 images, 110×165 mm, Adobe Caslon Pro.",
  "officialUrl": "https://www.schweizerkulturpreise.ch/en/les-deserteuses-4",
  "galleryUrl": "https://www.schweizerkulturpreise.ch/en/les-deserteuses-4",
  "cataloguePdfUrl": "https://www.schweizerkulturpreise.ch/dam/en/sd-web/SaBtNIDsBLcY/THE%20MOST%20BEAUTIFUL%20SWISS%20BOOKS%202023%20%28awarded%202024%29.pdf",
  "publisherUrl": "https://editions-clinamen.com/en/",
  "previewStatus": "Official award page provides actual cover and interior photos. Official award catalogue PDF is a publicly viewable catalogue, not the complete book or an editable source. Publisher mentions a PDF download but the exact file link was not independently verified. No directly verified standalone JPG/PNG/PDF of the complete book.",
  "typefaces": [
    {
      "name": "Adobe Caslon Pro",
      "status": "CHECK",
      "source": "https://helpx.adobe.com/fonts/web/font-licensing/font-licensing.html",
      "note": "Exact original family verified in official awards catalogue. Adobe Fonts permits print and protected PDF embedding for licensed desktop work, but its license does NOT authorize embedding font software in an ooOS app or allowing customers to select the font in a generator; check actual font source and intended use."
    },
    {
      "name": "Noto Serif CJK KR",
      "status": "SUBSTITUTE",
      "source": "https://github.com/notofonts/noto-cjk/blob/main/Serif/LICENSE",
      "note": "SIL OFL 1.1; substitute for Korean running text, commercial print allowed with license compliance."
    }
  ],
  "palette": "Warm red-orange cover with dark lettering, cream/off-white paper, black serif text; occasional small ornamental marks. General palette ADAPT, do not reuse cover artwork.",
  "layoutNotes": "Eight consistently treated chapters, multiple text genres (letter, quotation, explanation, fictional prose) with stable typographic roles. Small 110×165 mm trim, deliberately sparse ornaments and one reduced-size loose erratum leaf create rhythm without photography. Precise baseline grid, body width, leading and margins not published; image count is officially zero, not 50:50.",
  "editorialIdea": "For compact Korean short-essay collections, keep a restrained one-column reading width and one serif body face, distinguish letters/quotations/notes with modest indentation and weight, and repeat chapter templates. An optional smaller inserted text page can become a normal inset page for economical production. Do not pad a short manuscript with unrelated photos.",
  "rights": {
    "layout": "ADAPT",
    "palette": "ADAPT",
    "font": "CHECK",
    "substituteFont": "USE",
    "images": "NO",
    "text": "NO",
    "editableOriginal": "NO"
  }
},
{
  "id": "journaux-de-guerre-1939-1944",
  "title": "Journaux de guerre, 1939–1944. Les compagnies de fusiliers II/22 et I/222 aux frontières jurassiennes",
  "publisher": "Société jurassienne d’émulation / Archives cantonales jurassiennes",
  "designer": "Dimitri Jeannottat",
  "year": 2023,
  "dimensionsMm": [
    150,
    220
  ],
  "pageCount": 720,
  "imageCount": 120,
  "module": "REPEATABLE_CARD",
  "tags": [
    "회고",
    "짧은글",
    "문화예술",
    "그리드형",
    "이미지인터루드",
    "내지"
  ],
  "evidence": "Swiss Federal Office of Culture: The Most Beautiful Swiss Books 2023 (awarded 2024). Jury specifically commends a grey hardcover/red cloth spine, over 600 diary pages on thin grey stock, white-paper introduction/commentary, uniform serif size with two weights and varying indents, plus occasional soldier drawings. Official catalogue pp. 20–21 gives 720 pp, 120 images, 150×220 mm, JJannon and Monument Grotesk Mono.",
  "officialUrl": "https://www.schweizerkulturpreise.ch/en/journaux-de-guerre-19391944-les-compagnies-de-fusiliers-ii22-et-i222-aux-frontieres-jurassiennes-4",
  "galleryUrl": "https://www.schweizerkulturpreise.ch/en/journaux-de-guerre-19391944-les-compagnies-de-fusiliers-ii22-et-i222-aux-frontieres-jurassiennes-4",
  "cataloguePdfUrl": "https://www.schweizerkulturpreise.ch/dam/en/sd-web/SaBtNIDsBLcY/THE%20MOST%20BEAUTIFUL%20SWISS%20BOOKS%202023%20%28awarded%202024%29.pdf",
  "previewStatus": "Official award gallery has cover/interior photos and official catalogue PDF has award spreads and technical specifications; neither is an editable original or verified complete-book PDF. Individual JPG endpoints were not independently verified.",
  "typefaces": [
    {
      "name": "JJannon (Optimo)",
      "status": "CHECK",
      "source": "https://optimo.ch/typefaces/jjannon",
      "note": "Original face confirmed by official award catalogue; commercial desktop/font embedding terms require purchased license and checking intended use."
    },
    {
      "name": "Monument Grotesk Mono (Dinamo)",
      "status": "CHECK",
      "source": "https://abcdinamo.com/typefaces/monument-grotesk",
      "note": "Original mono face confirmed; commercial font license and server/app use must be checked."
    },
    {
      "name": "Noto Serif CJK KR",
      "status": "SUBSTITUTE",
      "source": "https://github.com/notofonts/noto-cjk/blob/main/Serif/LICENSE",
      "note": "OFL 1.1 Korean running text substitute."
    },
    {
      "name": "Noto Sans CJK KR",
      "status": "SUBSTITUTE",
      "source": "https://github.com/notofonts/noto-cjk/blob/main/Sans/LICENSE",
      "note": "OFL 1.1 for dates, labels and captions; original mono character may need a separately licensed or open mono face."
    }
  ],
  "palette": "Grey cover, muted red clothback, gold-foil titling, white intro/endmatter, very thin grey diary stock, black text and monochrome drawings. General color strategy ADAPT; cloth and foil are optional physical production treatments.",
  "layoutNotes": "720-page diary; 600+ pages in repeated dated record format. Serif of constant size, two weights, varied indentation/tabbing for event chronology; irregular illustrations interrupt repetitive entries. Different paper tones distinguish original diary from editorial apparatus. Exact body measure, baseline grid, margins and leading not published; 120 images is a count, not a percentage of page area.",
  "editorialIdea": "For Korean memoirs, interview transcripts and meeting journals, use one repeatable date/time/text grid and stable body type, mark speakers and times with subtle weight/indent differences, place related drawings/photos near relevant entries, and distinguish archival original from editor commentary by background or section opener instead of duplicating expensive paper stocks.",
  "rights": {
    "layout": "ADAPT",
    "palette": "ADAPT",
    "font": "CHECK",
    "substituteFont": "USE",
    "images": "NO",
    "text": "NO",
    "editableOriginal": "NO"
  }
},
{
  "id": "die-entstehung-des-heutigen-menschen-giedion",
  "title": "Die Entstehung des heutigen Menschen. Ein unvollendetes Buchprojekt, 1929–1938",
  "publisher": "gta Verlag ETH Zürich",
  "designer": "Studio Krispin Heé — Krispin Heé, Tim Wetter",
  "year": 2023,
  "dimensionsMm": [
    170,
    242
  ],
  "pageCount": 666,
  "imageCount": 191,
  "module": "ARCHIVE_VS_PRESENT",
  "tags": [
    "문화예술",
    "그리드형",
    "이미지인터루드",
    "여백형",
    "내지"
  ],
  "evidence": "Swiss Federal Office of Culture: The Most Beautiful Swiss Books 2023 (awarded 2024), also a Bronze Medal at Stiftung Buchkunst international competition 2024. Jury praises three distinct text-status sections divided by heavy rough sheets, serif/sans hierarchy for footnotes and editorial notes, and three image groups distinguished by colored paper/backgrounds. Official catalogue pp. 14–15 gives 666 pp, 191 images, 170×242 mm, ABC Didotype and Times NR.",
  "officialUrl": "https://www.schweizerkulturpreise.ch/en/die-entstehung-des-heutigen-menschen-ein-unvollendetes-buchprojekt-1929-1938-4",
  "galleryUrl": "https://www.schweizerkulturpreise.ch/en/die-entstehung-des-heutigen-menschen-ein-unvollendetes-buchprojekt-1929-1938-4",
  "internationalAwardUrl": "https://www.schweizerkulturpreise.ch/de/siegfried-giedion-die-entstehung-des-heutigen-menschen",
  "cataloguePdfUrl": "https://www.schweizerkulturpreise.ch/dam/en/sd-web/SaBtNIDsBLcY/THE%20MOST%20BEAUTIFUL%20SWISS%20BOOKS%202023%20%28awarded%202024%29.pdf",
  "previewStatus": "Official Swiss award gallery has actual cover/interior photographs; official awards catalogue PDF contains sample spreads and production metadata, not complete book PDF or editable source. No separately verified public direct JPG/PNG.",
  "typefaces": [
    {
      "name": "ABC Didotype (Dinamo; name as in official catalogue)",
      "status": "CHECK",
      "note": "Verified original name in official technical index, but precise commercial font product/edition and licensing route not independently verified."
    },
    {
      "name": "Times NR (Monotype)",
      "status": "CHECK",
      "note": "Official technical index identifies Times NR, Monotype; exact version and PDF/app embedding rights need verification."
    },
    {
      "name": "Noto Serif CJK KR",
      "status": "SUBSTITUTE",
      "source": "https://github.com/notofonts/noto-cjk/blob/main/Serif/LICENSE",
      "note": "OFL 1.1 Korean body text substitute."
    },
    {
      "name": "Noto Sans CJK KR",
      "status": "SUBSTITUTE",
      "source": "https://github.com/notofonts/noto-cjk/blob/main/Sans/LICENSE",
      "note": "OFL 1.1 for scholarly notes, running heads and captions."
    }
  ],
  "palette": "Neutral cover with archival drawing, mostly black/neutral reading pages; three distinctly colored image sections visible along the book edge. Palette ADAPT; actual section hues not measured from calibrated source.",
  "layoutNotes": "Three editorial-status blocks separated by thicker rough stock; primary author text distinguished from two editor-summarized sections. Serif and sans roles support running heads, footnotes, scholarly commentary. Three color-coded image interludes separate images from long-form reading. Exact baseline grid, text width, line spacing and image-area percentage not published; 191 illustrations in 666 pp.",
  "editorialIdea": "For Korean memoirs/archives with original manuscript, interviews, documents and editor commentary, label original vs reconstruction explicitly, use two consistent typographic voices, keep main body readable, group related images in color-coded interludes or chapter-end sections, and preserve provenance. For POD, use printed section backgrounds rather than mixing specialty paper stocks.",
  "rights": {
    "layout": "ADAPT",
    "palette": "ADAPT",
    "font": "CHECK",
    "substituteFont": "USE",
    "images": "NO",
    "text": "NO",
    "editableOriginal": "NO"
  }
},
{
  "id": "100-jahre-zoff",
  "title": "100 Jahre Zoff. Die Geschichte der Zürcher Studierendenzeitung",
  "publisher": "Hier und Jetzt Verlag",
  "designer": "Farner Schalcher — Simone Farner, Naima Schalcher (with Daniela Spöck)",
  "year": 2023,
  "module": "ARCHIVE_VS_PRESENT",
  "tags": [
    "에세이",
    "인터뷰",
    "회고",
    "문화예술",
    "그리드형",
    "이미지인터루드",
    "내지"
  ],
  "dimensionsMm": [
    235,
    315
  ],
  "pageCount": 352,
  "imageCount": 230,
  "evidence": "The Most Beautiful Swiss Books 2023, awarded 2024. Swiss Federal Office of Culture jury specifically praises an asymmetric single-column serif essay grid with occasional margin images, followed by a thinner-paper image archive with five categories and chronological order. Official 2023 award catalogue pp. 6–7 verifies 352 pp, 230 images, 235×315 mm, Rhymes Text Regular by Maxtype, offset print and thread-sewn softcover. Publisher independently lists 352 pp, 230 illustrations.",
  "officialUrl": "https://www.schweizerkulturpreise.ch/en/100-jahre-zoff-4",
  "galleryUrl": "https://www.schweizerkulturpreise.ch/en/100-jahre-zoff-4",
  "cataloguePdfUrl": "https://www.schweizerkulturpreise.ch/dam/en/sd-web/SaBtNIDsBLcY/THE%20MOST%20BEAUTIFUL%20SWISS%20BOOKS%202023%20%28awarded%202024%29.pdf",
  "publisherUrl": "https://www.hierundjetzt.ch/fr/catalogue/100-jahre-zoff_2300039/",
  "previewStatus": "Official jury page includes photos of real cover and interior; downloadable PDF is award catalogue excerpts, not full book or editable layout. Direct image endpoints and full-book PDF not verified.",
  "typefaces": [
    {
      "name": "Rhymes Text Regular (Maxtype)",
      "status": "CHECK",
      "source": "https://www.schweizerkulturpreise.ch/dam/en/sd-web/SaBtNIDsBLcY/THE%20MOST%20BEAUTIFUL%20SWISS%20BOOKS%202023%20%28awarded%202024%29.pdf",
      "note": "Original face confirmed in official technical index. Retail/embedded-font and SaaS usage rights not cleared."
    },
    {
      "name": "Noto Serif CJK KR",
      "status": "SUBSTITUTE",
      "source": "https://github.com/notofonts/noto-cjk/blob/main/Serif/LICENSE",
      "note": "SIL OFL 1.1; Korean reading-text substitute. USE under OFL conditions."
    }
  ],
  "palette": "Neutral off-white/grey pages with black serif text; folded dust jacket uses four differently tinted enlarged newspaper fragments. General colors ADAPT; original reproduced newspaper art CHECK/NO without rights.",
  "layoutNotes": "Essay part: one asymmetric serif text column and small marginal image zone; archive part: large cropped/full-bleed images on thinner stock. Five archive categories and chronological order create navigation. Exact body width, leading and grid metrics not published; 230 images are a count, not an image-area percentage.",
  "editorialIdea": "For a multi-author anniversary book or Korean community anthology: first run 1-column stories with occasional marginal ephemera; second create a separately indexed image archive (photos, letters, posters, covers). Preserve captions and provenance in an image index; allow affordable POD using common stock with distinct chapter openers.",
  "rights": {
    "layout": "ADAPT",
    "palette": "ADAPT",
    "font": "CHECK",
    "substituteFont": "USE",
    "images": "NO",
    "text": "NO",
    "editableOriginal": "NO"
  }
},
{
  "id": "the-future-tense-perkins",
  "title": "The Future Tense",
  "publisher": "Fondation Fiminco",
  "designer": "Nguyen Gobber — Hoang Nguyen, David Gobber",
  "year": 2021,
  "module": "PROGRESSIVE_TEXT",
  "tags": [
    "짧은글",
    "에세이",
    "시",
    "여백형",
    "그리드형",
    "내지"
  ],
  "pageCount": 28,
  "evidence": "The Most Beautiful Swiss Books 2021, awarded 2022. Swiss Federal Office of Culture jury specifically praises 28 pages without images, two English/French essays in shifting parallel/interlocking columns, serif/sans/mono hierarchy and abundant whitespace. Designer portfolio verifies original faces SangBleu Republic, Suisse Int’l and Suisse Int’l Mono and publication by Fondation Fiminco.",
  "officialUrl": "https://www.schweizerkulturpreise.ch/en/the-future-tense-4",
  "galleryUrl": "https://www.schweizerkulturpreise.ch/en/the-future-tense-4",
  "designerPortfolioUrl": "https://nguyengobber.com/projects",
  "designerAnalysisUrl": "https://nguyengobber.com/writings",
  "previewStatus": "Official award page has cover/interior photos; designer portfolio and essay include actual spread views. No independently verified direct JPG/PNG, complete-book PDF or editable source. 28 pp from jury; trim size not verified.",
  "typefaces": [
    {
      "name": "SangBleu Republic (Swiss Typefaces)",
      "status": "CHECK",
      "source": "https://www.swisstypefaces.com/",
      "note": "Designer-confirmed original. Commercial foundry license needed for print and especially server-generated PDFs."
    },
    {
      "name": "Suisse Int’l (Swiss Typefaces)",
      "status": "CHECK",
      "source": "https://www.swisstypefaces.com/",
      "note": "Designer-confirmed original; commercial licensing not cleared."
    },
    {
      "name": "Suisse Int’l Mono (Swiss Typefaces)",
      "status": "CHECK",
      "source": "https://www.swisstypefaces.com/",
      "note": "Designer-confirmed original; commercial licensing not cleared."
    },
    {
      "name": "Noto Serif CJK KR",
      "status": "SUBSTITUTE",
      "source": "https://github.com/notofonts/noto-cjk/blob/main/Serif/LICENSE",
      "note": "SIL OFL 1.1; Korean essay text substitute, usable with license compliance."
    }
  ],
  "palette": "Green-black cover, black thread binding, black type on light paper. Color scheme ADAPT; original artwork and editorial text NO without permission.",
  "layoutNotes": "28 text-only pages; parallel English/French columns change widths and alignment, occasionally interweave. Large blank areas turn paragraph shapes into visual rhythm; serif English, bold sans French, mono footnotes. Designer explicitly relates paragraph shapes to cathedral floor plans and musical polyphony. Exact leading/measure/trim unpublished.",
  "editorialIdea": "For 2–5 short essays or poetry, preserve readable text blocks but vary their vertical starting position and pairing across spreads; use controlled white space rather than decorative imagery. Keep experimental interlocking bilingual columns opt-in, not default for Korean long-form reading.",
  "rights": {
    "layout": "ADAPT",
    "palette": "ADAPT",
    "font": "CHECK",
    "substituteFont": "USE",
    "images": "NO",
    "text": "NO",
    "editableOriginal": "NO"
  }
},
{
  "id": "grauzone-fanzine-2021",
  "title": "GRAUZONE",
  "publisher": "WRWTFWW Records",
  "designer": "Nicolas Eigenheer",
  "year": 2021,
  "module": "ARCHIVE_VS_PRESENT",
  "tags": [
    "에세이",
    "회고",
    "문화예술",
    "그리드형",
    "이미지인터루드",
    "내지"
  ],
  "pageCount": 80,
  "evidence": "The Most Beautiful Swiss Books 2021, awarded 2022. Swiss Federal Office of Culture jury praises large readable multi-part essay and one to five high-contrast historical archival items per spread in a narrow monochrome fanzine. 80-page fanzine is included in the 2021 Grauzone 40th Anniversary Box Set according to the published box-set description; page count is for the fanzine, not album packaging.",
  "officialUrl": "https://www.schweizerkulturpreise.ch/en/grauzone-4",
  "galleryUrl": "https://www.schweizerkulturpreise.ch/en/grauzone-4",
  "publisherInfoUrl": "https://oye-records.com/releases/grauzone-limited-40-years-anniversary-box-set",
  "previewStatus": "Official jury gallery has photos of actual booklet spreads. Standalone editable source, complete PDF and individual image direct download links not verified. 80 pp refers to box-set fanzine; trim size not verified.",
  "typefaces": [
    {
      "name": "Original typeface unidentified",
      "status": "CHECK",
      "note": "Official jury confirms comparatively large body text but does not name font; do not guess."
    },
    {
      "name": "Noto Sans CJK KR",
      "status": "SUBSTITUTE",
      "source": "https://github.com/notofonts/noto-cjk/blob/main/Sans/LICENSE",
      "note": "SIL OFL 1.1 Korean body/caption substitute; USE with OFL compliance."
    }
  ],
  "palette": "High-contrast black-and-white throughout; photocopy-style halftone and no unnecessary ornament. General monochrome palette ADAPT; original archive images NO without permission.",
  "layoutNotes": "Slender portrait fanzine, 80 pp; a continuous multi-part historical essay in relatively large type, with 1–5 archival items per spread: photographs, letters, reviews, posters, cover sketches. High-contrast photocopy treatment gives diverse originals a common visual language. Exact text width, leading, image-area ratio and trim unpublished.",
  "editorialIdea": "For a Korean artist memoir or oral-history book, use a stable large readable essay column and add 1–3 contextual photos/letters per spread; normalize tonal range, include captions/source references, and use an archival appendix when images overwhelm text.",
  "rights": {
    "layout": "ADAPT",
    "palette": "ADAPT",
    "font": "CHECK",
    "substituteFont": "USE",
    "images": "NO",
    "text": "NO",
    "editableOriginal": "NO"
  }
},
{
  "id": "parents-must-unite-fight-hackney-flashers",
  "title": "Parents Must Unite + Fight. Hackney Flashers: Agitprop, Work, and Socialist Feminism in England",
  "publisher": "Tombolo Presses",
  "designer": "Charles Mazé & Coline Sunier",
  "year": 2024,
  "module": "ARCHIVE_VS_PRESENT",
  "tags": [
    "문화예술",
    "글이미지50_50",
    "그리드형",
    "이미지인터루드",
    "내지"
  ],
  "dimensionsMm": [
    220,
    315
  ],
  "pageCount": 224,
  "isbn": "979-10-96155-56-9",
  "evidence": "The Most Beautiful Swiss Books 2024 (awarded 2025). Swiss Federal Office of Culture jury explicitly praises a 64-page cinematic sequence of historical image/text panels without commentary, followed by a yellow-paper scholarly essay and an archival plate section. Publisher confirms Axo (Abyme), 220×315mm, Munken Polar 120gsm and Canary Yellow 80gsm, 2024 first printing. Page count 224 independently confirmed by French retail bibliographic sources; trim dimensions from publisher supersede retailers' inconsistent 225×320mm listing.",
  "officialUrl": "https://www.schweizerkulturpreise.ch/en/parents-must-unite-fight-hackney-flashers-agitprop-work-and-socialist-feminism-in-england-4",
  "galleryUrl": "https://www.schweizerkulturpreise.ch/en/parents-must-unite-fight-hackney-flashers-agitprop-work-and-socialist-feminism-in-england-4",
  "publisherUrl": "https://presses.t-o-m-b-o-l-o.eu/",
  "cataloguePdfUrl": "https://www.schweizerkulturpreise.ch/dam/en/sd-web/JMaQk2ymNLw2/ssb-25.pdf",
  "previewStatus": "Official Swiss award gallery and publisher's publication page were opened and contain published-book photography. Awarded-books PDF opens but lists winners only; no verified complete-book PDF or editable source. Direct JPG/PNG from gallery not separately verified.",
  "typefaces": [
    {
      "name": "Axo (ABYME; Charles Mazé)",
      "status": "CHECK",
      "source": "https://www.abyme.net/catalogue/axo/",
      "note": "Publisher explicitly names Axo. Commercial font available under paid EULA. Foundry does not directly offer app/ePub licenses online and asks to contact for such usage; ooOS server/ebook rights not cleared."
    },
    {
      "name": "Noto Sans CJK KR",
      "status": "SUBSTITUTE",
      "source": "https://github.com/notofonts/noto-cjk/blob/main/Sans/LICENSE",
      "note": "OFL 1.1 Korean captions and archival essays; USE with license compliance."
    },
    {
      "name": "Noto Serif CJK KR",
      "status": "SUBSTITUTE",
      "source": "https://github.com/notofonts/noto-cjk/blob/main/Serif/LICENSE",
      "note": "OFL 1.1 alternative for long-form Korean scholarly essay; USE with license compliance."
    }
  ],
  "palette": "Black-white-yellow. Main body on white Munken Polar; 80gsm canary-yellow stock separates the scholarly essay. General black/white/yellow palette ADAPT; no right to reuse archival photo-panels.",
  "layoutNotes": "Large 220×315mm hardback. First 64 pages pair historical images with text panels across spreads with no commentary. Separate scholarly essay printed on yellow stock; later archive plates and brief biographies. Single rounded monolinear Axo family ties headings and captions. Stable role distinctions, clear sequential narrative, no unverified exact line-height/body width/image-area percentage. Images and text are paired but exact 50:50 area unmeasured.",
  "editorialIdea": "For community oral history, anthology or civic documentary: lead with 16–32pp image-and-caption sequence, then separate 1-column contextual essays using a restrained color-section opener; finish with archival facsimiles, rights credits and biographies. In low-cost POD replace yellow paper with limited yellow chapter backgrounds and check color/bleed. Use a 50:50 image/text layout option only when material supports it.",
  "rights": {
    "layout": "ADAPT",
    "palette": "ADAPT",
    "font": "CHECK",
    "substituteFont": "USE",
    "images": "NO",
    "text": "NO",
    "editableOriginal": "NO"
  }
},
{
  "id": "pauline-julier-and-so-on-single-universe",
  "title": "Pauline Julier. And So On, a Single Universe",
  "publisher": "Scheidegger & Spiess",
  "designer": "Julia Born",
  "year": 2024,
  "module": "DENSITY_SWITCH",
  "tags": [
    "문화예술",
    "글이미지50_50",
    "인터뷰",
    "그리드형",
    "이미지인터루드",
    "내지"
  ],
  "dimensionsMm": [
    185,
    260
  ],
  "pageCount": 204,
  "imageCount": 157,
  "isbn": "978-3-03942-217-3",
  "evidence": "The Most Beautiful Swiss Books 2024 (awarded 2025). Federal Office of Culture jury praises alternating fluorescent-yellow/orange/red image spreads and white reading spreads containing four long texts, stable German-left/English-right bilingual grid, occasional mono and film-still foldouts. Artist's official page confirms 204 pages and 152 color plus five black-and-white images, published by Scheidegger & Spiess with Julia Born design. 185×260mm from bookshop bibliographic listing.",
  "officialUrl": "https://www.schweizerkulturpreise.ch/en/pauline-julier-and-so-on-a-single-universe-4",
  "galleryUrl": "https://www.schweizerkulturpreise.ch/en/pauline-julier-and-so-on-a-single-universe-4",
  "artistUrl": "https://paulinejulier.com/works_detail/single-book",
  "publisherInfoUrl": "https://press.uchicago.edu/ucp/books/book/distributed/P/bo246016192.html",
  "cataloguePdfUrl": "https://www.schweizerkulturpreise.ch/dam/en/sd-web/JMaQk2ymNLw2/ssb-25.pdf",
  "previewStatus": "Official award gallery was opened and includes photographs of real spreads; artist's page and distributor page opened. Awarded-books PDF is winner list only. Individual JPG/PNG endpoints, full-book PDF and editable production files not independently verified.",
  "typefaces": [
    {
      "name": "Original bilingual serif/sans and occasional monospace (families unverified)",
      "status": "CHECK",
      "note": "Jury confirms use of a monospace variant in some chapters, but not exact font names; do not infer."
    },
    {
      "name": "Noto Serif CJK KR",
      "status": "SUBSTITUTE",
      "source": "https://github.com/notofonts/noto-cjk/blob/main/Serif/LICENSE",
      "note": "OFL 1.1; Korean main text substitute, USE under license."
    },
    {
      "name": "Noto Sans CJK KR",
      "status": "SUBSTITUTE",
      "source": "https://github.com/notofonts/noto-cjk/blob/main/Sans/LICENSE",
      "note": "OFL 1.1; Korean caption, footnote and interview metadata substitute."
    }
  ],
  "palette": "Fluorescent yellow, orange and red alternate with white reading spreads; occasional grayscale/cinematic image sections. General accent-palette and alternating section principle ADAPT. Fluorescent inks and one-side-colored stocks are not automatically reproduced by standard CMYK/POD.",
  "layoutNotes": "Landscape-format art catalogue; jury describes alternating fluorescent image spreads and white long-text spreads. Bilingual reading grid: German wider column left, English narrower single column right; monospaced type in some chapters. Titles stand alone on double spreads with varied font sizes; middle film-still sequence uses foldouts. 204pp, 157 illustrations count (152 color, 5 b&w), but exact image-area ratio and leading unpublished.",
  "editorialIdea": "For interview-and-essay with supporting images: offer alternating reading spreads and curated image interludes with a consistent caption index; keep one-column Korean essays on quiet white pages, put photos on accent-color sections. If bilingual, reserve one stable column per language; foldouts and fluorescent stock require manual print-production approval and POD-safe alternatives.",
  "rights": {
    "layout": "ADAPT",
    "palette": "ADAPT",
    "font": "CHECK",
    "substituteFont": "USE",
    "images": "NO",
    "text": "NO",
    "editableOriginal": "NO"
  }
},
  {
    id: 'the-house-of-dr-koolhaas-2025',
    title: 'The House of Dr Koolhaas',
    publisher: 'Park Books',
    designer: 'John Morgan studio (John Morgan, Teresa Lima, Adrien Vasquez)',
    year: 2025,
    module: 'CLASSIC_READING',
    tags: ['문화예술', '그리드형', '글이미지50_50', '내지'],
    evidence: 'The Most Beautiful Swiss Books 2025 (awarded 2026); Swiss Federal Office of Culture jury review, published 2026-05-13',
    officialUrl: 'https://www.schweizerkulturpreise.ch/en/the-house-of-dr-koolhaas-en',
    previewUrl: 'https://www.schweizerkulturpreise.ch/en/the-house-of-dr-koolhaas-en',
    isbn: '978-3-03860-407-5',
    pages: 224,
    formatMm: null,
    typeface: { original: 'Unidentified serif; exact font not disclosed', status: 'CHECK', koreanSubstitute: 'Noto Serif CJK KR', substituteStatus: 'SUBSTITUTE/USE (SIL OFL 1.1)' },
    palette: 'Glossy dark night-time cover with four-colour illustration; black-and-white interior; palette and general layout ADAPT.',
    layoutNotes: 'Small paperback; one serif text column per page; 1–3 monochrome images on many pages, in two standardized widths, plus occasional full-page images. Exact leading, column width, margins and image-area ratio unpublished.',
    editorialIdea: 'For Korean essay/architecture memoir: stable one-column reading pages, two allowed image widths and optional full-page image interludes. Avoid forced 50:50; assign photos by semantic relation to paragraphs.',
    rights: { layout: 'ADAPT', palette: 'ADAPT', font: 'CHECK', substituteFont: 'USE', images: 'NO', text: 'NO', editableOriginal: 'NO' }
  },
  {
    "id": "ul-lim-deul-kandinsky-2025",
    "title": "울림들",
    "author": "Wassily Kandinsky",
    "translator": "도요와 호반새",
    "publisher": "텍스트프레스",
    "designer": "정동규",
    "year": 2025,
    "dimensionsMm": [
      145,
      225
    ],
    "pageCount": 128,
    "isbn": "979-11-92023-05-2",
    "module": "SECTION_OPENER",
    "tags": [
      "시",
      "문화예술",
      "글이미지50_50",
      "이미지인터루드",
      "한글조판"
    ],
    "evidence": "2026 서울국제도서전 〈한국에서 가장 아름다운 책〉 선정(BBDK). SIBF official notice; Kookje interview confirms designer and design rationale.",
    "officialUrl": "https://sibf.or.kr/en/62/103",
    "galleryUrl": "https://v.daum.net/v/20260614180502787",
    "previewUrl": "https://image.yes24.com/goods/166393128/XL",
    "previewStatus": "YES24 cover JPG preview verified; Kookje article embeds real cover/interior photographs. Direct interior JPG and editable source not verified; preview is not reuse permission.",
    "typefaces": [
      {
        "name": "1970s vertical-set Hangul typeface; exact family undisclosed",
        "status": "CHECK",
        "note": "Designer states an older vertically composed Hangul type was reset horizontally to evoke an early-20th-century poetry book."
      },
      {
        "name": "Noto Serif CJK KR",
        "status": "SUBSTITUTE",
        "source": "https://notofonts.github.io/noto-docs/website/use/",
        "license": "SIL Open Font License 1.1"
      }
    ],
    "palette": "Restrained monochrome: white/light paper, black woodcut and black typography. Cover JPG shows white field with black woodcut; exact paper tint and ink values are not published. General monochrome principle ADAPT.",
    "layoutNotes": "38 short prose poems and 59 woodcuts. The Korean edition adapts the original rhythm to Korean horizontal composition while borrowing the feel of 1970s vertical Hangul type. The cover places the title high/right and lets a large black woodcut carry the page. Exact body measure, leading, margins and image-area ratio are unpublished.",
    "editorialIdea": "For short poems, place one poem or a short sequence in a quiet text area and let a single image interrupt at a deliberate interval. Do not enlarge or pad the poem to fill pages; use section openings, image interludes and paper rhythm to create book length.",
    "rights": {
      "layout": "ADAPT",
      "palette": "ADAPT",
      "font": "CHECK",
      "substituteFont": "USE",
      "images": "CHECK",
      "text": "CHECK",
      "editableOriginal": "NO"
    }
  },
  {
    "id": "das-was-da-ist-konrad-staisch-2026",
    "title": "Das, was da ist",
    "author": "Konrad Staisch",
    "publisher": "Ankerwechsel Verlag",
    "designer": "Konrad Staisch",
    "year": 2026,
    "dimensionsMm": [
      255,
      180
    ],
    "pageCount": 112,
    "isbn": "978-3-947596-24-9",
    "module": "DENSITY_SWITCH",
    "tags": [
      "문화예술",
      "짧은글",
      "그리드형",
      "내지",
      "한글조판"
    ],
    "evidence": "Die Schönsten Deutschen Bücher 2026, category Ratgeber/Sachbücher. Stiftung Buchkunst jury specifically praises the open-spine binding, flat opening, paper changes, Circular type and hand-lettering.",
    "officialUrl": "https://www.stiftung-buchkunst.de/die-schoensten-deutschen-buecher/die-praemierten/das-was-da-ist/?view=list&year=2026",
    "galleryUrl": "https://ankerwechsel.de/das-was-da-ist-schoenste-deutsche-buecher-2026/",
    "previewUrl": "https://ankerwechsel.de/shop/das-was-da-ist/",
    "coverJpgUrl": "https://ankerwechsel.de/wp-content/uploads/presse/Cover_Das-was-da-ist_Konrad-Staisch_Ankerwechsel.jpg",
    "previewStatus": "Publisher product page and actual spread article verified; publisher direct cover JPG verified. Direct interior spread JPG, editable source and full book PDF preview were not verified.",
    "typefaces": [
      {
        "name": "Circular Medium",
        "foundry": "Lineto",
        "status": "CHECK",
        "source": "https://lineto.com/information/help/licence-user-rights/basic-licencing",
        "license": "Commercial. Lineto desktop licence includes basic printed-book publication rights; web/app uses separate licensing. Confirm server-side ooOS PDF generation and client delivery with Lineto before deployment."
      },
      {
        "name": "Noto Sans CJK KR",
        "status": "SUBSTITUTE",
        "source": "https://notofonts.github.io/noto-docs/website/use/",
        "license": "SIL Open Font License 1.1"
      }
    ],
    "palette": "Two-colour Pantone blue/red screenprint on 2 mm bookbinder board; interior alternates three paper stocks and uses a bright yellow information panel on the documented spread. Exact Pantone numbers are not disclosed. Palette and paper-transition principle ADAPT; screenprint and stock changes require production approval.",
    "layoutNotes": "255×180 mm, 112 pages. Stiff paperback with printed open thread binding, designed to lie flat for hands-on use. The documented spread puts flowing body text and a yellow recycling-code panel on the left; the right uses hand-lettered text with a drawn chair. Three stocks are named in the official production specification: Circle Offset White, Enviro Value and Fedrigoni Arcoprint Milk. Shifts between Circular Medium and hand-lettering provide density and rhythm. The jury identifies Circular Medium and hand-lettering; exact text measure and leading are not published.",
    "editorialIdea": "For practical essays and culture books, keep the reading column stable but use one restrained information panel, hand-drawn note or diagram where it genuinely explains the text. Offer open-spine/lay-flat binding as a premium print option; simulate paper changes with section markers when POD cannot support multiple stocks.",
    "rights": {
      "layout": "ADAPT",
      "palette": "ADAPT",
      "font": "CHECK",
      "substituteFont": "USE",
      "images": "NO",
      "text": "NO",
      "editableOriginal": "NO"
    }
  },



  {
    id: 'constructive-disobedience-2025',
    title: 'Constructive Disobedience: An Experimental Methodology in Architecture',
    author: 'Edited by Matthias Ballestrem, Katharina Benjamin and Helga Blocksdorf',
    publisher: 'Birkhäuser',
    designer: 'hla.studio / Tobias Dahl and Patrick Martin',
    year: 2025,
    dimensionsMm: [230, 300],
    pageCount: 296,
    isbn: '978-3-0356-2829-6',
    module: 'DENSITY_SWITCH',
    tags: ['문화예술', '교양서', '그리드형', '이미지인터루드', '내지'],
    evidence: 'Die Schönsten Deutschen Bücher 2025 / Stiftung Buchkunst, category Fachbücher. Jury praises the two-tone colour concept, pink section pages, coated/uncoated paper changes, one typeface used in varied weights and sizes, oversized chapter dividers, highlighted references, and hollow spine.',
    officialUrl: 'https://www.stiftung-buchkunst.de/die-schoensten-deutschen-buecher/die-praemierten/constructive-disobedience/',
    galleryUrl: 'https://www.stiftung-buchkunst.de/die-schoensten-deutschen-buecher/die-praemierten/constructive-disobedience/',
    publisherUrl: 'https://birkhauser.com/en/book/9783035628302',
    previewUrl: 'https://api.pageplace.de/preview/DT0400.9783035628302_A50350626/preview-9783035628302_A50350626.pdf',
    previewStatus: 'Official Stiftung Buchkunst award page opens with the jury assessment and production credits. A public Birkhäuser/De Gruyter reading-sample PDF opens and contains actual interior pages and spreads. It is a partial reading preview, not the complete book or an editable source.',
    typefaces: [
      {
        name: 'Neue Haas Grotesk Text Medium and Bold',
        foundry: 'Commercial Type / Christian Schwartz',
        status: 'CHECK',
        source: 'https://commercialtype.com/catalog/neue_haas_grotesk_text',
        license: 'Commercial Type offers a separate Automated Document Production Server License for automatic document generation. Its EULA also contains an AI-services/programming restriction; the explanatory note narrows this to use of font data/letterforms as AI training data and says some AI-generated HTML references are outside the prohibition. Whether ooOS AI-assisted layout/PDF generation is covered is not explicit. Obtain written clarification and the correct server license before use.'
      },
      {
        name: 'Total Text',
        foundry: 'hla.studio / Patrick Martin',
        status: 'CHECK',
        source: 'https://www.stiftung-buchkunst.de/die-schoensten-deutschen-buecher/die-praemierten/constructive-disobedience/',
        license: 'Named in the official production credits; public retail license terms were not located. Do not assume a transferable license.'
      },
      {
        name: 'Noto Sans CJK KR',
        status: 'SUBSTITUTE',
        source: 'https://notofonts.github.io/noto-docs/website/use/',
        license: 'SIL Open Font License 1.1; Korean substitute for the restrained grotesk system.'
      }
    ],
    palette: 'Black cover with soft neon-pink screenprint; pink interior section pages and pink reference highlights. Exact Pantone value is not disclosed. Colour logic ADAPT; screenprint, spot ink and stock transitions require print-vendor approval.',
    layoutNotes: 'Large 230×300 mm, 296 pages, with 96 black-and-white and 104 colour illustrations listed by Birkhäuser. The jury describes one typeface in multiple cuts and sizes, oversized chapter lettering across spreads, pink reference highlights in body text, and alternating coated/uncoated stocks. Hollow spine improves opening. Exact body width, leading and grid measurements are not published.',
    editorialIdea: 'For cultural and educational books, use one robust type family with disciplined weight/size changes; mark sections with a single restrained spot colour; highlight citations consistently; alternate text-heavy spreads with drawings or images. For POD, simulate paper changes digitally and treat hollow-spine binding as a premium production option.',
    rights: {
      layout: 'ADAPT',
      palette: 'ADAPT',
      font: 'CHECK',
      substituteFont: 'USE',
      images: 'NO',
      text: 'NO',
      editableOriginal: 'NO'
    }
  },
  {
    id: 'posters-with-purpose-2025',
    title: 'Posters with Purpose: In Conversation with 3 Poster Design Masters',
    author: 'Lisa Winstanley; interviews with Ryan Slone, Rikke Hansen and Byoungil Sun',
    publisher: 'Design Ethics and Visual Integrity Lab (DEVIL), Nanyang Technological University',
    designer: 'Lisa Winstanley (art director and lead designer); Cammie Toh Su Qi',
    year: 2025,
    dimensionsMm: [240, 305],
    pageCount: 150,
    module: 'DENSITY_SWITCH',
    tags: ['인터뷰', '문화예술', '글이미지50_50', '이미지인터루드', '그리드형'],
    evidence: 'AIGA 50 Books | 50 Covers 2025 Winner, confirmed by the designer and specialist bookseller; the designer reports selection from 536 entries across 29 countries and inclusion in the permanent AIGA collection at Columbia University.',
    officialUrl: 'https://www.lisawinstanley.com/post/posters-with-purpose-wins-aiga-50-books-50-covers',
    galleryUrl: 'https://draw-down.com/products/posters-with-purpose-in-conversation-with-3-poster-design-masters',
    designerUrl: 'https://www.lisawinstanley.com/post/posters-with-purpose-wins-aiga-50-books-50-covers',
    previewStatus: 'Draw Down product page opens and lists 22 product-image entries; designer project page opens with cover, endpapers, debossed hard cover, fold-out/perforated posters and bilingual interior spreads. Direct JPG links returned cache misses in this run. No full public PDF or editable source verified. Designer and bookseller product records both list 150 pages.',
    typefaces: [
      {
        name: 'Display and body typefaces not identified in public project credits',
        status: 'CHECK',
        license: 'No exact family name or license terms verified; do not infer from appearance.'
      },
      {
        name: 'Noto Sans CJK KR',
        status: 'SUBSTITUTE',
        source: 'https://notofonts.github.io/noto-docs/website/use/',
        license: 'SIL Open Font License 1.1; possible Korean substitute after layout testing.'
      }
    ],
    palette: 'Neon-orange and purple folded dust jacket; white cloth hard cover with blind-debossed three-part motif. Colour and layered-cover principle ADAPT; foil/deboss and folded jacket require separate print/bindery feasibility and cost checks.',
    layoutNotes: 'Large 240×305 mm, 150 pages per designer and bookseller. Three interview chapters are treated as layers in a palimpsest; selected poster works are folded and perforated for removal; one featured chapter is bilingual Korean/English. Exact text measure, leading, grid and poster-to-text area ratio are not published.',
    editorialIdea: 'For interview collections, maintain one stable interview grid while giving each interviewee a distinct visual chapter identity. Use removable/fold-out artwork only in a premium edition; for standard print-on-demand, test a bound-in gatefold or a separate insert before promising it.',
    rights: {
      layout: 'ADAPT',
      palette: 'ADAPT',
      font: 'CHECK',
      substituteFont: 'USE',
      images: 'NO',
      text: 'NO',
      editableOriginal: 'NO'
    }
  },

  {
    id: 'prototyp-1928-33-2025',
    title: 'Prototyp 1928–33: Schule der Arbeit',
    author: 'Ute Richter',
    publisher: 'Verbrecher Verlag',
    designer: 'Nelly Nakahara and Gerrit Brocks',
    year: 2025,
    dimensionsMm: [165, 216],
    pageCount: 128,
    pageCountNote: 'Stiftung Buchkunst lists 128 pages; publisher shop lists 120 pages. The discrepancy is retained.',
    imageCount: '64 black-and-white illustrations (publisher listing)',
    isbn: '978-3-95732-617-1',
    module: 'ARCHIVE_VS_PRESENT',
    tags: ['회고', '문화예술', '그리드형', '이미지인터루드', '아카이브', '내지'],
    evidence: 'Die Schönsten Deutschen Bücher 2025 / Stiftung Buchkunst, category Ratgeber-Sachbücher. Jury specifically praises monochrome text-image composition, open spine, neon thread binding, ragged-right text columns, bold quotations as a second reading layer, and the dense wide text area.',
    officialUrl: 'https://www.stiftung-buchkunst.de/die-schoensten-deutschen-buecher/die-praemierten/prototyp-1928-33/',
    galleryUrl: 'https://www.verbrecherverlag.de/shop/projekt-1928-33/',
    publisherUrl: 'https://www.verbrecherverlag.de/shop/projekt-1928-33/',
    previewUrl: 'https://www.verbrecherverlag.de/wp-content/uploads/2024/11/Leseprobe-Richter-Projekt-1928-33.pdf',
    previewStatus: 'Publisher product page opens and links to a public PDF reading sample. The PDF opens and shows actual interior spreads with archival photos, source notes, documents, architectural drawings and bold quotations. This is a partial reading sample, not the complete book and not an editable original.',
    typefaces: [
      {
        name: 'New Century Schoolbook',
        foundry: 'Linotype / Monotype',
        status: 'CHECK',
        source: 'https://www.myfonts.com/collections/new-century-schoolbook-font-linotype',
        license: 'Commercial typeface. MyFonts lists Desktop, Company Desktop and Electronic Document license types; a standard desktop license is not sufficient to assume server-side automated book production or electronic-book embedding. Confirm the correct company and publication/server license before use.'
      },
      {
        name: 'ABC Walter Alte',
        foundry: 'Dinamo Typefaces / Omnigroup',
        status: 'CHECK',
        source: 'https://abcdinamo.com/typefaces/walter',
        license: 'Commercial license. Dinamo requires the commissioning client to own the license; each client needs its own license. Fonts may not be put on public servers or embedded in a way that exposes them to end users. Confirm server workflow and subcontractor scope for ooOS.'
      },
      {
        name: 'Noto Serif CJK KR',
        status: 'SUBSTITUTE',
        source: 'https://notofonts.github.io/noto-docs/website/use/',
        license: 'SIL Open Font License 1.1; suitable Korean serif substitute when OFL conditions are observed.'
      },
      {
        name: 'Noto Sans CJK KR',
        status: 'SUBSTITUTE',
        source: 'https://notofonts.github.io/noto-docs/website/use/',
        license: 'SIL Open Font License 1.1; suitable Korean sans-serif substitute for archival labels and bold quotation hierarchy.'
      }
    ],
    palette: 'Monochrome black-and-white interior and white cover material, interrupted by a neon-coloured sewn thread. Monochrome system and single accent principle ADAPT; neon thread and exposed-spine binding require bindery feasibility confirmation.',
    layoutNotes: '165×216 mm. Stiftung Buchkunst lists 128 pages; publisher lists 120. The publisher lists 64 black-and-white illustrations. Open-spine sewn softcover; monochrome text-image compositions; ragged-right columns on text-heavy spreads; bold quotations form a second reading layer; wide type area nearly reaches the gutter. Captions and source references preserve archival provenance. Exact margins and leading are not published.',
    editorialIdea: 'For memoirs, oral histories and research-led essays, combine one stable body-text grid with archival images, source captions and bold first-person quotations. Let original documents remain visually distinct rather than polishing them into generic illustrations. Use an open-spine binding only when the print run and bindery justify it.',
    rights: {
      layout: 'ADAPT',
      palette: 'ADAPT',
      font: 'CHECK',
      substituteFont: 'USE',
      images: 'NO',
      text: 'NO',
      editableOriginal: 'NO'
    }
  },
{
  "id": "on-the-edges-graphic-design-az-2025",
  "title": "On the Edges of Graphic Design from A—Z—∞",
  "author": "Edited by Anja Lutz and Soraya Guimarães Hoepfner; introduction by Jason Grant; conversation with Freek Lomme",
  "publisher": "Set Margins' publications",
  "designer": "Anja Lutz // Art Books",
  "year": 2025,
  "dimensionsMm": [
    120,
    165
  ],
  "pageCount": 548,
  "isbn": "978-90-835795-1-1",
  "binding": "Swiss binding, open back, one flap",
  "paper": "Pergraphica Classic Rough 100 gsm; Magno Gloss 150 gsm; cover Pergraphica Classic Rough 300 gsm",
  "edition": 2500,
  "colorImageCount": 500,
  "blackWhiteImageCount": 24,
  "module": "REPEATABLE_CARD",
  "tags": [
    "문화예술",
    "에세이",
    "짧은글",
    "그리드형",
    "이미지인터루드",
    "내지",
    "소형판형"
  ],
  "evidence": "AIGA 50 Books | 50 Covers 2025 Winner, Book category. The official AIGA winners gallery lists the title as a Book selection; Set Margins confirms designer, typeface and production details. Slanted's professional design feature provides actual interior spreads.",
  "officialUrl": "https://50books50covers.secure-platform.com/a/gallery?roundId=417",
  "galleryUrl": "https://www.slanted.de/on-the-edges-of-graphic-design-from-a-z-%E2%88%9E/",
  "publisherUrl": "https://www.setmargins.press/books/on-the-edges-of-graphic-design-from-a-z-%E2%88%9E/",
  "previewUrl": "https://www.slanted.de/wp-content/uploads/2025/10/slanted_blog_a-z-8_book_3-1024x704.jpg",
  "previewStatus": "Slanted's page opens with eight book photographs, including actual spreads 36–37, 90–91, 140–141 and 172–173. The previewUrl is a direct 1024×704 JPG of spread 36–37. It is a public preview, not a reusable asset or editable original. No complete public PDF or editable source was verified.",
  "typefaces": [
    {
      "name": "Relative",
      "foundry": "Colophon Foundry",
      "status": "CHECK",
      "source": "https://www.myfonts.com/collections/relative-font-colophon-foundry",
      "license": "MyFonts separates Desktop, Web, App and Electronic Document licenses. The listed Desktop license does not permit server installation, web/app embedding, font sharing, or e-book embedding; it also excludes commercial print environments. ooOS server-generated PDFs and commercial print-production workflows require written confirmation and the correct license. Do not assume a standard desktop license is sufficient."
    },
    {
      "name": "Noto Sans CJK KR",
      "status": "SUBSTITUTE",
      "source": "https://notofonts.github.io/noto-cjk/",
      "license": "SIL Open Font License 1.1; Korean sans-serif substitute."
    },
    {
      "name": "Noto Serif CJK KR",
      "status": "SUBSTITUTE",
      "source": "https://notofonts.github.io/noto-cjk/",
      "license": "SIL Open Font License 1.1; Korean serif substitute for literary essay sections."
    }
  ],
  "palette": "Verified spreads use a bright yellow outer frame and section labels, white pages, black text and full-colour graphic material. Publisher specifies full colour and two paper stocks. Yellow/black/white hierarchy and page-edge markers ADAPT; exact Pantone values are not published. Swiss binding and stock changes require printer/bindery approval.",
  "layoutNotes": "Compact 120×165 mm, 548 pages, 500 colour images and 24 black-and-white images. Part A—Z uses alphabetical, cross-referenced entries for more than 100 activities, projects and events; the second —∞ part contains contributions from 36 international designers imagining the discipline's future. The verified 36–37 spread pairs a left-page explanatory text with a dense right-page typographic/artifact grid, held together by yellow labels and a clear page frame. Spread 172–173 uses an oversized typographic quotation across a generous white field. Exact body measure, leading and baseline grid are unpublished.",
  "editorialIdea": "For a short-text anthology or cultural reference book, create a repeatable index entry with title, concise context, contributor, date and cross-reference. A second part can hold longer invited essays. Keep the body measure stable; use a single yellow marker system for navigation and reserve oversized type for occasional statement spreads. This is a practical model for making many short entries feel like a substantial book without padding.",
  "rights": {
    "layout": "ADAPT",
    "palette": "ADAPT",
    "font": "CHECK",
    "substituteFont": "USE",
    "images": "NO",
    "text": "NO",
    "editableOriginal": "NO"
  }
},
{
  "id": "hybrid-curiosity-in-all-things-2025",
  "title": "Hybrid: Curiosity in All Things",
  "author": "Hybrid Design",
  "editor": "Hybrid Design; publisher/editor Victionary",
  "publisher": "Victionary",
  "designer": "Hybrid Design",
  "year": 2025,
  "dimensionsMm": [
    178,
    235
  ],
  "dimensionsNote": "Victionary lists 178 × 235 mm; Counter-Print lists 190 × 247 mm. Use the publisher's 178 × 235 mm specification provisionally and verify the physical edition.",
  "pageCount": 640,
  "pageCountNote": "Victionary lists 640 pages; Counter-Print lists 644. Confirm the exact edition before production.",
  "isbn": "978-988-70660-0-2",
  "binding": "Full-colour hardcover; two cover colourways",
  "module": "REPEATABLE_CARD",
  "tags": [
    "에세이",
    "문화예술",
    "글이미지50_50",
    "그리드형",
    "이미지인터루드",
    "내지"
  ],
  "evidence": "AIGA 50 Books | 50 Covers 2025 — Book Winner. The official AIGA project description says each section pairs an essay with projects and organizes the book around ideas and influences rather than client or category.",
  "officialUrl": "https://50books50covers.secure-platform.com/a/gallery/rounds/417/details/79109",
  "galleryUrl": "https://www.creativeboom.com/news/hybrid-distils-25-years-of-curiosity-craft-and-cultural-obsession-into-debut-book/",
  "publisherUrl": "https://victionary.com/products/hybrid-curiosity-in-all-things",
  "previewUrl": "https://media.creativeboom.com/527e6d5a-65a1-488b-8103-63705f268b5d/conversions/18bedfde885eae400d5614c8d5251acd3dc85aed-medium.webp",
  "previewStatus": "Creative Boom's professional design feature opens and displays actual interior spreads, including pages 012–013 and 160–161. The previewUrl is a direct medium-size WEBP of the actual 012–013 spread; it is a public preview, not a reusable asset or editable original. Victionary's official product gallery also opens, but its dynamic image URLs did not resolve as direct downloads in this run.",
  "typefaces": [
    {
      "name": "Original typeface families not disclosed in AIGA or Victionary public credits",
      "status": "CHECK",
      "license": "No exact family names or license terms verified."
    },
    {
      "name": "Noto Sans CJK KR",
      "status": "SUBSTITUTE",
      "source": "https://notofonts.github.io/noto-cjk/",
      "license": "SIL Open Font License 1.1; Korean sans-serif substitute."
    },
    {
      "name": "Noto Serif CJK KR",
      "status": "SUBSTITUTE",
      "source": "https://notofonts.github.io/noto-cjk/",
      "license": "SIL Open Font License 1.1; Korean serif substitute where a more literary voice is needed."
    }
  ],
  "palette": "Victionary offers black and white cover colourways; the interior is full colour. Verified spreads use a white page field, oversized black numerals, orange/red diagram lines, yellow and multicolour project imagery, small captions and coloured ribbon markers. General colour and hierarchy principles ADAPT; no exact spot-colour values are published.",
  "layoutNotes": "AIGA says sections pair essays with projects and are grouped by ideas/influences rather than client/category. The verified 012–013 spread uses a large left-page title and photograph, with a diagram and two narrow text columns on the right. The 160–161 spread combines a large numeral, several project images and short captions. White space and strong scale contrast organize a dense 640-page full-colour book. Exact body measure, leading and baseline grid are unpublished.",
  "editorialIdea": "For a long essay collection or creative memoir, repeat a small number of page archetypes: essay opener, reflective text spread, image/project spread and short caption index. Let each section's idea—not the contributor's name alone—determine its sequence. Use oversized numerals sparingly to signal section transitions.",
  "rights": {
    "layout": "ADAPT",
    "palette": "ADAPT",
    "font": "CHECK",
    "substituteFont": "USE",
    "images": "NO",
    "text": "NO",
    "editableOriginal": "NO"
  }
},
{
  "id": "95-ways-to-step-on-the-world-2026",
  "title": "95 Ways to Step on the World",
  "author": "Gabriel Krauze",
  "publisher": "Topsafe (AIGA entry lists Gabriel Krauze as publisher)",
  "designer": "Zak Group — book and cover designer Ladina Doerig; creative director Zak Kyes",
  "year": 2026,
  "dimensionsMm": [
    111,
    161
  ],
  "pageCount": 80,
  "isbn": "978-1-0369-7223-3",
  "binding": "Paperback",
  "paper": "Munken Print Cream 80 gsm",
  "illustrationCount": 10,
  "module": "PROGRESSIVE_TEXT",
  "tags": [
    "짧은글",
    "회고",
    "여백형",
    "한글조판",
    "표지",
    "내지"
  ],
  "evidence": "AIGA 50 Books | 50 Covers 2025 — Cover Winner (not Book Winner). The AIGA project description specifically documents the type-rich interior approach, blackletter reference, paper/format choice and die-cut cover construction.",
  "officialUrl": "https://50books50covers.secure-platform.com/a/gallery/rounds/417/details/79145",
  "galleryUrl": "https://www.legrandj.eu/products/gabriel-krauze-95-ways-to-step-on-the-world",
  "publisherUrl": "https://topsafe.co/products/95-ways-to-step-on-the-world-gabriel-krauze",
  "previewUrl": null,
  "previewStatus": "The AIGA award page opens. Le Grand Jeu's product gallery opens and contains five product images; three clicked images show actual interior spreads (opening/eye reveal, two-column text spread and a black page with white type) but are served as 100×100 thumbnails. No full-resolution direct JPG/PNG, public PDF or editable original was verified.",
  "typefaces": [
    {
      "name": "Carol Gothic",
      "foundry": "ParaType",
      "designer": "Alexander Lubovenko and Alexandra Korolkova",
      "status": "CHECK",
      "source": "https://fonts.adobe.com/fonts/carol-gothic",
      "license": "Adobe Fonts states its library is cleared for commercial design projects and PDF embedding; MyFonts distinguishes flat non-editable desktop output from paid electronic-document use. For ooOS cloud/server-generated PDFs or editable templates, obtain written confirmation of the correct license before use."
    },
    {
      "name": "HAL Timezone",
      "foundry": "HAL Typefaces",
      "status": "CHECK",
      "source": "https://type.hanli.eu/timezone/",
      "license": "Official foundry identifies the family and styles, but public commercial/server licensing terms were not located. Ask the foundry before use."
    },
    {
      "name": "Noto Sans CJK KR",
      "status": "SUBSTITUTE",
      "source": "https://notofonts.github.io/noto-cjk/",
      "license": "SIL Open Font License 1.1; practical Korean body-text substitute, not a visual match for the original blackletter display style."
    }
  ],
  "palette": "Cobalt-blue cover with die-cut eye apertures; the first page reveals a halftone image. Interior stock is Munken Print Cream 80 gsm. Cobalt/cream/black contrast can be adapted; die-cut and halftone reveal require separate prepress and bindery approval.",
  "layoutNotes": "A compact 111 × 161 mm, 80-page experimental semi-autobiographical text collection with 10 illustrations. AIGA describes a type-rich layout using blackletter inspired by tattoo lettering, with Carol Gothic and HAL Timezone. The verified product thumbnails show a two-column text spread, an opening reveal and a black page with white type. Exact body width, leading, margin and baseline grid are unpublished. The award is specifically in the Cover category.",
  "editorialIdea": "For short, fragmented writing, use a compact trim size and a deliberately limited typographic system. A strong display face can signal the author's voice, while body pages remain consistent; occasional dark pages or image reveals can punctuate the sequence. Treat this as an experimental contrast case, not a default minimalist template.",
  "rights": {
    "layout": "ADAPT",
    "palette": "ADAPT",
    "font": "CHECK",
    "substituteFont": "USE",
    "images": "NO",
    "text": "NO",
    "editableOriginal": "NO"
  }
},
  {
    id: 'hybrid-curiosity-in-all-things',
    title: 'Hybrid: Curiosity in All Things',
    author: 'Hybrid Design',
    publisher: 'Victionary',
    designer: 'Hybrid Design',
    year: 2025,
    dimensionsMm: [178, 235],
    pageCount: 640,
    module: 'DENSITY_SWITCH',
    tags: ['에세이', '문화예술', '글이미지50_50', '그리드형', '내지'],
    evidence: 'AIGA 50 Books | 50 Covers 2025 — Book Winner. AIGA project description documents the essay-and-project pairing and idea-led editorial structure.',
    officialUrl: 'https://50books50covers.secure-platform.com/a/gallery/rounds/417/details/79109',
    galleryUrl: 'https://victionary.com/products/hybrid-curiosity-in-all-things',
    interiorGalleryUrl: 'https://www.creativeboom.com/news/hybrid-distils-25-years-of-curiosity-craft-and-cultural-obsession-into-debut-book/',
    previewUrl: 'https://media.creativeboom.com/527e6d5a-65a1-488b-8103-63705f268b5d/conversions/18bedfde885eae400d5614c8d5251acd3dc85aed-medium.webp',
    previewStatus: 'Public medium-resolution WEBP preview of the 012–013 spread; not an editable source or a reuse license. Full editable original not verified.',
    typefaces: [{ name: 'Unpublished in accessible credits', status: 'CHECK' }, { name: 'Noto Sans CJK KR / Noto Serif CJK KR', status: 'SUBSTITUTE', license: 'SIL Open Font License 1.1' }],
    palette: 'White ground, oversized black numerals, orange/red diagrams, yellow accents and multicolour project imagery. Colour hierarchy may be adapted; source imagery may not be reused without permission.',
    layoutNotes: 'Essay and project case studies are paired by theme. The verified 012–013 spread combines a large heading and image on the left with diagrams and narrow text columns on the right. Exact body width, leading and baseline grid are unpublished.',
    editorialIdea: 'Pair each short essay with one relevant project, artwork or diagram. Keep the body grid stable and vary only the image scale, section opener and caption density.',
    rights: { layout: 'ADAPT', palette: 'ADAPT', font: 'CHECK', substituteFont: 'USE', images: 'NO', text: 'NO', editableOriginal: 'NO' }
  },
  {
    id: '95-ways-to-step-on-the-world',
    title: '95 Ways to Step on the World',
    author: 'Gabriel Krauze',
    publisher: 'Topsafe',
    designer: 'Zak Group; book and cover design Ladina Doerig; creative director Zak Kyes',
    year: 2026,
    dimensionsMm: [111, 161],
    pageCount: 80,
    module: 'PROGRESSIVE_TEXT',
    tags: ['짧은글', '회고', '여백형', '표지', '내지'],
    evidence: 'AIGA 50 Books | 50 Covers 2025 — Cover Winner (not Book Winner). AIGA project description documents the type-rich interior and blackletter-inspired typographic system.',
    officialUrl: 'https://50books50covers.secure-platform.com/a/gallery/rounds/417/details/79145',
    galleryUrl: 'https://www.legrandj.eu/products/gabriel-krauze-95-ways-to-step-on-the-world',
    interiorGalleryUrl: 'https://www.legrandj.eu/products/gabriel-krauze-95-ways-to-step-on-the-world',
    previewUrl: null,
    previewStatus: 'Product gallery contains five images; three verified thumbnails show actual interior pages. No full-resolution direct JPG/PNG, public PDF or editable original verified.',
    typefaces: [{ name: 'Carol Gothic', foundry: 'ParaType', status: 'CHECK', source: 'https://fonts.adobe.com/fonts/carol-gothic' }, { name: 'HAL Timezone', foundry: 'HAL Typefaces', status: 'CHECK', source: 'https://type.hanli.eu/timezone/' }, { name: 'Noto Sans CJK KR', status: 'SUBSTITUTE', license: 'SIL Open Font License 1.1' }],
    palette: 'Cobalt-blue cover, cream interior paper, black typography and a die-cut eye aperture. Colour contrast can be adapted; die-cut and halftone reveal require separate prepress and bindery approval.',
    layoutNotes: 'Compact 111 × 161 mm, 80-page experimental autobiographical text collection with 10 illustrations. Verified thumbnails show a two-column text spread and a black page with white type. Exact body width, leading, margins and baseline grid are unpublished.',
    editorialIdea: 'Use a compact trim size and a deliberately limited typographic system for fragmented short writing. Keep body pages consistent and reserve dark pages or image reveals for occasional punctuation.',
    rights: { layout: 'ADAPT', palette: 'ADAPT', font: 'CHECK', substituteFont: 'USE', images: 'NO', text: 'NO', editableOriginal: 'NO' }
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
