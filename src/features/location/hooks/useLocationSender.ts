import { useEffect, useState, useRef } from 'react';
import { locationApi } from '@/features/location/api/locationApi.ts';
import { useAuth } from "@/presentation/context/AuthContext.tsx";

export const useLocationSender = () => {
    const [isTracking, setIsTracking] = useState(false);
    const { user } = useAuth();
    const stompClientRef = useRef<any>(null);

    useEffect(() => {
        if (!user) {
            console.log("STOMP Sender: Esperando datos de sesión...");
            return;
        }

        if (user.role !== 'PROTECTED') {
            console.log("STOMP Sender: El usuario es CARER. Flujo de tracking GPS abortado.");
            setIsTracking(false);
            return;
        }

        let watchId: number;
        const client = locationApi.createStompClient();
        stompClientRef.current = client;

        console.log("STOMP Sender: Inicializando tracking para usuario PROTECTED...");
        setIsTracking(true);

        client.onConnect = () => {
            console.log("STOMP Sender: Canal conectado. Activando antena GPS...");

            let lastCoords = { lat: 0, lng: 0 };

            watchId = navigator.geolocation.watchPosition((pos) => {
                const { latitude, longitude } = pos.coords;

                const latDiff = Math.abs(latitude - lastCoords.lat);
                const lngDiff = Math.abs(longitude - lastCoords.lng);

                if (latDiff < 0.0001 && lngDiff < 0.0001) {
                    return;
                }

                lastCoords = { lat: latitude, lng: longitude };

                client.publish({
                    destination: '/app/location.update',
                    body: JSON.stringify({
                        latitude,
                        longitude,
                        locationText: ""
                    })
                });
            }, (err) => console.error("GPS Error: ", err), { enableHighAccuracy: true });
        };

        client.onStompError = (frame) => {
            console.error('STOMP Sender Error Crítico:', frame);
        };

        client.activate();

        return () => {
            console.log("STOMP Sender: Limpiando capturas de localización y cerrando socket...");
            if (watchId) navigator.geolocation.clearWatch(watchId);
            if (stompClientRef.current) stompClientRef.current.deactivate();
        };
    }, [user]);

    return { isTracking };
};