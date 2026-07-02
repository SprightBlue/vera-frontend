import { useState, useRef, useEffect, type SyntheticEvent } from "react";
import { Send, Bot, User as UserIcon, Loader2 } from "lucide-react";
import type { ChatMessage } from "@/features/chats/api/chatApi.ts";

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
        <div className="flex-1 flex flex-col h-full bg-[#050816] overflow-hidden">
            <div className="flex-1 overflow-y-auto custom-scrollbar px-6 sm:px-8">
                <div className="max-w-3xl mx-auto w-full py-10 space-y-8">
                    {messages.map((msg, index) => {
                        const isModel = msg.role === "MODEL";
                        return (
                            <div key={index} className={`flex w-full ${isModel ? "justify-start" : "justify-end"} animate-fade-in`}>
                                <div className={`flex items-start gap-4 max-w-[90%] sm:max-w-[85%] ${isModel ? "flex-row" : "flex-row-reverse"}`}>

                                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border transition-all ${
                                        isModel
                                            ? "bg-[#070B1A] border-[#182033] text-blue-500 shadow-sm shadow-blue-500/5"
                                            : "bg-linear-to-r from-blue-600 to-blue-700 border-blue-500 text-white shadow-lg shadow-blue-600/10"
                                    }`}>
                                        {isModel ? <Bot size={20} /> : <UserIcon size={20} />}
                                    </div>

                                    <div className={`rounded-2xl px-5 py-3.5 text-[clamp(1rem,1.1vw,1.15rem)] leading-relaxed shadow-xl transition-all ${
                                        isModel
                                            ? "bg-[#070B1A] border border-[#182033] text-slate-200"
                                            : "bg-[#070B1A] border border-blue-500/30 text-blue-100 font-medium"
                                    }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {isSending && (
                        <div className="flex w-full justify-start animate-pulse">
                            <div className="flex items-center gap-3 bg-[#070B1A]/40 border border-[#182033]/60 rounded-xl px-5 py-3.5 ml-15">
                                <Loader2 size={16} className="animate-spin text-blue-500" />
                                <span className="text-slate-400 text-[clamp(0.9rem,1vw,1rem)] font-medium tracking-wide">Procesando respuesta...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div className="p-6 sm:p-8 border-t border-[#182033]/60 bg-[#070B1A]/20 backdrop-blur-md shrink-0">
                <form
                    onSubmit={handleFormSubmit}
                    className="max-w-3xl mx-auto w-full flex items-center gap-4 bg-[#070B1A] border border-[#182033] focus-within:border-blue-500/50 rounded-2xl px-5 py-4 shadow-xl transition-all duration-200"
                >
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isSending}
                        placeholder="Escribí tu consulta aquí..."
                        className="flex-1 bg-transparent text-slate-200 text-[clamp(1rem,1.2vw,1.2rem)] outline-none border-none placeholder:text-slate-500 disabled:opacity-50 min-w-0"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isSending}
                        className="p-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:bg-[#182033]/50 disabled:text-slate-500 transition-all cursor-pointer shadow-lg shadow-blue-600/10 active:scale-95 shrink-0"
                    >
                        <Send size={16} />
                    </button>
                </form>
            </div>
        </div>
    );
}