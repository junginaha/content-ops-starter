// Colour cover templates (from "1900"): typo · image · frame · split.
// Same contract as buildCoverPdf: { bytes, geometry, report, warnings, blockers }.
// Print rules kept from ooOS: MediaBox/BleedBox = full spread incl. bleed, TrimBox = trim,
// fonts fully embedded, all colours DeviceCMYK, no transparency (image darkening is baked
// into the bitmap by the caller), EAN-13 bars K100 on a white plate, decoded back for preflight.
import { PDFDocument, cmyk, degrees, pushGraphicsState, popGraphicsState, rectangle, clip, endPath } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { padFontBytes, PT_PER_MM } from './interiorPdf';
import { nfc } from './bookStructure';
import { coverGeometry, ean13Modules, decodeEan13Modules } from './coverPdf';

const mm = (v) => Number(v) * PT_PER_MM;
const round1 = (v) => Math.round(Number(v) * 10) / 10;

import { COVER_TEMPLATES, PAPER_HEX, hexToCmyk, luminance, mixHex, isDark, designImageSlot, FINISH_TYPES, FINISH_TARGETS } from './coverConstants';
export { COVER_TEMPLATES, designImageSlot, hexToCmyk, FINISH_TYPES, FINISH_TARGETS };

const toPdf = (hex) => cmyk(...hexToCmyk(hex));
const K100 = cmyk(0, 0, 0, 1);
const WHITE = cmyk(0, 0, 0, 0);

// ---------- text helpers ----------
function wrapText(font, text, size, maxW) {
  const out = [];
  String(text || '').split(/\n/).forEach((para, pi, arr) => {
    const words = para.split(/\s+/).filter(Boolean);
    let cur = '';
    const pushWord = (word) => {
      const next = cur ? `${cur} ${word}` : word;
      if (font.widthOfTextAtSize(next, size) <= maxW) { cur = next; return; }
      if (cur) out.push(cur);
      // Word longer than the line: break between syllables.
      if (font.widthOfTextAtSize(word, size) > maxW) {
        let piece = '';
        Array.from(word).forEach((ch) => {
          if (font.widthOfTextAtSize(piece + ch, size) > maxW && piece) { out.push(piece); piece = ch; } else piece += ch;
        });
        cur = piece;
      } else cur = word;
    };
    words.forEach(pushWord);
    if (cur) out.push(cur);
    if (!words.length && pi < arr.length - 1) out.push('');
  });
  // Kinsoku: never start a line with closing punctuation.
  for (let i = 1; i < out.length; i += 1) {
    const m = out[i].match(/^([,.!?;:)\]}」』”’〉》、。…·]+)\s*/);
    if (m) { out[i - 1] += m[1]; out[i] = out[i].slice(m[0].length); }
  }
  return out;
}

const priceText = (price) => `값 ${String(price).replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원`;

/**
 * Vector EAN-13 (+ optional EAN-5 부가기호) on a white quiet-zone plate, bars K100, dot-gain trimmed.
 * Anchored by its bottom-right corner (rightX, bottomY in PDF points).
 */
function drawIsbnBarcode(page, f, { rightX, bottomY, isbn, addon = '', price = '' }) {
  const out = { report: null, warnings: [], blockers: [], heightPt: 0 };
  const digits = String(isbn || '').replace(/[^0-9]/g, '');
  if (!digits) return out;
  try {
    const bits = ean13Modules(digits);
    const mag = 0.9;
    const moduleW = mm(0.33 * mag);
    const barH = mm(22.85 * mag * 0.8);
    const guardExtra = mm(5 * 0.33 * mag);
    const quietLeft = 11 * moduleW;
    const quietRight = 7 * moduleW;
    const codeW = 95 * moduleW;
    const ad = String(addon || '').replace(/\D/g, '');
    const hasAddon = ad.length === 5;
    const addonGap = 9 * moduleW;
    const addonW = hasAddon ? 47 * moduleW : 0;
    const blockW = quietLeft + codeW + (hasAddon ? addonGap + addonW : 0) + quietRight;
    const x0 = rightX - blockW + quietLeft;
    const y0 = bottomY + guardExtra + mm(4);
    const textSize = 8.5 * mag + 1;
    const plateTop = barH + mm(price ? 11 : 6);
    page.drawRectangle({ x: x0 - quietLeft, y: bottomY, width: blockW, height: plateTop + guardExtra + mm(4), color: WHITE, borderWidth: 0 });
    out.heightPt = plateTop + guardExtra + mm(4);
    const label = /-/.test(String(isbn)) ? `ISBN ${String(isbn).trim()}` : `ISBN ${digits}`;
    page.drawText(label, { x: x0 + (codeW - f.regular.widthOfTextAtSize(label, 8)) / 2, y: y0 + barH + mm(2), size: 8, font: f.regular, color: K100 });
    const hr = [digits[0], digits.slice(1, 7), digits.slice(7)];
    const ty = y0 - guardExtra - textSize * 0.2;
    page.drawText(hr[0], { x: x0 - quietLeft + mm(0.6), y: ty, size: textSize, font: f.regular, color: K100 });
    page.drawText(hr[1], { x: x0 + 3 * moduleW + (42 * moduleW - f.regular.widthOfTextAtSize(hr[1], textSize)) / 2, y: ty, size: textSize, font: f.regular, color: K100 });
    page.drawText(hr[2], { x: x0 + 50 * moduleW + (42 * moduleW - f.regular.widthOfTextAtSize(hr[2], textSize)) / 2, y: ty, size: textSize, font: f.regular, color: K100 });
    if (price) {
      const pt = priceText(price);
      page.drawText(pt, { x: x0 + codeW - f.bold.widthOfTextAtSize(pt, 9), y: y0 + barH + mm(7), size: 9, font: f.bold, color: K100 });
    }
    const guards = new Set([0, 1, 2, 45, 46, 47, 48, 49, 92, 93, 94]);
    let i = 0;
    while (i < bits.length) {
      if (bits[i] !== '1') { i += 1; continue; }
      let j = i; while (j < bits.length && bits[j] === '1') j += 1;
      const g = guards.has(i);
      page.drawRectangle({ x: x0 + i * moduleW + mm(0.0075), y: g ? y0 - guardExtra : y0, width: (j - i) * moduleW - mm(0.015), height: g ? barH + guardExtra : barH, color: K100, borderWidth: 0 });
      i = j;
    }
    if (hasAddon) {
      // EAN-5 add-on (부가기호): start 1011, digits separated by 01, parity from checksum.
      const L = ['0001101', '0011001', '0010011', '0111101', '0100011', '0110001', '0101111', '0111011', '0110111', '0001011'];
      const G = ['0100111', '0110011', '0011011', '0100001', '0011101', '0111001', '0000101', '0010001', '0001001', '0010111'];
      const PAR = ['GGLLL', 'GLGLL', 'GLLGL', 'GLLLG', 'LGGLL', 'LLGGL', 'LLLGG', 'LGLGL', 'LGLLG', 'LLGLG'];
      const d = ad.split('').map(Number);
      const par = PAR[(3 * (d[0] + d[2] + d[4]) + 9 * (d[1] + d[3])) % 10];
      let ab = '1011';
      d.forEach((v, k) => { ab += (par[k] === 'L' ? L : G)[v]; if (k < 4) ab += '01'; });
      const ax = x0 + codeW + addonGap;
      const ah = barH - mm(2.6);
      let k = 0;
      while (k < ab.length) {
        if (ab[k] !== '1') { k += 1; continue; }
        let m = k; while (m < ab.length && ab[m] === '1') m += 1;
        page.drawRectangle({ x: ax + k * moduleW + mm(0.0075), y: y0 - guardExtra, width: (m - k) * moduleW - mm(0.015), height: ah, color: K100, borderWidth: 0 });
        k = m;
      }
      page.drawText(ad, { x: ax + (addonW - f.regular.widthOfTextAtSize(ad, textSize)) / 2, y: y0 - guardExtra + ah + mm(1), size: textSize, font: f.regular, color: K100 });
    } else if (ad) {
      out.warnings.push('부가기호는 숫자 5자리여야 합니다 — 부가기호 바코드를 넣지 않았습니다.');
    }
    out.report = {
      symbology: hasAddon ? 'EAN-13+5' : 'EAN-13',
      value: digits,
      addon: hasAddon ? ad : null,
      magnification: mag,
      moduleMm: round1(0.33 * mag * 100) / 100,
      widthMm: round1(blockW / PT_PER_MM),
      heightMm: round1((barH + guardExtra) / PT_PER_MM),
      decoded: decodeEan13Modules(bits)
    };
  } catch (error) {
    out.blockers.push(`ISBN 바코드 생성 불가: ${error.message}`);
  }
  return out;
}

async function embedSet(doc, fonts) {
  const f = {
    regular: await doc.embedFont(padFontBytes(fonts.regular), { subset: false }),
    bold: await doc.embedFont(padFontBytes(fonts.bold), { subset: false }),
    extraBold: await doc.embedFont(padFontBytes(fonts.extraBold), { subset: false })
  };
  f.label = fonts.sansBold ? await doc.embedFont(padFontBytes(fonts.sansBold), { subset: false }) : f.bold;
  return f;
}
function setBoxes(page, totalW, totalH, B, trimH) {
  page.setMediaBox(0, 0, totalW, totalH);
  page.setBleedBox(0, 0, totalW, totalH);
  page.setTrimBox(B, B, totalW - 2 * B, trimH);
}
function stampMeta(doc, title, label, generatedAt) {
  doc.setTitle(`${title} — ${label}`);
  doc.setCreator('ooOS Publishing OS · 1900');
  doc.setProducer('ooOS Publishing OS (pdf-lib)');
  doc.setLanguage('ko-KR');
  doc.setCreationDate(new Date(generatedAt));
  doc.setModificationDate(new Date(generatedAt));
}

/**
 * @param {object} input.design
 *   { template, color, backCopy, authorBio, addon, tagline,
 *     endorsements: [{ quote, name, role }],
 *     finish: { type: 'gold'|'silver'|'spotUV'|'emboss'|'none', targets: ['title', ...] },
 *     band: { enabled, heightMm, headline, copy, endorsement, color } }
 * Returns { bytes, geometry, report, warnings, blockers, finish?: {bytes, ...}, band?: {bytes, ...} }
 */
export async function buildDesignedCoverPdf({
  title = '',
  subtitle = '',
  author = '',
  publisher = '',
  isbn = '',
  price = '',
  trimWidthMm = 140,
  trimHeightMm = 210,
  bleedMm = 3,
  spineMm,
  flapMm = 0,
  frontImage = null,
  fonts,
  design = {},
  generatedAt = new Date().toISOString()
} = {}) {
  if (!fonts?.regular || !fonts?.bold || !fonts?.extraBold) throw new Error('표지용 서체 파일을 불러오지 못했습니다.');
  const template = COVER_TEMPLATES[design.template] ? design.template : 'typo';
  const color = /^#[0-9a-f]{3,6}$/i.test(design.color || '') ? design.color : '#1f3a5f';
  const geo = coverGeometry({ trimWidthMm, trimHeightMm, bleedMm, spineMm, flapMm });
  const totalW = mm(geo.totalWidthMm);
  const totalH = mm(geo.totalHeightMm);
  const B = mm(geo.bleedMm);
  const W = mm(trimWidthMm);
  const H = mm(geo.trimHeightMm);
  const panel = (key) => geo.panels.find((p) => p.key === key);

  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  const f = await embedSet(doc, fonts);
  const sansUsed = !!fonts.sansBold;
  const page = doc.addPage([totalW, totalH]);
  setBoxes(page, totalW, totalH, B, H);

  const finishType = FINISH_TYPES[design.finish?.type] ? design.finish.type : 'none';
  const finishTargets = new Set(finishType === 'none' ? [] : (design.finish?.targets || ['title']).filter((t) => FINISH_TARGETS[t]));

  const warnings = [];
  const blockers = [];
  const report = { image: null, barcode: null, spineText: 'none', style: `1900-${template}`, sansUsed, design: { template, color, cmyk: hexToCmyk(color), finish: finishType === 'none' ? null : { type: finishType, label: FINISH_TYPES[finishType], targets: [...finishTargets] }, endorsements: (design.endorsements || []).length, tagline: !!design.tagline, band: !!design.band?.enabled } };

  // Drawing surface — swapped to the finish plate when tagged elements are replayed.
  const S = { page, map: null, force: null, minTextPt: Infinity, minRulePt: Infinity };
  const fontOf = (font) => (S.map ? S.map.get(font) : font);
  const colorOf = (c) => S.force || c;
  const Y = (fromTop) => totalH - fromTop;
  const rect = (x, yTop, w, h, c) => S.page.drawRectangle({ x, y: totalH - yTop - h, width: w, height: h, color: colorOf(c), borderWidth: 0 });
  const text = (str, x, baselineFromTop, font, size, c) => {
    if (!str) return;
    if (S.force) S.minTextPt = Math.min(S.minTextPt, size);
    S.page.drawText(str, { x, y: Y(baselineFromTop), size, font: fontOf(font), color: colorOf(c) });
  };
  const lines = (arr, x, topFromTop, font, size, lead, c, { align = 'left', boxW = 0 } = {}) => {
    let y = topFromTop + size * 0.88;
    arr.forEach((ln) => {
      const w = font.widthOfTextAtSize(ln, size);
      const dx = align === 'center' ? (boxW - w) / 2 : align === 'right' ? boxW - w : 0;
      text(ln, x + dx, y, font, size, c);
      y += size * lead;
    });
    return y - size * 0.88; // bottom of block (from top)
  };
  const strokeRect = (x, y, w, h, c, bw) => {
    if (S.force) S.minRulePt = Math.min(S.minRulePt, bw);
    S.page.drawRectangle({ x, y, width: w, height: h, borderColor: colorOf(c), borderWidth: bw });
  };
  const replay = [];
  const tag = (name, fn) => { fn(); if (finishTargets.has(name)) replay.push(fn); };

  const paperBg = template === 'frame';
  const bgHex = paperBg ? PAPER_HEX : color;
  const inkHex = isDark(bgHex) ? '#fbfaf7' : '#16171a';
  const ink = isDark(bgHex) ? WHITE : K100;
  const softInk = toPdf(mixHex(inkHex, bgHex, 0.35));
  const accent = toPdf(color);

  // Background of the whole spread (bleed to bleed).
  page.drawRectangle({ x: 0, y: 0, width: totalW, height: totalH, color: toPdf(bgHex), borderWidth: 0 });

  const front = panel('front');
  const fx = mm(front.x);
  const pad = mm(16);
  const innerW = W - 2 * pad;
  const rightBleed = geo.flapMm > 0 ? 0 : B;
  const safeTitle = nfc(title || '제목 없음').trim();
  const sub = subtitle ? nfc(subtitle).trim() : '';
  const a = author ? nfc(author).trim() : '';
  const p = publisher ? nfc(publisher).trim() : '';
  const tagline = design.tagline ? nfc(design.tagline).trim() : '';

  // ---------- image ----------
  let slotBox = null; // PDF-space box for the picture
  const slotMm = designImageSlot({ template, trimWidthMm, trimHeightMm, bleedMm, flapMm });
  if (slotMm) {
    if (template === 'image') slotBox = { x: fx, y: 0, w: W + rightBleed, h: totalH };
    else if (template === 'split') slotBox = { x: fx, y: 0, w: W + rightBleed, h: mm(slotMm.heightMm) };
    else if (template === 'frame') { const sz = mm(slotMm.widthMm); slotBox = { x: fx + (W - sz) / 2, y: Y(B + H * 0.47) - sz, w: sz, h: sz }; }
  }
  const hasImage = !!(frontImage?.bytes && slotBox);
  if (hasImage) {
    const img = frontImage.type === 'png' ? await doc.embedPng(frontImage.bytes) : await doc.embedJpg(frontImage.bytes);
    const scale = Math.max(slotBox.w / img.width, slotBox.h / img.height);
    const dw = img.width * scale; const dh = img.height * scale;
    const ppi = img.width / (dw / 72);
    report.image = { pixels: `${img.width}×${img.height}`, placedMm: `${round1(dw / PT_PER_MM)}×${round1(dh / PT_PER_MM)}`, effectivePpi: Math.round(ppi), colorSpace: frontImage.colorSpace || 'unknown', slot: template };
    if (ppi < 200) blockers.push(`앞표지 이미지 해상도 ${Math.round(ppi)}ppi — 인쇄 최소 300ppi 필요`);
    else if (ppi < 300) warnings.push(`앞표지 이미지 해상도 ${Math.round(ppi)}ppi — 300ppi 권장`);
    if (frontImage.colorSpace && frontImage.colorSpace !== 'CMYK') warnings.push(`앞표지 이미지가 ${frontImage.colorSpace}입니다 — 인쇄소 CMYK 변환 결과 확인 필요`);
    page.pushOperators(pushGraphicsState(), rectangle(slotBox.x, slotBox.y, slotBox.w, slotBox.h), clip(), endPath());
    page.drawImage(img, { x: slotBox.x + (slotBox.w - dw) / 2, y: slotBox.y + (slotBox.h - dh) / 2, width: dw, height: dh });
    page.pushOperators(popGraphicsState());
    if (Math.abs(dw / dh - slotBox.w / slotBox.h) > 0.02) warnings.push('앞표지 이미지 비율이 칸과 달라 가장자리가 잘렸습니다 — 미리보기 확인');
  }

  // ---------- front ----------
  const fitStack = (font, words, max, min) => {
    const widest = Math.max(...words.map((w) => font.widthOfTextAtSize(w, 1)));
    return Math.max(min, Math.min(max, Math.floor(innerW / (widest * 1.02))));
  };
  const fitWrap = (font, str, max, min, maxLines = 3) => {
    for (let sz = max; sz >= min; sz -= 1) if (wrapText(font, str, sz, innerW).length <= maxLines) return sz;
    return min;
  };
  const taglineAt = (yTop, c, align = 'left') => {
    if (!tagline) return;
    tag('tagline', () => lines(wrapText(f.regular, tagline, 9.5, innerW), fx + pad, yTop, f.regular, 9.5, 1.45, c, { align, boxW: innerW }));
  };

  if (template === 'typo') {
    const words = safeTitle.split(/\s+/).filter(Boolean);
    const stacked = words.length <= 4;
    const size = stacked ? fitStack(f.extraBold, words, 64, 24) : fitWrap(f.extraBold, safeTitle, 44, 20);
    const titleLines = stacked ? words : wrapText(f.extraBold, safeTitle, size, innerW);
    taglineAt(B + mm(12), softInk);
    tag('rule', () => rect(fx + pad, B + mm(22), mm(14), 1.2, ink));
    let bottom = B + mm(28) + size * 1.1 * titleLines.length;
    tag('title', () => lines(titleLines, fx + pad, B + mm(28), f.extraBold, size, 1.1, ink));
    if (sub) tag('subtitle', () => { bottom = lines(wrapText(f.regular, sub, 11, innerW), fx + pad, bottom + mm(6), f.regular, 11, 1.5, softInk); });
    tag('author', () => text(a, fx + pad, B + H - mm(34), f.bold, 13, ink));
    text(p, fx + pad, B + H - mm(18), f.label, 8.5, softInk);
  } else if (template === 'image') {
    const c = hasImage ? WHITE : ink;
    const size = fitWrap(f.extraBold, safeTitle, 38, 20, 2);
    const tl = wrapText(f.extraBold, safeTitle, size, innerW);
    const top = B + H - mm(62) + mm(10);
    taglineAt(B + mm(14), c);
    let bottom = top + size * 1.15 * tl.length;
    tag('title', () => lines(tl, fx + pad, top, f.extraBold, size, 1.15, c));
    if (sub && bottom + mm(4) < B + H - mm(26)) tag('subtitle', () => lines(wrapText(f.regular, sub, 10, innerW), fx + pad, bottom + mm(3), f.regular, 10, 1.4, c));
    tag('author', () => text(a, fx + pad, B + H - mm(18), f.bold, 11.5, c));
    if (p) text(p, fx + W - pad - f.label.widthOfTextAtSize(p, 8), B + H - mm(18), f.label, 8, c);
    if (!hasImage) warnings.push('이미지 템플릿인데 이미지가 없습니다 — 색 바탕으로 만들었습니다.');
  } else if (template === 'frame') {
    const inset = mm(9);
    tag('rule', () => {
      strokeRect(fx + inset, B + inset, W - 2 * inset, H - 2 * inset, accent, 1.4);
      strokeRect(fx + inset + mm(2.2), B + inset + mm(2.2), W - 2 * inset - mm(4.4), H - 2 * inset - mm(4.4), accent, 0.4);
    });
    const size = fitWrap(f.extraBold, safeTitle, 34, 18, 2);
    const tl = wrapText(f.extraBold, safeTitle, size, innerW * 0.92);
    taglineAt(B + mm(17), toPdf('#55534d'), 'center');
    const bottom = B + mm(30) + size * 1.18 * tl.length;
    tag('title', () => lines(tl, fx + pad, B + mm(30), f.extraBold, size, 1.18, accent, { align: 'center', boxW: innerW }));
    if (sub) tag('subtitle', () => lines(wrapText(f.regular, sub, 10.5, innerW), fx + pad, bottom + mm(5), f.regular, 10.5, 1.4, toPdf('#55534d'), { align: 'center', boxW: innerW }));
    if (!hasImage && slotBox) {
      const r = slotBox.w * 0.32;
      page.drawEllipse({ x: slotBox.x + slotBox.w / 2, y: slotBox.y + slotBox.h / 2, xScale: r, yScale: r, color: accent });
    }
    const cx = (str, font, sz) => fx + (W - font.widthOfTextAtSize(str, sz)) / 2;
    if (a) tag('author', () => text(a, cx(a, f.bold, 12), B + H - mm(34), f.bold, 12, K100));
    if (p) text(p, cx(p, f.label, 8), B + H - mm(22), f.label, 8, toPdf('#55534d'));
  } else if (template === 'split') {
    const lowerHex = mixHex(color, '#000000', 0.35);
    if (!hasImage) rect(fx, B + H * 0.58, W + rightBleed, H * 0.42 + B, toPdf(lowerHex));
    const size = fitWrap(f.extraBold, safeTitle, 40, 20, 2);
    const tl = wrapText(f.extraBold, safeTitle, size, innerW);
    taglineAt(B + mm(13), softInk);
    const bottom = B + mm(26) + size * 1.14 * tl.length;
    tag('title', () => lines(tl, fx + pad, B + mm(26), f.extraBold, size, 1.14, ink));
    if (sub) tag('subtitle', () => lines(wrapText(f.regular, sub, 10.5, innerW), fx + pad, bottom + mm(5), f.regular, 10.5, 1.4, softInk));
    tag('author', () => text(a, fx + pad, B + H * 0.58 - mm(10), f.bold, 12, ink));
    const pc = hasImage ? WHITE : (isDark(lowerHex) ? WHITE : K100);
    if (p) text(p, fx + W - pad - f.label.widthOfTextAtSize(p, 8), B + H - mm(14), f.label, 8, pc);
  }

  // ---------- spine ----------
  const sp = panel('spine');
  const spX = mm(sp.x); const spW = mm(sp.width);
  const spineHex = template === 'image' ? '#17191c' : color;
  page.drawRectangle({ x: spX, y: 0, width: spW, height: totalH, color: toPdf(spineHex), borderWidth: 0 });
  const spInk = isDark(spineHex) ? WHITE : K100;
  if (sp.width >= 7) {
    const size = Math.min(11, spW * 0.58);
    let y = B + mm(13);
    const stack = (str, font, sz, gapAfter) => {
      Array.from(nfc(str).replace(/\s+/g, ' ')).forEach((ch) => {
        if (ch === ' ') { y += sz * 0.45; return; }
        const w = font.widthOfTextAtSize(ch, sz);
        text(ch, spX + (spW - w) / 2, y + sz * 0.88, font, sz, spInk);
        y += sz * 1.08;
      });
      y += gapAfter;
    };
    const y0 = y;
    tag('spineTitle', () => { y = y0; stack(safeTitle, f.extraBold, size, size * 1.3); });
    if (a) stack(a, f.regular, size * 0.8, 0);
    if (p) {
      const ps = size * 0.72;
      const chars = Array.from(p.replace(/\s+/g, ''));
      let py = B + H - mm(10) - chars.length * ps * 1.08;
      if (py < y + mm(6)) warnings.push('책등 글자가 길어 아래쪽 출판사명과 가까울 수 있습니다 — 책등 교정 확인');
      chars.forEach((ch) => {
        const w = f.label.widthOfTextAtSize(ch, ps);
        text(ch, spX + (spW - w) / 2, py + ps * 0.88, f.label, ps, spInk);
        py += ps * 1.08;
      });
    }
    report.spineText = 'vertical-upright';
  } else if (sp.width >= 4) {
    const size = Math.min(8.5, spW * 0.62);
    const str = [safeTitle, a].filter(Boolean).join('  ');
    const w = f.bold.widthOfTextAtSize(str, size);
    tag('spineTitle', () => S.page.drawText(str, { x: spX + spW / 2 - size * 0.35, y: B + H / 2 + w / 2, size, font: fontOf(f.bold), color: colorOf(spInk), rotate: degrees(-90) }));
    report.spineText = 'rotated';
  } else {
    warnings.push(`책등 ${sp.width}mm — 4mm 미만이라 책등 글자를 넣지 않았습니다.`);
  }

  // ---------- back ----------
  const back = panel('back');
  const bx = mm(back.x);
  const backInk = template === 'frame' ? K100 : ink;
  const backSoft = template === 'frame' ? toPdf('#55534d') : softInk;
  let cursorTop = B + mm(24);
  const endorsements = (design.endorsements || []).filter((e) => e && String(e.quote || '').trim()).slice(0, 4);
  endorsements.forEach((e) => {
    const q = nfc(String(e.quote).trim());
    const qLines = wrapText(f.bold, `“${q.replace(/^[“"]|[”"]$/g, '')}”`, 10.2, innerW);
    cursorTop = lines(qLines, bx + pad, cursorTop, f.bold, 10.2, 1.6, backInk);
    const who = [e.name, e.role].filter(Boolean).map((v) => nfc(String(v).trim())).join(' · ');
    if (who) {
      const label = `— ${who}`;
      text(label, bx + pad + innerW - f.regular.widthOfTextAtSize(label, 8.6), cursorTop + mm(4.2), f.regular, 8.6, backSoft);
      cursorTop += mm(6);
    }
    cursorTop += mm(5);
  });
  if (endorsements.length) {
    rect(bx + pad, cursorTop - mm(1), mm(10), 0.7, backSoft);
    cursorTop += mm(5);
  }
  const copy = nfc(design.backCopy || '').trim();
  if (copy) {
    const size = 9.6;
    const cl = wrapText(f.regular, copy, size, innerW);
    cursorTop = lines(cl, bx + pad, cursorTop, f.regular, size, 1.75, backInk);
  }
  if (cursorTop > B + H - mm(52)) warnings.push('뒤표지 추천사·소개 글이 길어 바코드 영역과 겹칠 수 있습니다 — 글을 줄이세요.');
  if (p) text(p, bx + pad, B + H - mm(14), f.label, 7.5, backSoft);

  const bc = drawIsbnBarcode(page, f, { rightX: bx + W - mm(10), bottomY: B + mm(14) - mm(5 * 0.33 * 0.9) - mm(4), isbn, addon: design.addon, price });
  report.barcode = bc.report;
  warnings.push(...bc.warnings);
  blockers.push(...bc.blockers);
  if (!String(isbn || '').replace(/\D/g, '')) {
    warnings.push('ISBN이 없어 뒤표지 바코드를 넣지 않았습니다 — 발급 후 재생성하세요.');
    if (price) {
      const pt = priceText(price);
      text(pt, bx + W - mm(10) - f.bold.widthOfTextAtSize(pt, 9), B + H - mm(14), f.bold, 9, backInk);
    }
  }

  // ---------- flaps ----------
  if (geo.flapMm > 0) {
    const ff = panel('flapFront'); const bf = panel('flapBack');
    const fpad = mm(12); const fw = mm(ff.width) - 2 * fpad;
    const bio = nfc(design.authorBio || '').trim();
    if (a) text(a, mm(ff.x) + fpad, B + mm(24) + 11, f.bold, 11, backInk);
    if (bio) lines(wrapText(f.regular, bio, 8.6, fw), mm(ff.x) + fpad, B + mm(33), f.regular, 8.6, 1.7, backInk);
    if (p) text(p, mm(bf.x) + fpad, B + H - mm(30), f.label, 8, backSoft);
  }

  if (!isDark(bgHex) && template !== 'frame' && luminance(bgHex) > 0.9) warnings.push('표지 바탕이 매우 밝습니다 — 흰 종이와 구분되는지 교정쇄로 확인하세요.');
  warnings.push(`표지 색 ${color} → CMYK ${hexToCmyk(color).map((v) => Math.round(v * 100)).join('/')} (화면 기준 근사값) — 색 교정 필요`);

  // glyph coverage
  const gReg = fontkit.create(padFontBytes(fonts.regular));
  const gXb = fontkit.create(padFontBytes(fonts.extraBold));
  const checkGlyphs = (str, g) => Array.from(str || '').forEach((ch) => {
    if (/\s/.test(ch)) return;
    if (!g.hasGlyphForCodePoint(ch.codePointAt(0))) blockers.push(`표지 서체에 없는 글자: ${ch}`);
  });
  checkGlyphs(safeTitle, gXb);
  checkGlyphs(`${a}${p}${sub}${copy}${tagline}${design.authorBio || ''}${endorsements.map((e) => `${e.quote}${e.name || ''}${e.role || ''}`).join('')}${design.band?.headline || ''}${design.band?.copy || ''}${design.band?.endorsement || ''}`, gReg);

  stampMeta(doc, safeTitle, '표지', generatedAt);
  const bytes = await doc.save({ useObjectStreams: false });

  // ---------- finish plate (후가공 판): same geometry, K100 = processed area ----------
  let finish = null;
  if (finishTargets.size && replay.length) {
    const fdoc = await PDFDocument.create();
    fdoc.registerFontkit(fontkit);
    const ff2 = await embedSet(fdoc, fonts);
    const fpage = fdoc.addPage([totalW, totalH]);
    setBoxes(fpage, totalW, totalH, B, H);
    S.page = fpage;
    S.map = new Map([[f.regular, ff2.regular], [f.bold, ff2.bold], [f.extraBold, ff2.extraBold], [f.label, ff2.label]]);
    S.force = K100;
    replay.forEach((fn) => fn());
    S.page = page; S.map = null; S.force = null;
    // registration label outside the trim (inside bleed) so the plate is unmistakable
    fpage.drawText(`${FINISH_TYPES[finishType]} 판 · K100 = 가공 영역`, { x: B + 2, y: 1, size: 5, font: ff2.regular, color: K100 });
    stampMeta(fdoc, safeTitle, `후가공 판(${FINISH_TYPES[finishType]})`, generatedAt);
    const fwarn = [];
    if (S.minTextPt < 8 && (finishType === 'gold' || finishType === 'silver' || finishType === 'emboss')) fwarn.push(`${FINISH_TYPES[finishType]} 대상 글자 중 ${round1(S.minTextPt)}pt가 있습니다 — 박·형압은 8pt 이상, 획 0.15mm 이상을 권장합니다.`);
    if (S.minRulePt < 0.7 && finishType !== 'spotUV') fwarn.push(`${FINISH_TYPES[finishType]} 대상 선 두께 ${round1(S.minRulePt)}pt — 0.25mm(0.7pt) 미만 선은 박이 끊길 수 있습니다.`);
    if (finishType === 'spotUV' && hasImage && finishTargets.has('title')) fwarn.push('이미지 위 부분 UV 제목 — 이미지와의 맞춤(핀트) 허용 오차를 인쇄소와 확인하세요.');
    finish = {
      bytes: await fdoc.save({ useObjectStreams: false }),
      type: finishType,
      label: FINISH_TYPES[finishType],
      targets: [...finishTargets].map((t) => FINISH_TARGETS[t]),
      warnings: fwarn
    };
    warnings.push(...fwarn);
    warnings.push(`${FINISH_TYPES[finishType]} 후가공 판을 별도 PDF로 만들었습니다 — 표지 PDF와 같은 크기·위치이며 인쇄소에 함께 전달합니다.`);
  } else if (finishType !== 'none') {
    warnings.push('후가공 대상 요소가 이 표지 템플릿에 없어 후가공 판을 만들지 않았습니다.');
  }

  // ---------- belly band (띠지) ----------
  let band = null;
  if (design.band?.enabled) {
    band = await buildBellyBand({ geo, fonts, design, color, isbn, addon: design.addon, price, title: safeTitle, generatedAt });
    warnings.push(...band.warnings);
    blockers.push(...band.blockers);
  }

  return { bytes, geometry: geo, report, warnings, blockers: [...new Set(blockers)], finish, band };
}

/**
 * 띠지 (belly band): same width as the cover spread (incl. flaps), band height + bleed.
 * Covers the lower part of the jacket — so when it hides the ISBN barcode, the barcode is repeated on the band.
 */
async function buildBellyBand({ geo, fonts, design, color, isbn, addon, price, title, generatedAt }) {
  const b = design.band || {};
  const bandMm = Math.min(120, Math.max(40, Number(b.heightMm) || 70));
  const B = mm(geo.bleedMm);
  const totalW = mm(geo.totalWidthMm);
  const H = mm(bandMm);
  const totalH = H + 2 * B;
  const warnings = [];
  const blockers = [];
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  const f = await embedSet(doc, fonts);
  const page = doc.addPage([totalW, totalH]);
  setBoxes(page, totalW, totalH, B, H);
  const bandHex = /^#[0-9a-f]{3,6}$/i.test(b.color || '') ? b.color : (isDark(color) ? '#f1efe9' : '#17191c');
  const ink = isDark(bandHex) ? WHITE : K100;
  page.drawRectangle({ x: 0, y: 0, width: totalW, height: totalH, color: toPdf(bandHex), borderWidth: 0 });
  const panel = (key) => geo.panels.find((p) => p.key === key);
  const front = panel('front'); const back = panel('back'); const sp = panel('spine');
  const pad = mm(12);
  const fw = mm(front.width) - 2 * pad;
  const topY = B + H; // PDF y of the band's top trim edge
  const headline = nfc(String(b.headline || '').trim());
  const copy = nfc(String(b.copy || '').trim());
  if (headline) {
    let size = 22;
    while (size > 11 && wrapText(f.extraBold, headline, size, fw).length > 2) size -= 1;
    let y = topY - mm(9) - size * 0.88;
    wrapText(f.extraBold, headline, size, fw).forEach((ln) => { page.drawText(ln, { x: mm(front.x) + pad, y, size, font: f.extraBold, color: ink }); y -= size * 1.2; });
    if (copy) {
      wrapText(f.regular, copy, 9.2, fw).slice(0, 4).forEach((ln) => { y -= 2; page.drawText(ln, { x: mm(front.x) + pad, y: y - 9.2 * 0.5, size: 9.2, font: f.regular, color: ink }); y -= 9.2 * 1.5; });
    }
    if (y < B + mm(4)) warnings.push('띠지 앞면 문구가 띠지 높이보다 깁니다 — 문구를 줄이거나 띠지를 높이세요.');
  } else warnings.push('띠지 앞면 문구(헤드라인)가 비어 있습니다.');
  if (sp.width >= 7) {
    const s2 = Math.min(9, mm(sp.width) * 0.5);
    let y = topY - mm(6) - s2;
    Array.from(title.replace(/\s+/g, '')).slice(0, Math.floor((H - mm(10)) / (s2 * 1.1))).forEach((ch) => {
      page.drawText(ch, { x: mm(sp.x) + (mm(sp.width) - f.extraBold.widthOfTextAtSize(ch, s2)) / 2, y, size: s2, font: f.extraBold, color: ink });
      y -= s2 * 1.1;
    });
  }
  const end = nfc(String(b.endorsement || '').trim());
  const bw = mm(back.width) - 2 * pad;
  if (end) {
    let y = topY - mm(9) - 10 * 0.88;
    wrapText(f.bold, end, 9.6, bw * 0.62).slice(0, 5).forEach((ln) => { page.drawText(ln, { x: mm(back.x) + pad, y, size: 9.6, font: f.bold, color: ink }); y -= 9.6 * 1.5; });
  }
  // Barcode on the band when the band hides the cover barcode (cover barcode top ≈ 14mm + plate).
  let barcode = null;
  if (String(isbn || '').replace(/\D/g, '') && bandMm >= 42) {
    const bc = drawIsbnBarcode(page, f, { rightX: mm(back.x) + mm(back.width) - mm(10), bottomY: B + mm(14) - mm(5 * 0.33 * 0.9) - mm(4), isbn, addon, price });
    barcode = bc.report; warnings.push(...bc.warnings); blockers.push(...bc.blockers);
    warnings.push('띠지가 뒤표지 바코드를 가리므로 띠지에도 같은 바코드를 넣었습니다.');
  }
  stampMeta(doc, title, `띠지 ${bandMm}mm`, generatedAt);
  return {
    bytes: await doc.save({ useObjectStreams: false }),
    heightMm: bandMm,
    widthMm: geo.trimWidthMm,
    totalWidthMm: geo.totalWidthMm,
    totalHeightMm: round1(bandMm + 2 * geo.bleedMm),
    barcode,
    warnings,
    blockers
  };
}
