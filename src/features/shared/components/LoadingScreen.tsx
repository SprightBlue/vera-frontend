import { Loader2 } from 'lucide-react';

interface LoadingScreenProps {
    label?: string;
}

export function LoadingScreen({ label = "Cargando sistema..." }: LoadingScreenProps) {
    return (
        <div
            className="w-full flex-1 flex flex-col items-center justify-center py-[clamp(4rem,8vw,12rem)] select-none animate-fade-in mx-auto max-w-7xl relative overflow-hidden">

            {/* Icono agrandado a un mínimo de 32px hasta 44px */}
            <Loader2
                className="text-slate-500 animate-spin stroke-[1.5] mb-4 w-[clamp(32px,2.2vw,44px)] h-[clamp(32px,2.2vw,44px)] relative z-10" />

            {/* Fuente adaptada a un tamaño más legible sin mayúsculas forzadas */}
            <span
                className="text-[clamp(14px,0.85vw,16px)] font-sans font-medium text-slate-400 tracking-wide animate-pulse text-center px-4 relative z-10 normal-case">
                {label}
            </span>
        </div>
    );
}