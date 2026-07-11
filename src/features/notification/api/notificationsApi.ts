import { apiClient } from "@/infrastructure/api/auth.repository.ts";

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
    payload: Record<string, unknown> | null;
    isRead: boolean;
    readAt: string | null;
    createdAt: string;
    isLive?: boolean;
}

export interface PagedResponse<T> {
    content: T[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    isLast: boolean;
}

export async function fetchAllNotifications(page = 0): Promise<PagedResponse<AppNotification>> {
    const response = await apiClient.get(`/api/v1/notifications?page=${page}`);
    return response.data;
}

export async function markAllRead(): Promise<void> {
    await apiClient.patch('/api/v1/notifications/read-all');
}

export async function acceptInvitation(id: string | number): Promise<void> {
    await apiClient.post(`/api/v1/trust/invitations/${id}/accept`);
}

export async function rejectInvitation(id: string | number): Promise<void> {
    await apiClient.post(`/api/v1/trust/invitations/${id}/reject`);
}

export async function deleteNotification(id: string): Promise<void> {
    await apiClient.delete(`/api/v1/notifications/${id}`);
}