import {apiClient as api} from "@/presentation/api/auth.repository";

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type Role = 'CARER' | 'PROTECTED';

export interface TrustContactResponse {
    id: number;
    createdAt: string;
    oppositeUserId: number;
    oppositeUserFullName: string;
    oppositeUserRole: Role;
    oppositeUserEmail: string;
    oppositeUserPhone: string;
    oppositeUserImage: string | null;
}

export interface AlertsResponse {
    id: string;
    createdAt: string;
    title: string;
    contentSummary: string;
    isResolved: boolean;
    riskLevel: RiskLevel;
    trustContact: TrustContactResponse | null;
}

export interface AlertsDetailResponse {
    id: string;
    createdAt: string;
    title: string;
    source: string;
    contentSummary: string;
    riskType: string;
    riskLevel: RiskLevel;
    riskPercentage: number;
    suspiciousPatterns: string;
    isResolved: boolean;
    resolvedAt: string | null;
    trustContact: TrustContactResponse | null;
}

export interface PagedResponse<T> {
    content: T[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}

export interface AlertFilters {
    resolved?: boolean;
    riskLevel?: RiskLevel;
    search?: string;
    page?: number;
}

export const alertsApi = {
    getAlertsHistory: async (filters: AlertFilters = {}): Promise<PagedResponse<AlertsResponse>> => {
        const cleanParams: Record<string, string | number | boolean> = {};

        if (filters.resolved !== undefined) cleanParams.resolved = filters.resolved;
        if (filters.riskLevel) cleanParams.riskLevel = filters.riskLevel;
        if (filters.search?.trim()) cleanParams.search = filters.search.trim();
        if (filters.page !== undefined) cleanParams.page = filters.page;

        const response = await api.get<PagedResponse<AlertsResponse>>('/api/v1/alerts', {
            params: cleanParams
        });
        return response.data;
    },

    getAlertDetail: async (alertId: string): Promise<AlertsDetailResponse> => {
        const response = await api.get<AlertsDetailResponse>(`/api/v1/alerts/${alertId}`);
        return response.data;
    },

    resolveAlert: async (alertId: string): Promise<void> => {
        await api.patch(`/api/v1/alerts/${alertId}/resolve`);
    },

    deleteAlert: async (alertId: string): Promise<void> => {
        await api.delete(`/api/v1/alerts/${alertId}`);
    }
};