import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  designReferences,
  layoutModules,
  curatedCollections,
  curatedReferencesFor,
  rankReferences,
  recommendDesignProfiles
} from '../src/data/designReferences.js';

test('reference ids are unique and modules exist', () => {
  const ids = designReferences.map((r) => r.id);
  assert.equal(new Set(ids).size, ids.length);
  const moduleIds = new Set(layoutModules.map((m) => m.id));
  for (const ref of designReferences) assert.ok(moduleIds.has(ref.module), ref.id);
});

test('curated essay set is visually verified and carries what-to-borrow notes', () => {
  const essay = curatedReferencesFor('essay');
  assert.ok(essay.length >= 5);
  for (const ref of essay) {
    assert.equal(ref.visuallyVerified, true, ref.id);
    assert.match(ref.verifiedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(ref.borrow && ref.borrow.length > 5, ref.id);
    assert.ok(ref.galleryUrl.startsWith('https://'), ref.id);
    assert.equal(ref.rights.images, 'NO');
    assert.equal(ref.rights.text, 'NO');
  }
  assert.ok(curatedCollections['essay-beauty'].genres.includes('essay'));
});

test('no curated set for genres without one', () => {
  assert.deepEqual(curatedReferencesFor('practical'), []);
  assert.deepEqual(curatedReferencesFor(undefined), []);
});

test('essay genre ranks curated essay references first within a module', () => {
  const classic = designReferences.filter((r) => r.module === 'CLASSIC_READING');
  const ranked = rankReferences(classic, 'essay');
  assert.equal(ranked[0].id, 'unintentional-but-korean-essay');
  // ranking keeps every item
  assert.equal(ranked.length, classic.length);
  // other genres keep original order for non-curated items
  const plain = rankReferences(classic, 'humanities');
  assert.equal(plain.length, classic.length);
});

test('recommendDesignProfiles accepts a genre option without changing module choice', () => {
  const analysis = { paragraphCount: 20, charCount: 9000, headingCount: 3, estimatedPrintPages: 120 };
  const a = recommendDesignProfiles(analysis).map((p) => p.id);
  const b = recommendDesignProfiles(analysis, { genre: 'essay' }).map((p) => p.id);
  assert.deepEqual(a, b);
  const classic = recommendDesignProfiles(analysis, { genre: 'essay' }).find((p) => p.id === 'CLASSIC_READING');
  assert.equal(classic.references[0].collections?.includes('essay-beauty'), true);
});
