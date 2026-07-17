import { Bell } from "lucide-react";

interface NotificationBellProps {
    isOpen: boolean;
    isRinging: boolean;
    unreadCount: number;
    onClick: () => void;
}

export function NotificationBell({ isOpen, isRinging, unreadCount, onClick }: NotificationBellProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`relative p-2.5 transition-all duration-300 rounded-full cursor-pointer border group overflow-hidden select-none active:scale-[0.96] ${
                isOpen
                    ? 'bg-[#0B0D17] border-white/10 text-white shadow-[0_4px_15px_rgba(0,0,0,0.4)]'
                    : 'text-slate-400 border-transparent hover:border-white/5 hover:bg-[#0B0D17]/50 hover:text-slate-200'
            } ${
                isRinging
                    ? 'animate-pulse text-blue-400 bg-blue-500/10 border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.2)]'
                    : ''
            }`}
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
            <div
                className={`absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent to-transparent pointer-events-none transition-all duration-500 z-20 ${
                    isOpen ? "via-blue-400/30" : "via-transparent group-hover:via-white/10"
                }`}
            />

            <div
                className={`absolute -top-5 -right-5 w-12 h-12 rounded-full filter blur-md pointer-events-none transform origin-top-right transition-all duration-500 ease-out z-0 ${
                    isOpen
                        ? "opacity-10 scale-125 bg-blue-500"
                        : "opacity-0 scale-75 bg-slate-500 group-hover:opacity-5 group-hover:scale-110"
                }`}
            />

            {isRinging && (
                <span
                    className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping duration-1000 pointer-events-none"
                />
            )}

            <Bell
                size={15}
                className={`transition-all duration-300 relative z-10 ${
                    isRinging
                        ? 'scale-110 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]'
                        : 'group-hover:scale-105 group-hover:text-slate-200'
                }`}
            />

            {unreadCount > 0 && (
                <span className="absolute top-2 right-2 flex h-2 w-2 z-20">
                    <span
                        className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"
                    />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                </span>
            )}
        </button>
    );
}