import { type SyntheticEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { AlertCircle, Sparkles } from "lucide-react";

import Sidebar from "../../../presentation/components/Sidebar.tsx";
import Header from "../../../presentation/components/Header.tsx";

import { ChatSidebar } from "../components/ChatSidebar";
import { ChatRoom } from "../components/ChatRoom";
import { useChat } from "../hooks/useChat";
import { useAuth } from "../../../presentation/context/AuthContext";

export function ChatPage() {
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
        sendMessage,
        deleteChatSession
    } = useChat(analysisId, alertId, currentChatId);

    const handleSelectChat = (id: string): void => {
        setSearchParams({ currentChatId: id });
    };

    const handleNewChat = (): void => {
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
        const form = e.currentTarget;
        const inputElement = form.elements.namedItem("welcomeInput") as HTMLInputElement;

        if (inputElement && inputElement.value.trim()) {
            void sendMessage(inputElement.value.trim());
            inputElement.value = "";
        }
    };

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#050816]">
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden ml-65">
                <Header
                    userName={user?.fullName}
                    title="Asistente Inteligente"
                    subtitle="Espacio conversacional de asistencia contra fraudes e ingeniería social"
                />

                <div className="flex-1 flex overflow-hidden min-h-0 w-full relative">

                    {isLoadingSessions ? (
                        <div className="w-72 border-r border-[#182033] bg-[#070B1A]/10 shrink-0 h-full p-4 space-y-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-12 bg-slate-800/30 rounded-lg animate-pulse" />
                            ))}
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

                    <div className="flex-1 flex flex-col bg-[#050816] overflow-hidden relative min-w-0">
                        {!isLoadingChat && !analysisId && !alertId && !currentChatId && messages.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto p-6 sm:p-8 font-inter w-full analysis-empty-appear">
                                <div className="text-center space-y-3 mb-10 select-none">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-400 flex items-center justify-center border border-blue-500/20 mx-auto shadow-lg shadow-blue-500/5">
                                        <Sparkles size={22} className="animate-pulse" />
                                    </div>
                                    <h1 className="text-3xl font-bold bg-linear-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent tracking-tight">
                                        ¿Qué querés verificar hoy?
                                    </h1>
                                    <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                                        Escribí tu consulta abajo o arrastrá capturas, audios y enlaces sospechosos para analizarlos en tiempo real con VERA.
                                    </p>
                                </div>

                                <form
                                    onSubmit={handleWelcomeSubmit}
                                    className="w-full flex items-center gap-3 bg-slate-900/30 border border-slate-800 focus-within:border-blue-500/40 rounded-2xl px-4 py-3.5 shadow-2xl backdrop-blur-sm transition-all duration-200"
                                >
                                    <input
                                        name="welcomeInput"
                                        type="text"
                                        autoComplete="off"
                                        placeholder="Ej: Recibí un SMS de mi banco pidiendo validar claves..."
                                        className="flex-1 bg-transparent text-[15px] text-slate-200 outline-none border-none placeholder:text-slate-500"
                                    />
                                    <button
                                        type="submit"
                                        className="px-5 py-2 rounded-xl bg-blue-600 text-sm font-semibold text-white hover:brightness-110 shadow-lg shadow-blue-600/10 transition-all cursor-pointer"
                                    >
                                        Consultar
                                    </button>
                                </form>
                            </div>
                        ) : isLoadingChat ? (
                            <div className="flex-1 flex flex-col p-6 gap-6 animate-pulse w-full max-w-3xl mx-auto">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`h-16 w-3/4 rounded-2xl ${i % 2 === 0 ? 'bg-blue-900/20' : 'bg-slate-800/40'}`} />
                                    </div>
                                ))}
                            </div>
                        ) : error ? (
                            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-red-400 font-inter gap-2">
                                <AlertCircle size={24} />
                                <p className="text-sm">{error}</p>
                            </div>
                        ) : (
                            <ChatRoom
                                messages={messages}
                                isSending={isSending}
                                sendMessage={sendMessage}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}