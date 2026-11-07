// 여백형 에세이(breath) 프로필 — 행 보존·행간 잠금·부 표제지·달 도비라·고운바탕·박 규칙.
// Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { PDFDocument } from 'pdf-lib';
import { parseBookStructure } from '../src/utils/print/bookStructure';
import { analyzeForDesign } from '../src/utils/print/designAnalysis';
import { resolveDesign } from '../src/utils/print/designProfiles';
import { buildPrintPackage, loadPrintFonts, imageSize } from '../src/utils/print/printPackage';
import { inspectGeneratedPdf } from '../src/utils/print/printPreflight';

const fetcher = async (url) => {
  const b = fs.readFileSync(path.join('public', url));
  return { ok: true, arrayBuffer: async () => b.buffer.slice(b.byteOffset, b.byteOffset + b.length) };
};

// Short author-broken lines, formal endings, subheads, parts and a bibliography.
function breathManuscript() {
  const para = (i) => `눈을 뜨면\n이불부터 반듯하게 폅니다.\n작은 약속을 지키는 일입니다. ${i}`;
  const out = ['시작하며', '아침 일곱 시.\n아직 거리가 깨기 전입니다.\n그 시간에 책상 앞에 앉는 사람들이 있습니다.'];
  for (let part = 1; part <= 2; part += 1) {
    out.push(`제${part}부 아침의 습관 ${part}`);
    for (let ch = 1; ch <= 2; ch += 1) {
      out.push(`# 이불을 먼저 정리합니다 ${part}-${ch}`);
      for (let s = 1; s <= 3; s += 1) {
        out.push(`## 하루의 첫 번째 약속을 지키는 사람들의 아주 긴 소제목 ${s}`);
        for (let p = 0; p < 6; p += 1) out.push(para(`${part}${ch}${s}${p}`));
      }
    }
  }
  out.push('마치며', '여기까지 읽어 주셔서\n고맙습니다.');
  out.push('참고문헌', 'Rich Dad Personal Finance Team. “Assets vs. Liabilities: The Difference is Life Changing.” Rich Dad, 2024. [12쪽]', '김이름. 『책 제목』. 출판사, 2020. [32쪽]');
  return out.join('\n\n');
}

// Minimal valid PNG (8-bit) of a given colour type, so the art intake can be tested without image tools.
async function png(colorType) {
  const doc = await PDFDocument.create();
  void doc;
  const { deflateSync } = await import('node:zlib');
  const w = 40; const h = 30; const ch = { 0: 1, 2: 3, 4: 2, 6: 4 }[colorType];
  const raw = Buffer.alloc((w * ch + 1) * h, 200);
  for (let y = 0; y < h; y += 1) raw[y * (w * ch + 1)] = 0;
  const crcTable = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
  const crc = (buf) => { let c = 0xffffffff; for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  const chunk = (type, data) => { const len = Buffer.alloc(4); len.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type), data]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([len, td, c]); };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = colorType;
  return new Uint8Array(Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]));
}

test('structure: 제N부 is a part, 시작하며·참고문헌 are named chapters; other profiles unchanged', () => {
  const st = parseBookStructure(breathManuscript());
  assert.equal(st.lossless, true);
  assert.equal(st.stats.parts, 2);
  const part = st.chapters.find((c) => c.part);
  assert.equal(part.label, '제1부');
  assert.equal(part.title, '아침의 습관 1');
  assert.ok(st.chapters.find((c) => c.title === '시작하며')?.named);
  assert.ok(st.chapters.find((c) => c.title === '참고문헌')?.named);
  assert.equal(parseBookStructure('2부 저녁의 습관\n\n본문입니다.').stats.parts, 1);
});

test('analysis: short-line formal prose with subheads is breath, not poetry', () => {
  const a = analyzeForDesign(breathManuscript());
  assert.equal(a.genre, 'breath', JSON.stringify(a.scores));
  assert.ok(a.scores.breath > a.scores.poetry);
});

test('breath design: leading and margins are locked against density and the optimiser', () => {
  for (const density of ['airy', 'standard', 'compact']) {
    for (const leadingDelta of [-0.04, 0, 0.04]) {
      const d = resolveDesign('breath', 140, 210, { density, leadingDelta });
      assert.equal(d.bodySize, 11);
      assert.equal(d.leading, 18);
      assert.deepEqual(d.marginsMm, { top: 24, bottom: 22, inner: 22, outer: 18 });
    }
  }
});

test('breath interior: author lines kept, parts and moon openers, Gowun Batang embedded once, ligatures off', async () => {
  const fonts = await loadPrintFonts({ family: 'gowun', fetcher });
  assert.equal(fonts.family, 'gowun');
  assert.equal(fonts.extraBold, fonts.bold, 'Bold serves the ExtraBold role');
  const gray = await png(0);
  const result = await buildPrintPackage({
    title: '아침의 책', author: '저자', manuscript: breathManuscript(), fonts,
    openerArt: [1, 2, 3].map((n) => ({ name: `vessel-${n}.png`, bytes: gray })),
    options: { designProfile: 'auto', finishing: 'foil' }, generatedAt: '2026-11-07T00:00:00.000Z'
  });
  const r = result.report;
  assert.equal(r.status, 'PRINT_CANDIDATE', r.blockers.join(' / '));
  assert.equal(r.design.profile, 'breath');
  assert.equal(r.design.bodyFont, '고운바탕');
  assert.equal(r.design.leadingLocked, true);
  assert.equal(r.design.paragraphGapPt, 4.5);
  assert.equal(r.interior.layout.leadingPt, 18);
  assert.equal(r.interior.completeness.match, true);
  assert.equal(r.interior.stats.wrappedSourceLines, 0, 'every author line fits the measure');
  assert.equal(r.interior.stats.splitWords, 0, 'headings and references break between words');
  assert.equal(r.interior.stats.partPages, 2);
  assert.ok(r.interior.stats.artPlaced >= 4);
  // A part page and its chapter opener both start on a right-hand (odd) page.
  r.interior.chapters.forEach((c) => { if (c.title !== '참고문헌') assert.equal(c.startPage % 2, 1, `${c.title} @ ${c.startPage}`); });
  // Gowun Batang: Regular + Bold, each embedded once.
  const check = await inspectGeneratedPdf(result.interiorBytes, { trimWidthMm: 140, trimHeightMm: 210, bleedMm: 3 });
  const gowun = check.fonts.filter((f) => /GowunBatang/.test(f.name));
  assert.equal(gowun.length, 2, gowun.map((f) => f.name).join(','));
  assert.equal(check.nonCmykColorOperators, 0, 'one-colour K only');
  assert.ok(result.files.includes('licenses/OFL-GowunBatang.txt'));
  // Foil rule travels with the job ticket and as a warning.
  assert.ok(r.warnings.some((w) => /박 도면/.test(w)));
});

test('ligatures are off so word widths match what is drawn', async () => {
  const fonts = await loadPrintFonts({ family: 'gowun', fetcher });
  const { createFontContext } = await import('../src/utils/print/interiorPdf');
  const ctx = await createFontContext(fonts, { text: 'Difference' });
  const w = (s) => ctx.pdfFonts.regular.widthOfTextAtSize(s, 10);
  assert.ok(Math.abs(w('ff') - 2 * w('f')) < 0.01, `ff ${w('ff')} vs 2×f ${2 * w('f')}`);
});

test('opener art: grayscale accepted, colour rejected with a clear message, size read from the file', async () => {
  assert.deepEqual(imageSize(await png(0)), { width: 40, height: 30 });
  const fonts = await loadPrintFonts({ family: 'gowun', fetcher });
  await assert.rejects(
    buildPrintPackage({ title: 'X', manuscript: breathManuscript(), fonts, openerArt: [{ name: 'colour.png', bytes: await png(2) }], options: { designProfile: 'breath' } }),
    /회색\(그레이스케일\)/
  );
  const alpha = await buildPrintPackage({ title: 'X', manuscript: breathManuscript(), fonts, openerArt: [{ name: 'a.png', bytes: await png(4) }], options: { designProfile: 'breath' } });
  assert.ok(alpha.report.warnings.some((w) => /투명 배경/.test(w)));
});

test('other profiles keep their behaviour: humanities still prints 제1부 as a chapter opener and uses 나눔명조', async () => {
  const fonts = await loadPrintFonts({ fetcher });
  const r = (await buildPrintPackage({ title: 'X', manuscript: '제1부 시작\n\n제1장 아침\n\n근대 도시의 형성은 단순히 인구의 집중으로 설명되지 않는다.', fonts, options: { designProfile: 'humanities' } })).report;
  assert.equal(r.status, 'PRINT_CANDIDATE', r.blockers.join(' / '));
  assert.equal(r.interior.stats.partPages, 0);
  assert.equal(r.design.bodyFont, '나눔명조');
  assert.equal(r.interior.completeness.match, true);
});
