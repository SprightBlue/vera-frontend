import { RefreshCw } from 'lucide-react';
import { UI_VARIANTS_MAP } from "@/features/shared/utils/styleConfig";

interface RetryScreenProps {
    onRetry: () => void;
    label?: string;
}

export function RetryScreen({ onRetry, label = "Reintentar conexión" }: RetryScreenProps) {
    const styleConfig = UI_VARIANTS_MAP.neutral;

    return (
        <div
            className="w-full flex-1 flex items-center justify-center py-[clamp(3rem,6vw,9rem)] select-none animate-fade-in mx-auto max-w-7xl relative overflow-hidden">

            <button
                onClick={onRetry}
                className="relative overflow-hidden flex items-center gap-3 px-5 py-2.5 rounded-lg
                text-[clamp(13px,0.75vw,15px)] font-sans font-medium tracking-wide normal-case shadow-md
                bg-[#0a0f1d] border border-white/5 hover:border-slate-700 text-slate-400 hover:text-slate-200
                transition-all duration-300 active:scale-[0.97] cursor-pointer group select-none"
            >
                <div className={`absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent to-transparent pointer-events-none transition-all duration-300 z-10 
                    via-transparent group-hover:${styleConfig.laserColor}/20`}
                />

                {/* Icono de refresco levemente más grande */}
                <RefreshCw
                    size={15}
                    className="text-current relative z-10 transition-all duration-500 shrink-0 group-hover:rotate-180"
                />

                <span className="relative z-10 transition-colors duration-300">{label}</span>
            </button>
        </div>
    );
}