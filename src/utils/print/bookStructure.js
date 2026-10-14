// Deterministic manuscript -> book structure parser for print layout.
// Every source block (separated by blank lines) maps to exactly one element.
// Nothing is rewritten: text is only Unicode-normalized (NFC) so Hangul renders as syllables.

const CHAPTER_RE = /^(제\s*\d+\s*[장부편화]|chapter\s+\d+|part\s+\d+)\s*[.:：\-–—]?\s*(.*)$/i;
const NAMED_RE = /^(프롤로그|에필로그|들어가며|나오며|들어가는 말|나가는 말|맺음말|머리말|서문|여는 글|닫는 글|작가의 말|저자의 말|감사의 말|추천의 글|부록)(\s*[.:：\-–—]\s*(.*))?$/;
const NUMBERED_RE = /^(\d{1,2})[.)]\s+(.+)$/;
// Bare chapter numerals common in fiction: "1", "12", "IV", "Ⅲ".
const BARE_NUMERAL_RE = /^(\d{1,3}|[IVX]{1,6}|[Ⅰ-Ⅻ])$/;
const MD_HEADING_RE = /^(#{1,3})\s+(.+)$/;
const SCENE_BREAK_RE = /^(?:(?:\*\s*){1,5}|(?:＊\s*){1,5}|(?:-\s*){3,}|(?:—\s*){1,3}|[◇◆○●□■※·•∗⁂]+(?:\s*[◇◆○●□■※·•∗⁂]+)*)$/;
const SENTENCE_END_RE = /[.!?。…”"’'」』)]$/;

function splitBlocks(text) {
  return String(text || '')
    .replace(/\r\n?/g, '\n')
    .split(/\n[ \t　]*\n/)
    .map((block) => block.replace(/^\n+|\n+$/g, ''))
    .filter((block) => block.trim().length > 0);
}

function classifyHeading(line) {
  const md = line.match(MD_HEADING_RE);
  if (md) {
    const level = md[1].length === 1 ? 'chapter' : 'section';
    const inner = md[2].trim();
    const ch = inner.match(CHAPTER_RE);
    if (level === 'chapter' && ch) return { level, label: ch[1].replace(/\s+/g, ''), title: ch[2].trim() };
    return { level, label: '', title: inner };
  }
  if (line.length > 60) return null;
  const ch = line.match(CHAPTER_RE);
  if (ch) return { level: 'chapter', label: ch[1].replace(/\s+(?=\d)|(?<=\d)\s+/g, ''), title: ch[2].trim() };
  const named = line.match(NAMED_RE);
  if (named) return { level: 'chapter', label: '', title: line.trim() };
  if (BARE_NUMERAL_RE.test(line)) return { level: 'chapter', label: line, title: '' };
  const num = line.match(NUMBERED_RE);
  if (num && line.length <= 40 && !SENTENCE_END_RE.test(line)) {
    return { level: 'chapter', label: num[1], title: num[2].trim() };
  }
  return null;
}

export function nfc(value) {
  const text = String(value ?? '');
  return typeof text.normalize === 'function' ? text.normalize('NFC') : text;
}

export function parseBookStructure(manuscript = '', { title = '' } = {}) {
  const source = String(manuscript || '');
  const normalized = nfc(source);
  const nfcChanged = normalized !== source;
  const blocks = splitBlocks(normalized);

  const chapters = [];
  let current = null;
  let paragraphCount = 0;
  let sectionCount = 0;
  let breakCount = 0;

  const ensureChapter = () => {
    if (!current) {
      current = { id: `ch-${chapters.length + 1}`, label: '', title: '', untitled: true, blocks: [] };
      chapters.push(current);
    }
    return current;
  };

  blocks.forEach((block, index) => {
    const lines = block.split('\n').map((line) => line.replace(/[ \t　]+$/g, ''));
    const single = lines.length === 1 ? lines[0].trim() : null;
    const sourceIndex = index;

    if (single !== null) {
      if (SCENE_BREAK_RE.test(single)) {
        ensureChapter().blocks.push({ type: 'break', text: single, sourceIndex });
        breakCount += 1;
        return;
      }
      const heading = classifyHeading(single);
      if (heading && heading.level === 'chapter') {
        current = {
          id: `ch-${chapters.length + 1}`,
          label: heading.label,
          title: heading.title,
          heading: single,
          untitled: false,
          sourceIndex,
          blocks: []
        };
        chapters.push(current);
        return;
      }
      if (heading && heading.level === 'section') {
        ensureChapter().blocks.push({ type: 'section', text: heading.title, sourceText: single, sourceIndex });
        sectionCount += 1;
        return;
      }
    }

    ensureChapter().blocks.push({
      type: 'p',
      lines: lines.map((line) => line.replace(/^[ \t　]+/, '')),
      sourceText: block,
      sourceIndex
    });
    paragraphCount += 1;
  });

  const titledChapters = chapters.filter((chapter) => !chapter.untitled);
  const accounted = paragraphCount + sectionCount + breakCount + titledChapters.length;

  return {
    schema: 'onedaybooks.book-structure.v1',
    title: nfc(title),
    chapters,
    stats: {
      sourceBlocks: blocks.length,
      accountedBlocks: accounted,
      paragraphs: paragraphCount,
      sections: sectionCount,
      sceneBreaks: breakCount,
      chapters: titledChapters.length,
      nfcNormalized: nfcChanged
    },
    lossless: accounted === blocks.length
  };
}

// Canonical text used for completeness verification: every non-whitespace character, in order.
export function canonicalChars(value) {
  return nfc(value).replace(/\s+/g, '');
}

export function structureCanonicalText(structure) {
  const parts = [];
  structure.chapters.forEach((chapter) => {
    // Printed form: chapter label + title (heading separators such as ":" are typographic markup).
    if (!chapter.untitled) parts.push(`${chapter.label}${chapter.title}`);
    chapter.blocks.forEach((block) => {
      if (block.type === 'p') parts.push(block.lines.join(''));
      else parts.push(block.text);
    });
  });
  return canonicalChars(parts.join(''));
}
