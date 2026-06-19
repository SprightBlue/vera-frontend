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
        <div className="w-72 border-r border-slate-900 bg-slate-900/30 backdrop-blur-md flex flex-col h-full min-h-0 shrink-0 font-inter">

            <div className="p-4 border-b border-slate-900/60 shrink-0">
                <button
                    onClick={onNewChat}
                    className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-blue-600 hover:brightness-110 text-white text-sm font-semibold shadow-lg shadow-blue-600/10 transition-all duration-300 cursor-pointer"
                >
                    <Plus size={16} className="stroke-[2.5]" />
                    Nueva consulta VERA
                </button>
            </div>

            <div className="flex-1 overflow-y-auto h-full p-3 space-y-1.5 custom-scrollbar">

                <div className="flex items-center gap-2 px-3 mb-3 sticky top-0 bg-[#050816]/90 backdrop-blur-sm py-1.5 z-10 select-none">
                    <History size={12} className="text-slate-500" />
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold font-montserrat">
                        Consultas Recientes
                    </p>
                </div>

                {sessions.length === 0 ? (
                    <div className="px-3 py-4 text-center border border-dashed border-slate-800/60 rounded-xl bg-slate-950/20">
                        <p className="text-xs text-slate-500 italic">No hay consultas previas.</p>
                    </div>
                ) : (
                    sessions.map((session) => {
                        const isActive = activeChatId === session.id;
                        return (
                            <div
                                key={session.id}
                                onClick={() => onSelectChat(session.id)}
                                className={`w-full flex items-center justify-between gap-2 px-3.5 py-3 rounded-xl transition-all duration-200 group cursor-pointer border analysis-appear ${
                                    isActive
                                        ? "bg-slate-900/60 border-blue-500/40 text-white shadow-md shadow-blue-500/5"
                                        : "border-transparent text-slate-400 hover:bg-slate-900/30 hover:text-slate-100"
                                }`}
                            >
                                <div className="flex items-start gap-3 min-w-0 flex-1">
                                    <MessageSquare
                                        size={15}
                                        className={`mt-0.5 shrink-0 transition-colors ${
                                            isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-400"
                                        }`}
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium truncate leading-tight tracking-wide">
                                            {session.title}
                                        </p>
                                        <span className="text-[10px] text-slate-500 block mt-1 font-mono">
                                            {new Date(session.createdAt).toLocaleDateString(undefined, {
                                                day: 'numeric',
                                                month: 'short'
                                            })}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={(e) => handleDeleteClick(e, session.id)}
                                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all duration-150 cursor-pointer shrink-0"
                                    title="Eliminar del historial"
                                >
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        );
                    })
                )}
            </div>

            <div className="p-3 border-t border-slate-900/40 bg-slate-950/20 shrink-0 flex items-center gap-2 justify-center text-[10px] text-slate-600 select-none">
                <Shield size={11} className="text-slate-600" />
                <span className="font-montserrat uppercase tracking-wider font-semibold">Asistente Inteligente VERA</span>
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