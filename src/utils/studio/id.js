export function makeId(prefix = 'id') {
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function hashString(input) {
    let hash = 0;
    const str = String(input || '');
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

export function pick(list, seed, offset = 0) {
    if (!list || list.length === 0) return '';
    return list[(seed + offset) % list.length];
}
