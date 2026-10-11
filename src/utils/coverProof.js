// Scalable cover concept for proofing only. Not a printer-ready wraparound cover.
function xml(value) {
  return String(value ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
}
export function buildCoverProofSvg({title='',author='',width=1400,height=2100}={}) {
  const cleanTitle=String(title||'제목 미정').trim().slice(0,100);
  const lines = cleanTitle.length > 14 ? [cleanTitle.slice(0,14),cleanTitle.slice(14,28),cleanTitle.slice(28,42)] : [cleanTitle];
  const fontSize=lines.length>1 ? 125 : Math.min(184,Math.max(100,Math.floor(1400/Math.max(5,cleanTitle.length))));
  const headline=lines.map((line,i)=>`<text x="110" y="${800+i*180}" font-size="${fontSize}" font-weight="800" fill="#171717">${xml(line)}</text>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 1400 2100" role="img" aria-label="표지 시안">
    <rect width="1400" height="2100" fill="#f5f0e7"/>
    <rect x="110" y="290" width="130" height="18" fill="#d74f2d"/>
    <g font-family="sans-serif">${headline}
    <text x="110" y="1800" font-size="58" fill="#171717">${xml(author||'저자 미정')}</text>
    <text x="110" y="1940" font-size="30" fill="#69635c">COVER PROOF — NOT PRINT APPROVED</text></g>
  </svg>`;
}
