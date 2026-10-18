// Wrap cover PDF (back + spine + front [+ flaps] + bleed), vector EAN-13 ISBN barcode, and a dimension guide.
import {
  PDFDocument,
  beginText,
  endText,
  setFontAndSize,
  setTextMatrix,
  showText,
  setFillingCmykColor,
  setStrokingCmykColor,
  setLineWidth,
  setDashPattern,
  moveTo,
  lineTo,
  stroke,
  rectangle,
  fill,
  clip,
  endPath,
  pushGraphicsState,
  popGraphicsState,
  rotateAndSkewTextRadiansAndTranslate,
  appendBezierCurve,
  closePath
} from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { padFontBytes, PT_PER_MM } from './interiorPdf';
import { nfc } from './bookStructure';
import { typeOn, cmykLuminance } from './coverGenome';

const mm = (value) => Number(value) * PT_PER_MM;
const round1 = (value) => Math.round(Number(value) * 10) / 10;
// 16000 → 16,000 (값 표기는 천 단위 쉼표가 관례)
const formatPrice = (value) => String(value).replace(/[^0-9]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');

// ---------- spine ----------
export function calculateSpineMm({ pageCount, paperCaliperMm = 0.1, coverAllowanceMm = 0.5 }) {
  const pages = Number(pageCount) || 0;
  const leaves = Math.ceil(pages / 2);
  return round1(leaves * Number(paperCaliperMm) + Number(coverAllowanceMm));
}

// ---------- EAN-13 ----------
const L_CODES = ['0001101', '0011001', '0010011', '0111101', '0100011', '0110001', '0101111', '0111011', '0110111', '0001011'];
const G_CODES = ['0100111', '0110011', '0011011', '0100001', '0011101', '0111001', '0000101', '0010001', '0001001', '0010111'];
const R_CODES = ['1110010', '1100110', '1101100', '1000010', '1011100', '1001110', '1010000', '1000100', '1001000', '1110100'];
const PARITY = ['LLLLLL', 'LLGLGG', 'LLGGLG', 'LLGGGL', 'LGLLGG', 'LGGLLG', 'LGGGLL', 'LGLGLG', 'LGLGGL', 'LGGLGL'];

export function ean13CheckDigit(first12) {
  const digits = String(first12).split('').map(Number);
  const sum = digits.reduce((total, digit, index) => total + digit * (index % 2 === 0 ? 1 : 3), 0);
  return (10 - (sum % 10)) % 10;
}

export function ean13Modules(code) {
  const digits = String(code).replace(/[^0-9]/g, '');
  if (!/^\d{13}$/.test(digits)) throw new Error('EAN-13 바코드는 숫자 13자리가 필요합니다.');
  if (ean13CheckDigit(digits.slice(0, 12)) !== Number(digits[12])) throw new Error('ISBN 체크디지트가 맞지 않습니다.');
  const parity = PARITY[Number(digits[0])];
  let bits = '101';
  for (let i = 1; i <= 6; i += 1) {
    const d = Number(digits[i]);
    bits += parity[i - 1] === 'L' ? L_CODES[d] : G_CODES[d];
  }
  bits += '01010';
  for (let i = 7; i <= 12; i += 1) bits += R_CODES[Number(digits[i])];
  bits += '101';
  return bits; // 95 modules
}

// Decoder used by tests and preflight to prove the drawn pattern round-trips.
export function decodeEan13Modules(bits) {
  if (bits.length !== 95 || !bits.startsWith('101') || !bits.endsWith('101') || bits.slice(45, 50) !== '01010') return null;
  const left = [];
  let parity = '';
  for (let i = 0; i < 6; i += 1) {
    const chunk = bits.slice(3 + i * 7, 10 + i * 7);
    const l = L_CODES.indexOf(chunk);
    const g = G_CODES.indexOf(chunk);
    if (l >= 0) { left.push(l); parity += 'L'; } else if (g >= 0) { left.push(g); parity += 'G'; } else return null;
  }
  const right = [];
  for (let i = 0; i < 6; i += 1) {
    const r = R_CODES.indexOf(bits.slice(50 + i * 7, 57 + i * 7));
    if (r < 0) return null;
    right.push(r);
  }
  const first = PARITY.indexOf(parity);
  if (first < 0) return null;
  const code = `${first}${left.join('')}${right.join('')}`;
  return ean13CheckDigit(code.slice(0, 12)) === Number(code[12]) ? code : null;
}

function barRuns(bits) {
  const runs = [];
  let i = 0;
  while (i < bits.length) {
    if (bits[i] === '1') {
      let j = i;
      while (j < bits.length && bits[j] === '1') j += 1;
      runs.push([i, j - i]);
      i = j;
    } else i += 1;
  }
  return runs;
}

// ---------- geometry ----------
export function coverGeometry({ trimWidthMm, trimHeightMm, bleedMm = 3, spineMm, flapMm = 0 }) {
  const w = Number(trimWidthMm);
  const h = Number(trimHeightMm);
  const b = Number(bleedMm);
  const s = Number(spineMm);
  const f = Number(flapMm) || 0;
  const panels = [];
  let x = b;
  if (f > 0) { panels.push({ key: 'flapBack', label: '뒤날개', x, width: f }); x += f; }
  panels.push({ key: 'back', label: '뒤표지', x, width: w }); x += w;
  panels.push({ key: 'spine', label: '책등', x, width: s }); x += s;
  panels.push({ key: 'front', label: '앞표지', x, width: w }); x += w;
  if (f > 0) { panels.push({ key: 'flapFront', label: '앞날개', x, width: f }); x += f; }
  const trimWidth = x - b;
  return {
    bleedMm: b,
    trimHeightMm: h,
    trimWidthMm: round1(trimWidth),
    totalWidthMm: round1(trimWidth + 2 * b),
    totalHeightMm: round1(h + 2 * b),
    spineMm: s,
    flapMm: f,
    panels
  };
}

// ---------- genome artwork ----------
const fillC = (c) => setFillingCmykColor(c[0] / 100, c[1] / 100, c[2] / 100, c[3] / 100);
const strokeC = (c) => setStrokingCmykColor(c[0] / 100, c[1] / 100, c[2] / 100, c[3] / 100);

function circlePath(cx, cy, r) {
  const k = 0.5522847498 * r;
  return [
    moveTo(cx + r, cy),
    appendBezierCurve(cx + r, cy + k, cx + k, cy + r, cx, cy + r),
    appendBezierCurve(cx - k, cy + r, cx - r, cy + k, cx - r, cy),
    appendBezierCurve(cx - r, cy - k, cx - k, cy - r, cx, cy - r),
    appendBezierCurve(cx + k, cy - r, cx + r, cy - k, cx + r, cy),
    closePath()
  ];
}

// Large type may carry the palette's deep colour; it must still read against its field.
function titleColourOn(field, palette) {
  if (cmykLuminance(field) < 0.5) return [0, 0, 0, 0];
  return cmykLuminance(palette.deep) < 0.32 ? palette.deep : [0, 0, 0, 100];
}

/**
 * Draws the front-panel composition and returns where the typography may sit.
 * All geometry is in points; the front panel is clipped so nothing leaks onto the spine.
 */
export function composeCoverArt(genome, { frontX, frontW, extendRight, B, H, totalH, inset, title = '', glyphFont = null }) {
  const { palette, motif, layout } = genome;
  const out = [];
  const X0 = frontX;
  const X1 = frontX + frontW;
  const top = B + H;
  const lengths = motif.lengths.slice(0, 12);
  const maxLen = Math.max(...lengths, 1);
  const j = (i) => motif.jitter[i % motif.jitter.length];
  // Default: type on the ground at the top-left.
  const zone = { mode: 'top', align: 'left', field: palette.ground, footField: palette.ground, showPublisher: true };

  out.push(pushGraphicsState(), rectangle(X0, 0, frontW + extendRight, totalH), clip(), endPath());

  if (layout === 'horizon') {
    const hy = B + H * (0.3 + 0.1 * genome.axes.openness);
    const r = frontW * (0.15 + 0.07 * motif.scale);
    const cx = X0 + frontW * motif.position;
    out.push(fillC(palette.accent), ...circlePath(cx, hy, r), fill());
    out.push(fillC(palette.deep), rectangle(X0, 0, frontW + extendRight, hy), fill());
    // Reflection: one stroke per chapter, narrowing toward the bottom.
    const n = motif.count;
    const span = hy - (B + inset + mm(12));
    for (let i = 1; i <= n; i += 1) {
      const y = hy - (span * i) / (n + 1);
      const w = 2 * r * (1 - i / (n + 2)) * (0.55 + 0.45 * j(i));
      out.push(fillC(palette.accent), rectangle(cx - w / 2, y, w, Math.max(1, 2.2 - i * 0.12)), fill());
    }
    zone.footField = palette.deep;
  } else if (layout === 'terrain') {
    // One hill per chapter, height = chapter length; the longest chapter is the lit peak.
    const base = B + inset + mm(8);
    const areaH = H * 0.42;
    const n = lengths.length;
    const slot = (frontW + extendRight) / n;
    const tallest = lengths.indexOf(maxLen);
    const order = lengths.map((len, i) => i).sort((a, b) => lengths[b] - lengths[a]);
    order.forEach((i) => {
      const h = Math.max(mm(6), (lengths[i] / maxLen) * areaH);
      const w = slot * (1.7 + 0.6 * j(i));
      const cx = X0 + slot * (i + 0.5);
      const x0 = cx - w / 2;
      const x1 = cx + w / 2;
      out.push(fillC(i === tallest ? palette.accent : palette.deep), moveTo(x0, base),
        appendBezierCurve(x0 + w * 0.3, base + h * 1.33, x1 - w * 0.3, base + h * 1.33, x1, base), closePath(), fill());
    });
    out.push(fillC(palette.deep), rectangle(X0, 0, frontW + extendRight, base + 0.5), fill());
    zone.footField = palette.deep;
  } else if (layout === 'rings') {
    const corner = motif.corner === 'top-right';
    const cx = corner ? X1 + extendRight * 0.4 : X0;
    const cy = corner ? totalH : 0;
    // Rings stop short of the title block, which sits low-left (zone.bottomY).
    const titleGuess = Math.min(34, frontW / 6.2);
    const clearance = corner ? totalH - (B + H * 0.2 + titleGuess * 3.4) - mm(6) : frontW * 1.02;
    const maxR = Math.min(frontW * 1.02 * motif.scale, clearance);
    const n = Math.max(4, Math.min(9, motif.count + 1));
    for (let i = 0; i < n; i += 1) {
      const r = maxR * (1 - i / n);
      const colour = i % 2 === 0 ? palette.deep : (i % 4 === 1 ? palette.accent : palette.ground);
      out.push(fillC(colour), ...circlePath(cx, cy, r), fill());
    }
    if (corner) { zone.mode = 'bottom'; zone.bottomY = B + H * 0.2; }
    else { zone.footField = palette.deep; zone.showPublisher = false; }
  } else if (layout === 'rhythm') {
    const regionTop = B + H * 0.5;
    const n = lengths.length;
    const gap = mm(1.4);
    const total = lengths.reduce((a, b) => a + b, 0) || 1;
    let y = 0;
    const avail = regionTop - gap * n;
    lengths.forEach((len, i) => {
      const h = Math.max(mm(2.5), (len / total) * avail);
      const w = (frontW + extendRight) * (0.5 + 0.5 * j(i));
      out.push(fillC(i % 3 === 1 ? palette.accent : palette.deep), rectangle(X0, y, w, h), fill());
      y += h + gap;
    });
    zone.showPublisher = false;
  } else if (layout === 'grid') {
    const cols = 4;
    const cell = frontW / cols;
    const startY = B + H * 0.47;
    const rows = Math.ceil((totalH - startY) / cell);
    const cells = [];
    for (let rI = 0; rI < rows; rI += 1) for (let c = 0; c < cols; c += 1) cells.push([c, rI]);
    const fills = Math.min(cells.length - 1, motif.count);
    const order = cells.map((cellPos, i) => ({ cellPos, key: j(i * 7 + 3) + (i % 5) * 0.001 })).sort((a, b) => a.key - b.key);
    order.slice(0, fills).forEach(({ cellPos: [c, rI] }, i) => {
      const colour = i === 0 ? palette.deep : palette.accent;
      const x = X0 + c * cell;
      const yy = startY + rI * cell;
      if (j(i + 11) < 0.35) out.push(fillC(colour), ...circlePath(x + cell / 2, yy + cell / 2, cell * 0.42), fill());
      else out.push(fillC(colour), rectangle(x + cell * 0.08, yy + cell * 0.08, cell * 0.84, cell * 0.84), fill());
    });
    out.push(strokeC(palette.deep), setLineWidth(0.5));
    for (let c = 0; c <= cols; c += 1) out.push(moveTo(X0 + c * cell, startY), lineTo(X0 + c * cell, totalH), stroke());
    for (let rI = 0; rI <= rows; rI += 1) out.push(moveTo(X0, startY + rI * cell), lineTo(X1 + extendRight, startY + rI * cell), stroke());
    zone.mode = 'bottom';
    zone.bottomY = B + H * 0.24;
  } else if (layout === 'band') {
    const bandY = B + H * 0.55;
    out.push(fillC(palette.deep), rectangle(X0, bandY, frontW + extendRight, totalH - bandY), fill());
    const n = lengths.length;
    const areaTop = B + H * 0.4;
    const areaBottom = B + inset + mm(14);
    const rowH = (areaTop - areaBottom) / n;
    lengths.forEach((len, i) => {
      const w = (frontW - 2 * inset) * 0.55 * (0.25 + 0.75 * len / maxLen);
      out.push(fillC(i === lengths.indexOf(maxLen) ? palette.accent : palette.deep), rectangle(X1 - inset - w, areaTop - (i + 1) * rowH + rowH * 0.2, w, rowH * 0.6), fill());
    });
    zone.mode = 'band';
    zone.field = palette.deep;
    zone.bandY = bandY;
  } else if (layout === 'letter' && glyphFont) {
    const ch = Array.from(nfc(title).trim())[0] || '';
    const size = frontW * 1.05;
    const w = glyphFont.font.widthOfTextAtSize(ch, size);
    const x = X1 + extendRight * 0.3 - w * 0.82;
    const y = B + H * 0.02 - size * 0.06;
    out.push(fillC(palette.accent), beginText(), setFontAndSize(glyphFont.key, size), setTextMatrix(1, 0, 0, 1, x, y), showText(glyphFont.font.encodeText(ch)), endText());
    out.push(fillC(palette.deep), rectangle(X0 + inset, B + H * 0.62, mm(12), 1.4), fill());
  } else if (layout === 'mark') {
    const cx = X0 + frontW / 2;
    const cy = B + H * 0.7;
    out.push(fillC(palette.accent), ...circlePath(cx, cy, frontW * 0.032), fill());
    out.push(fillC(palette.deep), rectangle(cx - 0.4, B + H * 0.58, 0.8, H * 0.08), fill());
    zone.mode = 'center';
    zone.align = 'center';
  }
  out.push(popGraphicsState());
  zone.titleColour = titleColourOn(zone.field, palette);
  zone.typeColour = typeOn(zone.field);
  zone.footColour = typeOn(zone.footField);
  return { shapes: out, zone };
}

function wrapText(font, text, size, maxW) {
  const lines = [];
  let cur = '';
  String(text).split(/\s+/).filter(Boolean).forEach((word) => {
    const next = cur ? `${cur} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) <= maxW || !cur) cur = next;
    else { lines.push(cur); cur = word; }
  });
  if (cur) lines.push(cur);
  return lines;
}

function drawTextOps(ops, key, font, size, x, y, text) {
  ops.push(setFontAndSize(key, size), setTextMatrix(1, 0, 0, 1, x, y), showText(font.encodeText(text)));
}

/**
 * @param {object} input
 * @param {{bytes:Uint8Array, type:'jpg'|'png'}} [input.frontImage]
 */
export async function buildCoverPdf({
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
  style = 'humanities',
  genome = null,
  guide = false,
  generatedAt = new Date().toISOString()
} = {}) {
  if (!fonts?.regular || !fonts?.bold || !fonts?.extraBold) throw new Error('표지용 서체 파일을 불러오지 못했습니다.');
  const geo = coverGeometry({ trimWidthMm, trimHeightMm, bleedMm, spineMm, flapMm });
  const totalW = mm(geo.totalWidthMm);
  const totalH = mm(geo.totalHeightMm);
  const B = mm(geo.bleedMm);
  const H = mm(geo.trimHeightMm);
  const panel = (key) => geo.panels.find((p) => p.key === key);

  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  const f = {
    regular: await doc.embedFont(padFontBytes(fonts.regular), { subset: false }),
    bold: await doc.embedFont(padFontBytes(fonts.bold), { subset: false }),
    extraBold: await doc.embedFont(padFontBytes(fonts.extraBold), { subset: false })
  };
  const useSans = !guide && style === 'practical' && fonts.sansBold && fonts.sansExtraBold;
  if (useSans) {
    f.sansBold = await doc.embedFont(padFontBytes(fonts.sansBold), { subset: false });
    f.sansExtraBold = await doc.embedFont(padFontBytes(fonts.sansExtraBold), { subset: false });
  }
  const glyph = fontkit.create(padFontBytes(fonts.extraBold));
  const page = doc.addPage([totalW, totalH]);
  page.setMediaBox(0, 0, totalW, totalH);
  page.setBleedBox(0, 0, totalW, totalH);
  page.setTrimBox(B, B, totalW - 2 * B, H);
  const keys = {
    regular: page.node.newFontDictionary(f.regular.name, f.regular.ref),
    bold: page.node.newFontDictionary(f.bold.name, f.bold.ref),
    extraBold: page.node.newFontDictionary(f.extraBold.name, f.extraBold.ref),
    ...(useSans ? {
      sansBold: page.node.newFontDictionary(f.sansBold.name, f.sansBold.ref),
      sansExtraBold: page.node.newFontDictionary(f.sansExtraBold.name, f.sansExtraBold.ref)
    } : {})
  };

  const warnings = [];
  const blockers = [];
  const report = { image: null, barcode: null, spineText: 'none', style };
  const safety = mm(5);
  const ops = [];
  const shapes = [];
  const safeTitle = nfc(title || '제목 없음').trim();

  // Front artwork (optional): fills the front panel to the bleed edge.
  const front = panel('front');
  const frontX = mm(front.x);
  const frontW = mm(front.width);
  if (frontImage?.bytes && !guide) {
    const img = frontImage.type === 'png' ? await doc.embedPng(frontImage.bytes) : await doc.embedJpg(frontImage.bytes);
    const extendRight = geo.flapMm > 0 ? 0 : B;
    const boxX = frontX;
    const boxY = 0;
    const boxW = frontW + extendRight;
    const boxH = totalH;
    const scale = Math.max(boxW / img.width, boxH / img.height);
    const drawW = img.width * scale;
    const drawH = img.height * scale;
    const ppi = img.width / (drawW / 72);
    report.image = {
      pixels: `${img.width}×${img.height}`,
      placedMm: `${round1(drawW / PT_PER_MM)}×${round1(drawH / PT_PER_MM)}`,
      effectivePpi: Math.round(ppi),
      colorSpace: frontImage.colorSpace || 'unknown'
    };
    if (ppi < 200) blockers.push(`앞표지 이미지 해상도 ${Math.round(ppi)}ppi — 인쇄 최소 300ppi 필요`);
    else if (ppi < 300) warnings.push(`앞표지 이미지 해상도 ${Math.round(ppi)}ppi — 300ppi 권장`);
    if (frontImage.colorSpace && frontImage.colorSpace !== 'CMYK') {
      warnings.push(`앞표지 이미지가 ${frontImage.colorSpace}입니다 — 인쇄소 CMYK 변환 결과 확인 필요`);
    }
    page.pushOperators(
      pushGraphicsState(),
      rectangle(boxX, boxY, boxW, boxH),
      clip(),
      endPath()
    );
    page.drawImage(img, { x: boxX + (boxW - drawW) / 2, y: boxY + (boxH - drawH) / 2, width: drawW, height: drawH });
    page.pushOperators(popGraphicsState());
    warnings.push('앞표지 이미지를 사용했습니다 — 이미지에 제목·저자가 포함됐는지 확인하세요(자동 제목 미배치).');
  }

  let art = null;
  const inkK = [0, 0, 0, 100];
  let backInk = inkK;
  let spineInk = inkK;
  if (!guide && genome) {
    const pal = genome.palette;
    const extendRightFront = geo.flapMm > 0 ? 0 : B;
    // Ground colour runs to the bleed on every panel (around the artwork when an image is supplied).
    if (frontImage?.bytes) {
      shapes.push(fillC(pal.ground), rectangle(0, 0, frontX, totalH), fill());
      const after = frontX + frontW + extendRightFront;
      if (after < totalW) shapes.push(fillC(pal.ground), rectangle(after, 0, totalW - after, totalH), fill());
    } else {
      shapes.push(fillC(pal.ground), rectangle(0, 0, totalW, totalH), fill());
      art = composeCoverArt(genome, {
        frontX, frontW, extendRight: extendRightFront, B, H, totalH, inset: safety + mm(6),
        title, glyphFont: { font: f.extraBold, key: keys.extraBold }
      });
      shapes.push(...art.shapes);
    }
    // A colour change exactly on a thin spine shows every millimetre of binding drift: below 6mm the
    // spine keeps the ground colour.
    const spP = panel('spine');
    let spineField = pal.ground;
    if (spP.width >= 6) {
      spineField = pal.deep;
      shapes.push(fillC(pal.deep), rectangle(mm(spP.x), 0, mm(spP.width), totalH), fill());
    }
    backInk = typeOn(pal.ground);
    spineInk = typeOn(spineField);
    report.genome = {
      seed: genome.seed,
      genre: genome.genre,
      palette: pal.label,
      layout: genome.layoutLabel,
      axes: genome.axes,
      excerpt: genome.excerpt,
      maxTotalInk: genome.maxTotalInk,
      spineColour: spP.width >= 6 ? 'deep' : 'ground (책등 6mm 미만)',
      reasons: genome.reasons
    };
    if (genome.maxTotalInk > 280) warnings.push(`표지 색 총잉크량 ${genome.maxTotalInk}% — 280% 이하 권장`);
    warnings.push(`표지 색은 화면과 인쇄 결과가 다릅니다 — 인쇄소 교정쇄(${pal.label})로 색을 확인하세요.`);
    if (genome.excerpt) warnings.push('뒤표지 발췌문은 원고 문장 그대로입니다 — 저자 승인 후 출고하세요.');
  }

  if (!guide) {
    ops.push(setFillingCmykColor(0, 0, 0, 1), beginText());

    // Front typography from the cover genome: placement follows the composition's free zone.
    if (!frontImage?.bytes && art) {
      const z = art.zone;
      const inset = safety + mm(6);
      const left = frontX + inset;
      const maxW = frontW - 2 * inset;
      const g = genome.genre;
      const T = g === 'practical' && useSans
        ? { font: f.sansExtraBold, key: keys.sansExtraBold }
        : (g === 'essay' || g === 'poetry') ? { font: f.bold, key: keys.bold } : { font: f.extraBold, key: keys.extraBold };
      const sizeBy = {
        essay: Math.min(25, frontW / 8.2),
        fiction: Math.min(34, frontW / 6.2),
        humanities: Math.min(30, frontW / 7),
        practical: Math.min(32, frontW / 6.4),
        poetry: Math.min(18, frontW / 10.5)
      };
      const size = sizeBy[g] || Math.min(28, frontW / 7.2);
      const lines = wrapText(T.font, safeTitle, size, maxW * (z.align === 'center' ? 0.8 : 0.92));
      const lead = size * 1.3;
      const xFor = (font, text, s) => (z.align === 'center' ? frontX + (frontW - font.widthOfTextAtSize(text, s)) / 2 : left);
      let y;
      if (z.mode === 'top') y = B + H - inset - size;
      else if (z.mode === 'bottom') y = (z.bottomY || B + H * 0.3) + (lines.length - 1) * lead;
      else if (z.mode === 'band') y = z.bandY + inset + (lines.length - 1) * lead;
      else y = B + H * 0.5 + ((lines.length - 1) * lead) / 2;
      ops.push(fillC(z.titleColour));
      lines.forEach((line) => { drawTextOps(ops, T.key, T.font, size, xFor(T.font, line, size), y, line); y -= lead; });
      const sub = subtitle ? nfc(subtitle) : '';
      const a = author ? nfc(author) : '';
      const p = publisher ? nfc(publisher) : '';
      if (z.mode === 'band') {
        // Title sits inside the colour band; subtitle and author drop below it onto the ground.
        y = z.bandY - mm(11);
        ops.push(fillC(typeOn(genome.palette.ground)));
      } else ops.push(fillC(z.typeColour));
      if (sub) {
        const ss = Math.max(9.5, size * 0.42);
        drawTextOps(ops, keys.regular, f.regular, ss, xFor(f.regular, sub, ss), y - ss * 0.2, sub);
        y -= ss * 1.9;
      }
      if (a) {
        const as = Math.min(12, Math.max(10, size * 0.46));
        drawTextOps(ops, keys.regular, f.regular, as, xFor(f.regular, a, as), y - mm(3), a);
      }
      if (p && z.showPublisher) {
        ops.push(fillC(z.footColour));
        drawTextOps(ops, keys.bold, f.bold, 9, xFor(f.bold, p, 9), B + inset, p);
      }
      ops.push(fillC(inkK));
    } else if (!frontImage?.bytes) {
      const wrap = (font, text, size, maxW) => {
        const lines = [];
        let cur = '';
        String(text).split(/\s+/).filter(Boolean).forEach((word) => {
          const next = cur ? `${cur} ${word}` : word;
          if (font.widthOfTextAtSize(next, size) <= maxW || !cur) cur = next;
          else { lines.push(cur); cur = word; }
        });
        if (cur) lines.push(cur);
        return lines;
      };
      const inset = safety + mm(6);
      const left = frontX + inset;
      const maxW = frontW - 2 * inset;
      const centerX = (font, text, size) => frontX + (frontW - font.widthOfTextAtSize(text, size)) / 2;
      const a = author ? nfc(author) : '';
      const p = publisher ? nfc(publisher) : '';
      const sub = subtitle ? nfc(subtitle) : '';

      if (style === 'essay') {
        const t = f.bold;
        const size = Math.min(22, frontW / 9);
        let y = B + H - inset - mm(16);
        wrap(t, safeTitle, size, maxW * 0.8).forEach((line) => { drawTextOps(ops, keys.bold, t, size, left, y, line); y -= size * 1.4; });
        if (sub) { drawTextOps(ops, keys.regular, f.regular, size * 0.45, left, y - size * 0.2, sub); y -= size; }
        if (a) drawTextOps(ops, keys.regular, f.regular, 10.5, left, y - mm(6), a);
        if (p) drawTextOps(ops, keys.bold, f.bold, 9, left, B + inset, p);
      } else if (style === 'practical') {
        const bandH = H * 0.4;
        const extendRight = geo.flapMm > 0 ? 0 : B;
        shapes.push(setFillingCmykColor(0, 0, 0, 1), rectangle(frontX, B + H - bandH, frontW + extendRight, bandH + B), fill());
        const t = useSans ? f.sansExtraBold : f.extraBold;
        const tk = useSans ? keys.sansExtraBold : keys.extraBold;
        const size = Math.min(30, frontW / 6.8);
        const lines = wrap(t, safeTitle, size, maxW);
        let y = B + H - bandH + inset + (lines.length - 1) * size * 1.25;
        ops.push(setFillingCmykColor(0, 0, 0, 0));
        lines.forEach((line) => { drawTextOps(ops, tk, t, size, left, y, line); y -= size * 1.25; });
        ops.push(setFillingCmykColor(0, 0, 0, 1));
        let y2 = B + H - bandH - mm(12);
        if (sub) { drawTextOps(ops, keys.regular, f.regular, 11, left, y2, sub); y2 -= mm(8); }
        if (a) drawTextOps(ops, keys.regular, f.regular, 11, left, y2, a);
        if (p) drawTextOps(ops, useSans ? keys.sansBold : keys.bold, useSans ? f.sansBold : f.bold, 9.5, left, B + inset, p);
        warnings.push('앞표지 상단 K100 단색 면 — 4도 인쇄라면 리치 블랙 적용 여부를 인쇄소와 확인하세요.');
      } else if (style === 'poetry') {
        const t = f.bold;
        const size = Math.min(17, frontW / 11);
        let y = B + H * 0.62;
        wrap(t, safeTitle, size, maxW * 0.8).forEach((line) => { drawTextOps(ops, keys.bold, t, size, centerX(t, line, size), y, line); y -= size * 1.5; });
        if (a) drawTextOps(ops, keys.regular, f.regular, 10, centerX(f.regular, a, 10), y - mm(5), a);
        if (p) drawTextOps(ops, keys.regular, f.regular, 8.5, centerX(f.regular, p, 8.5), B + inset, p);
      } else {
        // fiction: large centred title at the optical centre; humanities: upper third + rule
        const fictionStyle = style === 'fiction';
        const t = f.extraBold;
        const size = fictionStyle ? Math.min(34, frontW / 6.4) : Math.min(30, frontW / 7.2);
        const lines = wrap(t, safeTitle, size, maxW);
        let y = B + H * (fictionStyle ? 0.56 : 0.72) + (fictionStyle ? (lines.length - 1) * size * 0.66 : 0);
        lines.forEach((line) => { drawTextOps(ops, keys.extraBold, t, size, centerX(t, line, size), y, line); y -= size * 1.32; });
        if (sub) {
          const ss = size * 0.42;
          drawTextOps(ops, keys.regular, f.regular, ss, centerX(f.regular, sub, ss), y - ss * 0.4, sub);
          y -= ss * 2.2;
        }
        if (!fictionStyle) shapes.push(setFillingCmykColor(0, 0, 0, 1), rectangle(frontX + (frontW - mm(16)) / 2, y + size * 0.55, mm(16), 0.6), fill());
        if (a) {
          const as = Math.min(13, size * 0.45);
          const ay = fictionStyle ? B + inset + mm(16) : y - as * 1.6;
          drawTextOps(ops, keys.regular, f.regular, as, centerX(f.regular, a, as), ay, a);
        }
        if (p) drawTextOps(ops, keys.bold, f.bold, 10, centerX(f.bold, p, 10), B + inset, p);
      }
    }

    // Spine
    const sp = panel('spine');
    const spX = mm(sp.x);
    const spW = mm(sp.width);
    ops.push(fillC(spineInk));
    if (sp.width >= 7) {
      // Upright stacked Hangul (세로쓰기), title then author, publisher at the foot.
      const size = Math.min(11, spW * 0.58);
      const step = size * 1.08;
      let y = B + H - safety - mm(8) - size;
      const stack = (text, font, key, s, gapAfter) => {
        Array.from(nfc(text).replace(/\s+/g, ' ')).forEach((ch) => {
          if (ch === ' ') { y -= s * 0.45; return; }
          const w = font.widthOfTextAtSize(ch, s);
          drawTextOps(ops, key, font, s, spX + (spW - w) / 2, y, ch);
          y -= s * 1.08;
        });
        y -= gapAfter;
      };
      stack(safeTitle, f.extraBold, keys.extraBold, size, step * 1.2);
      if (author) stack(author, f.regular, keys.regular, size * 0.8, 0);
      if (publisher) {
        const ps = size * 0.75;
        let py = B + safety + mm(4) + ps * (Array.from(publisher).length - 1) * 1.08;
        Array.from(nfc(publisher).replace(/\s+/g, '')).forEach((ch) => {
          const w = f.bold.widthOfTextAtSize(ch, ps);
          drawTextOps(ops, keys.bold, f.bold, ps, spX + (spW - w) / 2, py, ch);
          py -= ps * 1.08;
        });
      }
      if (y < B + safety + mm(25)) warnings.push('책등 글자가 길어 아래쪽 출판사명과 가까울 수 있습니다 — 책등 교정 확인');
      report.spineText = 'vertical-upright';
    } else if (sp.width >= 4) {
      const size = Math.min(8.5, spW * 0.62);
      const text = [safeTitle, nfc(author || '')].filter(Boolean).join('  ');
      const w = f.bold.widthOfTextAtSize(text, size);
      // Rotated -90°: reads top-to-bottom.
      const cx = spX + spW / 2 + size * 0.35;
      const cy = B + H / 2 + w / 2;
      ops.push(setFontAndSize(keys.bold, size), rotateAndSkewTextRadiansAndTranslate(-Math.PI / 2, 0, 0, cx, cy), showText(f.bold.encodeText(text)));
      report.spineText = 'rotated';
    } else {
      warnings.push(`책등 ${sp.width}mm — 4mm 미만이라 책등 글자를 넣지 않았습니다.`);
    }

    // Back: excerpt (genome) + ISBN + price + EAN-13
    const back = panel('back');
    const backX = mm(back.x);
    const backW = mm(back.width);
    if (genome?.excerpt) {
      const inset = safety + mm(6);
      const es = Math.min(13, backW / 21);
      const lead = es * 1.8;
      const ex0 = backX + inset;
      let ey = B + H - inset - mm(16);
      shapes.push(fillC(genome.palette.accent), rectangle(ex0, ey + es * 2.1, mm(9), 1.4), fill());
      ops.push(fillC(backInk));
      wrapText(f.regular, nfc(genome.excerpt), es, (backW - 2 * inset) * 0.86).forEach((line) => {
        drawTextOps(ops, keys.regular, f.regular, es, ex0, ey, line);
        ey -= lead;
      });
      drawTextOps(ops, keys.regular, f.regular, 8.5, ex0, ey - mm(3), `— 『${safeTitle}』 중에서`);
    }
    if (genome) {
      ops.push(fillC(backInk));
      const fF = panel('flapFront');
      if (fF && author) drawTextOps(ops, keys.bold, f.bold, 10.5, mm(fF.x) + safety + mm(6), B + H - safety - mm(20), nfc(author));
      const fB = panel('flapBack');
      if (fB && publisher) drawTextOps(ops, keys.bold, f.bold, 9, mm(fB.x) + safety + mm(6), B + safety + mm(6), nfc(publisher));
    }
    ops.push(fillC(inkK));
    const digits = String(isbn || '').replace(/[^0-9]/g, '');
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
        const blockW = quietLeft + codeW + quietRight;
        const x0 = backX + backW - mm(10) - blockW + quietLeft;
        const y0 = B + mm(14);
        const textSize = 8.5 * mag + 1;
        const label = /-/.test(String(isbn)) ? `ISBN ${String(isbn).trim()}` : `ISBN ${digits}`;
        const lw = f.regular.widthOfTextAtSize(label, 8);
        drawTextOps(ops, keys.regular, f.regular, 8, x0 + (codeW - lw) / 2, y0 + barH + mm(2), label);
        // Human-readable digits under the bars
        const hr = [digits[0], digits.slice(1, 7), digits.slice(7)];
        drawTextOps(ops, keys.regular, f.regular, textSize, x0 - quietLeft + mm(0.6), y0 - guardExtra - textSize * 0.2, hr[0]);
        const lw1 = f.regular.widthOfTextAtSize(hr[1], textSize);
        drawTextOps(ops, keys.regular, f.regular, textSize, x0 + 3 * moduleW + (42 * moduleW - lw1) / 2, y0 - guardExtra - textSize * 0.2, hr[1]);
        const lw2 = f.regular.widthOfTextAtSize(hr[2], textSize);
        drawTextOps(ops, keys.regular, f.regular, textSize, x0 + 50 * moduleW + (42 * moduleW - lw2) / 2, y0 - guardExtra - textSize * 0.2, hr[2]);
        if (price) {
          const pt = `값 ${formatPrice(price)}원`;
          const pw = f.bold.widthOfTextAtSize(pt, 9);
          drawTextOps(ops, keys.bold, f.bold, 9, x0 + codeW - pw, y0 + barH + mm(7), pt);
        }
        // White quiet-zone plate so artwork never runs into the code, then bars in K100.
        // On a coloured ground the plate also carries the ISBN label and price.
        const plateTop = genome ? mm(12) : 0;
        const labelX = x0 + (codeW - lw) / 2;
        const plateX = genome ? Math.min(x0 - quietLeft, labelX - mm(1.5)) : x0 - quietLeft;
        const plateR = genome ? Math.max(x0 - quietLeft + blockW, labelX + lw + mm(1.5)) : x0 - quietLeft + blockW;
        shapes.push(setFillingCmykColor(0, 0, 0, 0), rectangle(plateX, y0 - guardExtra - mm(4), plateR - plateX, barH + guardExtra + mm(4) + plateTop), fill());
        shapes.push(setFillingCmykColor(0, 0, 0, 1));
        const guards = new Set([0, 1, 2, 45, 46, 47, 48, 49, 92, 93, 94]);
        barRuns(bits).forEach(([start, len]) => {
          const isGuard = guards.has(start);
          const y = isGuard ? y0 - guardExtra : y0;
          const hgt = isGuard ? barH + guardExtra : barH;
          // Bar width reduction (0.015mm) compensates dot gain.
          shapes.push(rectangle(x0 + start * moduleW + mm(0.0075), y, len * moduleW - mm(0.015), hgt), fill());
        });
        report.barcode = {
          symbology: 'EAN-13',
          value: digits,
          magnification: mag,
          moduleMm: round1(0.33 * mag * 100) / 100,
          widthMm: round1((blockW) / PT_PER_MM),
          heightMm: round1((barH + guardExtra) / PT_PER_MM),
          decoded: decodeEan13Modules(bits)
        };
      } catch (error) {
        blockers.push(`ISBN 바코드 생성 불가: ${error.message}`);
      }
    } else {
      warnings.push('ISBN이 없어 뒤표지 바코드를 넣지 않았습니다 — 발급 후 재생성하세요.');
      if (price) {
        const pt = `값 ${formatPrice(price)}원`;
        const pw = f.bold.widthOfTextAtSize(pt, 9);
        ops.push(fillC(backInk));
        drawTextOps(ops, keys.bold, f.bold, 9, backX + backW - mm(10) - pw, B + mm(14), pt);
        ops.push(fillC(inkK));
      }
    }
    ops.push(endText());
    page.pushOperators(...shapes, ...ops);
  } else {
    // ---------- guide layer (separate file, never sent as print art) ----------
    const g = [];
    g.push(setLineWidth(0.35));
    // bleed edge (red) — page edge already; trim (cyan); folds (magenta dashed); safety (green dotted)
    g.push(setStrokingCmykColor(0, 1, 1, 0), rectangle(0.2, 0.2, totalW - 0.4, totalH - 0.4), stroke());
    g.push(setStrokingCmykColor(1, 0, 0, 0), rectangle(B, B, totalW - 2 * B, H), stroke());
    g.push(setStrokingCmykColor(0, 1, 0, 0), setDashPattern([4, 3], 0));
    geo.panels.slice(1).forEach((p) => {
      g.push(moveTo(mm(p.x), 0), lineTo(mm(p.x), totalH), stroke());
    });
    g.push(setStrokingCmykColor(1, 0, 1, 0), setDashPattern([1.5, 2], 0));
    geo.panels.forEach((p) => {
      if (p.key === 'spine') return;
      g.push(rectangle(mm(p.x) + safety, B + safety, mm(p.width) - 2 * safety, H - 2 * safety), stroke());
    });
    g.push(setDashPattern([], 0));
    page.pushOperators(...g);
    const t = [setFillingCmykColor(0, 0, 0, 1), beginText()];
    geo.panels.forEach((p) => {
      const label = `${p.label} ${round1(p.width)}mm`;
      const size = p.key === 'spine' ? Math.min(7, mm(p.width) * 0.5) : 9;
      const w = f.bold.widthOfTextAtSize(label, size);
      if (p.key === 'spine') {
        t.push(setFontAndSize(keys.bold, size), rotateAndSkewTextRadiansAndTranslate(-Math.PI / 2, 0, 0, mm(p.x) + mm(p.width) / 2 + size * 0.35, B + H / 2 + w / 2), showText(f.bold.encodeText(label)));
      } else {
        drawTextOps(t, keys.bold, f.bold, size, mm(p.x) + (mm(p.width) - w) / 2, B + H / 2, label);
      }
    });
    const legend = [
      `전체 ${geo.totalWidthMm} × ${geo.totalHeightMm}mm (도련 ${geo.bleedMm}mm 포함) · 재단 ${geo.trimWidthMm} × ${geo.trimHeightMm}mm`,
      '빨강: 도련 끝선 · 파랑: 재단선',
      '자홍 점선: 접는 선 · 초록 점선: 안전선(재단선 안쪽 5mm)',
      '작업용 가이드입니다. 인쇄소에는 가이드 없는 표지 PDF를 보내세요.'
    ];
    const backPanel = panel('back');
    const lx = mm(backPanel.x) + safety + mm(3);
    legend.forEach((line, i) => drawTextOps(t, keys.regular, f.regular, 6.5, lx, B + H - safety - mm(8) - i * 9.5, line));
    t.push(endText());
    page.pushOperators(...t);
  }

  // glyph coverage for cover typography
  Array.from(`${safeTitle}${author}${publisher}${subtitle}${genome?.excerpt || ''}`).forEach((ch) => {
    if (/\s/.test(ch)) return;
    if (!glyph.hasGlyphForCodePoint(ch.codePointAt(0))) blockers.push(`표지 서체에 없는 글자: ${ch}`);
  });

  doc.setTitle(`${safeTitle} — ${guide ? '표지 가이드' : '표지'}`);
  doc.setCreator('ooOS Publishing OS');
  doc.setProducer('ooOS Publishing OS (pdf-lib)');
  doc.setLanguage('ko-KR');
  doc.setCreationDate(new Date(generatedAt));
  doc.setModificationDate(new Date(generatedAt));

  const bytes = await doc.save({ useObjectStreams: false });
  return { bytes, geometry: geo, report, warnings, blockers };
}
