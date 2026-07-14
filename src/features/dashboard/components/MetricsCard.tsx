import {UI_VARIANTS_MAP} from "@/features/shared/utils/styleConfig";

interface DashboardMetricsConsoleProps {
    analysisCount: number;
    alertsCount: number;
    resolvedCount: number;
}

export function MetricsCard({analysisCount, alertsCount, resolvedCount}: DashboardMetricsConsoleProps) {
    const infoTheme = UI_VARIANTS_MAP['info'];
    const dangerTheme = UI_VARIANTS_MAP['danger'];
    const successTheme = UI_VARIANTS_MAP['success'];

    return (
        <div
            className="rounded-xl border border-slate-800/80 bg-linear-to-b from-[#0f172a] to-[#020617] p-[clamp(1.1rem,1.5vw,1.8rem)] shadow-2xl relative overflow-hidden flex flex-col gap-5 ring-1 ring-inset ring-slate-700/10 w-full">

            <div
                className="absolute -top-24 -right-24 w-[clamp(280px,25vw,450px)] h-[clamp(280px,25vw,450px)] rounded-full bg-slate-500/10 filter blur-[80px] pointer-events-none"/>

            <div
                className="absolute -bottom-24 -left-24 w-[clamp(200px,18vw,320px)] h-[clamp(200px,18vw,320px)] rounded-full bg-slate-500/5 filter blur-[60px] pointer-events-none"/>

            <div
                className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-slate-500/20 to-transparent pointer-events-none"/>

            <div className="flex flex-col gap-0.5 relative z-10 w-full border-b border-slate-800/60 pb-3.5">
                <span
                    className="text-[clamp(10px,0.58vw,11px)] font-display font-extrabold text-slate-500 tracking-widest uppercase select-none leading-none">
                    Métricas de Actividades
                </span>
                <h3 className="text-[clamp(13.5px,0.9vw,16px)] font-display font-black uppercase text-white tracking-wide select-text mt-1">
                    Resumen de la última semana
                </h3>
            </div>

            <div className="grid grid-cols-3 divide-x divide-slate-800/60 relative z-10 w-full">

                <div
                    className="relative p-[clamp(0.6rem,0.9vw,1.1rem)] flex flex-col items-center justify-center text-center h-full min-h-24 select-text">
                    <div className="relative z-10 flex flex-col items-center justify-center gap-2.5 w-full">

                        <div className="flex items-center gap-2 justify-center">
                            <span className="relative flex h-2 w-2 shrink-0">
                                <span
                                    className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"/>
                                <span
                                    className="relative inline-flex rounded-full h-2 w-2 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"/>
                            </span>
                            <span
                                className={`text-[10px] font-display font-extrabold tracking-widest uppercase ${infoTheme.textColor}`}>
                                Análisis
                            </span>
                        </div>

                        <span
                            className="text-[clamp(1.5rem,2.1vw,2.6rem)] font-sans font-black text-white leading-none mt-0.5">
                            {analysisCount}
                        </span>
                    </div>
                </div>

                <div
                    className="relative p-[clamp(0.6rem,0.9vw,1.1rem)] flex flex-col items-center justify-center text-center h-full min-h-24 select-text">
                    <div className="relative z-10 flex flex-col items-center justify-center gap-2.5 w-full">

                        <div className="flex items-center gap-2 justify-center">
                            <span className="relative flex h-2 w-2 shrink-0">
                                <span
                                    className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"/>
                                <span
                                    className="relative inline-flex rounded-full h-2 w-2 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"/>
                            </span>
                            <span
                                className={`text-[10px] font-display font-extrabold tracking-widest uppercase ${dangerTheme.textColor}`}>
                                Alertas
                            </span>
                        </div>

                        <span
                            className="text-[clamp(1.5rem,2.1vw,2.6rem)] font-sans font-black text-white leading-none mt-0.5">
                            {alertsCount}
                        </span>
                    </div>
                </div>

                <div
                    className="relative p-[clamp(0.6rem,0.9vw,1.1rem)] flex flex-col items-center justify-center text-center h-full min-h-24 select-text">
                    <div className="relative z-10 flex flex-col items-center justify-center gap-2.5 w-full">

                        <div className="flex items-center gap-2 justify-center">
                            <span className="relative flex h-2 w-2 shrink-0">
                                <span
                                    className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"/>
                                <span
                                    className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"/>
                            </span>
                            <span
                                className={`text-[10px] font-display font-extrabold tracking-widest uppercase ${successTheme.textColor}`}>
                                Resueltas
                            </span>
                        </div>

                        <span
                            className="text-[clamp(1.5rem,2.1vw,2.6rem)] font-sans font-black text-white leading-none mt-0.5">
                            {resolvedCount}
                        </span>
                    </div>
                </div>

            </div>
        </div>
    );
}