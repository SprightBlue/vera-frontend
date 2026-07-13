import { useState, useEffect, useCallback, useRef } from "react";
import { chatApi, type ChatMessage, type ChatSession } from "@/features/chats/api/chatApi";
import { useAuth } from "@/presentation/context/AuthContext";

interface UseChatReturn {
    messages: ChatMessage[];
    sessions: ChatSession[];
    isLoadingChat: boolean;
    isLoadingSessions: boolean;
    isSending: boolean;
    error: string | null;
    isSidebarOpen: boolean;
    chatInputValue: string;
    welcomeInputValue: string;
    deletingSessionIds: string[];
    setChatInputValue: (value: string) => void;
    setWelcomeInputValue: (value: string) => void;
    toggleSidebar: () => void;
    sendMessage: (text: string) => Promise<string | null>;
    retryLastMessage: () => Promise<void>;
    deleteChatSession: (id: string) => Promise<void>;
    refreshSessions: () => Promise<void>;
    resetInputs: () => void;
}

interface AxiosErrorLike {
    response?: {
        status: number;
    };
}

export function useChat(currentChatId: string | null): UseChatReturn {
    const { user } = useAuth();
    const [chatId, setChatId] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [sessions, setSessions] = useState<ChatSession[]>([]);

    const [isLoadingChat, setIsLoadingChat] = useState<boolean>(false);
    const [isLoadingSessions, setIsLoadingSessions] = useState<boolean>(true);
    const [isSending, setIsSending] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [chatInputValue, setChatInputValue] = useState<string>("");
    const [welcomeInputValue, setWelcomeInputValue] = useState<string>("");

    const [deletingSessionIds, setDeletingSessionIds] = useState<string[]>([]);
    const lastPendingMessageRef = useRef<string | null>(null);

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

    const isAxiosError = (err: unknown): err is AxiosErrorLike => {
        return typeof err === 'object' && err !== null && 'response' in err;
    };

    const handleHookError = useCallback((requestError: unknown) => {
        if (isAxiosError(requestError) && requestError.response?.status === 403) {
            setError("ACCESO DENEGADO: SESIÓN INSUFICIENTE O EXPIRADA. VOLVÉ A INICIAR SESIÓN PARA REINTENTAR LA ACCIÓN.");
        } else {
            setError("ERROR DE CONEXIÓN: NO SE PUDO ESTABLECER COMUNICACIÓN CON EL ASISTENTE VERA. POR FAVOR, REINTENTÁ EL PROCESO.");
        }
    }, []);

    const resetInputs = useCallback(() => {
        setChatInputValue("");
        setWelcomeInputValue("");
    }, []);

    const fetchSessions = useCallback(async () => {
        if (!user?.email) return;
        try {
            const data = await chatApi.getUserChats();
            setSessions(data);
        } catch (err) {
            handleHookError(err);
        }
    }, [user?.email, handleHookError]);

    useEffect(() => {
        if (!user?.email) return;
        let isMounted = true;

        async function loadInitialSessions(): Promise<void> {
            try {
                setIsLoadingSessions(true);
                const data = await chatApi.getUserChats();
                if (isMounted) setSessions(data);
            } catch (err) {
                if (isMounted) handleHookError(err);
            } finally {
                if (isMounted) setIsLoadingSessions(false);
            }
        }

        void loadInitialSessions();
        return () => { isMounted = false; };
    }, [user?.email, handleHookError]);

    useEffect(() => {
        if (!user?.email) return;
        let isMounted = true;

        async function setupChat(): Promise<void> {
            if (!currentChatId) {
                if (isMounted) {
                    setChatId(null);
                    setMessages([]);
                    setIsLoadingChat(false);
                    setError(null);
                }
                return;
            }

            try {
                setIsLoadingChat(true);
                setError(null);
                setChatId(currentChatId);

                const history = await chatApi.getChatHistory(currentChatId);
                if (isMounted) setMessages(history);
            } catch (err) {
                if (isMounted) handleHookError(err);
            } finally {
                if (isMounted) setIsLoadingChat(false);
            }
        }

        void setupChat();
        return () => { isMounted = false; };
    }, [currentChatId, user?.email, handleHookError]);

    const sendMessage = useCallback(async (text: string): Promise<string | null> => {
        const cleanMessage = text.trim();
        if (!cleanMessage || isSending) return null;

        setIsSending(true);
        setError(null);
        lastPendingMessageRef.current = cleanMessage;

        const userMsg: ChatMessage = { role: "USER", content: cleanMessage };
        setMessages(prev => [...prev, userMsg]);

        try {
            let activeId = chatId;
            if (!activeId) {
                activeId = await chatApi.initializeChat();
                setChatId(activeId);
            }

            const aiResponse = await chatApi.sendMessage(activeId, cleanMessage);
            const modelMsg: ChatMessage = { role: "MODEL", content: aiResponse };

            setMessages(prev => [...prev, modelMsg]);
            lastPendingMessageRef.current = null;

            const updatedSessions = await chatApi.getUserChats();
            setSessions(updatedSessions);

            return activeId;
        } catch (err) {
            handleHookError(err);
            return null;
        } finally {
            setIsSending(false);
        }
    }, [chatId, isSending, handleHookError]);

    const retryLastMessage = useCallback(async (): Promise<void> => {
        if (!lastPendingMessageRef.current) return;
        const textToRetry = lastPendingMessageRef.current;

        setMessages(prev => prev.slice(0, -1));
        await sendMessage(textToRetry);
    }, [sendMessage]);

    const deleteChatSession = useCallback(async (id: string): Promise<void> => {
        setDeletingSessionIds(prev => [...prev, id]);
        try {
            await chatApi.deleteChat(id);
            const updatedSessions = await chatApi.getUserChats();
            setSessions(updatedSessions);
        } catch (err) {
            handleHookError(err);
        } finally {
            setDeletingSessionIds(prev => prev.filter(sessionId => sessionId !== id));
        }
    }, [handleHookError]);

    return {
        messages,
        sessions,
        isLoadingChat,
        isLoadingSessions,
        isSending,
        error,
        isSidebarOpen,
        chatInputValue,
        welcomeInputValue,
        deletingSessionIds,
        setChatInputValue,
        setWelcomeInputValue,
        toggleSidebar,
        sendMessage,
        retryLastMessage,
        deleteChatSession,
        refreshSessions: fetchSessions,
        resetInputs
    } as const;
}