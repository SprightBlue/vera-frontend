import { type ReactNode, useEffect, useState } from "react";
import { UI_VARIANTS_MAP, UI_TOGGLE_STYLES, type UIVariant } from "@/features/shared/utils/styleConfig";

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
    const [currentPercent, setCurrentPercent] = useState("0%");

    useEffect(() => {
        const frame = requestAnimationFrame(() => {
            setCurrentPercent(`${percentage}%`);
        });
        return () => cancelAnimationFrame(frame);
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
    const activeToggleStyle = UI_TOGGLE_STYLES[variant] || "";
    const variantBorderHover = config.borderColor || "hover:border-slate-700";

    return (
        <div className={`group rounded-xl border border-white/5 border-l-4 ${config.borderLeft} 
        bg-linear-to-b from-[#080d20] to-[#040714] p-[clamp(1.2rem,2.2vw,2.2rem)] shadow-2xl relative overflow-hidden 
        transition-all duration-200 ring-1 ring-inset ring-white/5 ${variantBorderHover} w-full`}
        >
            {/* Brillo decorativo fluido igual al DashboardBanner */}
            <div
                className={`absolute -top-20 -right-20 w-[clamp(240px,25vw,360px)] h-[clamp(240px,25vw,360px)] rounded-full ${config.glowColor} filter blur-3xl opacity-20 pointer-events-none`}
            />

            {/* Línea superior fluida de acento */}
            <div
                className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-[#0D6EFD]/10 to-transparent pointer-events-none z-10"
            />

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative z-10 w-full">

                <div className="flex-1 flex flex-col justify-center gap-3 min-w-0 w-full">

                    {/* Badge de Riesgo integrado sin mutaciones de texto (normal-case nativo) */}
                    <div className="flex items-center w-full">
                        <span
                            className={`px-3 h-6 flex items-center rounded-md border text-[clamp(10px,0.55vw,11px)] font-sans font-semibold normal-case shrink-0 shadow-md text-white ring-1 ring-inset ring-white/5 select-none ${activeToggleStyle}`}
                        >
                            Riesgo {riskLevel} {percentage}%
                        </span>
                    </div>

                    {/* Encabezado fluido con la clase @layer heredada impecable */}
                    <h3 className="heading-md select-text normal-case text-white w-full break-words">
                        {title}
                    </h3>

                    {/* Texto descriptivo fluido con la clase @layer heredada */}
                    {subtitle && (
                        <p className="body-text max-w-3xl select-text w-full break-words">
                            {subtitle}
                        </p>
                    )}
                </div>

                {actions && (
                    <div className="mt-2 md:mt-0 flex items-center justify-center shrink-0 w-full md:w-auto min-w-[clamp(180px,15vw,240px)] z-20">
                        {/* Contenedor flexible con gap interno para separar múltiples botones */}
                        <div className="flex flex-wrap items-center justify-start md:justify-end gap-2.5 w-full">
                            {actions}
                        </div>
                    </div>
                )}
            </div>

            {/* Contenedor e indicador de la línea de carga con transición explícita */}
            <div
                className="w-full h-1.5 bg-slate-950/60 rounded-full mt-6 overflow-hidden ring-1 ring-white/5 relative z-10"
            >
                <div
                    className={`h-full rounded-full transition-[width] duration-1000 ease-out shadow-[0_0_10px] ${activeBar.bg} ${activeBar.shadow}`}
                    style={{ width: currentPercent }}
                />
            </div>
        </div>
    );
}