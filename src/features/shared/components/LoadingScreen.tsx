import { Loader2 } from 'lucide-react';

interface LoadingScreenProps {
    label?: string;
}

export function LoadingScreen({ label = "Cargando Sistema..." }: LoadingScreenProps) {
    return (
        <div className="w-full flex-1 flex flex-col items-center justify-center py-[clamp(4rem,8vw,12rem)] select-none animate-fade-in mx-auto max-w-7xl relative overflow-hidden">
            <div className="absolute w-32 h-32 bg-blue-500/10 rounded-full filter blur-2xl pointer-events-none animate-pulse" />

            <Loader2 className="text-blue-500 animate-spin stroke-[1.5] mb-3 w-[clamp(24px,1.8vw,32px)] h-[clamp(24px,1.8vw,32px)] relative z-10" />

            <span className="text-[clamp(10px,0.6vw,14px)] font-sans font-bold text-slate-500 tracking-wider uppercase animate-pulse text-center px-4 relative z-10">
                {label}
            </span>
        </div>
    );
}