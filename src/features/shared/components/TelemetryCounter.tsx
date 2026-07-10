// src/features/dashboard/components/TelemetryCounter.tsx
import { type ComponentType } from "react";
import { UI_VARIANTS_MAP, type UIVariant } from "@/features/shared/utils/styleConfig.ts";

interface TelemetryCounterProps {
    label: string;
    value: number | string;
    variant: UIVariant;
    icon: ComponentType<{ className?: string }>;
}

export function TelemetryCounter({ label, value, variant, icon: Icon }: TelemetryCounterProps) {
    const config = UI_VARIANTS_MAP[variant];

    return (
        <div className={`group rounded-r-xl rounded-l-none border-2 border-transparent border-l-4 ${config.borderLeft} 
        bg-linear-to-b from-[#0a0f24] to-[#060a17] p-[clamp(1.1rem,1.5vw,1.8rem)] shadow-2xl relative overflow-hidden 
        flex items-center justify-between gap-4 ring-1 ring-inset ring-[#161f35]/40 hover:ring-[#222f50]/60 transition-all duration-300`}>

            {/* Animación del Orbe de Fondo en Tiempo Real */}
            <div className={`absolute -top-12 -right-12 w-48 h-48 rounded-full filter blur-[50px] opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500 ease-out ${config.glowColor}`} />

            <div className="flex flex-col gap-1.5 relative z-10">
                <span className="text-[clamp(10px,0.55vw,11px)] font-black tracking-widest text-slate-500 uppercase">
                    {label}
                </span>
                <h2 className="text-[clamp(1.8rem,2.2vw,2.6rem)] font-black text-white leading-none tracking-tight">
                    {value}
                </h2>
            </div>

            {/* Icono con Animación de Actividad de Hardware */}
            <div className={`p-3 rounded-lg bg-[#0d1532] border border-[#1c2748] relative z-10 text-slate-400 group-hover:text-white group-hover:border-slate-500/30 transition-colors duration-300`}>
                <Icon className="h-6 w-6 stroke-[1.5] animate-[pulse_2s_infinite_ease-in-out]" />
            </div>
        </div>
    );
}