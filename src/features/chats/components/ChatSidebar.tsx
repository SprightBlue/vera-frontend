import { useState, type MouseEvent } from "react";
import { MessageSquare, Plus, Trash2, History, Loader2 } from "lucide-react";
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
        <aside className="w-[clamp(14rem,18vw,18rem)] bg-[#0c1020] border-l border-[#161f38] flex flex-col h-full shrink-0 select-none overflow-hidden transition-all duration-300">
            <div className="p-4 border-b border-[#161f38] flex-none">
                <button
                    onClick={onNewChat}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:brightness-110 text-white text-[clamp(0.85rem,1vw,0.95rem)] font-semibold transition-all active:scale-[0.98] shadow-lg shadow-blue-600/10 cursor-pointer"
                >
                    <Plus size={16} />
                    <span>Nueva consulta</span>
                </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto p-4 custom-scrollbar">
                <div className="px-4 mb-3 text-[0.7rem] uppercase tracking-wider text-slate-500 font-bold flex items-center gap-2">
                    <History size={12} /> Historial
                </div>

                <div className="flex flex-col gap-1.5">
                    {sessions.map((session) => {
                        const isActive = activeChatId === session.id;
                        const isThisDeleting = deletingId === session.id;

                        return (
                            <button
                                key={session.id}
                                onClick={() => !isThisDeleting && onSelectChat(session.id)}
                                disabled={isThisDeleting}
                                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-[clamp(0.85rem,1vw,0.95rem)] font-medium border transition-all duration-200 group relative cursor-pointer ${
                                    isActive
                                        ? "bg-[#070B1A] text-blue-500 border-blue-500/20 shadow-sm"
                                        : "text-slate-400 border-transparent hover:bg-[#070B1A]/50 hover:text-white"
                                } ${isThisDeleting ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                <MessageSquare
                                    size="1.25rem"
                                    className={`shrink-0 transition-colors ${
                                        isActive ? "text-blue-500" : "text-slate-400 group-hover:text-white"
                                    }`}
                                />

                                <span className="truncate flex-1 text-left">{session.title}</span>

                                <div className="shrink-0 min-w-4 flex items-center justify-center">
                                    {isThisDeleting ? (
                                        <Loader2 size={14} className="text-red-400 animate-spin" />
                                    ) : (
                                        <Trash2
                                            size={14}
                                            onClick={(e) => handleDirectDelete(e, session.id)}
                                            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-400 transition-all duration-200 cursor-pointer transform hover:scale-110"
                                        />
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