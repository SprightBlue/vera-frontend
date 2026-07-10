// src/features/dashboard/api/dashboardApi.ts
import { type AlertsResponse } from '@/features/alerts/api/alertsApi.ts';
import { type AnalysisResponse } from '@/features/analysis/api/analysisApi.ts';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export interface UserLocationResponse {
    id: string;
    protectedFullName: string;
    locationText: string;
    isConnected: boolean;
    updatedAt: string;
}

export interface DashboardResponse {
    hasProtectedPersons?: boolean;
    top3Analysis?: AnalysisResponse[];
    analysisInLast24Hours?: number;
    top3ResolvedAlerts?: AlertsResponse[];
    resolvedAlertsInLast24Hours?: number;

    top3Alerts?: AlertsResponse[];
    alertsInLast24Hours?: number;
    top3ConnectedUsers?: UserLocationResponse[];
    connectedUsersCount?: number;
}

export async function getDashboardData(): Promise<DashboardResponse> {
    const token = localStorage.getItem('vera_token') || sessionStorage.getItem('vera_token');

    const response = await fetch(`${API_BASE_URL}/api/dashboard`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error(`Error en la petición: ${response.statusText}`);
    }

    return response.json();
}