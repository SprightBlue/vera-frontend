import { useRef, useEffect } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import type { ChatMessage } from "@/features/chats/api/chatApi";
import { ChatInput } from "@/features/chats/components/ChatInput";
import { LoadingScreen } from "@/features/shared/components/LoadingScreen";

interface ChatRoomProps {
    currentChatId: string | null;
    messages: ChatMessage[];
    isSending: boolean;
    isLoadingChat: boolean;
    error: unknown;
    onRetry: () => void;
    input: string;
    setInput: (val: string) => void;
    sendMessage: (text: string) => Promise<void>;
    welcomeInputValue: string;
    setWelcomeInputValue: (val: string) => void;
    onSubmitWelcome: () => void;
    userFullName?: string;
}

export function ChatRoom({
                             currentChatId,
                             messages,
                             isSending,
                             isLoadingChat,
                             error,
                             onRetry,
                             input,
                             setInput,
                             sendMessage,
                             welcomeInputValue,
                             setWelcomeInputValue,
                             onSubmitWelcome,
                             userFullName
                         }: ChatRoomProps) {
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isSending, error]);

    const handleInputSubmit = () => {
        if (!input.trim() || isSending || error) return;
        void sendMessage(input.trim());
        setInput("");
    };

    if (isLoadingChat) {
        return (
            <div className="flex-1 flex items-center justify-center px-[clamp(1rem,2.5vw,4rem)]">
                <LoadingScreen />
            </div>
        );
    }

    if (!currentChatId && messages.length === 0) {
        return (
            <div
                className="flex-1 flex flex-col items-center justify-center px-[clamp(1rem,3vw,3rem)] max-w-2xl mx-auto w-full gap-[clamp(1.5rem,2.5vw,2.5rem)] animate-fade-in">
                <div className="text-center select-none space-y-4">
                    {/* Usando tus clases del @layer components sin forzar mayúsculas */}
                    <h1 className="heading-lg normal-case">
                        Bienvenido/a{userFullName ? `, ${userFullName.split(' ')[0]}` : ''}.<br />
                        ¿Qué consulta deseas hacer hoy?
                    </h1>
                    <p className="body-text max-w-md mx-auto normal-case">
                        Interactúa en tiempo real con el asistente de inteligencia artificial para obtener respuestas
                        dinámicas y precisas a tus preguntas.
                    </p>
                </div>

                <ChatInput
                    value={welcomeInputValue}
                    onChange={setWelcomeInputValue}
                    onSubmit={onSubmitWelcome}
                    placeholder="Introduce tu consulta inicial y presiona enter..."
                />
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-[#050816] overflow-hidden">
            <div className="flex-1 overflow-y-auto no-scrollbar px-[clamp(1rem,2.5vw,4rem)]">
                <div className="max-w-3xl mx-auto w-full py-[clamp(1.5rem,2vw,3rem)] space-y-4">
                    {messages.map((msg, index) => {
                        const isModel = msg.role === "MODEL";
                        return (
                            <div key={index}
                                 className={`flex w-full ${isModel ? "justify-start" : "justify-end"} animate-fade-in`}>
                                <div
                                    className={`flex flex-col max-w-[88%] xl:max-w-[78%] ${isModel ? "items-start" : "items-end"}`}>
                                    <div
                                        className={`rounded-xl px-[clamp(1rem,1.2vw,1.4rem)] py-[clamp(0.75rem,1vw,1.1rem)] text-[clamp(13px,0.8vw,14px)] leading-relaxed font-sans font-medium select-text relative overflow-hidden border shadow-2xl transition-colors duration-300 ${
                                            isModel
                                                ? "bg-linear-to-b from-[#0d1527] to-[#070b16] border-white/5 text-slate-300"
                                                : "bg-linear-to-b from-[#0e1b3d] to-[#050b1a] border-blue-500/20 text-blue-100 shadow-[0_0_20px_rgba(59,130,246,0.02)]"
                                        }`}>
                                        <div
                                            className={`absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-transparent to-transparent pointer-events-none ${
                                                isModel ? "via-slate-500/5" : "via-blue-400/10"
                                            }`}/>
                                        {String(msg.content ?? '')}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {isSending && (
                        <div className="flex w-full justify-start animate-fade-in">
                            <div
                                className="rounded-xl px-[clamp(1rem,1.2vw,1.4rem)] py-[clamp(0.75rem,1vw,1.1rem)] bg-linear-to-b from-[#0d1527] to-[#070b16] border border-white/5 text-slate-300 shadow-2xl relative overflow-hidden flex items-center gap-3">
                                <Loader2 size={14}
                                         className="animate-spin text-slate-500 stroke-[2.5] relative z-10 shrink-0" />
                                <span
                                    className="text-[clamp(12px,0.65vw,13px)] font-sans font-medium text-slate-500 animate-pulse relative z-10 normal-case">
                                    Procesando consulta...
                                </span>
                            </div>
                        </div>
                    )}

                    {!!error && !isSending && (
                        <div className="flex w-full justify-start animate-fade-in">
                            <button
                                onClick={onRetry}
                                type="button"
                                style={{ WebkitTapHighlightColor: 'transparent' }}
                                className="rounded-xl px-[clamp(1rem,1.2vw,1.4rem)] py-[clamp(0.75rem,1vw,1.1rem)] bg-linear-to-b from-[#0d1527] to-[#070b16] border border-red-500/20 hover:border-red-500/40 text-slate-300 shadow-2xl relative overflow-hidden flex items-center gap-3 group transition-all duration-300 cursor-pointer text-left outline-none"
                            >
                                <RefreshCw size={14}
                                           className="text-slate-500 stroke-[2.5] relative z-10 shrink-0 transition-transform duration-500 group-hover:rotate-180" />
                                <span
                                    className="text-[clamp(12px,0.65vw,13px)] font-sans font-medium text-red-400 relative z-10 select-none normal-case">
                                    Reintentar...
                                </span>
                            </button>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div
                className="p-[clamp(1rem,2vw,2.5rem)] bg-linear-to-t from-[#050816] via-[#050816]/95 to-transparent shrink-0">
                <div className="max-w-3xl mx-auto w-full">
                    <ChatInput
                        value={input}
                        onChange={setInput}
                        onSubmit={handleInputSubmit}
                        disabled={isSending || !!error}
                        placeholder={error ? "Soluciona el error para continuar..." : "Escribe una nueva consulta..."}
                    />
                </div>
            </div>
        </div>
    );
}