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
            className={`group rounded-xl border border-white/5 bg-[#0B0D17] p-[clamp(1.2rem,2vw,1.6rem)] 
            shadow-xl relative overflow-hidden flex flex-col justify-between transition-all duration-300 
            ring-1 ring-inset ring-white/5 ${variantBorderHover} w-full`}
        >
            <div className={`absolute -top-20 -right-20 w-[clamp(200px,20vw,320px)] h-[clamp(200px,20vw,320px)] rounded-full ${config.glowColor} filter blur-3xl opacity-10 pointer-events-none transform origin-top-right transition-opacity duration-300`} />
            <div className={`absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-${variant === 'neutral' ? 'slate' : variant}-500/20 to-transparent pointer-events-none z-10`} />

            <div className="relative z-10 w-full space-y-2.5">
                <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.2)] ${variantDotColor}`} />
                    <span className="text-[clamp(11px,0.6vw,12px)] font-semibold tracking-wide text-slate-500 normal-case select-text">
                        Módulo activo
                    </span>
                </div>

                {/* Título intermedio optimizado: de heading-lg a text-base responsivo con presencia */}
                <h3 className="text-[clamp(15.5px,1vw,17.5px)] font-semibold text-slate-100 leading-snug select-text w-full normal-case">
                    {title}
                </h3>

                {/* Descripción intermedia optimizada: de body-text a text-sm limpio */}
                <p className="text-[clamp(13px,0.8vw,14.5px)] text-slate-400 leading-relaxed select-text max-w-prose">
                    {description}
                </p>
            </div>

            <div className="relative mt-[clamp(1.5rem,2vw,2.5rem)] w-full sm:w-auto z-10 flex sm:justify-end">
                <Link to={to} className="w-full sm:w-auto block">
                    <ActionButton
                        variant={variant}
                        className="w-full sm:w-auto px-5 shadow-md text-[12px] font-semibold tracking-wide normal-case h-9.5 rounded-lg"
                    >
                        {buttonLabel}
                    </ActionButton>
                </Link>
            </div>
        </div>
    );
}