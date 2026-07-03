import { type SyntheticEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { AlertCircle, Loader2, RefreshCw, SidebarClose, SidebarOpen, Send } from "lucide-react";

import Sidebar from "@/presentation/components/Sidebar.tsx";
import Header from "@/presentation/components/Header.tsx";

import ChatSidebar from "@/features/chats/components/ChatSidebar.tsx";
import ChatRoom from "@/features/chats/components/ChatRoom.tsx";
import { useChat } from "@/features/chats/hooks/useChat.ts";
import { useAuth } from "@/presentation/context/AuthContext.tsx";

function ChatPage() {
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();

    const analysisId = searchParams.get("analysisId");
    const alertId = searchParams.get("alertId");
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
    } = useChat(analysisId, alertId, currentChatId);

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
        <div className="flex h-screen w-screen overflow-hidden bg-[#050816]">
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden ml-20 xl:ml-56 transition-all duration-300">
                <Header userName={user?.fullName} title="Asistente con Inteligencia Artificial" />

                <div className="flex-1 flex overflow-hidden min-h-0 w-full relative">

                    <div className="flex-1 flex flex-col bg-[#050816] overflow-hidden relative min-w-0">

                        <button
                            onClick={toggleSidebar}
                            className="absolute right-6 top-6 z-40 p-2.5 rounded-xl text-slate-400 hover:text-blue-500 bg-[#070B1A]/80 hover:bg-[#070B1A] border border-[#161f38] transition-all backdrop-blur-sm cursor-pointer shadow-xl active:scale-95"
                            title={isSidebarOpen ? "Ocultar historial" : "Mostrar historial"}
                        >
                            {isSidebarOpen ? <SidebarClose size={18} /> : <SidebarOpen size={18} />}
                        </button>

                        <div className="flex-1 flex flex-col overflow-hidden relative min-w-0">
                            {isLoadingChat ? (
                                <div className="flex-1 flex flex-col items-center justify-center py-10 px-8 gap-4 animate-fade-in duration-300">
                                    <Loader2 size={32} className="text-blue-500 animate-spin" />
                                    <p className="text-[clamp(1rem,1.2vw,1.3rem)] text-slate-400 font-medium select-none tracking-wide animate-pulse">
                                        Sincronizando chat...
                                    </p>
                                </div>
                            ) : error ? (
                                <div className="flex-1 flex flex-col items-center justify-center py-10 px-8 gap-6 max-w-3xl mx-auto text-center animate-fade-in">
                                    <div className="w-20 h-20 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center border border-red-500/20 shadow-lg shadow-red-500/5">
                                        <AlertCircle size={36} />
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-[clamp(1.5rem,2vw,2rem)] font-bold text-white tracking-tight">Ocurrió un inconveniente</h3>
                                        <p className="text-[clamp(1rem,1.2vw,1.3rem)] text-slate-400 leading-relaxed">{error}</p>
                                    </div>
                                    <button
                                        onClick={handleRetry}
                                        className="flex items-center gap-3 px-8 py-4 rounded-xl bg-linear-to-r from-blue-600 to-blue-700 text-[clamp(1rem,1.2vw,1.2rem)] font-semibold text-white shadow-lg shadow-blue-600/20 hover:scale-[1.02] transition-all duration-200 cursor-pointer"
                                    >
                                        <RefreshCw size={16} />
                                        Reintentar carga
                                    </button>
                                </div>
                            ) : !analysisId && !alertId && !currentChatId && messages.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center py-10 px-8 gap-8 max-w-3xl mx-auto w-full animate-fade-in">
                                    <div className="text-center select-none w-full space-y-2">
                                        <h1 className="text-[clamp(1.75rem,3vw,2.5rem)] font-semibold bg-linear-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent tracking-tight">
                                            Hola{user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''}.<br />
                                            ¿En qué puedo ayudarte hoy?
                                        </h1>
                                        <p className="text-[clamp(1rem,1.15vw,1.3rem)] text-slate-400 leading-relaxed max-w-2xl mx-auto">
                                            El asistente con Inteligencia Artificial de Vera está preparado para ayudarte a responder tus consultas en tiempo real. Ingresá tu consulta y comenzá a interactuar con nuestro asistente.
                                        </p>
                                    </div>

                                    <form
                                        key={`${currentChatId}-${analysisId}-${alertId}`}
                                        onSubmit={handleWelcomeSubmit}
                                        className="w-full flex items-center gap-4 bg-[#070B1A] border border-[#182033] focus-within:border-blue-500/50 rounded-2xl px-5 py-4 shadow-xl transition-all duration-200"
                                    >
                                        <input
                                            name="welcomeInput"
                                            type="text"
                                            autoComplete="off"
                                            value={welcomeInputValue}
                                            onChange={(e) => setWelcomeInputValue(e.target.value)}
                                            placeholder="Escribí tu consulta aquí..."
                                            className="flex-1 bg-transparent text-slate-200 text-[clamp(1rem,1.2vw,1.2rem)] outline-none border-none placeholder:text-slate-500 min-w-0"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!welcomeInputValue.trim() || isLoadingChat}
                                            className="p-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:bg-[#182033]/50 disabled:text-slate-500 transition-all cursor-pointer shadow-lg shadow-blue-600/10 active:scale-95 shrink-0"
                                        >
                                            <Send size={16} />
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                <ChatRoom messages={messages} isSending={isSending} sendMessage={sendMessage} />
                            )}
                        </div>
                    </div>

                    <div
                        className="transition-all duration-300 h-full overflow-hidden shrink-0"
                        style={{ width: isSidebarOpen ? "clamp(14rem, 18vw, 18rem)" : "0px" }}
                    >
                        {isLoadingSessions ? (
                            <div className="w-[clamp(14rem,18vw,18rem)] border-l border-[#182033] bg-[#0c1020] h-full flex flex-col items-center justify-center p-6 gap-4 transition-all duration-300">
                                <Loader2 size={28} className="text-blue-500 animate-spin" />
                                <p className="text-[clamp(0.9rem,1vw,1rem)] text-slate-400 font-medium select-none tracking-wide animate-pulse text-center">
                                    Cargando historial...
                                </p>
                            </div>
                        ) : (
                            <ChatSidebar
                                sessions={sessions}
                                activeChatId={currentChatId}
                                onSelectChat={handleSelectChat}
                                onNewChat={handleNewChat}
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