import api from "./api";

export interface CreateProtectedPersonRequest {

    fullName: string;

    relationshipType: string;

    phone: string;

    email: string;

    highRiskAlertsEnabled: boolean;

    weeklySummaryEnabled: boolean;

    notificationSensitivity: string;

}

export interface ProtectedPerson {

    id: number;

    fullName: string;

    relationshipType: string;

    phone: string;

    email: string;

    highRiskAlertsEnabled: boolean;

    weeklySummaryEnabled: boolean;

    notificationSensitivity: string;

}

export async function createProtectedPerson(
    data: CreateProtectedPersonRequest
) {

    await api.post(
        "/protected-persons",
        data
    );

}

export async function getProtectedPersons() {

    const response = await api.get<ProtectedPerson[]>(
        "/protected-persons"
    );

    return response.data;

}