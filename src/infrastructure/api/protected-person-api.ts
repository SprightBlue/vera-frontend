import axios from "axios";

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

export async function createProtectedPerson(data: any) {
    const token = localStorage.getItem('vera_token');

    let relacionTraducida = "Familiar";
    if (data.relationshipType === "TRUSTED_CONTACT") relacionTraducida = "Contacto de confianza";
    if (data.relationshipType === "PROFESSIONAL") relacionTraducida = "Profesional";

    let sensibilidadTraducida = "MEDIO";
    if (data.notificationSensitivity === "LOW") sensibilidadTraducida = "BAJO";
    if (data.notificationSensitivity === "HIGH") sensibilidadTraducida = "ALTO";

    const payload = {
        fullName: data.fullName,
        contactNumber: data.phone,
        email: data.email,
        relationship: relacionTraducida,
        sensitivityLevel: sensibilidadTraducida,
        notifyHighRisk: data.highRiskAlertsEnabled,
        receiveAlertSummaries: data.weeklySummaryEnabled
    };

    const response = await axios.post('http://localhost:8080/api/v1/trust/invite', payload, {
        headers: { Authorization: `Bearer ${token}` }
    });

    return response.data;
}

export async function getProtectedPersons() {

    const token = localStorage.getItem('vera_token');

    const response = await axios.get<ProtectedPerson[]>(
        "http://localhost:8080/api/v1/trust/protected-people",
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );

    return response.data;

}


export async function deleteProtectedPerson(id: number) {
    const token = localStorage.getItem('vera_token');
    
    await axios.delete(`http://localhost:8080/api/v1/trust/protected-people/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
}