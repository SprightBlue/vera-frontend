// src/features/dashboard/components/LiveStatusWidget.tsx
import { ShieldCheck, Radio, Wifi, WifiOff, MapPin, ArrowUpRight } from "lucide-react";

interface LiveStatusWidgetProps {
    type: "USER" | "RESOLVED";
    title: string;
    subtitle: string;
    isConnected?: boolean;
    timestamp?: string;
}

export function LiveStatusWidget({ type, title, subtitle, isConnected = false, timestamp }: LiveStatusWidgetProps) {
    // Si es tipo USER, elegimos el icono de red dinámico según su conexión
    const ConnectionIcon = isConnected ? Wifi : WifiOff;
    const isUser = type === "USER";

    return (
        <div className="w-full rounded-r-xl rounded-l-none border-2 border-transparent border-l-4 border-l-slate-700 bg-linear-to-b from-[#0a0f24] to-[#060a17] p-[clamp(1.1rem,1.5vw,1.8rem)] shadow-2xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 ring-1 ring-inset ring-[#161f35]/40 group">

            {/* Animaciones de ondas de telemetría */}
            <style>{`
                @keyframes pulseRadar {
                    0% { transform: scale(0.95); opacity: 0.5; }
                    50% { transform: scale(1.1); opacity: 1; }
                    100% { transform: scale(0.95); opacity: 0.5; }
                }
                .animate-radar { animation: pulseRadar 2s infinite ease-in-out; }
            `}</style>

            <div className="flex gap-4 items-start min-w-0 flex-1 relative z-10">
                {/* Contenedor del Icono con personalidad de Red Analógica */}
                <div className={`p-3 rounded-lg bg-[#0d1532] border border-[#1c2748] shrink-0 relative`}>
                    {isUser ? (
                        <>
                            {isConnected && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />}
                            <ConnectionIcon className={`h-5 w-5 stroke-[1.5] ${isConnected ? "text-emerald-400" : "text-slate-500"}`} />
                        </>
                    ) : (
                        <ShieldCheck className="h-5 w-5 stroke-[1.5] text-purple-400 animate-[pulse_2.5s_infinite]" />
                    )}
                </div>

                <div className="space-y-1 min-w-0">
                    <span className="text-[9px] font-black tracking-widest uppercase flex items-center gap-1.5 text-slate-500">
                        {isUser ? (
                            <>
                                <span className={`w-1.5 h-1.5 rounded-full animate-radar ${isConnected ? "bg-emerald-500" : "bg-slate-600"}`} />
                                Estado del Dispositivo Protegido
                            </>
                        ) : (
                            <>
                                <Radio size={10} className="text-purple-400 animate-pulse" />
                                Última mitigación del sistema
                            </>
                        )}
                    </span>
                    <h4 className="text-[clamp(0.95rem,1.1vw,1.2rem)] font-black text-white truncate uppercase tracking-wide">
                        {title}
                    </h4>

                    {/* Ubicación o detalle con su icono correspondiente */}
                    <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 truncate">
                        {isUser && <MapPin size={12} className={isConnected ? "text-emerald-500/70" : "text-slate-600"} />}
                        {subtitle}
                    </p>
                </div>
            </div>

            {/* Bloque de insignia derecha */}
            <div className="shrink-0 flex items-center justify-start sm:justify-end relative z-10 border-t sm:border-t-0 border-[#1c2748]/50 pt-2 sm:pt-0">
                {isUser ? (
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded border uppercase tracking-widest transition-all duration-300 ${
                        isConnected
                            ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.05)]"
                            : "border-slate-800 bg-slate-900/50 text-slate-500"
                    }`}>
                        {isConnected ? "En Línea" : "Desconectado"}
                    </span>
                ) : (
                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-purple-400 tracking-wider">
                        <span>{timestamp || "Hace instantes"}</span>
                        <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                )}
            </div>
        </div>
    );
}