import { Activity, AlertTriangle, CheckCircle2 } from "lucide-react";
import { UI_VARIANTS_MAP } from "@/features/shared/utils/styleConfig.ts";

interface DashboardMetricsConsoleProps {
    analysisCount: number;
    alertsCount: number;
    resolvedCount: number;
}

export function MetricsCard({ analysisCount, alertsCount, resolvedCount }: DashboardMetricsConsoleProps) {
    const infoTheme = UI_VARIANTS_MAP['info'];
    const dangerTheme = UI_VARIANTS_MAP['danger'];
    const successTheme = UI_VARIANTS_MAP['success'];

    return (
        <div className="group rounded-xl border border-[#161f37] bg-linear-to-b from-[#080d20] to-[#040714] p-[clamp(1.1rem,1.5vw,1.8rem)] shadow-2xl relative overflow-hidden flex flex-col gap-4 ring-1 ring-inset ring-[#161f35]/20 w-full">

            <div className={`absolute -top-16 -right-16 w-[clamp(250px,22vw,400px)] h-[clamp(250px,22vw,400px)] rounded-full filter blur-[90px] opacity-10 pointer-events-none ${infoTheme.glowColor}`} />

            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-slate-500/10 to-transparent pointer-events-none" />

            <div className="flex flex-col gap-0.5 relative z-10 w-full border-b border-[#182033]/50 pb-2.5">
                <h3 className="text-[clamp(0.95rem,1.1vw,1.25rem)] font-display font-bold uppercase text-white tracking-wide select-text">
                    Resumen de la última semana
                </h3>
            </div>

            <div className="grid grid-cols-3 divide-x divide-[#182033]/60 relative z-10 w-full">

                <div className="relative overflow-hidden bg-[#0b122c]/10 p-[clamp(0.6rem,0.9vw,1.1rem)] flex flex-col items-center justify-center text-center h-full min-h-25 select-text">

                    <div className={`absolute inset-0 m-auto w-16 h-16 rounded-full filter blur-lg opacity-25 scale-110 pointer-events-none ${infoTheme.glowColor}`} />

                    <div className="relative z-10 flex flex-col items-center justify-center gap-0.5 w-full">
                        <span className={`text-[10px] font-sans font-bold tracking-wider uppercase flex items-center gap-1.5 justify-center ${infoTheme.textColor}`}>
                            <Activity size={12} /> Análisis
                        </span>
                        <span className="text-[clamp(1.4rem,2vw,2.4rem)] font-sans font-black text-white leading-none mt-1.5">
                            {analysisCount}
                        </span>
                    </div>
                </div>

                <div className="relative overflow-hidden bg-[#0b122c]/10 p-[clamp(0.6rem,0.9vw,1.1rem)] flex flex-col items-center justify-center text-center h-full min-h-25 select-text">

                    <div className={`absolute inset-0 m-auto w-16 h-16 rounded-full filter blur-lg opacity-25 scale-110 pointer-events-none ${dangerTheme.glowColor}`} />

                    <div className="relative z-10 flex flex-col items-center justify-center gap-0.5 w-full">
                        <span className={`text-[10px] font-sans font-bold tracking-wider uppercase flex items-center gap-1.5 justify-center ${dangerTheme.textColor}`}>
                            <AlertTriangle size={12} /> Alertas
                        </span>
                        <span className="text-[clamp(1.4rem,2vw,2.4rem)] font-sans font-black text-white leading-none mt-1.5">
                            {alertsCount}
                        </span>
                    </div>
                </div>

                <div className="relative overflow-hidden bg-[#0b122c]/10 p-[clamp(0.6rem,0.9vw,1.1rem)] flex flex-col items-center justify-center text-center h-full min-h-25 select-text">

                    <div className={`absolute inset-0 m-auto w-16 h-16 rounded-full filter blur-lg opacity-25 scale-110 pointer-events-none ${successTheme.glowColor}`} />

                    <div className="relative z-10 flex flex-col items-center justify-center gap-0.5 w-full">
                        <span className={`text-[10px] font-sans font-bold tracking-wider uppercase flex items-center gap-1.5 justify-center ${successTheme.textColor}`}>
                            <CheckCircle2 size={12} /> Resueltas
                        </span>
                        <span className="text-[clamp(1.4rem,2vw,2.4rem)] font-sans font-black text-white leading-none mt-1.5">
                            {resolvedCount}
                        </span>
                    </div>
                </div>

            </div>
        </div>
    );
}