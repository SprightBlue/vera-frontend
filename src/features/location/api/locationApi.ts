import { apiClient } from "@/infrastructure/api/auth.repository.ts";
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export interface LocationRequest {
    latitude: number;
    longitude: number;
    locationText?: string;
}

export interface UserLocationResponse {
    id: string | null;
    trustContactId: number;
    latitude: number;
    longitude: number;
    locationText: string;
    isConnected: boolean;
    updatedAt: string | null;
}

const API_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:8080';

export const locationApi = {
    getLastLocation: async (trustContactId: number): Promise<UserLocationResponse> => {
        const response = await apiClient.get<UserLocationResponse>(`/api/protected-people/${trustContactId}/location`);
        return response.data;
    },

    createStompClient: () => {
        const token = localStorage.getItem('vera_token') || sessionStorage.getItem('vera_token');

        return new Client({
            webSocketFactory: () => new SockJS(`${API_URL}/ws-vera`), // Canal unificado
            connectHeaders: {
                Authorization: token ? `Bearer ${token}` : ""
            },
            debug: (str) => {
                if (import.meta.env.DEV) console.log('STOMP Location: ' + str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000
        });
    }
};