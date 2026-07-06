import { useState, type MouseEvent } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import type { ChatSession } from "@/features/chats/api/chatApi.ts";

interface ChatSidebarProps {
    sessions: ChatSession[];
    activeChatId: string | null;
    onSelectChat: (id: string) => void;
    onNewChat: () => void;
    onDeleteChat: (id: string) => Promise<void>;
}

function ChatSidebar({ sessions, activeChatId, onSelectChat, onNewChat, onDeleteChat }: ChatSidebarProps) {
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDirectDelete = async (e: MouseEvent<HTMLButtonElement | SVGElement>, id: string) => {
        e.stopPropagation();
        if (deletingId) return;

        setDeletingId(id);
        await onDeleteChat(id);
        setDeletingId(null);
    };

    return (
        <aside className="w-full bg-[#050816] flex flex-col h-full shrink-0 select-none overflow-hidden font-sans border-r border-[#182033]/20">
            <div className="p-4 border-b border-[#182033]/40 flex-none">
                <button
                    onClick={onNewChat}
                    className="w-full flex items-center justify-center gap-1.5 h-10 rounded-xl bg-blue-600/10 hover:bg-blue-600/15 border border-blue-500/20 text-blue-400 text-[clamp(10px,0.65vw,12px)] font-bold tracking-wider uppercase transition-all duration-150 active:scale-[0.98] cursor-pointer"
                >
                    <Plus size={12} className="stroke-[2.5]" />
                    <span>Nueva consulta</span>
                </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto p-3 no-scrollbar">
                <div className="px-3 mb-2.5 text-[clamp(9px,0.55vw,11px)] uppercase tracking-widest text-slate-600 font-bold">
                    Historial de Consultas
                </div>

                <div className="flex flex-col gap-1">
                    {sessions.map((session) => {
                        const isActive = activeChatId === session.id;
                        const isThisDeleting = deletingId === session.id;

                        return (
                            <button
                                key={session.id}
                                onClick={() => !isThisDeleting && onSelectChat(session.id)}
                                disabled={isThisDeleting}
                                className={`w-full flex items-center justify-between px-4 h-11 rounded-xl text-[clamp(0.78rem,0.82vw,0.92rem)] font-medium transition-all duration-200 group relative cursor-pointer border ${
                                    isActive
                                        ? "bg-linear-to-r from-[#131b35] to-[#070B1A] text-white border-[#182033] shadow-md"
                                        : "text-slate-500 border-transparent hover:bg-[#131b35]/40 hover:text-slate-300"
                                } ${isThisDeleting ? "opacity-40 cursor-not-allowed" : ""}`}
                                title={session.title}
                            >
                                {isActive && (
                                    <span className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-blue-500 rounded-r-md" />
                                )}

                                <span className="truncate flex-1 text-left pr-2">
                                    {session.title}
                                </span>

                                <div className="shrink-0 w-4 h-4 flex items-center justify-center relative z-10">
                                    {isThisDeleting ? (
                                        <Loader2 size={11} className="text-red-400 animate-spin" />
                                    ) : (
                                        <span title="Eliminar Chat" className="flex items-center justify-center">
                                            <Trash2
                                                size={12}
                                                onClick={(e) => handleDirectDelete(e, session.id)}
                                                className="opacity-0 group-hover:opacity-100 xl:opacity-0 text-slate-500 hover:text-red-400/80 transition-all cursor-pointer transform hover:scale-105"
                                            />
                                        </span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </aside>
    );
}

export default ChatSidebar;