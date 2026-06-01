export type Uuid = string;

export type RiskLevel = 'UNDEFINED' | 'LOW' | 'MEDIUM' | 'HIGH';

export interface AnalyzeRequestDto {
  userId: number;
  content: string;
  source: string;
}

export interface AnalysisResultDto {
  id: Uuid;
  riskLevel: RiskLevel;
  suspiciousPatterns: string;
  recommendation: string;
  createdAt: string;
}
