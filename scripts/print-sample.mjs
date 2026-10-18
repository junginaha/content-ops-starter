// Usage: npx tsx scripts/print-sample.mjs <manuscript.txt> <outDir> [title] [author]
import fs from 'fs';
import path from 'path';
import { buildPrintPackage } from '../src/utils/print/printPackage';

const [, , input, outDir = 'print-out', title = '샘플 도서', author = '테스트 저자'] = process.argv;
const read = (p) => new Uint8Array(fs.readFileSync(path.join('public', p)));
const fonts = {
  regular: read('fonts/NanumMyeongjo-Regular.ttf'),
  bold: read('fonts/NanumMyeongjo-Bold.ttf'),
  extraBold: read('fonts/NanumMyeongjo-ExtraBold.ttf'),
  license: read('fonts/OFL-NanumMyeongjo.txt'),
  fallback: read('fonts/ooOSFallbackSerif-Regular.ttf'),
  fallbackLicense: read('fonts/OFL-ooOSFallbackSerif.txt'),
  sansRegular: read('fonts/NanumGothic-Regular.ttf'),
  sansBold: read('fonts/NanumGothic-Bold.ttf'),
  sansExtraBold: read('fonts/NanumGothic-ExtraBold.ttf'),
  sansLicense: read('fonts/OFL-NanumGothic.txt')
};
const manuscript = fs.readFileSync(input, 'utf8');
const t0 = Date.now();
const result = await buildPrintPackage({
  title, author, isbn: process.env.ISBN || '', manuscript,
  printSpec: { trimWidthMm: Number(process.env.W || 140), trimHeightMm: Number(process.env.H || 210), bleedMm: 3 },
  options: { publisher: process.env.PUBLISHER || '테스트출판', price: process.env.PRICE || '', firstEdition: process.env.EDITION || '', flapMm: Number(process.env.FLAP || 0), coverLayout: process.env.LAYOUT || undefined, coverPalette: process.env.PALETTE || undefined, designProfile: process.env.PROFILE || 'auto', density: process.env.DENSITY || 'standard', pageMultiple: Number(process.env.MULT || 4) },
  fonts,
  generatedAt: '2026-10-14T00:00:00.000Z'
});
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, result.fileName), Buffer.from(await result.blob.arrayBuffer()));
fs.writeFileSync(path.join(outDir, 'interior.pdf'), result.interiorBytes);
fs.writeFileSync(path.join(outDir, 'cover.pdf'), result.coverBytes);
fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(result.report, null, 2));
console.log(JSON.stringify({ design: result.report.design, analysis: { genre: result.report.analysis.genre, certainty: result.report.analysis.certainty }, ms: Date.now() - t0, status: result.report.status, pages: result.report.interior.pageCount, blockers: result.report.blockers, checks: result.report.checks.map(c => `${c.passed ? 'OK ' : 'NG '}${c.label}: ${c.detail}`), stats: result.report.interior.stats, files: result.files, cover: result.report.cover.design }, null, 2));
