// Editorial design profiles. Each genre gets its own typographic system — not one template for every book.
// Lightweight (no pdf-lib import) so the UI can show the choices before the print engine loads.
//
// Font roles: 'serif' = 나눔명조, 'sans' = 나눔고딕 (headings/labels only).
// Heading text is never rewritten: labels and titles are printed exactly as written in the manuscript.

export const DESIGN_PROFILES = {
  fiction: {
    key: 'fiction',
    label: '소설',
    summary: '이야기 몰입형 — 넉넉한 행간, 큰 장 번호, 면주는 책 제목',
    bodyScale: 1,
    leading: 1.72,
    indentEm: 1,
    align: 'justify',
    stanzaGapLines: 0,
    margins: { top: 0.09, bottom: 0.105, inner: 0.145, outer: 0.12 },
    opener: { style: 'numeral', sink: 0.3, recto: true },
    headingFont: 'serif',
    runningHead: { verso: 'author', recto: 'title', font: 'serif' },
    folio: 'outside',
    section: { style: 'center', font: 'serif', scale: 1 },
    titlePage: 'center',
    cover: 'fiction'
  },
  essay: {
    key: 'essay',
    label: '에세이',
    summary: '호흡형 — 좁은 판면과 넓은 여백, 왼쪽 정렬 장 제목, 가운데 쪽번호',
    bodyScale: 1,
    leading: 1.85,
    indentEm: 1,
    align: 'justify',
    stanzaGapLines: 0,
    margins: { top: 0.1, bottom: 0.115, inner: 0.15, outer: 0.145 },
    opener: { style: 'left-title', sink: 0.26, recto: true },
    headingFont: 'serif',
    runningHead: { verso: 'title', recto: 'chapter', font: 'serif' },
    folio: 'center',
    section: { style: 'left', font: 'serif', scale: 1 },
    titlePage: 'left',
    cover: 'essay'
  },
  humanities: {
    key: 'humanities',
    label: '인문·교양',
    summary: '논증형 — 표준 판면, 장 번호+제목 중앙, 굵은 소제목, 면주는 장 제목',
    bodyScale: 1,
    leading: 1.7,
    indentEm: 1,
    align: 'justify',
    stanzaGapLines: 0,
    margins: { top: 0.088, bottom: 0.1, inner: 0.14, outer: 0.115 },
    opener: { style: 'label-title', sink: 0.28, recto: true },
    headingFont: 'serif',
    runningHead: { verso: 'title', recto: 'chapter', font: 'serif' },
    folio: 'outside',
    section: { style: 'left', font: 'serif', scale: 1.05 },
    titlePage: 'center',
    cover: 'humanities'
  },
  practical: {
    key: 'practical',
    label: '실용·경제',
    summary: '정보 탐색형 — 고딕 제목 위계, 넓은 판면, 목록 내어쓰기, 장 시작 구분선',
    bodyScale: 0.98,
    leading: 1.68,
    indentEm: 1,
    align: 'justify',
    stanzaGapLines: 0,
    margins: { top: 0.085, bottom: 0.095, inner: 0.135, outer: 0.105 },
    opener: { style: 'sans-block', sink: 0.2, recto: true },
    headingFont: 'sans',
    runningHead: { verso: 'title', recto: 'chapter', font: 'sans' },
    folio: 'outside',
    section: { style: 'left', font: 'sans', scale: 1.1 },
    titlePage: 'left',
    cover: 'practical'
  },
  poetry: {
    key: 'poetry',
    label: '시',
    summary: '행 보존형 — 왼쪽 정렬, 행갈이 그대로, 시마다 새 쪽, 면주 없음',
    bodyScale: 1,
    leading: 1.9,
    indentEm: 0,
    hangEm: 2,
    align: 'left',
    stanzaGapLines: 1,
    margins: { top: 0.12, bottom: 0.12, inner: 0.17, outer: 0.15 },
    opener: { style: 'poem', sink: 0.12, recto: false },
    headingFont: 'serif',
    runningHead: null,
    folio: 'center',
    section: { style: 'left', font: 'serif', scale: 1 },
    titlePage: 'center',
    cover: 'poetry'
  },
  // 행 보존 산문(짧은 행으로 끊어 쓴 경어체 에세이·자기계발). 『돈의 면접』 일반판 개편(2026-11)에서 나온 규칙:
  // 작가가 끊은 행·행간·단락 간격은 고정값으로 잠그고(최적화가 행간을 바꾸지 않음), 디자인은 여백과
  // 부 표제지·달 도비라·헤어라인으로만 한다. 먹 1도 기준.
  breath: {
    key: 'breath',
    label: '여백형 에세이',
    summary: '행 보존·여백형 — 작가 행갈이와 행간 고정, 넓은 여백, 부 표제지·달 도비라, 면주는 아래 바깥',
    bodyScale: 1,
    // 140mm 판형 기준 11pt / 18pt. 행간은 저자 승인 값이라 잠근다.
    fixedType: { bodyPt: 11, leadingPt: 18 },
    lockLeading: true,
    leading: 18 / 11,
    indentEm: 0,
    align: 'left',
    stanzaGapLines: 0,
    // 단락 사이 4.5pt(=행간의 1/4). 줄 격자는 유지하고 반 줄보다 작은 숨만 둔다.
    paragraphGapLines: 0.25,
    // 140×210 기준 위 24 · 아래 22 · 안 22 · 바깥 18mm (판형이 바뀌면 비율로 따라감)
    margins: { top: 24 / 210, bottom: 22 / 210, inner: 22 / 140, outer: 18 / 140 },
    opener: { style: 'moon', sink: 0.14, recto: true, fullPage: true, autoNumber: true },
    parts: true,
    headingFont: 'serif',
    runningHead: { verso: 'title', recto: 'chapter', font: 'serif', position: 'foot' },
    folio: 'foot-outside',
    section: { style: 'rule-left', font: 'serif', scale: 1.05, after: 0, balance: true },
    titlePage: 'left',
    fontFamily: 'gowun',
    cover: 'essay'
  }
};

// Serif families the print engine can load. 'gowun' has no ExtraBold; the loader maps Bold to that role.
export const FONT_FAMILIES = {
  nanum: { key: 'nanum', label: '나눔명조', license: 'SIL Open Font License 1.1 (Nanum Myeongjo)' },
  gowun: { key: 'gowun', label: '고운바탕', license: 'SIL Open Font License 1.1 (Gowun Batang)' }
};

export function profileFontFamily(profileKey) {
  return DESIGN_PROFILES[profileKey]?.fontFamily || 'nanum';
}

export const DENSITY_OPTIONS = [
  { key: 'airy', label: '여유', leadingDelta: 0.06, marginScale: 1.06 },
  { key: 'standard', label: '표준', leadingDelta: 0, marginScale: 1 },
  { key: 'compact', label: '촘촘', leadingDelta: -0.06, marginScale: 0.94 }
];

const r1 = (v) => Math.round(v * 10) / 10;

/** Resolve a profile into concrete tokens for a trim size. */
export function resolveDesign(profileKey = 'humanities', trimWidthMm = 140, trimHeightMm = 210, { density = 'standard', leadingDelta = 0 } = {}) {
  const base = DESIGN_PROFILES[profileKey] || DESIGN_PROFILES.humanities;
  const dens = DENSITY_OPTIONS.find((d) => d.key === density) || DENSITY_OPTIONS[1];
  const w = Number(trimWidthMm);
  const h = Number(trimHeightMm);
  const sizeBase = w <= 130 ? 9.5 : w >= 170 ? 10.5 : 10;
  const fixed = base.fixedType;
  const bodySize = fixed ? fixed.bodyPt : Math.round(sizeBase * base.bodyScale * 100) / 100;
  // Locked profiles keep the author-approved leading: density and the optimiser may not move it.
  const leading = fixed && base.lockLeading
    ? fixed.leadingPt
    : Math.round(bodySize * (base.leading + dens.leadingDelta + leadingDelta) * 100) / 100;
  const leadingRatio = Math.round((leading / bodySize) * 1000) / 1000;
  return {
    ...base,
    density: base.lockLeading ? 'locked' : dens.key,
    bodySize,
    leadingRatio,
    leading,
    marginsMm: {
      top: r1(h * base.margins.top * (base.lockLeading ? 1 : dens.marginScale)),
      bottom: r1(h * base.margins.bottom * (base.lockLeading ? 1 : dens.marginScale)),
      inner: r1(w * base.margins.inner * (base.lockLeading ? 1 : dens.marginScale)),
      outer: r1(w * base.margins.outer * (base.lockLeading ? 1 : dens.marginScale))
    },
    spaceEm: 0.28,
    maxLetterSpacingEm: 0.06
  };
}

export function profileUsesSans(profileKey) {
  const p = DESIGN_PROFILES[profileKey];
  return !!p && (p.headingFont === 'sans' || p.runningHead?.font === 'sans' || p.section?.font === 'sans');
}
