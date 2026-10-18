// 2차 제작: command catalog, rules parser, planner normalisation.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { emptyState, outline, dryRun, applyOps, validateOp } from '../src/utils/revision/catalog';
import { parseIntentRules } from '../src/utils/revision/intent';
import { normalizePlan, buildPlannerPrompt, extractJson } from '../src/utils/revision/planner';

function book() {
  const s = emptyState();
  s.meta.title = '별이 지는 밤';
  s.manuscript = ['별이 지는 밤', '제1장 시작', '멀리서 개구리 울음소리가 들려왔다.', '* * *', '“아직 깨어 있었군요.”', '제2장 기억', '기억은 냄새로 돌아왔다.', '제3장 귀환', '바람이 다시 불었다.'].join('\n\n');
  return s;
}

test('rules parser: quoted replace, retitle, dedication with 그리고 inside quotes, endorsement name/role, finish, band', () => {
  const intent = '"개구리 울음소리"를 "풀벌레 소리"로 바꿔줘.\n2장 제목을 "돌아오는 기억"으로\n헌사: "엄마에게, 그리고 약속들에게"\n추천사 "오래 남을 소설" — 김독자(서평가) 넣어줘\n제목과 책등에 금박\n띠지 "가장 조용한 귀환" 80mm로 만들어줘';
  const { ops, leftover } = parseIntentRules(intent, book());
  const by = (c) => ops.find((o) => o.command === c);
  assert.deepEqual(by('text.replace').args, { find: '개구리 울음소리', replace: '풀벌레 소리' });
  assert.equal(by('chapter.retitle').args.title, '돌아오는 기억');
  assert.equal(by('premium.dedication').args.text, '엄마에게, 그리고 약속들에게');
  assert.deepEqual(by('cover.endorsements').args.items[0], { quote: '오래 남을 소설', name: '김독자', role: '서평가' });
  assert.deepEqual(by('cover.finish').args, { type: 'gold', targets: ['spineTitle', 'title'] });
  assert.equal(by('cover.band').args.heightMm, 80);
  assert.equal(leftover.length, 0);
});

test('catalog: preview never mutates, apply is versioned, retitle keeps the chapter count', () => {
  const s = book();
  const before = JSON.stringify(s);
  const ops = [{ command: 'text.replace', args: { find: '개구리', replace: '풀벌레' } }, { command: 'chapter.retitle', args: { chapter: 1, title: '돌아오는 기억' } }];
  const dry = dryRun(s, ops, {});
  assert.ok(dry.every((d) => d.ok));
  assert.equal(JSON.stringify(s), before);
  const { state, log } = applyOps(s, ops, {});
  assert.equal(log.length, 2);
  assert.ok(state.manuscript.includes('풀벌레 울음소리'));
  const ol = outline(state);
  assert.equal(ol.chapters.filter((c) => !c.untitled).length, 3);
  assert.equal(ol.chapters[1].title, '돌아오는 기억');
  assert.equal(ol.chapters[1].label, '제2장');
});

test('policy: endorsements, dedications and inserted text must come from the producer (no fabrication)', () => {
  const s = book();
  assert.ok(validateOp({ command: 'cover.endorsements', args: { items: [{ quote: '최고의 책', name: '누군가' }] } }, { intent: '추천사 넣어줘' }).length);
  assert.equal(validateOp({ command: 'cover.endorsements', args: { items: [{ quote: '최고의 책', name: '누군가' }] } }, { intent: '추천사 "최고의 책" — 누군가' }).length, 0);
  assert.ok(validateOp({ command: 'premium.dedication', args: { text: '사랑하는 가족에게' } }, { intent: '헌사 넣어줘' }).length);
  assert.ok(validateOp({ command: 'premium.epigraph', args: { text: '기억은 냄새로', source: '' } }, { intent: '제사 "기억은 냄새로"' }).length, 'source required');
  assert.ok(validateOp({ command: 'unknown.cmd', args: {} }, {}).length);
  assert.ok(dryRun(s, [{ command: 'text.replace', args: { find: '없는 문구', replace: 'x' } }], {})[0].errors.length);
});

test('planner: unknown/fabricated model ops are rejected, drafts are allowed, prompt carries ooOS knowledge but not the manuscript', () => {
  const s = book();
  const intent = '전체적으로 고급스럽게. 뒤표지 소개 글도 다시 써줘';
  const plan = normalizePlan(extractJson('```json\n{"summary":"s","ops":[{"command":"cover.set","args":{"backCopy":"새 소개 글","draft":true}},{"command":"cover.endorsements","args":{"items":[{"quote":"지어낸 추천","name":"가상 인물"}]}},{"command":"delete.everything","args":{}},{"command":"cover.finish","args":{"type":"gold","targets":["title"]}}],"questions":["추천사가 있나요?"]}\n```'), { intent });
  assert.deepEqual(plan.ops.map((o) => o.command), ['cover.set', 'cover.finish']);
  assert.equal(plan.rejected.length, 2);
  const prompt = buildPlannerPrompt({ intent, state: s });
  assert.ok(prompt.includes('SINGLE_STRONG_RULE') && prompt.includes('Cover Intelligence') && prompt.includes('명령 목록'));
  assert.ok(!prompt.includes('개구리 울음소리'), 'manuscript text is not sent');
});
