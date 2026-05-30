import { apiClient } from "./auth.repository";
import type { AlertDetail } from "../../domain/models/AlertDetail";

export async function getAlerts() {
    const response = await apiClient.get("/alerts");
    return response.data;
}

export async function getAlertDetail(alertId: string): Promise<AlertDetail> {
    const response = await apiClient.get<AlertDetail>(
        `/api/v1/risk-alerts/${alertId}`
    );
    return response.data;
}