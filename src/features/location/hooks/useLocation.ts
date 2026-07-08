import { useState, useEffect, useRef } from 'react';
import { locationApi, type UserLocationResponse } from '@/features/location/api/locationApi.ts';
import toast from "react-hot-toast";

export const useLocation = (trustContactId: number) => {
    const [location, setLocation] = useState<UserLocationResponse | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [loading, setLoading] = useState(false);
    const stompClientRef = useRef<any>(null);

    useEffect(() => {
        if (!trustContactId) return;

        const client = locationApi.createStompClient();
        stompClientRef.current = client;

        const initializeLocation = async () => {
            setLoading(true);
            try {
                const initialData = await locationApi.getLastLocation(trustContactId);
                setLocation(initialData);
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
                setLocation(data);
                setIsConnected(data.isConnected);
            });
        };

        client.onStompError = (frame) => {
            console.error("Error STOMP en mapa:", frame);
            toast.error("Error de conexión en tiempo real con el mapa");
        };

        client.activate();

        return () => {
            if (stompClientRef.current) {
                console.log("STOMP: Cancelando suscripción al mapa...");
                stompClientRef.current.deactivate();
            }
        };
    }, [trustContactId]);

    return { location, isConnected, loading, setLocation };
};