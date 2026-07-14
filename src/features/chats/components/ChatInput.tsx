import {type ChangeEvent, type KeyboardEvent} from 'react';
import {Send} from 'lucide-react';

interface ChatInputProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

export function ChatInput({
                              value,
                              onChange,
                              onSubmit,
                              placeholder = "Escribe tu consulta aquí...",
                              disabled = false,
                              className = ""
                          }: ChatInputProps) {
    const isButtonDisabled = !value.trim() || disabled;

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isButtonDisabled) {
            onSubmit();
        }
    };

    return (
        <div
            className={`w-full flex items-center gap-3 bg-linear-to-b from-[#080d20] to-[#040714] border border-[#161f37] rounded-2xl px-4 py-3 shadow-xl ring-1 ring-inset ring-[#161f35]/20 transition-all duration-200 hover:border-[#222f50] focus-within:ring-1 focus-within:ring-blue-500/10 focus-within:border-[#222f50] ${className}`}
        >
            <input
                type="text"
                value={value}
                onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={disabled}
                placeholder={placeholder}
                autoComplete="off"
                className="flex-1 bg-transparent text-slate-200 text-[clamp(12px,0.78vw,14px)] font-sans font-medium outline-hidden placeholder:text-slate-600 disabled:opacity-40 min-w-0"
            />

            <button
                type="button"
                disabled={isButtonDisabled}
                onClick={() => {
                    if (!isButtonDisabled) onSubmit();
                }}
                style={{WebkitTapHighlightColor: 'transparent'}}
                className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 select-none outline-none focus:outline-none focus:ring-0 active:ring-0 border-0 ${
                    isButtonDisabled
                        ? "text-slate-600 bg-transparent cursor-not-allowed opacity-50"
                        : "bg-blue-500 hover:bg-blue-400 text-white shadow-[0_0_12px_rgba(59,130,246,0.4)] hover:shadow-[0_0_16px_rgba(59,130,246,0.6)] active:shadow-none active:scale-90 cursor-pointer"
                }`}
                title="Enviar mensaje"
            >
                <Send
                    className={`w-[clamp(14px,0.9vw,16px)] h-[clamp(14px,0.9vw,16px)] stroke-[2.5] transition-transform duration-200 ${!isButtonDisabled && "translate-x-[0.5px]"}`}/>
            </button>
        </div>
    );
}