// Print production package: interior PDF + wrap cover PDF + cover guide + printer order sheet + preflight + manifest.
import { createStoredZip } from '../epubBuilder';
import { validateIsbn13 } from '../preflight';
import { buildInteriorPdf } from './interiorPdf';
import { buildCoverPdf, calculateSpineMm } from './coverPdf';
import { deriveCoverGenome } from './coverGenome';
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
  sansLicense: '/fonts/OFL-NanumGothic.txt',
  gowunRegular: '/fonts/GowunBatang-Regular.ttf',
  gowunBold: '/fonts/GowunBatang-Bold.ttf',
  gowunLicense: '/fonts/OFL-GowunBatang.txt'
};



// Characters outside Hangul/Latin/common punctuation (e.g. hanja) need the fallback face (≈4.9MB).
const PRIMARY_RANGE_RE = /[^\u0000-\u024f\u1100-\u11ff\u2000-\u206f\u2100-\u21ff\u2460-\u24ff\u3000-\u303f\u3130-\u318f\uac00-\ud7a3\uff00-\uffef\s]/;

export function needsFallbackFont(text) {
  return PRIMARY_RANGE_RE.test(String(text || '').normalize('NFC'));
}

export async function loadPrintFonts({ includeFallback = false, includeSans = false, family = 'nanum', fetcher = (url) => fetch(url) } = {}) {
  // One request (and one byte array) per file, so a file serving two roles is embedded once.
  const cache = new Map();
  const load = (url) => {
    if (!cache.has(url)) {
      cache.set(url, (async () => {
        const res = await fetcher(url);
        if (!res.ok) throw new Error(`서체 파일을 불러오지 못했습니다: ${url}`);
        return new Uint8Array(await res.arrayBuffer());
      })());
    }
    return cache.get(url);
  };
  // 고운바탕 has Regular and Bold only; Bold also serves the ExtraBold (display) role.
  const serif = family === 'gowun'
    ? [PRINT_FONT_FILES.gowunRegular, PRINT_FONT_FILES.gowunBold, PRINT_FONT_FILES.gowunBold, PRINT_FONT_FILES.gowunLicense]
    : [PRINT_FONT_FILES.regular, PRINT_FONT_FILES.bold, PRINT_FONT_FILES.extraBold, PRINT_FONT_FILES.license];
  const [regular, bold, extraBold, license, fallback, fallbackLicense] = await Promise.all([
    ...serif.map(load),
    includeFallback ? load(PRINT_FONT_FILES.fallback) : Promise.resolve(null),
    includeFallback ? load(PRINT_FONT_FILES.fallbackLicense) : Promise.resolve(null)
  ]);
  const sans = includeSans
    ? await Promise.all([PRINT_FONT_FILES.sansRegular, PRINT_FONT_FILES.sansBold, PRINT_FONT_FILES.sansExtraBold, PRINT_FONT_FILES.sansLicense].map(load))
    : null;
  return {
    family: family === 'gowun' ? 'gowun' : 'nanum',
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

// Pixel size of a PNG (IHDR) or JPEG (SOF) — needed to place opener illustrations to scale.
export function imageSize(bytes) {
  if (!bytes || bytes.length < 24) return null;
  if (bytes[0] === 0x89 && bytes[1] === 0x50) {
    const u32 = (o) => ((bytes[o] << 24) >>> 0) + (bytes[o + 1] << 16) + (bytes[o + 2] << 8) + bytes[o + 3];
    return { width: u32(16), height: u32(20) };
  }
  if (bytes[0] === 0xff && bytes[1] === 0xd8) {
    let i = 2;
    while (i < bytes.length - 9) {
      if (bytes[i] !== 0xff) { i += 1; continue; }
      const marker = bytes[i + 1];
      const len = (bytes[i + 2] << 8) + bytes[i + 3];
      if ((marker >= 0xc0 && marker <= 0xc3) || (marker >= 0xc5 && marker <= 0xcb && marker !== 0xc8) || (marker >= 0xcd && marker <= 0xcf)) {
        return { height: (bytes[i + 5] << 8) + bytes[i + 6], width: (bytes[i + 7] << 8) + bytes[i + 8] };
      }
      i += 2 + len;
    }
  }
  return null;
}

function pngHasAlpha(bytes) {
  return bytes[0] === 0x89 && (bytes[25] === 4 || bytes[25] === 6);
}

function orderSheet({ title, author, publisher, isbn, interior, cover, options, files, generatedAt }) {
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
    `본문 서체      ${interior.design.bodyFont || '나눔명조'} ${L.bodySizePt}pt / 행간 ${L.leadingPt}pt${interior.design.leadingLocked ? '(고정)' : ''}${interior.design.paragraphGapPt ? ` / 단락 간격 +${interior.design.paragraphGapPt}pt` : ''} / 쪽당 ${L.linesPerPage}행 / 제목 ${interior.design.headingFont}`,
    '',
    '■ 표지',
    `펼침 크기      ${cover.geometry.totalWidthMm} × ${cover.geometry.totalHeightMm}mm (도련 ${cover.geometry.bleedMm}mm 포함)`,
    `책등           ${cover.geometry.spineMm}mm (종이 두께 ${options.paperCaliperMm}mm/장 + 여유 ${options.coverAllowanceMm}mm로 계산 — 인쇄소 확정 필요)`,
    `날개           ${cover.geometry.flapMm ? `${cover.geometry.flapMm}mm` : '없음'}`,
    `표지 용지      ${options.coverPaper || '[인쇄소 협의]'}`,
    `제본           ${options.binding || '무선제본'}`,
    '',
    '■ 파일',
    ...files.map((name) => `- ${name}`),
    '',
    '■ 확인 필요(인쇄소)',
    '- PDF/X 규격 요구 여부와 색상 프로파일',
    '- 책등 폭 확정값 (확정 후 ooOS에서 표지 재생성)',
    '- 내지 도련 처리 기준, 제본 여백',
    '- 부수·납기·후가공(코팅, 박 등)',
    ...(options.finishing === 'foil'
      ? [
          '',
          '■ 박(금박·은박) 후가공 — 반드시 지킬 것',
          '- 박 자리 아래에는 인쇄를 두지 않습니다(종이 바탕 위에만 박). 그림 위에 같은 모양의 박을 겹치지 않습니다.',
          '- 박 도면은 별도 파일(K100 단색 벡터)로 전달하고, 박 외곽 1mm 안에는 인쇄 요소를 두지 않습니다.',
          '- 가는 선·작은 글자(약 0.3mm·8pt 이하)는 박이 뭉개지므로 박에 쓰지 않습니다.',
          '- 박 견본(교정쇄)으로 위치·번짐을 확인한 뒤 본 인쇄를 진행합니다.'
        ]
      : []),
    '',
    `생성 시각 ${generatedAt}`
  ];
  return rows.join('\n');
}

/**
 * Build the complete print package.
 * @param {object} input
 * @param {{regular:Uint8Array,bold:Uint8Array,extraBold:Uint8Array,license?:Uint8Array}} input.fonts
 */
export async function buildPrintPackage({
  title = '',
  author = '',
  isbn = '',
  manuscript = '',
  printSpec = {},
  options = {},
  fonts,
  frontImage = null,
  photoAssets = [],
  openerArt = [],
  generatedAt = new Date().toISOString()
} = {}) {
  const opts = { ...DEFAULT_PRINT_OPTIONS, ...options };
  // Fail closed on invalid production dimensions: never silently replace invalid values
  // with default dimensions, because the resulting PDFs could be printed incorrectly.
  const rawWidth = printSpec.trimWidthMm ?? 140;
  const rawHeight = printSpec.trimHeightMm ?? 210;
  const rawBleed = printSpec.bleedMm ?? 3;
  const rawMultiple = opts.pageMultiple ?? 4;
  const trimWidthMm = Number(rawWidth);
  const trimHeightMm = Number(rawHeight);
  const bleedMm = Number(rawBleed);
  const pageMultiple = Number(rawMultiple);
  if (!Number.isFinite(trimWidthMm) || trimWidthMm < 80 || trimWidthMm > 400 ||
      !Number.isFinite(trimHeightMm) || trimHeightMm < 80 || trimHeightMm > 400) {
    throw new Error('재단 크기는 가로·세로 각각 80~400mm 범위로 설정하세요.');
  }
  if (!Number.isFinite(bleedMm) || bleedMm < 0 || bleedMm > 15) {
    throw new Error('도련은 0~15mm 범위로 설정하세요. 인쇄소 규격을 우선 확인하세요.');
  }
  if (!Number.isInteger(pageMultiple) || pageMultiple < 2 || pageMultiple > 64) {
    throw new Error('제본 쪽수 배수는 2~64 사이의 정수로 설정하세요.');
  }
  if (!String(manuscript || '').trim()) {
    throw new Error('인쇄할 원고가 없습니다.');
  }
  const isbnCheck = validateIsbn13(isbn);
  const isbnText = isbnCheck.valid ? String(isbn || '').trim() : '';

  const analysis = analyzeForDesign(manuscript, { title });
  const designProfile = DESIGN_PROFILES[opts.designProfile] ? opts.designProfile : analysis.genre;
  const designSource = DESIGN_PROFILES[opts.designProfile] ? 'manual' : 'analysis';
  if (profileUsesSans(designProfile) && !fonts.sansBold) {
    throw new Error('이 편집디자인은 고딕 제목 서체가 필요합니다. 서체를 다시 불러와 주세요.');
  }

  // Opener illustrations (달 도비라 등): the interior is one-colour K, so only grayscale art is accepted.
  const art = [];
  const artWarnings = [];
  (openerArt || []).forEach((item, index) => {
    const sniff = sniffImage(item?.bytes);
    const dims = imageSize(item?.bytes);
    if (!sniff || !dims) throw new Error(`도비라 삽화 ${index + 1}: JPG 또는 PNG만 사용할 수 있습니다.`);
    if (sniff.colorSpace !== 'Gray') throw new Error(`도비라 삽화 ${index + 1}(${item.name || '이름 없음'}): 내지는 먹 1도라 회색(그레이스케일) 이미지만 넣을 수 있습니다. 회색으로 변환해 다시 넣어 주세요.`);
    if (sniff.type === 'png' && pngHasAlpha(item.bytes)) artWarnings.push(`도비라 삽화 ${index + 1}: 투명 배경 PNG — 인쇄소 투명도 평활화 확인 필요(흰 배경 권장)`);
    art.push({ bytes: item.bytes, type: sniff.type, width: dims.width, height: dims.height, name: item.name || `art-${index + 1}` });
  });

  const interior = await buildInteriorPdf({
    title,
    author,
    designProfile,
    openerArt: art,
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
    generatedAt
  });

  const spineMm = calculateSpineMm({
    pageCount: interior.pageCount,
    paperCaliperMm: opts.paperCaliperMm,
    coverAllowanceMm: opts.coverAllowanceMm
  });

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
    genome: opts.coverGenome === false ? null : deriveCoverGenome({
      manuscript,
      title,
      analysis,
      genre: designProfile,
      layout: opts.coverLayout,
      palette: opts.coverPalette
    }),
    generatedAt
  };
  const cover = await buildCoverPdf(coverInput);
  const coverGuide = await buildCoverPdf({ ...coverInput, guide: true });

  const interiorCheck = await inspectGeneratedPdf(interior.bytes, { trimWidthMm, trimHeightMm, bleedMm });
  const coverCheck = await inspectGeneratedPdf(cover.bytes, {
    trimWidthMm: cover.geometry.trimWidthMm,
    trimHeightMm: cover.geometry.trimHeightMm,
    bleedMm
  });

  const evaluation = evaluatePrintPackage({ interior, interiorCheck, cover, coverCheck, isbnCheck, pageMultiple });

  const name = safeName(title || 'book');
  const interiorName = `print/${name}_내지_${trimWidthMm}x${trimHeightMm}_도련${bleedMm}mm_${interior.pageCount}p.pdf`;
  const coverName = `print/${name}_표지_${cover.geometry.totalWidthMm}x${cover.geometry.totalHeightMm}_책등${cover.geometry.spineMm}mm.pdf`;
  const guideName = `print/${name}_표지가이드_작업용.pdf`;

  // Photo assets are bundled with chapter assignments. They are NOT yet inserted into
  // the interior PDF; never mark a photo-containing job as print-ready.
  const photoFiles = [];
  const photoPlan = [];
  for (const [index, asset] of photoAssets.entries()) {
    const sniff = sniffImage(asset.bytes);
    if (!sniff || !['jpg', 'png'].includes(sniff.type)) throw new Error(`사진 ${index + 1}의 JPG/PNG 형식을 확인하지 못했습니다.`);
    const extension = sniff.type === 'jpg' ? 'jpg' : 'png';
    const safeOriginal = safeName(String(asset.name || `photo-${index + 1}`).replace(/\.[^.]+$/, '')).slice(0, 65);
    const fileName = `photos/${String(index + 1).padStart(3, '0')}_${safeOriginal}.${extension}`;
    photoFiles.push({ name: fileName, data: asset.bytes });
    photoPlan.push({
      file: fileName, originalName: asset.name, chapter: asset.chapter || null,
      chapterTitle: asset.chapterTitle || null, caption: asset.caption || '',
      rightsConfirmed: asset.rightsConfirmed === true, colorSpace: sniff.colorSpace,
      placement: 'chapter-assigned; awaiting editorial placement and print-resolution review'
    });
  }
  const report = {
    schema: 'onedaybooks.print-package.v1',
    generatedAt,
    status: photoPlan.length ? 'REVIEW_REQUIRED' : evaluation.status,
    statusLabel: photoPlan.length ? '사진 내지 배치·인쇄 적합성 검수 필요' : evaluation.statusLabel,
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
      design: cover.report.genome || null,
      pdfCheck: coverCheck
    },
    checks: evaluation.checks,
    blockers: [...evaluation.blockers, ...(photoPlan.length ? ['사진이 내지 PDF에 아직 삽입되지 않았습니다. 인쇄 발주 전 반드시 실제 페이지에 배치하고 재검수하세요.'] : [])],
    warnings: [...evaluation.warnings, ...artWarnings,
      ...(interior.design.fontSubstituted ? [`이 편집디자인의 지정 서체(${interior.design.fontRequested})를 불러오지 못해 ${interior.design.bodyFont}로 조판했습니다 — 서체를 다시 불러와 재생성하세요.`] : []),
      ...(interior.design.leadingLocked && interior.stats.wrappedSourceLines ? [`작가가 끊은 행 ${interior.stats.wrappedSourceLines}곳이 판면 폭을 넘어 줄이 추가됐습니다 — 행 보존 원칙상 확인 필요`] : []),
      ...(opts.finishing === 'foil' ? ['박 후가공: 박 도면(K100 벡터)은 자동 생성되지 않습니다 — 인쇄지시서의 박 규칙대로 별도 제작·교정쇄 확인'] : []),
      ...photoPlan.filter((photo) => !photo.chapter).map((photo) => `${photo.originalName}: 장 미지정`), ...photoPlan.filter((photo) => !photo.rightsConfirmed).map((photo) => `${photo.originalName}: 사진 사용 권리 미확인`)],
    photos: { count: photoPlan.length, embeddedInInterior: false, plan: photoPlan },
    humanGates: evaluation.humanGates.map((gate) => ({ ...gate, approved: false })),
    options: opts
  };

  const payload = [
    { name: interiorName, data: interior.bytes },
    { name: coverName, data: cover.bytes },
    { name: guideName, data: coverGuide.bytes },
    ...photoFiles,
    ...(photoPlan.length ? [{ name: 'photos/장별_사진배치계획.json', data: JSON.stringify({ schema: 'onedaybooks.photo-plan.v1', warning: '사진 원본은 동봉했지만 내지 PDF에 아직 배치되지 않았습니다. 인쇄 전 편집자 확인 필수.', photos: photoPlan }, null, 2) }] : []),
    { name: 'print/인쇄지시서.txt', data: '' },
    { name: 'reports/print_preflight.json', data: JSON.stringify(report, null, 2) },
    fonts.family === 'gowun'
      ? { name: 'licenses/OFL-GowunBatang.txt', data: fonts.license || 'SIL Open Font License 1.1 — Gowun Batang' }
      : { name: 'licenses/OFL-NanumMyeongjo.txt', data: fonts.license || 'SIL Open Font License 1.1 — Nanum Myeongjo' },
    ...(interior.sansUsed ? [{ name: 'licenses/OFL-NanumGothic.txt', data: fonts.sansLicense || 'SIL Open Font License 1.1 — Nanum Gothic' }] : []),
    ...(interior.layout.fonts.fallback
      ? [{ name: 'licenses/OFL-ooOSFallbackSerif.txt', data: fonts.fallbackLicense || 'SIL Open Font License 1.1 — ooOS Fallback Serif (subset of Noto Serif KR)' }]
      : [])
  ];
  const orderIndex = payload.findIndex((file) => file.name === 'print/인쇄지시서.txt');
  payload[orderIndex].data = orderSheet({
    title,
    author,
    publisher: opts.publisher,
    isbn: isbnText,
    interior,
    cover,
    options: opts,
    files: [interiorName, coverName, guideName].map((n) => n.replace(/^print\//, '')),
    generatedAt
  });

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
    interiorBytes: interior.bytes,
    interiorFileName: interiorName.replace(/^print\//, ''),
    coverBytes: cover.bytes
  };
}
