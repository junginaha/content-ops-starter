// Model-assisted planning for 2차 제작. The model only proposes catalog ops as JSON;
// every op is re-validated (schema + policy) and dry-run before anything is applied.
import { knowledgeText } from './knowledge';
import { catalogSpec, outline, validateOp, COMMANDS } from './catalog';
import { parseIntentRules } from './intent';

/** Compact, privacy-preserving snapshot of the book for the planner (no full manuscript). */
export function bookSnapshot(state, { report = null, excerpts = false } = {}) {
  const ol = outline(state);
  const chapters = ol.chapters.map((c) => ({
    idx: c.idx,
    heading: c.untitled ? '(제목 없는 첫 부분)' : [c.label, c.title].filter(Boolean).join(' '),
    paragraphs: c.paragraphs,
    chars: c.chars,
    ...(excerpts ? { firstLine: c.firstLine } : {})
  }));
  return {
    meta: state.meta,
    design: state.design,
    cover: { ...state.cover, endorsements: (state.cover.endorsements || []).map((e) => ({ name: e.name, role: e.role, quoteChars: String(e.quote || '').length })) },
    premium: {
      dedication: !!state.premium?.dedication,
      epigraph: !!state.premium?.epigraph?.text,
      chapterEpigraphs: Object.keys(state.premium?.chapterEpigraphs || {}).map(Number)
    },
    chapters,
    stats: { chapters: ol.stats.chapters, paragraphs: ol.stats.paragraphs, sections: ol.stats.sections },
    ...(report ? {
      production: {
        status: report.status,
        pages: report.interior?.pageCount,
        spineMm: report.cover?.geometry?.spineMm,
        design: report.design?.label,
        blockers: report.blockers,
        warnings: (report.warnings || []).slice(0, 8)
      }
    } : {})
  };
}

export function buildPlannerPrompt({ intent, state, report = null, excerpts = false, rulesOps = [] }) {
  const snap = bookSnapshot(state, { report, excerpts });
  return [
    '너는 한국 단행본 출판사의 수석 편집자이자 북디자이너다. 1차 조판이 끝난 책에 대해 제작자가 2차 수정 의도를 적었다.',
    '제작자의 의도를 아래 명령 목록(Command Catalog)의 명령들로만 바꾼 "수정 계획"을 JSON으로 만든다. 목록에 없는 일은 실행하지 말고 questions에 적는다.',
    '',
    '# 지켜야 할 원칙',
    '- 원고 전체는 받지 않았다. 바꿀 문구(text.replace의 find)는 제작자가 의도에 적은 문구를 그대로 쓴다. 추측한 문구로 찾지 않는다.',
    '- 추천사·헌사·제사·본문에 넣을 문장은 제작자가 의도에 직접 적은 문장만 쓴다. 지어내지 않는다. 없으면 questions로 묻는다.',
    '- 표지 카피(tagline)·뒤표지 소개 글(backCopy)·띠지 헤드라인은 제작자가 요청하면 네가 초안을 쓸 수 있다. 이때 args에 draft:true를 넣는다. 수치·수상·판매량·후기를 만들지 않는다. 마케팅 문구에 "AI"를 셀링 포인트로 쓰지 않는다.',
    '- 고급스럽게 만들어 달라는 요청이면 레퍼런스 지식(레이아웃 모듈, 수상 도서의 편집 아이디어, 후가공·띠지 관례)에 근거해 구체적 명령으로 제안하고, 각 명령의 rationale에 근거를 한 줄로 적는다.',
    '- 장 번호 chapter는 아래 chapters 목록의 idx 값이다.',
    '- 이미 규칙으로 해석된 명령(rules_ops)은 다시 만들지 않는다.',
    '',
    '# 명령 목록',
    catalogSpec(),
    '',
    '# ooOS 레퍼런스 지식',
    knowledgeText(),
    '',
    '# 현재 책 상태(JSON)',
    JSON.stringify(snap),
    '',
    '# 이미 규칙으로 해석된 명령(rules_ops)',
    JSON.stringify(rulesOps.map((o) => ({ command: o.command, args: o.args }))),
    '',
    '# 제작자의 2차 수정 의도',
    String(intent || '').trim(),
    '',
    '# 출력 형식 — JSON 객체 하나만, 다른 글 없이',
    '{"summary":"계획 한두 문장","ops":[{"command":"...","args":{...},"rationale":"근거 한 줄"}],"questions":["확인이 필요한 것"],"risks":["인쇄·권리·일정 위험"]}'
  ].join('\n');
}

export function extractJson(text = '') {
  const raw = String(text || '').trim().replace(/^```(?:json)?\s*|\s*```$/g, '');
  try { return JSON.parse(raw); } catch (_) {
    const s = raw.indexOf('{'); const e = raw.lastIndexOf('}');
    if (s < 0 || e <= s) throw new Error('편집 엔진 응답에서 계획(JSON)을 찾지 못했습니다.');
    return JSON.parse(raw.slice(s, e + 1));
  }
}

/** Normalise a model plan: keep only catalog commands, attach validation errors. */
export function normalizePlan(plan, { intent } = {}) {
  const ops = Array.isArray(plan?.ops) ? plan.ops : [];
  const accepted = [];
  const rejected = [];
  ops.forEach((o) => {
    const op = { command: String(o?.command || ''), args: o?.args && typeof o.args === 'object' ? o.args : {}, rationale: String(o?.rationale || ''), source: 'model' };
    if (!COMMANDS[op.command]) { rejected.push({ op, errors: [`목록에 없는 명령 ${op.command}`] }); return; }
    const errors = validateOp(op, { intent });
    if (errors.length) rejected.push({ op, errors }); else accepted.push(op);
  });
  return {
    summary: String(plan?.summary || ''),
    ops: accepted,
    rejected,
    questions: (Array.isArray(plan?.questions) ? plan.questions : []).map(String).filter(Boolean),
    risks: (Array.isArray(plan?.risks) ? plan.risks : []).map(String).filter(Boolean)
  };
}

/**
 * Full planning: rules first, model for the rest (if a model function is available).
 * askModel(prompt) → Promise<string>.
 */
export async function planRevision({ intent, state, report = null, excerpts = false, askModel = null, onText = null }) {
  const rules = parseIntentRules(intent, state);
  const ruleOps = rules.ops.filter((op) => validateOp(op, { intent }).length === 0);
  const ruleRejected = rules.ops.filter((op) => validateOp(op, { intent }).length > 0).map((op) => ({ op, errors: validateOp(op, { intent }) }));
  const needModel = rules.leftover.length > 0 || /고급|프리미엄|세련|다듬|업그레이드|추천해|알아서|어울리게|좋게/.test(intent);
  let model = null;
  if (needModel && askModel) {
    const prompt = buildPlannerPrompt({ intent, state, report, excerpts, rulesOps: ruleOps });
    const text = await askModel(prompt, onText);
    model = normalizePlan(extractJson(text), { intent });
    // drop model ops that duplicate a rules op on the same command+target
    const key = (o) => `${o.command}:${o.args.field || o.args.chapter || o.args.find || ''}`;
    const seen = new Set(ruleOps.map(key));
    model.ops = model.ops.filter((o) => !seen.has(key(o)));
  }
  return {
    summary: model?.summary || (ruleOps.length ? `규칙으로 ${ruleOps.length}건을 해석했습니다.` : ''),
    ops: [...ruleOps, ...(model?.ops || [])],
    rejected: [...ruleRejected, ...(model?.rejected || [])],
    questions: [
      ...(model?.questions || []),
      ...(!askModel && rules.leftover.length ? rules.leftover.map((s) => `규칙으로 해석하지 못한 요청: “${s}” — 편집 엔진 연결 시 처리됩니다.`) : [])
    ],
    risks: model?.risks || [],
    usedModel: !!model,
    leftover: rules.leftover
  };
}
