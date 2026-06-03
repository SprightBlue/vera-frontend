import { useState, useEffect, useCallback } from "react";
import {
    fetchActiveAlerts,
    fetchPendingInvitations,
    solveAlert,
    acceptInvitationById,
    rejectInvitationById,
    type AppNotification,
    type RiskAlertResponse
} from "../api/notifications";

export function useNotifications(apiUrl: string) {
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [isRinging, setIsRinging] = useState(false);

    const [selectedAlert, setSelectedAlert] = useState<RiskAlertResponse | null>(null);
    const [isModalRendered, setIsModalRendered] = useState(false);
    const [animateModalIn, setAnimateModalIn] = useState(false);

    // 🌟 Mover triggerBell arriba envuelto en useCallback evita problemas de referencia en el useEffect
    const triggerBell = useCallback(() => {
        setIsRinging(true);
        setTimeout(() => setIsRinging(false), 2000);
    }, []);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [alertsData, invitationsData] = await Promise.all([
                    fetchActiveAlerts(),
                    fetchPendingInvitations()
                ]);

                const formattedAlerts: AppNotification[] = alertsData.map(a => ({ type: 'ALERT', data: a }));
                const formattedInvitations: AppNotification[] = invitationsData.map(i => ({ type: 'INVITATION', data: i }));

                setNotifications([...formattedAlerts, ...formattedInvitations]);
                console.log("🟢 Bandeja de notificaciones sincronizada.");
            } catch (error) {
                console.error("🔴 Error inicializando la bandeja:", error);
            }
        };

        loadInitialData();

        const token = localStorage.getItem('vera_token');
        if (!token) return;

        console.log("📡 Conectando al canal unificado SSE...");
        const eventSource = new EventSource(`${apiUrl}/api/v1/risk-alerts/stream?token=${token}`);

        // 🌟 Tipamos explícitamente el 'event' como un evento nativo de tipo MessageEvent de TS
        const handleRiskAlert = (event: Event) => {
            const messageEvent = event as MessageEvent;
            console.log("🔥 ALERTA RECIBIDA:", messageEvent.data);
            const data = JSON.parse(messageEvent.data);
            setNotifications(prev => [{ type: 'ALERT', data }, ...prev]);
            triggerBell();
        };

        const handleTrustInvitation = (event: Event) => {
            const messageEvent = event as MessageEvent;
            console.log("✉️ INVITACIÓN RECIBIDA:", messageEvent.data);
            const data = JSON.parse(messageEvent.data);
            setNotifications(prev => [{ type: 'INVITATION', data }, ...prev]);
            triggerBell();
        };

        eventSource.addEventListener("RISK_ALERT", handleRiskAlert);
        eventSource.addEventListener("TRUST_INVITATION", handleTrustInvitation);

        eventSource.onerror = () => eventSource.close();

        return () => {
            eventSource.removeEventListener("RISK_ALERT", handleRiskAlert);
            eventSource.removeEventListener("TRUST_INVITATION", handleTrustInvitation);
            eventSource.close();
        };
    }, [apiUrl, triggerBell]); // Se agrega triggerBell como dependencia segura

    const openModal = (alert: RiskAlertResponse) => {
        setSelectedAlert(alert);
        setIsModalRendered(true);
        setTimeout(() => setAnimateModalIn(true), 10);
    };

    const closeModal = () => {
        setAnimateModalIn(false);
        setTimeout(() => {
            setIsModalRendered(false);
            setSelectedAlert(null);
        }, 300);
    };

    const handleSolveAlert = async (id: string) => {
        try {
            await solveAlert(id);
            setNotifications(prev => prev.filter(n => !(n.type === 'ALERT' && n.data.alertId === id)));
            closeModal();
        } catch (error) {
            console.error(error);
            alert("No se pudo resolver la alerta");
        }
    };

    const handleAcceptInvitation = async (id: number) => {
        try {
            await acceptInvitationById(id);
            setNotifications(prev => prev.filter(n => !(n.type === 'INVITATION' && n.data.id === id)));
        } catch (error) {
            console.error(error);
            alert("Error al aceptar la invitación");
        }
    };

    const handleRejectInvitation = async (id: number) => {
        try {
            await rejectInvitationById(id);
            setNotifications(prev => prev.filter(n => !(n.type === 'INVITATION' && n.data.id === id)));
        } catch (error) {
            console.error(error);
            alert("Error al rechazar la invitación");
        }
    };

    return {
        notifications,
        isRinging,
        selectedAlert,
        isModalRendered,
        animateModalIn,
        openModal,
        closeModal,
        handleSolveAlert,
        handleAcceptInvitation,
        handleRejectInvitation
    };
}