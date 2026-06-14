const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export interface InvitationPayload { id: number; fullName: string; caregiverName: string; relationship: string; }
export interface AlertPayload { alertId: string; riskLevel: string; protectedUserName: string; }

export type NotificationType =
    | 'ALERT'
    | 'ALERT_SOLVED'
    | 'INVITATION'
    | 'INVITATION_ACCEPTED'
    | 'INVITATION_REJECTED';

export interface AppNotification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    payload: InvitationPayload | AlertPayload;
    isRead: boolean;
    createdAt: string;
}

const getHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('vera_token') || ''}`,
    'Content-Type': 'application/json'
});

export async function fetchAllNotifications(): Promise<AppNotification[]> {
    const res = await fetch(`${API_URL}/api/v1/notifications`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Error al cargar notificaciones');
    const data = await res.json();
    if (data && data.content && Array.isArray(data.content)) {
        return data.content;
    }
    return Array.isArray(data) ? data : [];
}

export async function markAllRead(): Promise<void> {
    await fetch(`${API_URL}/api/v1/notifications/read-all`, { method: 'PATCH', headers: getHeaders() });
}

export async function acceptInvitation(id: number): Promise<void> {
    await fetch(`${API_URL}/api/v1/trust/invitations/${id}/accept`, { method: 'POST', headers: getHeaders() });
}

export async function rejectInvitation(id: number): Promise<void> {
    await fetch(`${API_URL}/api/v1/trust/invitations/${id}/reject`, { method: 'POST', headers: getHeaders() });
}

export async function deleteNotification(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/api/v1/notifications/${id}`, { method: 'DELETE', headers: getHeaders() });
    if (!res.ok) throw new Error('Error al eliminar la notificación');
}