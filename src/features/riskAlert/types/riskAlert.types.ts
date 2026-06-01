export type Uuid = string;

export interface RiskAlertResponseDto {
    alertId: Uuid;
    protectedUserName: string;
    messageContent: string;
    source: string;
    riskLevel: string;
    suspiciousPatterns: string;
    createdAt: string;
}

export interface ContactLinkResponseDto {
    link: string;
}
