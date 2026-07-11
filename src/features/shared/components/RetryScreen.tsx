import { RefreshCw } from 'lucide-react';

interface RetryScreenProps {
    onRetry: () => void;
    label?: string;
}

export function RetryScreen({ onRetry, label = "REINTENTAR CONEXIÓN" }: RetryScreenProps) {
    return (
        <div className="w-full flex-1 flex items-center justify-center py-[clamp(3rem,6vw,9rem)] select-none animate-fade-in mx-auto max-w-7xl">
            <button
                onClick={onRetry}
                className="flex items-center gap-2.5 h-10 px-5 bg-linear-to-b from-[#0a0f24] to-[#060a17] hover:from-[#101735] hover:to-[#0a0f24]
                border border-[#182033]/80 rounded-lg text-[clamp(10px,0.6vw,12px)] font-sans font-bold text-slate-400 hover:text-slate-200
                tracking-wider uppercase shadow-lg shadow-black/20 ring-1 ring-inset ring-[#161f35]/30
                transition-all duration-150 active:scale-[0.96] cursor-pointer group"
            >
                <RefreshCw className="stroke-[2.5] text-slate-500 group-hover:text-slate-200 transition-transform duration-500 group-hover:rotate-180 w-3.5 h-3.5" />
                <span>{label}</span>
            </button>
        </div>
    );
}