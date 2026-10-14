// Print interior PDF: paginated Korean book layout with trim/bleed boxes, embedded fonts, K-only text.
import {
  PDFDocument,
  beginText,
  endText,
  setFontAndSize,
  setTextMatrix,
  showText,
  setCharacterSpacing,
  setFillingCmykColor
} from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { breakLine, justifyLine } from './koreanLineBreak';
import { parseBookStructure, structureCanonicalText, canonicalChars, nfc } from './bookStructure';

export const PT_PER_MM = 72 / 25.4;
const mm = (value) => Number(value) * PT_PER_MM;
const toMm = (pt) => Math.round((pt / PT_PER_MM) * 100) / 100;

export { TRIM_PRESETS } from './presets';

// fontkit reads past the end of buffer for a trailing zero-length glyph in some TTFs.
// Padding the in-memory copy (not the distributed file) avoids that without altering glyph data.
export function padFontBytes(bytes) {
  const src = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  const out = new Uint8Array(src.length + 64);
  out.set(src);
  return out;
}

export function defaultInteriorLayout(trimWidthMm, trimHeightMm) {
  const w = Number(trimWidthMm);
  const h = Number(trimHeightMm);
  const bodySize = w <= 130 ? 9.5 : w >= 170 ? 10.5 : 10;
  return {
    bodySize,
    leading: Math.round(bodySize * 1.7 * 100) / 100,
    indentEm: 1,
    marginsMm: {
      top: Math.round(h * 0.088 * 10) / 10,
      bottom: Math.round(h * 0.1 * 10) / 10,
      inner: Math.round(w * 0.14 * 10) / 10,
      outer: Math.round(w * 0.115 * 10) / 10
    },
    spaceEm: 0.28,
    maxLetterSpacingEm: 0.06
  };
}

function makeMeasurer(widthFn, size) {
  const cache = new Map();
  return (text) => {
    const key = String(text);
    if (!key) return 0;
    let value = cache.get(key);
    if (value === undefined) {
      value = widthFn(key, size);
      cache.set(key, value);
    }
    return value;
  };
}

function charCount(text) {
  return Array.from(String(text || '')).length;
}

/**
 * @param {object} input
 * @param {{regular:Uint8Array, bold:Uint8Array, extraBold:Uint8Array}} input.fonts
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
  layout: layoutOverride = {},
  fonts,
  generatedAt = new Date().toISOString()
} = {}) {
  if (!fonts?.regular || !fonts?.bold || !fonts?.extraBold) throw new Error('인쇄용 서체 파일을 불러오지 못했습니다.');
  // fonts.fallback (optional): covers hanja/symbols missing from the primary family; used per character.
  if (!String(manuscript || '').trim()) throw new Error('조판할 원고가 없습니다.');

  const W = mm(trimWidthMm);
  const H = mm(trimHeightMm);
  const B = mm(bleedMm);
  const L = { ...defaultInteriorLayout(trimWidthMm, trimHeightMm), ...layoutOverride };
  const margins = { ...defaultInteriorLayout(trimWidthMm, trimHeightMm).marginsMm, ...(layoutOverride.marginsMm || {}) };
  const top = mm(margins.top);
  const bottom = mm(margins.bottom);
  const inner = mm(margins.inner);
  const outer = mm(margins.outer);
  const textW = W - inner - outer;
  const textH = H - top - bottom;
  const size = L.bodySize;
  const lead = L.leading;
  const LPP = Math.floor((textH - size) / lead) + 1;
  const firstBaseline = H - top - size * 0.86;
  const baselineAt = (line) => firstBaseline - line * lead;

  const bookTitle = nfc(title || '제목 없음').trim();
  const structure = parseBookStructure(manuscript, { title: bookTitle });

  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  const padded = {
    regular: padFontBytes(fonts.regular),
    bold: padFontBytes(fonts.bold),
    extraBold: padFontBytes(fonts.extraBold)
  };
  // subset:false — pdf-lib's CJK subsetting drops glyphs; full embedding renders reliably.
  const pdfFonts = {
    regular: await doc.embedFont(padded.regular, { subset: false }),
    bold: await doc.embedFont(padded.bold, { subset: false }),
    extraBold: await doc.embedFont(padded.extraBold, { subset: false })
  };
  const glyphFonts = {
    regular: fontkit.create(padded.regular),
    bold: fontkit.create(padded.bold),
    extraBold: fontkit.create(padded.extraBold)
  };
  const needsFallback = Array.from(nfc(`${manuscript}${title}${author}${publisher}`))
    .some((ch) => !/\s/.test(ch) && !glyphFonts.regular.hasGlyphForCodePoint(ch.codePointAt(0)));
  if (fonts.fallback && needsFallback) {
    const paddedFallback = padFontBytes(fonts.fallback);
    pdfFonts.fallback = await doc.embedFont(paddedFallback, { subset: false });
    glyphFonts.fallback = fontkit.create(paddedFallback);
  }

  // Split text into runs: primary font where it has the glyph, fallback font otherwise.
  const runCache = new Map();
  const runsFor = (fontKey, text) => {
    const key = `${fontKey}\u0000${text}`;
    let runs = runCache.get(key);
    if (runs) return runs;
    runs = [];
    Array.from(String(text || '')).forEach((ch) => {
      const useFallback = glyphFonts.fallback && !glyphFonts[fontKey].hasGlyphForCodePoint(ch.codePointAt(0)) &&
        glyphFonts.fallback.hasGlyphForCodePoint(ch.codePointAt(0));
      const font = useFallback ? 'fallback' : fontKey;
      const last = runs[runs.length - 1];
      if (last && last.font === font) last.text += ch;
      else runs.push({ font, text: ch });
    });
    runCache.set(key, runs);
    return runs;
  };
  const widthOf = (fontKey, text, fontSize) => runsFor(fontKey, text)
    .reduce((sum, run) => sum + pdfFonts[run.font].widthOfTextAtSize(run.text, fontSize), 0);

  const measureFor = (fontKey, fontSize) => makeMeasurer((text, s) => widthOf(fontKey, text, s), fontSize);
  const measureBody = measureFor('regular', size);
  const spaceW = size * L.spaceEm;
  const indentW = size * L.indentEm;
  const maxTc = size * L.maxLetterSpacingEm;

  const stats = {
    splitWords: 0,
    letterSpacedLines: 0,
    maxLetterSpacingEm: 0,
    orphansAvoided: 0,
    widowsAvoided: 0,
    shortPages: 0,
    overflowLines: 0,
    blankPagesForRecto: 0,
    paddingPages: 0
  };
  const placed = [];
  const usedChars = { regular: new Set(), bold: new Set(), extraBold: new Set(), fallback: new Set() };
  const noteChars = (fontKey, text) => {
    Array.from(String(text || '')).forEach((ch) => { if (!/\s/.test(ch)) usedChars[fontKey].add(ch); });
  };

  // ---------- logical pages ----------
  const pages = [];
  const newPage = (kind, extra = {}) => {
    const page = { kind, items: [], runningHead: null, folio: false, chapterTitle: '', ...extra };
    pages.push(page);
    return page;
  };
  const addItem = (page, item) => {
    // Expand into per-font runs so hanja/symbols use the fallback face at the right x offsets.
    let x = item.x;
    runsFor(item.font, item.text).forEach((run) => {
      page.items.push({ ...item, font: run.font, text: run.text, x });
      noteChars(run.font === 'fallback' ? 'fallback' : item.font, run.text);
      x += pdfFonts[run.font].widthOfTextAtSize(run.text, item.size) + item.tc * charCount(run.text);
    });
  };
  const centered = (page, text, fontKey, fontSize, y, { tc = 0 } = {}) => {
    const width = widthOf(fontKey, text, fontSize) + tc * Math.max(0, charCount(text) - 1);
    addItem(page, { font: fontKey, size: fontSize, x: (textW - width) / 2, y, text, tc });
  };

  // Titles: balanced breaking — shrink the measure while the line count stays the same,
  // so a two-line title never ends with a lone word such as "1".
  const breakFor = (text, fontKey, fontSize, width) => {
    const run = (w) => breakLine(text, {
      width: w,
      indent: 0,
      measure: measureFor(fontKey, fontSize),
      spaceWidth: fontSize * L.spaceEm,
      looseRatio: 2
    });
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
  const titlePage = newPage('title');
  const titleSize = Math.min(22, size * 2.2);
  const titleLines = breakFor(bookTitle, 'extraBold', titleSize, textW * 0.86);
  let ty = H * 0.68;
  titleLines.forEach((line) => {
    centered(titlePage, line, 'extraBold', titleSize, ty);
    ty -= titleSize * 1.45;
  });
  if (author) centered(titlePage, nfc(author), 'regular', size * 1.1, ty - size * 1.6);
  if (publisher) centered(titlePage, nfc(publisher), 'bold', size * 0.95, mm(margins.bottom) + size * 1.5);
  newPage('blank');

  // 2) TOC (measured now, page numbers filled after body layout)
  const titled = structure.chapters.filter((chapter) => !chapter.untitled);
  const useToc = includeToc && titled.length >= 2;
  const tocLayout = [];
  let tocPageCount = 0;
  if (useToc) {
    const tocSink = Math.max(2, Math.round(LPP * 0.16));
    const hasLabels = titled.some((chapter) => chapter.label);
    const labelCol = hasLabels ? mm(15) : 0;
    const numberCol = mm(10);
    const titleWidth = textW - labelCol - numberCol;
    let line = tocSink + 3;
    let pageIndex = 0;
    titled.forEach((chapter) => {
      const linesForTitle = breakFor(chapter.title || chapter.label, 'regular', size, titleWidth);
      const need = linesForTitle.length;
      if (line + need > LPP) {
        pageIndex += 1;
        line = 1;
      }
      tocLayout.push({ chapter, pageIndex, line, lines: linesForTitle, labelCol });
      line += need + 1;
    });
    tocPageCount = pageIndex + 1;
    for (let i = 0; i < tocPageCount; i += 1) {
      const page = newPage('toc', { folio: false });
      if (i === 0) centered(page, '차례', 'bold', size * 1.3, baselineAt(tocSink));
    }
  }
  if (pages.length % 2 === 1) newPage('blank'); // body starts on a recto (odd) page

  // 3) Body
  let page = null;
  let cursor = 0;
  let chapterTitle = '';

  const startBodyPage = () => {
    page = newPage('body', { runningHead: true, folio: true, chapterTitle });
    cursor = 0;
    return page;
  };

  const placeTypesetLine = (line, lineIndex, { fontKey = 'regular', fontSize = size, align = 'justify' } = {}) => {
    const measure = fontKey === 'regular' && fontSize === size ? measureBody : measureFor(fontKey, fontSize);
    const gapBase = fontSize * L.spaceEm;
    const y = baselineAt(lineIndex);
    if (align === 'center') {
      const text = line.words.join(' ');
      centered(page, text, fontKey, fontSize, y);
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

  const placeLines = (lines, options) => {
    let i = 0;
    while (i < lines.length) {
      if (!page || cursor >= LPP) startBodyPage();
      const remaining = LPP - cursor;
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

  const chapterStarts = [];

  structure.chapters.forEach((chapter, chapterIndex) => {
    chapterTitle = chapter.untitled ? bookTitle : (chapter.title || chapter.label);
    // Every chapter opens on a new recto page.
    if (pages.length % 2 === 1) {
      newPage('blank');
      if (chapterIndex > 0) stats.blankPagesForRecto += 1;
    }
    page = newPage('body', {
      runningHead: chapter.untitled,
      folio: chapter.untitled,
      chapterTitle,
      chapterOpen: !chapter.untitled
    });
    cursor = 0;
    chapterStarts.push({ chapter, pageNumber: pages.length });

    if (!chapter.untitled) {
      const sink = Math.max(3, Math.round(LPP * 0.28));
      let lineIndex = sink;
      if (chapter.label) {
        centered(page, chapter.label, 'bold', size * 0.95, baselineAt(lineIndex), { tc: size * 0.08 });
        placed.push(chapter.label);
        lineIndex += 2;
      }
      const headSize = Math.min(17, size * 1.6);
      const headLines = breakFor(chapter.title, 'bold', headSize, textW * 0.82);
      headLines.forEach((text) => {
        if (!text) return;
        centered(page, text, 'bold', headSize, baselineAt(lineIndex));
        placed.push(text.replace(/\s+/g, ''));
        lineIndex += 2;
      });
      cursor = lineIndex + 2;
    }

    chapter.blocks.forEach((block) => {
      if (block.type === 'p') {
        const typeset = [];
        block.lines.forEach((text, idx) => {
          breakLine(text, {
            width: textW,
            indent: idx === 0 ? indentW : 0,
            measure: measureBody,
            spaceWidth: spaceW
          }).forEach((line) => typeset.push(line));
        });
        placeLines(typeset, { align: 'justify' });
        return;
      }

      if (block.type === 'section') {
        const secSize = size * 1.05;
        const lines = breakLine(block.text, {
          width: textW * 0.9,
          indent: 0,
          measure: measureFor('bold', secSize),
          spaceWidth: secSize * L.spaceEm
        });
        const before = cursor > 0 ? 1 : 0;
        if (!page || cursor + before + lines.length + 1 + 2 > LPP) startBodyPage();
        if (cursor > 0) cursor += 1;
        lines.forEach((line) => {
          placeTypesetLine({ ...line, last: true }, cursor, { fontKey: 'bold', fontSize: secSize, align: 'left' });
          cursor += 1;
        });
        cursor += 1;
        return;
      }

      // scene break
      if (!page || cursor + 2 > LPP) startBodyPage();
      if (cursor > 0) cursor += 1;
      centered(page, block.text, 'regular', size, baselineAt(cursor));
      placed.push(block.text.replace(/\s+/g, ''));
      cursor += 2;
    });
  });

  // 4) Copyright page (last verso) + padding to the printer's page multiple
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
    const cpSize = size * 0.82;
    let line = LPP - copyrightRows.length - 1;
    copyrightRows.forEach(([label, value], idx) => {
      const y = baselineAt(line);
      if (idx === 0) {
        addItem(cp, { font: 'bold', size: size * 0.95, x: 0, y, text: value, tc: 0 });
        line += 2;
        return;
      }
      addItem(cp, { font: 'regular', size: cpSize, x: 0, y, text: label, tc: 0 });
      addItem(cp, { font: 'regular', size: cpSize, x: mm(24), y, text: value, tc: 0 });
      line += 1;
    });
  }

  // 5) Fill TOC page numbers
  if (useToc) {
    const tocStart = pages.findIndex((p) => p.kind === 'toc');
    tocLayout.forEach((entry) => {
      const tocPage = pages[tocStart + entry.pageIndex];
      const start = chapterStarts.find((s) => s.chapter === entry.chapter);
      let line = entry.line;
      if (entry.chapter.label) {
        addItem(tocPage, { font: 'bold', size: size * 0.9, x: 0, y: baselineAt(line), text: entry.chapter.label, tc: 0 });
      }
      entry.lines.forEach((text, idx) => {
        addItem(tocPage, { font: 'regular', size, x: entry.labelCol, y: baselineAt(line + idx), text, tc: 0 });
      });
      const num = String(start ? start.pageNumber : '');
      const numW = widthOf('regular', num, size);
      addItem(tocPage, { font: 'regular', size, x: textW - numW, y: baselineAt(line + entry.lines.length - 1), text: num, tc: 0 });
      line += entry.lines.length;
    });
  }

  // ---------- missing glyph check ----------
  const missingGlyphs = [];
  const fallbackChars = [];
  Object.entries(usedChars).forEach(([fontKey, set]) => {
    set.forEach((ch) => {
      const cp = ch.codePointAt(0);
      if (fontKey === 'fallback') {
        fallbackChars.push(ch);
        if (!glyphFonts.fallback?.hasGlyphForCodePoint(cp)) missingGlyphs.push({ font: 'fallback', char: ch, codePoint: `U+${cp.toString(16).toUpperCase().padStart(4, '0')}` });
        return;
      }
      if (!glyphFonts[fontKey].hasGlyphForCodePoint(cp)) {
        missingGlyphs.push({ font: fontKey, char: ch, codePoint: `U+${cp.toString(16).toUpperCase().padStart(4, '0')}` });
      }
    });
  });

  // ---------- render ----------
  doc.setTitle(bookTitle);
  if (author) doc.setAuthor(nfc(author));
  doc.setSubject(`${bookTitle} — 인쇄용 내지`);
  doc.setCreator('ooOS Publishing OS');
  doc.setProducer('ooOS Publishing OS (pdf-lib)');
  doc.setLanguage('ko-KR');
  const stamp = new Date(generatedAt);
  doc.setCreationDate(stamp);
  doc.setModificationDate(stamp);

  const runSize = size * 0.75;
  const folioSize = size * 0.8;

  pages.forEach((logical, index) => {
    const number = index + 1;
    const recto = number % 2 === 1;
    const left = recto ? inner : outer;
    const pdfPage = doc.addPage([W + 2 * B, H + 2 * B]);
    pdfPage.setMediaBox(0, 0, W + 2 * B, H + 2 * B);
    pdfPage.setBleedBox(0, 0, W + 2 * B, H + 2 * B);
    pdfPage.setTrimBox(B, B, W, H);

    const items = logical.items.slice();
    if (logical.kind === 'body' && logical.runningHead && !logical.chapterOpen) {
      const headText = recto ? logical.chapterTitle : bookTitle;
      const headW = widthOf('regular', headText, runSize);
      let hx = recto ? textW - headW : 0;
      runsFor('regular', headText).forEach((run) => {
        items.push({ font: run.font, size: runSize, x: hx, y: H - top * 0.55, text: run.text, tc: 0, chrome: true });
        hx += pdfFonts[run.font].widthOfTextAtSize(run.text, runSize);
      });
    }
    if (logical.kind === 'body' && logical.folio && !logical.chapterOpen) {
      const num = String(number);
      const numW = pdfFonts.regular.widthOfTextAtSize(num, folioSize);
      items.push({ font: 'regular', size: folioSize, x: recto ? textW - numW : 0, y: bottom * 0.5, text: num, tc: 0, chrome: true });
    }
    if (!items.length) return;

    const keys = {};
    const keyFor = (fontKey) => {
      if (!keys[fontKey]) keys[fontKey] = pdfPage.node.newFontDictionary(pdfFonts[fontKey].name, pdfFonts[fontKey].ref);
      return keys[fontKey];
    };
    const ops = [setFillingCmykColor(0, 0, 0, 1), beginText()];
    let currentTc = 0;
    items.forEach((item) => {
      ops.push(setFontAndSize(keyFor(item.font), item.size));
      if (item.tc !== currentTc) {
        ops.push(setCharacterSpacing(item.tc));
        currentTc = item.tc;
      }
      ops.push(setTextMatrix(1, 0, 0, 1, B + left + item.x, B + item.y));
      ops.push(showText(pdfFonts[item.font].encodeText(item.text)));
    });
    if (currentTc !== 0) ops.push(setCharacterSpacing(0));
    ops.push(endText());
    pdfPage.pushOperators(...ops);
  });

  const bytes = await doc.save({ useObjectStreams: false });

  const expected = structureCanonicalText(structure);
  const actual = canonicalChars(placed.join(''));
  let firstMismatch = -1;
  if (expected !== actual) {
    const max = Math.min(expected.length, actual.length);
    for (let i = 0; i < max; i += 1) {
      if (expected[i] !== actual[i]) { firstMismatch = i; break; }
    }
    if (firstMismatch < 0) firstMismatch = max;
  }

  const bodyPages = pages.filter((p) => p.kind === 'body').length;

  return {
    bytes,
    pageCount: pages.length,
    structure,
    layout: {
      trimWidthMm: Number(trimWidthMm),
      trimHeightMm: Number(trimHeightMm),
      bleedMm: Number(bleedMm),
      pdfWidthMm: toMm(W + 2 * B),
      pdfHeightMm: toMm(H + 2 * B),
      bodySizePt: size,
      leadingPt: lead,
      linesPerPage: LPP,
      textWidthMm: toMm(textW),
      textHeightMm: toMm(textH),
      marginsMm: margins,
      approxCharsPerLine: Math.round(textW / size),
      pageMultiple: multiple,
      fonts: {
        body: pdfFonts.regular.name,
        heading: pdfFonts.bold.name,
        display: pdfFonts.extraBold.name,
        fallback: pdfFonts.fallback ? pdfFonts.fallback.name : null,
        fallbackChars: fallbackChars.length,
        embedding: 'full (CID TrueType, Identity-H)',
        license: pdfFonts.fallback
          ? 'SIL Open Font License 1.1 (Nanum Myeongjo; ooOS Fallback Serif from Noto Serif KR)'
          : 'SIL Open Font License 1.1 (Nanum Myeongjo)'
      },
      color: '1도 (K100), DeviceCMYK'
    },
    pages: {
      total: pages.length,
      body: bodyPages,
      front: pages.findIndex((p) => p.kind === 'body'),
      toc: tocPageCount,
      copyright: includeCopyright
    },
    chapters: chapterStarts.map((s) => ({
      label: s.chapter.label,
      title: s.chapter.untitled ? '' : s.chapter.title,
      startPage: s.pageNumber
    })),
    stats,
    missingGlyphs,
    completeness: {
      expectedChars: expected.length,
      placedChars: actual.length,
      match: expected === actual,
      firstMismatchIndex: firstMismatch,
      structureLossless: structure.lossless
    },
    copyrightFields: Object.fromEntries(copyrightRows.slice(1).map(([k, v]) => [k, v]))
  };
}
