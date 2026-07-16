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
            className={`w-full flex items-center justify-between gap-[clamp(0.5rem,0.8vw,0.88rem)] px-[clamp(0.6rem,0.8vw,1rem)] py-[clamp(0.65rem,0.8vw,0.85rem)] rounded-lg border relative group transition-all duration-300 overflow-hidden active:scale-[0.97] ${
                isActive
                    ? "bg-linear-to-b from-[#0e1630] to-[#060a18] text-white border-[#22356b] shadow-[0_4px_20px_rgba(0,0,0,0.35)] ring-1 ring-inset ring-blue-500/20"
                    : "text-slate-400 border-transparent hover:border-[#161f37] hover:bg-linear-to-b hover:from-[#080d20]/50 hover:to-[#040714]/30 hover:text-slate-200"
            } ${
                isDeleting
                    ? "cursor-wait bg-[#0d1326]/20 text-slate-500 border-slate-800/30 pointer-events-none opacity-40"
                    : "cursor-pointer"
            }`}
            title={session.title}
        >
            <div
                className={`absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent to-transparent pointer-events-none transition-all duration-500 z-20 ${
                    isActive ? "via-blue-400/40" : "via-transparent group-hover:via-slate-500/20"
                }`}/>

            <div
                className={`absolute -top-6 -right-6 w-16 h-16 rounded-full filter blur-md pointer-events-none transform origin-top-right transition-all duration-500 ease-out z-0 ${
                    isActive
                        ? "opacity-20 scale-125 bg-blue-500"
                        : "opacity-0 scale-75 bg-slate-500 group-hover:opacity-10 group-hover:scale-110"
                }`}/>

            <span className={`absolute left-0 top-1 bottom-1 w-0.75 rounded-r transition-all duration-300 z-20 ${
                isActive ? "bg-blue-500 shadow-[0_0_12px_#3b82f6]" : "bg-transparent group-hover:bg-slate-700"
            }`}/>

            <span
                className="truncate flex-1 text-left relative z-10 font-sans font-medium text-[clamp(12px,0.78vw,13px)] tracking-wide transition-colors duration-300">
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