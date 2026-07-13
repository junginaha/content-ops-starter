import type { DetectedIssue, IssueType, RiskLevel, SanitizeResult } from './types';
import { maxRisk } from './types';

const ISSUE_LABELS_KO: Record<IssueType, string> = {
    phone_number: '전화번호',
    email: '이메일',
    address: '주소',
    account_number: '계좌·카드번호',
    name: '이름',
    institution: '소속(학교·직장)',
    doxxing_combo: '개인 식별 정보 조합',
    profanity: '욕설·비속어',
    hate_speech: '혐오 표현',
    sexual_abuse: '성적 모욕 표현',
    threat: '협박성 표현',
    violence: '폭력적 표현',
    self_harm: '자해·자살 위험 신호',
    unverified_crime_accusation: '검증되지 않은 범죄 주장',
    sensitive_disclosure: '민감한 개인 경험',
    spam: '반복·스팸성 표현',
    excessive_wording: '과도한 표현'
};

const RECOMMENDED_ACTION: Record<RiskLevel, string> = {
    low: '안전하게 정리되었습니다. 이대로 전달해도 좋습니다.',
    medium: '표현을 다듬었습니다. 최종 문장을 확인한 뒤 전달하세요.',
    high: '민감한 정보나 표현이 포함되어 있습니다. 공개 검토 신청을 통해 검토받는 것을 권장합니다.',
    urgent: '지금 상태로는 전달할 수 없습니다. 자신이나 타인에게 위험이 될 수 있는 내용이 포함되어 있어요. 공식 도움기관 정보를 꼭 확인해 주세요.'
};

// Common Korean phone number formats (mobile, Seoul/regional landline, toll-free).
const PHONE_RE = /(01[016789]|02|0[3-6]\d)[-.\s]?\d{3,4}[-.\s]?\d{4}\b/g;
const INTL_PHONE_RE = /\+\d{1,3}[-.\s]?\d{1,4}[-.\s]?\d{3,4}[-.\s]?\d{4}\b/g;
const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const ADDRESS_RE =
    /[가-힣]{2,8}(특별시|광역시|특별자치시|특별자치도|도)?\s?[가-힣0-9]{2,10}(시|군|구)\s?[가-힣0-9]{2,10}(동|읍|면|로|길)\s?\d{1,4}(-\d{1,4})?(번지|호)?/g;
const DONG_HO_RE = /\d{1,4}\s?동\s?\d{1,4}\s?호/g;
const ACCOUNT_KEYWORD_RE = /(계좌번호|계좌|카드번호)\s*[:\-]?\s*\d[\d\- ]{8,18}\d/g;
const ACCOUNT_BARE_RE = /\b\d{2,6}-\d{2,6}-\d{2,8}\b/g;
const CARD_RE = /\b\d{4}[- ]\d{4}[- ]\d{4}[- ]\d{2,4}\b/g;
const NAME_KEYWORD_RE = /(이름은|성함은|제\s?이름은|저는)\s?([가-힣]{2,4})(입니다|이에요|예요|이야|라고 해|라고 합니다)/g;
// Korean honorific particles frequently attach directly to "씨"/"님" with no space (e.g. "씨가",
// "님은"). The trailing lookahead accepts a real word boundary OR one of these particles followed
// by a boundary, but rejects other attached syllables — which is what keeps "씨발" (profanity)
// from being misread as "OO 씨" + "발".
const HONORIFIC_PARTICLES = '가|는|은|를|와|과|도|만|에게|한테|랑|의|께|께서';
const NAME_HONORIFIC_RE = new RegExp(
    `([가-힣]{2,4})\\s?(씨|님|선생님|사장님|팀장님|과장님|대표님|교수님)(?=$|[^가-힣]|(?:${HONORIFIC_PARTICLES})(?:$|[^가-힣]))`,
    'g'
);
const INSTITUTION_RE = /[가-힣A-Za-z0-9]{2,12}(초등학교|중학교|고등학교|대학교|대학원|주식회사|㈜|병원|법인)/g;
const INSTITUTION_CONTEXT_RE = /(다니는|재직 ?중인|다녔던|근무하는|근무했던|졸업한)/;

const PROFANITY_WORDS = [
    '씨발',
    '시발',
    '개새끼',
    '개새기',
    '병신',
    '지랄',
    '미친놈',
    '미친년',
    '좆같',
    '좆까',
    '닥쳐',
    '꺼져',
    '개년',
    '썅',
    '개소리',
    '쓰레기같은',
    '느금',
    '창녀',
    '걸레같은'
];

const HATE_WORDS = ['장애인 주제에', '틀딱', '한남충', '김치녀', '벌레만도 못한', '난민충', '결혼이주여성 주제에'];

const SEXUAL_ABUSE_INSULT_WORDS = ['걸레', '창년', '보지', '자지', '섹스하자', '몸 팔'];

const THREAT_WORDS = ['죽여버', '죽인다', '죽여버릴', '죽여 버릴', '때려죽인다', '가만 안 둔다', '가만두지 않겠다', '칼로 찌', '불질러', '폭탄 설치'];

const VIOLENCE_WORDS = ['패버리겠다', '두들겨 패', '폭행하겠다', '보복하겠다'];

const SELF_HARM_WORDS = ['자살하고 싶', '죽고 싶', '죽고싶', '자해하고 싶', '자해할', '더 살고 싶지 않', '목숨을 끊'];

const CRIME_WORDS = ['성폭행', '강간', '성추행', '불법촬영', '몰카', '스토킹', '사기쳤', '횡령했', '아동학대', '폭행했', '살해했'];

function collapseExcessiveWording(input: string): { text: string; matched: boolean } {
    let text = input;
    let matched = false;

    const punctuationRun = /([!?~.,])\1{2,}/g;
    if (punctuationRun.test(text)) {
        matched = true;
        text = text.replace(punctuationRun, (_m: string, ch: string) => (ch === '.' ? '...' : ch.repeat(2)));
    }

    const laughCryRun = /([ㅋㅎㅠㅜ])\1{5,}/g;
    if (laughCryRun.test(text)) {
        matched = true;
        text = text.replace(laughCryRun, (_m: string, ch: string) => ch.repeat(3));
    }

    const repeatedWordRun = /\b(\S{1,10})(\s+\1){3,}\b/g;
    if (repeatedWordRun.test(text)) {
        matched = true;
        text = text.replace(repeatedWordRun, (_m: string, word: string) => `${word} ${word}`);
    }

    text = text.replace(/[ \t]{3,}/g, '  ').replace(/\n{4,}/g, '\n\n\n');

    return { text, matched };
}

function detectSpam(input: string): boolean {
    const charRun = /(.)\1{9,}/;
    if (charRun.test(input)) return true;

    const trimmed = input.trim();
    if (trimmed.length >= 20) {
        const chunk = trimmed.slice(0, Math.floor(trimmed.length / 3));
        if (chunk.length >= 4) {
            const repeated = chunk.repeat(3);
            if (trimmed.startsWith(repeated.slice(0, trimmed.length))) return true;
        }
    }
    return false;
}

interface MaskOptions {
    severity: RiskLevel;
    label: string;
}

function maskAll(text: string, regex: RegExp, replacement: string): { text: string; count: number } {
    let count = 0;
    const result = text.replace(regex, () => {
        count += 1;
        return replacement;
    });
    return { text: result, count };
}

function addIssue(issues: DetectedIssue[], type: IssueType, opts: MaskOptions, count: number) {
    if (count <= 0) return;
    issues.push({
        type,
        severity: opts.severity,
        description: `${opts.label}${count > 1 ? ` ${count}건` : ''}을(를) 정리했습니다.`
    });
}

export function localSanitize(rawText: string): SanitizeResult {
    let text = rawText;
    const issues: DetectedIssue[] = [];

    const spammy = detectSpam(text);
    if (spammy) {
        text = text.replace(/(.)\1{9,}/g, (_m: string, ch: string) => ch.repeat(3));
        issues.push({ type: 'spam', severity: 'medium', description: '반복되거나 스팸성으로 보이는 표현을 정리했습니다.' });
    }

    const excessive = collapseExcessiveWording(text);
    text = excessive.text;
    if (excessive.matched) {
        issues.push({ type: 'excessive_wording', severity: 'low', description: '과도하게 반복된 문장부호·표현을 다듬었습니다.' });
    }

    let m: ReturnType<typeof maskAll>;

    // Phone numbers are masked before generic account/card patterns: a bare Korean mobile number
    // like 010-1234-5678 also matches the loose "digits-digits-digits" account shape, so whichever
    // pattern runs first wins. Phone numbers are the more specific, more common case.
    m = maskAll(text, PHONE_RE, '[전화번호 삭제됨]');
    text = m.text;
    let phoneCount = m.count;
    m = maskAll(text, INTL_PHONE_RE, '[전화번호 삭제됨]');
    text = m.text;
    phoneCount += m.count;
    addIssue(issues, 'phone_number', { severity: 'medium', label: '전화번호' }, phoneCount);

    m = maskAll(text, ACCOUNT_KEYWORD_RE, '[계좌정보 삭제됨]');
    text = m.text;
    let accountCount = m.count;
    m = maskAll(text, CARD_RE, '[카드번호 삭제됨]');
    text = m.text;
    accountCount += m.count;
    m = maskAll(text, ACCOUNT_BARE_RE, '[계좌정보 삭제됨]');
    text = m.text;
    accountCount += m.count;
    addIssue(issues, 'account_number', { severity: 'medium', label: '계좌·카드번호' }, accountCount);

    m = maskAll(text, EMAIL_RE, '[이메일 삭제됨]');
    text = m.text;
    addIssue(issues, 'email', { severity: 'medium', label: '이메일 주소' }, m.count);

    m = maskAll(text, ADDRESS_RE, '[주소 삭제됨]');
    text = m.text;
    let addressCount = m.count;
    m = maskAll(text, DONG_HO_RE, '[상세주소 삭제됨]');
    text = m.text;
    addressCount += m.count;
    addIssue(issues, 'address', { severity: 'medium', label: '주소' }, addressCount);

    const institutionMentioned = INSTITUTION_RE.test(text);
    INSTITUTION_RE.lastIndex = 0;
    const institutionContextual = institutionMentioned && INSTITUTION_CONTEXT_RE.test(text);
    m = maskAll(text, INSTITUTION_RE, '[소속 삭제됨]');
    text = m.text;
    addIssue(issues, 'institution', { severity: institutionContextual ? 'high' : 'medium', label: '학교·직장 등 소속 정보' }, m.count);

    const nameMatches = countMatches(text, NAME_KEYWORD_RE) + countMatches(text, NAME_HONORIFIC_RE);
    text = text.replace(NAME_KEYWORD_RE, '$1 [이름]$3');
    text = text.replace(NAME_HONORIFIC_RE, '[이름] $2');
    addIssue(issues, 'name', { severity: 'medium', label: '이름' }, nameMatches);

    const identifyingCategories = issues.filter((i) => ['phone_number', 'email', 'address', 'account_number', 'name', 'institution'].includes(i.type));
    if (identifyingCategories.length >= 2) {
        issues.push({
            type: 'doxxing_combo',
            severity: 'high',
            description: '개인을 특정할 수 있는 정보가 여러 개 함께 발견되어 신원 노출 위험이 높습니다.'
        });
    }

    let profanityCount = 0;
    for (const word of PROFANITY_WORDS) {
        const re = new RegExp(escapeRegExp(word), 'g');
        const before = text;
        text = text.replace(re, '[강한 표현]');
        if (text !== before) profanityCount += before.match(re)?.length ?? 0;
    }
    addIssue(issues, 'profanity', { severity: 'medium', label: '욕설·비속어' }, profanityCount);

    let hateCount = 0;
    for (const word of HATE_WORDS) {
        const re = new RegExp(escapeRegExp(word), 'g');
        const before = text;
        text = text.replace(re, '[차별적 표현 삭제됨]');
        if (text !== before) hateCount += 1;
    }
    addIssue(issues, 'hate_speech', { severity: 'high', label: '혐오 표현' }, hateCount);

    let sexualCount = 0;
    for (const word of SEXUAL_ABUSE_INSULT_WORDS) {
        const re = new RegExp(escapeRegExp(word), 'g');
        const before = text;
        text = text.replace(re, '[성적 모욕 표현 삭제됨]');
        if (text !== before) sexualCount += 1;
    }
    addIssue(issues, 'sexual_abuse', { severity: 'high', label: '성적 모욕 표현' }, sexualCount);

    let threatCount = 0;
    for (const word of THREAT_WORDS) {
        const re = new RegExp(escapeRegExp(word), 'g');
        const before = text;
        text = text.replace(re, '[위협적 표현 삭제됨]');
        if (text !== before) threatCount += 1;
    }
    const hasDirectThreat = threatCount > 0;
    addIssue(issues, 'threat', { severity: hasDirectThreat ? 'urgent' : 'high', label: '협박성 표현' }, threatCount);

    let violenceCount = 0;
    for (const word of VIOLENCE_WORDS) {
        const re = new RegExp(escapeRegExp(word), 'g');
        const before = text;
        text = text.replace(re, '[폭력적 표현 삭제됨]');
        if (text !== before) violenceCount += 1;
    }
    addIssue(issues, 'violence', { severity: 'high', label: '폭력적 표현' }, violenceCount);

    let selfHarmCount = 0;
    for (const phrase of SELF_HARM_WORDS) {
        if (text.includes(phrase)) selfHarmCount += 1;
    }
    if (selfHarmCount > 0) {
        issues.push({
            type: 'self_harm',
            severity: 'urgent',
            description: '자신을 해치려는 위험 신호가 감지되었습니다. 공식 도움기관 정보를 안내합니다.'
        });
    }

    let crimeCount = 0;
    for (const phrase of CRIME_WORDS) {
        if (text.includes(phrase)) crimeCount += 1;
    }
    if (crimeCount > 0) {
        const hasIdentifiableTarget = identifyingCategories.some((i) => i.type === 'name' || i.type === 'institution');
        if (hasIdentifiableTarget) {
            issues.push({
                type: 'unverified_crime_accusation',
                severity: 'high',
                description: '검증되지 않은 범죄 관련 주장이 특정 대상과 함께 발견되었습니다. 명예훼손 위험을 낮추기 위해 신원 정보를 정리했습니다.'
            });
        } else {
            issues.push({
                type: 'sensitive_disclosure',
                severity: 'medium',
                description: '민감한 개인적 경험이 포함되어 있습니다. 필요한 경우 공식 도움기관에 상담하실 수 있습니다.'
            });
        }
    }

    let riskLevel: RiskLevel = 'low';
    for (const issue of issues) {
        riskLevel = maxRisk(riskLevel, issue.severity);
    }

    const labels = Array.from(new Set(issues.map((i) => ISSUE_LABELS_KO[i.type])));
    const explanation =
        labels.length > 0
            ? `${labels.join(', ')} 관련 내용을 확인하여 안전하게 정리했습니다.`
            : '특별히 위험한 표현이 발견되지 않았습니다. 원문의 의미와 감정을 그대로 유지했습니다.';

    return {
        sanitizedText: text.trim(),
        riskLevel,
        detectedIssues: issues,
        explanation,
        recommendedAction: RECOMMENDED_ACTION[riskLevel],
        source: 'local_fallback'
    };
}

function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function countMatches(text: string, regex: RegExp): number {
    const re = new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : `${regex.flags}g`);
    return (text.match(re) ?? []).length;
}
