import {type ReactNode, useEffect, useState} from "react";
import {UI_VARIANTS_MAP, UI_TOGGLE_STYLES, type UIVariant} from "@/features/shared/utils/styleConfig";

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
        danger: {bg: 'bg-red-500', shadow: 'shadow-red-500/40'},
        warning: {bg: 'bg-amber-500', shadow: 'shadow-amber-500/40'},
        success: {bg: 'bg-emerald-500', shadow: 'shadow-emerald-500/40'},
        info: {bg: 'bg-blue-500', shadow: 'shadow-blue-500/40'},
        neutral: {bg: 'bg-slate-400', shadow: 'shadow-slate-400/20'},
        purple: {bg: 'bg-purple-500', shadow: 'shadow-purple-500/40'}
    };

    const activeBar = barColors[variant] || barColors.neutral;
    const activeToggleStyle = UI_TOGGLE_STYLES[variant] || "";

    return (
        <div className={`group rounded-r-xl rounded-l-none border border-[#161f37] border-l-4 ${config.borderLeft} 
        bg-linear-to-b from-[#080d20] to-[#040714] p-[clamp(1.2rem,2vw,2rem)] shadow-2xl relative overflow-hidden transition-all duration-200
        ring-1 ring-inset ring-[#161f35]/20 w-full`}>

            <div
                className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-size-[3.5rem_3.5rem] opacity-45 pointer-events-none z-0"
            />

            <div
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,#080d20_95%)] pointer-events-none z-0"
            />

            <div
                className={`absolute -top-20 -right-20 w-[clamp(200px,20vw,350px)] h-[clamp(200px,20vw,350px)] rounded-full filter blur-3xl opacity-15 pointer-events-none ${config.glowColor}`}
            />

            <div
                className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-slate-500/10 to-transparent pointer-events-none"
            />

            <div
                className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative z-10 w-full"
            >
                <div className="space-y-2.5 min-w-0 flex-1 w-full">
                    <div className="flex flex-wrap items-center gap-3 w-full">
                        <h3 className="text-[clamp(1.15rem,1.35vw,1.55rem)] font-display font-extrabold uppercase tracking-wide text-white select-text truncate">
                            {title || 'Contenido Analizado'}
                        </h3>

                        <span
                            className={`px-3.5 h-6 flex items-center rounded-lg border text-[clamp(9.5px,0.52vw,10.5px)] font-sans font-bold tracking-wider uppercase shrink-0 shadow-md relative overflow-hidden text-white ring-1 ring-inset ring-white/5 select-none ${activeToggleStyle}`}
                        >
                            <div
                                className={`absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-transparent to-transparent z-10 ${
                                    config.laserColor ? `via-${config.laserColor}/30` : 'via-white/25'
                                }`}
                            />

                            <div
                                className={`absolute -top-3 -right-3 w-8 h-8 rounded-full filter blur-sm opacity-20 pointer-events-none transform origin-top-right z-0 ${config.glowColor}`}
                            />

                            <span className="relative z-10">
                                Riesgo {riskLevel} {percentage}%
                            </span>
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

            <div
                className="w-full h-1.5 bg-slate-950/60 rounded-full mt-6 overflow-hidden ring-1 ring-white/5 relative z-10"
            >
                <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px] ${activeBar.bg} ${activeBar.shadow}`}
                    style={{width: `${currentPercent}%`}}
                />
            </div>
        </div>
    );
}