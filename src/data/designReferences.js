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
