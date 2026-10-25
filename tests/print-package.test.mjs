// Run: npm test   (node:test via tsx)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { parseBookStructure, structureCanonicalText, canonicalChars } from '../src/utils/print/bookStructure';
import { breakLine, NO_LINE_START } from '../src/utils/print/koreanLineBreak';
import { ean13Modules, decodeEan13Modules, calculateSpineMm, coverGeometry } from '../src/utils/print/coverPdf';
import { buildPrintPackage, sniffImage } from '../src/utils/print/printPackage';
import { buildReleaseBundle } from '../src/utils/releaseBuilder';

const font = (name) => new Uint8Array(fs.readFileSync(path.join('public/fonts', name)));
const FONTS = {
  sansRegular: font('NanumGothic-Regular.ttf'),
  sansBold: font('NanumGothic-Bold.ttf'),
  sansExtraBold: font('NanumGothic-ExtraBold.ttf'),
  sansLicense: font('OFL-NanumGothic.txt'),
  regular: font('NanumMyeongjo-Regular.ttf'),
  bold: font('NanumMyeongjo-Bold.ttf'),
  extraBold: font('NanumMyeongjo-ExtraBold.ttf'),
  license: font('OFL-NanumMyeongjo.txt'),
  fallback: font('ooOSFallbackSerif-Regular.ttf')
};

function sampleManuscript(chapters = 6, paras = 12) {
  const out = ['들어가며', '이 책은 질문에서 시작한다.\n둘째 줄은 행갈이로 이어진다.'];
  const s = '그날 아침, 지하철 2호선은 평소보다 7분 늦게 도착했다. “괜찮으세요?” 누군가 물었다. 책값은 18,000원, ISBN은 979-11-998126-9-7이었다. 자세한 내용은 https://onedaybooks.org/faq/print?id=1 에서 확인한다. 人生은 길다.';
  for (let c = 1; c <= chapters; c += 1) {
    out.push(`제${c}장 아침의 질문 ${c}`);
    for (let p = 0; p < paras; p += 1) {
      if (p === 4) out.push('## 작은 제목');
      if (p === 8) out.push('* * *');
      out.push(`${s} ${s} 문단 ${c}-${p}.`);
    }
  }
  return out.join('\n\n');
}

test('structure: every block accounted, NFC normalised, headings detected', () => {
  const nfd = sampleManuscript(3, 10).normalize('NFD').replace(/\n/g, '\r\n');
  const st = parseBookStructure(nfd);
  assert.equal(st.lossless, true);
  assert.equal(st.stats.chapters, 4); // 들어가며 + 3 chapters
  assert.equal(st.stats.sections, 3);
  assert.equal(st.stats.sceneBreaks, 3);
  assert.equal(st.stats.nfcNormalized, true);
  assert.equal(st.chapters[1].label, '제1장');
  assert.equal(st.chapters[1].title, '아침의 질문 1');
  // Body text characters survive (headings print as label+title).
  const body = canonicalChars(nfd);
  assert.ok(structureCanonicalText(st).length <= body.length);
});

test('line breaking: lossless, kinsoku respected, numbers never split', () => {
  const text = '“괜찮으세요?” 누군가 물었지만 대답은 돌아오지 않았다. 책값은 18,000원이었고, ISBN은 979-11-998126-9-7이었다. 자세한 내용은 https://onedaybooks.org/faq/very/long/path?query=1 에서 확인할 수 있다. 끝.';
  const measure = (str) => Array.from(str).length * 10;
  for (const width of [90, 120, 150, 200, 260, 320, 400]) {
    const lines = breakLine(text, { width, measure, spaceWidth: 3, indent: 10 });
    assert.equal(lines.map((l) => l.words.join('')).join(''), text.replace(/\s+/g, ''));
    lines.forEach((line, i) => {
      const first = Array.from(line.words.join(''))[0];
      if (i > 0) assert.ok(!NO_LINE_START.has(first), `line ${i} starts with ${first} at width ${width}`);
    });
    if (width >= 220) {
      // When the line is wider than the token, the ISBN is never split across lines.
      const joined = lines.map((l) => l.words.join(' '));
      assert.ok(joined.some((l) => l.includes('979-11-998126-9-7')), `ISBN must stay on one line at ${width}`);
    }
  }
});

test('EAN-13: ISBN encodes and decodes, bad check digit rejected', () => {
  const bits = ean13Modules('9791199812697');
  assert.equal(bits.length, 95);
  assert.equal(decodeEan13Modules(bits), '9791199812697');
  assert.throws(() => ean13Modules('9791199812698'));
});

test('spine and cover geometry', () => {
  assert.equal(calculateSpineMm({ pageCount: 168, paperCaliperMm: 0.1, coverAllowanceMm: 0.5 }), 8.9);
  const geo = coverGeometry({ trimWidthMm: 140, trimHeightMm: 210, bleedMm: 3, spineMm: 8.9, flapMm: 90 });
  assert.equal(geo.totalWidthMm, 3 + 90 + 140 + 8.9 + 140 + 90 + 3);
  assert.equal(geo.totalHeightMm, 216);
  assert.deepEqual(geo.panels.map((p) => p.key), ['flapBack', 'back', 'spine', 'front', 'flapFront']);
});

test('image sniffing detects CMYK vs RGB JPEG and PNG', () => {
  const sof = (comps) => new Uint8Array([0xff, 0xd8, 0xff, 0xc0, 0x00, 0x11, 0x08, 0x00, 0x10, 0x00, 0x10, comps, 0, 0, 0, 0, 0, 0, 0, 0]);
  assert.equal(sniffImage(sof(4)).colorSpace, 'CMYK');
  assert.equal(sniffImage(sof(3)).colorSpace, 'RGB');
  assert.equal(sniffImage(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0, 0, 0, 0])).type, 'png');
});

test('print package: candidate status, boxes, page multiple, text completeness', async () => {
  const result = await buildPrintPackage({
    title: '아침의 질문',
    author: '데스크킴',
    isbn: '979-11-998126-9-7',
    manuscript: sampleManuscript(),
    printSpec: { trimWidthMm: 140, trimHeightMm: 210, bleedMm: 3 },
    options: { publisher: '19호실출판사', price: '18,000', firstEdition: '2026년 10월 20일', flapMm: 0 },
    fonts: FONTS,
    generatedAt: '2026-10-14T00:00:00.000Z'
  });
  const r = result.report;
  assert.equal(r.status, 'PRINT_CANDIDATE', r.blockers.join('\n'));
  assert.equal(r.interior.pageCount % 4, 0);
  assert.equal(r.interior.completeness.match, true);
  assert.equal(r.interior.pdfCheck.boxErrors, 0);
  assert.equal(r.interior.pdfCheck.allFontsEmbedded, true);
  assert.equal(r.interior.pdfCheck.nonCmykColorOperators, 0);
  assert.equal(r.interior.layout.fonts.fallback !== null, true, 'hanja requires fallback font');
  assert.equal(r.cover.barcode.decoded, '9791199812697');
  assert.ok(r.humanGates.length >= 4 && r.humanGates.every((g) => g.approved === false));
  assert.ok(result.files.includes('print/인쇄지시서.txt'));
  assert.ok(result.files.includes('manifest/sha256.json'));
  assert.equal(result.manifest.files.length, result.files.length - 1);
  // Interior PDF size = trim + 2 × bleed
  assert.deepEqual([r.interior.pdfCheck.boxes.media.widthMm, r.interior.pdfCheck.boxes.media.heightMm], [146, 216]);
});

test('print package: blocks on missing glyphs (no fallback) and invalid ISBN', async () => {
  const { fallback, ...noFallback } = FONTS;
  const result = await buildPrintPackage({
    title: '한자 시험',
    author: '저자',
    isbn: '979-11-998126-9-8',
    manuscript: '제1장 시작\n\n人生은 짧다.',
    fonts: noFallback,
    generatedAt: '2026-10-14T00:00:00.000Z'
  });
  assert.equal(result.report.status, 'BLOCKED');
  assert.ok(result.report.blockers.some((b) => b.includes('서체')));
  assert.ok(result.report.blockers.some((b) => b.includes('ISBN')));
});

test('existing release bundle keeps its file set (incl. print_spec.json from main)', async () => {
  const bundle = await buildReleaseBundle({ title: '기존 기능', author: '저자', objective: '전자책', processedText: sampleManuscript(1, 2) });
  assert.deepEqual(bundle.files.map((f) => f.replace(/기존_기능/, 'X')), [
    'README.txt', 'manuscript/X_clean.txt', 'ebook/X.epub', 'print/X_proof.html', 'print/print_spec.json',
    'reports/production_report.json', 'metadata/book.json', 'manifest/sha256.json'
  ]);
});

const GENRE_SAMPLES = {
  fiction: () => ['1', ...Array.from({ length: 24 }, (_, i) => (i % 3 === 0 ? `“어디 가세요?” 그가 물었다. ${i}` : `그날 밤 역 앞에는 비가 내렸다. 민서는 우산을 접고 마지막 열차를 기다렸다. ${i}`)), '2', '＊', '“집에요.” 민서가 대답했다.'].join('\n\n'),
  essay: () => ['01. 오래된 책방에서', ...Array.from({ length: 20 }, (_, i) => `나는 오래된 책방을 좋아한다. 나는 그 냄새 속에서 조금 느려진다. ${i}`)].join('\n\n'),
  humanities: () => ['제1장 시간과 도시', ...Array.from({ length: 12 }, (_, i) => `근대 도시의 형성은 단순히 인구의 집중으로 설명되지 않는다. 철도와 전신, 표준시의 도입은 시간에 대한 감각 자체를 바꾸어 놓았다. 그렇다면 출근 시간은 언제부터 당연해졌는가? 이 질문은 공간(空間)의 역사와 이어진다. ${i}`), '## 해석의 경쟁', '여기서 중요한 것은 기술이 아니라 해석이다.', '제2장 광장', '광장은 새로운 질서를 익히게 하는 장치였다.'].join('\n\n'),
  practical: () => ['제1장 현금 흐름', '## 1-1. 첫 3개월', ...Array.from({ length: 6 }, (_, i) => [`1. 초판 부수는 사전 주문 ${i * 10}건을 기준으로 정합니다.`, '2. 인쇄 견적은 최소 3곳에서 받습니다.', `정가 18,000원 도서를 1,000부 인쇄하면 제작비는 약 350만 원입니다. ${i}`].join('\n\n')), '## 1-2. 반품률', '- 반품률 15~20%를 계산에 넣습니다.'].join('\n\n'),
  poetry: () => ['# 첫차', '새벽 첫차는\n아무도 기다리지 않는 사람을\n가장 먼저 태운다', '창에 맺힌 숨이\n이름을 쓰다 말고\n흘러내린다', '# 종점', '나는 내리지 않고\n종점까지 간다'].join('\n\n')
};

test('design analysis recommends the matching genre', async () => {
  const { analyzeForDesign } = await import('../src/utils/print/designAnalysis');
  for (const [genre, make] of Object.entries(GENRE_SAMPLES)) {
    const a = analyzeForDesign(make());
    assert.equal(a.genre, genre, `${genre} → ${a.genre} (${JSON.stringify(a.scores)})`);
    assert.ok(a.reasons.length > 0);
  }
});

test('each genre profile produces a lossless, print-candidate interior with its own layout', async () => {
  const seen = new Set();
  for (const [genre, make] of Object.entries(GENRE_SAMPLES)) {
    const r = (await buildPrintPackage({
      title: `${genre} 시험`, author: '저자', manuscript: make(), fonts: FONTS,
      options: { designProfile: 'auto' }, generatedAt: '2026-10-14T00:00:00.000Z'
    })).report;
    assert.equal(r.status, 'PRINT_CANDIDATE', `${genre}: ${r.blockers.join(' / ')}`);
    assert.equal(r.design.profile, genre);
    assert.equal(r.interior.completeness.match, true, `${genre} text loss`);
    seen.add(`${r.design.opener}|${r.interior.layout.leadingPt}|${r.design.folio}|${r.design.headingFont}`);
  }
  assert.equal(seen.size, 5, 'five distinct typographic systems');
});

test('structure: 나가며 is a heading and a leading title line is not set as body', () => {
  const ms = ['질문하는 저녁', '들어가며', '첫 문단이다.', '제1장 시작', '본문이다.', '나가며', '맺는 문단이다.'].join('\n\n');
  const s = parseBookStructure(ms, { title: '질문하는 저녁' });
  assert.equal(s.lossless, true);
  assert.equal(s.stats.titleLineDropped, true);
  assert.deepEqual(s.chapters.map((c) => c.title), ['들어가며', '시작', '나가며']);
});

test('design analysis: first-person memoir with quoted dialogue reads as essay, not fiction', async () => {
  const { analyzeForDesign } = await import('../src/utils/print/designAnalysis');
  const para = '나는 그날 처음으로 내가 대답만 하며 살았다는 것을 알았다. 나는 노트를 샀다.';
  const ms = ['들어가며', para, '제1장 목요일', ...Array.from({ length: 8 }, (_, i) => (i % 3 === 0 ? '“가장 오래 머문 문장은 어디였나요?”' : para)), '나가며', para].join('\n\n');
  assert.equal(analyzeForDesign(ms).genre, 'essay');
});

test('cover genome: deterministic per manuscript, varied across manuscripts, print-safe ink', async () => {
  const { deriveCoverGenome, COVER_PALETTES, totalInk } = await import('../src/utils/print/coverGenome');
  const { analyzeForDesign } = await import('../src/utils/print/designAnalysis');
  Object.values(COVER_PALETTES).flat().forEach((p) => [p.ground, p.deep, p.accent].forEach((c) => assert.ok(totalInk(c) <= 280, `${p.key} ${c}`)));
  const ms = sampleManuscript(5, 6);
  const a = analyzeForDesign(ms);
  const g1 = deriveCoverGenome({ manuscript: ms, title: '아침의 질문', analysis: a });
  const g2 = deriveCoverGenome({ manuscript: ms, title: '아침의 질문', analysis: a });
  assert.deepEqual(g1, g2);
  assert.ok(g1.excerpt && ms.includes(g1.excerpt), 'excerpt is quoted verbatim from the manuscript');
  const seeds = new Set();
  const looks = new Set();
  for (let i = 0; i < 12; i += 1) {
    const other = `${ms}\n\n변주 문단 ${i}번이 붙는다.`;
    const g = deriveCoverGenome({ manuscript: other, title: `책 ${i}`, analysis: analyzeForDesign(other) });
    seeds.add(g.seed);
    looks.add(`${g.palette.key}/${g.layout}`);
  }
  assert.equal(seeds.size, 12);
  assert.ok(looks.size >= 4, `12 manuscripts should not collapse into one look (got ${looks.size})`);
});

test('cover genome: every composition renders a valid wrap cover, thick spine takes the deep colour', async () => {
  const { deriveCoverGenome, COVER_LAYOUTS } = await import('../src/utils/print/coverGenome');
  const { analyzeForDesign } = await import('../src/utils/print/designAnalysis');
  const { buildCoverPdf } = await import('../src/utils/print/coverPdf');
  const ms = sampleManuscript(4, 5);
  const analysis = analyzeForDesign(ms);
  for (const layout of Object.keys(COVER_LAYOUTS)) {
    const genome = deriveCoverGenome({ manuscript: ms, title: '아침의 질문', analysis, genre: 'essay', layout });
    const out = await buildCoverPdf({ title: '아침의 질문', author: '저자', publisher: '출판사', isbn: '979-11-998126-9-7', price: '15000',
      spineMm: 14, flapMm: 80, fonts: FONTS, style: 'essay', genome });
    assert.equal(out.blockers.length, 0, `${layout}: ${out.blockers.join(', ')}`);
    assert.equal(out.report.genome.spineColour, 'deep');
    assert.ok(out.report.barcode.decoded);
  }
});

test('design analysis: third-person argument is humanities; "- " bullets are not dialogue', async () => {
  const { analyzeForDesign } = await import('../src/utils/print/designAnalysis');
  const arg = '도시는 걷는 사람을 위해 만들어졌는가. 이 질문은 도시계획의 백 년 역사를 관통한다. 보도는 남는 공간에 배치되었고 보행자는 틈을 이용하는 존재가 되었다.';
  const hum = ['서문', arg, '제1장 보행', arg, arg, '제2장 거리', arg, arg, '맺음말', arg].join('\n\n');
  assert.equal(analyzeForDesign(hum).genre, 'humanities');
  const list = ['1. 원가', '원가는 재료비와 포장비를 더한 값입니다.', '- 30% 이하: 효자 메뉴', '- 40% 이상: 다시 봅니다'].join('\n\n');
  assert.equal(analyzeForDesign(list).metrics.dialogueRatio, 0);
});


test('print package: invalid press specifications fail before rendering PDFs', async () => {
  const base = { title: '테스트', author: '저자', manuscript: '본문입니다.', fonts: FONTS };
  const invalid = [
    { printSpec: { trimWidthMm: -140, trimHeightMm: 210, bleedMm: 3 }, pattern: /재단 크기/ },
    { printSpec: { trimWidthMm: 140, trimHeightMm: 210, bleedMm: -1 }, pattern: /도련/ },
    { printSpec: { trimWidthMm: 140, trimHeightMm: 210, bleedMm: 25 }, pattern: /도련/ },
    { options: { pageMultiple: 2.5 }, pattern: /제본 쪽수/ }
  ];
  for (const item of invalid) {
    await assert.rejects(() => buildPrintPackage({ ...base, ...item }), item.pattern);
  }
  await assert.rejects(
    () => buildPrintPackage({ ...base, manuscript: '   ' }),
    /인쇄할 원고/
  );
});
