// Deterministic Korean request parser — runs before any model call (ooOS contract:
// "규칙으로 정확히 해석되는 요청은 규칙으로 먼저"). Returns catalog ops + the sentences it did not
// understand, which can then go to the model planner.
import { nfc } from '../print/bookStructure';
import { outline } from './catalog';

const Q = '["“”\'‘’「」『』]';
const quoted = (s) => {
  const out = [];
  const re = /["“]([^"”]+)["”]|['‘]([^'’]+)['’]|「([^」]+)」|『([^』]+)』/g;
  let m;
  while ((m = re.exec(s))) out.push(m[1] || m[2] || m[3] || m[4]);
  return out;
};

const COLOR_WORDS = {
  남색: '#1f3a5f', 네이비: '#1f3a5f', 진녹색: '#2f5d50', 초록: '#2f5d50', 녹색: '#2f5d50', 버건디: '#7a2e2e', 와인: '#7a2e2e', 자주: '#7a2e2e',
  주황: '#c2562b', 오렌지: '#c2562b', 노랑: '#d9b44a', 노란: '#d9b44a', 겨자: '#d9b44a', 보라: '#3d3a4b', 아이보리: '#e8e4da', 미색: '#e8e4da', 검정: '#111214', 블랙: '#111214', 먹색: '#111214'
};
const TEMPLATE_WORDS = { 타이포: 'typo', 이미지: 'image', 프레임: 'frame', 분할: 'split', 장르형: 'genre', 기본형: 'genre' };
const FINISH_WORDS = [[/금박/, 'gold'], [/은박/, 'silver'], [/부분\s*UV|에폭시|uv/i, 'spotUV'], [/형압|엠보/, 'emboss']];
const TARGET_WORDS = [[/책등/, 'spineTitle'], [/부제/, 'subtitle'], [/제목/, 'title'], [/저자|지은이|작가/, 'author'], [/카피|태그라인/, 'tagline'], [/테두리|선|라인/, 'rule']];
const PROFILE_WORDS = { 소설: 'fiction', 에세이: 'essay', 인문: 'humanities', 교양: 'humanities', 실용: 'practical', 경제: 'practical', 자기계발: 'practical', 시집: 'poetry' };
const TRIM_WORDS = [[/46판/, '128x188'], [/신국판/, '152x225'], [/국판|A5/i, '148x210'], [/크라운/, '176x248'], [/140\s*[x×]\s*210/, '140x210']];
const PAPER_WORDS = [[/미색\s*모조\s*100/, 'mojo100'], [/미색\s*모조/, 'mojo80'], [/백색\s*모조|백모조/, 'white80'], [/이라이트\s*80/, 'elite80'], [/이라이트/, 'elite70']];

// Split into instructions on line breaks, sentence ends and "그리고" — never inside quotes.
function splitSentences(text) {
  const out = [];
  let cur = '';
  let depth = 0;
  const OPEN = '"“‘「『'; const CLOSE = '"”’」』';
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (ch === '"') depth = depth ? 0 : 1;
    else if (OPEN.includes(ch) && ch !== '"') depth += 1;
    else if (CLOSE.includes(ch) && ch !== '"') depth = Math.max(0, depth - 1);
    if (!depth && ch === '\n') { out.push(cur); cur = ''; continue; }
    cur += ch;
    if (!depth && /[.!?。]/.test(ch) && /\s/.test(text[i + 1] || ' ') && !/["”’」』]/.test(text[i + 1] || '')) { out.push(cur); cur = ''; continue; }
    if (!depth && /\s그리고\s$/.test(cur + (text[i + 1] || ''))) { /* handled below */ }
  }
  out.push(cur);
  return out.flatMap((s) => s.split(/\s*,?\s+그리고\s+(?=(?:[^"“”]*["“][^"”]*["”])*[^"“”]*$)/)).map((s) => s.trim()).filter(Boolean);
}

/**
 * @returns {{ ops: Array<{command,args,source:'rules',sentence}>, leftover: string[] }}
 */
export function parseIntentRules(intent, state) {
  const text = nfc(String(intent || '')).trim();
  const ops = [];
  const leftover = [];
  if (!text) return { ops, leftover };
  const ol = outline(state);
  const titled = ol.chapters.filter((c) => !c.untitled);
  const chapterByNumber = (n) => titled.find((c) => (c.label.match(/\d+/) || [])[0] === String(n)) || titled[Number(n) - 1];

  // Split into instruction sentences (line breaks, sentence ends, "그리고").
  const sentences = splitSentences(text);
  sentences.forEach((s) => {
    const before = ops.length;
    const qs = quoted(s);
    const push = (command, args) => ops.push({ command, args, source: 'rules', sentence: s });

    // A를 B로 바꿔
    let m = s.match(new RegExp(`${Q}([^"”'’」』]+)${Q}\\s*(?:을|를)?\\s*${Q}([^"”'’」』]*)${Q}\\s*(?:으로|로)\\s*(?:바꿔|바꾸|변경|수정|교체|고쳐)`));
    if (m && !/장\s*제목|책\s*제목|^제목|부제/.test(s.split(m[0])[0])) {
      const chap = s.match(/(\d+)\s*장\s*(?:에서|안에서|만)/);
      const ch = chap ? chapterByNumber(chap[1]) : null;
      push('text.replace', { find: m[1], replace: m[2], ...(ch ? { chapter: ch.idx } : {}) });
      return;
    }
    // N장 제목을 "X"로
    m = s.match(/(\d+)\s*장\s*(?:의\s*)?제목/);
    if (m && qs.length) {
      const ch = chapterByNumber(m[1]);
      if (ch) { push('chapter.retitle', { chapter: ch.idx, title: qs[qs.length - 1] }); return; }
    }
    // 책 제목 / 부제 / 지은이 / 출판사
    if (/^(?:책\s*)?제목/.test(s) && qs.length && !/장/.test(s.split('제목')[0])) { push('meta.set', { field: 'title', value: qs[0] }); return; }
    if (/부제/.test(s) && qs.length && !/금박|은박|박|UV|형압/.test(s)) { push('meta.set', { field: 'subtitle', value: qs[0] }); return; }
    if (/(지은이|저자명|저자\s*이름)/.test(s) && qs.length && !/소개|날개|박/.test(s)) { push('meta.set', { field: 'author', value: qs[0] }); return; }
    if (/출판사/.test(s) && qs.length) { push('meta.set', { field: 'publisher', value: qs[0] }); return; }
    m = s.match(/(?:정가|가격|값)\D{0,6}([\d,]{3,9})\s*원/);
    if (m) push('meta.set', { field: 'price', value: m[1].replace(/,/g, '') });
    m = s.match(/(97[89][\d-]{10,16})/);
    if (m && /ISBN|isbn|아이에스비엔/.test(s)) push('meta.set', { field: 'isbn', value: m[1] });
    m = s.match(/부가\s*기호\D{0,6}(\d{5})/);
    if (m) push('meta.set', { field: 'addon', value: m[1] });
    m = s.match(/펴낸\s*날\D{0,6}(\d{4}년\s*\d{1,2}월\s*\d{1,2}일)/);
    if (m) push('meta.set', { field: 'firstEdition', value: m[1] });

    // 헌사 / 제사 / 장 제사
    if (/헌사/.test(s)) {
      if (/(빼|삭제|없애)/.test(s)) push('premium.dedication', { text: '' });
      else if (qs.length) push('premium.dedication', { text: qs[0] });
      else { const t = s.split(/헌사\s*[:：]/)[1]; if (t) push('premium.dedication', { text: t.trim() }); }
    }
    if (/제사/.test(s) && !/헌사/.test(s)) {
      const src = (s.match(/[—–-]\s*([^"”'’\n]+?)\s*(?:의|에서)?\s*(?:인용|출처)?\s*$/) || [])[1] || (s.match(/출처\s*[:：는은]?\s*([^,.\n]+)/) || [])[1] || '';
      const chap = s.match(/(\d+)\s*장/);
      if (/(빼|삭제|없애)/.test(s)) push(chap ? 'premium.chapterEpigraph' : 'premium.epigraph', chap ? { chapter: chapterByNumber(chap[1])?.idx, text: '' } : { text: '', source: '' });
      else if (qs.length) {
        if (chap && chapterByNumber(chap[1])) push('premium.chapterEpigraph', { chapter: chapterByNumber(chap[1]).idx, text: qs[0], source: src.trim() });
        else push('premium.epigraph', { text: qs[0], source: src.trim() });
      }
    }
    // 추천사 "문장" — 이름(직함)
    if (/추천/.test(s) && !/띠지/.test(s)) {
      const items = [];
      const re = /["“]([^"”]+)["”]\s*(?:[—–-]+|by)?\s*([^,"“\n(]+)?(?:\(([^)]+)\))?/g;
      let r;
      while ((r = re.exec(s))) {
        const name = (r[2] || '').replace(/\s*(?:님|씨)?\s*(?:의\s*)?(?:추천사|추천|라고|이라고|을|를)?\s*(?:넣어|추가|달아|해\s*줘|해\s*주|로\s*넣|으로\s*넣)[\s\S]*$/, '').replace(/\s*(?:님|씨)$/, '').trim();
        if (r[1]) items.push({ quote: r[1], name, role: (r[3] || '').trim() });
      }
      if (/(빼|삭제|없애)/.test(s)) push('cover.endorsements', { items: [], mode: 'clear' });
      else if (items.length) push('cover.endorsements', { items, mode: /추가|더/.test(s) ? 'append' : 'replace' });
    }
    // 후가공
    const fin = FINISH_WORDS.find(([re]) => re.test(s));
    if (fin && !/띠지/.test(s)) {
      if (/(빼|삭제|없애|취소)/.test(s)) push('cover.finish', { type: 'none', targets: [] });
      else {
        const targets = TARGET_WORDS.filter(([re]) => re.test(s)).map(([, t]) => t);
        push('cover.finish', { type: fin[1], targets: targets.length ? [...new Set(targets)] : ['title'] });
      }
    }
    // 띠지
    if (/띠지/.test(s)) {
      if (/(빼|삭제|없애)/.test(s)) push('cover.band', { enabled: false });
      else {
        const h = (s.match(/(\d{2,3})\s*mm/) || [])[1];
        const endorse = (s.match(/추천[^"“]*["“]([^"”]+)["”]/) || [])[1] || '';
        const plain = qs.filter((q) => q !== endorse);
        if (plain.length) push('cover.band', { enabled: true, headline: plain[0], copy: plain[1] || '', endorsement: endorse, ...(h ? { heightMm: Number(h) } : {}) });
      }
    }
    // 앞표지 카피 / 소개 글
    if (/(카피|태그라인|한\s*줄\s*문구)/.test(s) && qs.length && !/띠지/.test(s) && !fin) ops.push({ command: 'cover.set', args: { tagline: qs[0] }, source: 'rules', sentence: s });
    if (/(뒤표지|소개\s*글|소개글)/.test(s) && qs.length && !/추천/.test(s)) ops.push({ command: 'cover.set', args: { backCopy: qs.join('\n\n') }, source: 'rules', sentence: s });
    if (/(저자\s*소개|날개.*소개)/.test(s) && qs.length) ops.push({ command: 'cover.set', args: { authorBio: qs[0], flaps: true }, source: 'rules', sentence: s });
    // 표지 템플릿 / 색 / 날개 / 종이
    const tw = Object.keys(TEMPLATE_WORDS).find((w) => new RegExp(`${w}\\s*(템플릿|표지|형|으로|로)`).test(s));
    if (tw && /표지|템플릿/.test(s)) ops.push({ command: 'cover.set', args: { template: TEMPLATE_WORDS[tw] }, source: 'rules', sentence: s });
    const hex = s.match(/#[0-9a-f]{6}\b/i);
    const cw = Object.keys(COLOR_WORDS).find((w) => s.includes(w));
    if ((hex || cw) && /(색|컬러|바탕)/.test(s) && !/띠지/.test(s)) ops.push({ command: 'cover.set', args: { color: hex ? hex[0] : COLOR_WORDS[cw] }, source: 'rules', sentence: s });
    if (/날개/.test(s) && !/소개/.test(s)) {
      if (/(빼|삭제|없애)/.test(s)) ops.push({ command: 'cover.set', args: { flaps: false }, source: 'rules', sentence: s });
      else if (/(넣|추가|달아|있게)/.test(s)) ops.push({ command: 'cover.set', args: { flaps: true }, source: 'rules', sentence: s });
    }
    const pw = PAPER_WORDS.find(([re]) => re.test(s));
    if (pw) ops.push({ command: 'cover.set', args: { paper: pw[1] }, source: 'rules', sentence: s });
    // 편집디자인
    const design = {};
    const tr = TRIM_WORDS.find(([re]) => re.test(s));
    if (tr && /(판형|판으로|판|크기)/.test(s)) design.trim = tr[1];
    if (/여유|여백.*넉넉|널찍/.test(s) && /(판면|여백|밀도|본문)/.test(s)) design.density = 'airy';
    if (/촘촘|빽빽|쪽수.*줄/.test(s)) design.density = 'compact';
    const pf = Object.keys(PROFILE_WORDS).find((w) => new RegExp(`${w}\\s*(디자인|스타일|형식|조판|으로|처럼)`).test(s));
    if (pf) design.profile = PROFILE_WORDS[pf];
    if (Object.keys(design).length) ops.push({ command: 'design.set', args: design, source: 'rules', sentence: s });

    if (ops.length === before) leftover.push(s);
  });
  return { ops, leftover };
}
