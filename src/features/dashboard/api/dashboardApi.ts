import {apiClient} from "@/presentation/api/auth.repository";

export interface AnalysisResponse {
    id: string;
    createdAt: string;
    title: string;
    contentSummary: string;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface AlertsResponse {
    id: string;
    createdAt: string;
    title: string;
    contentSummary: string;
    isResolved: boolean;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    trustContact: TrustContactResponse | null;
}

export interface ChatSessionResponse {
    id: string;
    title: string;
    updatedAt: string;
}

export interface TrustContactResponse {
    id: number;
    createdAt: string;
    oppositeUserId: number;
    oppositeUserFullName: string;
    oppositeUserRole: 'CARER' | 'PROTECTED';
    oppositeUserEmail: string;
    oppositeUserPhone: string;
    oppositeUserImage?: string;
}

export interface DashboardResponse {
    top3Analysis?: AnalysisResponse[];
    top3Alerts?: AlertsResponse[];

    analysisCountSince: number;
    alertsCountSince: number;
    resolvedAlertsCountSince: number;

    latestUpdatedChat: ChatSessionResponse | null;
    latestTrustContact: TrustContactResponse | null;
}

export async function getDashboardData(): Promise<DashboardResponse> {
    const response = await apiClient.get<DashboardResponse>('/api/dashboard');
    return response.data;
}