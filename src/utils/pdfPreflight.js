const PT_TO_MM = 25.4 / 72;

function round(value, digits = 2) {
  const base = 10 ** digits;
  return Math.round(value * base) / base;
}

function decodePdf(buffer) {
  try {
    return new TextDecoder('latin1').decode(new Uint8Array(buffer));
  } catch (_) {
    return new TextDecoder().decode(new Uint8Array(buffer));
  }
}

function parseBox(text, name) {
  const pattern = new RegExp(
    `\\/${name}\\s*\\[\\s*(-?\\d+(?:\\.\\d+)?)\\s+(-?\\d+(?:\\.\\d+)?)\\s+(-?\\d+(?:\\.\\d+)?)\\s+(-?\\d+(?:\\.\\d+)?)\\s*\\]`
  );
  const match = text.match(pattern);
  if (!match) return null;

  const x0 = Number(match[1]);
  const y0 = Number(match[2]);
  const x1 = Number(match[3]);
  const y1 = Number(match[4]);
  if (![x0, y0, x1, y1].every(Number.isFinite)) return null;

  const widthPt = Math.abs(x1 - x0);
  const heightPt = Math.abs(y1 - y0);

  return {
    x0,
    y0,
    x1,
    y1,
    widthPt: round(widthPt, 2),
    heightPt: round(heightPt, 2),
    widthMm: round(widthPt * PT_TO_MM, 2),
    heightMm: round(heightPt * PT_TO_MM, 2)
  };
}

function detectPageCount(text) {
  const pageObjects = (text.match(/\/Type\s*\/Page(?!s)\b/g) || []).length;

  const counts = [];
  const regex = /\/Type\s*\/Pages\b[\s\S]{0,800}?\/Count\s+(\d+)/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    const value = Number(match[1]);
    if (Number.isFinite(value) && value > 0) counts.push(value);
  }

  const treeCount = counts.length ? Math.max(...counts) : 0;
  let pageCount = 0;
  let method = 'unknown';
  let confidence = 'low';

  if (treeCount && pageObjects && treeCount === pageObjects) {
    pageCount = treeCount;
    method = 'page-tree+page-objects';
    confidence = 'high';
  } else if (treeCount) {
    pageCount = treeCount;
    method = 'page-tree-count';
    confidence = pageObjects ? 'medium' : 'medium';
  } else if (pageObjects) {
    pageCount = pageObjects;
    method = 'page-object-count';
    confidence = 'medium';
  }

  return {
    pageCount,
    method,
    confidence,
    pageObjectCount: pageObjects,
    pageTreeCount: treeCount
  };
}

export function inspectPdfBytes(buffer, fileName = '') {
  const text = decodePdf(buffer);
  const header = text.match(/%PDF-(\d\.\d)/);
  const pageInfo = detectPageCount(text);

  return {
    fileName,
    pdfVersion: header ? header[1] : '',
    encrypted: /\/Encrypt\b/.test(text),
    pageCount: pageInfo.pageCount,
    pageCountMethod: pageInfo.method,
    pageCountConfidence: pageInfo.confidence,
    pageObjectCount: pageInfo.pageObjectCount,
    pageTreeCount: pageInfo.pageTreeCount,
    mediaBox: parseBox(text, 'MediaBox'),
    trimBox: parseBox(text, 'TrimBox'),
    bleedBox: parseBox(text, 'BleedBox'),
    hasOutputIntent: /\/OutputIntents?\b/.test(text),
    hasAcroForm: /\/AcroForm\b/.test(text),
    hasAnnotations: /\/Annots\b/.test(text),
    inspectedAt: Date.now()
  };
}

export async function inspectPdfFile(file) {
  if (!file) throw new Error('PDF 파일이 없습니다.');
  if (!/\.pdf$/i.test(file.name || '') && file.type !== 'application/pdf') {
    throw new Error('PDF 파일만 검사할 수 있습니다.');
  }
  if (file.size > 150 * 1024 * 1024) {
    throw new Error('현재 브라우저 프리플라이트는 150MB 이하 PDF를 권장합니다.');
  }

  const buffer = await file.arrayBuffer();
  const report = inspectPdfBytes(buffer, file.name);

  if (!report.pdfVersion) {
    throw new Error('유효한 PDF 헤더를 확인하지 못했습니다.');
  }

  return report;
}

function within(value, target, tolerance) {
  if (!Number.isFinite(value) || !Number.isFinite(target)) return false;
  return Math.abs(value - target) <= tolerance;
}

export function evaluatePrintPdf(report, {
  expectedPages = '',
  trimWidthMm = 140,
  trimHeightMm = 210,
  bleedMm = 3
} = {}) {
  if (!report) {
    return {
      ready: false,
      checks: [
        {
          key: 'print-pdf-upload',
          label: '인쇄 PDF',
          passed: false,
          detail: '인쇄용 PDF 검사 필요'
        }
      ],
      blockers: ['인쇄용 PDF 검사 필요']
    };
  }

  const expected = Number(expectedPages);
  const hasExpected = Number.isFinite(expected) && expected > 0;

  const targetWidth = Number(trimWidthMm) + Number(bleedMm) * 2;
  const targetHeight = Number(trimHeightMm) + Number(bleedMm) * 2;
  const pageBox = report.mediaBox || report.trimBox;
  const tolerance = 0.8;

  const checks = [
    {
      key: 'pdf-open',
      label: 'PDF 구조',
      passed: !!report.pdfVersion && !report.encrypted,
      detail: report.encrypted
        ? '암호화 PDF - 인쇄소 처리 전 해제 필요'
        : report.pdfVersion
          ? `PDF ${report.pdfVersion}`
          : 'PDF 헤더 확인 실패'
    },
    {
      key: 'pdf-pages-detected',
      label: '쪽수 감지',
      passed: Number(report.pageCount) > 0,
      detail: report.pageCount
        ? `${report.pageCount}쪽 · ${report.pageCountConfidence}`
        : '쪽수 자동 감지 실패 - 수동 확인 필요'
    },
    {
      key: 'pdf-even-pages',
      label: '양면 제본 쪽수',
      passed: Number(report.pageCount) > 0 && report.pageCount % 2 === 0,
      detail: report.pageCount
        ? report.pageCount % 2 === 0
          ? `${report.pageCount}쪽 · 짝수`
          : `${report.pageCount}쪽 · 홀수, 마지막 백지/구성 확인`
        : '쪽수 확인 필요'
    },
    {
      key: 'pdf-expected-pages',
      label: '제작지시 쪽수',
      passed: !hasExpected || Number(report.pageCount) === expected,
      detail: !hasExpected
        ? '기준 쪽수 미입력'
        : Number(report.pageCount) === expected
          ? `기준 ${expected}쪽과 일치`
          : `실제 ${report.pageCount || '?'}쪽 / 기준 ${expected}쪽`
    },
    {
      key: 'pdf-page-size',
      label: '판면 크기',
      passed: !!pageBox &&
        (
          (within(pageBox.widthMm, targetWidth, tolerance) &&
            within(pageBox.heightMm, targetHeight, tolerance)) ||
          (within(pageBox.widthMm, targetHeight, tolerance) &&
            within(pageBox.heightMm, targetWidth, tolerance))
        ),
      detail: pageBox
        ? `${pageBox.widthMm} × ${pageBox.heightMm}mm / 목표 ${round(targetWidth, 1)} × ${round(targetHeight, 1)}mm`
        : 'MediaBox/TrimBox 자동 확인 실패'
    }
  ];

  const blockers = checks.filter((check) => !check.passed);

  return {
    ready: blockers.length === 0,
    checks,
    blockers: blockers.map((check) => check.detail),
    target: {
      expectedPages: hasExpected ? expected : null,
      trimWidthMm: Number(trimWidthMm),
      trimHeightMm: Number(trimHeightMm),
      bleedMm: Number(bleedMm),
      pdfWidthMm: round(targetWidth, 1),
      pdfHeightMm: round(targetHeight, 1)
    }
  };
}
