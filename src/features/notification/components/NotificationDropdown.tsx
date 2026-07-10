import { Bell, History, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { type AppNotification } from "@/features/notification/api/notificationsApi.ts";
import NotificationItem from "@/features/notification/components/NotificationItem";
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
                                         isDropdownOpen,
                                         dropdownRef,
                                         toggleDropdown,
                                         forceLoading,
                                         handleAction,
                                         onSelect
                                     }: DropdownProps) {
    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={toggleDropdown}
                className={`relative p-2.5 transition-all duration-300 rounded-xl cursor-pointer border ${
                    isDropdownOpen
                        ? 'bg-[#0a0f24] border-[#182033] text-white shadow-md shadow-black/40'
                        : 'text-slate-400 border-transparent hover:text-white hover:bg-[#070B1A]/60'
                } ${isRinging ? 'animate-pulse text-red-400 bg-red-500/20 border-red-500/50 shadow-[0_0_25px_rgba(239,68,68,0.45)] scale-105' : ''}`}
            >
                {isRinging && (
                    <span className="absolute inset-0 rounded-xl bg-red-500/30 animate-ping duration-1000 pointer-events-none" />
                )}
                <Bell className={`w-[1.2rem] h-[1.2rem] transition-transform ${isRinging ? 'scale-110' : ''}`} />
                {unreadCount > 0 && (
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-400 rounded-full ring-2 ring-[#050816] animate-pulse" />
                )}
            </button>

            {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-[clamp(22rem,42vw,48rem)] bg-[#0d1326] border border-[#1e294b] rounded-2xl shadow-[0_30px_80px_-10px_rgba(0,0,0,0.98)] ring-1 ring-slate-700/30 z-50 flex flex-col animate-fade-in duration-150">

                    <div className="px-[clamp(1rem,1.3vw,1.8rem)] py-[clamp(0.8rem,1vw,1.3rem)] border-b border-[#1e294b] bg-[#0a0f24]/80 flex items-center justify-between select-none rounded-t-2xl">
                        <span className="text-[clamp(9.5px,0.6vw,13px)] font-bold tracking-widest text-slate-300 uppercase">
                            Panel de Notificaciones
                        </span>
                        {unreadCount > 0 && (
                            <span className="px-2.5 py-0.5 rounded-md text-[clamp(8.5px,0.55vw,11px)] font-black uppercase tracking-widest bg-blue-500/20 border border-blue-500/40 text-blue-400">
                                {unreadCount} Notificaciones Nuevas
                            </span>
                        )}
                    </div>

                    <div className="flex-1 p-[clamp(0.8rem,1.2vw,1.5rem)] bg-[#0d1326]">
                        {loading ? (
                            <div className="w-full flex flex-col items-center justify-center py-[clamp(4rem,8vw,10rem)] select-none animate-fade-in">
                                <Loader2 className="text-blue-500 animate-spin stroke-[1.5] mb-2 w-[clamp(1.1rem,1.3vw,2rem)] h-[clamp(1.1rem,1.3vw,2rem)]" />
                                <span className="text-[clamp(9px,0.55vw,12px)] font-bold text-slate-500 tracking-widest uppercase animate-pulse">
                                    Cargando
                                </span>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="w-full flex flex-col items-center justify-center py-[clamp(4rem,8vw,10rem)] select-none gap-2">
                                <History className="text-slate-600 mb-1 w-[clamp(1.1rem,1.3vw,2rem)] h-[clamp(1.1rem,1.3vw,2rem)] stroke-2" />
                                <span className="text-[clamp(9.5px,0.58vw,12.5px)] font-bold text-slate-600 tracking-widest uppercase">
                                    Historial Vacío
                                </span>
                            </div>
                        ) : (
                            <div className="w-full space-y-3 max-h-[clamp(18rem,26vw,36rem)] overflow-y-auto no-scrollbar pr-0.5 animate-fade-in">
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

                    {!loading && notifications.length > 0 && (
                        <div className="flex items-center justify-between px-[clamp(1rem,1.3vw,1.8rem)] py-[clamp(0.8rem,1vw,1.3rem)] border-t border-[#1e294b] bg-[#0a0f24]/50 select-none w-full rounded-b-2xl">
                            <span className="text-[clamp(9.5px,0.6vw,13px)] text-slate-400 font-bold tracking-wider uppercase">
                                Página {page + 1} de {Math.max(1, totalPages)} • Elementos: {totalElements}
                            </span>

                            <div className="flex gap-2">
                                <button
                                    disabled={page <= 0 || loading}
                                    onClick={() => { forceLoading(); setPage((prev) => Math.max(0, prev - 1)); }}
                                    className="p-[clamp(0.4rem,0.6vw,0.8rem)] bg-[#0a0f24] hover:bg-[#131b35]/60 border border-[#182033] rounded-xl disabled:opacity-10 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center"
                                >
                                    <ChevronLeft className="text-slate-400 w-[clamp(12px,0.75vw,18px)] h-[clamp(12px,0.75vw,18px)]" />
                                </button>
                                <button
                                    disabled={page >= totalPages - 1 || totalPages <= 1 || loading}
                                    onClick={() => { forceLoading(); setPage((prev) => Math.min(totalPages - 1, prev + 1)); }}
                                    className="p-[clamp(0.4rem,0.6vw,0.8rem)] bg-[#0a0f24] hover:bg-[#131b35]/60 border border-[#182033] rounded-xl disabled:opacity-10 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center"
                                >
                                    <ChevronRight className="text-slate-400 w-[clamp(12px,0.75vw,18px)] h-[clamp(12px,0.75vw,18px)]" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default NotificationDropdown;