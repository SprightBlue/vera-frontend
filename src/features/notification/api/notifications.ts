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

export interface InvitationResponse {
    id: number;
    fullName: string;
    caregiverName: string;
    relationship: string;
}

// Discriminador unificado para la bandeja de entrada
export type AppNotification =
    | { type: 'ALERT'; data: RiskAlertResponse }
    | { type: 'INVITATION'; data: InvitationResponse };

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

export async function fetchPendingInvitations(): Promise<InvitationResponse[]> {
    const token = localStorage.getItem('vera_token');
    const response = await fetch(`${API_URL}/api/v1/trust/invitations/pending`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error('Error al cargar invitaciones pendientes');
    return response.json();
}

export async function solveAlert(alertId: string): Promise<void> {
    const token = localStorage.getItem('vera_token');
    const response = await fetch(`${API_URL}/api/v1/risk-alerts/${alertId}/solve`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('No se pudo resolver la alerta');
}

export async function acceptInvitationById(id: number): Promise<void> {
    const token = localStorage.getItem('vera_token');
    const response = await fetch(`${API_URL}/api/v1/trust/invitations/${id}/accept`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('No se pudo aceptar la invitación');
}

export async function rejectInvitationById(id: number): Promise<void> {
    const token = localStorage.getItem('vera_token');
    const response = await fetch(`${API_URL}/api/v1/trust/invitations/${id}/reject`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('No se pudo rechazar la invitación');
}