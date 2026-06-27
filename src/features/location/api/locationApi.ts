import { apiClient } from "../../../infrastructure/api/auth.repository.ts";
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export interface LocationRequest {
    latitude: number;
    longitude: number;
    locationText?: string;
}

export interface UserLocationResponse {
    id: string;
    trustContact: { id: number };
    latitude: number;
    longitude: number;
    locationText: string;
    isConnected: boolean;
    updatedAt: string;
}

const API_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:8080';

export const locationApi = {
    checkProtectedStatus: async (): Promise<boolean> => {
        const response = await apiClient.get<{ shouldTrackLocation: boolean }>('/api/protected-people/check-status');
        return response.data.shouldTrackLocation;
    },

    getLastLocation: async (trustContactId: number): Promise<UserLocationResponse> => {
        const response = await apiClient.get<UserLocationResponse>(`/api/protected-people/${trustContactId}/location`);
        return response.data;
    },

    createStompClient: () => {
        const token = localStorage.getItem('vera_token') || sessionStorage.getItem('vera_token');

        return new Client({
            webSocketFactory: () => new SockJS(`${API_URL}/ws-location`),
            connectHeaders: {
                Authorization: `Bearer ${token}`
            },
            debug: (str) => console.log('STOMP: ' + str),
        });
    }
};