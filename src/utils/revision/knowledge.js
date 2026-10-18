// ooOS reference knowledge for the 2차 제작 planner (grounding, not model training).
// Sources: src/data/designReferences.js (layout modules + award-winning reference books, rights-annotated),
// coverIntelligence.js (PR #15), docs/ONEDAYBOOKS_KOREAN_OS_PRODUCTION_UPGRADE.md (PR #13),
// docs/OOOS_PRINT_PACKAGE.md and the print engine's own rules. Reference books are used for
// editorial ideas only — layouts are ADAPT, images/text NO, fonts CHECK.
import { DESIGN_PROFILES, DENSITY_OPTIONS } from '../print/designProfiles';
import { TRIM_PRESETS } from '../print/presets';
import { COVER_TEMPLATES, FINISH_TARGETS } from '../print/coverConstants';

export const LAYOUT_MODULES = [{"id": "CLASSIC_READING", "label": "Classic Reading", "purpose": "에세이·회고·교양의 안정적인 1단 본문", "rules": ["단일 컬럼", "안정적 본문 폭", "넉넉한 바깥 여백", "최소 장식"]}, {"id": "ONE_SIDE_READING", "label": "One-side Reading", "purpose": "본문과 주석·이미지·여백을 좌우 역할로 분리", "rules": ["오른쪽 본문", "왼쪽 주석/이미지/여백", "페이지 역할 고정"]}, {"id": "PROGRESSIVE_TEXT", "label": "Progressive Text", "purpose": "짧은 글을 시간과 리듬으로 확장", "rules": ["1줄→2줄→3줄", "글자 크기 과대 확대 금지", "여백을 독서 시간으로 사용"]}, {"id": "DENSITY_SWITCH", "label": "Density Switch", "purpose": "조밀한 본문과 이미지·색면을 교대", "rules": ["본문 밀도 변화", "전면 이미지", "색면/인터루드"]}, {"id": "SECTION_OPENER", "label": "Section Opener", "purpose": "짧은 글 묶음의 장 전환을 명확히 함", "rules": ["키워드 1면", "사진 1면+제목 1면", "제한색"]}, {"id": "MULTI_TEXT_WIDTH", "label": "Multi Text Width", "purpose": "글 길이에 따라 본문 폭을 제한적으로 변화", "rules": ["3~5개 폭 프리셋", "서체/기본 마진 통일", "밀도 변화"]}, {"id": "MARGIN_NOTE_GRID", "label": "Margin Note Grid", "purpose": "본문·주석·출처·캡션을 분리", "rules": ["본문 중심축", "측면 주석", "공통 기준선"]}, {"id": "MULTI_COLUMN_REFERENCE_GRID", "label": "Multi-column Reference Grid", "purpose": "본문·이미지·주석·출처가 많은 정보형 책", "rules": ["다중 열", "정보 역할별 영역", "명확한 수직 기준선"]}, {"id": "TECHNICAL_ILLUSTRATION_GRID", "label": "Technical Illustration Grid", "purpose": "도해와 설명문의 대응을 명확히 함", "rules": ["도해/설명 연결", "큰 제목→설명→도해", "제한색"]}, {"id": "ARCHIVE_VS_PRESENT", "label": "Archive vs Present", "purpose": "과거 자료와 현재 해설을 다른 시각 언어로 분리", "rules": ["파크시밀리", "현대 조판", "자료/해설 시각 분리"]}, {"id": "REPEATABLE_CARD", "label": "Repeatable Card", "purpose": "짧은 콘텐츠가 많은 책을 반복 가능한 모듈로 구성", "rules": ["5~7개 유형", "매 페이지 새 디자인 금지", "장별 제한 변주"]}, {"id": "SINGLE_STRONG_RULE", "label": "Single Strong Rule", "purpose": "한두 개의 강한 시각 규칙을 책 전체에 반복", "rules": ["색/선/위치/재료 중 1~2개", "나머지는 절제", "일관된 정보 위계"]}];

export const DESIGN_REFERENCES = [{"id": "walking-as-research-practice", "title": "Walking as Research Practice", "publisher": "Soapbox", "designer": "Jana Sofie Liebe", "year": 2024, "module": "ONE_SIDE_READING", "tags": ["에세이", "여백형", "주석"], "evidence": "Stiftung Buchkunst · Goldene Letter", "idea": "", "notes": "", "palette": "", "trim": null, "pages": null}, {"id": "on-the-necessity-of-gardening", "title": "On the Necessity of Gardening", "publisher": "Valiz + Centraal Museum Utrecht", "designer": "Bart de Baets", "year": 2021, "module": "DENSITY_SWITCH", "tags": ["문화예술", "그리드형", "이미지인터루드"], "evidence": "Stiftung Buchkunst · Goldene Letter", "idea": "", "notes": "", "palette": "", "trim": null, "pages": null}, {"id": "here-a-world-poem", "title": "HERE: A World Poem", "publisher": "Typotheque", "designer": "Atelier Carvalho Bernau", "year": 2021, "module": "PROGRESSIVE_TEXT", "tags": ["시", "짧은글", "생성형조판"], "evidence": "TDC68 + Best Dutch Book Designs", "idea": "", "notes": "", "palette": "", "trim": null, "pages": null}, {"id": "redaction", "title": "Redaction", "publisher": "W. W. Norton & Company", "designer": "James Goggin, Amanda Barrow / Practise", "year": 2023, "module": "SECTION_OPENER", "tags": ["시", "이미지인터루드", "레이어"], "evidence": "AIGA 50 Books | 50 Covers 2023", "idea": "", "notes": "", "palette": "", "trim": null, "pages": null}, {"id": "k-artists", "title": "K-Artists", "publisher": "Archive Books / The Floorplan", "designer": "Dokho Shin", "year": 2023, "module": "MARGIN_NOTE_GRID", "tags": ["인터뷰", "문화예술", "이미지목차"], "evidence": "한국에서 가장 아름다운 책 2024", "idea": "", "notes": "", "palette": "", "trim": null, "pages": null}, {"id": "hidden-heartache", "title": "Hidden Heartache", "publisher": "Jungle Books", "designer": "Samuel Bänziger, Rosario Florio, Larissa Kasper", "year": 2024, "module": "MULTI_TEXT_WIDTH", "tags": ["에세이", "여백형", "본문폭변주"], "evidence": "Stiftung Buchkunst · Bronze Medal", "idea": "", "notes": "", "palette": "", "trim": null, "pages": null}, {"id": "raising-the-curtain", "title": "Raising the Curtain", "publisher": "Spector Books", "designer": "Lamm & Kirch, Caspar Reuss", "year": 2024, "module": "MARGIN_NOTE_GRID", "tags": ["문화예술", "주석", "그리드형"], "evidence": "Die Schönsten Deutschen Bücher 2025", "idea": "", "notes": "", "palette": "", "trim": null, "pages": null}, {"id": "collapsed-mythologies", "title": "Collapsed Mythologies: A Geofinancial Atlas", "publisher": "Spector Books / Page Not Found", "designer": "Dayna Casey", "year": 2025, "module": "MULTI_COLUMN_REFERENCE_GRID", "tags": ["문화예술", "글이미지50_50", "주석"], "evidence": "Stiftung Buchkunst 2026 · Bronze Medal", "idea": "", "notes": "", "palette": "", "trim": null, "pages": null}, {"id": "taiwan-letterpress-guide", "title": "The Visual Guide to Taiwan Letterpress Printing", "publisher": "Yuan-Liou Publishing", "designer": "Peng-Hsiang Kao", "year": 2025, "module": "TECHNICAL_ILLUSTRATION_GRID", "tags": ["문화예술", "도해", "그리드형"], "evidence": "Stiftung Buchkunst 2026 · Honorary Appreciation", "idea": "", "notes": "", "palette": "", "trim": null, "pages": null}, {"id": "dirty-old-river", "title": "Dirty Old River", "publisher": "Park Books", "designer": "John Morgan Studio", "year": 2025, "module": "MULTI_TEXT_WIDTH", "tags": ["에세이", "여백형", "본문폭변주", "이미지인터루드"], "evidence": "The Most Beautiful Swiss Books 2025", "idea": "", "notes": "", "palette": "", "trim": null, "pages": null}, {"id": "superior-and-inferior", "title": "Superior and Inferior", "publisher": "Crackers", "designer": "Sabo Day", "year": 2025, "module": "ARCHIVE_VS_PRESENT", "tags": ["인터뷰", "회고", "여백형", "원자료대조"], "evidence": "The Most Beautiful Swiss Books 2025", "idea": "", "notes": "", "palette": "", "trim": null, "pages": null}, {"id": "house-of-doctor-koolhaas", "title": "The House of Doctor Koolhaas", "publisher": "Park Books", "designer": "John Morgan Studio", "year": 2025, "module": "DENSITY_SWITCH", "tags": ["문화예술", "그리드형", "이미지인터루드", "소형판형"], "evidence": "The Most Beautiful Swiss Books 2025", "idea": "", "notes": "", "palette": "", "trim": null, "pages": null}, {"id": "die-anrufung-der-riesin", "title": "Die Anrufung der Riesin", "publisher": "starfruit publications", "designer": "StudioNearMe / Karin Kolb", "year": 2024, "module": "DENSITY_SWITCH", "tags": ["에세이", "회고", "여백형", "이미지인터루드"], "evidence": "Die Schönsten Deutschen Bücher 2025 — Stiftung Buchkunst", "idea": "Alternate stable essay text with occasional photographic interludes; maintain readable body width and footnote hierarchy", "notes": "Readable essay columns, unconventional footnotes, full-page and double-page photography; exact margins and leading not published", "palette": "Apple-green linen cover, deep purple typography, cream paper; monochrome and muted photographic accents", "trim": [140, 210], "pages": 128}, {"id": "logorrhea-jean-michel-wicker", "title": "logorrhea", "publisher": "a bouncing people planet", "designer": "Marietta Eugster", "year": 2024, "module": "PROGRESSIVE_TEXT", "tags": ["짧은글", "시", "여백형", "타이포그래피"], "evidence": "The Most Beautiful Swiss Books 2024 — Swiss Federal Office of Culture", "idea": "Use short statements and sparse placement to create rhythm; avoid gratuitous blank-page inflation", "notes": "Very short text at top of page or freely positioned; generous negative space; occasional oversized glyphs; exact leading unpublished", "palette": "Black on warm white, occasional fluorescent yellow", "trim": [140, 210], "pages": 468}, {"id": "freinet-techniques", "title": "Freinet Techniques, Freinettechnieken, Techniques Freinet", "publisher": "Rollo Press / Drukkerij Raddraaier SSP", "designer": "Paul Gangloff", "year": 2024, "module": "ARCHIVE_VS_PRESENT", "tags": ["문화예술", "짧은글", "그리드형", "자료대조"], "evidence": "The Most Beautiful Swiss Books 2024 — Swiss Federal Office of Culture", "idea": "Pair source image with transcription or translation on facing page; preserve source attribution", "notes": "Archival student text per page paired with translation, short introductory essays and multilingual columns; exact leading unpublished", "palette": "Yellow cloth cover, black type, black-and-white archive sheets, translucent paper", "trim": [170, 210], "pages": 296}];

export const COVER_RULES = [
  '제목은 모바일 120px 축소판에서도 읽혀야 한다 — 24자 넘는 제목은 축소 판독 위험.',
  '부제는 65자 이내. 길면 상세페이지로 옮긴다.',
  '색은 주조색·보조색·강조색 3개 안팎. 4개 넘으면 정보 위계가 흐려진다.',
  '실용·자기계발: 제목의 즉시 이해와 효익(타이포 중심·여백 중심·단일 상징).',
  '문학·에세이: 정서와 이미지의 일관성(이미지 중심·여백 중심·타이포 중심).',
  '비즈니스·경제: 신뢰감과 정보 위계(타이포 중심·단일 상징·여백 중심).',
  '예술·사진: 시각 작품과 권리 확인(이미지 중심).',
  '전문·교육: 가독성과 시리즈 확장성(타이포·그리드·단일 상징).',
  '이미지·서체·삽화 사용권, 썸네일 판독, 인쇄 프리플라이트는 사람이 확인한다(HOLD 조건).',
  '점수는 편집 위험 신호일 뿐 판매 성과나 인쇄 적합성을 보증하지 않는다.'
];

export const PRINT_RULES = [
  '내지는 K100 1도, 재단+사방 도련 3mm, TrimBox/BleedBox 전 쪽 지정, 서체 전체 임베딩.',
  '장은 홀수 쪽에서 시작, 쪽수는 4의 배수(인쇄 대수 16쪽 권장), 판권은 마지막 짝수 쪽.',
  '금칙: 닫는 부호는 줄 첫머리 불가, 여는 부호는 줄 끝 불가. 외톨이·과부 줄 방지. 숫자(ISBN·전화번호)는 나누지 않음.',
  '원고 글자 보존: 조판 결과의 글자는 원고와 순서까지 일치해야 한다. 원고를 바꾸는 수정은 반드시 기록·승인한다.',
  '표지는 뒤표지+책등+앞표지(+날개) 펼침면, 책등은 인쇄소 종이 두께로 확정(공식은 참고값).',
  '후가공(금박·은박·형압·부분UV)은 표지와 같은 크기의 별도 판 PDF로 넘긴다. K100 = 가공 영역. 박·형압 글자는 8pt 이상, 선은 0.25mm 이상.',
  '띠지는 표지 하단을 덮으므로 바코드를 가리면 띠지에도 바코드를 넣는다. 높이는 보통 표지 높이의 25~35%.',
  '큰 단색 먹 면은 리치 블랙 여부를 인쇄소와 확인. PDF/X 인증이 아니면 그렇다고 밝힌다.',
  'PRINT_READY는 자동으로 선언하지 않는다. 인쇄소 사양·교정 승인·표지 승인·판권 확인 4단계를 사람이 승인한다.'
];

export const KOREAN_BOOK_CONVENTIONS = [
  '앞붙이 순서: 표제지 → (헌사) → (제사) → 차례 → 본문. 헌사·제사는 각각 오른쪽(홀수) 쪽, 뒷면은 비운다.',
  '헌사는 한두 줄의 짧은 문장, 가운데 정렬. 제사는 인용문과 출처(— 이름, 『책』) 오른쪽 정렬.',
  '장 제사는 장 제목 아래 본문 앞에 짧게. 인용 출처를 반드시 단다.',
  '추천사는 실제 추천인의 실제 문장만 쓴다. 이름·직함을 함께 표기하고 지어내지 않는다.',
  '뒤표지는 추천사(있다면) → 소개 글 → 바코드·정가 순. 소개 글은 6~10줄.',
  '앞표지 카피(태그라인)는 한 문장, 25자 안팎.',
  '띠지 앞면은 헤드라인 한 줄 + 보조 문구 두세 줄, 뒷면은 추천 한 구절.',
  '판권면 기재: 초판 펴낸날, 지은이, 펴낸곳, 출판등록, 연락처, ISBN, 값.'
];

export const PLATFORM_INVARIANTS = [
  '명령 목록(Command Catalog)에 있는 수정만 실행한다. 목록에 없는 요청은 실행하지 않고 질문으로 돌린다.',
  '규칙으로 정확히 해석되는 요청은 규칙으로 먼저 처리하고, 나머지만 편집 모델이 해석한다. 모델 결과도 스키마·정책 검증을 통과해야 실행된다.',
  '모든 수정은 실행 전 미리보기(변경 전/후)와 되돌릴 수 있는 버전으로 남긴다.',
  '저자의 문장을 바꾸는 수정(본문·헌사·제사·소개 글·추천사)은 저자/편집자 승인 후에만 적용한다.',
  '숫자·날짜·고유명사·ISBN·URL을 임의로 바꾸지 않는다. 사실을 새로 만들지 않는다.',
  '후기·추천사·수치를 창작하지 않는다. 필요한데 제공되지 않았으면 질문한다.',
  '원고 전체를 외부로 보내지 않는다. 계획 수립에는 목차·메타·설정과 사용자가 허락한 발췌만 쓴다.'
];

export function knowledgeText() {
  const prof = Object.values(DESIGN_PROFILES).map((p) => `- ${p.key} (${p.label}): ${p.summary}`).join('\n');
  const dens = DENSITY_OPTIONS.map((d) => `${d.key}=${d.label}`).join(', ');
  const trims = TRIM_PRESETS.map((t) => `${t.key}=${t.label}`).join(', ');
  const tpl = Object.entries(COVER_TEMPLATES).map(([k, v]) => `${k}=${v.label}(${v.desc})`).join(', ');
  const fin = Object.entries(FINISH_TARGETS).map(([k, v]) => `${k}=${v}`).join(', ');
  const mods = LAYOUT_MODULES.map((m) => `- ${m.id}: ${m.purpose} [${m.rules.join(' · ')}]`).join('\n');
  const refs = DESIGN_REFERENCES.map((r) => `- 『${r.title}』 ${r.designer}, ${r.publisher} ${r.year} — ${r.module} · ${r.tags.join('/')}${r.idea ? ` · 아이디어: ${r.idea}` : ''} (${r.evidence})`).join('\n');
  return [
    '## ooOS 편집디자인 프로필', prof, `판면 밀도: ${dens}`, `판형: ${trims}`,
    '## 1900 표지 템플릿', `genre=장르형(ooOS 기본 먹 1도), ${tpl}`, `후가공 대상: ${fin}`,
    '## ooOS 레이아웃 모듈', mods,
    '## 레퍼런스 도서(수상작, 레이아웃 아이디어만 차용 — 이미지·문장 사용 불가)', refs,
    '## 표지 편집 규칙 (Cover Intelligence)', COVER_RULES.map((r) => `- ${r}`).join('\n'),
    '## 인쇄 규칙', PRINT_RULES.map((r) => `- ${r}`).join('\n'),
    '## 한국 단행본 관례', KOREAN_BOOK_CONVENTIONS.map((r) => `- ${r}`).join('\n'),
    '## 플랫폼 원칙', PLATFORM_INVARIANTS.map((r) => `- ${r}`).join('\n')
  ].join('\n');
}
