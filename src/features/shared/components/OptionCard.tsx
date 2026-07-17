import { Link } from "react-router-dom";
import { UI_VARIANTS_MAP, type UIVariant } from "@/features/shared/utils/styleConfig";
import { ActionButton } from "@/features/shared/components/ActionButton";

interface OptionCardProps {
    title: string;
    description: string;
    to: string;
    buttonLabel: string;
    variant: UIVariant;
}

export function OptionCard({ title, description, to, buttonLabel, variant }: OptionCardProps) {
    const config = UI_VARIANTS_MAP[variant];

    const variantBorderHover = config.borderColor || "hover:border-white/10";
    const variantDotColor = config.bgColor || "bg-slate-500";

    return (
        <div
            className={`group rounded-xl border border-white/5 bg-[#0B0D17] p-[clamp(1.2rem,2vw,2rem)] 
            shadow-xl relative overflow-hidden flex flex-col justify-between transition-all duration-300 
            ring-1 ring-inset ring-white/5 ${variantBorderHover} w-full`}
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
            {/* Resplandor elástico ambiental de fondo */}
            <div
                className={`absolute -top-20 -right-20 w-[clamp(200px,20vw,320px)] h-[clamp(200px,20vw,320px)] rounded-full ${config.glowColor} filter blur-3xl opacity-10 pointer-events-none transform origin-top-right transition-opacity duration-300`}
            />

            {/* Divisor superior de acento láser estilizado */}
            <div
                className={`absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-${variant === 'neutral' ? 'slate' : variant}-500/20 to-transparent pointer-events-none z-10`}
            />

            <div className="relative z-10 w-full space-y-3">
                <div className="flex items-center gap-2 select-none">
                    <span className={`w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.2)] ${variantDotColor}`} />
                    <span className="text-[clamp(10px,0.55vw,11px)] font-semibold tracking-wide text-slate-500 normal-case">
                        Módulo activo
                    </span>
                </div>

                <h3 className="text-[clamp(1.1rem,1.3vw,1.4rem)] font-bold text-white select-text tracking-wide pt-0.5 leading-snug normal-case">
                    {title}
                </h3>

                <p className="text-[clamp(12.5px,0.78vw,13.5px)] text-slate-400 leading-relaxed font-normal select-text max-w-prose">
                    {description}
                </p>
            </div>

            <div className="relative mt-[clamp(2rem,2.5vw,3.5rem)] w-full sm:w-auto z-10 flex sm:justify-end">
                <Link to={to} className="w-full sm:w-auto block">
                    <ActionButton
                        variant={variant}
                        className="w-full sm:w-auto px-5 shadow-md text-[12px] font-medium tracking-wide normal-case h-9.5 rounded-lg"
                    >
                        {buttonLabel}
                    </ActionButton>
                </Link>
            </div>
        </div>
    );
}