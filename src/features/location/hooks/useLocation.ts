import { useState, useEffect, useRef } from 'react';
import { locationApi, type UserLocationResponse } from '@/features/location/api/locationApi.ts';
import toast from "react-hot-toast";

export const useLocation = (trustContactId: number) => {
    const [location, setLocation] = useState<UserLocationResponse | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [loading, setLoading] = useState(false);

    // Referencias persistentes
    const stompClientRef = useRef<any>(null);
    const graceTimerRef = useRef<number | null>(null);

    useEffect(() => {
        if (!trustContactId) return;

        const client = locationApi.createStompClient();
        stompClientRef.current = client;

        const initializeLocation = async () => {
            setLoading(true);
            try {
                const initialData = await locationApi.getLastLocation(trustContactId);
                setLocation(initialData);
                // Si el REST dice que está conectado, iniciamos en true
                setIsConnected(initialData.isConnected);
            } catch (err) {
                console.error("Error cargando ubicación inicial por REST", err);
            } finally {
                setLoading(false);
            }
        };

        void initializeLocation();

        client.onConnect = () => {
            console.log(`STOMP: Suscrito al mapa del protegido. ID Relación: ${trustContactId}`);

            client.subscribe(`/topic/trust-contact/${trustContactId}`, (message) => {
                const data: UserLocationResponse = JSON.parse(message.body);

                // --- LÓGICA DE GRACIA ---
                // Si recibimos un mensaje, el protegido está vivo.
                // Reiniciamos el contador de 6 segundos.
                if (data.isConnected) {
                    setIsConnected(true);

                    if (graceTimerRef.current) clearTimeout(graceTimerRef.current);

                    graceTimerRef.current = window.setTimeout(() => {
                        console.log("Gracia terminada: marcando como desconectado.");
                        setIsConnected(false);
                    }, 6000);
                } else {
                    setIsConnected(false);
                }

                setLocation(data);
            });
        };

        client.onStompError = (frame) => {
            console.error("Error STOMP en mapa:", frame);
            toast.error("Error de conexión en tiempo real con el mapa");
        };

        client.activate();

        return () => {
            if (graceTimerRef.current) clearTimeout(graceTimerRef.current);
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
            }
        };
    }, [trustContactId]);

    return { location, isConnected, loading, setLocation };
};