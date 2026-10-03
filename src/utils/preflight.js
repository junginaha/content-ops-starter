function normalizeIsbn(value = '') {
  return String(value).replace(/[^0-9Xx]/g, '').toUpperCase();
}

export function validateIsbn13(value = '') {
  const digits = normalizeIsbn(value);
  if (!digits) return { provided: false, valid: true, normalized: '' };
  if (!/^\d{13}$/.test(digits)) {
    return { provided: true, valid: false, normalized: digits, reason: 'ISBN-13은 숫자 13자리여야 합니다.' };
  }

  const sum = digits
    .slice(0, 12)
    .split('')
    .reduce((total, digit, index) => total + Number(digit) * (index % 2 === 0 ? 1 : 3), 0);
  const check = (10 - (sum % 10)) % 10;
  const valid = check === Number(digits[12]);

  return {
    provided: true,
    valid,
    normalized: digits,
    reason: valid ? '' : 'ISBN-13 체크디지트가 맞지 않습니다.'
  };
}

export function evaluateReleaseReadiness({
  project = {},
  manuscript = '',
  processedManuscript = '',
  engineAnalysis = null,
  aiStatus = 'idle',
  aiWarnings = [],
  epubResult = null,
  releaseResult = null
} = {}) {
  const source = String(processedManuscript || manuscript || '');
  const isbn = validateIsbn13(project.isbn || '');
  const electronic = /전자책/.test(project.objective || '');
  const machineIssues = (engineAnalysis?.issues || [])
    .filter((issue) => issue.severity === 'fixable')
    .reduce((sum, issue) => sum + Number(issue.count || 0), 0);

  const checks = [
    {
      key: 'title',
      label: '제목',
      passed: !!String(project.title || '').trim(),
      detail: String(project.title || '').trim() ? '입력됨' : '제목 필요'
    },
    {
      key: 'author',
      label: '저자',
      passed: !!String(project.author || '').trim(),
      detail: String(project.author || '').trim() ? '입력됨' : '저자명 필요'
    },
    {
      key: 'manuscript',
      label: '작업 원고',
      passed: !!String(processedManuscript || '').trim(),
      detail: processedManuscript ? `${processedManuscript.length.toLocaleString()}자` : '자동 정리/승인된 작업본 필요'
    },
    {
      key: 'mechanical',
      label: '기계적 오류',
      passed: !!engineAnalysis && machineIssues === 0,
      detail: !engineAnalysis ? '검사 필요' : machineIssues === 0 ? '감지 오류 0건' : `${machineIssues}건 남음`
    },
    {
      key: 'ai-review',
      label: 'AI 초안',
      passed: aiStatus !== 'review' && aiStatus !== 'running',
      detail: aiStatus === 'review' ? '사람 승인 대기' : aiStatus === 'running' ? '처리 중' : '미승인 초안 없음'
    },
    {
      key: 'ai-warnings',
      label: 'AI 경고',
      passed: !Array.isArray(aiWarnings) || aiWarnings.length === 0,
      detail: aiWarnings?.length ? `${aiWarnings.length}건 사람 확인 필요` : '미해결 경고 없음'
    },
    {
      key: 'isbn',
      label: 'ISBN',
      passed: isbn.valid,
      detail: !isbn.provided ? '미입력(허용)' : isbn.valid ? '체크디지트 통과' : isbn.reason
    },
    {
      key: 'ebook-output',
      label: '전자책 산출물',
      passed: !electronic || !!(epubResult?.checksPassed || releaseResult?.checksPassed),
      detail: !electronic ? '해당 없음' : (epubResult?.checksPassed || releaseResult?.checksPassed) ? 'EPUB 기술검사 통과' : 'EPUB 생성 필요'
    }
  ];

  const blockers = checks.filter((check) => !check.passed);
  const warnings = [];

  if (source.length > 0 && source.length < 1000) {
    warnings.push('원고가 1,000자 미만입니다. 의도한 짧은 출판물인지 확인하세요.');
  }

  if (!isbn.provided) {
    warnings.push('ISBN은 아직 입력하지 않았습니다. 발급/등록 일정은 외부 절차로 별도 관리하세요.');
  }

  return {
    ready: blockers.length === 0,
    checks,
    blockers,
    warnings,
    isbn
  };
}
