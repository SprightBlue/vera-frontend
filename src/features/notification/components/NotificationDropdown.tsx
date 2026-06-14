import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { type AppNotification } from "../api/notifications";
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
                className={`relative p-2 text-slate-400 hover:text-white transition-all duration-200 rounded-full hover:bg-white/5 
                    ${isRinging ? 'animate-bell-ring text-red-500 bg-red-500/10 scale-110' : ''}
                `}
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                )}
            </button>

            {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-96 max-h-100 overflow-y-auto bg-slate-950 border border-slate-800 rounded-xl p-2 shadow-2xl z-50">
                    <h4 className="px-4 py-2 text-white font-semibold border-b border-white/5">Notificaciones</h4>
                    <div className="flex flex-col gap-1.5 mt-2">
                        {notifications.length === 0 ? (
                            <p className="text-sm text-slate-500 text-center py-6">No hay notificaciones pendientes.</p>
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