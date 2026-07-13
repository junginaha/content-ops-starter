export type RiskLevel = 'low' | 'medium' | 'high' | 'urgent';

export type IssueType =
    | 'phone_number'
    | 'email'
    | 'address'
    | 'account_number'
    | 'name'
    | 'institution'
    | 'doxxing_combo'
    | 'profanity'
    | 'hate_speech'
    | 'sexual_abuse'
    | 'threat'
    | 'violence'
    | 'self_harm'
    | 'unverified_crime_accusation'
    | 'sensitive_disclosure'
    | 'spam'
    | 'excessive_wording';

export interface DetectedIssue {
    type: IssueType;
    description: string;
    severity: RiskLevel;
}

export interface SanitizeResult {
    sanitizedText: string;
    riskLevel: RiskLevel;
    detectedIssues: DetectedIssue[];
    explanation: string;
    recommendedAction: string;
    source: 'ai' | 'local_fallback';
}

export const RISK_ORDER: Record<RiskLevel, number> = { low: 0, medium: 1, high: 2, urgent: 3 };

export function maxRisk(a: RiskLevel, b: RiskLevel): RiskLevel {
    return RISK_ORDER[a] >= RISK_ORDER[b] ? a : b;
}
