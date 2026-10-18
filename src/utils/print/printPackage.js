// Print production package: interior PDF + wrap cover PDF + cover guide + printer order sheet + preflight + manifest.
import { createStoredZip } from '../epubBuilder';
import { validateIsbn13 } from '../preflight';
import { buildInteriorPdf } from './interiorPdf';
import { buildCoverPdf, calculateSpineMm } from './coverPdf';
import { buildDesignedCoverPdf } from './coverDesigned';
import { inspectGeneratedPdf, evaluatePrintPackage } from './printPreflight';
import { DEFAULT_PRINT_OPTIONS } from './presets';
import { analyzeForDesign } from './designAnalysis';
import { DESIGN_PROFILES, profileUsesSans } from './designProfiles';

export { DEFAULT_PRINT_OPTIONS };

export const PRINT_FONT_FILES = {
  regular: '/fonts/NanumMyeongjo-Regular.ttf',
  bold: '/fonts/NanumMyeongjo-Bold.ttf',
  extraBold: '/fonts/NanumMyeongjo-ExtraBold.ttf',
  license: '/fonts/OFL-NanumMyeongjo.txt',
  fallback: '/fonts/ooOSFallbackSerif-Regular.ttf',
  fallbackLicense: '/fonts/OFL-ooOSFallbackSerif.txt',
  sansRegular: '/fonts/NanumGothic-Regular.ttf',
  sansBold: '/fonts/NanumGothic-Bold.ttf',
  sansExtraBold: '/fonts/NanumGothic-ExtraBold.ttf',
  sansLicense: '/fonts/OFL-NanumGothic.txt'
};



// Characters outside Hangul/Latin/common punctuation (e.g. hanja) need the fallback face (≈4.9MB).
const PRIMARY_RANGE_RE = /[^\u0000-\u024f\u1100-\u11ff\u2000-\u206f\u2100-\u21ff\u2460-\u24ff\u3000-\u303f\u3130-\u318f\uac00-\ud7a3\uff00-\uffef\s]/;

export function needsFallbackFont(text) {
  return PRIMARY_RANGE_RE.test(String(text || '').normalize('NFC'));
}

export async function loadPrintFonts({ includeFallback = false, includeSans = false, fetcher = (url) => fetch(url) } = {}) {
  const load = async (url) => {
    const res = await fetcher(url);
    if (!res.ok) throw new Error(`서체 파일을 불러오지 못했습니다: ${url}`);
    return new Uint8Array(await res.arrayBuffer());
  };
  const [regular, bold, extraBold, license, fallback, fallbackLicense] = await Promise.all([
    load(PRINT_FONT_FILES.regular),
    load(PRINT_FONT_FILES.bold),
    load(PRINT_FONT_FILES.extraBold),
    load(PRINT_FONT_FILES.license),
    includeFallback ? load(PRINT_FONT_FILES.fallback) : Promise.resolve(null),
    includeFallback ? load(PRINT_FONT_FILES.fallbackLicense) : Promise.resolve(null)
  ]);
  const sans = includeSans
    ? await Promise.all([PRINT_FONT_FILES.sansRegular, PRINT_FONT_FILES.sansBold, PRINT_FONT_FILES.sansExtraBold, PRINT_FONT_FILES.sansLicense].map(load))
    : null;
  return {
    regular, bold, extraBold, license,
    ...(fallback ? { fallback, fallbackLicense } : {}),
    ...(sans ? { sansRegular: sans[0], sansBold: sans[1], sansExtraBold: sans[2], sansLicense: sans[3] } : {})
  };
}

const encoder = new TextEncoder();

async function sha256Hex(bytes) {
  const data = bytes instanceof Uint8Array ? bytes : encoder.encode(String(bytes ?? ''));
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest)).map((v) => v.toString(16).padStart(2, '0')).join('');
}

function safeName(value = 'book') {
  return String(value || 'book').trim().replace(/[^0-9a-zA-Z가-힣_-]+/g, '_').replace(/^_+|_+$/g, '') || 'book';
}

// Detect JPEG colour model from SOF component count (1=Gray, 3=RGB/YCbCr, 4=CMYK).
export function sniffImage(bytes) {
  if (!bytes || bytes.length < 8) return null;
  if (bytes[0] === 0x89 && bytes[1] === 0x50) {
    const colorType = bytes[25];
    return { type: 'png', colorSpace: colorType === 0 || colorType === 4 ? 'Gray' : 'RGB' };
  }
  if (bytes[0] === 0xff && bytes[1] === 0xd8) {
    let i = 2;
    while (i < bytes.length - 9) {
      if (bytes[i] !== 0xff) { i += 1; continue; }
      const marker = bytes[i + 1];
      const len = (bytes[i + 2] << 8) + bytes[i + 3];
      if ((marker >= 0xc0 && marker <= 0xc3) || (marker >= 0xc5 && marker <= 0xcb && marker !== 0xc8) || (marker >= 0xcd && marker <= 0xcf)) {
        const comps = bytes[i + 9];
        return { type: 'jpg', colorSpace: comps === 4 ? 'CMYK' : comps === 1 ? 'Gray' : 'RGB' };
      }
      i += 2 + len;
    }
    return { type: 'jpg', colorSpace: 'unknown' };
  }
  return null;
}

function orderSheet({ title, author, publisher, isbn, interior, cover, options, files, generatedAt, revisions = [] }) {
  const L = interior.layout;
  const rows = [
    '[인쇄 지시서] ooOS 자동 생성 — 인쇄소 확정 전 초안',
    '',
    `도서명        ${title || '제목 없음'}`,
    `저자          ${author || '-'}`,
    `출판사        ${publisher || '-'}`,
    `ISBN          ${isbn || '미입력'}`,
    '',
    '■ 판형·내지',
    `재단 크기      ${L.trimWidthMm} × ${L.trimHeightMm}mm`,
    `작업 크기      ${L.pdfWidthMm} × ${L.pdfHeightMm}mm (사방 도련 ${L.bleedMm}mm)`,
    `총 쪽수        ${interior.pageCount}쪽 (${L.pageMultiple}의 배수)`,
    `내지 도수      ${L.color}`,
    `내지 용지      ${options.interiorPaper || '[인쇄소 협의]'}`,
    `편집디자인    ${interior.design.label} (${interior.design.summary})`,
    `본문 서체      나눔명조 ${L.bodySizePt}pt / 행간 ${L.leadingPt}pt / 쪽당 ${L.linesPerPage}행 / 제목 ${interior.design.headingFont}`,
    '',
    '■ 표지',
    `펼침 크기      ${cover.geometry.totalWidthMm} × ${cover.geometry.totalHeightMm}mm (도련 ${cover.geometry.bleedMm}mm 포함)`,
    `책등           ${cover.geometry.spineMm}mm (종이 두께 ${options.paperCaliperMm}mm/장 + 여유 ${options.coverAllowanceMm}mm로 계산 — 인쇄소 확정 필요)`,
    `날개           ${cover.geometry.flapMm ? `${cover.geometry.flapMm}mm` : '없음'}`,
    `표지 용지      ${options.coverPaper || '[인쇄소 협의]'}`,
    `제본           ${options.binding || '무선제본'}`,
    ...(cover.finish ? [`후가공         ${cover.finish.label} — 대상: ${cover.finish.targets.join(', ')} (별도 판 PDF 첨부, K100 = 가공 영역)`] : []),
    ...(cover.band ? [`띠지           ${cover.band.totalWidthMm} × ${cover.band.totalHeightMm}mm (띠지 높이 ${cover.band.heightMm}mm, 도련 포함)${cover.band.barcode ? ' · 바코드 포함' : ''}`] : []),
    ...(interior.pages?.dedication || interior.pages?.epigraph || interior.pages?.chapterEpigraphs
      ? [`앞붙이        ${[interior.pages.dedication ? '헌사' : '', interior.pages.epigraph ? '제사' : '', interior.pages.chapterEpigraphs ? `장 제사 ${interior.pages.chapterEpigraphs}곳` : ''].filter(Boolean).join(' · ')}`]
      : []),
    '',
    ...(revisions.length ? ['■ 2차 제작 수정 이력', ...revisions.map((r) => `- v${r.version} ${r.at || ''} ${r.summary || ''}`.trim()), ''] : []),
    '■ 파일',
    ...files.map((name) => `- ${name}`),
    '',
    '■ 확인 필요(인쇄소)',
    '- PDF/X 규격 요구 여부와 색상 프로파일',
    '- 책등 폭 확정값 (확정 후 ooOS에서 표지 재생성)',
    '- 내지 도련 처리 기준, 제본 여백',
    '- 부수·납기·후가공(코팅, 박 등)',
    '',
    `생성 시각 ${generatedAt}`
  ];
  return rows.join('\n');
}

/**
 * Stage 1 — analyse the manuscript, choose the design profile and typeset the interior.
 * Split out so a UI can re-run only the cover (stage 2) and checks (stage 3) while editing.
 */
export async function prepareInterior({
  title = '',
  author = '',
  isbn = '',
  manuscript = '',
  printSpec = {},
  options = {},
  fonts,
  premium = null,
  generatedAt = new Date().toISOString()
} = {}) {
  const opts = { ...DEFAULT_PRINT_OPTIONS, ...options };
  const trimWidthMm = Number(printSpec.trimWidthMm) || 140;
  const trimHeightMm = Number(printSpec.trimHeightMm) || 210;
  const bleedMm = Number.isFinite(Number(printSpec.bleedMm)) ? Number(printSpec.bleedMm) : 3;
  const pageMultiple = Number(opts.pageMultiple) || 4;
  const isbnCheck = validateIsbn13(isbn);
  const isbnText = isbnCheck.valid ? String(isbn || '').trim() : '';

  const analysis = analyzeForDesign(manuscript, { title });
  const designProfile = DESIGN_PROFILES[opts.designProfile] ? opts.designProfile : analysis.genre;
  const designSource = DESIGN_PROFILES[opts.designProfile] ? 'manual' : 'analysis';
  if (profileUsesSans(designProfile) && !fonts.sansBold) {
    throw new Error('이 편집디자인은 고딕 제목 서체가 필요합니다. 서체를 다시 불러와 주세요.');
  }

  const interior = await buildInteriorPdf({
    title,
    author,
    designProfile,
    density: opts.density || 'standard',
    optimize: opts.optimize !== false,
    publisher: opts.publisher,
    manuscript,
    isbn: isbnText,
    price: opts.price,
    firstEdition: opts.firstEdition,
    registration: opts.registration,
    contact: opts.contact,
    trimWidthMm,
    trimHeightMm,
    bleedMm,
    pageMultiple,
    fonts,
    premium,
    generatedAt
  });

  const spineMm = calculateSpineMm({
    pageCount: interior.pageCount,
    paperCaliperMm: opts.paperCaliperMm,
    coverAllowanceMm: opts.coverAllowanceMm
  });

  return { title, author, isbn, isbnCheck, isbnText, opts, trimWidthMm, trimHeightMm, bleedMm, pageMultiple, analysis, designProfile, designSource, interior, spineMm, generatedAt };
}

/**
 * Stage 2 — wrap cover + designer guide. `coverDesign` (optional) switches the front/back/spine
 * artwork to a colour template (see coverDesigned.js); without it the genre profile cover is used.
 */
export async function prepareCover(ctx, { fonts, frontImage = null, coverDesign = null } = {}) {
  const { title, author, isbnText, opts, trimWidthMm, trimHeightMm, bleedMm, spineMm, designProfile, generatedAt } = ctx;
  let image = null;
  if (frontImage?.bytes) {
    const sniff = sniffImage(frontImage.bytes);
    if (!sniff) throw new Error('앞표지 이미지는 JPG 또는 PNG만 사용할 수 있습니다.');
    image = { bytes: frontImage.bytes, type: sniff.type, colorSpace: sniff.colorSpace };
  }

  const coverInput = {
    title,
    subtitle: opts.subtitle,
    author,
    publisher: opts.publisher,
    isbn: isbnText,
    price: opts.price,
    trimWidthMm,
    trimHeightMm,
    bleedMm,
    spineMm,
    flapMm: Number(opts.flapMm) || 0,
    frontImage: image,
    fonts,
    style: DESIGN_PROFILES[designProfile].cover,
    generatedAt
  };
  const cover = coverDesign
    ? await buildDesignedCoverPdf({ ...coverInput, design: coverDesign })
    : await buildCoverPdf(coverInput);
  const coverGuide = await buildCoverPdf({ ...coverInput, guide: true });
  return { cover, coverGuide };
}

/** Stage 3 — reopen both PDFs, evaluate, write the order sheet / report / manifest and zip. */
export async function assemblePrintPackage(ctx, { cover, coverGuide }, fonts, { revisionLog = [] } = {}) {
  const { title, author, isbnCheck, isbnText, opts, trimWidthMm, trimHeightMm, bleedMm, pageMultiple, analysis, designSource, interior, generatedAt } = ctx;

  const interiorCheck = await inspectGeneratedPdf(interior.bytes, { trimWidthMm, trimHeightMm, bleedMm });
  const coverCheck = await inspectGeneratedPdf(cover.bytes, {
    trimWidthMm: cover.geometry.trimWidthMm,
    trimHeightMm: cover.geometry.trimHeightMm,
    bleedMm
  });

  const evaluation = evaluatePrintPackage({ interior, interiorCheck, cover, coverCheck, isbnCheck, pageMultiple });
  // 2차 제작 산출물(후가공 판·띠지)도 같은 방식으로 다시 열어 검사한다.
  const extraChecks = [];
  if (cover.finish?.bytes) {
    const fc = await inspectGeneratedPdf(cover.finish.bytes, { trimWidthMm: cover.geometry.trimWidthMm, trimHeightMm: cover.geometry.trimHeightMm, bleedMm });
    extraChecks.push({ key: 'finish-plate', label: `후가공 판(${cover.finish.label})`, passed: fc.boxErrors === 0 && fc.transparencyObjects === 0, detail: `표지와 같은 ${cover.geometry.totalWidthMm}×${cover.geometry.totalHeightMm}mm · 대상 ${cover.finish.targets.join(', ')}`, severity: 'blocker' });
  }
  if (cover.band?.bytes) {
    const bc = await inspectGeneratedPdf(cover.band.bytes, { trimWidthMm: cover.geometry.trimWidthMm, trimHeightMm: cover.band.heightMm, bleedMm });
    extraChecks.push({ key: 'band', label: '띠지', passed: bc.boxErrors === 0 && (!cover.band.barcode || !!cover.band.barcode.decoded), detail: `${cover.band.totalWidthMm}×${cover.band.totalHeightMm}mm${cover.band.barcode ? ` · 바코드 ${cover.band.barcode.decoded ? '디코딩 검증 통과' : '실패'}` : ''}`, severity: 'blocker' });
  }
  extraChecks.forEach((c) => {
    evaluation.checks.push(c);
    if (!c.passed) evaluation.blockers.push(`${c.label}: ${c.detail}`);
  });
  if (evaluation.blockers.length) { evaluation.status = 'BLOCKED'; evaluation.statusLabel = '자동검사 실패'; }

  const name = safeName(title || 'book');
  const interiorName = `print/${name}_내지_${trimWidthMm}x${trimHeightMm}_도련${bleedMm}mm_${interior.pageCount}p.pdf`;
  const coverName = `print/${name}_표지_${cover.geometry.totalWidthMm}x${cover.geometry.totalHeightMm}_책등${cover.geometry.spineMm}mm.pdf`;
  const guideName = `print/${name}_표지가이드_작업용.pdf`;
  const finishName = cover.finish?.bytes ? `print/${name}_표지_후가공판_${cover.finish.label.replace(/[^0-9a-zA-Z가-힣]+/g, '')}.pdf` : null;
  const bandName = cover.band?.bytes ? `print/${name}_띠지_${cover.band.totalWidthMm}x${cover.band.totalHeightMm}.pdf` : null;

  const report = {
    schema: 'onedaybooks.print-package.v1',
    generatedAt,
    status: evaluation.status,
    statusLabel: evaluation.statusLabel,
    book: { title, author, publisher: opts.publisher, isbn: isbnText || null },
    analysis,
    design: { ...interior.design, source: designSource },
    interior: {
      file: interiorName,
      pageCount: interior.pageCount,
      layout: interior.layout,
      pages: interior.pages,
      chapters: interior.chapters,
      stats: interior.stats,
      completeness: interior.completeness,
      missingGlyphs: interior.missingGlyphs,
      structure: interior.structure.stats,
      pdfCheck: { ...interiorCheck, fonts: interiorCheck.fonts }
    },
    cover: {
      file: coverName,
      guideFile: guideName,
      geometry: cover.geometry,
      barcode: cover.report.barcode,
      image: cover.report.image,
      spineText: cover.report.spineText,
      ...(cover.report.design ? { design: cover.report.design } : {}),
      ...(finishName ? { finishFile: finishName, finish: { type: cover.finish.type, label: cover.finish.label, targets: cover.finish.targets } } : {}),
      ...(bandName ? { bandFile: bandName, band: { heightMm: cover.band.heightMm, totalWidthMm: cover.band.totalWidthMm, totalHeightMm: cover.band.totalHeightMm, barcode: cover.band.barcode } } : {}),
      pdfCheck: coverCheck
    },
    checks: evaluation.checks,
    blockers: evaluation.blockers,
    warnings: evaluation.warnings,
    humanGates: evaluation.humanGates.map((gate) => ({ ...gate, approved: false })),
    options: opts,
    ...(revisionLog.length ? { revisions: revisionLog } : {})
  };

  const sheet = orderSheet({
    title,
    author,
    publisher: opts.publisher,
    isbn: isbnText,
    interior,
    cover,
    options: opts,
    files: [interiorName, coverName, guideName, finishName, bandName].filter(Boolean).map((n) => n.replace(/^print\//, '')),
    generatedAt,
    revisions: revisionLog
  });

  const payload = [
    { name: interiorName, data: interior.bytes },
    { name: coverName, data: cover.bytes },
    { name: guideName, data: coverGuide.bytes },
    ...(finishName ? [{ name: finishName, data: cover.finish.bytes }] : []),
    ...(bandName ? [{ name: bandName, data: cover.band.bytes }] : []),
    { name: 'print/인쇄지시서.txt', data: sheet },
    { name: 'reports/print_preflight.json', data: JSON.stringify(report, null, 2) },
    ...(revisionLog.length ? [{ name: 'reports/revision_log.json', data: JSON.stringify({ schema: 'onedaybooks.revision-log.v1', generatedAt, revisions: revisionLog }, null, 2) }] : []),
    { name: 'licenses/OFL-NanumMyeongjo.txt', data: fonts.license || 'SIL Open Font License 1.1 — Nanum Myeongjo' },
    ...(interior.sansUsed || cover.report.sansUsed ? [{ name: 'licenses/OFL-NanumGothic.txt', data: fonts.sansLicense || 'SIL Open Font License 1.1 — Nanum Gothic' }] : []),
    ...(interior.layout.fonts.fallback
      ? [{ name: 'licenses/OFL-ooOSFallbackSerif.txt', data: fonts.fallbackLicense || 'SIL Open Font License 1.1 — ooOS Fallback Serif (subset of Noto Serif KR)' }]
      : [])
  ];

  const manifestFiles = [];
  for (const file of payload) {
    const bytes = file.data instanceof Uint8Array ? file.data : encoder.encode(String(file.data));
    manifestFiles.push({ path: file.name, bytes: bytes.length, sha256: await sha256Hex(bytes) });
  }
  const manifest = { schema: 'onedaybooks.print-manifest.v1', generatedAt, algorithm: 'SHA-256', files: manifestFiles };
  const files = [...payload, { name: 'manifest/sha256.json', data: JSON.stringify(manifest, null, 2) }];

  return {
    blob: createStoredZip(files, 'application/zip'),
    fileName: `${name}_인쇄패키지.zip`,
    files: files.map((f) => f.name),
    report,
    manifest,
    orderSheet: sheet,
    interiorBytes: interior.bytes,
    interiorFileName: interiorName.replace(/^print\//, ''),
    coverBytes: cover.bytes,
    coverFileName: coverName.replace(/^print\//, ''),
    coverGuideBytes: coverGuide.bytes,
    coverGuideFileName: guideName.replace(/^print\//, ''),
    finishBytes: cover.finish?.bytes || null,
    finishFileName: finishName ? finishName.replace(/^print\//, '') : null,
    bandBytes: cover.band?.bytes || null,
    bandFileName: bandName ? bandName.replace(/^print\//, '') : null
  };
}

/**
 * Build the complete print package.
 * @param {object} input
 * @param {{regular:Uint8Array,bold:Uint8Array,extraBold:Uint8Array,license?:Uint8Array}} input.fonts
 * @param {object} [input.coverDesign] optional colour cover template (coverDesigned.js)
 */
export async function buildPrintPackage(input = {}) {
  const ctx = await prepareInterior(input);
  const parts = await prepareCover(ctx, { fonts: input.fonts, frontImage: input.frontImage || null, coverDesign: input.coverDesign || null });
  return assemblePrintPackage(ctx, parts, input.fonts);
}
