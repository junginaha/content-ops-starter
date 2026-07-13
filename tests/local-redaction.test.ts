import { describe, expect, it } from 'vitest';
import { localSanitize } from '@/lib/ai/local-redaction';

describe('localSanitize — PII redaction', () => {
    it('redacts Korean mobile phone numbers', () => {
        const result = localSanitize('제 번호는 010-1234-5678 이에요, 연락주세요.');
        expect(result.sanitizedText).not.toContain('010-1234-5678');
        expect(result.sanitizedText).toContain('[전화번호 삭제됨]');
        expect(result.detectedIssues.some((i) => i.type === 'phone_number')).toBe(true);
    });

    it('redacts email addresses', () => {
        const result = localSanitize('연락처는 hello.world@example.com 입니다.');
        expect(result.sanitizedText).not.toContain('hello.world@example.com');
        expect(result.detectedIssues.some((i) => i.type === 'email')).toBe(true);
    });

    it('redacts Korean street addresses', () => {
        const result = localSanitize('서울특별시 강남구 테헤란로 123 에서 만나요.');
        expect(result.sanitizedText).not.toContain('테헤란로 123');
        expect(result.detectedIssues.some((i) => i.type === 'address')).toBe(true);
    });

    it('redacts bank account and card numbers', () => {
        const result = localSanitize('계좌번호 123-456-7890123 으로 보내주세요. 카드번호는 1234-5678-9012-3456 입니다.');
        expect(result.sanitizedText).not.toContain('123-456-7890123');
        expect(result.sanitizedText).not.toContain('1234-5678-9012-3456');
        expect(result.detectedIssues.some((i) => i.type === 'account_number')).toBe(true);
    });

    it('flags a doxxing combo when multiple identifying categories co-occur', () => {
        const result = localSanitize('제 이름은 김철수입니다. 전화번호는 010-1111-2222 입니다.');
        expect(result.detectedIssues.some((i) => i.type === 'doxxing_combo')).toBe(true);
        expect(result.riskLevel).toBe('high');
    });

    it('leaves clean, low-risk text effectively unchanged', () => {
        const result = localSanitize('오늘은 날씨가 좋아서 산책을 다녀왔다.');
        expect(result.riskLevel).toBe('low');
        expect(result.detectedIssues.length).toBe(0);
        expect(result.sanitizedText).toBe('오늘은 날씨가 좋아서 산책을 다녀왔다.');
    });
});

describe('localSanitize — profanity, threats, hate speech', () => {
    it('softens profanity', () => {
        const result = localSanitize('진짜 씨발 짜증나서 미치겠다.');
        expect(result.sanitizedText).not.toContain('씨발');
        expect(result.detectedIssues.some((i) => i.type === 'profanity')).toBe(true);
        expect(result.riskLevel).not.toBe('low');
    });

    it('does not mistake the start of a profanity word for a name + honorific ("씨")', () => {
        const result = localSanitize('진짜 씨발 짜증나서 미치겠다.');
        expect(result.detectedIssues.some((i) => i.type === 'name')).toBe(false);
        expect(result.sanitizedText).not.toContain('[이름]');
        expect(result.sanitizedText).not.toContain('발 짜증나');
    });

    it('marks direct death threats as urgent', () => {
        const result = localSanitize('너 진짜 죽여버릴 거야.');
        expect(result.riskLevel).toBe('urgent');
        expect(result.detectedIssues.some((i) => i.type === 'threat')).toBe(true);
        expect(result.sanitizedText).not.toContain('죽여버릴');
    });

    it('flags self-harm signals as urgent and points to crisis help', () => {
        const result = localSanitize('요즘 너무 힘들어서 죽고 싶다는 생각이 든다.');
        expect(result.riskLevel).toBe('urgent');
        expect(result.detectedIssues.some((i) => i.type === 'self_harm')).toBe(true);
        expect(result.recommendedAction).toContain('공식 도움기관');
    });
});

describe('localSanitize — crime accusation risk', () => {
    it('treats an unverified accusation naming an identifiable person as high risk', () => {
        const result = localSanitize('김철수 씨가 나를 성폭행했다.');
        expect(result.detectedIssues.some((i) => i.type === 'unverified_crime_accusation')).toBe(true);
        expect(result.riskLevel).toBe('high');
        // The identifying name must not survive into the stored text.
        expect(result.sanitizedText).not.toContain('김철수');
    });

    it('treats a self-referential disclosure without a named target as sensitive but not an accusation', () => {
        const result = localSanitize('나는 예전에 성폭행을 당한 적이 있다.');
        expect(result.detectedIssues.some((i) => i.type === 'sensitive_disclosure')).toBe(true);
        expect(result.detectedIssues.some((i) => i.type === 'unverified_crime_accusation')).toBe(false);
    });
});

describe('localSanitize — spam and excessive wording', () => {
    it('collapses spam-like repeated characters', () => {
        const result = localSanitize('가가가가가가가가가가가가가가가가가가가가 이건 스팸입니다');
        expect(result.detectedIssues.some((i) => i.type === 'spam')).toBe(true);
    });

    it('trims excessive punctuation while preserving meaning', () => {
        const result = localSanitize('정말 너무 화가 난다!!!!!!!!!');
        expect(result.sanitizedText).not.toContain('!!!!!!!!!');
        expect(result.sanitizedText).toContain('화가 난다');
    });
});
