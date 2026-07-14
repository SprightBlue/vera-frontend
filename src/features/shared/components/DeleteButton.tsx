import {Trash2, Loader2, type LucideIcon} from "lucide-react";
import type {MouseEvent} from "react";

interface DeleteButtonProps {
    onClick: (e: MouseEvent<HTMLButtonElement>) => void;
    icon?: LucideIcon;
    disabled?: boolean;
    isProcessing?: boolean;
    title?: string;
    className?: string;
}

export function DeleteButton({
                                 onClick,
                                 icon: Icon = Trash2,
                                 disabled,
                                 isProcessing,
                                 title = "Eliminar",
                                 className = ""
                             }: DeleteButtonProps) {
    return (
        <button
            type="button"
            disabled={disabled || isProcessing}
            onClick={onClick}
            className={`flex items-center justify-center p-1.5 rounded-lg border transition-all duration-300 select-none cursor-pointer z-30 group/btn overflow-hidden shadow-sm active:scale-[0.95] disabled:opacity-70 disabled:cursor-not-allowed ${
                isProcessing
                    ? "bg-[#090c16] text-slate-400 border-[#161f37]/80 scale-[0.96]"
                    : "text-slate-500 border-transparent hover:border-[#161f37] hover:bg-linear-to-b hover:from-[#080d20]/50 hover:to-[#040714]/30 hover:text-slate-200"
            } ${className}`}
            title={title}
        >
            <div
                className={`absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent to-transparent pointer-events-none transition-all duration-500 z-20 ${
                    isProcessing ? "via-slate-500/20" : "via-transparent group-hover/btn:via-slate-400/25"
                }`}/>

            <div
                className={`absolute -top-5 -right-5 w-10 h-10 rounded-full filter blur-md pointer-events-none transform origin-top-right transition-all duration-500 ease-out z-0 bg-slate-400 ${
                    isProcessing
                        ? "opacity-5 scale-125"
                        : "opacity-0 scale-75 group-hover/btn:opacity-5 group-hover/btn:scale-110"
                }`}/>

            {isProcessing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin relative z-10" strokeWidth={3}/>
            ) : (
                <Icon className="w-3.5 h-3.5 relative z-10 transition-transform duration-300 group-hover/btn:scale-105"
                      strokeWidth={2.5}/>
            )}
        </button>
    );
}