import { apiClient as api } from "@/infrastructure/api/auth.repository.ts";

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface AlertsResponse {
    id: string;
    createdAt: string;
    protectedFullName: string | null;
    title: string;
    contentSummary: string;
    isResolved: boolean;
    riskLevel: RiskLevel;
}

export interface AlertsDetailResponse {
    id: string;
    createdAt: string;
    protectedFullName: string | null;
    title: string;
    source: string | null;
    contentSummary: string;
    riskType: string | null;
    riskLevel: RiskLevel;
    riskPercentage: number;
    suspiciousPatterns: string;
    isResolved: boolean;
    resolvedAt: string | null;
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