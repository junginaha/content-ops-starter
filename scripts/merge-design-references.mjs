#!/usr/bin/env node
// Import a vetted JSON array into the existing ooOS reference library.
// Usage: node scripts/merge-design-references.mjs path/to/vetted-batch.json --dry-run
//        node scripts/merge-design-references.mjs path/to/vetted-batch.json --write
// Does NOT scrape, verify remote URLs, or grant image/font rights.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const sourcePath = resolve('src/data/designReferences.js');
const inputPath = process.argv[2];
const write = process.argv.includes('--write');
if (!inputPath || (!process.argv.includes('--dry-run') && !write)) {
  console.error('Usage: node scripts/merge-design-references.mjs <vetted-batch.json> --dry-run|--write');
  process.exit(2);
}
const source = readFileSync(sourcePath, 'utf8');
const batch = JSON.parse(readFileSync(resolve(inputPath), 'utf8'));
if (!Array.isArray(batch)) throw new Error('Batch must be a JSON array');
const modules = new Set([...source.matchAll(/\bid:\s*'([A-Z_]+)'/g)].map((m) => m[1]));
const existing = new Set([...source.matchAll(/\bid:\s*["']([a-z0-9][a-z0-9-]+)["']/g)].map((m) => m[1]));
const key = (x) => String(x || '').normalize('NFKC').toLowerCase().replace(/[^a-z0-9가-힣]+/g, '');
const seenTitles = new Set([...source.matchAll(/\btitle:\s*'([^']+)'/g)].map((m) => key(m[1])));
const seenBatch = new Set();
const approved = [], rejected = [], duplicates = [];
const validUrl = (x) => typeof x === 'string' && /^https:\/\/[^\s/]+\.[^\s/]+/.test(x);
for (const item of batch) {
  const reasons = [];
  if (!item || typeof item !== 'object') { rejected.push({ item, reasons: ['not an object'] }); continue; }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.id || '')) reasons.push('invalid id');
  for (const field of ['title', 'publisher', 'designer', 'evidence', 'editorialIdea']) {
    if (typeof item[field] !== 'string' || item[field].trim().length < 3) reasons.push('missing ' + field);
  }
  if (!Number.isInteger(item.year) || item.year < 1450 || item.year > 2100) reasons.push('invalid publication year');
  if (!modules.has(item.module)) reasons.push('unknown layout module');
  if (!validUrl(item.officialUrl) || !validUrl(item.galleryUrl)) reasons.push('official/gallery URL missing or malformed');
  if (!Array.isArray(item.tags) || item.tags.length === 0) reasons.push('missing tags');
  if (!item.rights || !['ADAPT','CHECK','USE'].includes(item.rights.layout)) reasons.push('rights.layout missing');
  if (!Array.isArray(item.typefaces) || !item.typefaces.every((f) => f.name && ['USE','CHECK','SUBSTITUTE'].includes(f.status))) reasons.push('font rights not categorized');
  const titleKey = key(item.title);
  if (existing.has(item.id) || seenTitles.has(titleKey) || seenBatch.has(item.id) || seenBatch.has(titleKey)) {
    duplicates.push({ id: item.id, title: item.title });
    continue;
  }
  if (reasons.length) { rejected.push({ id: item.id, reasons }); continue; }
  seenBatch.add(item.id); seenBatch.add(titleKey);
  approved.push(item);
}
const marker = '\n];\n\nexport function recommendDesignProfiles';
if (!source.includes(marker)) throw new Error('Library insertion marker not found: aborting without modifying');
const output = {
  input: batch.length, approved: approved.length, duplicates: duplicates.length,
  rejected: rejected.length, write, duplicateItems: duplicates,
  rejectedItems: rejected
};
if (write && approved.length) {
  const insertion = approved.map((item) => JSON.stringify(item, null, 2)).join(',\n');
  const before = source.slice(0, source.indexOf(marker));
  const after = source.slice(source.indexOf(marker));
  const updated = before.replace(/\s*$/, '') + ',\n' + insertion + after;
  writeFileSync(sourcePath, updated);
}
console.log(JSON.stringify(output, null, 2));
if (rejected.length) process.exitCode = 1;
