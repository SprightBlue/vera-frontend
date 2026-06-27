import { useEffect, useState } from 'react';
import { locationApi } from '../api/locationApi.ts';
import {useAuth} from "../../../presentation/context/AuthContext.tsx";

export const useLocationSender = () => {
    const [isTracking, setIsTracking] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            console.log("DEBUG: Esperando autenticación del usuario para iniciar tracking...");
            return;
        }

        let watchId: number;
        const client = locationApi.createStompClient();

        const startTrackingFlow = async () => {
            try {
                const shouldTrack = await locationApi.checkProtectedStatus();

                if (!shouldTrack) {
                    console.log("DEBUG: El usuario no es protegido. No se transmite ubicación.");
                    return;
                }

                setIsTracking(true);

                client.onConnect = () => {
                    console.log("DEBUG: STOMP Conectado. Iniciando transmisión de GPS...");

                    let lastCoords = { lat: 0, lng: 0 };

                    watchId = navigator.geolocation.watchPosition((pos) => {
                        const { latitude, longitude } = pos.coords;

                        const latDiff = Math.abs(latitude - lastCoords.lat);
                        const lngDiff = Math.abs(longitude - lastCoords.lng);

                        if (latDiff < 0.0001 && lngDiff < 0.0001) {
                            console.log("DEBUG: El usuario no se ha movido lo suficiente. Envío omitido.");
                            return;
                        }

                        lastCoords = { lat: latitude, lng: longitude };

                        client.publish({
                            destination: '/app/location.update',
                            body: JSON.stringify({ latitude, longitude })
                        });
                    }, (err) => console.error("DEBUG: Error leyendo GPS: ", err), { enableHighAccuracy: true });
                };

                client.onStompError = (frame) => {
                    console.error('DEBUG: Error en STOMP Sender:', frame);
                };

                client.activate();

            } catch (error) {
                console.error("DEBUG: Error al verificar el estado del usuario protegido", error);
            }
        };

        void startTrackingFlow();

        return () => {
            console.log("DEBUG: Apagando servicios de localización y WebSocket...");
            if (watchId) navigator.geolocation.clearWatch(watchId);
            if (client.active) void client.deactivate();
        };
    }, [user]);

    return { isTracking };
};