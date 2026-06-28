import { apiClient } from "../../../infrastructure/api/auth.repository";

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

export async function fetchAllNotifications(): Promise<AppNotification[]> {
    const response = await apiClient.get('/api/v1/notifications');
    const data = response.data;

    if (data && data.content && Array.isArray(data.content)) {
        return data.content;
    }
    return Array.isArray(data) ? data : [];
}

export async function markAllRead(): Promise<void> {
    await apiClient.patch('/api/v1/notifications/read-all');
}

export async function acceptInvitation(id: number): Promise<void> {
    await apiClient.post(`/api/v1/trust/invitations/${id}/accept`);
}

export async function rejectInvitation(id: number): Promise<void> {
    await apiClient.post(`/api/v1/trust/invitations/${id}/reject`);
}

export async function deleteNotification(id: string): Promise<void> {
    await apiClient.delete(`/api/v1/notifications/${id}`);
}