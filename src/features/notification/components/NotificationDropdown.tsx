import { useState, useEffect, useRef } from "react";
import { Bell, AlertCircle } from "lucide-react";
import { type AppNotification } from "../api/notifications.ts";
import { NotificationItem } from "./NotificationItem";

interface DropdownProps {
    notifications: AppNotification[];
    isRinging: boolean;
    handleAction: (notif: AppNotification, action: 'ACCEPT' | 'REJECT' | 'DELETE') => void;
    onSelect: (notif: AppNotification) => void;
    onOpen: () => void;
}

export function NotificationDropdown({ notifications, isRinging, handleAction, onSelect, onOpen }: DropdownProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const unreadCount = isDropdownOpen ? 0 : notifications.filter(n => !n.isRead).length;

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleDropdown = () => {
        if (!isDropdownOpen) onOpen();
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={toggleDropdown}
                className={`relative p-2.5 transition-all duration-300 rounded-xl cursor-pointer ${
                    isDropdownOpen ? 'bg-slate-800/50 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                } ${isRinging ? 'animate-pulse text-red-500 bg-red-500/10' : ''}`}
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-500 rounded-full ring-2 ring-[#050816]" />
                )}
            </button>

            {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-[430px] max-h-[80vh] overflow-hidden bg-[#050816] border border-slate-800 rounded-2xl shadow-2xl z-50 flex flex-col animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-5 py-4 border-b border-slate-800 bg-[#070B1A]">
                        <h4 className="text-white font-bold tracking-wide">Notificaciones</h4>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 custom-scrollbar space-y-2">
                        {notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-slate-500 gap-2">
                                <AlertCircle size={24} className="opacity-20" />
                                <p className="text-xs">No hay alertas pendientes.</p>
                            </div>
                        ) : (
                            notifications.map((n) => (
                                <NotificationItem
                                    key={n.id}
                                    notif={n}
                                    onAction={handleAction}
                                    onSelect={onSelect}
                                />
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}