import { useState, useEffect, useCallback, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getDashboardData, type DashboardResponse } from "../api/dashboardApi";
import { useAuth } from "@/presentation/context/AuthContext.tsx";

export function useDashboard() {
    const { user } = useAuth();
    const [data, setData] = useState<DashboardResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    const stompClientRef = useRef<Client | null>(null);
    const isReadyRef = useRef<boolean>(false); // 🌟 Filtro de estabilidad
    const currentRole = user?.role;

    const forceLoading = useCallback(() => {
        setLoading(true);
    }, []);

    const fetchInitialData = useCallback(async () => {
        setLoading(true);
        setError(false);
        try {
            const result = await getDashboardData();
            setData(result);
            isReadyRef.current = true; // 🌟 Marcamos que el REST ya cargó
        } catch {
            setError(true);
            setData(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchInitialData();
    }, [fetchInitialData]);

    useEffect(() => {
        if (!user?.email || !currentRole) return;

        const token = localStorage.getItem("vera_token") || sessionStorage.getItem("vera_token");
        if (!token) return;

        const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
        const socketUrl = `${baseUrl}/ws-vera`;

        const client = new Client({
            webSocketFactory: () => new SockJS(socketUrl),
            connectHeaders: { Authorization: `Bearer ${token}` },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = () => {
            console.log("STOMP: Conexión establecida.");

            if (currentRole === "CARER" || currentRole === "ADMIN") {
                // Canal de Alertas
                client.subscribe(`/topic/carer/${user.email}/alerts`, (message) => {
                    if (!message.body) return;
                    const rawData = JSON.parse(message.body);
                    setData((prev) => {
                        if (!prev) return null;
                        if (rawData.event === "ALERT_DELETED") {
                            return {
                                ...prev,
                                top3Alerts: (prev.top3Alerts ?? []).filter((a) => a.id !== rawData.alertId),
                                alertsInLast24Hours: Math.max(0, (prev.alertsInLast24Hours ?? 0) - 1)
                            };
                        }
                        const exists = prev.top3Alerts?.some((a) => a.id === rawData.id);
                        return {
                            ...prev,
                            top3Alerts: exists
                                ? prev.top3Alerts?.map((a) => (a.id === rawData.id ? rawData : a))
                                : [rawData, ...(prev.top3Alerts ?? [])].slice(0, 3),
                            alertsInLast24Hours: exists ? prev.alertsInLast24Hours : (prev.alertsInLast24Hours ?? 0) + 1
                        };
                    });
                });

                // Canal de Ubicaciones (CON FILTRO DE ESTABILIDAD)
                client.subscribe(`/topic/carer/${user.email}/connected-users`, (message) => {
                    if (!message.body) return;
                    const locationDto = JSON.parse(message.body);

                    setData((prev) => {
                        if (!prev) return null;

                        const isNowConnected = locationDto.isConnected ?? locationDto.connected ?? false;

                        // 🌟 Lógica anti-parpadeo: Ignorar falsos negativos durante la carga inicial
                        if (!isReadyRef.current && !isNowConnected) {
                            return prev;
                        }

                        const currentUsers = prev.top3ConnectedUsers ? [...prev.top3ConnectedUsers] : [];
                        const existingUser = currentUsers.find((u) => u.id === locationDto.id);
                        const wasConnectedBefore = existingUser?.isConnected ?? false;

                        let delta = 0;
                        if (wasConnectedBefore && !isNowConnected) delta = -1;
                        else if (!wasConnectedBefore && isNowConnected) delta = 1;

                        const updatedUsers = existingUser
                            ? currentUsers.map((u) => (u.id === locationDto.id ? { ...u, ...locationDto, isConnected: isNowConnected } : u))
                            : [locationDto, ...currentUsers].slice(0, 3);

                        return {
                            ...prev,
                            top3ConnectedUsers: updatedUsers,
                            connectedUsersCount: Math.max(0, (prev.connectedUsersCount ?? 0) + delta)
                        };
                    });
                });
            }

            if (currentRole === "PROTECTED") {
                client.subscribe(`/topic/protected/${user.email}/resolved-alerts`, (message) => {
                    if (!message.body) return;
                    const rawData = JSON.parse(message.body);
                    setData((prev) => {
                        if (!prev) return null;
                        return { ...prev, top3ResolvedAlerts: [rawData, ...(prev.top3ResolvedAlerts ?? [])].slice(0, 3) };
                    });
                });
            }
        };

        client.activate();
        stompClientRef.current = client;

        return () => {
            void client.deactivate();
        };
    }, [user?.email, currentRole]);

    return { data, loading, error, forceLoading, retry: fetchInitialData } as const;
}