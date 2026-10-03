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

function readmeText({ title, author, objective, generatedAt }) {
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
    '- print/book_140x210.html',
    '- reports/production_report.json',
    '- metadata/book.json',
    '',
    'Important:',
    '- ISBN issuance, bookstore review/registration, printing and shipping are external steps.',
    '- EPUB technical generation does not replace retailer validation.',
    '- Final editorial, rights, layout and release approval remain human gates.'
  ].join('\n');
}

export async function buildReleaseBundle({
  title = '',
  author = '',
  objective = '',
  isbn = '',
  originalText = '',
  processedText = ''
} = {}) {
  const manuscript = String(processedText || originalText || '');
  if (!manuscript.trim()) throw new Error('출간 패키지로 만들 원고가 없습니다.');

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
    manuscript
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
    externalSteps: ['ISBN 발급', '서점 검수·등록', '인쇄', '배송'],
    technicalChecks: epub.technicalChecks
  };

  const payloadFiles = [
    {
      name: 'README.txt',
      data: readmeText({ title, author, objective, generatedAt })
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
      name: `print/${bookName}_140x210.html`,
      data: proofHtml
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
