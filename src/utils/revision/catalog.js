// 2차 제작 Command Catalog — typed, validated, previewable, reversible edits on a BookState.
// Follows the ooOS production contract: only catalog commands execute; each has a schema check,
// a dry-run preview (before/after), a substantive flag (author approval) and is applied to a copy
// so every version can be restored. Nothing here talks to a model.
import { parseBookStructure, nfc } from '../print/bookStructure';
import { DESIGN_PROFILES, DENSITY_OPTIONS } from '../print/designProfiles';
import { TRIM_PRESETS } from '../print/presets';
import { COVER_TEMPLATES, FINISH_TYPES, FINISH_TARGETS } from '../print/coverConstants';

/**
 * BookState
 * { manuscript, meta:{title,subtitle,author,publisher,price,isbn,addon,firstEdition,registration,contact},
 *   design:{profile,density,trim,optimize},
 *   cover:{template,color,backCopy,authorBio,flaps,paper,tagline,endorsements:[],finish:{type,targets},band:{...}},
 *   premium:{dedication,epigraph:{text,source},chapterEpigraphs:{[idx]:{text,source}}} }
 */
export function emptyState() {
  return {
    manuscript: '',
    meta: { title: '', subtitle: '', author: '', publisher: '', price: '', isbn: '', addon: '', firstEdition: '', registration: '', contact: '' },
    design: { profile: 'auto', density: 'standard', trim: '152x225', optimize: true },
    cover: { template: 'typo', color: '#1f3a5f', backCopy: '', authorBio: '', flaps: false, paper: 'mojo80', tagline: '', endorsements: [], finish: { type: 'none', targets: [] }, band: { enabled: false, heightMm: 70, headline: '', copy: '', endorsement: '', color: '' } },
    premium: { dedication: '', epigraph: { text: '', source: '' }, chapterEpigraphs: {} }
  };
}
const clone = (v) => JSON.parse(JSON.stringify(v));

// ---------- manuscript blocks (identical split to bookStructure) ----------
export function splitBlocks(text) {
  return nfc(String(text || '')).replace(/\r\n?/g, '\n').split(/\n[ \t　]*\n/)
    .map((b) => b.replace(/^\n+|\n+$/g, '')).filter((b) => b.trim().length > 0);
}
const joinBlocks = (blocks) => blocks.join('\n\n');

/** Chapter outline with block ranges, used by commands, the rules parser and the planner prompt. */
export function outline(state) {
  const blocks = splitBlocks(state.manuscript);
  const structure = parseBookStructure(state.manuscript, { title: state.meta.title });
  const chapters = structure.chapters.map((ch, idx) => {
    const firstP = ch.blocks.find((b) => b.type === 'p');
    const startBlock = ch.untitled ? (ch.blocks[0]?.sourceIndex ?? 0) : ch.sourceIndex;
    return {
      idx,
      label: ch.label || '',
      title: ch.title || '',
      heading: ch.heading || '',
      untitled: !!ch.untitled,
      startBlock,
      paragraphs: ch.blocks.filter((b) => b.type === 'p').length,
      chars: ch.blocks.reduce((n, b) => n + (b.type === 'p' ? b.lines.join('') : (b.text || '')).replace(/\s/g, '').length, 0),
      firstLine: firstP ? firstP.lines[0].slice(0, 60) : ''
    };
  });
  chapters.forEach((c, i) => { c.endBlock = i + 1 < chapters.length ? chapters[i + 1].startBlock - 1 : blocks.length - 1; });
  return { blocks, chapters, stats: structure.stats };
}

// ---------- helpers ----------
const PROTECTED_RE = /https?:\/\/\S+|97[89][-\s]?\d[-\d\s]{8,}\d|\d/;
const str = (v) => (v == null ? '' : String(v));
const nonEmpty = (v) => str(v).trim().length > 0;
function snippet(text, index, len, pad = 22) {
  const s = Math.max(0, index - pad);
  const e = Math.min(text.length, index + len + pad);
  return { pre: (s > 0 ? '…' : '') + text.slice(s, index), hit: text.slice(index, index + len), post: text.slice(index + len, e) + (e < text.length ? '…' : '') };
}
function findChapter(ol, idx) {
  const ch = ol.chapters.find((c) => c.idx === Number(idx));
  if (!ch) throw new Error(`${idx}번 장을 찾지 못했습니다.`);
  return ch;
}
export function chapterName(ch) {
  if (!ch) return '';
  if (ch.untitled) return '본문 앞부분';
  return [ch.label, ch.title].filter(Boolean).join(' ');
}
const fromIntent = (ctx, value) => !ctx?.intent || nfc(ctx.intent).replace(/\s+/g, '').includes(nfc(str(value)).replace(/[“”"'‘’]/g, '').replace(/\s+/g, ''));

// ---------- commands ----------
export const COMMANDS = {
  'text.replace': {
    label: '본문 문구 바꾸기',
    group: 'text',
    substantive: true,
    describe: (a) => `“${a.find}” → “${a.replace}”${a.chapter != null ? ` (${a.chapter}번 장)` : ''}`,
    validate: (a) => [!nonEmpty(a.find) && 'find(바꿀 문구)가 필요합니다.', a.replace == null && 'replace(새 문구)가 필요합니다.'].filter(Boolean),
    apply(state, a) {
      const ol = outline(state);
      const find = nfc(str(a.find));
      const rep = nfc(str(a.replace));
      let blocks = ol.blocks.slice();
      let lo = 0; let hi = blocks.length - 1;
      if (a.chapter != null && a.chapter !== '') { const ch = findChapter(ol, a.chapter); lo = ch.startBlock; hi = ch.endBlock; }
      const samples = []; let count = 0;
      for (let i = lo; i <= hi; i += 1) {
        let b = blocks[i]; let pos = b.indexOf(find);
        if (pos < 0) continue;
        let out = ''; let last = 0;
        while (pos >= 0) {
          count += 1;
          if (samples.length < 5) {
            const sn = snippet(b, pos, find.length);
            samples.push({ before: `${sn.pre}[${sn.hit}]${sn.post}`, after: `${sn.pre}[${rep}]${sn.post}` });
          }
          out += b.slice(last, pos) + rep; last = pos + find.length;
          pos = b.indexOf(find, last);
        }
        blocks[i] = out + b.slice(last);
      }
      if (!count) throw new Error(`“${find}”을(를) 원고에서 찾지 못했습니다.`);
      const warnings = [];
      if (PROTECTED_RE.test(find) || PROTECTED_RE.test(rep)) warnings.push('숫자·ISBN·URL이 포함된 수정입니다 — 사실 관계를 확인하세요.');
      if (count > 30) warnings.push(`${count}곳이 한꺼번에 바뀝니다 — 의도한 범위인지 확인하세요.`);
      const next = clone(state); next.manuscript = joinBlocks(blocks);
      return { state: next, preview: { summary: `${count}곳 변경`, samples }, warnings };
    }
  },

  'text.insert': {
    label: '본문 문단 넣기',
    group: 'text',
    substantive: true,
    describe: (a) => `${a.chapter}번 장 ${a.position === 'start' ? '첫머리' : '끝'}에 문단 ${splitBlocks(a.text).length}개`,
    validate: (a, ctx) => [a.chapter == null && 'chapter(장 번호)가 필요합니다.', !nonEmpty(a.text) && 'text(넣을 문단)가 필요합니다.', !['start', 'end'].includes(a.position || 'end') && 'position은 start 또는 end입니다.', nonEmpty(a.text) && !fromIntent(ctx, a.text) && '본문에 넣을 문장은 제작자가 직접 준 문장만 넣습니다.'].filter(Boolean),
    apply(state, a) {
      const ol = outline(state);
      const ch = findChapter(ol, a.chapter);
      const add = splitBlocks(a.text);
      const blocks = ol.blocks.slice();
      const at = (a.position || 'end') === 'start' ? (ch.untitled ? ch.startBlock : ch.startBlock + 1) : ch.endBlock + 1;
      blocks.splice(at, 0, ...add);
      const next = clone(state); next.manuscript = joinBlocks(blocks);
      return { state: next, preview: { summary: `${chapterName(ch)} ${(a.position || 'end') === 'start' ? '첫머리' : '끝'}에 ${add.length}문단`, samples: add.slice(0, 3).map((t) => ({ before: '', after: t.slice(0, 120) })) }, warnings: [] };
    }
  },

  'chapter.retitle': {
    label: '장 제목 바꾸기',
    group: 'structure',
    substantive: true,
    describe: (a) => `${a.chapter}번 장 제목 → “${a.title}”`,
    validate: (a) => [a.chapter == null && 'chapter(장 번호)가 필요합니다.', !nonEmpty(a.title) && 'title(새 제목)이 필요합니다.'].filter(Boolean),
    apply(state, a) {
      const ol = outline(state);
      const ch = findChapter(ol, a.chapter);
      if (ch.untitled) throw new Error('제목 없는 첫 부분에는 장 제목을 바꿀 수 없습니다. 장 추가를 쓰세요.');
      const title = nfc(str(a.title)).trim();
      const old = ol.blocks[ch.startBlock];
      const md = /^#\s+/.test(old);
      let line = ch.label && a.keepLabel !== false ? `${ch.label} ${title}` : title;
      if (md) line = `# ${line}`;
      const blocks = ol.blocks.slice(); blocks[ch.startBlock] = line;
      let next = clone(state); next.manuscript = joinBlocks(blocks);
      // The new line must still parse as a chapter heading; otherwise mark it explicitly.
      if (outline(next).chapters.filter((c) => !c.untitled).length !== ol.chapters.filter((c) => !c.untitled).length) {
        blocks[ch.startBlock] = `# ${line.replace(/^#\s+/, '')}`;
        next = clone(state); next.manuscript = joinBlocks(blocks);
      }
      return { state: next, preview: { summary: chapterName(ch), samples: [{ before: old, after: blocks[ch.startBlock] }] }, warnings: [] };
    }
  },

  'chapter.add': {
    label: '장 추가',
    group: 'structure',
    substantive: true,
    describe: (a) => `장 “${a.title}” 추가 (${a.after != null ? `${a.after}번 장 뒤` : '맨 뒤'})`,
    validate: (a, ctx) => [!nonEmpty(a.title) && 'title(장 제목)이 필요합니다.', !nonEmpty(a.text) && 'text(장 본문)가 필요합니다.', nonEmpty(a.text) && !fromIntent(ctx, a.text) && '장 본문은 제작자가 직접 준 글만 넣습니다.'].filter(Boolean),
    apply(state, a) {
      const ol = outline(state);
      const blocks = ol.blocks.slice();
      const at = a.after != null && a.after !== '' ? findChapter(ol, a.after).endBlock + 1 : blocks.length;
      const add = [`# ${nfc(str(a.title)).trim()}`, ...splitBlocks(a.text)];
      blocks.splice(at, 0, ...add);
      const next = clone(state); next.manuscript = joinBlocks(blocks);
      return { state: next, preview: { summary: `“${a.title}” · ${add.length - 1}문단`, samples: [{ before: '', after: add.slice(0, 2).join(' / ').slice(0, 140) }] }, warnings: ['장 구성이 바뀌어 쪽수·차례·책등이 달라집니다.'] };
    }
  },

  'meta.set': {
    label: '책 정보 바꾸기',
    group: 'meta',
    substantive: false,
    fields: ['title', 'subtitle', 'author', 'publisher', 'price', 'isbn', 'addon', 'firstEdition', 'registration', 'contact'],
    describe: (a) => `${({ title: '제목', subtitle: '부제', author: '지은이', publisher: '출판사', price: '정가', isbn: 'ISBN', addon: '부가기호', firstEdition: '펴낸날', registration: '출판등록', contact: '연락처' })[a.field] || a.field} → “${a.value}”`,
    validate(a) {
      const errs = [];
      if (!this.fields.includes(a.field)) errs.push(`field는 ${this.fields.join(', ')} 중 하나입니다.`);
      if (a.field === 'price' && str(a.value).replace(/\D/g, '') === '') errs.push('정가는 숫자여야 합니다.');
      if (a.field === 'addon' && !/^\d{5}$/.test(str(a.value).replace(/\D/g, ''))) errs.push('부가기호는 숫자 5자리입니다.');
      return errs;
    },
    apply(state, a) {
      const next = clone(state);
      const before = str(state.meta[a.field]);
      let v = str(a.value).trim();
      if (a.field === 'price') v = v.replace(/\D/g, '');
      next.meta[a.field] = v;
      const warnings = [];
      if (a.field === 'title' && v.length > 24) warnings.push('제목이 24자를 넘어 모바일 축소판 판독이 어려울 수 있습니다.');
      if (a.field === 'subtitle' && v.length > 65) warnings.push('부제가 65자를 넘습니다 — 상세페이지로 옮기는 것을 검토하세요.');
      return { state: next, preview: { summary: this.describe(a), samples: [{ before, after: v }] }, warnings };
    }
  },

  'design.set': {
    label: '편집디자인 설정',
    group: 'design',
    substantive: false,
    describe: (a) => [a.profile && `디자인 ${DESIGN_PROFILES[a.profile]?.label || a.profile}`, a.density && `밀도 ${DENSITY_OPTIONS.find((d) => d.key === a.density)?.label || a.density}`, a.trim && `판형 ${TRIM_PRESETS.find((t) => t.key === a.trim)?.label || a.trim}`, a.optimize != null && `최적화 ${a.optimize ? '켬' : '끔'}`].filter(Boolean).join(' · '),
    validate: (a) => [
      a.profile && a.profile !== 'auto' && !DESIGN_PROFILES[a.profile] && `profile은 auto, ${Object.keys(DESIGN_PROFILES).join(', ')} 중 하나입니다.`,
      a.density && !DENSITY_OPTIONS.some((d) => d.key === a.density) && 'density는 airy, standard, compact 중 하나입니다.',
      a.trim && !TRIM_PRESETS.some((t) => t.key === a.trim) && `trim은 ${TRIM_PRESETS.map((t) => t.key).join(', ')} 중 하나입니다.`,
      !a.profile && !a.density && !a.trim && a.optimize == null && '바꿀 설정이 없습니다.'
    ].filter(Boolean),
    apply(state, a) {
      const next = clone(state);
      ['profile', 'density', 'trim'].forEach((k) => { if (a[k]) next.design[k] = a[k]; });
      if (a.optimize != null) next.design.optimize = !!a.optimize;
      const warnings = a.trim ? ['판형이 바뀌면 쪽수·책등·표지 크기가 모두 다시 계산됩니다.'] : [];
      return { state: next, preview: { summary: this.describe(a), samples: [] }, warnings };
    }
  },

  'premium.dedication': {
    label: '헌사',
    group: 'premium',
    substantive: true,
    describe: (a) => (nonEmpty(a.text) ? `헌사 “${str(a.text).slice(0, 40)}”` : '헌사 삭제'),
    validate: (a, ctx) => [nonEmpty(a.text) && !fromIntent(ctx, a.text) && '헌사는 제작자가 직접 준 문장만 넣습니다.', str(a.text).length > 200 && '헌사는 200자 이내로 씁니다.'].filter(Boolean),
    apply(state, a) {
      const next = clone(state); next.premium.dedication = str(a.text).trim();
      return { state: next, preview: { summary: '표제지 다음 오른쪽 쪽, 가운데 정렬', samples: [{ before: state.premium.dedication, after: next.premium.dedication }] }, warnings: [] };
    }
  },

  'premium.epigraph': {
    label: '제사(책 첫머리 인용)',
    group: 'premium',
    substantive: true,
    describe: (a) => (nonEmpty(a.text) ? `제사 “${str(a.text).slice(0, 40)}” — ${a.source || '출처 미기재'}` : '제사 삭제'),
    validate: (a, ctx) => [nonEmpty(a.text) && !fromIntent(ctx, a.text) && '제사 인용문은 제작자가 직접 준 문장만 넣습니다(인용 정확성·저작권).', nonEmpty(a.text) && !nonEmpty(a.source) && '제사에는 출처가 필요합니다.'].filter(Boolean),
    apply(state, a) {
      const next = clone(state); next.premium.epigraph = { text: str(a.text).trim(), source: str(a.source).trim() };
      return { state: next, preview: { summary: '헌사 다음 오른쪽 쪽, 오른쪽 정렬 인용', samples: [{ before: state.premium.epigraph?.text || '', after: next.premium.epigraph.text }] }, warnings: ['인용문 저작권(공정 이용 범위)과 출처 표기를 확인하세요.'] };
    }
  },

  'premium.chapterEpigraph': {
    label: '장 제사',
    group: 'premium',
    substantive: true,
    describe: (a) => `${a.chapter}번 장 제사 “${str(a.text).slice(0, 30)}”`,
    validate: (a, ctx) => [a.chapter == null && 'chapter(장 번호)가 필요합니다.', nonEmpty(a.text) && !fromIntent(ctx, a.text) && '장 제사 인용문은 제작자가 직접 준 문장만 넣습니다.', nonEmpty(a.text) && !nonEmpty(a.source) && '장 제사에는 출처가 필요합니다.'].filter(Boolean),
    apply(state, a) {
      const ol = outline(state);
      const ch = findChapter(ol, a.chapter);
      if (ch.untitled) throw new Error('제목 있는 장에만 장 제사를 넣을 수 있습니다.');
      const next = clone(state);
      if (nonEmpty(a.text)) next.premium.chapterEpigraphs[ch.idx] = { text: str(a.text).trim(), source: str(a.source).trim() };
      else delete next.premium.chapterEpigraphs[ch.idx];
      return { state: next, preview: { summary: `${chapterName(ch)} 제목 아래`, samples: [{ before: state.premium.chapterEpigraphs?.[ch.idx]?.text || '', after: str(a.text) }] }, warnings: [] };
    }
  },

  'cover.set': {
    label: '표지 설정',
    group: 'cover',
    keys: ['template', 'color', 'backCopy', 'tagline', 'authorBio', 'flaps', 'paper'],
    get substantive() { return true; },
    isSubstantive: (a) => ['backCopy', 'tagline', 'authorBio'].some((k) => a[k] != null),
    describe: (a) => Object.keys(a).filter((k) => ['template', 'color', 'backCopy', 'tagline', 'authorBio', 'flaps', 'paper'].includes(k)).map((k) => ({
      template: `템플릿 ${a.template === 'genre' ? '장르형' : COVER_TEMPLATES[a.template]?.label || a.template}`,
      color: `색 ${a.color}`,
      backCopy: '뒤표지 소개 글',
      tagline: `앞표지 카피 “${str(a.tagline).slice(0, 30)}”`,
      authorBio: '날개 저자 소개',
      flaps: `날개 ${a.flaps ? '넣기' : '빼기'}`,
      paper: `종이 ${a.paper}`
    })[k]).join(' · '),
    validate: (a) => [
      a.template && a.template !== 'genre' && !COVER_TEMPLATES[a.template] && `template은 genre, ${Object.keys(COVER_TEMPLATES).join(', ')} 중 하나입니다.`,
      a.color && !/^#[0-9a-f]{6}$/i.test(a.color) && 'color는 #RRGGBB 형식입니다.',
      a.tagline && str(a.tagline).length > 60 && '앞표지 카피는 60자 이내로 씁니다.',
      a.paper && !['mojo80', 'mojo100', 'white80', 'elite70', 'elite80'].includes(a.paper) && 'paper 값이 올바르지 않습니다.',
      !['template', 'color', 'backCopy', 'tagline', 'authorBio', 'flaps', 'paper'].some((k) => a[k] != null) && '바꿀 표지 설정이 없습니다.'
    ].filter(Boolean),
    apply(state, a) {
      const next = clone(state);
      const samples = [];
      ['template', 'color', 'backCopy', 'tagline', 'authorBio', 'flaps', 'paper'].forEach((k) => {
        if (a[k] == null) return;
        samples.push({ before: str(state.cover[k]).slice(0, 140), after: str(a[k]).slice(0, 140) });
        next.cover[k] = k === 'flaps' ? !!a[k] : (typeof a[k] === 'string' ? a[k].trim() : a[k]);
      });
      const warnings = [];
      if (a.tagline && str(a.tagline).length > 25) warnings.push('앞표지 카피는 25자 안팎이 읽기 좋습니다.');
      if (a.backCopy && str(a.backCopy).length > 420) warnings.push('뒤표지 소개 글이 길어 바코드와 겹칠 수 있습니다.');
      if (a.draft) warnings.push('편집 엔진이 쓴 초안 문구입니다 — 저자·편집자가 문장을 확정해야 합니다.');
      return { state: next, preview: { summary: this.describe(a), samples }, warnings };
    }
  },

  'cover.endorsements': {
    label: '추천사',
    group: 'cover',
    substantive: true,
    describe: (a) => `추천사 ${(a.items || []).length}개 ${a.mode === 'append' ? '추가' : '설정'}`,
    validate: (a, ctx) => {
      const items = Array.isArray(a.items) ? a.items : [];
      const errs = [];
      if (a.mode !== 'clear' && !items.length) errs.push('items(추천사 목록)가 필요합니다.');
      items.forEach((it, i) => {
        if (!nonEmpty(it?.quote)) errs.push(`${i + 1}번 추천사 문장이 비어 있습니다.`);
        else if (!fromIntent(ctx, it.quote)) errs.push(`${i + 1}번 추천사는 제작자가 준 문장이 아닙니다 — 추천사는 지어내지 않습니다.`);
        if (!nonEmpty(it?.name)) errs.push(`${i + 1}번 추천사에 추천인 이름이 필요합니다.`);
      });
      if (items.length > 4) errs.push('뒤표지 추천사는 4개까지입니다.');
      return errs;
    },
    apply(state, a) {
      const next = clone(state);
      const items = (a.items || []).map((it) => ({ quote: str(it.quote).trim().replace(/^[“"]|[”"]$/g, ''), name: str(it.name).trim(), role: str(it.role).trim() }));
      next.cover.endorsements = a.mode === 'clear' ? [] : a.mode === 'append' ? [...(state.cover.endorsements || []), ...items].slice(0, 4) : items;
      return { state: next, preview: { summary: `뒤표지 위쪽 · ${next.cover.endorsements.length}개`, samples: items.map((it) => ({ before: '', after: `“${it.quote}” — ${[it.name, it.role].filter(Boolean).join(' · ')}` })) }, warnings: ['추천인에게 문구 사용 동의를 받았는지 확인하세요.'] };
    }
  },

  'cover.finish': {
    label: '후가공(박·부분UV·형압)',
    group: 'cover',
    substantive: false,
    describe: (a) => (a.type === 'none' ? '후가공 없음' : `${FINISH_TYPES[a.type] || a.type} · ${(a.targets || []).map((t) => FINISH_TARGETS[t] || t).join(', ')}`),
    validate: (a) => [
      !FINISH_TYPES[a.type] && a.type !== 'none' && `type은 ${Object.keys(FINISH_TYPES).join(', ')} 중 하나입니다.`,
      a.type !== 'none' && (!Array.isArray(a.targets) || !a.targets.length) && 'targets(가공할 요소)가 필요합니다.',
      (a.targets || []).some((t) => !FINISH_TARGETS[t]) && `targets는 ${Object.keys(FINISH_TARGETS).join(', ')} 중에서 고릅니다.`
    ].filter(Boolean),
    apply(state, a) {
      const next = clone(state);
      next.cover.finish = { type: a.type, targets: a.type === 'none' ? [] : a.targets };
      const warnings = [];
      if (a.type !== 'none' && state.cover.template === 'genre') warnings.push('장르형 표지에는 후가공 판이 나오지 않습니다 — 색 표지 템플릿으로 바꾸세요.');
      if (a.type !== 'none') warnings.push('후가공은 단가·납기에 영향을 줍니다. 인쇄소 견적에 포함하세요.');
      return { state: next, preview: { summary: this.describe(a), samples: [] }, warnings };
    }
  },

  'cover.band': {
    label: '띠지',
    group: 'cover',
    substantive: true,
    describe: (a) => (a.enabled === false ? '띠지 없음' : `띠지 ${a.heightMm || 70}mm · “${str(a.headline).slice(0, 24)}”`),
    validate: (a, ctx) => [
      a.enabled !== false && !nonEmpty(a.headline) && 'headline(띠지 헤드라인)이 필요합니다.',
      a.heightMm != null && (Number(a.heightMm) < 40 || Number(a.heightMm) > 120) && '띠지 높이는 40~120mm입니다.',
      nonEmpty(a.endorsement) && !fromIntent(ctx, a.endorsement) && '띠지 추천 구절은 제작자가 준 문장만 넣습니다.',
      a.color && !/^#[0-9a-f]{6}$/i.test(a.color) && 'color는 #RRGGBB 형식입니다.'
    ].filter(Boolean),
    apply(state, a) {
      const next = clone(state);
      next.cover.band = a.enabled === false ? { ...state.cover.band, enabled: false }
        : { enabled: true, heightMm: Number(a.heightMm) || state.cover.band?.heightMm || 70, headline: str(a.headline).trim(), copy: str(a.copy).trim(), endorsement: str(a.endorsement).trim(), color: a.color || state.cover.band?.color || '' };
      const warnings = [];
      if (a.draft) warnings.push('편집 엔진이 쓴 띠지 문구 초안입니다 — 확정 전 검토하세요.');
      return { state: next, preview: { summary: this.describe(a), samples: [{ before: '', after: [a.headline, a.copy].filter(Boolean).join(' / ') }] }, warnings };
    }
  }
};

export const COMMAND_IDS = Object.keys(COMMANDS);

export function isSubstantive(op) {
  const c = COMMANDS[op.command];
  if (!c) return true;
  if (typeof c.isSubstantive === 'function') return c.isSubstantive(op.args || {});
  return !!c.substantive;
}

/** Validate one op (command exists + schema + policy). ctx.intent is the producer's request text. */
export function validateOp(op, ctx = {}) {
  const c = COMMANDS[op?.command];
  if (!c) return [`알 수 없는 명령 ${op?.command || '(없음)'} — 실행하지 않습니다.`];
  try { return c.validate.call(c, op.args || {}, ctx); } catch (e) { return [e.message]; }
}

/** Dry-run: apply ops in order to a copy, collecting previews. Never mutates the input. */
export function dryRun(state, ops, ctx = {}) {
  let cur = clone(state);
  return ops.map((op) => {
    const errors = validateOp(op, ctx);
    if (errors.length) return { op, ok: false, errors, substantive: isSubstantive(op) };
    try {
      const c = COMMANDS[op.command];
      const r = c.apply.call(c, cur, op.args || {});
      cur = r.state;
      return { op, ok: true, preview: r.preview, warnings: r.warnings || [], substantive: isSubstantive(op), label: c.label, text: c.describe.call(c, op.args || {}) };
    } catch (e) {
      return { op, ok: false, errors: [e.message], substantive: isSubstantive(op) };
    }
  });
}

/** Apply accepted ops; returns the new state and a change log entry list. */
export function applyOps(state, ops, ctx = {}) {
  let cur = clone(state);
  const log = [];
  ops.forEach((op) => {
    const errors = validateOp(op, ctx);
    if (errors.length) throw new Error(errors.join(' '));
    const c = COMMANDS[op.command];
    const r = c.apply.call(c, cur, op.args || {});
    cur = r.state;
    log.push({ command: op.command, label: c.label, text: c.describe.call(c, op.args || {}), source: op.source || 'rules', substantive: isSubstantive(op), summary: r.preview?.summary || '' });
  });
  return { state: cur, log };
}

/** Machine-readable catalog for the planner prompt. */
export function catalogSpec() {
  return [
    'text.replace {find:string, replace:string, chapter?:idx} — 원고의 문구를 그대로 찾아 바꾼다(정확히 일치하는 문자열).',
    'text.insert {chapter:idx, position:"start"|"end", text:string} — 제작자가 준 문단만 넣는다.',
    'chapter.retitle {chapter:idx, title:string, keepLabel?:boolean} — 장 제목 교체(“제3장” 같은 장 번호는 유지).',
    'chapter.add {title:string, text:string, after?:idx} — 제작자가 준 글로 장 추가(맺음말·감사의 말 등).',
    `meta.set {field:${COMMANDS['meta.set'].fields.join('|')}, value:string}`,
    `design.set {profile?:auto|${Object.keys(DESIGN_PROFILES).join('|')}, density?:${DENSITY_OPTIONS.map((d) => d.key).join('|')}, trim?:${TRIM_PRESETS.map((t) => t.key).join('|')}, optimize?:boolean}`,
    'premium.dedication {text:string} — 헌사(빈 문자열이면 삭제). 제작자가 준 문장만.',
    'premium.epigraph {text:string, source:string} — 책 첫머리 제사. 제작자가 준 인용만, 출처 필수.',
    'premium.chapterEpigraph {chapter:idx, text:string, source:string} — 장 제사.',
    `cover.set {template?:genre|${Object.keys(COVER_TEMPLATES).join('|')}, color?:"#RRGGBB", backCopy?:string, tagline?:string, authorBio?:string, flaps?:boolean, paper?:mojo80|mojo100|white80|elite70|elite80, draft?:boolean} — 문구를 편집 엔진이 새로 썼다면 draft:true.`,
    'cover.endorsements {items:[{quote, name, role?}], mode?:"replace"|"append"|"clear"} — 제작자가 준 추천사만. 절대 지어내지 않는다.',
    `cover.finish {type:${Object.keys(FINISH_TYPES).join('|')}, targets:[${Object.keys(FINISH_TARGETS).join('|')}]}`,
    'cover.band {enabled?:boolean, heightMm?:40~120, headline:string, copy?:string, endorsement?:string, color?:"#RRGGBB", draft?:boolean} — 띠지.'
  ].join('\n');
}
