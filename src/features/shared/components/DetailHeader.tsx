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

    const activeBar = barColors[variant] || barColors.neutral;

    return (
        <div className={`group rounded-xl border border-[#161f37] border-l-4 ${config.borderLeft} 
        bg-linear-to-b from-[#080d20] to-[#040714] p-[clamp(1.2rem,2vw,2rem)] shadow-2xl relative overflow-hidden transition-all duration-200
        ring-1 ring-inset ring-[#161f35]/20 w-full`}>

            <div className={`absolute -top-20 -right-20 w-[clamp(200px,20vw,350px)] h-[clamp(200px,20vw,350px)] rounded-full filter blur-3xl opacity-15 pointer-events-none ${config.glowColor}`} />

            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-slate-500/10 to-transparent pointer-events-none" />

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative z-10 w-full">
                <div className="space-y-2.5 min-w-0 flex-1 w-full">
                    <div className="flex flex-wrap items-center gap-3 w-full">
                        <h3 className="text-[clamp(1.15rem,1.35vw,1.55rem)] font-display font-extrabold uppercase tracking-wide text-white select-text truncate">
                            {title || 'Contenido Analizado'}
                        </h3>

                        <span className={`px-2.5 h-5 flex items-center rounded-md text-[clamp(10px,0.55vw,11px)] font-sans font-bold tracking-wider uppercase border shrink-0 shadow-xs ${config.bgColor} ${config.borderColor} ${config.textColor}`}>
                            Riesgo {riskLevel} {percentage}%
                        </span>
                    </div>

                    {subtitle && (
                        <p className="text-[clamp(13px,0.8vw,14px)] text-slate-400 leading-relaxed font-sans font-medium select-text tracking-wide">
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

            <div className="w-full h-1.5 bg-slate-950/60 rounded-full mt-6 overflow-hidden ring-1 ring-white/5 relative">
                <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px] ${activeBar.bg} ${activeBar.shadow}`}
                    style={{ width: `${currentPercent}%` }}
                />
            </div>
        </div>
    );
}