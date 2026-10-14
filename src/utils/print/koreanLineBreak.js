// Korean line breaking for book typesetting.
// - Default: break between words (어절), justify by widening word gaps.
// - When a line would become loose, split the next Hangul word between syllables (Korean book practice).
// - Kinsoku: closing punctuation never starts a line, opening punctuation never ends a line.
// - Every character of the input is emitted exactly once, in order.

export const NO_LINE_START = new Set(Array.from(',.!?;:)]}」』”’〉》、。…‥·%~°′″℃〕】｝）'));
export const NO_LINE_END = new Set(Array.from('([{「『“‘〈《〔【｛（'));

const HANGUL_RE = /[ᄀ-ᇿ㄰-㆏가-힯]/;
const CJK_RE = /[぀-ヿ㐀-鿿豈-﫿]/;

function chars(value) {
  return Array.from(String(value || ''));
}

function canBreakBetween(prev, next) {
  if (!prev || !next) return false;
  if (NO_LINE_START.has(next)) return false;
  if (NO_LINE_END.has(prev)) return false;
  return true;
}

const SOFT_BREAK_AFTER = new Set(Array.from('/_?&=#'));

function isCjk(ch) {
  return HANGUL_RE.test(ch) || CJK_RE.test(ch);
}

// Break opportunities inside a token: between CJK syllables, or after URL/number separators.
function canBreakInside(prev, next) {
  if (!canBreakBetween(prev, next)) return false;
  const a = isCjk(prev);
  const b = isCjk(next);
  if (a && b) return true; // between syllables
  if (a !== b) return false; // keep "…7이었다" / "ISBN은" together at the script boundary
  if (SOFT_BREAK_AFTER.has(prev)) return true; // after / _ ? & = # (URLs)
  if (prev === '.' && /[A-Za-z]/.test(next)) return true;
  return false;
}

// Numbers such as ISBN or phone numbers are never split; '-' breaks only inside URL-like tokens.
function canBreakInsideToken(word, prev, next) {
  if (canBreakInside(prev, next)) return true;
  return prev === '-' && /[A-Za-z]/.test(word) && /[/.]/.test(word) && canBreakBetween(prev, next);
}

function contentLength(list) {
  return list.filter((ch) => !NO_LINE_START.has(ch) && !NO_LINE_END.has(ch)).length;
}

function isSplittableWord(word) {
  const list = chars(word);
  for (let i = 1; i < list.length; i += 1) if (canBreakInsideToken(word, list[i - 1], list[i])) return true;
  return false;
}

// Find the longest prefix of `word` (>= minHead chars) that fits `avail` and leaves >= minTail chars.
function splitToFit(word, avail, measure, { minHead = 2, minTail = 2 } = {}) {
  const list = chars(word);
  if (list.length < minHead + minTail) return null;
  let best = null;
  for (let i = minHead; i <= list.length - minTail; i += 1) {
    if (!canBreakInsideToken(word, list[i - 1], list[i])) continue;
    // Never leave a one-syllable line such as "다." — the tail needs >= minTail real characters.
    if (contentLength(list.slice(i)) < minTail) continue;
    const head = list.slice(0, i).join('');
    if (measure(head) <= avail) best = i;
    else break;
  }
  if (!best) return null;
  return [list.slice(0, best).join(''), list.slice(best).join('')];
}

// Hard split for an oversized token (URL, long number) at any allowed boundary.
function forceSplit(word, avail, measure) {
  const list = chars(word);
  let cut = 0;
  for (let i = 1; i <= list.length; i += 1) {
    if (measure(list.slice(0, i).join('')) <= avail) cut = i;
    else break;
  }
  if (cut <= 0) cut = 1;
  while (cut > 1 && cut < list.length && !canBreakBetween(list[cut - 1], list[cut])) cut -= 1;
  return [list.slice(0, cut).join(''), list.slice(cut).join('')];
}

/**
 * Break one logical line (no '\n') into typeset lines.
 * @returns {Array<{words:string[], indent:number, last:boolean, naturalWidth:number}>}
 */
export function breakLine(text, {
  width,
  indent = 0,
  measure,
  spaceWidth,
  looseRatio = 0.12,
  hangIndent = 0
}) {
  const words = String(text || '').split(/[ \t　]+/).filter(Boolean);
  const lines = [];
  if (!words.length) return [{ words: [], indent, last: true, naturalWidth: indent }];

  let current = [];
  let currentWidth = indent;
  let lineIndent = indent;
  const queue = words.slice();

  const pushLine = (split = false) => {
    lines.push({ words: current, indent: lineIndent, last: false, naturalWidth: currentWidth, split });
    current = [];
    // Continuation lines: hanging indent (poetry wraps, list items); 0 for ordinary prose.
    lineIndent = hangIndent;
    currentWidth = hangIndent;
  };

  while (queue.length) {
    const word = queue.shift();
    const wordWidth = measure(word);
    const gap = current.length ? spaceWidth : 0;
    const lineWidth = width;

    if (currentWidth + gap + wordWidth <= lineWidth + 0.01) {
      current.push(word);
      currentWidth += gap + wordWidth;
      continue;
    }

    const avail = lineWidth - currentWidth - gap;

    if (!current.length) {
      // Single token wider than the whole line.
      const split = isSplittableWord(word)
        ? splitToFit(word, avail, measure, { minHead: 1, minTail: 1 })
        : null;
      const [head, tail] = split || forceSplit(word, avail, measure);
      current.push(head);
      currentWidth += measure(head);
      pushLine(true);
      if (tail) queue.unshift(tail);
      continue;
    }

    // Line is getting loose: fill the remainder with the head of the next Hangul word.
    if (avail > lineWidth * looseRatio && isSplittableWord(word)) {
      const split = splitToFit(word, avail, measure);
      if (split) {
        current.push(split[0]);
        currentWidth += gap + measure(split[0]);
        pushLine(true);
        queue.unshift(split[1]);
        continue;
      }
    }

    // Kinsoku on word boundary: a word made only of closing punctuation stays on this line.
    if (chars(word).every((ch) => NO_LINE_START.has(ch))) {
      current.push(word);
      currentWidth += gap + wordWidth;
      pushLine();
      continue;
    }

    pushLine();
    queue.unshift(word);
  }

  if (current.length) {
    lines.push({ words: current, indent: lineIndent, last: true, naturalWidth: currentWidth });
  } else if (lines.length) {
    lines[lines.length - 1].last = true;
  }
  return lines;
}

/**
 * Justification parameters for a line.
 * Word gaps widen first (up to maxGapStretch × space); remaining slack goes to letter spacing.
 */
export function justifyLine(line, {
  width,
  measure,
  spaceWidth,
  maxGapStretch = 0.9,
  maxLetterSpacing
}) {
  const gaps = Math.max(0, line.words.length - 1);
  const glyphs = line.words.reduce((sum, word) => sum + chars(word).length, 0);
  const natural = line.naturalWidth;
  const slack = width - natural;

  if (slack < -0.01 && gaps > 0) {
    // Hanging closing punctuation pushed the line over: tighten word gaps (never below 50%).
    const gap = Math.max(spaceWidth * 0.5, spaceWidth + slack / gaps);
    return { gap, letterSpacing: 0, overflow: Math.max(0, -(slack + gaps * (spaceWidth - gap))), slack: 0 };
  }
  if (line.last || slack <= 0.01) {
    return { gap: spaceWidth, letterSpacing: 0, overflow: Math.max(0, -slack), slack: Math.max(0, slack) };
  }

  let gap = spaceWidth;
  let letterSpacing = 0;
  if (gaps > 0) {
    const perGap = slack / gaps;
    if (perGap <= spaceWidth * maxGapStretch) {
      gap = spaceWidth + perGap;
      return { gap, letterSpacing: 0, overflow: 0, slack: 0 };
    }
    gap = spaceWidth * (1 + maxGapStretch);
  }
  const remaining = slack - gaps * (gap - spaceWidth);
  const slots = Math.max(1, glyphs - 1);
  letterSpacing = Math.min(maxLetterSpacing, remaining / slots);
  const used = gaps * (gap - spaceWidth) + letterSpacing * slots;
  // If letter spacing is capped, put the rest back into the gaps so the right edge stays flush.
  if (gaps > 0 && used < slack - 0.01) gap += (slack - used) / gaps;
  return { gap, letterSpacing, overflow: 0, slack: 0 };
}

export function lineText(line) {
  return line.words.join(' ');
}
