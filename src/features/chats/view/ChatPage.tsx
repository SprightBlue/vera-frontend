import { type SyntheticEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2, SidebarClose, SidebarOpen, Send } from "lucide-react";

import Sidebar from "@/features/shared/components/Sidebar.tsx";
import Header from "@/features/shared/components/Header.tsx";

import ChatSidebar from "@/features/chats/components/ChatSidebar.tsx";
import ChatRoom from "@/features/chats/components/ChatRoom.tsx";
import { useChat } from "@/features/chats/hooks/useChat.ts";
import { useAuth } from "@/presentation/context/AuthContext.tsx";

function ChatPage() {
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();

    const currentChatId = searchParams.get("currentChatId");

    const {
        messages,
        sessions,
        isLoadingChat,
        isLoadingSessions,
        isSending,
        error,
        isSidebarOpen,
        welcomeInputValue,
        setWelcomeInputValue,
        toggleSidebar,
        sendMessage,
        deleteChatSession
    } = useChat(currentChatId);

    const handleSelectChat = (id: string): void => {
        setWelcomeInputValue("");
        setSearchParams({ currentChatId: id });
    };

    const handleNewChat = (): void => {
        setWelcomeInputValue("");
        setSearchParams(new URLSearchParams());
    };

    const handleDeleteChat = async (id: string): Promise<void> => {
        if (currentChatId === id) {
            setSearchParams({});
        }
        await deleteChatSession(id);
    };

    const handleWelcomeSubmit = (e: SyntheticEvent<HTMLFormElement>): void => {
        e.preventDefault();
        if (!welcomeInputValue.trim() || isLoadingChat) return;
        void sendMessage(welcomeInputValue.trim());
        setWelcomeInputValue("");
    };

    const handleRetry = (): void => {
        setSearchParams(currentChatId ? { currentChatId } : {});
    };

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#050816] font-sans antialiased select-none text-slate-100">
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden ml-20 lg:ml-56 transition-all duration-300">
                <Header
                    userName={user?.fullName}
                    title="Asistente Virtual"
                />

                <div className="flex-1 flex overflow-hidden min-h-0 w-full relative">

                    <div className="flex-1 flex flex-col bg-[#050816] overflow-hidden relative min-w-0">

                        <button
                            onClick={toggleSidebar}
                            className="absolute right-[clamp(1rem,2vw,2rem)] top-[clamp(1rem,1.5vw,1.5rem)] z-40 p-2 text-slate-500 hover:text-blue-400 transition-colors cursor-pointer bg-[#0a0f24]/60 border border-[#182033] rounded-xl shadow-md"
                            title={isSidebarOpen ? "Ocultar historial" : "Mostrar historial"}
                        >
                            {isSidebarOpen ? <SidebarClose size={14} /> : <SidebarOpen size={14} />}
                        </button>

                        <div className="flex-1 flex flex-col overflow-hidden relative min-w-0">
                            {isLoadingChat ? (
                                <div className="flex-1 flex flex-col items-center justify-center py-24 select-none animate-fade-in">
                                    <Loader2 size={22} className="text-blue-500 animate-spin stroke-[1.5] mb-2" />
                                    <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase animate-pulse">
                                        Cargando
                                    </span>
                                </div>
                            ) : error ? (
                                <div className="flex-1 flex flex-col items-center justify-center py-20 select-none animate-fade-in">
                                    <button
                                        onClick={handleRetry}
                                        className="text-[11px] font-bold text-slate-400 hover:text-slate-200 tracking-widest uppercase transition-colors cursor-pointer"
                                    >
                                        Reintentar
                                    </button>
                                </div>
                            ) : !currentChatId && messages.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center px-[clamp(1rem,3vw,3rem)] max-w-3xl mx-auto w-full gap-[clamp(1.5rem,2.5vw,3rem)] animate-fade-in">
                                    <div className="text-center select-none space-y-3">
                                        <h1 className="text-[clamp(1.35rem,2vw,2.5rem)] font-bold tracking-tight text-white leading-[1.15]">
                                            Hola{user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''}.<br />
                                            ¿Qué consulta deseas iniciar hoy?
                                        </h1>
                                        <p className="text-[clamp(0.78rem,0.85vw,0.95rem)] text-slate-500 leading-relaxed max-w-md mx-auto font-medium">
                                            Interactúa en tiempo real con el asistente de inteligencia artificial para obtener respuestas dinámicas y precisas.
                                        </p>
                                    </div>

                                    <form
                                        onSubmit={handleWelcomeSubmit}
                                        className="w-full flex items-center gap-3 bg-linear-to-b from-[#0a0f24] to-[#070B1A] border border-[#182033] focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20 rounded-2xl px-4 py-3.5 shadow-xl transition-all duration-200"
                                    >
                                        <input
                                            name="welcomeInput"
                                            type="text"
                                            autoComplete="off"
                                            value={welcomeInputValue}
                                            onChange={(e) => setWelcomeInputValue(e.target.value)}
                                            placeholder="Introduce tu consulta y presiona enter..."
                                            className="flex-1 bg-transparent text-slate-200 text-[clamp(0.82rem,0.88vw,0.95rem)] outline-none placeholder:text-slate-600 min-w-0 font-medium"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!welcomeInputValue.trim() || isLoadingChat}
                                            className="px-4 h-9 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800/10 disabled:text-blue-400/30 text-white font-bold text-[clamp(10px,0.6vw,12px)] tracking-wider uppercase transition-all shadow-lg shadow-blue-600/10 active:scale-[0.97] cursor-pointer shrink-0"
                                        >
                                            <div className="flex items-center gap-1.5">
                                                <Send size={11} className="stroke-[2.2]" />
                                                <span>Enviar</span>
                                            </div>
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                <ChatRoom messages={messages} isSending={isSending} sendMessage={sendMessage} />
                            )}
                        </div>
                    </div>

                    {isSidebarOpen && (
                        <div
                            className="xl:hidden absolute inset-0 bg-[#050816]/60 backdrop-blur-xs z-20 animate-fade-in"
                            onClick={toggleSidebar}
                        />
                    )}

                    <div
                        className={`absolute right-0 top-0 bottom-0 xl:relative z-30 transition-all duration-300 h-full overflow-hidden shrink-0 border-l border-[#182033]/40 bg-[#050816] ${
                            isSidebarOpen
                                ? "w-[clamp(16rem,20vw,24rem)] opacity-100"
                                : "w-0 opacity-0 pointer-events-none"
                        }`}
                    >
                        {isLoadingSessions ? (
                            <div className="w-full h-full flex flex-col items-center justify-center select-none animate-fade-in">
                                <Loader2 size={18} className="text-slate-600 animate-spin stroke-[1.5] mb-2" />
                                <span className="text-[9px] font-bold text-slate-600 tracking-widest uppercase">
                                    Cargando
                                </span>
                            </div>
                        ) : (
                            <ChatSidebar
                                sessions={sessions}
                                activeChatId={currentChatId}
                                onSelectChat={(id) => {
                                    handleSelectChat(id);
                                    if (window.innerWidth < 1280) toggleSidebar();
                                }}
                                onNewChat={() => {
                                    handleNewChat();
                                    if (window.innerWidth < 1280) toggleSidebar();
                                }}
                                onDeleteChat={handleDeleteChat}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatPage;