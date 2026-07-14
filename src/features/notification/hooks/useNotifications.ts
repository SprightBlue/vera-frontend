import {useState, useEffect, useCallback, useRef} from "react";
import {Client} from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {
    fetchAllNotifications,
    acceptInvitation,
    rejectInvitation,
    deleteNotification,
    deleteAllNotifications,
    markAllRead,
    type AppNotification
} from "@/features/notification/api/notificationsApi";
import toast from "react-hot-toast";

interface UseNotificationsProps {
    page: number;
    userEmail: string | undefined;
}

interface AxiosErrorLike {
    response?: {
        status: number;
    };
}

export function useNotifications({page, userEmail}: UseNotificationsProps) {
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalElements, setTotalElements] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(0);
    const [isLastPage, setIsLastPage] = useState<boolean>(true);

    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [isRinging, setIsRinging] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(true);
    const [backgroundLoading, setBackgroundLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [isProcessingAll, setIsProcessingAll] = useState<boolean>(false);

    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const stompClientRef = useRef<Client | null>(null);

    const notificationsRef = useRef(notifications);
    const pageNumberRef = useRef(pageNumber);

    useEffect(() => {
        notificationsRef.current = notifications;
        pageNumberRef.current = pageNumber;
    }, [notifications, pageNumber]);

    const triggerBell = useCallback(() => {
        setIsRinging(true);
        const timer = setTimeout(() => setIsRinging(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    const forceLoading = useCallback(() => {
        if (notificationsRef.current.length === 0) {
            setLoading(true);
        } else {
            setBackgroundLoading(true);
        }
    }, []);

    const isAxiosError = (err: unknown): err is AxiosErrorLike => {
        return typeof err === 'object' && err !== null && 'response' in err;
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        let isMounted = true;

        const fetchInitialData = async () => {
            if (notificationsRef.current.length === 0) {
                setLoading(true);
            } else {
                setBackgroundLoading(true);
            }

            try {
                const data = await fetchAllNotifications(page);
                if (!isMounted) return;

                const fetchedContent = data.content ?? [];
                setNotifications(fetchedContent);
                setTotalPages(data.totalPages ?? 0);
                setTotalElements(data.totalElements ?? 0);
                setPageNumber(data.pageNumber ?? 0);
                setIsLastPage(data.isLast ?? true);
                setError(null);

                const initialUnread = fetchedContent.filter((n: AppNotification) => !n.isRead).length;
                setUnreadCount(initialUnread);

            } catch (requestError: unknown) {
                if (!isMounted) return;

                if (isAxiosError(requestError) && requestError.response?.status === 403) {
                    setError("ACCESO DENEGADO: SESIÓN INSUFICIENTE O EXPIRADA. VOLVÉ A INICIAR SESIÓN PARA REINTENTAR LA ACCIÓN.");
                } else {
                    setError("ERROR DE CONEXIÓN: NO SE PUDO ESTABLECER COMUNICACIÓN CON EL MÓDULO DE NOTIFICACIONES. POR FAVOR, REINTENTÁ EL PROCESO.");
                }

                setNotifications([]);
            } finally {
                if (isMounted) {
                    setLoading(false);
                    setBackgroundLoading(false);
                }
            }
        };

        void fetchInitialData();
        return () => {
            isMounted = false;
        };
    }, [page]);

    useEffect(() => {
        if (!userEmail) return;

        const token = localStorage.getItem("vera_token") || sessionStorage.getItem("vera_token");
        if (!token) return;

        const socketUrl = `${import.meta.env.VITE_API_URL}/ws-vera`;

        const client = new Client({
            webSocketFactory: () => new SockJS(socketUrl),
            connectHeaders: {Authorization: `Bearer ${token}`},
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = () => {
            const destination = `/topic/users/${userEmail}/notifications`;
            client.subscribe(destination, (message) => {
                if (!message.body) return;
                const data = JSON.parse(message.body);

                switch (data.event) {
                    case "NEW_NOTIFICATION":
                        if (data.notification) {
                            if (pageNumberRef.current === 0) {
                                setNotifications((prev) => [
                                    {
                                        ...data.notification,
                                        createdAt: "Recién ahora"
                                    },
                                    ...prev
                                ]);
                            }
                            setUnreadCount(data.unreadCount ?? 0);
                            triggerBell();
                        }
                        break;

                    case "NOTIFICATION_DELETED":
                        setNotifications((prev) => prev.filter((n) => n.id !== data.id));
                        setUnreadCount(data.unreadCount ?? 0);
                        break;

                    case "ALL_NOTIFICATIONS_DELETED":
                        setNotifications([]);
                        setUnreadCount(0);
                        setTotalElements(0);
                        setTotalPages(0);
                        setIsProcessingAll(false);
                        break;

                    case "UNREAD_COUNT_UPDATE":
                        setUnreadCount(data.unreadCount ?? 0);
                        break;
                }
            });
        };

        client.activate();
        stompClientRef.current = client;

        return () => {
            if (stompClientRef.current) void stompClientRef.current.deactivate();
        };
    }, [userEmail, triggerBell]);

    const handleMarkAllRead = async () => {
        if (unreadCount === 0) return;
        setNotifications((prev) => prev.map((n) => ({...n, isRead: true})));

        try {
            await markAllRead();
        } catch {
            toast.error("ERROR DE PROTOCOLO: NO SE PUDO SINCRONIZAR EL ESTADO DE LECTURA EN EL SERVIDOR.");
        }
    };

    const toggleDropdown = () => {
        if (!isDropdownOpen) {
            void handleMarkAllRead();
        } else {
            setUnreadCount(0);
        }
        setIsDropdownOpen((prev) => !prev);
    };

    const handleDeleteAllNotifications = async () => {
        if (notifications.length === 0 || isProcessingAll) return;
        setIsProcessingAll(true);

        try {
            await deleteAllNotifications();
        } catch {
            toast.error("ERROR DE SISTEMA: FALLÓ EL VACIADO DEL HISTORIAL DE NOTIFICACIONES.");
            setIsProcessingAll(false);
            void handleRetry();
        }
    };

    const handleAction = async (notif: AppNotification, action: "ACCEPT" | "REJECT" | "DELETE") => {
        if (isProcessing) return;
        setIsProcessing(true);

        try {
            if (action === "DELETE") {
                await deleteNotification(notif.id);
                setNotifications((prev) => prev.filter((n) => n.id !== notif.id));
            } else if (notif.type === "INVITATION") {
                const invitationId = notif.payload && typeof notif.payload === "object"
                    ? (notif.payload as Record<string, string | number>).id
                    : null;

                if (!invitationId) {
                    toast.error("ERROR DE DATOS: REGISTRO DE INVITACIÓN CORRUPTO O INCOMPLETO.");
                    return;
                }

                if (action === "ACCEPT") await acceptInvitation(invitationId);
                else if (action === "REJECT") await rejectInvitation(invitationId);

                setNotifications((prev) =>
                    prev.map((n) => n.id === notif.id
                        ? {
                            ...n,
                            type: action === "ACCEPT" ? "INVITATION_ACCEPTED" : "INVITATION_REJECTED",
                            isRead: true
                        }
                        : n
                    )
                );
            }
        } catch (requestError: unknown) {
            if (isAxiosError(requestError) && requestError.response?.status === 403) {
                toast.error("ACCESO DENEGADO: NO CONTÁS CON LOS PERMISOS PARA REQUERIR ESTA MUTACIÓN.");
            } else {
                toast.error("ERROR DE TRANSMISIÓN: NO SE PUDO EJECUTAR LA ACCIÓN SOBRE LA NOTIFICACIÓN.");
            }
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRetry = useCallback(async (): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchAllNotifications(page);
            setNotifications(data.content ?? []);
            setTotalPages(data.totalPages ?? 0);
            setTotalElements(data.totalElements ?? 0);
            setPageNumber(data.pageNumber ?? 0);
            setIsLastPage(data.isLast ?? true);
        } catch (requestError: unknown) {
            if (isAxiosError(requestError) && requestError.response?.status === 403) {
                setError("ACCESO DENEGADO: SESIÓN INSUFICIENTE O EXPIRADA. VOLVÉ A INICIAR SESIÓN PARA REINTENTAR LA ACCIÓN.");
            } else {
                setError("ERROR DE CONEXIÓN: NO SE PUDO ESTABLECER COMUNICACIÓN CON EL MÓDULO DE NOTIFICACIONES. POR FAVOR, REINTENTÁ EL PROCESO.");
            }
        } finally {
            setLoading(false);
            setBackgroundLoading(false);
        }
    }, [page]);

    const isBackgroundLoading = backgroundLoading;

    return {
        notifications,
        totalPages,
        totalElements,
        pageNumber,
        isLastPage,
        unreadCount,
        isRinging,
        loading,
        isBackgroundLoading,
        error,
        isProcessing,
        isProcessingAll,
        isDropdownOpen,
        dropdownRef,
        toggleDropdown,
        forceLoading,
        handleAction,
        handleDeleteAllNotifications,
        retry: handleRetry
    } as const;
}