import type { RefObject } from "react";
import { Trash2 } from "lucide-react";
import { type AppNotification } from "@/features/notification/api/notificationsApi";
import { NotificationItem } from "@/features/notification/components/NotificationItem";
import { NotificationBell } from "@/features/notification/components/NotificationBell";
import { ActionButton } from "@/features/shared/components/ActionButton";

import { LoadingScreen } from "@/features/shared/components/LoadingScreen";
import { RetryScreen } from "@/features/shared/components/RetryScreen";
import { EmptyScreen } from "@/features/shared/components/EmptyScreen";
import { Pagination } from "@/features/shared/components/Pagination";

interface DropdownProps {
    notifications: AppNotification[];
    totalPages: number;
    totalElements: number;
    page: number;
    setPage: (page: (prev: number) => number) => void;
    unreadCount: number;
    isRinging: boolean;
    loading: boolean;
    isBackgroundLoading?: boolean;
    isProcessing?: boolean;
    isProcessingAll?: boolean;
    error: string | null;
    retry: () => void | Promise<void>;
    isDropdownOpen: boolean;
    dropdownRef: RefObject<HTMLDivElement | null>;
    toggleDropdown: () => void;
    forceLoading: () => void;
    handleAction: (notif: AppNotification, action: 'ACCEPT' | 'REJECT' | 'DELETE') => void | Promise<void>;
    onDeleteAllNotifications: () => void | Promise<void>;
    onSelect: (notif: AppNotification) => void;
}

export function NotificationDropdown({
                                         notifications,
                                         totalPages,
                                         totalElements,
                                         page,
                                         setPage,
                                         unreadCount,
                                         isRinging,
                                         loading,
                                         isBackgroundLoading = false,
                                         isProcessing = false,
                                         isProcessingAll = false,
                                         error,
                                         retry,
                                         isDropdownOpen,
                                         dropdownRef,
                                         toggleDropdown,
                                         forceLoading,
                                         handleAction,
                                         onDeleteAllNotifications,
                                         onSelect
                                     }: DropdownProps) {
    return (
        <div className="relative" ref={dropdownRef}>

            <NotificationBell
                isOpen={isDropdownOpen}
                isRinging={isRinging}
                unreadCount={unreadCount}
                onClick={toggleDropdown}
            />

            {/* Menú desplegable con el fondo unificado exacto del Sidebar original (bg-[#0B0D17]) */}
            <div className={`absolute right-0 mt-3 w-[clamp(19rem,40vw,26rem)] 
                bg-[#0B0D17] border border-white/5 shadow-[0_10px_40px_rgba(0,0,0,0.65)] rounded-xl z-50 
                flex flex-col overflow-hidden transition-all duration-200 ease-out origin-top-right backdrop-blur-md
                ${isDropdownOpen
                ? "opacity-100 scale-100 pointer-events-auto visible"
                : "opacity-0 scale-95 pointer-events-none invisible"
            }`}
                 style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
            >
                <div
                    className="absolute top-0 right-0 w-72 h-36 bg-blue-500/2 rounded-full filter blur-3xl pointer-events-none"
                />

                {/* Encabezado del Panel */}
                <div className="px-[clamp(1rem,1.2vw,1.4rem)] py-[clamp(0.8rem,1vw,1.2rem)] flex items-center justify-between select-none relative z-10">
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-white/5 pointer-events-none" />

                    <span className="text-[clamp(11px,0.6vw,12px)] font-semibold tracking-wide text-gray-400 normal-case">
                        Panel de notificaciones
                    </span>

                    <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-medium normal-case tracking-wide bg-blue-500/10 border border-blue-500/20 text-blue-400 animate-pulse">
                                {unreadCount} nuevas
                            </span>
                        )}

                        {notifications.length > 0 && !loading && !error && (
                            <ActionButton
                                variant="danger"
                                icon={Trash2}
                                isLoading={isProcessingAll}
                                onClick={async () => {
                                    await new Promise(resolve => setTimeout(resolve, 350));
                                    void onDeleteAllNotifications();
                                }}
                                className="w-auto px-2.5 h-7 text-[11px] font-medium tracking-wide normal-case rounded-lg shadow-sm"
                            >
                                Vaciar
                            </ActionButton>
                        )}
                    </div>
                </div>

                {/* Listado / Cuerpo */}
                <div className="flex-1 p-[clamp(1rem,1.2vw,1.4rem)] min-h-[clamp(12rem,16vw,18rem)] flex flex-col justify-center relative z-10">
                    {loading && notifications.length === 0 ? (
                        <LoadingScreen />
                    ) : error ? (
                        <RetryScreen onRetry={retry} />
                    ) : notifications.length === 0 ? (
                        <EmptyScreen label="No se encontraron notificaciones disponibles." />
                    ) : (
                        <div
                            className={`w-full space-y-3 max-h-[clamp(16rem,24vw,28rem)] overflow-y-auto no-scrollbar px-0.5 py-0.5 flex-1 transition-opacity duration-200 ${
                                isBackgroundLoading ? "opacity-50 pointer-events-none" : "opacity-100"
                            }`}
                        >
                            {notifications.map((n) => (
                                <NotificationItem
                                    key={n.id}
                                    notif={n}
                                    onAction={handleAction}
                                    onSelect={onSelect}
                                    isDisabled={isProcessing || isProcessingAll}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Paginación Inferior */}
                {(!loading || notifications.length > 0) && !error && notifications.length > 0 && (
                    <div className="px-[clamp(1rem,1.2vw,1.4rem)] py-[clamp(0.8rem,1vw,1.2rem)] select-none w-full relative z-10">
                        <div className="absolute top-0 left-0 right-0 h-px bg-white/5 pointer-events-none" />

                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            totalElements={totalElements}
                            loading={loading || isBackgroundLoading}
                            onForceLoading={forceLoading}
                            onPageChange={(newPage) => setPage(() => newPage)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}