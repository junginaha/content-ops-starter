// Light cover constants & helpers (no pdf-lib) — safe for UI bundles.
export const COVER_TEMPLATES = {
  typo: { label: '타이포', desc: '단색 바탕에 큰 제목' },
  image: { label: '이미지', desc: '앞표지 전면 이미지 + 아래 제목' },
  frame: { label: '프레임', desc: '종이색 바탕, 테두리와 이미지 창' },
  split: { label: '분할', desc: '위 색면 + 아래 이미지' }
};

export const PAPER_HEX = '#f1efe9';

// ---------- colour ----------
export function hexToRgb(hex) {
  let h = String(hex || '#000000').replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h, 16) || 0;
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
/** Naive device conversion — screen colour is an approximation of print; a proof is required. */
export function hexToCmyk(hex) {
  const [r, g, b] = hexToRgb(hex).map((v) => v / 255);
  const k = 1 - Math.max(r, g, b);
  if (k >= 0.999) return [0, 0, 0, 1];
  const c = (1 - r - k) / (1 - k);
  const m = (1 - g - k) / (1 - k);
  const y = (1 - b - k) / (1 - k);
  const q = (v) => Math.round(Math.min(1, Math.max(0, v)) * 1000) / 1000;
  return [q(c), q(m), q(y), q(k)];
}
export function luminance(hex) {
  const c = hexToRgb(hex).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
export function mixHex(a, b, t) {
  const A = hexToRgb(a); const B = hexToRgb(b);
  return `#${A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join('')}`;
}
export const isDark = (hex) => luminance(hex) <= 0.42;

// ---------- image slot (mm), so the UI can crop/darken the picture before it reaches the PDF ----------
export function designImageSlot({ template, trimWidthMm, trimHeightMm, bleedMm = 3, flapMm = 0 }) {
  const W = Number(trimWidthMm); const H = Number(trimHeightMm); const b = Number(bleedMm);
  const right = Number(flapMm) > 0 ? 0 : b;
  if (template === 'image') return { widthMm: W + right, heightMm: H + 2 * b, darkenBottom: 0.36 };
  if (template === 'split') return { widthMm: W + right, heightMm: H * 0.42 + b, darkenBottom: 0 };
  if (template === 'frame') return { widthMm: W * 0.46, heightMm: W * 0.46, darkenBottom: 0 };
  return null;
}


export const FINISH_TYPES = {
  gold: '금박', silver: '은박', spotUV: '부분 UV(에폭시)', emboss: '형압', none: ''
};
export const FINISH_TARGETS = { title: '제목', subtitle: '부제', author: '저자명', tagline: '앞표지 카피', rule: '선·테두리', spineTitle: '책등 제목' };
