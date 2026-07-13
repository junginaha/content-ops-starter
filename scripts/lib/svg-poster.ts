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

function motifPaths(motif: PosterRecord['motif'], rand: () => number, ink: string, accent: string): string {
    const cx = WIDTH / 2;
    const baseY = 980 + rand() * 40;

    switch (motif) {
        case 'bridge': {
            const spanY = baseY - 260;
            const towerH = 300;
            return `
                <path d="M ${cx - 340} ${baseY} Q ${cx} ${spanY} ${cx + 340} ${baseY}" fill="none" stroke="${accent}" stroke-width="10" />
                <path d="M ${cx - 260} ${baseY} Q ${cx} ${spanY + 90} ${cx + 260} ${baseY}" fill="none" stroke="${ink}" stroke-width="4" opacity="0.6" />
                <rect x="${cx - 180}" y="${baseY - towerH}" width="18" height="${towerH}" fill="${ink}" />
                <rect x="${cx + 162}" y="${baseY - towerH}" width="18" height="${towerH}" fill="${ink}" />
                <line x1="${cx - 340}" y1="${baseY}" x2="${cx + 340}" y2="${baseY}" stroke="${ink}" stroke-width="6" />
            `;
        }
        case 'mountain': {
            const peaks = [0.55, 0.9, 0.68, 1, 0.5];
            let d = `M ${cx - 400} ${baseY}`;
            peaks.forEach((p, i) => {
                const x = cx - 400 + (i + 1) * (800 / peaks.length);
                d += ` L ${x} ${baseY - 360 * p}`;
            });
            d += ` L ${cx + 400} ${baseY}`;
            return `
                <path d="${d} Z" fill="${accent}" opacity="0.85" />
                <path d="${d}" fill="none" stroke="${ink}" stroke-width="5" />
            `;
        }
        case 'tower': {
            const h = 520;
            return `
                <polygon points="${cx - 60},${baseY} ${cx - 24},${baseY - h} ${cx + 24},${baseY - h} ${cx + 60},${baseY}" fill="${accent}" />
                <polygon points="${cx - 60},${baseY} ${cx - 24},${baseY - h} ${cx + 24},${baseY - h} ${cx + 60},${baseY}" fill="none" stroke="${ink}" stroke-width="4" />
                <line x1="${cx}" y1="${baseY - h}" x2="${cx}" y2="${baseY - h - 70}" stroke="${ink}" stroke-width="5" />
                <line x1="${cx - 400}" y1="${baseY}" x2="${cx + 400}" y2="${baseY}" stroke="${ink}" stroke-width="4" opacity="0.5" />
            `;
        }
        case 'shrine': {
            let gates = '';
            for (let i = 0; i < 4; i++) {
                const y = baseY - i * 90;
                const w = 260 - i * 26;
                gates += `
                    <line x1="${cx - w / 2}" y1="${y}" x2="${cx - w / 2}" y2="${y - 130}" stroke="${accent}" stroke-width="14" />
                    <line x1="${cx + w / 2}" y1="${y}" x2="${cx + w / 2}" y2="${y - 130}" stroke="${accent}" stroke-width="14" />
                    <line x1="${cx - w / 2 - 14}" y1="${y - 130}" x2="${cx + w / 2 + 14}" y2="${y - 130}" stroke="${ink}" stroke-width="10" />
                `;
            }
            return gates;
        }
        case 'dome': {
            return `
                <path d="M ${cx - 260} ${baseY} A 260 260 0 0 1 ${cx + 260} ${baseY}" fill="${accent}" />
                <path d="M ${cx - 260} ${baseY} A 260 260 0 0 1 ${cx + 260} ${baseY}" fill="none" stroke="${ink}" stroke-width="5" />
                <line x1="${cx - 300}" y1="${baseY}" x2="${cx + 300}" y2="${baseY}" stroke="${ink}" stroke-width="6" />
            `;
        }
        case 'canal': {
            let d = `M ${cx - 420} ${baseY}`;
            for (let i = 1; i <= 6; i++) {
                d += ` Q ${cx - 420 + i * 140 - 70} ${baseY + (i % 2 === 0 ? 40 : -40)} ${cx - 420 + i * 140} ${baseY}`;
            }
            return `
                <path d="${d}" fill="none" stroke="${accent}" stroke-width="10" />
                <rect x="${cx - 380}" y="${baseY - 220}" width="140" height="220" fill="${ink}" opacity="0.7" />
                <rect x="${cx - 200}" y="${baseY - 300}" width="120" height="300" fill="${ink}" opacity="0.55" />
                <rect x="${cx + 60}" y="${baseY - 260}" width="150" height="260" fill="${ink}" opacity="0.65" />
            `;
        }
        case 'pyramid': {
            return `
                <polygon points="${cx - 280},${baseY} ${cx},${baseY - 380} ${cx + 280},${baseY}" fill="${accent}" />
                <polygon points="${cx - 280},${baseY} ${cx},${baseY - 380} ${cx + 280},${baseY}" fill="none" stroke="${ink}" stroke-width="5" />
                <polygon points="${cx + 320},${baseY} ${cx + 420},${baseY - 160} ${cx + 520},${baseY}" fill="${accent}" opacity="0.7" />
            `;
        }
        case 'cliff': {
            let d = `M ${cx - 420} ${baseY}`;
            for (let i = 0; i < 6; i++) {
                const x = cx - 420 + i * 140 + rand() * 30;
                const y = baseY - 60 - rand() * 220;
                d += ` L ${x} ${y}`;
            }
            d += ` L ${cx + 420} ${baseY} Z`;
            return `<path d="${d}" fill="${accent}" opacity="0.85" /><path d="${d}" fill="none" stroke="${ink}" stroke-width="4" />`;
        }
        case 'skyline': {
            let bars = '';
            let x = cx - 420;
            while (x < cx + 420) {
                const w = 60 + rand() * 60;
                const h = 160 + rand() * 320;
                bars += `<rect x="${x}" y="${baseY - h}" width="${w - 8}" height="${h}" fill="${ink}" opacity="${0.5 + rand() * 0.3}" />`;
                x += w;
            }
            return bars;
        }
        case 'statue': {
            return `
                <rect x="${cx - 14}" y="${baseY - 340}" width="28" height="240" fill="${ink}" />
                <line x1="${cx - 14}" y1="${baseY - 300}" x2="${cx - 180}" y2="${baseY - 220}" stroke="${ink}" stroke-width="16" stroke-linecap="round" />
                <line x1="${cx + 14}" y1="${baseY - 300}" x2="${cx + 180}" y2="${baseY - 220}" stroke="${ink}" stroke-width="16" stroke-linecap="round" />
                <circle cx="${cx}" cy="${baseY - 370}" r="30" fill="${ink}" />
                <path d="M ${cx - 260} ${baseY} Q ${cx} ${baseY - 90} ${cx + 260} ${baseY}" fill="${accent}" opacity="0.6" />
            `;
        }
        case 'plaza': {
            let tiles = '';
            for (let i = -3; i <= 3; i++) {
                tiles += `<line x1="${cx + i * 90}" y1="${baseY - 260}" x2="${cx + i * 90 + 160}" y2="${baseY}" stroke="${accent}" stroke-width="3" opacity="0.5" />`;
            }
            return `${tiles}<line x1="${cx - 420}" y1="${baseY}" x2="${cx + 420}" y2="${baseY}" stroke="${ink}" stroke-width="6" />`;
        }
        case 'crossing': {
            let lines = '';
            for (let i = 0; i < 8; i++) {
                const angle = (Math.PI / 8) * i - Math.PI / 2;
                const x2 = cx + Math.cos(angle) * 380;
                const y2 = baseY - 40 + Math.sin(angle) * 260;
                lines += `<line x1="${cx}" y1="${baseY - 40}" x2="${x2}" y2="${y2}" stroke="${accent}" stroke-width="4" opacity="0.55" />`;
            }
            return lines;
        }
        default:
            return '';
    }
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
            <stop offset="100%" stop-color="${dark}" stop-opacity="0.08" />
        </linearGradient>
        <filter id="grain" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="noise" />
            <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.035 0" />
        </filter>
        <pattern id="grainTile" width="64" height="64" patternUnits="userSpaceOnUse">
            <rect width="64" height="64" filter="url(#grain)" />
        </pattern>
    </defs>

    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#wash)" />
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grainTile)" />

    <g>${motif}</g>

    <rect x="40" y="40" width="${WIDTH - 80}" height="${HEIGHT - 80}" fill="none" stroke="${dark}" stroke-width="2" opacity="0.5" />

    <text x="${WIDTH / 2}" y="1148" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="30" letter-spacing="10" fill="${dark}" opacity="0.75">${record.countryEn.toUpperCase()}</text>
    <text x="${WIDTH / 2}" y="1230" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="86" fill="${dark}">${record.cityEn}</text>
    <text x="${WIDTH / 2}" y="1284" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="28" letter-spacing="4" fill="${dark}" opacity="0.85">${record.viewpointEn}</text>

    <text x="${WIDTH / 2}" y="1340" text-anchor="middle" font-family="Georgia, serif" font-size="20" letter-spacing="8" fill="${dark}" opacity="0.55">TRAVELOG</text>
</svg>`;
}
