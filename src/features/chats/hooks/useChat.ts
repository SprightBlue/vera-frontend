import { useState, useEffect, useCallback } from "react";
import { chatApi, type ChatMessage } from "@/features/chats/api/chatApi.ts";
import { useAuth } from "@/presentation/context/AuthContext.tsx";
import type { ChatSession } from "@/features/chats/api/chatApi.ts";

interface UseChatReturn {
    messages: ChatMessage[];
    sessions: ChatSession[];
    isLoadingChat: boolean;
    isLoadingSessions: boolean;
    isSending: boolean;
    error: string | null;
    isSidebarOpen: boolean;
    welcomeInputValue: string;
    setWelcomeInputValue: (value: string) => void;
    toggleSidebar: () => void;
    sendMessage: (text: string) => Promise<void>;
    deleteChatSession: (id: string) => Promise<void>;
    refreshSessions: () => Promise<void>;
}

export function useChat(
    analysisId: string | null,
    alertId: string | null,
    currentChatId: string | null
): UseChatReturn {
    const { user } = useAuth();
    const [chatId, setChatId] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [sessions, setSessions] = useState<ChatSession[]>([]);

    const [isLoadingChat, setIsLoadingChat] = useState<boolean>(false);
    const [isLoadingSessions, setIsLoadingSessions] = useState<boolean>(true);
    const [isSending, setIsSending] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [welcomeInputValue, setWelcomeInputValue] = useState<string>("");

    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
        try {
            const saved = localStorage.getItem("vera_chat_sidebar_open");
            return saved !== null ? JSON.parse(saved) : true;
        } catch {
            return true;
        }
    });

    useEffect(() => {
        localStorage.setItem("vera_chat_sidebar_open", JSON.stringify(isSidebarOpen));
    }, [isSidebarOpen]);

    const toggleSidebar = useCallback(() => {
        setIsSidebarOpen(prev => !prev);
    }, []);

    const fetchSessions = useCallback(async () => {
        if (!user?.email) return;
        try {
            const data = await chatApi.getUserChats();
            setSessions(data);
        } catch (err) {
            console.error("Error cargando historial de salas:", err);
        }
    }, [user?.email]);

    useEffect(() => {
        if (!user?.email) return;
        let isMounted = true;

        async function loadInitialSessions(): Promise<void> {
            try {
                setIsLoadingSessions(true);
                const data = await chatApi.getUserChats();
                if (isMounted) setSessions(data);
            } catch (err) {
                console.error("Error en carga inicial:", err);
            } finally {
                if (isMounted) setIsLoadingSessions(false);
            }
        }

        void loadInitialSessions();
        return () => { isMounted = false; };
    }, [user?.email]);

    useEffect(() => {
        if (!user?.email) return;
        let isMounted = true;

        async function setupChat(): Promise<void> {
            if (!currentChatId && !analysisId && !alertId) {
                if (isMounted) {
                    setChatId(null);
                    setMessages([]);
                    setIsLoadingChat(false);
                }
                return;
            }

            try {
                setIsLoadingChat(true);
                setError(null);

                if (currentChatId) {
                    setChatId(currentChatId);
                    const history = await chatApi.getChatHistory(currentChatId);
                    if (isMounted) setMessages(history);
                } else {
                    const id = await chatApi.initializeChat({ analysisId, alertId });
                    if (!isMounted) return;
                    setChatId(id);
                    const history = await chatApi.getChatHistory(id);
                    if (isMounted) setMessages(history);
                }
            } catch (err) {
                console.error("Error setting up chat room:", err);
                if (isMounted) {
                    setError("No se pudo establecer conexión segura con Vera. Por favor reintente.");
                }
            } finally {
                if (isMounted) setIsLoadingChat(false);
            }
        }

        void setupChat();
        return () => { isMounted = false; };
    }, [analysisId, alertId, currentChatId, user?.email]);

    const sendMessage = useCallback(async (text: string): Promise<void> => {
        const cleanMessage = text.trim();
        if (!cleanMessage) return;

        setIsSending(true);
        const userMsg: ChatMessage = { role: "USER", content: cleanMessage };
        setMessages(prev => [...prev, userMsg]);

        try {
            let activeId = chatId;
            if (!activeId) {
                activeId = await chatApi.initializeChat({ analysisId: null, alertId: null });
                setChatId(activeId);
            }

            const aiResponse = await chatApi.sendMessage(activeId, cleanMessage);
            const modelMsg: ChatMessage = { role: "MODEL", content: aiResponse };
            setMessages(prev => [...prev, modelMsg]);

            const updatedSessions = await chatApi.getUserChats();
            setSessions(updatedSessions);
        } catch (err) {
            console.error("Error dispatching message:", err);
            const errorMsg: ChatMessage = {
                role: "MODEL",
                content: "Hubo una interrupción de red al procesar tu consulta con Vera. ¿Podrías volver a intentarlo?"
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsSending(false);
        }
    }, [chatId]);

    const deleteChatSession = useCallback(async (id: string): Promise<void> => {
        try {
            setSessions(prev => prev.filter(s => s.id !== id));
            await chatApi.deleteChat(id);
            const updatedSessions = await chatApi.getUserChats();
            setSessions(updatedSessions);
        } catch (err) {
            console.error("Error al remover la sesión:", err);
        }
    }, []);

    return {
        messages,
        sessions,
        isLoadingChat,
        isLoadingSessions,
        isSending,
        error,
        isSidebarOpen,
        welcomeInputValue,
        setWelcomeInputValue,
        toggleSidebar,
        sendMessage,
        deleteChatSession,
        refreshSessions: fetchSessions
    };
}