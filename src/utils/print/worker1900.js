// 1900 heavy engine — runs in a Web Worker so 500+ page books never freeze the page.
// Same API is exposed on self.OOOS_ENGINE for a main-thread fallback.
import { prepareInterior, prepareCover, assemblePrintPackage, loadPrintFonts, needsFallbackFont } from './printPackage';

const state = { fonts: null, fallback: false, ctx: null };

async function ensureFonts(text) {
  const wantFallback = needsFallbackFont(text);
  if (state.fonts && (state.fallback || !wantFallback)) return state.fonts;
  state.fonts = await loadPrintFonts({
    includeSans: true,
    includeFallback: wantFallback,
    fetcher: (url) => fetch(new URL(url.replace(/^\//, ''), self.location.href))
  });
  state.fallback = wantFallback;
  return state.fonts;
}

function summary(ctx) {
  const i = ctx.interior;
  return {
    trimWidthMm: ctx.trimWidthMm, trimHeightMm: ctx.trimHeightMm, bleedMm: ctx.bleedMm,
    designProfile: ctx.designProfile, designSource: ctx.designSource, spineMm: ctx.spineMm,
    analysis: ctx.analysis, opts: ctx.opts,
    interior: { pageCount: i.pageCount, layout: i.layout, chapters: i.chapters, completeness: i.completeness, design: i.design, pages: i.pages, stats: i.stats, missingGlyphs: i.missingGlyphs }
  };
}

export const api = {
  async interior({ title, author, isbn, manuscript, printSpec, options, premium, extraText = '' }) {
    const fonts = await ensureFonts(`${manuscript}${title}${author}${options?.publisher || ''}${options?.subtitle || ''}${extraText}`);
    state.ctx = await prepareInterior({ title, author, isbn, manuscript, printSpec, options, fonts, premium });
    const bytes = state.ctx.interior.bytes.slice();
    return { summary: summary(state.ctx), interiorBytes: bytes };
  },
  async cover({ optsPatch = {}, isbn = '', frontImage = null, coverDesign = null, revisionLog = [], extraText = '' }) {
    const ctx = state.ctx;
    if (!ctx) throw new Error('내지를 먼저 조판해야 합니다.');
    const fonts = await ensureFonts(`${ctx.title}${ctx.author}${extraText}`);
    ctx.opts = { ...ctx.opts, ...optsPatch };
    // validateIsbn13 lives in prepareInterior's module graph; re-derive the same way.
    const digits = String(isbn || '').replace(/[^0-9Xx]/g, '');
    let valid = false;
    if (/^\d{13}$/.test(digits)) {
      const sum = digits.slice(0, 12).split('').reduce((t, d, k) => t + Number(d) * (k % 2 ? 3 : 1), 0);
      valid = (10 - (sum % 10)) % 10 === Number(digits[12]);
    }
    ctx.isbnCheck = !digits ? { provided: false, valid: true, normalized: '' } : { provided: true, valid, normalized: digits, reason: valid ? '' : (digits.length === 13 ? 'ISBN-13 체크디지트가 맞지 않습니다.' : 'ISBN-13은 숫자 13자리여야 합니다.') };
    ctx.isbnText = valid ? String(isbn).trim() : '';
    const leaves = Math.ceil(ctx.interior.pageCount / 2);
    ctx.spineMm = Math.round((leaves * Number(ctx.opts.paperCaliperMm) + Number(ctx.opts.coverAllowanceMm)) * 10) / 10;
    const parts = await prepareCover(ctx, { fonts, frontImage, coverDesign });
    const pkg = await assemblePrintPackage(ctx, parts, fonts, { revisionLog });
    return {
      report: pkg.report, orderSheet: pkg.orderSheet, files: pkg.files, fileName: pkg.fileName, blob: pkg.blob,
      interiorFileName: pkg.interiorFileName, coverFileName: pkg.coverFileName, coverBytes: pkg.coverBytes.slice(),
      finishBytes: pkg.finishBytes ? pkg.finishBytes.slice() : null, finishFileName: pkg.finishFileName,
      bandBytes: pkg.bandBytes ? pkg.bandBytes.slice() : null, bandFileName: pkg.bandFileName,
      spineMm: ctx.spineMm
    };
  }
};

const isWorker = typeof self !== 'undefined' && typeof self.importScripts === 'function' && typeof document === 'undefined';
if (typeof self !== 'undefined') self.OOOS_ENGINE = api;
if (isWorker) {
  self.onmessage = async (e) => {
    const { id, op, payload } = e.data || {};
    try {
      const result = await api[op](payload);
      const transfer = [];
      ['interiorBytes', 'coverBytes', 'finishBytes', 'bandBytes'].forEach((k) => { if (result && result[k]) transfer.push(result[k].buffer); });
      self.postMessage({ id, ok: true, result }, transfer);
    } catch (error) {
      self.postMessage({ id, ok: false, error: error?.message || String(error) });
    }
  };
}
