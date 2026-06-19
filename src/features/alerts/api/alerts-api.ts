import { apiClient } from "../../../infrastructure/api/auth.repository.ts";

export interface AlertSummary {
    id: string;
    createdAt: string;
    protectedFullName: string | null;
    title: string;
    contentSummary: string;
    isResolved: boolean;
}

export interface AlertDetail {
    id: string;
    createdAt: string;
    protectedFullName: string | null;
    title: string;
    source: string | null;
    contentSummary: string;
    riskType: string | null;
    riskLevel: string | null;
    riskPercentage: number;
    suspiciousPatterns: string;
    isResolved: boolean;
    resolvedAt: string | null;
}

export interface PagedAlerts {
    content: AlertSummary[];
    totalPages: number;
    totalElements: number;
}

export async function getAlerts(page: number = 0, resolved?: boolean) {
    const params = new URLSearchParams({ page: page.toString() });
    if (resolved !== undefined) params.append('resolved', resolved.toString());

    const response = await apiClient.get<PagedAlerts>(`/api/v1/alerts?${params.toString()}`);
    return response.data;
}

export async function getAlertDetail(alertId: string): Promise<AlertDetail> {
    const response = await apiClient.get<AlertDetail>(`/api/v1/alerts/${alertId}`);
    return response.data;
}

export async function resolveAlert(alertId: string) {
    await apiClient.patch(`/api/v1/alerts/${alertId}/resolve`);
}

export async function deleteAlert(alertId: string) {
    await apiClient.delete(`/api/v1/alerts/${alertId}`);
}