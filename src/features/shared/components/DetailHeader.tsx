import { type ReactNode, useEffect, useState } from "react";
import { UI_VARIANTS_MAP, type UIVariant } from "@/features/shared/utils/styleConfig.ts";

interface DetailRiskHeaderProps {
    title: string;
    riskLevel: string;
    percentage: number;
    variant: UIVariant;
    subtitle?: string;
    actions?: ReactNode;
}

export function DetailHeader({
                                 title,
                                 riskLevel,
                                 percentage,
                                 variant,
                                 subtitle,
                                 actions
                             }: DetailRiskHeaderProps) {
    const config = UI_VARIANTS_MAP[variant];
    const [currentPercent, setCurrentPercent] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentPercent(percentage);
        }, 150);
        return () => clearTimeout(timer);
    }, [percentage]);

    const barColors: Record<UIVariant, { bg: string; shadow: string }> = {
        danger: { bg: 'bg-red-500', shadow: 'shadow-red-500/40' },
        warning: { bg: 'bg-amber-500', shadow: 'shadow-amber-500/40' },
        success: { bg: 'bg-emerald-500', shadow: 'shadow-emerald-500/40' },
        info: { bg: 'bg-blue-500', shadow: 'shadow-blue-500/40' },
        neutral: { bg: 'bg-slate-400', shadow: 'shadow-slate-400/20' },
        purple: { bg: 'bg-purple-500', shadow: 'shadow-purple-500/40' }
    };

    const activeBar = barColors[variant];

    return (
        <div className={`group rounded-r-xl rounded-l-none border-2 border-transparent border-l-4 ${config.borderLeft} 
        bg-linear-to-b from-[#0a0f24] to-[#060a17] p-[clamp(1.1rem,1.5vw,1.8rem)] shadow-2xl relative overflow-hidden transition-all duration-300
        ring-1 ring-inset ring-[#161f35]/50 hover:ring-[#222f50]/70`}>

            <style>{`
                @keyframes breatheGlow {
                    0%, 100% { opacity: 0.10; transform: scale(1); filter: blur(80px); }
                    50% { opacity: 0.25; transform: scale(1.15); filter: blur(65px); }
                }
                .animate-breathe {
                    animation: breatheGlow 5s ease-in-out infinite;
                }
            `}</style>

            <div className={`absolute -top-12 -right-12 w-[clamp(220px,22vw,380px)] h-[clamp(220px,22vw,380px)] rounded-full pointer-events-none transform origin-top-right animate-breathe ${config.glowColor}`} />

            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-slate-500/15 to-transparent pointer-events-none" />

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative z-10">
                <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                        <h3 className="text-[clamp(1.1rem,1.3vw,1.5rem)] font-display font-black tracking-wide text-white select-text">
                            {title || 'Contenido Analizado'}
                        </h3>

                        <span className={`px-2.5 py-0.5 rounded-sm text-[clamp(10px,0.55vw,11px)] font-sans font-bold tracking-wider uppercase border shrink-0 shadow-xs ${config.bgColor} ${config.borderColor} ${config.textColor}`}>
                            Riesgo {riskLevel} {percentage}%
                        </span>
                    </div>

                    {subtitle && (
                        <p className="text-[clamp(0.78rem,0.82vw,0.88rem)] text-slate-400 leading-relaxed font-sans font-medium select-text capitalize tracking-wider">
                            {subtitle}
                        </p>
                    )}
                </div>

                {actions && (
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full md:w-auto shrink-0 z-20">
                        {actions}
                    </div>
                )}
            </div>

            <div className="w-full h-1.5 bg-slate-950/60 rounded-full mt-5 overflow-hidden ring-1 ring-white/5 relative">
                <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px] ${activeBar.bg} ${activeBar.shadow}`}
                    style={{ width: `${currentPercent}%` }}
                />
            </div>
        </div>
    );
}