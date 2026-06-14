import { useState, useEffect, useCallback } from "react";
import {
    fetchAllNotifications,
    acceptInvitation,
    rejectInvitation,
    deleteNotification,
    markAllRead,
    type AppNotification,
    type InvitationPayload
} from "../api/notifications";

export function useNotifications() {
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [isRinging, setIsRinging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const triggerBell = useCallback(() => {
        setIsRinging(true);
        setTimeout(() => setIsRinging(false), 2000);
    }, []);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const data = await fetchAllNotifications();
                setNotifications(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error al sincronizar notificaciones:", error);
                setNotifications([]);
            }
        };

        void loadInitialData();

        const token = localStorage.getItem('vera_token');
        if (!token) return;

        const eventSource = new EventSource(`${import.meta.env.VITE_API_URL}/api/v1/notifications/stream?token=${token}`);

        eventSource.addEventListener("NEW_NOTIFICATION", (e: MessageEvent) => {
            const data: AppNotification = JSON.parse(e.data);
            setNotifications(prev => [data, ...(Array.isArray(prev) ? prev : [])]);
            triggerBell();
        });

        eventSource.addEventListener("NOTIFICATION_DELETED", (e: MessageEvent) => {
            const { id } = JSON.parse(e.data);
            setNotifications(prev => (Array.isArray(prev) ? prev.filter(n => n.id !== id) : []));
        });

        return () => eventSource.close();
    }, [triggerBell]);

    const handleMarkAllRead = async () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        try {
            await markAllRead();
        } catch (error) {
            console.error("Error al marcar como leídas:", error);
        }
    };

    const handleAction = async (notif: AppNotification, action: 'ACCEPT' | 'REJECT' | 'DELETE') => {
        if (isProcessing) return;
        setIsProcessing(true);

        try {
            if (action === 'DELETE') {
                await deleteNotification(notif.id);
                setNotifications(prev => (Array.isArray(prev) ? prev.filter(n => n.id !== notif.id) : []));
            } else if (notif.type === 'INVITATION') {
                const p = notif.payload as InvitationPayload;
                if (action === 'ACCEPT') {
                    await acceptInvitation(p.id);
                } else if (action === 'REJECT') {
                    await rejectInvitation(p.id);
                }
                setNotifications(prev =>
                    Array.isArray(prev)
                        ? prev.map(n => n.id === notif.id ? { ...n, type: action === 'ACCEPT' ? 'INVITATION_ACCEPTED' : 'INVITATION_REJECTED', isRead: true } : n)
                        : []
                );
            }
        } catch (e) {
            console.error("Error ejecutando acción:", e);
        } finally {
            setIsProcessing(false);
        }
    };

    return {
        notifications: Array.isArray(notifications) ? notifications : [],
        unreadCount: (Array.isArray(notifications) ? notifications : []).filter(n => !n.isRead).length,
        isRinging,
        isProcessing,
        handleMarkAllRead,
        handleAction
    };
}