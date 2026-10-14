// Usage: npx tsx scripts/print-sample.mjs <manuscript.txt> <outDir> [title] [author]
import fs from 'fs';
import path from 'path';
import { buildPrintPackage } from '../src/utils/print/printPackage';

const [, , input, outDir = 'print-out', title = '지하철은 누가 타요', author = '데스크킴'] = process.argv;
const read = (p) => new Uint8Array(fs.readFileSync(path.join('public', p)));
const fonts = {
  regular: read('fonts/NanumMyeongjo-Regular.ttf'),
  bold: read('fonts/NanumMyeongjo-Bold.ttf'),
  extraBold: read('fonts/NanumMyeongjo-ExtraBold.ttf'),
  license: read('fonts/OFL-NanumMyeongjo.txt'),
  fallback: read('fonts/ooOSFallbackSerif-Regular.ttf'),
  fallbackLicense: read('fonts/OFL-ooOSFallbackSerif.txt')
};
const manuscript = fs.readFileSync(input, 'utf8');
const t0 = Date.now();
const result = await buildPrintPackage({
  title, author, isbn: process.env.ISBN || '979-11-998126-9-7', manuscript,
  printSpec: { trimWidthMm: Number(process.env.W || 140), trimHeightMm: Number(process.env.H || 210), bleedMm: 3 },
  options: { publisher: '19호실출판사', price: '18,000', firstEdition: '2026년 10월 20일', flapMm: Number(process.env.FLAP || 0) },
  fonts,
  generatedAt: '2026-10-14T00:00:00.000Z'
});
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, result.fileName), Buffer.from(await result.blob.arrayBuffer()));
fs.writeFileSync(path.join(outDir, 'interior.pdf'), result.interiorBytes);
fs.writeFileSync(path.join(outDir, 'cover.pdf'), result.coverBytes);
fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(result.report, null, 2));
console.log(JSON.stringify({ ms: Date.now() - t0, status: result.report.status, pages: result.report.interior.pageCount, blockers: result.report.blockers, checks: result.report.checks.map(c => `${c.passed ? 'OK ' : 'NG '}${c.label}: ${c.detail}`), stats: result.report.interior.stats, files: result.files }, null, 2));
