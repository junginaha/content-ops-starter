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

export const COVER_TEMPLATES = {
  typo: { label: '타이포', desc: '단색 바탕에 큰 제목' },
  image: { label: '이미지', desc: '앞표지 전면 이미지 + 아래 제목' },
  frame: { label: '프레임', desc: '종이색 바탕, 테두리와 이미지 창' },
  split: { label: '분할', desc: '위 색면 + 아래 이미지' }
};

const PAPER_HEX = '#f1efe9';

// ---------- colour ----------
function hexToRgb(hex) {
  let h = String(hex || '#000000').replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h, 16) || 0;
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
/** Naive device conversion — screen colour is an approximation of print; a proof is required. */
export function hexToCmyk(hex) {
  const [r, g, b] = hexToRgb(hex).map((v) => v / 255);
  const k = 1 - Math.max(r, g, b);
  if (k >= 0.999) return [0, 0, 0, 1];
  const c = (1 - r - k) / (1 - k);
  const m = (1 - g - k) / (1 - k);
  const y = (1 - b - k) / (1 - k);
  const q = (v) => Math.round(Math.min(1, Math.max(0, v)) * 1000) / 1000;
  return [q(c), q(m), q(y), q(k)];
}
function luminance(hex) {
  const c = hexToRgb(hex).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
function mixHex(a, b, t) {
  const A = hexToRgb(a); const B = hexToRgb(b);
  return `#${A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join('')}`;
}
const toPdf = (hex) => cmyk(...hexToCmyk(hex));
const K100 = cmyk(0, 0, 0, 1);
const WHITE = cmyk(0, 0, 0, 0);
const isDark = (hex) => luminance(hex) <= 0.42;

// ---------- image slot (mm), so the UI can crop/darken the picture before it reaches the PDF ----------
export function designImageSlot({ template, trimWidthMm, trimHeightMm, bleedMm = 3, flapMm = 0 }) {
  const W = Number(trimWidthMm); const H = Number(trimHeightMm); const b = Number(bleedMm);
  const right = Number(flapMm) > 0 ? 0 : b;
  if (template === 'image') return { widthMm: W + right, heightMm: H + 2 * b, darkenBottom: 0.36 };
  if (template === 'split') return { widthMm: W + right, heightMm: H * 0.42 + b, darkenBottom: 0 };
  if (template === 'frame') return { widthMm: W * 0.46, heightMm: W * 0.46, darkenBottom: 0 };
  return null;
}

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
  const f = {
    regular: await doc.embedFont(padFontBytes(fonts.regular), { subset: false }),
    bold: await doc.embedFont(padFontBytes(fonts.bold), { subset: false }),
    extraBold: await doc.embedFont(padFontBytes(fonts.extraBold), { subset: false })
  };
  const sansUsed = !!fonts.sansBold;
  f.label = sansUsed ? await doc.embedFont(padFontBytes(fonts.sansBold), { subset: false }) : f.bold;
  const page = doc.addPage([totalW, totalH]);
  page.setMediaBox(0, 0, totalW, totalH);
  page.setBleedBox(0, 0, totalW, totalH);
  page.setTrimBox(B, B, totalW - 2 * B, H);

  const warnings = [];
  const blockers = [];
  const report = { image: null, barcode: null, spineText: 'none', style: `1900-${template}`, sansUsed, design: { template, color, cmyk: hexToCmyk(color) } };

  // y measured from the TOP page edge (incl. bleed) → PDF y.
  const Y = (fromTop) => totalH - fromTop;
  const rect = (x, yTop, w, h, c) => page.drawRectangle({ x, y: totalH - yTop - h, width: w, height: h, color: c, borderWidth: 0 });
  const text = (str, x, baselineFromTop, font, size, c) => { if (str) page.drawText(str, { x, y: Y(baselineFromTop), size, font, color: c }); };
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

  // ---------- image ----------
  let slotBox = null; // PDF-space box for the picture
  const slotMm = designImageSlot({ template, trimWidthMm, trimHeightMm, bleedMm, flapMm });
  if (slotMm) {
    if (template === 'image') slotBox = { x: fx, y: 0, w: W + rightBleed, h: totalH };
    else if (template === 'split') slotBox = { x: fx, y: 0, w: W + rightBleed, h: mm(slotMm.heightMm) };
    else if (template === 'frame') { const s = mm(slotMm.widthMm); slotBox = { x: fx + (W - s) / 2, y: Y(B + H * 0.47) - s, w: s, h: s }; }
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
    // The caller crops to the slot ratio; centred cover-fit keeps any residue symmetric.
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
    for (let s = max; s >= min; s -= 1) if (wrapText(font, str, s, innerW).length <= maxLines) return s;
    return min;
  };

  if (template === 'typo') {
    const words = safeTitle.split(/\s+/).filter(Boolean);
    const stacked = words.length <= 4;
    const size = stacked ? fitStack(f.extraBold, words, 64, 24) : fitWrap(f.extraBold, safeTitle, 44, 20);
    const titleLines = stacked ? words : wrapText(f.extraBold, safeTitle, size, innerW);
    rect(fx + pad, B + mm(22), mm(14), 1.2, ink);
    let bottom = lines(titleLines, fx + pad, B + mm(28), f.extraBold, size, 1.1, ink);
    if (sub) bottom = lines(wrapText(f.regular, sub, 11, innerW), fx + pad, bottom + mm(6), f.regular, 11, 1.5, softInk);
    text(a, fx + pad, B + H - mm(34), f.bold, 13, ink);
    text(p, fx + pad, B + H - mm(18), f.label, 8.5, softInk);
  } else if (template === 'image') {
    const c = hasImage ? WHITE : ink;
    const size = fitWrap(f.extraBold, safeTitle, 38, 20, 2);
    const tl = wrapText(f.extraBold, safeTitle, size, innerW);
    const top = B + H - mm(62) + mm(10);
    const bottom = lines(tl, fx + pad, top, f.extraBold, size, 1.15, c);
    if (sub && bottom + mm(4) < B + H - mm(26)) lines(wrapText(f.regular, sub, 10, innerW), fx + pad, bottom + mm(3), f.regular, 10, 1.4, c);
    text(a, fx + pad, B + H - mm(18), f.bold, 11.5, c);
    if (p) text(p, fx + W - pad - f.label.widthOfTextAtSize(p, 8), B + H - mm(18), f.label, 8, c);
    if (!hasImage) warnings.push('이미지 템플릿인데 이미지가 없습니다 — 색 바탕으로 만들었습니다.');
  } else if (template === 'frame') {
    const inset = mm(9);
    page.drawRectangle({ x: fx + inset, y: B + inset, width: W - 2 * inset, height: H - 2 * inset, borderColor: accent, borderWidth: 1.4 });
    page.drawRectangle({ x: fx + inset + mm(2.2), y: B + inset + mm(2.2), width: W - 2 * inset - mm(4.4), height: H - 2 * inset - mm(4.4), borderColor: accent, borderWidth: 0.4 });
    const size = fitWrap(f.extraBold, safeTitle, 34, 18, 2);
    const tl = wrapText(f.extraBold, safeTitle, size, innerW * 0.92);
    let bottom = lines(tl, fx + pad, B + mm(30), f.extraBold, size, 1.18, accent, { align: 'center', boxW: innerW });
    if (sub) lines(wrapText(f.regular, sub, 10.5, innerW), fx + pad, bottom + mm(5), f.regular, 10.5, 1.4, toPdf('#55534d'), { align: 'center', boxW: innerW });
    if (!hasImage && slotBox) {
      const r = slotBox.w * 0.32;
      page.drawEllipse({ x: slotBox.x + slotBox.w / 2, y: slotBox.y + slotBox.h / 2, xScale: r, yScale: r, color: accent });
    }
    const cx = (str, font, s) => fx + (W - font.widthOfTextAtSize(str, s)) / 2;
    if (a) text(a, cx(a, f.bold, 12), B + H - mm(34), f.bold, 12, K100);
    if (p) text(p, cx(p, f.label, 8), B + H - mm(22), f.label, 8, toPdf('#55534d'));
  } else if (template === 'split') {
    const lowerHex = mixHex(color, '#000000', 0.35);
    if (!hasImage) rect(fx, B + H * 0.58, W + rightBleed, H * 0.42 + B, toPdf(lowerHex));
    const size = fitWrap(f.extraBold, safeTitle, 40, 20, 2);
    const tl = wrapText(f.extraBold, safeTitle, size, innerW);
    let bottom = lines(tl, fx + pad, B + mm(26), f.extraBold, size, 1.14, ink);
    if (sub) lines(wrapText(f.regular, sub, 10.5, innerW), fx + pad, bottom + mm(5), f.regular, 10.5, 1.4, softInk);
    text(a, fx + pad, B + H * 0.58 - mm(10), f.bold, 12, ink);
    const pc = hasImage ? WHITE : (isDark(lowerHex) ? WHITE : K100);
    if (p) text(p, fx + W - pad - f.label.widthOfTextAtSize(p, 8), B + H - mm(14), f.label, 8, pc);
  }

  // ---------- spine ----------
  const sp = panel('spine');
  const spX = mm(sp.x); const spW = mm(sp.width);
  const spineHex = template === 'frame' ? color : template === 'image' ? '#17191c' : color;
  page.drawRectangle({ x: spX, y: 0, width: spW, height: totalH, color: toPdf(spineHex), borderWidth: 0 });
  const spInk = isDark(spineHex) ? WHITE : K100;
  if (sp.width >= 7) {
    const size = Math.min(11, spW * 0.58);
    let y = B + mm(13);
    const stack = (str, font, s, gapAfter) => {
      Array.from(nfc(str).replace(/\s+/g, ' ')).forEach((ch) => {
        if (ch === ' ') { y += s * 0.45; return; }
        const w = font.widthOfTextAtSize(ch, s);
        text(ch, spX + (spW - w) / 2, y + s * 0.88, font, s, spInk);
        y += s * 1.08;
      });
      y += gapAfter;
    };
    stack(safeTitle, f.extraBold, size, size * 1.3);
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
    page.drawText(str, { x: spX + spW / 2 - size * 0.35, y: B + H / 2 + w / 2, size, font: f.bold, color: spInk, rotate: degrees(-90) });
    report.spineText = 'rotated';
  } else {
    warnings.push(`책등 ${sp.width}mm — 4mm 미만이라 책등 글자를 넣지 않았습니다.`);
  }

  // ---------- back ----------
  const back = panel('back');
  const bx = mm(back.x);
  const backInk = template === 'frame' ? K100 : ink;
  const backSoft = template === 'frame' ? toPdf('#55534d') : softInk;
  const copy = nfc(design.backCopy || '').trim();
  if (copy) {
    const size = 9.6;
    const cl = wrapText(f.regular, copy, size, innerW);
    const end = lines(cl, bx + pad, B + mm(26), f.regular, size, 1.75, backInk);
    if (end > H - mm(52)) warnings.push('뒤표지 소개 글이 길어 바코드 영역과 겹칠 수 있습니다 — 글을 줄이세요.');
  }
  if (p) text(p, bx + pad, B + H - mm(14), f.label, 7.5, backSoft);

  const digits = String(isbn || '').replace(/[^0-9]/g, '');
  const addon = String(design.addon || '').replace(/\D/g, '');
  if (digits) {
    try {
      const bits = ean13Modules(digits);
      const mag = 0.9;
      const moduleW = mm(0.33 * mag);
      const barH = mm(22.85 * mag * 0.8);
      const guardExtra = mm(5 * 0.33 * mag);
      const quietLeft = 11 * moduleW;
      const quietRight = 7 * moduleW;
      const codeW = 95 * moduleW;
      const hasAddon = addon.length === 5;
      const addonGap = 9 * moduleW;
      const addonW = hasAddon ? 47 * moduleW : 0;
      const blockW = quietLeft + codeW + (hasAddon ? addonGap + addonW : 0) + quietRight;
      const x0 = bx + W - mm(10) - blockW + quietLeft;
      const y0 = B + mm(14);
      const textSize = 8.5 * mag + 1;
      const plateTop = barH + mm(price ? 11 : 6);
      page.drawRectangle({ x: x0 - quietLeft, y: y0 - guardExtra - mm(4), width: blockW, height: plateTop + guardExtra + mm(4), color: WHITE, borderWidth: 0 });
      const label = /-/.test(String(isbn)) ? `ISBN ${String(isbn).trim()}` : `ISBN ${digits}`;
      page.drawText(label, { x: x0 + (codeW - f.regular.widthOfTextAtSize(label, 8)) / 2, y: y0 + barH + mm(2), size: 8, font: f.regular, color: K100 });
      const hr = [digits[0], digits.slice(1, 7), digits.slice(7)];
      const ty = y0 - guardExtra - textSize * 0.2;
      page.drawText(hr[0], { x: x0 - quietLeft + mm(0.6), y: ty, size: textSize, font: f.regular, color: K100 });
      page.drawText(hr[1], { x: x0 + 3 * moduleW + (42 * moduleW - f.regular.widthOfTextAtSize(hr[1], textSize)) / 2, y: ty, size: textSize, font: f.regular, color: K100 });
      page.drawText(hr[2], { x: x0 + 50 * moduleW + (42 * moduleW - f.regular.widthOfTextAtSize(hr[2], textSize)) / 2, y: ty, size: textSize, font: f.regular, color: K100 });
      if (price) {
        const pt = `값 ${String(price).replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원`;
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
        const d = addon.split('').map(Number);
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
        page.drawText(addon, { x: ax + (addonW - f.regular.widthOfTextAtSize(addon, textSize)) / 2, y: y0 - guardExtra + ah + mm(1), size: textSize, font: f.regular, color: K100 });
      } else if (addon) {
        warnings.push('부가기호는 숫자 5자리여야 합니다 — 부가기호 바코드를 넣지 않았습니다.');
      }
      report.barcode = {
        symbology: hasAddon ? 'EAN-13+5' : 'EAN-13',
        value: digits,
        addon: hasAddon ? addon : null,
        magnification: mag,
        moduleMm: round1(0.33 * mag * 100) / 100,
        widthMm: round1(blockW / PT_PER_MM),
        heightMm: round1((barH + guardExtra) / PT_PER_MM),
        decoded: decodeEan13Modules(bits)
      };
    } catch (error) {
      blockers.push(`ISBN 바코드 생성 불가: ${error.message}`);
    }
  } else {
    warnings.push('ISBN이 없어 뒤표지 바코드를 넣지 않았습니다 — 발급 후 재생성하세요.');
    if (price) {
      const pt = `값 ${String(price).replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원`;
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
  checkGlyphs(`${a}${p}${sub}${copy}${design.authorBio || ''}`, gReg);

  doc.setTitle(`${safeTitle} — 표지`);
  doc.setCreator('ooOS Publishing OS · 1900');
  doc.setProducer('ooOS Publishing OS (pdf-lib)');
  doc.setLanguage('ko-KR');
  doc.setCreationDate(new Date(generatedAt));
  doc.setModificationDate(new Date(generatedAt));
  const bytes = await doc.save({ useObjectStreams: false });
  return { bytes, geometry: geo, report, warnings, blockers: [...new Set(blockers)] };
}
