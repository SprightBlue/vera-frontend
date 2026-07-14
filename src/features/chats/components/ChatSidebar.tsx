import {type MouseEvent} from "react";
import {Plus, History} from "lucide-react";
import type {ChatSession} from "@/features/chats/api/chatApi";
import {ActionButton} from "@/features/shared/components/ActionButton";
import {LoadingScreen} from "@/features/shared/components/LoadingScreen";
import {RetryScreen} from "@/features/shared/components/RetryScreen";
import {EmptyScreen} from "@/features/shared/components/EmptyScreen";
import {ChatItem} from "@/features/chats/components/ChatItem";

interface ChatSidebarProps {
    sessions: ChatSession[];
    activeChatId: string | null;
    isLoading: boolean;
    error: unknown;
    deletingSessionIds: string[];
    onRetry: () => void;
    onSelectChat: (id: string) => void;
    onNewChat: () => void;
    onDeleteChat: (id: string) => Promise<void>;
}

export function ChatSidebar({
                                sessions,
                                activeChatId,
                                isLoading,
                                error,
                                deletingSessionIds,
                                onRetry,
                                onSelectChat,
                                onNewChat,
                                onDeleteChat
                            }: ChatSidebarProps) {

    const handleDirectDelete = async (e: MouseEvent<HTMLButtonElement>, id: string) => {
        e.stopPropagation();
        if (deletingSessionIds.includes(id)) return;
        await onDeleteChat(id);
    };

    return (
        <aside
            className="w-full bg-linear-to-b from-[#050814] via-[#03050f] to-[#010206] border-r border-[#161f37]/90 flex flex-col h-full shrink-0 select-none overflow-hidden relative shadow-2xl">
            <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-blue-500/2 rounded-full filter blur-[80px] pointer-events-none z-0"/>

            <div className="p-[clamp(0.8rem,1vw,1.2rem)] flex-none relative z-10">
                <ActionButton
                    variant="info"
                    onClick={onNewChat}
                    icon={Plus}
                    disabled={isLoading}
                    className="w-full sm:w-full"
                >
                    Nuevo Chat
                </ActionButton>
            </div>

            <div className="px-[clamp(0.8rem,1vw,1.2rem)] flex-none relative z-10">
                <div
                    className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-slate-500/10 to-transparent pointer-events-none"/>
            </div>

            <div
                className="flex-1 min-h-0 overflow-y-auto p-[clamp(0.4rem,0.6vw,1rem)] no-scrollbar flex flex-col relative z-10">
                <div
                    className="px-3 mt-3 mb-2.5 flex items-center gap-2 text-[clamp(9px,0.55vw,11px)] uppercase tracking-widest text-slate-500 font-display font-extrabold">
                    <History size={11} className="text-slate-600 stroke-[2.5]"/>
                    <span>Historial de Chats</span>
                </div>

                <div className="flex-1 flex flex-col min-h-0 relative">
                    {isLoading ? (
                        <div className="flex-1 flex items-center justify-center py-12">
                            <LoadingScreen/>
                        </div>
                    ) : error ? (
                        <div className="flex-1 flex items-center justify-center py-12">
                            <RetryScreen onRetry={onRetry}/>
                        </div>
                    ) : sessions.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center">
                            <EmptyScreen label="NO SE ENCONTRARON CHATS DISPONIBLES"/>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1">
                            {sessions.map((session) => (
                                <ChatItem
                                    key={session.id}
                                    session={session}
                                    isActive={activeChatId === session.id}
                                    isDeleting={deletingSessionIds.includes(session.id)}
                                    onSelectChat={onSelectChat}
                                    onDeleteChat={handleDirectDelete}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}