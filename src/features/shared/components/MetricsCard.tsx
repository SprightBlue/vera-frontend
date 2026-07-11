import { Activity, AlertTriangle, CheckCircle2 } from "lucide-react";
import { UI_VARIANTS_MAP } from "@/features/shared/utils/styleConfig";

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
        <div className={`group rounded-xl border border-[#161f37] bg-linear-to-b from-[#080d20] to-[#040714] p-[clamp(1.1rem,1.5vw,1.8rem)] shadow-2xl relative overflow-hidden flex flex-col gap-4 transition-all duration-300 ring-1 ring-inset ring-[#161f35]/20 w-full hover:shadow-blue-950/30 ${infoTheme.hoverBorders}`}>

            <style>{`
                @keyframes boxBreatheGlow {
                    0%, 100% { opacity: 0.05; transform: scale(1); filter: blur(22px); }
                    50% { opacity: 0.15; transform: scale(1.2); filter: blur(18px); }
                }
                @keyframes iconPulseGlow {
                    0%, 100% { opacity: 0.75; filter: drop-shadow(0 0 2px currentColor) brightness(0.9); }
                    50% { opacity: 1; filter: drop-shadow(0 0 10px currentColor) brightness(1.3); }
                }
                .animate-box-breathe { animation: boxBreatheGlow 4s ease-in-out infinite; }
                .animate-icon-glow { animation: iconPulseGlow 3s ease-in-out infinite; }
            `}</style>

            <div className={`absolute -top-16 -right-16 w-[clamp(250px,22vw,400px)] h-[clamp(250px,22vw,400px)] rounded-full filter blur-[90px] opacity-15 pointer-events-none transform origin-top-right transition-all duration-500 ease-out group-hover:opacity-25 group-hover:scale-105 ${infoTheme.glowColor}`} />
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-blue-500/20 to-transparent pointer-events-none" />

            <div className="flex flex-col gap-0.5 relative z-10 w-full border-b border-[#182033]/50 pb-2.5">
                <h3 className="text-[clamp(0.95rem,1.1vw,1.25rem)] font-display font-black text-white uppercase tracking-wide">
                    Resumen de la última semana
                </h3>
            </div>

            <div className="grid grid-cols-3 gap-[clamp(0.4rem,0.6vw,1rem)] relative z-10 w-full">

                <div className="relative overflow-hidden bg-[#0b122c]/30 border border-[#1c2848]/70 rounded-lg p-[clamp(0.6rem,0.9vw,1.1rem)] flex flex-col items-center justify-center text-center transition-colors hover:bg-[#0b122c]/60 h-full min-h-25">
                    <div className={`absolute inset-0 m-auto w-12 h-12 rounded-full pointer-events-none animate-box-breathe ${infoTheme.glowColor}`} />
                    <div className="relative z-10 flex flex-col items-center justify-center gap-0.5 w-full">
                        <span className={`text-[10px] font-sans font-bold tracking-wider uppercase flex items-center gap-1 justify-center animate-icon-glow ${infoTheme.textColor}`}>
                            <Activity size={11} /> Análisis
                        </span>
                        <span className="text-[clamp(1.4rem,2vw,2.4rem)] font-sans font-black text-white leading-none mt-1">
                            {analysisCount}
                        </span>
                    </div>
                </div>

                <div className="relative overflow-hidden bg-[#0b122c]/30 border border-[#1c2848]/70 rounded-lg p-[clamp(0.6rem,0.9vw,1.1rem)] flex flex-col items-center justify-center text-center transition-colors hover:bg-[#0b122c]/60 h-full min-h-25">
                    <div className={`absolute inset-0 m-auto w-12 h-12 rounded-full pointer-events-none animate-box-breathe ${dangerTheme.glowColor}`} />
                    <div className="relative z-10 flex flex-col items-center justify-center gap-0.5 w-full">
                        <span className={`text-[10px] font-sans font-bold tracking-wider uppercase flex items-center gap-1 justify-center animate-icon-glow ${dangerTheme.textColor}`}>
                            <AlertTriangle size={11} /> Alertas
                        </span>
                        <span className="text-[clamp(1.4rem,2vw,2.4rem)] font-sans font-black text-white leading-none mt-1">
                            {alertsCount}
                        </span>
                    </div>
                </div>

                <div className="relative overflow-hidden bg-[#0b122c]/30 border border-[#1c2848]/70 rounded-lg p-[clamp(0.6rem,0.9vw,1.1rem)] flex flex-col items-center justify-center text-center transition-colors hover:bg-[#0b122c]/60 h-full min-h-25">
                    <div className={`absolute inset-0 m-auto w-12 h-12 rounded-full pointer-events-none animate-box-breathe ${successTheme.glowColor}`} />
                    <div className="relative z-10 flex flex-col items-center justify-center gap-0.5 w-full">
                        <span className={`text-[10px] font-sans font-bold tracking-wider uppercase flex items-center gap-1 justify-center animate-icon-glow ${successTheme.textColor}`}>
                            <CheckCircle2 size={11} /> Resueltas
                        </span>
                        <span className="text-[clamp(1.4rem,2vw,2.4rem)] font-sans font-black text-white leading-none mt-1">
                            {resolvedCount}
                        </span>
                    </div>
                </div>

            </div>
        </div>
    );
}