// Print interior PDF: genre-aware Korean book layout with trim/bleed boxes, embedded fonts, K-only ink.
// Pipeline: font context (once) -> layout candidates (cheap, measured) -> render the chosen layout.
import {
  PDFDocument,
  beginText,
  endText,
  setFontAndSize,
  setTextMatrix,
  showText,
  setCharacterSpacing,
  setFillingCmykColor,
  rectangle,
  fill,
  cmyk
} from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { breakLine, justifyLine } from './koreanLineBreak';
import { parseBookStructure, structureCanonicalText, canonicalChars, nfc } from './bookStructure';
import { resolveDesign, FONT_FAMILIES } from './designProfiles';

// Tints of the single K plate. Decorative marks and running feet sit lighter than the text.
export const NO_LIGATURES = { liga: false, clig: false, dlig: false, hlig: false };

const TINT = { text: 1, foot: 0.62, label: 0.55, rule: 0.45, ring: 0.5 };

export { TRIM_PRESETS } from './presets';

export const PT_PER_MM = 72 / 25.4;
const mm = (value) => Number(value) * PT_PER_MM;
const toMm = (pt) => Math.round((pt / PT_PER_MM) * 100) / 100;

const LIST_MARKER_RE = /^(\d{1,2}[.)]|[-•·▪■□○●◦※✓✔]|[①-⑳]|[가-하][.)]|\(\d{1,2}\))(?=\s)/;

// fontkit reads past the end of buffer for a trailing zero-length glyph in some TTFs.
// Padding the in-memory copy (not the distributed file) avoids that without altering glyph data.
export function padFontBytes(bytes) {
  const src = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  const out = new Uint8Array(src.length + 64);
  out.set(src);
  return out;
}

// Kept for compatibility: the humanities profile is the historic default.
export function defaultInteriorLayout(trimWidthMm, trimHeightMm) {
  const d = resolveDesign('humanities', trimWidthMm, trimHeightMm);
  return { bodySize: d.bodySize, leading: d.leading, indentEm: d.indentEm, marginsMm: d.marginsMm, spaceEm: d.spaceEm, maxLetterSpacingEm: d.maxLetterSpacingEm };
}

function charCount(text) {
  return Array.from(String(text || '')).length;
}

const ROLE_KEYS = {
  serif: { regular: 'regular', bold: 'bold', black: 'extraBold' },
  sans: { regular: 'sansRegular', bold: 'sansBold', black: 'sansExtraBold' }
};

// ---------------------------------------------------------------- font context
export async function createFontContext(fonts, { text = '', needSans = false } = {}) {
  if (!fonts?.regular || !fonts?.bold || !fonts?.extraBold) throw new Error('인쇄용 서체 파일을 불러오지 못했습니다.');
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  const pdfFonts = {};
  const glyphFonts = {};
  const bySource = new Map();
  const embed = async (key, bytes) => {
    // One file serving two roles (고운바탕 Bold as ExtraBold) is embedded once.
    const same = bySource.get(bytes);
    if (same) { pdfFonts[key] = pdfFonts[same]; glyphFonts[key] = glyphFonts[same]; return; }
    bySource.set(bytes, key);
    const padded = padFontBytes(bytes);
    // subset:false — pdf-lib's CJK subsetting drops glyphs; full embedding renders reliably.
    // Ligatures off: pdf-lib records a ligature glyph (e.g. "ff" in Gowun Batang) with the wrong
    // advance, which pushes the rest of the word into the next word gap.
    pdfFonts[key] = await doc.embedFont(padded, { subset: false, features: NO_LIGATURES });
    glyphFonts[key] = fontkit.create(padded);
  };
  await embed('regular', fonts.regular);
  await embed('bold', fonts.bold);
  await embed('extraBold', fonts.extraBold);
  const sansAvailable = !!(needSans && fonts.sansRegular && fonts.sansBold && fonts.sansExtraBold);
  if (sansAvailable) {
    await embed('sansRegular', fonts.sansRegular);
    await embed('sansBold', fonts.sansBold);
    await embed('sansExtraBold', fonts.sansExtraBold);
  }
  const needsFallback = Array.from(nfc(text)).some((ch) => !/\s/.test(ch) && !glyphFonts.regular.hasGlyphForCodePoint(ch.codePointAt(0)));
  if (fonts.fallback && needsFallback) await embed('fallback', fonts.fallback);

  const runCache = new Map();
  const runsFor = (fontKey, value) => {
    const key = `${fontKey}\u0000${value}`;
    let runs = runCache.get(key);
    if (runs) return runs;
    runs = [];
    Array.from(String(value || '')).forEach((ch) => {
      const cp = ch.codePointAt(0);
      const useFallback = glyphFonts.fallback && !glyphFonts[fontKey].hasGlyphForCodePoint(cp) && glyphFonts.fallback.hasGlyphForCodePoint(cp);
      const font = useFallback ? 'fallback' : fontKey;
      const last = runs[runs.length - 1];
      if (last && last.font === font) last.text += ch;
      else runs.push({ font, text: ch });
    });
    runCache.set(key, runs);
    return runs;
  };
  const widthOf = (fontKey, value, size) => runsFor(fontKey, value)
    .reduce((sum, run) => sum + pdfFonts[run.font].widthOfTextAtSize(run.text, size), 0);
  const measurers = new Map();
  const measureFor = (fontKey, size) => {
    const key = `${fontKey}@${size}`;
    let fn = measurers.get(key);
    if (!fn) {
      const cache = new Map();
      fn = (value) => {
        const k = String(value);
        if (!k) return 0;
        let w = cache.get(k);
        if (w === undefined) { w = widthOf(fontKey, k, size); cache.set(k, w); }
        return w;
      };
      measurers.set(key, fn);
    }
    return fn;
  };
  const roleKey = (role, weight) => {
    const family = role === 'sans' && sansAvailable ? 'sans' : 'serif';
    return ROLE_KEYS[family][weight];
  };
  return { doc, pdfFonts, glyphFonts, runsFor, widthOf, measureFor, roleKey, sansAvailable };
}

// ---------------------------------------------------------------- layout
export function layoutInterior(ctx, input, design) {
  const {
    title = '', author = '', publisher = '', isbn = '', price = '', firstEdition = '', registration = '', contact = '',
    trimWidthMm = 140, trimHeightMm = 210, bleedMm = 3, pageMultiple = 4, includeToc = true, includeCopyright = true,
    structure, art = []
  } = input;
  const { runsFor, widthOf, measureFor, pdfFonts, roleKey } = ctx;
  const W = mm(trimWidthMm);
  const H = mm(trimHeightMm);
  const margins = design.marginsMm;
  const top = mm(margins.top);
  const bottom = mm(margins.bottom);
  const inner = mm(margins.inner);
  const outer = mm(margins.outer);
  const textW = W - inner - outer;
  const textH = H - top - bottom;
  const size = design.bodySize;
  const lead = design.leading;
  const LPP = Math.floor((textH - size) / lead) + 1;
  const firstBaseline = H - top - size * 0.86;
  const baselineAt = (line) => firstBaseline - line * lead;
  const bookTitle = nfc(title || '제목 없음').trim();

  const F = {
    body: 'regular',
    bodyBold: 'bold',
    head: roleKey(design.headingFont, 'bold'),
    headBlack: roleKey(design.headingFont, 'black'),
    run: roleKey(design.runningHead?.font || 'serif', 'regular'),
    section: roleKey(design.section?.font || 'serif', 'bold')
  };

  const measureBody = measureFor(F.body, size);
  const spaceW = size * design.spaceEm;
  const indentW = size * design.indentEm;
  const hangW = size * (design.hangEm || 0);
  const maxTc = size * design.maxLetterSpacingEm;

  const stats = {
    splitWords: 0, letterSpacedLines: 0, maxLetterSpacingEm: 0, orphansAvoided: 0, widowsAvoided: 0,
    shortPages: 0, runtPages: 0, overflowLines: 0, blankPagesForRecto: 0, paddingPages: 0, listItems: 0,
    // Source lines (as the author broke them) that did not fit the measure and gained a break.
    wrappedSourceLines: 0, partPages: 0, artPlaced: 0
  };
  const placed = [];
  const usedChars = {};
  const noteChars = (fontKey, value) => {
    if (!usedChars[fontKey]) usedChars[fontKey] = new Set();
    Array.from(String(value || '')).forEach((ch) => { if (!/\s/.test(ch)) usedChars[fontKey].add(ch); });
  };

  const pages = [];
  const newPage = (kind, extra = {}) => {
    const p = { kind, items: [], rules: [], art: [], runningHead: false, folio: false, chapterTitle: '', ...extra };
    pages.push(p);
    return p;
  };
  const addItem = (pg, item) => {
    let x = item.x;
    runsFor(item.font, item.text).forEach((run) => {
      pg.items.push({ ...item, font: run.font, text: run.text, x });
      noteChars(run.font, run.text);
      x += pdfFonts[run.font].widthOfTextAtSize(run.text, item.size) + item.tc * charCount(run.text);
    });
  };
  const textWidth = (fontKey, value, fontSize, tc = 0) => widthOf(fontKey, value, fontSize) + tc * Math.max(0, charCount(value) - 1);
  const put = (pg, value, fontKey, fontSize, y, align = 'left', { tc = 0, x = 0, k = TINT.text } = {}) => {
    const w = textWidth(fontKey, value, fontSize, tc);
    const px = align === 'center' ? (textW - w) / 2 : align === 'right' ? textW - w : x;
    addItem(pg, { font: fontKey, size: fontSize, x: px, y, text: value, tc, ...(k !== TINT.text ? { k } : {}) });
  };
  const breakFor = (value, fontKey, fontSize, width) => {
    const run = (w) => breakLine(value, { width: w, indent: 0, measure: measureFor(fontKey, fontSize), spaceWidth: fontSize * design.spaceEm, looseRatio: 2 });
    const base = run(width);
    if (base.length < 2) return base.map((line) => line.words.join(' '));
    let lo = width * 0.4;
    let hi = width;
    for (let i = 0; i < 14; i += 1) {
      const mid = (lo + hi) / 2;
      if (run(mid).length > base.length) lo = mid; else hi = mid;
    }
    return run(hi).map((line) => line.words.join(' '));
  };

  // 1) Title page
  const tp = newPage('title');
  const titleSize = Math.min(22, size * 2.2);
  const tAlign = design.titlePage === 'left' ? 'left' : 'center';
  const titleFont = design.headingFont === 'sans' ? F.headBlack : 'extraBold';
  let ty = H * (tAlign === 'left' ? 0.74 : 0.68);
  breakFor(bookTitle, titleFont, titleSize, textW * 0.86).forEach((line) => {
    put(tp, line, titleFont, titleSize, ty, tAlign);
    ty -= titleSize * 1.45;
  });
  if (author) put(tp, nfc(author), 'regular', size * 1.1, ty - size * 1.6, tAlign);
  if (publisher) put(tp, nfc(publisher), F.head, size * 0.95, bottom + size * 1.5, tAlign);
  newPage('blank');

  // 2) TOC
  const titled = structure.chapters.filter((c) => !c.untitled);
  const useToc = includeToc && titled.length >= 2;
  const tocLayout = [];
  let tocPageCount = 0;
  const tocGap = design.key === 'poetry' ? 0 : 1;
  if (useToc) {
    const tocSink = Math.max(2, Math.round(LPP * 0.16));
    const hasLabels = titled.some((c) => c.label);
    const labelCol = hasLabels ? Math.min(mm(18), Math.max(...titled.map((c) => widthOf(F.head, c.label || '', size * 0.9))) + mm(4)) : 0;
    const titleWidth = textW - labelCol - mm(10);
    let line = tocSink + 3;
    let pageIndex = 0;
    titled.forEach((chapter) => {
      const linesForTitle = breakFor(chapter.title || chapter.label, 'regular', size, titleWidth);
      if (line + linesForTitle.length > LPP) { pageIndex += 1; line = 1; }
      tocLayout.push({ chapter, pageIndex, line, lines: linesForTitle, labelCol });
      line += linesForTitle.length + tocGap;
    });
    tocPageCount = pageIndex + 1;
    for (let i = 0; i < tocPageCount; i += 1) {
      const pg = newPage('toc');
      if (i === 0) put(pg, '차례', F.head, size * 1.3, baselineAt(tocSink), design.titlePage === 'left' ? 'left' : 'center');
    }
  }
  if (pages.length % 2 === 1) newPage('blank');

  // 3) Body
  let page = null;
  let cursor = 0;
  let chapterTitle = '';
  const startBodyPage = () => {
    page = newPage('body', { runningHead: !!design.runningHead, folio: true, chapterTitle });
    cursor = 0;
  };

  const placeTypesetLine = (line, lineIndex, { fontKey = F.body, fontSize = size, align = design.align } = {}) => {
    const measure = fontKey === F.body && fontSize === size ? measureBody : measureFor(fontKey, fontSize);
    const gapBase = fontSize * design.spaceEm;
    const y = baselineAt(lineIndex);
    if (align === 'center') {
      put(page, line.words.join(' '), fontKey, fontSize, y, 'center');
      placed.push(line.words.join(''));
      return;
    }
    const just = align === 'justify'
      ? justifyLine(line, { width: textW, measure, spaceWidth: gapBase, maxLetterSpacing: maxTc })
      : { gap: gapBase, letterSpacing: 0, overflow: Math.max(0, line.naturalWidth - textW) };
    if (just.letterSpacing > 0.001) {
      stats.letterSpacedLines += 1;
      stats.maxLetterSpacingEm = Math.max(stats.maxLetterSpacingEm, just.letterSpacing / fontSize);
    }
    if (just.overflow > 0.5) stats.overflowLines += 1;
    if (line.split) stats.splitWords += 1;
    let x = line.indent;
    line.words.forEach((word) => {
      addItem(page, { font: fontKey, size: fontSize, x, y, text: word, tc: just.letterSpacing });
      x += measure(word) + just.letterSpacing * charCount(word) + just.gap;
    });
    placed.push(line.words.join(''));
  };

  const placeLines = (lines, options, { keepTogether = false } = {}) => {
    if (keepTogether && page && lines.length <= LPP && cursor + lines.length > LPP && cursor > 0) {
      stats.shortPages += 1;
      startBodyPage();
    }
    let i = 0;
    while (i < lines.length) {
      // The cursor can sit between grid lines (paragraph gaps of a quarter line), so the room
      // left is counted in whole lines.
      if (!page || cursor > LPP - 1 + 1e-6) startBodyPage();
      const remaining = Math.floor(LPP - cursor + 1e-6);
      const left = lines.length - i;
      let take = Math.min(left, remaining);
      if (take < left) {
        if (i === 0 && take === 1 && left >= 2) {
          take = 0;
          stats.orphansAvoided += 1;
        } else if (left - take === 1 && take >= 2) {
          take -= 1;
          stats.widowsAvoided += 1;
          if (i === 0 && take === 1) take = 0;
        }
      }
      if (take === 0) {
        stats.shortPages += 1;
        startBodyPage();
        continue;
      }
      for (let k = 0; k < take; k += 1) placeTypesetLine(lines[i + k], cursor + k, options);
      cursor += take;
      i += take;
    }
  };

  const rule = (pg, x, y, w, thicknessPt, k = TINT.text) => pg.rules.push({ x, y, w, h: thicknessPt, ...(k !== TINT.text ? { k } : {}) });
  const record = (value) => placed.push(String(value).replace(/\s+/g, ''));
  // Chapters that belong to a part, for the part page's contents list (decoration, not recorded).
  const partMembers = new Map();
  {
    let currentPart = null;
    structure.chapters.forEach((c) => {
      if (c.part) { currentPart = c; partMembers.set(c, []); return; }
      if (currentPart && !c.untitled && !c.named) partMembers.get(currentPart).push(c);
      else if (c.named) currentPart = null;
    });
  }
  let artCursor = 0;
  const nextArt = () => (art.length ? art[(artCursor++) % art.length] : null);
  let chapterOrdinal = 0;

  // Part page: decorative numeral, the label and title exactly as written, a hairline and the
  // chapters of the part. Everything printed from the manuscript is recorded; the numeral and
  // the contents list are design repeats and are not.
  const openPart = (chapter) => {
    const sink = Math.max(3, Math.round(LPP * 0.15));
    let li = sink;
    const digits = (String(chapter.label).match(/\d+/) || [''])[0];
    if (digits) {
      put(page, digits, 'regular', size * 4.6, baselineAt(li + 1), 'left');
      li += 3.4;
    }
    if (chapter.label) {
      put(page, chapter.label, F.head, size * 0.8, baselineAt(li), 'left', { tc: size * 0.18, k: TINT.label });
      record(chapter.label);
      li += 2;
    }
    const hs = size * 1.55;
    const step = (hs * 1.55) / lead;
    breakFor(chapter.title || '', F.head, hs, textW * 0.9).forEach((t) => {
      if (!t) return;
      put(page, t, F.head, hs, baselineAt(li), 'left');
      record(t);
      li += step;
    });
    li += 0.6;
    rule(page, 0, baselineAt(li), textW * 0.72, 0.4, TINT.rule);
    li += 1.4;
    const listSize = size * 0.82;
    (partMembers.get(chapter) || []).forEach((c) => {
      if (li > LPP - 4) return;
      breakFor(c.title || c.label, 'regular', listSize, textW * 0.9).forEach((t) => {
        put(page, t, 'regular', listSize, baselineAt(li), 'left', { k: TINT.foot });
        li += (listSize * 1.7) / lead;
      });
    });
    // Up to three small illustrations along the foot of the page.
    if (art.length >= 3) {
      const h = Math.min(mm(22), (LPP - li - 1) * lead);
      if (h > mm(10)) {
        const picks = [0, 1, 2].map((n) => art[n]);
        const widths = picks.map((a, n) => (n === 1 ? h : h * 0.74) * (a.width / a.height));
        const gap = mm(4);
        let x = (textW - widths.reduce((s, w) => s + w, 0) - gap * 2) / 2;
        const baseY = baselineAt(LPP - 1) - size * 0.2;
        picks.forEach((a, n) => {
          const ih = n === 1 ? h : h * 0.74;
          page.art.push({ type: 'image', art: a, x, y: baseY, w: widths[n], h: ih });
          x += widths[n] + gap;
        });
        stats.artPlaced += 3;
      }
    }
    stats.partPages += 1;
  };

  const openChapter = (chapter) => {
    const style = design.opener.style;
    const sink = Math.max(style === 'poem' ? 1 : 3, Math.round(LPP * design.opener.sink));
    let li = sink;
    const label = chapter.label || '';
    const titleText = chapter.title || '';

    if (style === 'moon') {
      // Ordinal (design element) only on numbered body chapters, never on 시작하며·마치며 etc.
      if (design.opener.autoNumber && !chapter.named && !label) {
        chapterOrdinal += 1;
        put(page, String(chapterOrdinal).padStart(2, '0'), 'regular', size * 0.82, baselineAt(li), 'left', { tc: size * 0.28, k: TINT.label });
        li += 1.6;
      } else if (label) {
        put(page, label, F.head, size * 0.82, baselineAt(li), 'left', { tc: size * 0.2, k: TINT.label });
        record(label);
        li += 1.6;
      }
      const hs = size * 1.4;
      const step = (hs * 1.62) / lead;
      breakFor(titleText, F.head, hs, textW * 0.92).forEach((t) => {
        if (!t) return;
        put(page, t, F.head, hs, baselineAt(li), 'left');
        record(t);
        li += step;
      });
      // The moon: a thin ring, and the vessel beneath it. They never overlap, so an opaque
      // illustration needs no transparency and the ring never crosses the drawing.
      // Diagonal: the moon high on the outer side, the vessel low on the inner side. The vessel's
      // box starts below the ring, so the two never overlap.
      const floorY = baselineAt(LPP - 1) - size * 0.3;
      const room = baselineAt(li + 1.2) - floorY;
      const a = nextArt();
      const r = Math.min(textW * 0.23, room * (a ? 0.21 : 0.34));
      if (r > mm(8)) {
        const cx = textW * 0.66;
        const cy = baselineAt(li + 1.8) - r - mm(2);
        page.art.push({ type: 'ring', cx, cy, r, k: TINT.ring, w: 0.45 });
        if (a) {
          const top = cy - r - mm(1.5);
          const space = top - floorY;
          let iw = textW * 0.44;
          let ih = iw * (a.height / a.width);
          if (ih > space) { ih = space; iw = ih * (a.width / a.height); }
          if (ih > mm(12)) {
            page.art.push({ type: 'image', art: a, x: textW * 0.36 - iw / 2, y: top - ih, w: iw, h: ih });
            stats.artPlaced += 1;
          }
        }
      }
      cursor = LPP; // full-page opener: the text begins on the next page
      return;
    }

    if (style === 'numeral') {
      if (label) {
        const numeric = /^\d{1,3}$/.test(label);
        const s = numeric ? size * 3 : size * 1.6;
        li = sink + (numeric ? 2 : 1);
        put(page, label, numeric ? 'extraBold' : F.head, s, baselineAt(li), 'center', { tc: numeric ? 0 : size * 0.06 });
        record(label);
        li += numeric ? 3 : 2;
      }
      breakFor(titleText, F.head, size * 1.35, textW * 0.8).forEach((t) => {
        if (!t) return;
        put(page, t, F.head, size * 1.35, baselineAt(li), 'center');
        record(t);
        li += 2;
      });
      cursor = li + 2;
      return;
    }
    if (style === 'left-title') {
      if (label) {
        put(page, label, F.head, size * 0.9, baselineAt(li), 'left', { tc: size * 0.05 });
        record(label);
        li += 2;
      }
      const hs = size * 1.45;
      breakFor(titleText, F.head, hs, textW * 0.85).forEach((t) => {
        if (!t) return;
        put(page, t, F.head, hs, baselineAt(li), 'left');
        record(t);
        li += 2;
      });
      rule(page, 0, baselineAt(li - 1) + size * 0.2, mm(18), 0.45);
      cursor = li + 1;
      return;
    }
    if (style === 'sans-block') {
      if (label) {
        li = sink + 1;
        put(page, label, F.headBlack, size * 2.1, baselineAt(li), 'left');
        record(label);
        li += 2;
      }
      const hs = size * 1.5;
      breakFor(titleText, F.head, hs, textW * 0.9).forEach((t) => {
        if (!t) return;
        put(page, t, F.head, hs, baselineAt(li), 'left');
        record(t);
        li += 2;
      });
      rule(page, 0, baselineAt(li - 1) + size * 0.25, textW, 0.6);
      cursor = li + 1;
      return;
    }
    if (style === 'poem') {
      const hs = size * 1.15;
      if (label) { put(page, label, F.head, size * 0.9, baselineAt(li), 'left'); record(label); li += 1; }
      breakFor(titleText, F.head, hs, textW).forEach((t) => {
        if (!t) return;
        put(page, t, F.head, hs, baselineAt(li), 'left');
        record(t);
        li += 1;
      });
      cursor = li + 2;
      return;
    }
    // 'label-title' (default)
    if (label) {
      put(page, label, F.head, size * 0.95, baselineAt(li), 'center', { tc: size * 0.08 });
      record(label);
      li += 2;
    }
    const hs = Math.min(17, size * 1.6);
    breakFor(titleText, F.head, hs, textW * 0.82).forEach((t) => {
      if (!t) return;
      put(page, t, F.head, hs, baselineAt(li), 'center');
      record(t);
      li += 2;
    });
    cursor = li + 2;
  };

  const chapterStarts = [];
  const poem = design.opener.style === 'poem';

  structure.chapters.forEach((chapter, chapterIndex) => {
    chapterTitle = chapter.untitled ? bookTitle : (chapter.title || chapter.label);
    if (design.opener.recto && pages.length % 2 === 1) {
      newPage('blank');
      if (chapterIndex > 0) stats.blankPagesForRecto += 1;
    }
    const opener = !chapter.untitled;
    const partPage = !!(chapter.part && design.parts);
    page = newPage('body', {
      runningHead: chapter.untitled && !!design.runningHead,
      folio: chapter.untitled || poem,
      chapterTitle,
      chapterOpen: opener && !poem
    });
    cursor = 0;
    const chapterOpenPage = page;
    chapterStarts.push({ chapter, pageNumber: pages.length });
    // Bibliography / endnotes: smaller type on a tighter sub-grid with a hanging indent. Entries wrap
    // freely (they are references, not the author's lines), so they are not counted as broken lines.
    const notesMode = !!(design.parts && chapter.named && /^(참고\s?문헌|미주)/.test(chapter.title || ''));
    if (partPage) {
      openPart(chapter);
      cursor = LPP;
    } else if (notesMode) {
      // A plain heading, no illustration: the references start on the same page.
      const sink = Math.max(3, Math.round(LPP * design.opener.sink));
      put(page, chapter.title, F.head, size * 1.25, baselineAt(sink), 'left');
      record(chapter.title);
      cursor = sink + 2.5;
    } else if (opener) openChapter(chapter);

    let first = true;
    let prevType = null;
    if (notesMode) {
      const ns = size * 0.8;
      const step = (ns * 1.5) / lead;
      const measureNote = measureFor(F.body, ns);
      const hang = ns * 1.5;
      chapter.blocks.forEach((block) => {
        const text = block.type === 'p' ? block.lines.join(' ') : block.text;
        const lines = breakLine(text, { width: textW, indent: 0, hangIndent: hang, measure: measureNote, spaceWidth: ns * design.spaceEm });
        if (cursor > 0 && cursor < LPP) cursor += 0.35;
        lines.forEach((line) => {
          if (!page || cursor > LPP - 1 + 1e-6) startBodyPage();
          let x = line.indent;
          line.words.forEach((word) => {
            addItem(page, { font: F.body, size: ns, x, y: baselineAt(cursor), text: word, tc: 0 });
            x += measureNote(word) + ns * design.spaceEm;
          });
          placed.push(line.words.join(''));
          cursor += step;
        });
      });
      return;
    }
    chapter.blocks.forEach((block) => {
      if (block.type === 'p') {
        const typeset = [];
        const firstLine = block.lines[0] || '';
        const marker = firstLine.match(LIST_MARKER_RE);
        const isList = !poem && !!marker;
        if (isList) stats.listItems += 1;
        const hang = isList ? measureBody(marker[1]) + spaceW : hangW;
        block.lines.forEach((value, idx) => {
          const subMarker = isList && idx > 0 ? value.match(LIST_MARKER_RE) : null;
          const broken = breakLine(value, {
            width: textW,
            indent: isList ? (idx === 0 || subMarker ? 0 : hang) : (idx === 0 ? indentW : 0),
            hangIndent: isList ? (subMarker ? measureBody(subMarker[1]) + spaceW : hang) : (poem ? hangW : 0),
            measure: measureBody,
            spaceWidth: spaceW
          });
          if (broken.length > 1) stats.wrappedSourceLines += broken.length - 1;
          broken.forEach((line) => typeset.push(line));
        });
        if (design.stanzaGapLines && !first && cursor > 0 && cursor < LPP) cursor += design.stanzaGapLines;
        // Paragraph breath between consecutive paragraphs (not after a heading, not at a page top).
        if (design.paragraphGapLines && prevType === 'p' && cursor > 0 && cursor < LPP) cursor += design.paragraphGapLines;
        placeLines(typeset, { align: isList ? 'justify' : design.align }, { keepTogether: poem });
        first = false;
        prevType = 'p';
        return;
      }
      if (block.type === 'section') {
        const secSize = size * (design.section?.scale || 1.05);
        const secFont = F.section;
        const after = design.section?.after ?? 1;
        const secBreak = (w, loose) => breakLine(block.text, { width: w, indent: 0, measure: measureFor(secFont, secSize), spaceWidth: secSize * design.spaceEm, ...(loose ? { looseRatio: 2 } : {}) });
        let lines = secBreak(textW * 0.9, design.section?.balance);
        if (design.section?.balance && lines.length > 1) {
          // Word boundaries only, and two lines of similar length rather than a long line and a stub.
          let lo = textW * 0.45;
          let hi = textW * 0.9;
          for (let n = 0; n < 14; n += 1) {
            const mid = (lo + hi) / 2;
            if (secBreak(mid, true).length > lines.length) lo = mid; else hi = mid;
          }
          lines = secBreak(hi, true);
        }
        const before = cursor > 0 ? 1 : 0;
        // Keep the heading with at least two lines of its text.
        if (!page || Math.ceil(cursor + before) + lines.length + after + 2 > LPP) startBodyPage();
        if (cursor > 0) cursor = Math.ceil(cursor + 1 - 1e-6);
        if (design.section?.style === 'rule-left') {
          // Short hairline above the heading, clear of the cap height.
          rule(page, 0, baselineAt(cursor) + secSize * 0.82 + 5, mm(9), 0.4, TINT.rule);
        }
        lines.forEach((line) => {
          placeTypesetLine({ ...line, last: true }, cursor, { fontKey: secFont, fontSize: secSize, align: design.section?.style === 'center' ? 'center' : 'left' });
          cursor += 1;
        });
        cursor += after;
        first = false;
        prevType = 'section';
        return;
      }
      // scene break: printed exactly as written, centred
      if (!page || cursor + 2 > LPP) startBodyPage();
      if (cursor > 0) cursor += 1;
      put(page, block.text, F.body, size, baselineAt(cursor), 'center');
      placed.push(block.text.replace(/\s+/g, ''));
      cursor += 2;
      first = false;
    });
    // Runt page: a chapter whose last page carries only one or two lines wastes a leaf
    // and reads as a mistake. Counted so the leading optimiser can pull those lines back.
    if (page !== chapterOpenPage && cursor > 0 && cursor <= 2) stats.runtPages += 1;
  });

  // 4) Colophon + padding
  const copyrightRows = [];
  if (includeCopyright) {
    copyrightRows.push(['', bookTitle]);
    if (firstEdition) copyrightRows.push(['초판 1쇄 펴낸날', nfc(firstEdition)]);
    if (author) copyrightRows.push(['지은이', nfc(author)]);
    if (publisher) copyrightRows.push(['펴낸곳', nfc(publisher)]);
    if (registration) copyrightRows.push(['출판등록', nfc(registration)]);
    if (contact) copyrightRows.push(['연락처', nfc(contact)]);
    if (isbn) copyrightRows.push(['ISBN', String(isbn)]);
    if (price) copyrightRows.push(['값', `${String(price).replace(/[^0-9,]/g, '')}원`]);
  }
  const multiple = Math.max(2, Number(pageMultiple) || 2);
  const reserved = includeCopyright ? 1 : 0;
  while ((pages.length + reserved) % multiple !== 0) {
    newPage('blank');
    stats.paddingPages += 1;
  }
  if (includeCopyright) {
    const cp = newPage('copyright');
    const cpSize = Math.min(size * 0.82, lead * 0.62);
    let line = LPP - copyrightRows.length - 1;
    const labelW = Math.max(...copyrightRows.slice(1).map(([k]) => widthOf('regular', k, cpSize)), 0) + mm(5);
    copyrightRows.forEach(([label, value], idx) => {
      const y = baselineAt(line);
      if (idx === 0) {
        addItem(cp, { font: F.head, size: size * 0.95, x: 0, y, text: value, tc: 0 });
        line += 2;
        return;
      }
      addItem(cp, { font: 'regular', size: cpSize, x: 0, y, text: label, tc: 0 });
      addItem(cp, { font: 'regular', size: cpSize, x: labelW, y, text: value, tc: 0 });
      line += 1;
    });
  }

  // 5) TOC page numbers
  if (useToc) {
    const tocStart = pages.findIndex((p) => p.kind === 'toc');
    tocLayout.forEach((entry) => {
      const tocPage = pages[tocStart + entry.pageIndex];
      const start = chapterStarts.find((s) => s.chapter === entry.chapter);
      if (entry.chapter.label) {
        addItem(tocPage, { font: F.head, size: size * 0.9, x: 0, y: baselineAt(entry.line), text: entry.chapter.label, tc: 0 });
      }
      entry.lines.forEach((value, idx) => {
        addItem(tocPage, { font: 'regular', size, x: entry.labelCol, y: baselineAt(entry.line + idx), text: value, tc: 0 });
      });
      const num = String(start ? start.pageNumber : '');
      addItem(tocPage, { font: 'regular', size, x: textW - widthOf('regular', num, size), y: baselineAt(entry.line + entry.lines.length - 1), text: num, tc: 0 });
    });
  }

  // 6) Running heads + folios (decided per physical page)
  const runSize = size * 0.75;
  const folioSize = size * 0.8;
  pages.forEach((pg, index) => {
    const number = index + 1;
    const recto = number % 2 === 1;
    if (pg.kind !== 'body' || pg.chapterOpen) return;
    if (design.runningHead?.position === 'foot' && design.folio === 'foot-outside') {
      // One quiet line at the outer foot: "14   책 제목" on the left page, "장 제목   15" on the right.
      if (!pg.runningHead && !pg.folio) return;
      const num = String(number);
      const head = pg.runningHead ? (recto ? pg.chapterTitle : bookTitle) : '';
      const fs = size * 0.72;
      const y = bottom * 0.46;
      const gap = mm(3.5);
      const numW = textWidth(F.run, num, fs);
      const opts = { k: TINT.foot };
      if (recto) {
        put(pg, num, F.run, fs, y, 'right', opts);
        if (head) put(pg, head, F.run, fs, y, 'left', { ...opts, x: textW - numW - gap - textWidth(F.run, head, fs) });
      } else {
        put(pg, num, F.run, fs, y, 'left', opts);
        if (head) put(pg, head, F.run, fs, y, 'left', { ...opts, x: numW + gap });
      }
      return;
    }
    if (pg.runningHead && design.runningHead) {
      const mode = recto ? design.runningHead.recto : design.runningHead.verso;
      const headText = mode === 'author' ? (nfc(author) || bookTitle) : mode === 'chapter' ? pg.chapterTitle : bookTitle;
      put(pg, headText, F.run, runSize, H - top * 0.55, recto ? 'right' : 'left');
    }
    if (pg.folio) {
      const num = String(number);
      const align = design.folio === 'center' ? 'center' : recto ? 'right' : 'left';
      put(pg, num, F.run, folioSize, bottom * 0.5, align);
    }
  });

  return {
    pages, stats, placed, usedChars, chapterStarts, tocPageCount, copyrightRows,
    geometry: { W, H, top, bottom, inner, outer, textW, textH, LPP, size, lead, margins, multiple },
    fontsUsed: F
  };
}

// ---------------------------------------------------------------- render
export async function renderInterior(ctx, layout, { title = '', author = '', bleedMm = 3, generatedAt = new Date().toISOString() } = {}) {
  const { doc, pdfFonts } = ctx;
  const { W, H, inner, outer } = layout.geometry;
  const B = mm(bleedMm);
  const bookTitle = nfc(title || '제목 없음').trim();
  doc.setTitle(bookTitle);
  if (author) doc.setAuthor(nfc(author));
  doc.setSubject(`${bookTitle} — 인쇄용 내지`);
  doc.setCreator('ooOS Publishing OS');
  doc.setProducer('ooOS Publishing OS (pdf-lib)');
  doc.setLanguage('ko-KR');
  const stamp = new Date(generatedAt);
  doc.setCreationDate(stamp);
  doc.setModificationDate(stamp);

  // Illustrations are embedded once and reused on every page that shows them.
  const embedded = new Map();
  const embedArt = async (a) => {
    if (!embedded.has(a)) embedded.set(a, a.type === 'png' ? await doc.embedPng(a.bytes) : await doc.embedJpg(a.bytes));
    return embedded.get(a);
  };
  for (const logical of layout.pages) {
    for (const piece of logical.art || []) if (piece.type === 'image') await embedArt(piece.art);
  }

  layout.pages.forEach((logical, index) => {
    const recto = (index + 1) % 2 === 1;
    const left = recto ? inner : outer;
    const pdfPage = doc.addPage([W + 2 * B, H + 2 * B]);
    pdfPage.setMediaBox(0, 0, W + 2 * B, H + 2 * B);
    pdfPage.setBleedBox(0, 0, W + 2 * B, H + 2 * B);
    pdfPage.setTrimBox(B, B, W, H);
    const art = logical.art || [];
    if (!logical.items.length && !logical.rules.length && !art.length) return;

    // Art first, so text always sits on top.
    art.forEach((piece) => {
      if (piece.type === 'ring') {
        pdfPage.drawCircle({
          x: B + left + piece.cx, y: B + piece.cy, size: piece.r,
          borderColor: cmyk(0, 0, 0, piece.k ?? 1), borderWidth: piece.w || 0.5
        });
      } else if (piece.type === 'image') {
        pdfPage.drawImage(embedded.get(piece.art), { x: B + left + piece.x, y: B + piece.y, width: piece.w, height: piece.h });
      }
    });

    let currentK = 1;
    const ops = [setFillingCmykColor(0, 0, 0, 1)];
    const tint = (k = 1) => { if (k !== currentK) { ops.push(setFillingCmykColor(0, 0, 0, k)); currentK = k; } };
    logical.rules.forEach((r) => { tint(r.k ?? 1); ops.push(rectangle(B + left + r.x, B + r.y, r.w, r.h), fill()); });
    if (logical.items.length) {
      const keys = {};
      const keyFor = (fontKey) => {
        if (!keys[fontKey]) keys[fontKey] = pdfPage.node.newFontDictionary(pdfFonts[fontKey].name, pdfFonts[fontKey].ref);
        return keys[fontKey];
      };
      ops.push(beginText());
      let currentTc = 0;
      logical.items.forEach((item) => {
        tint(item.k ?? 1);
        ops.push(setFontAndSize(keyFor(item.font), item.size));
        if (item.tc !== currentTc) { ops.push(setCharacterSpacing(item.tc)); currentTc = item.tc; }
        ops.push(setTextMatrix(1, 0, 0, 1, B + left + item.x, B + item.y));
        ops.push(showText(pdfFonts[item.font].encodeText(item.text)));
      });
      if (currentTc !== 0) ops.push(setCharacterSpacing(0));
      ops.push(endText());
    }
    pdfPage.pushOperators(...ops);
  });
  return doc.save({ useObjectStreams: false });
}

function scoreLayout(layout, candidate) {
  const s = layout.stats;
  return s.paddingPages * 3 + s.blankPagesForRecto + s.shortPages * 0.5 + (s.runtPages || 0) * 2 + s.overflowLines * 10 + (candidate.leadingDelta ? 0.3 : 0);
}

/**
 * @param {object} input
 * @param {string} [input.designProfile] fiction | essay | humanities | practical | poetry
 * @param {'airy'|'standard'|'compact'} [input.density]
 * @param {boolean} [input.optimize] compare leading variants and keep the one with the fewest blank/short pages
 */
export async function buildInteriorPdf({
  title = '',
  author = '',
  publisher = '',
  manuscript = '',
  isbn = '',
  price = '',
  firstEdition = '',
  registration = '',
  contact = '',
  trimWidthMm = 140,
  trimHeightMm = 210,
  bleedMm = 3,
  pageMultiple = 4,
  includeToc = true,
  includeCopyright = true,
  designProfile = 'humanities',
  density = 'standard',
  optimize = true,
  fonts,
  openerArt = [],
  generatedAt = new Date().toISOString()
} = {}) {
  if (!String(manuscript || '').trim()) throw new Error('조판할 원고가 없습니다.');
  const bookTitle = nfc(title || '제목 없음').trim();
  const structure = parseBookStructure(manuscript, { title: bookTitle });
  const base = resolveDesign(designProfile, trimWidthMm, trimHeightMm, { density });
  const needSans = base.headingFont === 'sans' || base.runningHead?.font === 'sans' || base.section?.font === 'sans';
  const ctx = await createFontContext(fonts, { text: `${manuscript}${title}${author}${publisher}`, needSans });
  const art = (openerArt || []).filter((a) => a?.bytes && a.width > 0 && a.height > 0 && (a.type === 'png' || a.type === 'jpg'));

  const input = { title, author, publisher, isbn, price, firstEdition, registration, contact, trimWidthMm, trimHeightMm, bleedMm, pageMultiple, includeToc, includeCopyright, structure, art };
  // Author-locked leading is never traded for page count.
  const deltas = optimize && !base.lockLeading ? [0, -0.04, 0.04] : [0];
  const candidates = deltas.map((leadingDelta) => {
    const design = resolveDesign(designProfile, trimWidthMm, trimHeightMm, { density, leadingDelta });
    const layout = layoutInterior(ctx, input, design);
    return { leadingDelta, design, layout, score: scoreLayout(layout, { leadingDelta }) };
  });
  const best = candidates.slice().sort((a, b) => a.score - b.score)[0];
  const { layout, design } = best;
  const bytes = await renderInterior(ctx, layout, { title, author, bleedMm, generatedAt });

  // glyph coverage
  const missingGlyphs = [];
  let fallbackChars = 0;
  Object.entries(layout.usedChars).forEach(([fontKey, set]) => {
    set.forEach((ch) => {
      const cp = ch.codePointAt(0);
      if (fontKey === 'fallback') fallbackChars += 1;
      if (!ctx.glyphFonts[fontKey].hasGlyphForCodePoint(cp)) {
        missingGlyphs.push({ font: fontKey, char: ch, codePoint: `U+${cp.toString(16).toUpperCase().padStart(4, '0')}` });
      }
    });
  });

  const expected = structureCanonicalText(structure);
  const actual = canonicalChars(layout.placed.join(''));
  let firstMismatch = -1;
  if (expected !== actual) {
    const max = Math.min(expected.length, actual.length);
    for (let i = 0; i < max; i += 1) if (expected[i] !== actual[i]) { firstMismatch = i; break; }
    if (firstMismatch < 0) firstMismatch = max;
  }

  const g = layout.geometry;
  const B = mm(bleedMm);
  const fontName = (key) => ctx.pdfFonts[key]?.name || null;
  return {
    bytes,
    pageCount: layout.pages.length,
    structure,
    design: {
      profile: design.key,
      label: design.label,
      summary: design.summary,
      density: design.density,
      leadingRatio: design.leadingRatio,
      opener: design.opener.style,
      runningHead: design.runningHead ? `${design.runningHead.verso}/${design.runningHead.recto}` : 'none',
      folio: design.folio,
      headingFont: ctx.sansAvailable && design.headingFont === 'sans' ? '나눔고딕' : (FONT_FAMILIES[fonts.family]?.label || '나눔명조'),
      bodyFont: FONT_FAMILIES[fonts.family]?.label || '나눔명조',
      fontRequested: FONT_FAMILIES[design.fontFamily || 'nanum']?.label,
      fontSubstituted: (design.fontFamily || 'nanum') !== (fonts.family || 'nanum'),
      paragraphGapPt: design.paragraphGapLines ? Math.round(design.paragraphGapLines * design.leading * 100) / 100 : 0,
      leadingLocked: !!design.lockLeading,
      candidates: candidates.map((c) => ({
        leadingRatio: c.design.leadingRatio,
        linesPerPage: c.layout.geometry.LPP,
        pages: c.layout.pages.length,
        paddingPages: c.layout.stats.paddingPages,
        shortPages: c.layout.stats.shortPages,
        runtPages: c.layout.stats.runtPages,
        chosen: c === best
      }))
    },
    layout: {
      trimWidthMm: Number(trimWidthMm),
      trimHeightMm: Number(trimHeightMm),
      bleedMm: Number(bleedMm),
      pdfWidthMm: toMm(g.W + 2 * B),
      pdfHeightMm: toMm(g.H + 2 * B),
      bodySizePt: g.size,
      leadingPt: g.lead,
      linesPerPage: g.LPP,
      textWidthMm: toMm(g.textW),
      textHeightMm: toMm(g.textH),
      marginsMm: g.margins,
      approxCharsPerLine: Math.round(g.textW / g.size),
      pageMultiple: g.multiple,
      fonts: {
        body: fontName('regular'),
        heading: fontName(layout.fontsUsed.head),
        display: fontName(layout.fontsUsed.headBlack),
        fallback: fontName('fallback'),
        fallbackChars,
        embedding: 'full (CID TrueType, Identity-H)',
        license: [
          `SIL Open Font License 1.1 (${fonts.family === 'gowun' ? 'Gowun Batang' : 'Nanum Myeongjo'}`,
          ctx.sansAvailable ? '; Nanum Gothic' : '',
          ctx.pdfFonts.fallback ? '; ooOS Fallback Serif from Noto Serif KR' : '',
          ')'
        ].join('')
      },
      color: '1도 (K100), DeviceCMYK'
    },
    pages: {
      total: layout.pages.length,
      body: layout.pages.filter((p) => p.kind === 'body').length,
      front: layout.pages.findIndex((p) => p.kind === 'body'),
      toc: layout.tocPageCount,
      copyright: includeCopyright
    },
    chapters: layout.chapterStarts.map((s) => ({ label: s.chapter.label, title: s.chapter.untitled ? '' : s.chapter.title, startPage: s.pageNumber, ...(s.chapter.part ? { part: true } : {}) })),
    stats: layout.stats,
    missingGlyphs,
    completeness: {
      expectedChars: expected.length,
      placedChars: actual.length,
      match: expected === actual,
      firstMismatchIndex: firstMismatch,
      structureLossless: structure.lossless
    },
    copyrightFields: Object.fromEntries(layout.copyrightRows.slice(1).map(([k, v]) => [k, v])),
    sansUsed: ctx.sansAvailable
  };
}
