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

// Nueva interfaz para tipar el configData de la actualización sin 'any'
export interface UpdateProtectedConfig {
    sensitivity: string;
    urgentMonitoring: boolean;
}

// Cambiado de 'any' a 'CreateProtectedPersonRequest'
export async function createProtectedPerson(data: CreateProtectedPersonRequest): Promise<void> {
    const token = localStorage.getItem('vera_token');

    // Mapeo semántico para que coincida con tus enums del backend
    let relacionTraducida = "Familiar";
    if (data.relationshipType === "TRUSTED_CONTACT") relacionTraducida = "Contacto de confianza";
    if (data.relationshipType === "PROFESSIONAL") relacionTraducida = "Profesional";

    let sensibilidadTraducida = "MEDIO";
    if (data.notificationSensitivity === "LOW" || data.notificationSensitivity === "low") sensibilidadTraducida = "BAJO";
    if (data.notificationSensitivity === "HIGH" || data.notificationSensitivity === "high") sensibilidadTraducida = "ALTO";

    const payload = {
        fullName: data.fullName,
        contactNumber: data.phone,
        email: data.email,
        relationship: relacionTraducida,
        sensitivityLevel: sensibilidadTraducida,
        notifyHighRisk: data.highRiskAlertsEnabled,
        receiveAlertSummaries: data.weeklySummaryEnabled
    };

    // Pega al endpoint real que procesa la invitación y emite el evento SSE
    await axios.post('http://localhost:8080/api/v1/trust/invite', payload, {
        headers: { Authorization: `Bearer ${token}` }
    });
}

export async function getProtectedPersons(): Promise<ProtectedPerson[]> {
    const token = localStorage.getItem('vera_token');
    const response = await axios.get<ProtectedPerson[]>(
        "http://localhost:8080/api/v1/trust/protected-people",
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
}

export async function deleteProtectedPerson(id: number): Promise<void> {
    const token = localStorage.getItem('vera_token');
    await axios.delete(`http://localhost:8080/api/v1/trust/protected-people/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
}

// Cambiado de 'any' a 'UpdateProtectedConfig'
export async function updateProtectedPerson(id: number, configData: UpdateProtectedConfig): Promise<void> {
    const token = localStorage.getItem('vera_token');

    let sensibilidadTraducida = "MEDIO";
    if (configData.sensitivity === "low" || configData.sensitivity === "LOW") sensibilidadTraducida = "BAJO";
    if (configData.sensitivity === "high" || configData.sensitivity === "HIGH") sensibilidadTraducida = "ALTO";

    // Enviamos estrictamente las columnas que dejamos vivas en la base de datos
    const payload = {
        sensitivityLevel: sensibilidadTraducida,
        notifyHighRisk: configData.urgentMonitoring // Mapea a notify_high_risk en tu DB
    };

    await axios.patch(`http://localhost:8080/api/v1/trust/protected-people/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
    });
}