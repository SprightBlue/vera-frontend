import { Bell } from "lucide-react";
import { type AppNotification } from "@/features/notification/api/notificationsApi.ts";
import { NotificationItem } from "@/features/notification/components/NotificationItem";
import { LoadingScreen } from "@/features/shared/components/LoadingScreen";
import { RetryScreen } from "@/features/shared/components/RetryScreen";
import { EmptyCard } from "@/features/shared/components/EmptyCard";
import { Pagination } from "@/features/shared/components/Pagination";
import type { RefObject } from "react";

interface DropdownProps {
    notifications: AppNotification[];
    totalPages: number;
    totalElements: number;
    page: number;
    setPage: (page: (prev: number) => number) => void;
    unreadCount: number;
    isRinging: boolean;
    loading: boolean;
    error?: boolean;
    refetch?: () => void;
    isDropdownOpen: boolean;
    dropdownRef: RefObject<HTMLDivElement | null>;
    toggleDropdown: () => void;
    forceLoading: () => void;
    handleAction: (notif: AppNotification, action: 'ACCEPT' | 'REJECT' | 'DELETE') => void;
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
                                         error,
                                         refetch,
                                         isDropdownOpen,
                                         dropdownRef,
                                         toggleDropdown,
                                         forceLoading,
                                         handleAction,
                                         onSelect
                                     }: DropdownProps) {
    return (
        <div className="relative z-40" ref={dropdownRef}>

            <button
                type="button"
                onClick={toggleDropdown}
                className={`relative p-2.5 transition-all duration-300 rounded-xl cursor-pointer border group overflow-hidden select-none active:scale-[0.96] ${
                    isDropdownOpen
                        ? 'bg-blue-500/10 border-blue-500/30 text-white shadow-[0_0_20px_rgba(59,130,246,0.12)] ring-1 ring-inset ring-blue-500/20'
                        : 'text-slate-400 border-transparent hover:border-blue-500/20 hover:bg-[#1c2541]/40 hover:text-white'
                } ${isRinging ? 'animate-pulse text-red-400 bg-red-500/20 border-red-500/50 shadow-[0_0_25px_rgba(239,68,68,0.45)] scale-105' : ''}`}
            >
                <div className={`absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent to-transparent pointer-events-none transition-all duration-300 ${
                    isDropdownOpen ? "via-blue-400/40" : "via-transparent group-hover:via-blue-400/25"
                }`} />

                <div className={`absolute -top-5 -right-5 w-12 h-12 rounded-full filter blur-[10px] pointer-events-none transform origin-top-right transition-all duration-500 ease-out z-0 ${
                    isDropdownOpen
                        ? "opacity-25 scale-110 bg-blue-500"
                        : "opacity-0 scale-75 bg-blue-500 group-hover:opacity-15 group-hover:scale-110"
                }`} />

                {isRinging && (
                    <span className="absolute inset-0 rounded-xl bg-red-500/30 animate-ping duration-1000 pointer-events-none" />
                )}

                <Bell className={`w-[1.2rem] h-[1.2rem] transition-transform relative z-10 ${isRinging ? 'scale-110' : 'group-hover:scale-105'}`} />

                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 flex h-2 w-2 z-20">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400 ring-1 ring-[#1c2541]" />
                    </span>
                )}
            </button>

            <div className={`absolute right-0 mt-3 w-[clamp(20rem,42vw,44rem)] bg-linear-to-b from-[#0a1026] to-[#050816] border-blue-500/30 ring-1 ring-inset ring-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.12)] rounded-xl z-100 flex flex-col overflow-hidden transition-all duration-200 ease-out origin-top-right backdrop-blur-md
                ${isDropdownOpen
                ? "opacity-100 scale-100 pointer-events-auto visible"
                : "opacity-0 scale-95 pointer-events-none invisible"
            }`}
            >
                <div className="absolute top-0 right-0 w-80 h-40 bg-blue-400/5 rounded-full filter blur-3xl pointer-events-none" />

                <div className="px-[clamp(1.1rem,1.4vw,1.6rem)] py-[clamp(0.8rem,1vw,1.2rem)] border-b border-blue-500/20 flex items-center justify-between select-none relative z-10 pl-6">
                    <span className="text-[clamp(10px,0.65vw,12.5px)] font-sans font-semibold tracking-[0.16em] text-white uppercase">
                        Panel de Notificaciones
                    </span>
                    {unreadCount > 0 && (
                        <span className="px-2.5 py-0.5 rounded-md text-[clamp(8px,0.5vw,10px)] font-sans font-bold uppercase tracking-widest bg-blue-500/10 border border-blue-500/20 text-blue-400 animate-pulse">
                            {unreadCount} Nuevas
                        </span>
                    )}
                </div>

                <div className="flex-1 p-[clamp(1rem,1.2vw,1.4rem)] min-h-55 flex flex-col justify-center relative z-10 pl-6">
                    {loading ? (
                        <LoadingScreen />
                    ) : error ? (
                        <RetryScreen onRetry={refetch || forceLoading} />
                    ) : notifications.length === 0 ? (
                        <EmptyCard
                            title="Sin alertas pendientes"
                            description="Tu bandeja de entrada se encuentra totalmente limpia."
                            className="border-none bg-transparent shadow-none"
                        />
                    ) : (
                        <div className="w-full space-y-3 max-h-[clamp(16rem,24vw,32rem)] overflow-y-auto no-scrollbar pr-0.5 flex-1">
                            {notifications.map((n) => (
                                <NotificationItem
                                    key={n.id}
                                    notif={n}
                                    onAction={handleAction}
                                    onSelect={onSelect}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {!loading && !error && notifications.length > 0 && (
                    <div className="px-[clamp(1.1rem,1.4vw,1.6rem)] py-[clamp(0.8rem,1vw,1.2rem)] select-none w-full relative z-10 pl-6">
                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            totalElements={totalElements}
                            loading={loading}
                            onForceLoading={forceLoading}
                            onPageChange={(newPage) => setPage(() => newPage)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}