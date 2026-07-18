import { useSearchParams } from "react-router-dom";

import Sidebar from "@/features/shared/components/Sidebar";
import Header from "@/features/shared/components/Header";
import { ChatSidebar } from "@/features/chats/components/ChatSidebar";
import { ChatRoom } from "@/features/chats/components/ChatRoom";
import { SidebarToggleButton } from "@/features/chats/components/SidebarToggleButton";

import { useChat } from "@/features/chats/hooks/useChat";
import { useAuth } from "@/presentation/context/AuthContext";

export function ChatView() {
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
        chatInputValue,
        welcomeInputValue,
        deletingSessionIds,
        setChatInputValue,
        setWelcomeInputValue,
        toggleSidebar,
        sendMessage,
        retryLastMessage,
        deleteChatSession,
        resetInputs
    } = useChat(currentChatId);

    const handleSelectChat = (id: string): void => {
        resetInputs();
        setSearchParams({ currentChatId: id });
    };

    const handleNewChat = (): void => {
        resetInputs();
        setSearchParams(new URLSearchParams());
    };

    const handleDeleteChat = async (id: string): Promise<void> => {
        if (currentChatId === id || !currentChatId) {
            resetInputs();
            setSearchParams(new URLSearchParams(), { replace: true });
        }
        await deleteChatSession(id);
    };

    const handleWelcomeSubmit = async (): Promise<void> => {
        if (!welcomeInputValue.trim() || isLoadingChat) return;
        const inputToSubmit = welcomeInputValue.trim();
        setWelcomeInputValue("");

        const assignedChatId = await sendMessage(inputToSubmit);

        if (assignedChatId && !currentChatId) {
            setSearchParams({ currentChatId: assignedChatId}, { replace: true });
        }
    };

    const handleRoomSendMessage = async (text: string): Promise<void> => {
        const assignedChatId = await sendMessage(text);

        if (assignedChatId && !currentChatId) {
            setSearchParams({ currentChatId: assignedChatId }, { replace: true });
        }
    };

    return (
        <div
            className="flex h-screen w-screen overflow-hidden bg-[#050814] text-slate-100 antialiased select-none relative"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
            <Sidebar />

            {/* Margen adaptativo unificado con el Sidebar del resto de vistas */}
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden transition-all duration-300 ml-20 lg:ml-56 relative">
                <Header
                    userName={user?.fullName ?? "Usuario"}
                    title="Asistente Virtual"
                />

                <div className="flex-1 flex overflow-hidden min-h-0 w-full relative">
                    <div className="flex-1 flex flex-col bg-[#050814] overflow-hidden relative min-w-0">

                        <div className="absolute right-[clamp(1rem,2vw,2rem)] top-[clamp(1rem,1.5vw,1.5rem)] z-40">
                            <SidebarToggleButton isOpen={isSidebarOpen} onClick={toggleSidebar} />
                        </div>

                        <div className="flex-1 flex flex-col overflow-hidden relative min-w-0">
                            <ChatRoom
                                currentChatId={currentChatId}
                                messages={messages}
                                isSending={isSending}
                                isLoadingChat={isLoadingChat}
                                error={error}
                                onRetry={retryLastMessage}
                                input={chatInputValue}
                                setInput={setChatInputValue}
                                sendMessage={handleRoomSendMessage}
                                welcomeInputValue={welcomeInputValue}
                                setWelcomeInputValue={setWelcomeInputValue}
                                onSubmitWelcome={handleWelcomeSubmit}
                                userFullName={user?.fullName}
                            />
                        </div>
                    </div>

                    {isSidebarOpen && (
                        <div
                            className="xl:hidden absolute inset-0 bg-[#050814]/60 backdrop-blur-xs z-20 animate-fade-in"
                            onClick={toggleSidebar}
                        />
                    )}

                    {/* Contenedor lateral unificado con bordes fluidos y transiciones limpias */}
                    <div
                        className={`absolute right-0 top-0 bottom-0 xl:relative z-30 transition-[width,opacity] duration-500 cubic-bezier(0.4,0,0.2,1) h-full overflow-hidden shrink-0 border-l border-white/5 bg-linear-to-b from-[#080d20] to-[#040714] ${
                            isSidebarOpen ? "w-[clamp(16rem,20vw,24rem)] opacity-100" : "w-0 opacity-0 pointer-events-none"
                        }`}
                    >
                        <div className="w-[clamp(16rem,20vw,24rem)] h-full">
                            <ChatSidebar
                                sessions={sessions}
                                activeChatId={currentChatId}
                                isLoading={isLoadingSessions}
                                error={error}
                                deletingSessionIds={deletingSessionIds}
                                onRetry={retryLastMessage}
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}