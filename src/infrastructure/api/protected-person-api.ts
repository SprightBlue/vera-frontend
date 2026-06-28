import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

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
    protectedUserId: number | null;
    fullName: string;
    relationship: string;
    contactNumber: string;
    email: string;
    notifyHighRisk: boolean;
    receiveAlertSummaries?: boolean;
    sensitivityLevel: string;
    status?: string;
    image?: string;
}

export interface UpdateProtectedConfig {
    sensitivity: string;
    urgentMonitoring: boolean;
}

export interface UpdateProtectedInfo {
    fullName: string,
    relationship: string,
    contactNumber: string,
    image: string
}

export async function createProtectedPerson(data: CreateProtectedPersonRequest): Promise<void> {
    const token = localStorage.getItem('vera_token') || sessionStorage.getItem('vera_token');

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

    await axios.post(`${API_BASE_URL}/api/v1/trust/invite`, payload, {
        headers: { Authorization: `Bearer ${token}` }
    });
}

export async function getProtectedPersons(): Promise<ProtectedPerson[]> {
    const token = localStorage.getItem('vera_token') || sessionStorage.getItem('vera_token');
    const response = await axios.get<ProtectedPerson[]>(
        `${API_BASE_URL}/api/v1/trust/protected-people`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
}

export async function deleteProtectedPerson(id: number): Promise<void> {
        const token = localStorage.getItem('vera_token') || sessionStorage.getItem('vera_token');
        await axios.delete(`${API_BASE_URL}/api/v1/trust/protected-people/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
}

export async function updateProtectedPerson(id: number, configData: UpdateProtectedConfig): Promise<void> {
    const token = localStorage.getItem('vera_token') || sessionStorage.getItem('vera_token');

    let sensibilidadTraducida = "MEDIO";
    if (configData.sensitivity === "low" || configData.sensitivity === "LOW") sensibilidadTraducida = "BAJO";
    if (configData.sensitivity === "high" || configData.sensitivity === "HIGH") sensibilidadTraducida = "ALTO";

    const payload = {
        sensitivityLevel: sensibilidadTraducida,
        notifyHighRisk: configData.urgentMonitoring
    };

    await axios.patch(`${API_BASE_URL}/api/v1/trust/protected-people/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
    });
}

export async function getProtectedPersonById(id: number): Promise<ProtectedPerson> {
    const token = localStorage.getItem('vera_token') || sessionStorage.getItem('vera_token');
    const response = await axios.get<ProtectedPerson>(
        `${API_BASE_URL}/api/v1/trust/protected-people/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
}

export async function updateProtectedPersonInfo(id: number, updatedPerson: UpdateProtectedInfo): Promise<ProtectedPerson> {
    const token = localStorage.getItem('vera_token') || sessionStorage.getItem('vera_token');
    const payload = {
        fullName: updatedPerson.fullName,
        relationship: updatedPerson.relationship,
        contactNumber: updatedPerson.contactNumber,
        image: updatedPerson.image
    };

    const response = await axios.patch(`${API_BASE_URL}/api/v1/trust/protected-people/edit-person/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
    });

    return response.data;
}

export async function uploadImage(image: File): Promise<string> {
    const token = localStorage.getItem('vera_token') || sessionStorage.getItem('vera_token');

    const formData = new FormData();
    formData.append("image", image);

    const response = await axios.patch(
        `${API_BASE_URL}/api/v1/files/upload-protected-person-image`,
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            },
            responseType: "text"
        }
    );

    return response.data;
}

export async function getMyCarers() {
    const token = localStorage.getItem('vera_token') || sessionStorage.getItem('vera_token');
    
    const response = await axios.get(`${API_BASE_URL}/api/v1/trust/my-carers`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    
    return response.data;
}