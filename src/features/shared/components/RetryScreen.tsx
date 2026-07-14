import {RefreshCw} from 'lucide-react';
import {UI_VARIANTS_MAP} from "@/features/shared/utils/styleConfig";

interface RetryScreenProps {
    onRetry: () => void;
    label?: string;
}

export function RetryScreen({onRetry, label = "REINTENTAR CONEXIÓN"}: RetryScreenProps) {
    const styleConfig = UI_VARIANTS_MAP.neutral;

    return (
        <div
            className="w-full flex-1 flex items-center justify-center py-[clamp(3rem,6vw,9rem)] select-none animate-fade-in mx-auto max-w-7xl relative overflow-hidden">

            <div className="absolute w-32 h-32 bg-slate-500/5 rounded-full filter blur-2xl pointer-events-none"/>

            <button
                onClick={onRetry}
                className="relative overflow-hidden flex items-center gap-2.5 px-4 py-2 rounded-lg
                text-[clamp(10px,0.55vw,11px)] font-sans font-bold tracking-wider uppercase shadow-md
                bg-[#0a0f1d] border border-[#161f37] hover:border-[#223156] text-slate-400 hover:text-slate-200
                transition-all duration-300 active:scale-[0.97] cursor-pointer group select-none"
            >
                <div className={`absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent to-transparent pointer-events-none transition-all duration-300 z-10 
                    via-transparent group-hover:${styleConfig.laserColor}/20`}
                />

                <div className={`absolute -top-5 -right-5 w-12 h-12 rounded-full filter blur-md pointer-events-none transform origin-top-right transition-all duration-500 ease-out z-0 
                    opacity-0 scale-75 ${styleConfig.glowColor} group-hover:opacity-10 group-hover:scale-125`}
                />

                <RefreshCw
                    size={12}
                    className="text-current relative z-10 transition-all duration-500 shrink-0 group-hover:rotate-180"
                />

                <span className="relative z-10 transition-colors duration-300">{label}</span>
            </button>
        </div>
    );
}