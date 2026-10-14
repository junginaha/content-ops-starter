// Re-open generated PDFs and verify them structurally. Advisory automation only:
// the package can reach PRINT_CANDIDATE automatically, never PRINT_READY (human + printer gates).
import { PDFDocument, PDFName, PDFDict, PDFArray, PDFRawStream, decodePDFRawStream } from 'pdf-lib';
import { PT_PER_MM } from './interiorPdf';
import { PRINT_HUMAN_GATES } from './presets';

const toMm = (pt) => Math.round((pt / PT_PER_MM) * 100) / 100;
const near = (a, b, tol = 0.3) => Math.abs(a - b) <= tol;

function boxOf(page, name) {
  const fn = { MediaBox: 'getMediaBox', TrimBox: 'getTrimBox', BleedBox: 'getBleedBox' }[name];
  const box = page[fn]();
  return { x: toMm(box.x), y: toMm(box.y), widthMm: toMm(box.width), heightMm: toMm(box.height) };
}

function streamText(stream) {
  try {
    const bytes = stream instanceof PDFRawStream ? decodePDFRawStream(stream).decode() : stream.getContents?.();
    if (!bytes) return '';
    let out = '';
    const chunk = 8192;
    for (let i = 0; i < bytes.length; i += chunk) out += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
    return out;
  } catch {
    return '';
  }
}

export async function inspectGeneratedPdf(bytes, { trimWidthMm, trimHeightMm, bleedMm }) {
  const doc = await PDFDocument.load(bytes, { updateMetadata: false });
  const pages = doc.getPages();
  const expectMedia = { w: Number(trimWidthMm) + 2 * Number(bleedMm), h: Number(trimHeightMm) + 2 * Number(bleedMm) };
  let boxErrors = 0;
  const firstBoxes = pages[0]
    ? { media: boxOf(pages[0], 'MediaBox'), trim: boxOf(pages[0], 'TrimBox'), bleed: boxOf(pages[0], 'BleedBox') }
    : null;

  pages.forEach((page) => {
    const media = boxOf(page, 'MediaBox');
    const trim = boxOf(page, 'TrimBox');
    const bleed = boxOf(page, 'BleedBox');
    const ok = near(media.widthMm, expectMedia.w) && near(media.heightMm, expectMedia.h) &&
      near(trim.widthMm, Number(trimWidthMm)) && near(trim.heightMm, Number(trimHeightMm)) &&
      near(trim.x, Number(bleedMm)) && near(trim.y, Number(bleedMm)) &&
      near(bleed.widthMm, media.widthMm) && near(bleed.heightMm, media.heightMm);
    if (!ok) boxErrors += 1;
  });

  const fonts = [];
  let rgbOperators = 0;
  let transparency = 0;
  const imageColorSpaces = new Set();

  doc.context.enumerateIndirectObjects().forEach(([, obj]) => {
    const dict = obj instanceof PDFDict ? obj : obj?.dict;
    if (!dict) return;
    const type = dict.get(PDFName.of('Type'));
    if (type === PDFName.of('FontDescriptor')) {
      const name = dict.get(PDFName.of('FontName'));
      const embedded = !!(dict.get(PDFName.of('FontFile')) || dict.get(PDFName.of('FontFile2')) || dict.get(PDFName.of('FontFile3')));
      fonts.push({ name: name ? name.decodeText?.() || String(name).replace(/^\//, '') : '?', embedded });
    }
    if (type === PDFName.of('ExtGState')) {
      const ca = dict.get(PDFName.of('ca'));
      const CA = dict.get(PDFName.of('CA'));
      const smask = dict.get(PDFName.of('SMask'));
      if ((ca && Number(ca.asNumber?.() ?? 1) < 1) || (CA && Number(CA.asNumber?.() ?? 1) < 1) || (smask && smask !== PDFName.of('None'))) transparency += 1;
    }
    if (dict.get(PDFName.of('Subtype')) === PDFName.of('Image')) {
      const cs = dict.get(PDFName.of('ColorSpace'));
      imageColorSpaces.add(cs instanceof PDFArray ? 'ICC/Indexed' : String(cs || '?').replace(/^\//, ''));
      if (dict.get(PDFName.of('SMask'))) transparency += 1;
    }
  });

  pages.forEach((page) => {
    const contents = page.node.Contents();
    const list = contents instanceof PDFArray ? contents.asArray().map((ref) => doc.context.lookup(ref)) : [contents];
    list.forEach((stream) => {
      if (!stream) return;
      const text = streamText(stream);
      const matches = text.match(/(?:^|\s)(rg|RG|sc|SC|scn|SCN|cs|CS|g|G)(?=\s|$)/g);
      if (matches) rgbOperators += matches.length;
    });
  });

  return {
    pageCount: pages.length,
    pdfHeader: (() => {
      const head = String.fromCharCode.apply(null, bytes.subarray(0, 8));
      const m = head.match(/%PDF-(\d\.\d)/);
      return m ? m[1] : '';
    })(),
    boxes: firstBoxes,
    boxErrors,
    fonts,
    allFontsEmbedded: fonts.length > 0 && fonts.every((font) => font.embedded),
    nonCmykColorOperators: rgbOperators,
    transparencyObjects: transparency,
    imageColorSpaces: Array.from(imageColorSpaces),
    bytes: bytes.length
  };
}

export { PRINT_HUMAN_GATES };

export function evaluatePrintPackage({ interior, interiorCheck, cover, coverCheck, isbnCheck, pageMultiple }) {
  const checks = [];
  const add = (key, label, passed, detail, severity = 'blocker') => checks.push({ key, label, passed, detail, severity });

  add('text-complete', '원고 글자 보존', interior.completeness.match && interior.completeness.structureLossless,
    interior.completeness.match
      ? `원고 ${interior.completeness.expectedChars.toLocaleString()}자 전부 배치`
      : `배치 ${interior.completeness.placedChars.toLocaleString()} / 원고 ${interior.completeness.expectedChars.toLocaleString()}자 — ${interior.completeness.firstMismatchIndex}번째 글자부터 불일치`);
  add('glyphs', '서체 글자 지원', interior.missingGlyphs.length === 0,
    interior.missingGlyphs.length ? `서체에 없는 글자 ${interior.missingGlyphs.length}종: ${interior.missingGlyphs.slice(0, 8).map((g) => g.char).join(' ')}` : '모든 글자 표시 가능');
  add('interior-boxes', '내지 판면·재단·도련', interiorCheck.boxErrors === 0,
    interiorCheck.boxes
      ? `PDF ${interiorCheck.boxes.media.widthMm}×${interiorCheck.boxes.media.heightMm}mm · 재단 ${interiorCheck.boxes.trim.widthMm}×${interiorCheck.boxes.trim.heightMm}mm${interiorCheck.boxErrors ? ` · 불일치 ${interiorCheck.boxErrors}쪽` : ' · 전 쪽 일치'}`
      : '판면 확인 실패');
  add('page-multiple', '제본 쪽수', interiorCheck.pageCount % pageMultiple === 0,
    `${interiorCheck.pageCount}쪽 · ${pageMultiple}의 배수${interiorCheck.pageCount % pageMultiple === 0 ? '' : ' 아님'}`);
  add('fonts-embedded', '서체 임베딩', interiorCheck.allFontsEmbedded && coverCheck.allFontsEmbedded,
    `${[...new Set(interiorCheck.fonts.map((f) => f.name.replace(/^[A-Z]{6}\+/, '').replace(/-\d+$/, '')))].join(', ')} · ${interiorCheck.allFontsEmbedded && coverCheck.allFontsEmbedded ? '전부 임베딩' : '미임베딩 서체 있음'}`);
  add('color', '1도(K) 색상', interiorCheck.nonCmykColorOperators === 0,
    interiorCheck.nonCmykColorOperators === 0 ? '내지 텍스트 K100 · RGB 색상 없음' : `CMYK 외 색상 지정 ${interiorCheck.nonCmykColorOperators}건`);
  add('transparency', '투명도', interiorCheck.transparencyObjects === 0 && coverCheck.transparencyObjects === 0,
    interiorCheck.transparencyObjects + coverCheck.transparencyObjects === 0 ? '투명 효과 없음' : '투명 효과 포함 — 인쇄소 평활화 확인', 'warning');
  add('overflow', '판면 넘침', interior.stats.overflowLines === 0,
    interior.stats.overflowLines === 0 ? '본문 줄 넘침 0' : `넘친 줄 ${interior.stats.overflowLines}개`);
  add('cover-boxes', '표지 펼침면', coverCheck.boxErrors === 0,
    `${cover.geometry.totalWidthMm}×${cover.geometry.totalHeightMm}mm · 책등 ${cover.geometry.spineMm}mm${cover.geometry.flapMm ? ` · 날개 ${cover.geometry.flapMm}mm` : ''}`);
  add('isbn', 'ISBN·바코드', !isbnCheck.provided || (isbnCheck.valid && !!cover.report.barcode?.decoded),
    !isbnCheck.provided ? 'ISBN 미입력 — 바코드 없음' : isbnCheck.valid ? `EAN-13 ${cover.report.barcode?.decoded ? '디코딩 검증 통과' : '생성 실패'}` : isbnCheck.reason,
    isbnCheck.provided ? 'blocker' : 'warning');
  (cover.blockers || []).forEach((message, i) => add(`cover-blocker-${i}`, '표지', false, message));

  const blockers = checks.filter((c) => !c.passed && c.severity === 'blocker');
  const warnings = [
    ...checks.filter((c) => !c.passed && c.severity === 'warning').map((c) => c.detail),
    ...(cover.warnings || [])
  ];
  if (interior.stats.shortPages > 0) warnings.push(`외톨이 줄 방지로 한 줄 짧아진 쪽 ${interior.stats.shortPages}개 — 조판 확인`);
  if (!interior.copyrightFields?.['값']) warnings.push('정가가 비어 있습니다 — 판권·뒤표지 정가 표시 확인');
  if (!interior.copyrightFields?.['초판 1쇄 펴낸날']) warnings.push('펴낸날이 비어 있습니다 — 판권 기재 확인');
  warnings.push('PDF/X 규격 인증 파일이 아닙니다 — 인쇄소가 PDF/X-1a/X-4를 요구하면 변환·검증이 필요합니다.');
  warnings.push('책등 폭은 입력한 종이 두께로 계산한 값입니다 — 인쇄소 확정값으로 다시 생성하세요.');

  return {
    status: blockers.length ? 'BLOCKED' : 'PRINT_CANDIDATE',
    statusLabel: blockers.length ? '자동검사 실패' : '인쇄 후보 — 사람 승인·인쇄소 확인 대기',
    checks,
    blockers: blockers.map((c) => `${c.label}: ${c.detail}`),
    warnings,
    humanGates: PRINT_HUMAN_GATES
  };
}
