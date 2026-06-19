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
            <div className="flex-1 overflow-y-auto h-full p-4 sm:p-6 custom-scrollbar">
                <div className="max-w-3xl mx-auto w-full space-y-6">
                    {messages.map((msg, index) => {
                        const isModel = msg.role === "MODEL";

                        return (
                            <div key={index} className={`flex w-full ${isModel ? "justify-start" : "justify-end"}`}>
                                <div className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${isModel ? "flex-row" : "flex-row-reverse"}`}>
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center border shrink-0 shadow-sm ${
                                        isModel
                                            ? "bg-blue-600/10 border-blue-500/20 text-blue-400"
                                            : "bg-slate-800 border-slate-700 text-slate-400"
                                    }`}>
                                        {isModel ? <Bot size={16} /> : <UserIcon size={16} />}
                                    </div>

                                    <div className={`rounded-2xl px-4 py-3 text-[15px] leading-relaxed shadow-sm ${
                                        isModel
                                            ? "bg-slate-900 border border-slate-800 text-slate-200"
                                            : "bg-blue-600 text-white"
                                    }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {isSending && (
                        <div className="flex w-full justify-start">
                            <div className="flex gap-3 max-w-[75%]">
                                <div className="w-8 h-8 rounded-xl flex items-center justify-center border bg-blue-600/10 border-blue-500/20 text-blue-400 shrink-0">
                                    <Bot size={16} />
                                </div>
                                <div className="rounded-2xl px-4 py-3 bg-slate-900 border border-slate-800 text-slate-500 text-sm flex items-center gap-2">
                                    <Loader2 size={14} className="animate-spin text-blue-500" />
                                    <span>Pensando...</span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-900/60 shrink-0">
                <div className="max-w-3xl mx-auto w-full">
                    <form onSubmit={handleFormSubmit} className="flex items-center gap-3 bg-slate-900/30 border border-slate-800 px-5 py-3.5 focus-within:border-blue-500/50 backdrop-blur-sm rounded-2xl transition-all shadow-2xl">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isSending}
                            placeholder="Escribe tu consulta..."
                            className="flex-1 bg-transparent text-slate-200 text-[15px] font-inter placeholder:text-slate-500 outline-none"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isSending}
                            className="p-2 rounded-xl bg-blue-600 text-white disabled:bg-slate-900 disabled:text-slate-600 transition-all cursor-pointer shadow-lg shadow-blue-600/10 hover:brightness-110"
                        >
                            <Send size={15} />
                        </button>
                    </form>
                    <p className="text-[11px] text-center text-slate-600 mt-2 flex items-center justify-center gap-1.5">
                        <Shield size={10} /> VERA puede cometer errores.
                    </p>
                </div>
            </div>
        </div>
    );
}