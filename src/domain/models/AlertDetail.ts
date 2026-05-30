export interface AlertDetail {
    alertId: string;
    analysisId: string;
    messageContent: string;
    messageSource: string;
    riskLevel: "LOW" | "MEDIUM" | "HIGH" | "UNDEFINED";
    riskLevelDisplayName: string;
    suspiciousPatterns: string;
    recommendation: string;
    received: boolean;
    createdAt: string;
}