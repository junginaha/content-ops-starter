import { z } from 'zod';
import { localSanitize } from './local-redaction';
import { maxRisk } from './types';
import type { SanitizeResult, DetectedIssue, RiskLevel, IssueType } from './types';
import { logEvent } from '../logging/logger';

const AI_TIMEOUT_MS = 15_000;

const aiIssueSchema = z.object({
    type: z.string(),
    description: z.string(),
    severity: z.enum(['low', 'medium', 'high', 'urgent'])
});

const aiResponseSchema = z.object({
    sanitizedText: z.string(),
    riskLevel: z.enum(['low', 'medium', 'high', 'urgent']),
    detectedIssues: z.array(aiIssueSchema).default([]),
    explanation: z.string()
});

const KNOWN_ISSUE_TYPES = new Set<IssueType>([
    'phone_number',
    'email',
    'address',
    'account_number',
    'name',
    'institution',
    'doxxing_combo',
    'profanity',
    'hate_speech',
    'sexual_abuse',
    'threat',
    'violence',
    'self_harm',
    'unverified_crime_accusation',
    'sensitive_disclosure',
    'spam',
    'excessive_wording'
]);

function normalizeIssueType(type: string): IssueType {
    return KNOWN_ISSUE_TYPES.has(type as IssueType) ? (type as IssueType) : 'sensitive_disclosure';
}

const SYSTEM_PROMPT = `당신은 개인정보 보호와 안전한 표현을 돕는 콘텐츠 정리 도우미입니다.
사용자가 입력한 한국어 텍스트에서 다음을 찾아 제거하거나 순화하세요:
- 이름, 전화번호, 이메일, 주소, 계좌번호 등 개인 식별 정보
- 소속 학교/직장과 결합된 식별 가능한 세부 정보
- 욕설, 모욕, 혐오 표현, 성적 모욕
- 협박, 폭력, 자해/자살 암시
- 검증되지 않은 범죄 주장(특정 대상 지목)
- 스팸성 반복, 과도한 표현
원문의 의미와 감정은 최대한 보존하면서 위 내용을 정리한 뒤, 반드시 아래 JSON 스키마로만 응답하세요. 다른 텍스트는 출력하지 마세요.
{"sanitizedText": string, "riskLevel": "low"|"medium"|"high"|"urgent", "detectedIssues": [{"type": string, "description": string, "severity": "low"|"medium"|"high"|"urgent"}], "explanation": string}`;

async function callAiProvider(rawText: string): Promise<SanitizeResult | null> {
    const apiKey = process.env.AI_API_KEY;
    const model = process.env.AI_MODEL;
    if (!apiKey || !model) return null;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model,
                max_tokens: 2048,
                system: SYSTEM_PROMPT,
                messages: [{ role: 'user', content: rawText }]
            }),
            signal: controller.signal
        });

        if (!response.ok) {
            logEvent('ai_provider_error', { status: response.status });
            return null;
        }

        const payload = (await response.json()) as { content?: Array<{ type: string; text?: string }> };
        const textBlock = payload.content?.find((block) => block.type === 'text')?.text;
        if (!textBlock) return null;

        const jsonMatch = textBlock.match(/\{[\s\S]*\}/);
        if (!jsonMatch) return null;

        const parsed = aiResponseSchema.parse(JSON.parse(jsonMatch[0]));

        const detectedIssues: DetectedIssue[] = parsed.detectedIssues.map((issue) => ({
            type: normalizeIssueType(issue.type),
            description: issue.description,
            severity: issue.severity
        }));

        return {
            sanitizedText: parsed.sanitizedText,
            riskLevel: parsed.riskLevel,
            detectedIssues,
            explanation: parsed.explanation,
            recommendedAction: recommendedActionFor(parsed.riskLevel),
            source: 'ai'
        };
    } catch (error) {
        logEvent('ai_provider_exception', { message: error instanceof Error ? error.name : 'unknown' });
        return null;
    } finally {
        clearTimeout(timeout);
    }
}

function recommendedActionFor(risk: RiskLevel): string {
    switch (risk) {
        case 'urgent':
            return '지금 상태로는 전달할 수 없습니다. 자신이나 타인에게 위험이 될 수 있는 내용이 포함되어 있어요. 공식 도움기관 정보를 꼭 확인해 주세요.';
        case 'high':
            return '민감한 정보나 표현이 포함되어 있습니다. 공개 검토 신청을 통해 검토받는 것을 권장합니다.';
        case 'medium':
            return '표현을 다듬었습니다. 최종 문장을 확인한 뒤 전달하세요.';
        default:
            return '안전하게 정리되었습니다. 이대로 전달해도 좋습니다.';
    }
}

/**
 * Produces a safety-rewritten version of raw user text. Tries the configured AI provider first,
 * then always runs the deterministic local engine as a defense-in-depth pass over the AI's own
 * output so obvious PII patterns can never survive an AI miss. Falls back entirely to the local
 * engine when no AI provider is configured or the call fails.
 */
export async function sanitizeText(rawText: string): Promise<SanitizeResult> {
    const aiResult = await callAiProvider(rawText);

    if (!aiResult) {
        return localSanitize(rawText);
    }

    const guardPass = localSanitize(aiResult.sanitizedText);

    const mergedIssueTypes = new Set(aiResult.detectedIssues.map((i) => i.type));
    const combinedIssues: DetectedIssue[] = [...aiResult.detectedIssues];
    for (const issue of guardPass.detectedIssues) {
        if (!mergedIssueTypes.has(issue.type)) {
            combinedIssues.push(issue);
        }
    }

    const finalRisk = maxRisk(aiResult.riskLevel, guardPass.riskLevel);

    return {
        sanitizedText: guardPass.sanitizedText,
        riskLevel: finalRisk,
        detectedIssues: combinedIssues,
        explanation: aiResult.explanation,
        recommendedAction: recommendedActionFor(finalRisk),
        source: 'ai'
    };
}
