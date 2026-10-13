import { buildEpub, createStoredZip } from './epubBuilder';
import { buildPrintProofHtml, buildProductionReport } from './onedaybooksEngine';

const encoder = new TextEncoder();

async function toBytes(data) {
  if (data instanceof Uint8Array) return data;
  if (data instanceof Blob) return new Uint8Array(await data.arrayBuffer());
  return encoder.encode(String(data ?? ''));
}

async function sha256Hex(data) {
  const bytes = await toBytes(data);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('');
}

function safeName(value = 'book') {
  return String(value || 'book')
    .trim()
    .replace(/[^0-9a-zA-Z가-힣_-]+/g, '_')
    .replace(/^_+|_+$/g, '') || 'book';
}

function readmeText({ title, author, objective, generatedAt, printSpec }) {
  return [
    'OneDayBooks Release Bundle',
    '',
    `Title: ${title || '제목 없음'}`,
    `Author: ${author || '저자 미상'}`,
    `Objective: ${objective || ''}`,
    `Generated: ${generatedAt}`,
    '',
    'Included:',
    '- manuscript/clean.txt',
    '- ebook/book.epub',
    '- print/book_proof.html',
    '- print/print_spec.json',
    '- reports/production_report.json',
    '- metadata/book.json',
    '',
    'Important:',
    '- ISBN issuance, bookstore review/registration, printing and shipping are external steps.',
    '- EPUB technical generation does not replace retailer validation.',
    '- Print HTML is a proof, not a certified press-ready PDF.',
    '- This archive does NOT contain a print-ready PDF.',
    '- Export PDF with the production print engine and inspect TrimBox, BleedBox, fonts and artwork before delivery.',
    `- Trim: ${printSpec.trimWidthMm}x${printSpec.trimHeightMm}mm; bleed: ${printSpec.bleedMm}mm.`,
    '- Final editorial, rights, layout and release approval remain human gates.'
  ].join('\n');
}

export async function buildReleaseBundle({
  title = '',
  author = '',
  objective = '',
  isbn = '',
  originalText = '',
  processedText = '',
  printSpec = {}
} = {}) {
  const manuscript = String(processedText || originalText || '');
  if (!manuscript.trim()) throw new Error('출간 패키지로 만들 원고가 없습니다.');

  const spec = {
    trimWidthMm: Number(printSpec.trimWidthMm || 140),
    trimHeightMm: Number(printSpec.trimHeightMm || 210),
    bleedMm: Number(printSpec.bleedMm ?? 3),
    expectedPages: printSpec.expectedPages === '' || printSpec.expectedPages == null ? null : Number(printSpec.expectedPages)
  };
  if (![spec.trimWidthMm, spec.trimHeightMm, spec.bleedMm].every(Number.isFinite) || spec.trimWidthMm < 80 || spec.trimHeightMm < 80 || spec.bleedMm < 0) throw new Error('인쇄 규격을 확인하세요.');
  const generatedAt = new Date().toISOString();
  const bookName = safeName(title || 'book');

  const epub = buildEpub({
    title,
    author,
    manuscript,
    isbn,
    publisher: 'OneDayBooks'
  });
  const epubBytes = new Uint8Array(await epub.blob.arrayBuffer());

  const proofHtml = buildPrintProofHtml({
    title: title || '제목 없음',
    author,
    manuscript,
    printSpec: spec
  });

  const report = buildProductionReport({
    title,
    author,
    objective,
    originalText,
    processedText: manuscript
  });

  const metadata = {
    schema: 'onedaybooks.release-bundle.v1',
    generatedAt,
    title,
    author,
    objective,
    isbn: String(isbn || ''),
    epubIdentifier: epub.identifier,
    internalProductionOnly: true,
    printSpec: spec,
    printReadyPdfIncluded: false,
    pressReady: false,
    externalSteps: ['ISBN 발급', '서점 검수·등록', '인쇄', '배송'],
    technicalChecks: epub.technicalChecks
  };

  const payloadFiles = [
    {
      name: 'README.txt',
      data: readmeText({ title, author, objective, generatedAt, printSpec: spec })
    },
    {
      name: `manuscript/${bookName}_clean.txt`,
      data: manuscript
    },
    {
      name: `ebook/${bookName}.epub`,
      data: epubBytes
    },
    {
      name: `print/${bookName}_proof.html`,
      data: proofHtml
    },
    {
      name: 'print/print_spec.json',
      data: JSON.stringify({ ...spec, printReadyPdfIncluded: false, pressReady: false, status: 'PROOF_ONLY' }, null, 2)
    },
    {
      name: 'reports/production_report.json',
      data: JSON.stringify(report, null, 2)
    },
    {
      name: 'metadata/book.json',
      data: JSON.stringify(metadata, null, 2)
    }
  ];

  const manifestEntries = [];
  for (const file of payloadFiles) {
    const bytes = await toBytes(file.data);
    manifestEntries.push({
      path: file.name,
      bytes: bytes.length,
      sha256: await sha256Hex(bytes)
    });
  }

  const manifest = {
    schema: 'onedaybooks.release-manifest.v1',
    generatedAt,
    algorithm: 'SHA-256',
    files: manifestEntries
  };

  const files = [
    ...payloadFiles,
    {
      name: 'manifest/sha256.json',
      data: JSON.stringify(manifest, null, 2)
    }
  ];

  return {
    blob: createStoredZip(files, 'application/zip'),
    fileName: `${bookName}_release_bundle.zip`,
    generatedAt,
    files: files.map((file) => file.name),
    manifest,
    technicalChecks: epub.technicalChecks,
    epubIdentifier: epub.identifier
  };
}
