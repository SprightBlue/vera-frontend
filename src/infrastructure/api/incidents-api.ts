import { apiClient } from "./auth.repository";
import type { IncidentDetail, IncidentSummary } from "../../domain/models/Incident";

export interface PagedResponse<T> {
    content: T[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}

export async function createIncident(actionType: string, sharedDataTypes: string[], description?: string): Promise<IncidentDetail> {
    const res = await apiClient.post<IncidentDetail>("/api/v1/incidents", {
        actionType,
        sharedDataTypes,
        description: description ?? null,
    });
    return res.data;
}

export async function getMyIncidents(page = 0, size = 10): Promise<PagedResponse<IncidentSummary>> {
    const res = await apiClient.get<PagedResponse<IncidentSummary>>(
        `/api/v1/incidents?page=${page}&size=${size}`
    );
    return res.data;
}

export async function getIncidentDetail(id: string): Promise<IncidentDetail> {
    const res = await apiClient.get<IncidentDetail>(`/api/v1/incidents/${id}`);
    return res.data;
}

export async function completeStep(incidentId: string, stepKey: string): Promise<IncidentDetail> {
    const res = await apiClient.patch<IncidentDetail>(
        `/api/v1/incidents/${incidentId}/steps/${stepKey}/complete`
    );
    return res.data;
}

export async function getIncidentsByTrustContact(trustContactId: number, page = 0, size = 10): Promise<PagedResponse<IncidentSummary>> {
    const res = await apiClient.get<PagedResponse<IncidentSummary>>(
        `/api/v1/incidents/protected-person/${trustContactId}?page=${page}&size=${size}`
    );
    return res.data;
}