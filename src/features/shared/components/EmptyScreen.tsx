import { Inbox } from 'lucide-react';

interface EmptyScreenProps {
    label?: string;
}

export function EmptyScreen({ label = "No se encontraron registros" }: EmptyScreenProps) {
    return (
        <div
            className="w-full flex-1 flex flex-col items-center justify-center py-[clamp(4rem,8vw,12rem)] select-none animate-fade-in mx-auto max-w-7xl relative overflow-hidden">

            {/* Icono Inbox escalado de forma idéntica al cargador */}
            <Inbox
                className="text-slate-500 stroke-[1.3] mb-4 w-[clamp(32px,2.2vw,44px)] h-[clamp(32px,2.2vw,44px)] relative z-10" />

            {/* Fuente escalada de forma unificada con LoadingScreen */}
            <span
                className="text-[clamp(14px,0.85vw,16px)] font-sans font-medium text-slate-500 tracking-wide text-center px-4 relative z-10 normal-case">
                {label}
            </span>
        </div>
    );
}