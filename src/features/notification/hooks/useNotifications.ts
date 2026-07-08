import { useState, useEffect, useCallback, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {
    fetchAllNotifications,
    acceptInvitation,
    rejectInvitation,
    deleteNotification,
    markAllRead,
    type AppNotification
} from "@/features/notification/api/notificationsApi.ts";
import toast from "react-hot-toast";

interface UseNotificationsProps {
    page: number;
    userEmail: string | undefined;
}

const ITEMS_PER_PAGE = 5;

export function useNotifications({ page, userEmail }: UseNotificationsProps) {
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalElements, setTotalElements] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(0);
    const [isLastPage, setIsLastPage] = useState<boolean>(true);

    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [isRinging, setIsRinging] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const stompClientRef = useRef<Client | null>(null);

    const triggerBell = useCallback(() => {
        setIsRinging(true);
        setTimeout(() => setIsRinging(false), 2000);
    }, []);

    const forceLoading = useCallback(() => {
        setLoading(true);
    }, []);

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
            setLoading(true);
            try {
                const data = await fetchAllNotifications(page);
                if (!isMounted) return;

                setNotifications(data.content ?? []);
                setTotalPages(data.totalPages ?? 0);
                setTotalElements(data.totalElements ?? 0);
                setPageNumber(data.pageNumber ?? 0);
                setIsLastPage(data.isLast ?? true);
                setError(null);
            } catch {
                if (!isMounted) return;
                setError("No se pudo establecer conexión con el servicio de notificaciones.");
                setNotifications([]);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        void fetchInitialData();
        return () => { isMounted = false; };
    }, [page]);

    useEffect(() => {
        if (!userEmail) return;

        const token = localStorage.getItem("vera_token") || sessionStorage.getItem("vera_token");
        if (!token) return;

        const socketUrl = `${import.meta.env.VITE_API_URL}/ws-vera`;

        const client = new Client({
            webSocketFactory: () => new SockJS(socketUrl),
            connectHeaders: { Authorization: `Bearer ${token}` },
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
                            setNotifications((prev) => [data.notification, ...prev]);
                            setUnreadCount(data.unreadCount ?? 0);
                            triggerBell();

                            setTotalElements((prevElements) => {
                                const nextElements = prevElements + 1;
                                setTotalPages(Math.ceil(nextElements / ITEMS_PER_PAGE));
                                return nextElements;
                            });
                        }
                        break;

                    case "NOTIFICATION_DELETED":
                        setNotifications((prev) => prev.filter((n) => n.id !== data.id));
                        setUnreadCount(data.unreadCount ?? 0);

                        setTotalElements((prevElements) => {
                            const nextElements = Math.max(0, prevElements - 1);
                            setTotalPages(Math.ceil(nextElements / ITEMS_PER_PAGE));
                            return nextElements;
                        });
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
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
        try {
            await markAllRead();
        } catch {
            toast.error("No se pudieron marcar como leídas");
        }
    };

    const toggleDropdown = () => {
        if (!isDropdownOpen) void handleMarkAllRead();
        setIsDropdownOpen((prev) => !prev);
    };

    const handleAction = async (notif: AppNotification, action: "ACCEPT" | "REJECT" | "DELETE") => {
        if (isProcessing) return;
        setIsProcessing(true);

        try {
            if (action === "DELETE") {
                await deleteNotification(notif.id);
                setNotifications((prev) => prev.filter((n) => n.id !== notif.id));

                setTotalElements((prevElements) => {
                    const nextElements = Math.max(0, prevElements - 1);
                    setTotalPages(Math.ceil(nextElements / ITEMS_PER_PAGE));
                    return nextElements;
                });
            } else if (notif.type === "INVITATION") {
                const invitationId = notif.payload && typeof notif.payload === "object"
                    ? (notif.payload as Record<string, string | number>).id
                    : null;

                if (!invitationId) {
                    toast.error("Datos de invitación corruptos o faltantes");
                    return;
                }

                if (action === "ACCEPT") await acceptInvitation(invitationId);
                else if (action === "REJECT") await rejectInvitation(invitationId);

                setNotifications((prev) =>
                    prev.map((n) => n.id === notif.id
                        ? { ...n, type: action === "ACCEPT" ? "INVITATION_ACCEPTED" : "INVITATION_REJECTED", isRead: true }
                        : n
                    )
                );
            }
        } catch {
            toast.error("No se pudo ejecutar la acción solicitada");
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
        } catch {
            setError("No se pudo establecer conexión con el servicio de notificaciones.");
        } finally {
            setLoading(false);
        }
    }, [page]);

    return {
        notifications,
        totalPages,
        totalElements,
        pageNumber,
        isLastPage,
        unreadCount,
        isRinging,
        loading,
        error,
        isDropdownOpen,
        dropdownRef,
        toggleDropdown,
        forceLoading,
        handleAction,
        retry: handleRetry
    } as const;
}