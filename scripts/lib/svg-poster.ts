import type { PosterRecord } from './build-poster-record';

const WIDTH = 1000;
const HEIGHT = 1400;

/** Deterministic PRNG so the same poster always renders identically. */
function mulberry32(seed: number) {
    return function () {
        seed |= 0;
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function hashSeed(value: string): number {
    let h = 0;
    for (let i = 0; i < value.length; i++) {
        h = (Math.imul(31, h) + value.charCodeAt(i)) | 0;
    }
    return h;
}

function sky(rand: () => number, accent: string, sunY: number): string {
    let clouds = '';
    for (let i = 0; i < 2; i++) {
        const cx = 220 + rand() * 560;
        const cy = 140 + rand() * 260;
        const w = 90 + rand() * 110;
        clouds += `<ellipse cx="${cx}" cy="${cy}" rx="${w}" ry="${w * 0.28}" fill="#ffffff" opacity="${0.18 + rand() * 0.15}" filter="url(#soften)" />`;
    }
    return `
        <circle cx="${WIDTH / 2}" cy="${sunY}" r="150" fill="${accent}" opacity="0.16" filter="url(#soften)" />
        <circle cx="${WIDTH / 2}" cy="${sunY}" r="60" fill="${accent}" opacity="0.28" filter="url(#soften)" />
        ${clouds}
    `;
}

function birds(rand: () => number, ink: string, count: number, top: number, bottom: number): string {
    let out = '';
    for (let i = 0; i < count; i++) {
        const x = 220 + rand() * 560;
        const y = top + rand() * (bottom - top);
        const s = 10 + rand() * 8;
        out += `<path d="M ${x - s} ${y} Q ${x} ${y - s * 0.9} ${x} ${y} Q ${x} ${y - s * 0.9} ${x + s} ${y}" fill="none" stroke="${ink}" stroke-width="2.5" opacity="0.55" stroke-linecap="round" />`;
    }
    return out;
}

function groundShadow(baseY: number, ink: string): string {
    return `<ellipse cx="${WIDTH / 2}" cy="${baseY + 6}" rx="440" ry="16" fill="${ink}" opacity="0.12" filter="url(#soften)" />`;
}

function motifPaths(motif: PosterRecord['motif'], rand: () => number, ink: string, accent: string): string {
    const cx = WIDTH / 2;
    const baseY = 980 + rand() * 40;
    let out = '';

    switch (motif) {
        case 'bridge': {
            const spanY = baseY - 260;
            const towerH = 300;
            const mainArc = `M ${cx - 340} ${baseY} Q ${cx} ${spanY} ${cx + 340} ${baseY}`;
            out += sky(rand, accent, baseY - 420);
            out += `
                <path d="M ${cx - 420} ${baseY + 30} Q ${cx - 200} ${baseY + 10} ${cx} ${baseY + 30} T ${cx + 420} ${baseY + 30}" fill="none" stroke="${ink}" stroke-width="2.5" opacity="0.3" />
                <path d="M ${cx - 420} ${baseY + 55} Q ${cx - 200} ${baseY + 35} ${cx} ${baseY + 55} T ${cx + 420} ${baseY + 55}" fill="none" stroke="${ink}" stroke-width="2" opacity="0.2" />
                <path d="${mainArc}" fill="none" stroke="${accent}" stroke-width="10" />
                <path d="M ${cx - 260} ${baseY} Q ${cx} ${spanY + 90} ${cx + 260} ${baseY}" fill="none" stroke="${ink}" stroke-width="4" opacity="0.6" />
                ${Array.from({ length: 9 })
                    .map((_, i) => {
                        const t = (i + 1) / 10;
                        const x = cx - 340 + t * 680;
                        const archY = spanY + (baseY - spanY) * (1 - Math.sin(Math.PI * t));
                        return `<line x1="${x}" y1="${archY}" x2="${x}" y2="${baseY}" stroke="${ink}" stroke-width="1.5" opacity="0.35" />`;
                    })
                    .join('')}
                <rect x="${cx - 180}" y="${baseY - towerH}" width="18" height="${towerH}" fill="${ink}" />
                <rect x="${cx + 162}" y="${baseY - towerH}" width="18" height="${towerH}" fill="${ink}" />
                <path d="M ${cx - 180} ${baseY - towerH} L ${cx - 171} ${baseY - towerH - 26} L ${cx - 162} ${baseY - towerH}" fill="${ink}" opacity="0.8" />
                <path d="M ${cx + 162} ${baseY - towerH} L ${cx + 171} ${baseY - towerH - 26} L ${cx + 180} ${baseY - towerH}" fill="${ink}" opacity="0.8" />
                <line x1="${cx - 420}" y1="${baseY}" x2="${cx + 420}" y2="${baseY}" stroke="${ink}" stroke-width="6" />
            `;
            out += birds(rand, ink, 4, baseY - 500, baseY - 380);
            out += groundShadow(baseY, ink);
            break;
        }
        case 'mountain': {
            const peaks = [0.55, 0.9, 0.68, 1, 0.5];
            let d = `M ${cx - 400} ${baseY}`;
            peaks.forEach((p, i) => {
                const x = cx - 400 + (i + 1) * (800 / peaks.length);
                d += ` L ${x} ${baseY - 360 * p}`;
            });
            d += ` L ${cx + 400} ${baseY}`;
            out += sky(rand, accent, baseY - 480);
            out += `
                <path d="${d} Z" fill="${accent}" opacity="0.85" />
                <path d="${d}" fill="none" stroke="${ink}" stroke-width="5" />
                <path d="M ${cx - 210} ${baseY - 220} L ${cx - 170} ${baseY - 260} L ${cx - 130} ${baseY - 220}" fill="none" stroke="${ink}" stroke-width="3" opacity="0.5" />
                <path d="M ${cx + 40} ${baseY - 330} L ${cx + 90} ${baseY - 380} L ${cx + 140} ${baseY - 330}" fill="none" stroke="${ink}" stroke-width="3" opacity="0.5" />
            `;
            out += birds(rand, ink, 3, baseY - 460, baseY - 380);
            out += groundShadow(baseY, ink);
            break;
        }
        case 'tower': {
            const h = 520;
            out += sky(rand, accent, baseY - h - 40);
            out += `
                <polygon points="${cx - 60},${baseY} ${cx - 24},${baseY - h} ${cx + 24},${baseY - h} ${cx + 60},${baseY}" fill="${accent}" />
                <polygon points="${cx - 60},${baseY} ${cx - 24},${baseY - h} ${cx + 24},${baseY - h} ${cx + 60},${baseY}" fill="none" stroke="${ink}" stroke-width="4" />
                <line x1="${cx - 46}" y1="${baseY - h * 0.32}" x2="${cx + 46}" y2="${baseY - h * 0.32}" stroke="${ink}" stroke-width="2" opacity="0.5" />
                <line x1="${cx - 36}" y1="${baseY - h * 0.62}" x2="${cx + 36}" y2="${baseY - h * 0.62}" stroke="${ink}" stroke-width="2" opacity="0.5" />
                <line x1="${cx}" y1="${baseY - h}" x2="${cx}" y2="${baseY - h - 70}" stroke="${ink}" stroke-width="5" />
                <path d="M ${cx} ${baseY - h - 70} L ${cx + 34} ${baseY - h - 58} L ${cx} ${baseY - h - 46} Z" fill="${accent}" opacity="0.8" />
                ${Array.from({ length: 5 }).map((_, i) => `<rect x="${cx - 130 + i * 65}" y="${baseY - 40 - rand() * 40}" width="40" height="${40 + rand() * 40}" fill="${ink}" opacity="0.18" />`).join('')}
                <line x1="${cx - 420}" y1="${baseY}" x2="${cx + 420}" y2="${baseY}" stroke="${ink}" stroke-width="4" opacity="0.5" />
            `;
            out += birds(rand, ink, 3, baseY - h - 30, baseY - h + 60);
            out += groundShadow(baseY, ink);
            break;
        }
        case 'shrine': {
            out += sky(rand, accent, baseY - 460);
            let gates = '';
            for (let i = 0; i < 4; i++) {
                const y = baseY - i * 90;
                const w = 260 - i * 26;
                gates += `
                    <line x1="${cx - w / 2}" y1="${y}" x2="${cx - w / 2}" y2="${y - 130}" stroke="${accent}" stroke-width="14" />
                    <line x1="${cx + w / 2}" y1="${y}" x2="${cx + w / 2}" y2="${y - 130}" stroke="${accent}" stroke-width="14" />
                    <line x1="${cx - w / 2 - 18}" y1="${y - 130}" x2="${cx + w / 2 + 18}" y2="${y - 130}" stroke="${ink}" stroke-width="11" />
                    <line x1="${cx - w / 2 - 10}" y1="${y - 110}" x2="${cx + w / 2 + 10}" y2="${y - 110}" stroke="${ink}" stroke-width="6" />
                `;
            }
            out += gates;
            for (const side of [-1, 1]) {
                const tx = cx + side * 440;
                out += `<path d="M ${tx} ${baseY} L ${tx - 30} ${baseY - 260} L ${tx + 40} ${baseY - 300} L ${tx + 10} ${baseY - 130} Z" fill="${ink}" opacity="0.22" />`;
            }
            out += groundShadow(baseY, ink);
            break;
        }
        case 'dome': {
            out += sky(rand, accent, baseY - 380);
            const domeArc = `M ${cx - 260} ${baseY} A 260 260 0 0 1 ${cx + 260} ${baseY}`;
            out += `
                <path d="${domeArc}" fill="${accent}" />
                <path d="${domeArc}" fill="none" stroke="${ink}" stroke-width="5" />
                <path d="M ${cx - 180} ${baseY} A 180 180 0 0 1 ${cx + 180} ${baseY}" fill="none" stroke="${ink}" stroke-width="2" opacity="0.4" />
                <line x1="${cx}" y1="${baseY - 260}" x2="${cx}" y2="${baseY - 300}" stroke="${ink}" stroke-width="4" />
                <rect x="${cx - 330}" y="${baseY - 90}" width="70" height="90" fill="${ink}" opacity="0.2" />
                <rect x="${cx + 260}" y="${baseY - 120}" width="70" height="120" fill="${ink}" opacity="0.2" />
                <line x1="${cx - 300}" y1="${baseY}" x2="${cx + 300}" y2="${baseY}" stroke="${ink}" stroke-width="6" />
            `;
            out += birds(rand, ink, 3, baseY - 400, baseY - 320);
            out += groundShadow(baseY, ink);
            break;
        }
        case 'canal': {
            out += sky(rand, accent, baseY - 420);
            let d = `M ${cx - 420} ${baseY}`;
            for (let i = 1; i <= 6; i++) {
                d += ` Q ${cx - 420 + i * 140 - 70} ${baseY + (i % 2 === 0 ? 40 : -40)} ${cx - 420 + i * 140} ${baseY}`;
            }
            let d2 = `M ${cx - 420} ${baseY + 26}`;
            for (let i = 1; i <= 6; i++) {
                d2 += ` Q ${cx - 420 + i * 140 - 70} ${baseY + 26 + (i % 2 === 0 ? 30 : -30)} ${cx - 420 + i * 140} ${baseY + 26}`;
            }
            out += `
                <rect x="${cx - 380}" y="${baseY - 220}" width="140" height="220" fill="${ink}" opacity="0.7" />
                <rect x="${cx - 200}" y="${baseY - 300}" width="120" height="300" fill="${ink}" opacity="0.55" />
                <rect x="${cx + 60}" y="${baseY - 260}" width="150" height="260" fill="${ink}" opacity="0.65" />
                <rect x="${cx - 380}" y="${baseY - 220}" width="140" height="16" fill="${accent}" opacity="0.7" />
                <rect x="${cx - 200}" y="${baseY - 300}" width="120" height="16" fill="${accent}" opacity="0.6" />
                <rect x="${cx + 60}" y="${baseY - 260}" width="150" height="16" fill="${accent}" opacity="0.6" />
                <path d="${d}" fill="none" stroke="${accent}" stroke-width="10" />
                <path d="${d2}" fill="none" stroke="${ink}" stroke-width="2" opacity="0.25" />
                <path d="M ${cx - 30} ${baseY + 6} Q ${cx} ${baseY - 14} ${cx + 60} ${baseY + 4} L ${cx + 50} ${baseY + 14} Q ${cx + 10} ${baseY + 4} ${cx - 20} ${baseY + 14} Z" fill="${ink}" opacity="0.5" />
            `;
            out += groundShadow(baseY, ink);
            break;
        }
        case 'pyramid': {
            out += sky(rand, accent, baseY - 420);
            const p1 = `<polygon points="${cx - 280},${baseY} ${cx},${baseY - 380} ${cx + 280},${baseY}" fill="${accent}" />`;
            out += `
                ${p1}
                <polygon points="${cx - 280},${baseY} ${cx},${baseY - 380} ${cx + 280},${baseY}" fill="none" stroke="${ink}" stroke-width="5" />
                <line x1="${cx}" y1="${baseY - 380}" x2="${cx - 60}" y2="${baseY}" stroke="${ink}" stroke-width="2" opacity="0.35" />
                <polygon points="${cx + 320},${baseY} ${cx + 420},${baseY - 160} ${cx + 520},${baseY}" fill="${accent}" opacity="0.7" />
                <polygon points="${cx + 320},${baseY} ${cx + 420},${baseY - 160} ${cx + 520},${baseY}" fill="none" stroke="${ink}" stroke-width="3" opacity="0.5" />
                <path d="M ${cx - 450} ${baseY} Q ${cx - 470} ${baseY - 60} ${cx - 430} ${baseY - 130}" fill="none" stroke="${ink}" stroke-width="5" opacity="0.55" stroke-linecap="round" />
                <path d="M ${cx - 430} ${baseY - 30} L ${cx - 460} ${baseY - 70}" stroke="${ink}" stroke-width="4" opacity="0.5" stroke-linecap="round" />
                <path d="M ${cx - 430} ${baseY - 55} L ${cx - 400} ${baseY - 95}" stroke="${ink}" stroke-width="4" opacity="0.5" stroke-linecap="round" />
            `;
            out += groundShadow(baseY, ink);
            break;
        }
        case 'cliff': {
            out += sky(rand, accent, baseY - 380);
            let d = `M ${cx - 420} ${baseY}`;
            for (let i = 0; i < 6; i++) {
                const x = cx - 420 + i * 140 + rand() * 30;
                const y = baseY - 60 - rand() * 220;
                d += ` L ${x} ${y}`;
            }
            d += ` L ${cx + 420} ${baseY} Z`;
            out += `<path d="${d}" fill="${accent}" opacity="0.85" /><path d="${d}" fill="none" stroke="${ink}" stroke-width="4" />`;
            for (let i = 0; i < 4; i++) {
                const bx = cx - 260 + i * 170 + rand() * 30;
                out += `<rect x="${bx}" y="${baseY - 160 - rand() * 60}" width="18" height="${140 + rand() * 60}" fill="${ink}" opacity="0.28" /><polygon points="${bx - 6},${baseY - 160 - rand() * 60} ${bx + 9},${baseY - 210} ${bx + 24},${baseY - 160}" fill="${accent}" opacity="0.4" />`;
            }
            out += birds(rand, ink, 3, baseY - 400, baseY - 320);
            out += groundShadow(baseY, ink);
            break;
        }
        case 'skyline': {
            out += sky(rand, accent, baseY - 440);
            let bars = '';
            let x = cx - 420;
            while (x < cx + 420) {
                const w = 60 + rand() * 60;
                const h = 160 + rand() * 320;
                const winRows = Math.floor(h / 34);
                let windows = '';
                for (let r = 0; r < winRows; r++) {
                    if (rand() > 0.4) windows += `<rect x="${x + 8}" y="${baseY - h + 10 + r * 34}" width="${w - 24}" height="14" fill="${accent}" opacity="${0.35 + rand() * 0.3}" />`;
                }
                bars += `<rect x="${x}" y="${baseY - h}" width="${w - 8}" height="${h}" fill="${ink}" opacity="${0.55 + rand() * 0.25}" />${windows}`;
                x += w;
            }
            out += bars;
            out += birds(rand, ink, 3, baseY - 460, baseY - 380);
            out += groundShadow(baseY, ink);
            break;
        }
        case 'statue': {
            out += sky(rand, accent, baseY - 420);
            out += `
                <path d="M ${cx - 300} ${baseY} Q ${cx - 150} ${baseY - 50} ${cx} ${baseY - 20} Q ${cx + 150} ${baseY - 50} ${cx + 300} ${baseY}" fill="${accent}" opacity="0.35" />
                <rect x="${cx - 14}" y="${baseY - 340}" width="28" height="240" fill="${ink}" />
                <line x1="${cx - 14}" y1="${baseY - 300}" x2="${cx - 180}" y2="${baseY - 220}" stroke="${ink}" stroke-width="16" stroke-linecap="round" />
                <line x1="${cx + 14}" y1="${baseY - 300}" x2="${cx + 180}" y2="${baseY - 220}" stroke="${ink}" stroke-width="16" stroke-linecap="round" />
                <circle cx="${cx}" cy="${baseY - 370}" r="30" fill="${ink}" />
                <path d="M ${cx - 260} ${baseY} Q ${cx} ${baseY - 90} ${cx + 260} ${baseY}" fill="${accent}" opacity="0.6" />
            `;
            out += birds(rand, ink, 3, baseY - 440, baseY - 360);
            out += groundShadow(baseY, ink);
            break;
        }
        case 'plaza': {
            out += sky(rand, accent, baseY - 380);
            let tiles = '';
            for (let i = -3; i <= 3; i++) {
                tiles += `<line x1="${cx + i * 90}" y1="${baseY - 260}" x2="${cx + i * 90 + 160}" y2="${baseY}" stroke="${accent}" stroke-width="3" opacity="0.5" />`;
            }
            out += tiles;
            for (let i = 0; i < 5; i++) {
                const px = cx - 220 + i * 110 + rand() * 40;
                out += `<ellipse cx="${px}" cy="${baseY - 6}" rx="7" ry="3" fill="${ink}" opacity="0.4" /><rect x="${px - 6}" y="${baseY - 62}" width="12" height="58" rx="4" fill="${ink}" opacity="0.55" /><circle cx="${px}" cy="${baseY - 70}" r="9" fill="${ink}" opacity="0.55" />`;
            }
            out += `<line x1="${cx - 420}" y1="${baseY}" x2="${cx + 420}" y2="${baseY}" stroke="${ink}" stroke-width="6" />`;
            out += groundShadow(baseY, ink);
            break;
        }
        case 'crossing': {
            out += sky(rand, accent, baseY - 420);
            let lines = '';
            for (let i = 0; i < 8; i++) {
                const angle = (Math.PI / 8) * i - Math.PI / 2;
                const x2 = cx + Math.cos(angle) * 380;
                const y2 = baseY - 40 + Math.sin(angle) * 260;
                lines += `<line x1="${cx}" y1="${baseY - 40}" x2="${x2}" y2="${y2}" stroke="${accent}" stroke-width="4" opacity="0.55" />`;
            }
            out += lines;
            for (let i = 0; i < 6; i++) {
                const px = cx - 260 + i * 100 + rand() * 40;
                const py = baseY - 20 + rand() * 40;
                out += `<circle cx="${px}" cy="${py - 30}" r="7" fill="${ink}" opacity="0.6" /><rect x="${px - 6}" y="${py - 22}" width="12" height="26" rx="4" fill="${ink}" opacity="0.6" />`;
            }
            for (let i = 0; i < 3; i++) {
                const bx = cx - 380 + i * 260 + rand() * 40;
                out += `<rect x="${bx}" y="${baseY - 300 - rand() * 100}" width="90" height="${300 + rand() * 100}" fill="${ink}" opacity="0.2" />`;
            }
            out += groundShadow(baseY, ink);
            break;
        }
        default:
            break;
    }

    return out;
}

export function buildPosterSVG(record: PosterRecord): string {
    const rand = mulberry32(hashSeed(record.slug));
    const [dark, accent, light] = record.palette;
    const motif = motifPaths(record.motif, rand, dark, accent);

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="wash" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${light}" />
            <stop offset="60%" stop-color="${light}" />
            <stop offset="100%" stop-color="${dark}" stop-opacity="0.1" />
        </linearGradient>
        <filter id="grain" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="noise" />
            <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.035 0" />
        </filter>
        <pattern id="grainTile" width="64" height="64" patternUnits="userSpaceOnUse">
            <rect width="64" height="64" filter="url(#grain)" />
        </pattern>
        <filter id="soften" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="10" />
        </filter>
        <filter id="bleed" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="7" />
        </filter>
        <radialGradient id="vignette" cx="50%" cy="42%" r="72%">
            <stop offset="60%" stop-color="${dark}" stop-opacity="0" />
            <stop offset="100%" stop-color="${dark}" stop-opacity="0.16" />
        </radialGradient>
    </defs>

    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#wash)" />

    <!-- Single whole-motif watercolor bleed pass (one filter region, not one per shape). -->
    <g transform="translate(6 10)" filter="url(#bleed)" opacity="0.22">${motif}</g>
    <g>${motif}</g>

    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#vignette)" />
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grainTile)" />

    <rect x="40" y="40" width="${WIDTH - 80}" height="${HEIGHT - 80}" fill="none" stroke="${dark}" stroke-width="2" opacity="0.5" />

    <text x="${WIDTH / 2}" y="1148" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="30" letter-spacing="10" fill="${dark}" opacity="0.75">${record.countryEn.toUpperCase()}</text>
    <text x="${WIDTH / 2}" y="1230" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="86" fill="${dark}">${record.cityEn}</text>
    <text x="${WIDTH / 2}" y="1284" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="28" letter-spacing="4" fill="${dark}" opacity="0.85">${record.viewpointEn}</text>

    <text x="${WIDTH / 2}" y="1340" text-anchor="middle" font-family="Georgia, serif" font-size="20" letter-spacing="8" fill="${dark}" opacity="0.55">TRAVELOG</text>
</svg>`;
}
