import { useState, useRef, useEffect, type SyntheticEvent } from "react";
import { Send, Bot, User as UserIcon, Loader2, Shield } from "lucide-react";
import type { ChatMessage } from "../api/chatApi";

interface ChatRoomProps {
    messages: ChatMessage[];
    isSending: boolean;
    sendMessage: (text: string) => Promise<void>;
}

export function ChatRoom({ messages, isSending, sendMessage }: ChatRoomProps) {
    const [input, setInput] = useState<string>("");
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isSending]);

    const handleFormSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim() || isSending) return;

        void sendMessage(input.trim());
        setInput("");
    };

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden min-h-0 bg-slate-950 relative">

            <div className="flex-1 overflow-y-auto h-full p-4 sm:p-6 space-y-6 custom-scrollbar">
                <div className="max-w-3xl mx-auto w-full space-y-6">
                    {messages.map((msg, index) => {
                        const isModel = msg.role === "MODEL";
                        return (
                            <div
                                key={index}
                                className={`w-full rounded-2xl border p-5 transition-all duration-200 analysis-appear ${
                                    isModel
                                        ? "bg-slate-900/30 border-slate-900/80 backdrop-blur-sm"
                                        : "bg-slate-950 border-slate-800/40"
                                }`}
                            >
                                <div className="flex gap-4 sm:gap-5 items-start">
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center border shrink-0 shadow-sm ${
                                        isModel
                                            ? "bg-blue-600/10 border-blue-500/20 text-blue-400"
                                            : "bg-slate-900 border-slate-800 text-slate-400"
                                    }`}>
                                        {isModel ? <Bot size={16} /> : <UserIcon size={16} />}
                                    </div>

                                    <div className="flex-1 text-[15px] font-inter leading-relaxed text-slate-200 whitespace-pre-wrap pt-0.5 selection:bg-blue-500/30">
                                        {msg.content}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {isSending && (
                        <div className="w-full rounded-2xl border border-slate-900/80 bg-slate-900/20 backdrop-blur-sm p-5 analysis-appear">
                            <div className="flex gap-4 sm:gap-5 items-start">
                                <div className="w-8 h-8 rounded-xl flex items-center justify-center border bg-blue-600/10 border-blue-500/20 text-blue-400 shrink-0">
                                    <Bot size={16} />
                                </div>
                                <div className="flex-1 text-sm font-inter text-slate-500 flex items-center gap-2.5 pt-1.5">
                                    <Loader2 size={14} className="animate-spin text-blue-500" />
                                    <span>VERA está procesando la consulta...</span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-900/60 shrink-0">
                <div className="max-w-3xl mx-auto w-full">
                    <form
                        onSubmit={handleFormSubmit}
                        className="flex items-center gap-3 bg-slate-900/30 border border-slate-800 px-5 py-3.5 focus-within:border-blue-500/50 backdrop-blur-sm rounded-2xl transition-all duration-300 shadow-2xl"
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isSending}
                            placeholder="Preguntale a VERA sobre correos, SMS o enlaces sospechosos..."
                            className="flex-1 bg-transparent text-slate-200 text-[15px] font-inter placeholder:text-slate-500 outline-none border-none py-0.5"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isSending}
                            className="p-2 rounded-xl bg-blue-600 text-white disabled:bg-slate-900 disabled:text-slate-600 transition-all duration-200 cursor-pointer shrink-0 shadow-lg shadow-blue-600/10 hover:brightness-110"
                        >
                            <Send size={15} className="stroke-2" />
                        </button>
                    </form>

                    <p className="text-[11px] text-center text-slate-600 mt-2 font-inter tracking-wide flex items-center justify-center gap-1.5 select-none">
                        <Shield size={10} />
                        VERA puede cometer errores. Evaluá siempre el contexto antes de tomar acciones.
                    </p>
                </div>
            </div>
        </div>
    );
}