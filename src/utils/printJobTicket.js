// ooOS print job ticket: deterministic, side-effect-free validation.
// This is a production specification, not a claim of PDF/X certification.
const allowedBindings = ['perfect', 'sewn', 'saddle'];
const finitePositive = (value) => Number.isFinite(Number(value)) && Number(value) > 0;

export function createPrintJobTicket(input = {}) {
  const trimWidthMm = Number(input.trimWidthMm ?? 140);
  const trimHeightMm = Number(input.trimHeightMm ?? 210);
  const bleedMm = Number(input.bleedMm ?? 3);
  const pages = Number(input.pages);
  const copies = Number(input.copies ?? 1);
  const binding = String(input.binding || 'perfect');
  const errors = [];

  if (!String(input.title || '').trim()) errors.push('도서명은 필수입니다.');
  if (!finitePositive(trimWidthMm) || !finitePositive(trimHeightMm)) errors.push('판형은 양수여야 합니다.');
  if (!Number.isFinite(bleedMm) || bleedMm < 0 || bleedMm > 20) errors.push('도련은 0~20mm 범위여야 합니다.');
  if (!Number.isInteger(pages) || pages < 2) errors.push('쪽수는 2 이상의 정수여야 합니다.');
  if (!Number.isInteger(copies) || copies < 1) errors.push('부수는 1 이상의 정수여야 합니다.');
  if (!allowedBindings.includes(binding)) errors.push('지원하지 않는 제본 방식입니다.');
  if (binding === 'saddle' && Number.isInteger(pages) && pages % 4 !== 0) {
    errors.push('중철 제본의 총 쪽수는 4의 배수여야 합니다.');
  }
  if (binding !== 'saddle' && Number.isInteger(pages) && pages % 2 !== 0) {
    errors.push('양면 인쇄 내지 쪽수는 짝수여야 합니다.');
  }

  const ticket = {
    schemaVersion: 1,
    title: String(input.title || '').trim(),
    author: String(input.author || '').trim(),
    isbn: String(input.isbn || '').trim(),
    trimWidthMm,
    trimHeightMm,
    bleedMm,
    expectedPdfWidthMm: trimWidthMm + 2 * bleedMm,
    expectedPdfHeightMm: trimHeightMm + 2 * bleedMm,
    pages,
    copies,
    binding,
    paper: String(input.paper || '').trim(),
    coverFinish: String(input.coverFinish || '').trim(),
    approvedBy: null,
    approvedAt: null,
    certification: 'NOT_VERIFIED'
  };

  return { valid: errors.length === 0, errors, ticket };
}

export function validatePrintJobTicket(ticket) {
  return createPrintJobTicket(ticket);
}
