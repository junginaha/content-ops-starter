// Cover genome: derives a book-specific cover design (palette, composition, motif, back-cover excerpt)
// from measurable properties of the manuscript. No template is shared verbatim between two books:
// the manuscript itself seeds every free choice, so the same manuscript always yields the same cover
// and a different manuscript yields a different one. Every choice records the evidence behind it.
//
// Pure module (no pdf-lib) so the UI can preview the decision before the print engine loads.
import { parseBookStructure, nfc } from './bookStructure';

const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, Number.isFinite(v) ? v : 0));
const round2 = (v) => Math.round(v * 100) / 100;

// FNV-1a 32-bit over UTF-16 code units — deterministic, synchronous, dependency-free.
export function fnv1a(text) {
  let h = 0x811c9dc5;
  const s = String(text);
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

export function seededRandom(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// CMYK in percent. warm: 0 cool … 1 warm. dark: ground is a dark field (light type).
// Every colour stays at or under 280% total ink.
export const COVER_PALETTES = {
  essay: [
    { key: 'dusk-paper', label: '저녁 종이', warm: 0.75, dark: false, ground: [3, 7, 15, 0], deep: [62, 50, 42, 32], accent: [0, 62, 72, 0] },
    { key: 'sage', label: '세이지', warm: 0.35, dark: false, ground: [16, 4, 22, 0], deep: [62, 32, 62, 38], accent: [0, 34, 82, 0] },
    { key: 'night-blue', label: '밤의 남색', warm: 0.3, dark: true, ground: [92, 78, 34, 28], deep: [100, 88, 40, 48], accent: [0, 20, 72, 0] },
    { key: 'blush', label: '분홍 노을', warm: 0.9, dark: false, ground: [0, 15, 13, 0], deep: [42, 72, 52, 40], accent: [0, 76, 58, 0] }
  ],
  fiction: [
    { key: 'vermilion', label: '주홍 잉크', warm: 0.8, dark: false, ground: [6, 5, 10, 0], deep: [18, 100, 92, 14], accent: [85, 70, 45, 45] },
    { key: 'midnight', label: '자정', warm: 0.25, dark: true, ground: [100, 86, 32, 34], deep: [74, 58, 22, 8], accent: [0, 45, 90, 0] },
    { key: 'forest', label: '숲', warm: 0.4, dark: true, ground: [82, 40, 72, 44], deep: [58, 18, 52, 12], accent: [0, 18, 40, 0] },
    { key: 'ochre', label: '황토', warm: 0.95, dark: false, ground: [0, 32, 86, 8], deep: [68, 74, 60, 60], accent: [0, 4, 18, 0] }
  ],
  humanities: [
    { key: 'ivory-cobalt', label: '상아와 코발트', warm: 0.45, dark: false, ground: [4, 4, 12, 0], deep: [100, 76, 16, 14], accent: [100, 76, 16, 14] },
    { key: 'stone', label: '석회석', warm: 0.5, dark: false, ground: [12, 10, 15, 0], deep: [30, 25, 25, 85], accent: [0, 82, 86, 0] },
    { key: 'oxblood', label: '옥스블러드', warm: 0.85, dark: true, ground: [30, 96, 76, 40], deep: [22, 88, 70, 22], accent: [0, 8, 30, 0] },
    { key: 'deep-teal', label: '깊은 청록', warm: 0.2, dark: true, ground: [86, 32, 46, 22], deep: [92, 46, 54, 42], accent: [0, 10, 32, 0] }
  ],
  practical: [
    { key: 'signal', label: '신호', warm: 0.8, dark: false, ground: [0, 0, 0, 0], deep: [30, 25, 25, 92], accent: [0, 86, 96, 0] },
    { key: 'cobalt', label: '코발트', warm: 0.3, dark: false, ground: [0, 0, 0, 0], deep: [100, 82, 0, 0], accent: [0, 30, 96, 0] },
    { key: 'green-field', label: '초록 들판', warm: 0.45, dark: false, ground: [4, 0, 8, 0], deep: [90, 32, 76, 22], accent: [0, 52, 96, 0] }
  ],
  poetry: [
    { key: 'snow', label: '눈', warm: 0.5, dark: false, ground: [2, 2, 4, 0], deep: [30, 25, 25, 85], accent: [0, 82, 70, 0] },
    { key: 'dusk-blue', label: '해질녘 파랑', warm: 0.3, dark: false, ground: [36, 18, 6, 0], deep: [90, 72, 40, 40], accent: [0, 10, 40, 0] },
    { key: 'rice', label: '쌀', warm: 0.8, dark: false, ground: [4, 6, 16, 0], deep: [55, 50, 60, 42], accent: [72, 30, 20, 10] }
  ]
};

// Compositions per genre. Each is a different picture, not a recolour.
export const COVER_LAYOUTS = {
  horizon: { label: '수평선', summary: '수평선에 걸린 원 — 장 수만큼 물결이 아래로 번진다' },
  terrain: { label: '지형', summary: '장마다 분량을 세로 막대로 세운 지형 — 책의 길이가 곧 풍경' },
  rings: { label: '동심원', summary: '모서리에서 퍼지는 동심원 — 장 수만큼 고리' },
  rhythm: { label: '리듬 띠', summary: '장마다 분량에 비례한 띠 — 이야기의 리듬을 그대로 쌓음' },
  grid: { label: '모듈 격자', summary: '격자 위에 장 수만큼 칸을 채운 구조도' },
  band: { label: '정보 띠', summary: '제목을 품은 큰 색 면과 장별 분량 막대' },
  mark: { label: '한 점', summary: '넓은 여백 위 한 점과 한 줄 — 시의 호흡' },
  letter: { label: '첫 글자', summary: '제목의 첫 글자를 표지보다 크게 — 활자 자체가 그림' }
};

// [primary, data-driven (shows chapter lengths), typographic]
const GENRE_LAYOUTS = {
  essay: ['horizon', 'terrain', 'letter'],
  fiction: ['rings', 'rhythm', 'letter'],
  humanities: ['grid', 'rhythm', 'letter'],
  practical: ['band', 'grid', 'letter'],
  poetry: ['mark', 'horizon', 'letter']
};

function weightedPick(items, weights, rand) {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = rand() * total;
  for (let i = 0; i < items.length; i += 1) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

export function cmykLuminance([c, m, y, k]) {
  const r = (1 - c / 100) * (1 - k / 100);
  const g = (1 - m / 100) * (1 - k / 100);
  const b = (1 - y / 100) * (1 - k / 100);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export const totalInk = (cmyk) => cmyk.reduce((a, b) => a + b, 0);

// Pure K or paper white for type, whichever reads on the given field. Small type stays single-plate
// so it never suffers from four-colour registration error.
export function typeOn(field) {
  return cmykLuminance(field) < 0.5 ? [0, 0, 0, 0] : [0, 0, 0, 100];
}

const SENTENCE_SPLIT = /(?<=[.!?。…])\s+/;
const DIALOGUE_START = /^["“「『'‘―—-]/;

// Picks one sentence from the manuscript for the back cover. Never invents copy: the excerpt is
// quoted verbatim and flagged for the author's approval.
export function pickExcerpt(structure, { title = '' } = {}) {
  const titleWords = nfc(title).split(/\s+/).map((w) => w.replace(/[^가-힣A-Za-z0-9]/g, '')).filter((w) => w.length >= 2);
  const stems = titleWords.map((w) => w.slice(0, Math.max(2, w.length - 1)));
  const candidates = [];
  let order = 0;
  structure.chapters.forEach((chapter) => chapter.blocks.forEach((block) => {
    if (block.type !== 'p') return;
    const text = block.lines.join(' ').trim();
    if (DIALOGUE_START.test(text)) return;
    text.split(SENTENCE_SPLIT).forEach((raw) => {
      const s = raw.trim();
      order += 1;
      const len = s.replace(/\s/g, '').length;
      if (len < 18 || len > 80) return;
      if (/^\d+[.)]/.test(s) || /[“”"]/.test(s) || /https?:/.test(s)) return;
      if (!/[.!?。…]$/.test(s)) return;
      let score = 0;
      score += 1 - Math.abs(len - 42) / 60;
      if (stems.some((stem) => s.includes(stem))) score += 1.5;
      if (/[?？]$/.test(s)) score += 0.4;
      if (/(나는|우리는|당신)/.test(s)) score += 0.3;
      candidates.push({ text: s, score, order });
    });
  }));
  if (!candidates.length) return null;
  const total = order || 1;
  // Prefer the back half of the book (endings carry the thesis) without spoiling the very last line.
  candidates.forEach((c) => {
    const pos = c.order / total;
    if (pos > 0.45 && pos < 0.95) c.score += 0.35;
  });
  candidates.sort((a, b) => b.score - a.score || a.order - b.order);
  return candidates[0].text;
}

/**
 * @param {object} input
 * @param {string} input.manuscript
 * @param {string} [input.title]
 * @param {object} input.analysis  result of analyzeForDesign
 * @param {string} [input.genre]   design profile actually used (manual override wins)
 * @param {string} [input.layout]  force a composition
 * @param {string} [input.palette] force a palette key
 */
export function deriveCoverGenome({ manuscript = '', title = '', analysis, genre, layout, palette } = {}) {
  const g = COVER_PALETTES[genre] ? genre : (COVER_PALETTES[analysis?.genre] ? analysis.genre : 'humanities');
  const m = analysis?.metrics || {};
  const structure = parseBookStructure(manuscript, { title });
  const seed = fnv1a(`${nfc(title)}\n${nfc(manuscript)}`);
  const rand = seededRandom(seed);

  const chapterLengths = structure.chapters
    .filter((ch) => !ch.untitled || ch.blocks.length)
    .map((ch) => ch.blocks.reduce((sum, b) => sum + (b.type === 'p' ? b.lines.join('').replace(/\s/g, '').length : 0), 0))
    .filter((n) => n > 0);

  const axes = {
    warmth: round2(clamp((m.firstPersonPer1k || 0) / 12 * 0.6 + (m.dialogueRatio || 0) * 2 * 0.4)),
    weight: round2(clamp(((m.avgParagraphChars || 0) - 40) / 220 * 0.7 + (m.hanjaPer1k || 0) / 4 * 0.15 + (m.formalEndingRatio || 0) * 0.15)),
    rhythm: round2(clamp((m.dialogueRatio || 0) * 2.2 + (m.sceneBreaks || 0) / Math.max(1, m.chapters || 1) * 0.4)),
    openness: round2(clamp(1 - ((m.avgParagraphChars || 0) - 30) / 200)),
    inquiry: round2(clamp((m.questionsPer1k || 0) / 6))
  };

  const reasons = [];

  // Palette: closest to the manuscript's temperature; a heavy, inward text earns a dark field.
  const families = COVER_PALETTES[g];
  let chosen = families.find((p) => p.key === palette);
  if (chosen) reasons.push(`색: ${chosen.label} — 직접 지정`);
  else {
    const wantDark = axes.weight >= 0.45 || (axes.rhythm >= 0.5 && axes.warmth < 0.5);
    const scored = families.map((p) => ({ p, score: Math.abs(p.warm - axes.warmth) + (p.dark === wantDark ? 0 : 0.35) }));
    // Closer palettes are much likelier, but the manuscript seed keeps two similar books from
    // landing on the same colour every time.
    chosen = weightedPick(scored.map((x) => x.p), scored.map((x) => Math.exp(-x.score * 4)), rand);
    reasons.push(`색: ${chosen.label} — 온도 ${axes.warmth}(1인칭·대화 비중) · 무게 ${axes.weight}(문단 길이·문어체)${chosen.dark ? ' → 어두운 바탕' : ''}`);
  }

  const options = GENRE_LAYOUTS[g];
  let comp = COVER_LAYOUTS[layout] ? layout : null;
  if (comp) reasons.push(`구도: ${COVER_LAYOUTS[comp].label} — 직접 지정`);
  else {
    const varied = chapterLengths.length >= 3
      ? Math.max(...chapterLengths) / Math.max(1, Math.min(...chapterLengths))
      : 1;
    // Uneven chapters make the data-driven composition worth showing; otherwise the seed decides.
    const weights = [1.2, varied >= 2.2 ? 2.4 : 0.8, 0.9];
    comp = weightedPick(options, weights, rand);
    reasons.push(`구도: ${COVER_LAYOUTS[comp].label} — 장 ${chapterLengths.length}개, 최장/최단 분량 비 ${round2(varied)}`);
  }

  const motif = {
    count: Math.max(3, Math.min(12, chapterLengths.length || 5)),
    lengths: chapterLengths.length ? chapterLengths : [1, 1, 1, 1, 1],
    position: round2(0.22 + rand() * 0.56),
    corner: rand() < 0.5 ? 'top-right' : 'bottom-left',
    scale: round2(0.85 + axes.openness * 0.3),
    jitter: Array.from({ length: 24 }, () => round2(rand()))
  };
  reasons.push(`모티프: ${COVER_LAYOUTS[comp].summary}`);

  const excerpt = pickExcerpt(structure, { title });
  if (excerpt) reasons.push('뒤표지: 원고 문장 그대로 발췌 — 저자 승인 필요');

  const colours = [chosen.ground, chosen.deep, chosen.accent];
  const maxInk = Math.max(...colours.map(totalInk));

  return {
    schema: 'onedaybooks.cover-genome.v1',
    seed: seed.toString(16).padStart(8, '0'),
    genre: g,
    axes,
    palette: { key: chosen.key, label: chosen.label, dark: chosen.dark, ground: chosen.ground, deep: chosen.deep, accent: chosen.accent },
    layout: comp,
    layoutLabel: COVER_LAYOUTS[comp].label,
    motif,
    excerpt,
    maxTotalInk: maxInk,
    reasons
  };
}
