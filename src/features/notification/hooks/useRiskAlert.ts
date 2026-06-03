import { useState, useEffect } from "react";
import { fetchActiveAlerts, solveAlert, type RiskAlertResponse } from "../api/riskAlerts";

export function useRiskAlerts(apiUrl: string) {
    const [alerts, setAlerts] = useState<RiskAlertResponse[]>([]);
    const [isRinging, setIsRinging] = useState(false);

    const [selectedAlert, setSelectedAlert] = useState<RiskAlertResponse | null>(null);
    const [isModalRendered, setIsModalRendered] = useState(false);
    const [animateModalIn, setAnimateModalIn] = useState(false);

    useEffect(() => {
        const loadInitialAlerts = async () => {
            try {
                const data = await fetchActiveAlerts();
                setAlerts(data);
                console.log("🟢 Alertas iniciales cargadas con éxito:", data.length);
            } catch (error) {
                console.error("🔴 Error cargando alertas iniciales:", error);
            }
        };

        loadInitialAlerts();

        const token = localStorage.getItem('vera_token');
        if (!token) {
            console.warn("⚠️ No se encontró el 'vera_token' en el localStorage.");
            return;
        }

        console.log("📡 Intentando conectar al canal SSE...");
        const eventSource = new EventSource(`${apiUrl}/api/v1/risk-alerts/stream?token=${token}`);

        eventSource.onopen = () => {
            console.log("✅ ¡Conexión SSE establecida con el Backend exitosamente!");
        };

        eventSource.addEventListener("RISK_ALERT", (event: MessageEvent) => {
            console.log("🔥 ¡ALERTA RECIBIDA EN TIEMPO REAL!", event.data);
            const newAlert: RiskAlertResponse = JSON.parse(event.data);

            setAlerts((prev) => [newAlert, ...prev]);
            setIsRinging(true);
            setTimeout(() => setIsRinging(false), 2000);
        });

        eventSource.onerror = (error) => {
            console.error("❌ Error o desconexión en el canal SSE. Detalles:", error);
            eventSource.close();
        };

        return () => {
            console.log("🔌 Cerrando conexión SSE (Componente desmontado)");
            eventSource.close();
        };
    }, [apiUrl]);

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
        }, 300); // 300ms coincide con duration-300 de Tailwind
    };

    const handleSolveAlert = async (id: string) => {
        try {
            await solveAlert(id);
            setAlerts((prev) => prev.filter((a) => a.alertId !== id));
            closeModal();
        } catch {
            alert("No se pudo resolver la alerta");
        }
    };

    return {
        alerts,
        isRinging,
        selectedAlert,
        isModalRendered,
        animateModalIn,
        openModal,
        closeModal,
        handleSolveAlert,
    };
}