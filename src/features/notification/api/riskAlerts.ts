const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export interface RiskAlertResponse {
    alertId: string;
    protectedUserName: string;
    protectedUserEmail: string;
    messageContent: string;
    source: string;
    riskLevel: string;
    suspiciousPatterns: string;
    createdAt: string;
}

export async function fetchActiveAlerts(): Promise<RiskAlertResponse[]> {
    const token = localStorage.getItem('vera_token');
    const response = await fetch(`${API_URL}/api/v1/risk-alerts/active`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error('Error al cargar alertas');
    return response.json();
}

export async function solveAlert(alertId: string): Promise<void> {
    const token = localStorage.getItem('vera_token');
    const response = await fetch(`${API_URL}/api/v1/risk-alerts/${alertId}/solve`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error('No se pudo resolver la alerta');
}