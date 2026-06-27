import { useState, useEffect } from 'react';
import { locationApi, type UserLocationResponse } from '../api/locationApi.ts';

export const useLocation = (trustContactId: number) => {
    const [location, setLocation] = useState<UserLocationResponse | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!trustContactId) return;

        const client = locationApi.createStompClient();

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
            console.log(`DEBUG: Suscrito al canal del protegido. ID Relación: ${trustContactId}`);

            client.subscribe(`/topic/trust-contact/${trustContactId}`, (message) => {
                const data: UserLocationResponse = JSON.parse(message.body);
                setLocation(data);
                setIsConnected(data.isConnected);
            });
        };

        client.onStompError = (frame) => {
            console.error('DEBUG: Error STOMP Receiver:', frame);
        };

        client.activate();

        return () => {
            console.log("DEBUG: Cancelando suscripción al mapa...");
            void client.deactivate();
        };
    }, [trustContactId]);

    return { location, isConnected, loading, setLocation };
};