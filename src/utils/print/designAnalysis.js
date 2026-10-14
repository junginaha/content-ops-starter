// Manuscript analysis for editorial design: measurable signals -> genre profile + evidence.
// Deterministic and explainable: every recommendation lists the numbers it is based on.
import { parseBookStructure, nfc } from './bookStructure';

const LIST_RE = /^(\d{1,2}[.)]\s|[-•·▪■□○●◦※✓✔]\s|[①-⑳]|[가-하][.)]\s|\(\d{1,2}\)\s)/;
const DIALOGUE_RE = /^["“「『'‘―—-]/;
// Singular narrator only — the generic "우리" of nonfiction is not a personal voice signal.
const FIRST_PERSON_RE = /(^|[\s“"'(])(나는|나의|내가|나를|나에게|나도|내게|저는|제가|저의)/g;
const FORMAL_END_RE = /(습니다|합니다|입니다|됩니다|십시오|세요)[.!?]?$/;
const PAST_NARRATIVE_RE = /(었다|았다|였다|했다|렸다|졌다)[.!?”"]?$/;

const round = (v, d = 2) => Math.round(v * 10 ** d) / 10 ** d;

export const GENRES = {
  fiction: '소설',
  essay: '에세이',
  humanities: '인문·교양',
  practical: '실용·경제',
  poetry: '시'
};

export function analyzeForDesign(manuscript = '', { title = '' } = {}) {
  const structure = parseBookStructure(manuscript, { title });
  const paragraphs = [];
  structure.chapters.forEach((ch) => ch.blocks.forEach((b) => { if (b.type === 'p') paragraphs.push(b); }));
  const text = nfc(manuscript);
  const chars = text.replace(/\s/g, '').length || 1;
  const per1k = (n) => (n / chars) * 1000;

  const lines = paragraphs.flatMap((p) => p.lines);
  const paraLens = paragraphs.map((p) => p.lines.join('').replace(/\s/g, '').length);
  const avgPara = paraLens.length ? paraLens.reduce((a, b) => a + b, 0) / paraLens.length : 0;
  const lineLens = lines.map((l) => l.replace(/\s/g, '').length);
  const avgLine = lineLens.length ? lineLens.reduce((a, b) => a + b, 0) / lineLens.length : 0;
  const multiLine = paragraphs.filter((p) => p.lines.length > 1).length;
  const sentences = text.split(/(?<=[.!?。])\s+|\n+/).map((s) => s.trim()).filter(Boolean);

  const m = {
    chars,
    paragraphs: paragraphs.length,
    chapters: structure.stats.chapters,
    sections: structure.stats.sections,
    sceneBreaks: structure.stats.sceneBreaks,
    avgParagraphChars: round(avgPara, 0),
    avgLineChars: round(avgLine, 0),
    multiLineRatio: round(paragraphs.length ? multiLine / paragraphs.length : 0),
    shortLineRatio: round(lineLens.length ? lineLens.filter((n) => n <= 24).length / lineLens.length : 0),
    dialogueRatio: round(paragraphs.length ? paragraphs.filter((p) => DIALOGUE_RE.test(p.lines[0])).length / paragraphs.length : 0),
    listRatio: round(paragraphs.length ? paragraphs.filter((p) => p.lines.some((l) => LIST_RE.test(l))).length / paragraphs.length : 0),
    firstPersonPer1k: round(per1k((text.match(FIRST_PERSON_RE) || []).length), 1),
    numbersPer1k: round(per1k((text.match(/\d+/g) || []).length), 1),
    questionsPer1k: round(per1k((text.match(/[?？]/g) || []).length), 1),
    formalEndingRatio: round(sentences.length ? sentences.filter((s) => FORMAL_END_RE.test(s)).length / sentences.length : 0),
    pastNarrativeRatio: round(sentences.length ? sentences.filter((s) => PAST_NARRATIVE_RE.test(s)).length / sentences.length : 0),
    sectionsPerChapter: round(structure.stats.chapters ? structure.stats.sections / structure.stats.chapters : structure.stats.sections, 1),
    hanjaPer1k: round(per1k((text.match(/[一-鿿]/g) || []).length), 1),
    latinPer1k: round(per1k((text.match(/[A-Za-z]+/g) || []).length), 1)
  };

  // Scores: each signal adds weight with a stated reason.
  const s = { fiction: 0, essay: 0, humanities: 1, practical: 0, poetry: 0 };
  const why = { fiction: [], essay: [], humanities: ['산문 기본형'], practical: [], poetry: [] };
  const add = (genre, w, reason) => { s[genre] += w; why[genre].push(reason); };

  if (m.multiLineRatio >= 0.4 && m.avgLineChars <= 28) add('poetry', 4, `행갈이 문단 ${Math.round(m.multiLineRatio * 100)}% · 평균 행 ${m.avgLineChars}자`);
  if (m.shortLineRatio >= 0.6) add('poetry', 2, `짧은 행(24자 이하) ${Math.round(m.shortLineRatio * 100)}%`);
  if (m.avgParagraphChars < 120 && m.multiLineRatio >= 0.3) add('poetry', 1, `짧은 연 구성(문단 평균 ${m.avgParagraphChars}자)`);

  if (m.dialogueRatio >= 0.12) add('fiction', 3, `대화 문단 ${Math.round(m.dialogueRatio * 100)}%`);
  else if (m.dialogueRatio >= 0.06) add('fiction', 1, `대화 문단 ${Math.round(m.dialogueRatio * 100)}%`);
  if (m.pastNarrativeRatio >= 0.35 && m.dialogueRatio >= 0.06) add('fiction', 2, `과거 서술형 문장 ${Math.round(m.pastNarrativeRatio * 100)}%`);
  else if (m.pastNarrativeRatio >= 0.55) add('fiction', 1, `과거 서술형 문장 ${Math.round(m.pastNarrativeRatio * 100)}%`);
  if (m.sceneBreaks >= 2) add('fiction', 1, `장면 전환 ${m.sceneBreaks}회`);

  if (m.firstPersonPer1k >= 3) add('essay', 3, `1인칭 표현 1천 자당 ${m.firstPersonPer1k}회`);
  else if (m.firstPersonPer1k >= 1.5) add('essay', 1, `1인칭 표현 1천 자당 ${m.firstPersonPer1k}회`);
  if (m.firstPersonPer1k >= 1.5 && m.dialogueRatio < 0.08 && m.avgParagraphChars >= 50 && m.avgParagraphChars <= 200) add('essay', 1, `호흡이 짧은 문단(평균 ${m.avgParagraphChars}자)`);

  if (m.listRatio >= 0.06) add('practical', 3, `목록형 문단 ${Math.round(m.listRatio * 100)}%`);
  if (m.numbersPer1k >= 6) add('practical', 2, `숫자 1천 자당 ${m.numbersPer1k}회`);
  if (m.sectionsPerChapter >= 1.5 && (m.listRatio >= 0.06 || m.numbersPer1k >= 6)) add('practical', 2, `장당 소제목 ${m.sectionsPerChapter}개`);
  if (m.formalEndingRatio >= 0.3) add('practical', 1, `경어체 문장 ${Math.round(m.formalEndingRatio * 100)}%`);

  if (m.avgParagraphChars >= 120 && m.dialogueRatio < 0.05 && m.firstPersonPer1k < 1.5) add('humanities', 2, `논증형 긴 문단(평균 ${m.avgParagraphChars}자) · 대화·1인칭 적음`);
  if (m.questionsPer1k >= 1 && m.dialogueRatio < 0.08) add('humanities', 1, `질문 1천 자당 ${m.questionsPer1k}회`);
  if (m.hanjaPer1k >= 1) add('humanities', 1, `한자 병기 1천 자당 ${m.hanjaPer1k}회`);
  if (m.sectionsPerChapter >= 0.5 && m.listRatio < 0.06) add('humanities', 1, `장당 소제목 ${m.sectionsPerChapter}개`);

  const ranked = Object.entries(s).sort((a, b) => b[1] - a[1]);
  const [top, second] = ranked;
  const total = ranked.reduce((sum, [, v]) => sum + v, 0) || 1;
  const confidence = round(top[1] / total);
  const margin = top[1] - second[1];

  return {
    schema: 'onedaybooks.design-analysis.v1',
    metrics: m,
    genre: top[0],
    genreLabel: GENRES[top[0]],
    confidence,
    certainty: margin >= 3 ? 'high' : margin >= 1.5 ? 'medium' : 'low',
    reasons: why[top[0]],
    alternatives: ranked.slice(1, 3).map(([key, score]) => ({ genre: key, label: GENRES[key], score, reasons: why[key] })),
    scores: s,
    estimatedPages: Math.max(1, Math.ceil(chars / 900))
  };
}
