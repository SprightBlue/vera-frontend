import { X as XIcon, Loader2 } from "lucide-react";
import type { MouseEvent } from "react";

interface CloseButtonProps {
    onClick: (e: MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    isProcessing?: boolean;
    title?: string;
}

export function CloseButton({ onClick, disabled, isProcessing, title = "Eliminar" }: CloseButtonProps) {
    return (
        <button
            type="button"
            disabled={disabled || isProcessing}
            onClick={onClick}
            className={`absolute top-2.5 right-2.5 flex items-center justify-center p-1.5 rounded-lg border transition-all duration-300 select-none cursor-pointer z-30 group/close overflow-hidden shadow-sm active:scale-[0.95] disabled:opacity-70 disabled:cursor-not-allowed ${
                isProcessing
                    ? "bg-linear-to-b from-[#1a0b12] to-[#0d0509] text-red-400 border-red-900/50 shadow-[0_4px_12px_rgba(239,68,68,0.15)] ring-1 ring-inset ring-red-500/20 scale-[0.96]"
                    : "text-slate-400 border-transparent hover:border-[#161f37] hover:bg-linear-to-b hover:from-[#080d20]/50 hover:to-[#040714]/30 hover:text-red-400"
            }`}
            title={title}
        >
            <div className={`absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent to-transparent pointer-events-none transition-all duration-500 z-20 ${
                isProcessing ? "via-red-400/40" : "via-transparent group-hover/close:via-red-500/25"
            }`} />

            <div className={`absolute -top-5 -right-5 w-10 h-10 rounded-full filter blur-md pointer-events-none transform origin-top-right transition-all duration-500 ease-out z-0 bg-red-500 ${
                isProcessing
                    ? "opacity-20 scale-125"
                    : "opacity-0 scale-75 group-hover/close:opacity-10 group-hover/close:scale-110"
            }`} />

            {isProcessing ? (
                <Loader2 className="w-2.75 h-2.75 animate-spin relative z-10" strokeWidth={3} />
            ) : (
                <XIcon className="w-2.75 h-2.75 relative z-10 transition-transform duration-300 group-hover/close:scale-105" strokeWidth={2.5} />
            )}
        </button>
    );
}