import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from "@/presentation/context/AuthContext.tsx";

const LocationContext = createContext({ isTracking: false });

export const LocationProvider = ({ children }: { children: React.ReactNode }) => {
    const [isTracking, setIsTracking] = useState(false);
    const { user, isAuthenticated } = useAuth();

    // Usamos Refs para evitar que los re-renders limpien el efecto
    const stompClientRef = useRef<Client | null>(null);
    const lastLocationRef = useRef<{ latitude: number; longitude: number } | null>(null);
    const watchIdRef = useRef<number | null>(null);
    const intervalIdRef = useRef<number | null>(null);

    // Extraemos solo strings primitivos para las dependencias del useEffect
    const userRole = user?.role;
    const userId = user?.id; // O cualquier propiedad única/id si la tenés

    useEffect(() => {
        // 1. Si no está logueado o no es PROTECTED, limpiamos TODO rigurosamente
        if (!isAuthenticated || userRole !== 'PROTECTED') {
            console.log("LocationSender: Usuario no apto o deslogueado. Limpiando servicios...");

            if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
            if (intervalIdRef.current) clearInterval(intervalIdRef.current);
            if (stompClientRef.current) {
                void stompClientRef.current.deactivate();
                stompClientRef.current = null;
            }
            watchIdRef.current = null;
            intervalIdRef.current = null;
            setIsTracking(false);
            return;
        }

        // 2. 🌟 EL ESCUDO: Si el cliente ya existe y está activo/conectándose, NO HACEMOS NADA.
        // Esto previene el parpadeo del milisegundo al cambiar de pantalla.
        if (stompClientRef.current) {
            console.log("LocationSender: El servicio ya está corriendo de fondo. Ignorando re-render.");
            return;
        }

        const token = localStorage.getItem("vera_token") || sessionStorage.getItem("vera_token");
        if (!token) return;

        const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
        const socketUrl = `${baseUrl}/ws-vera`;

        console.log("LocationSender: Creando nueva conexión WebSocket inmortal...");

        const client = new Client({
            webSocketFactory: () => new SockJS(socketUrl),
            connectHeaders: { Authorization: `Bearer ${token}` },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        stompClientRef.current = client;
        setIsTracking(true);

        const publishLocation = (lat: number, lng: number) => {
            if (client.connected) {
                client.publish({
                    destination: '/app/location.update',
                    body: JSON.stringify({ latitude: lat, longitude: lng, locationText: "" })
                });
            }
        };

        client.onConnect = () => {
            console.log("LocationSender: Conexión STOMP establecida con éxito.");

            // Primer disparo instantáneo
            navigator.geolocation.getCurrentPosition((pos) => {
                const { latitude, longitude } = pos.coords;
                lastLocationRef.current = { latitude, longitude };
                publishLocation(latitude, longitude);
            }, null, { enableHighAccuracy: true });

            // Watch clásico de hardware
            let lastCoords = { lat: 0, lng: 0 };
            let isFirstEmission = true;

            watchIdRef.current = navigator.geolocation.watchPosition((pos) => {
                const { latitude, longitude } = pos.coords;

                const latDiff = Math.abs(latitude - lastCoords.lat);
                const lngDiff = Math.abs(longitude - lastCoords.lng);

                if (!isFirstEmission && latDiff < 0.0001 && lngDiff < 0.0001) return;

                lastCoords = { lat: latitude, lng: longitude };
                isFirstEmission = false;
                lastLocationRef.current = { latitude, longitude };

                publishLocation(latitude, longitude);
            }, (err) => console.error("GPS Error:", err), {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            });

            // Heartbeat de ráfaga (Pulso cada 3 segundos)
            intervalIdRef.current = window.setInterval(() => {
                if (lastLocationRef.current) {
                    publishLocation(lastLocationRef.current.latitude, lastLocationRef.current.longitude);
                }
            }, 3000);
        };

        client.activate();

        // 🌟 NOTA CRÍTICA: Dejamos el return de limpieza vacío o controlado únicamente por el ciclo de deslogueo de arriba.
        // No desconectamos al desmontar el componente de la vista porque queremos que viva en App.tsx para siempre.
        return () => {
            // No hacemos deactivates automáticos acá para evitar el parpadeo del Router.
            // Todo se maneja de forma controlada en el paso 1 del useEffect.
        };

    }, [isAuthenticated, userRole, userId]); // Dependencias primitivas (strings/numbers), nunca el objeto 'user' entero

    return (
        <LocationContext.Provider value={{ isTracking }}>
            {children}
        </LocationContext.Provider>
    );
};

export const locationContext = () => useContext(LocationContext);