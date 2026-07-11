const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// 1. Interfaces secundarias basadas estrictamente en tus DTOs de Java
export interface AnalysisResponse {
    id: string; // UUID
    createdAt: string; // "Hace 5 minutos"
    title: string;
    contentSummary: string;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface AlertsResponse {
    id: string; // UUID
    createdAt: string; // "Hace 10 minutos"
    title: string;
    contentSummary: string;
    isResolved: boolean;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    protectedFullName?: string; // Solo CARER
    carerFullName?: string;     // Solo PROTECTED
}

export interface ChatSessionResponse {
    id: string; // UUID
    title: string;
    updatedAt: string; // "Hace 2 horas"
}

export interface TrustContactDashboardResponse {
    id: number;
    createdAt: string; // LocalDateTime ISO string
    oppositeUserId: number;
    oppositeUserFullName: string;
    oppositeUserRole: 'CARER' | 'PROTECTED';
    oppositeUserEmail: string;
}

// 2. La interfaz principal que mapea el DashboardResponse de tu Spring Boot
export interface DashboardResponse {
    // Listados exclusivos (vienen como null o se omiten según rol)
    top3Analysis?: AnalysisResponse[];
    top3Alerts?: AlertsResponse[];

    // Contadores de la última semana (coinciden con los nombres en Java)
    analysisCountSince: number;
    alertsCountSince: number;
    resolvedAlertsCountSince: number;

    // Objetos únicos de actividad reciente
    latestUpdatedChat: ChatSessionResponse | null;
    latestTrustContact: TrustContactDashboardResponse | null;
}

// 3. Función de llamada a la API sin cambios en su lógica, pero con el tipado real
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