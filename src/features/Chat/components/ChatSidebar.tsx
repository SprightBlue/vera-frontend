import { useState, type MouseEvent } from "react";
import { MessageSquare, Plus, Trash2, Shield, History } from "lucide-react";
import { ChatDeleteModal } from "./ChatDeleteModal";

export interface ChatSession {
    id: string;
    title: string;
    createdAt: string;
}

interface ChatSidebarProps {
    sessions: ChatSession[];
    activeChatId: string | null;
    onSelectChat: (id: string) => void;
    onNewChat: () => void;
    onDeleteChat: (id: string) => Promise<void>;
}

export function ChatSidebar({ sessions, activeChatId, onSelectChat, onNewChat, onDeleteChat }: ChatSidebarProps) {
    const [chatIdToDelete, setChatIdToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const handleDeleteClick = (e: MouseEvent, id: string) => {
        e.stopPropagation();
        setChatIdToDelete(id);
    };

    const handleConfirmDelete = async () => {
        if (!chatIdToDelete) return;
        try {
            setIsDeleting(true);
            await onDeleteChat(chatIdToDelete);
        } catch (error) {
            console.error("Error al borrar el chat:", error);
        } finally {
            setIsDeleting(false);
            setChatIdToDelete(null);
        }
    };

    return (
        <div className="w-72 border-r border-slate-900 bg-[#070B1A] flex flex-col h-full min-h-0 shrink-0 font-inter">
            <div className="p-4 border-b border-slate-900/60 shrink-0">
                <button
                    onClick={onNewChat}
                    className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-blue-600/90 hover:bg-blue-600 text-white text-sm font-semibold shadow-[0_0_20px_-5px_rgba(37,99,235,0.3)] hover:shadow-blue-600/20 transition-all duration-300 active:scale-[0.98] cursor-pointer border border-blue-500/20"
                >
                    <Plus size={16} className="stroke-[2.5]" />
                    Nueva consulta VERA
                </button>
            </div>

            <div className="flex-1 overflow-y-auto h-full p-3 space-y-1.5 custom-scrollbar">
                <div className="flex items-center gap-2 px-3 mb-2 sticky top-0 bg-[#070B1A]/90 backdrop-blur-md py-2 z-10 select-none">
                    <History size={11} className="text-slate-500" />
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                        Historial reciente
                    </p>
                </div>

                {sessions.length === 0 ? (
                    <div className="px-3 py-6 text-center border border-dashed border-slate-800 rounded-xl bg-slate-900/10">
                        <p className="text-xs text-slate-600 italic">No hay consultas registradas</p>
                    </div>
                ) : (
                    sessions.map((session) => {
                        const isActive = activeChatId === session.id;
                        return (
                            <div
                                key={session.id}
                                onClick={() => onSelectChat(session.id)}
                                className={`w-full flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl transition-all duration-300 group cursor-pointer border ${
                                    isActive
                                        ? "bg-slate-900/80 border-slate-700/50 shadow-inner text-white"
                                        : "border-transparent text-slate-400 hover:bg-slate-900/40 hover:border-slate-800/50"
                                }`}
                            >
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <MessageSquare
                                        size={14}
                                        className={`transition-colors ${isActive ? "text-blue-500" : "text-slate-600 group-hover:text-slate-400"}`}
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className={`text-[13px] font-medium truncate ${isActive ? "text-slate-100" : "text-slate-400"}`}>
                                            {session.title}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={(e) => handleDeleteClick(e, session.id)}
                                    className={`p-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
                                        isActive ? "text-slate-400 hover:text-red-400" : "text-transparent group-hover:text-slate-500 hover:text-red-400!"
                                    }`}
                                >
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        );
                    })
                )}
            </div>

            <div className="p-4 border-t border-slate-900/50 bg-[#070B1A] shrink-0 text-center">
                <div className="flex items-center justify-center gap-2 text-[10px] text-slate-600 uppercase tracking-wider font-bold">
                    <Shield size={10} />
                    VERA Security
                </div>
            </div>

            <ChatDeleteModal
                isOpen={chatIdToDelete !== null}
                isProcessing={isDeleting}
                onClose={() => setChatIdToDelete(null)}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
}