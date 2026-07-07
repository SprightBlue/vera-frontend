import { useState, useRef, useEffect, type SyntheticEvent } from "react";
import { Send, Loader2 } from "lucide-react";
import type { ChatMessage } from "@/features/chats/api/chatApi.ts";

interface ChatRoomProps {
    messages: ChatMessage[];
    isSending: boolean;
    sendMessage: (text: string) => Promise<void>;
}

function ChatRoom({ messages, isSending, sendMessage }: ChatRoomProps) {
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
            <div className="flex-1 overflow-y-auto no-scrollbar px-[clamp(1rem,2.5vw,4rem)]">
                <div className="max-w-360 mx-auto w-full py-[clamp(1.5rem,2vw,3rem)] space-y-5">
                    {messages.map((msg, index) => {
                        const isModel = msg.role === "MODEL";
                        return (
                            <div key={index} className={`flex w-full ${isModel ? "justify-start" : "justify-end"} animate-fade-in`}>
                                <div className={`flex items-start gap-3 max-w-[85%] xl:max-w-[70%] ${isModel ? "flex-row" : "flex-row-reverse"}`}>

                                    <div className={`rounded-2xl px-4 py-3 text-[clamp(0.82rem,0.88vw,0.98rem)] leading-relaxed font-medium select-text ${
                                        isModel
                                            ? "bg-[#070B1A]/60 border border-[#182033]/60 text-slate-200 shadow-md"
                                            : "bg-blue-600/10 border border-blue-500/20 text-blue-100 shadow-sm"
                                    }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {isSending && (
                        <div className="flex w-full justify-start animate-fade-in">
                            <div className="flex items-center gap-2 px-4 py-2 text-slate-500 select-none">
                                <Loader2 size={13} className="animate-spin text-blue-500 stroke-2" />
                                <span className="text-[10px] font-bold tracking-widest uppercase">Procesando</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div className="p-[clamp(1rem,2vw,2.5rem)] bg-linear-to-t from-[#050816] via-[#050816]/95 to-transparent shrink-0">
                <form
                    onSubmit={handleFormSubmit}
                    className="max-w-360 mx-auto w-full flex items-center gap-3 bg-linear-to-b from-[#0a0f24] to-[#070B1A] border border-[#182033] focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20 rounded-2xl px-4 py-3.5 shadow-xl transition-all duration-200"
                >
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isSending}
                        placeholder="Escribe una nueva consulta..."
                        className="flex-1 bg-transparent text-slate-200 text-[clamp(0.82rem,0.88vw,0.95rem)] outline-none placeholder:text-slate-600 disabled:opacity-40 min-w-0 font-medium"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isSending}
                        className="px-4 h-9 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800/10 disabled:text-blue-400/30 text-white font-bold text-[clamp(10px,0.6vw,12px)] tracking-wider uppercase transition-all shadow-lg shadow-blue-600/10 active:scale-[0.97] cursor-pointer shrink-0"
                    >
                        <div className="flex items-center gap-1.5">
                            <Send size={11} className="stroke-[2.2]" />
                            <span>Enviar</span>
                        </div>
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ChatRoom;