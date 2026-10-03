export function normalizeManuscript(input = '') {
  const before = String(input);
  const counters = {
    crlf: (before.match(/\r\n/g) || []).length,
    tabs: (before.match(/\t/g) || []).length,
    nbsp: (before.match(/\u00a0/g) || []).length,
    trailingSpaces: (before.match(/[ \t]+$/gm) || []).length,
    excessBlankRuns: (before.match(/\n{3,}/g) || []).length
  };

  const text = before
    .replace(/\r\n?/g, '\n')
    .replace(/\u00a0/g, ' ')
    .replace(/\t/g, '    ')
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return {
    text,
    counters,
    changed: text !== before
  };
}

export function analyzeManuscript(input = '') {
  const text = String(input || '');
  const lines = text ? text.split('\n') : [];
  const paragraphs = text
    ? text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
    : [];
  const words = text.trim() ? text.trim().split(/\s+/).filter(Boolean) : [];
  const headings = lines
    .map((line, index) => ({ line: line.trim(), lineNumber: index + 1 }))
    .filter(({ line }) => {
      if (!line || line.length > 60) return false;
      return /^(제\s*\d+\s*장|chapter\s+\d+|\d+[.)]\s*\S|프롤로그|에필로그|들어가며|나오며)/i.test(line);
    });

  const doublePunctuation = [...text.matchAll(/[!?]{2,}|\.{2,}/g)].slice(0, 30);
  const repeatedSpaces = [...text.matchAll(/ {2,}/g)].slice(0, 30);
  const tabs = [...text.matchAll(/\t/g)].slice(0, 30);
  const oddPunctuationSpacing = [...text.matchAll(/\s+[,.!?;:]/g)].slice(0, 30);

  const issues = [
    {
      key: 'double-punctuation',
      label: '연속 문장부호',
      count: doublePunctuation.length,
      severity: doublePunctuation.length ? 'review' : 'pass'
    },
    {
      key: 'repeated-spaces',
      label: '연속 공백',
      count: repeatedSpaces.length,
      severity: repeatedSpaces.length ? 'fixable' : 'pass'
    },
    {
      key: 'tabs',
      label: '탭 문자',
      count: tabs.length,
      severity: tabs.length ? 'fixable' : 'pass'
    },
    {
      key: 'punctuation-spacing',
      label: '문장부호 앞 공백',
      count: oddPunctuationSpacing.length,
      severity: oddPunctuationSpacing.length ? 'fixable' : 'pass'
    }
  ];

  const autoFixableCount = issues
    .filter((item) => item.severity === 'fixable')
    .reduce((sum, item) => sum + item.count, 0);

  const reviewCount = issues
    .filter((item) => item.severity === 'review')
    .reduce((sum, item) => sum + item.count, 0);

  return {
    charCount: text.length,
    charCountNoSpaces: text.replace(/\s/g, '').length,
    wordCount: words.length,
    paragraphCount: paragraphs.length,
    lineCount: lines.length,
    headingCount: headings.length,
    headings,
    estimatedPrintPages: text ? Math.max(1, Math.ceil(text.replace(/\s/g, '').length / 900)) : 0,
    issues,
    autoFixableCount,
    reviewCount
  };
}

export function safeAutoFix(input = '') {
  const normalized = normalizeManuscript(input);
  const fixed = normalized.text
    .replace(/ {2,}/g, ' ')
    .replace(/\s+([,.!?;:])/g, '$1');

  return {
    text: fixed,
    changed: fixed !== input,
    normalization: normalized.counters,
    analysis: analyzeManuscript(fixed)
  };
}

export function buildProductionReport({
  title = '',
  author = '',
  objective = '',
  originalText = '',
  processedText = ''
} = {}) {
  const original = analyzeManuscript(originalText);
  const processed = analyzeManuscript(processedText || originalText);

  return {
    schema: 'onedaybooks.production-report.v1',
    generatedAt: new Date().toISOString(),
    book: { title, author, objective },
    original,
    processed,
    automatedChecks: {
      normalizationComplete: !!processedText,
      machineFixableIssuesRemaining:
        processed.issues
          .filter((item) => item.severity === 'fixable')
          .reduce((sum, item) => sum + item.count, 0) === 0,
      editorialReviewRequired: processed.reviewCount > 0
    },
    humanApprovalStillRequired: [
      '저자 의도 보존',
      '사실관계·인용 정확성',
      '텍스트·이미지·폰트 권리',
      '최종 편집디자인',
      '최종 출간 승인'
    ],
    externalStepsExcludedFromInternalTimer: [
      'ISBN 발급',
      '서점 검수·등록',
      '인쇄',
      '배송'
    ]
  };
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function buildPrintProofHtml({
  title = '제목 없음',
  author = '',
  manuscript = ''
} = {}) {
  const body = String(manuscript)
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => {
      const escaped = escapeHtml(paragraph).replace(/\n/g, '<br />');
      const isHeading =
        paragraph.length <= 60 &&
        /^(제\s*\d+\s*장|chapter\s+\d+|\d+[.)]\s*\S|프롤로그|에필로그|들어가며|나오며)/i.test(paragraph);
      return isHeading
        ? `<h2 class="chapter">${escaped}</h2>`
        : `<p>${escaped}</p>`;
    })
    .join('\n');

  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${escapeHtml(title)}</title>
<style>
@page { size: 140mm 210mm; margin: 18mm 17mm 20mm; }
html, body { margin: 0; padding: 0; background: #fff; color: #111; }
body {
  font-family: "KoPub Batang", "Noto Serif KR", "AppleMyungjo", serif;
  font-size: 10.2pt;
  line-height: 1.82;
  letter-spacing: -0.01em;
  word-break: keep-all;
}
.title-page {
  height: 172mm;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  break-after: page;
}
.title-page h1 { margin: 0 0 12mm; font-size: 24pt; line-height: 1.25; }
.title-page .author { font-size: 11pt; }
main p {
  margin: 0 0 0.95em;
  text-align: justify;
  text-indent: 1em;
  orphans: 3;
  widows: 3;
}
.chapter {
  margin: 0 0 12mm;
  padding-top: 25mm;
  font-size: 17pt;
  line-height: 1.35;
  break-before: page;
}
.chapter:first-child { break-before: auto; }
@media screen {
  body { max-width: 106mm; margin: 30px auto; box-shadow: 0 0 0 1px #ddd; padding: 18mm 17mm 20mm; }
  .title-page { height: auto; min-height: 150mm; }
}
</style>
</head>
<body>
<section class="title-page">
  <h1>${escapeHtml(title)}</h1>
  <div class="author">${escapeHtml(author)}</div>
</section>
<main>
${body}
</main>
</body>
</html>`;
}
