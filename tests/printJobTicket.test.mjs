import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

// Dependency-free smoke test for the isolated ESM module.
const source = readFileSync(new URL('../src/utils/printJobTicket.js', import.meta.url), 'utf8')
  .replaceAll('export function ', 'function ');
const context = vm.createContext({});
vm.runInContext(source + '\nthis.createPrintJobTicket = createPrintJobTicket;', context);
const create = context.createPrintJobTicket;

const valid = create({ title: '돈의 면접', pages: 168, copies: 100, trimWidthMm: 140, trimHeightMm: 210, bleedMm: 3 });
assert.equal(valid.valid, true);
assert.equal(valid.ticket.expectedPdfWidthMm, 146);
assert.equal(valid.ticket.expectedPdfHeightMm, 216);
assert.equal(valid.ticket.certification, 'NOT_VERIFIED');

assert.equal(create({ title: '테스트', pages: 167 }).valid, false);
assert.equal(create({ title: '테스트', pages: 10, binding: 'saddle' }).valid, false);
assert.equal(create({ title: '', pages: 168 }).valid, false);
assert.equal(create({ title: '테스트', pages: 168, bleedMm: -1 }).valid, false);
console.log('printJobTicket smoke tests passed');
