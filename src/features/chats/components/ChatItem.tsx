import { type MouseEvent } from "react";
import { Trash2 } from "lucide-react";
import type { ChatSession } from "@/features/chats/api/chatApi";

import { UI_BUTTON_STYLES } from '@/features/shared/utils/styleConfig';

interface ChatSidebarItemProps {
    session: ChatSession;
    isActive: boolean;
    isDeleting: boolean;
    onSelectChat: (id: string) => void;
    onDeleteChat: (e: MouseEvent<HTMLButtonElement>, id: string) => void;
}

export function ChatItem({
                             session,
                             isActive,
                             isDeleting,
                             onSelectChat,
                             onDeleteChat
                         }: ChatSidebarItemProps) {

    const dangerButtonStyle = UI_BUTTON_STYLES['danger'];

    return (
        <button
            onClick={() => !isDeleting && onSelectChat(session.id)}
            disabled={isDeleting}
            className={`w-full flex items-center justify-between gap-[clamp(0.5rem,0.8vw,0.88rem)] px-[clamp(0.6rem,0.8vw,1rem)] py-[clamp(0.65rem,0.8vw,0.85rem)] rounded-xl border relative group transition-all duration-200 overflow-hidden active:scale-[0.98] ${
                isActive
                    ? "bg-[#0D6EFD]/10 text-[#0D6EFD] border-[#0D6EFD]/20 shadow-[0_0_12px_rgba(13,110,253,0.05)] font-semibold"
                    : "text-gray-400 border-transparent hover:text-white hover:bg-white/5 font-medium"
            } ${
                isDeleting
                    ? "cursor-wait bg-white/5 text-gray-500 border-white/5 pointer-events-none opacity-40"
                    : "cursor-pointer"
            }`}
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
            title={session.title}
        >
            {/* Línea brillante superior sutil */}
            <div
                className={`absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent to-transparent pointer-events-none transition-all duration-500 z-20 ${
                    isActive ? "via-blue-400/40" : "via-transparent group-hover:via-white/10"
                }`}/>

            {/* Esquina con Glow de fondo */}
            <div
                className={`absolute -top-6 -right-6 w-16 h-16 rounded-full filter blur-md pointer-events-none transform origin-top-right transition-all duration-500 ease-out z-0 ${
                    isActive
                        ? "opacity-10 scale-125 bg-blue-500"
                        : "opacity-0 scale-75 bg-blue-500 group-hover:opacity-5 group-hover:scale-110"
                }`}/>

            {/* Indicador visual izquierdo */}
            <span className={`absolute left-0 top-2 bottom-2 w-1 rounded-r transition-all duration-300 z-20 ${
                isActive ? "bg-[#0D6EFD]" : "bg-transparent group-hover:bg-white/20"
            }`}/>

            {/* Texto truncado sin mayúsculas forzadas */}
            <span
                className="truncate flex-1 text-left relative z-10 text-[clamp(12px,0.78vw,13.5px)] normal-case tracking-wide transition-colors duration-200">
                {session.title}
            </span>

            <div className="shrink-0 w-8 h-8 flex items-center justify-center relative z-30">
                <button
                    type="button"
                    disabled={isDeleting}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (!isDeleting) onDeleteChat(e, session.id);
                    }}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                    className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 select-none outline-none focus:outline-none focus:ring-0 active:ring-0 border-0 shadow-md ${
                        isDeleting
                            ? "bg-red-600 text-white shadow-[0_0_12px_rgba(220,38,38,0.4)] cursor-not-allowed opacity-100 scale-100"
                            : `${dangerButtonStyle} text-white shadow-[0_0_12px_rgba(220,38,38,0.4)] hover:shadow-[0_0_16px_rgba(220,38,38,0.6)] active:shadow-none active:scale-90 cursor-pointer opacity-0 group-hover:opacity-100 xl:opacity-0`
                    }`}
                    title="Eliminar Chat"
                >
                    {isDeleting ? (
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <Trash2
                            className="w-3.5 h-3.5 stroke-[2.5]"
                        />
                    )}
                </button>
            </div>
        </button>
    );
}