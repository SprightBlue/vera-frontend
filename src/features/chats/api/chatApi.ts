import { apiClient as api } from "@/presentation/api/auth.repository.ts";

export type ChatRole = 'USER' | 'MODEL';

export interface ChatMessage {
    role: ChatRole;
    content: string;
}

export interface ChatSession {
    id: string;
    title: string;
}

const cleanId = (id: string): string => {
    if (!id) return id;
    return id.trim().replace(/^"|"$/g, '');
};

export const chatApi = {
    initializeChat: async (): Promise<string> => {
        const response = await api.post<string>(
            '/api/v1/chats/init',
            null,
            { responseType: 'text' }
        );
        return cleanId(response.data);
    },

    getUserChats: async (): Promise<ChatSession[]> => {
        const response = await api.get<ChatSession[]>('/api/v1/chats');
        return response.data;
    },

    sendMessage: async (chatId: string, message: string): Promise<string> => {
        const sanitizedId = cleanId(chatId);
        const response = await api.post<string>(
            `/api/v1/chats/${encodeURIComponent(sanitizedId)}/messages`,
            message,
            {
                headers: { 'Content-Type': 'text/plain; charset=utf-8' },
                responseType: 'text'
            }
        );
        return response.data;
    },

    getChatHistory: async (chatId: string): Promise<ChatMessage[]> => {
        const sanitizedId = cleanId(chatId);
        const response = await api.get<ChatMessage[]>(
            `/api/v1/chats/${encodeURIComponent(sanitizedId)}/messages`
        );
        return response.data;
    },

    deleteChat: async (chatId: string): Promise<void> => {
        const sanitizedId = cleanId(chatId);
        await api.delete(`/api/v1/chats/${encodeURIComponent(sanitizedId)}`);
    }
};