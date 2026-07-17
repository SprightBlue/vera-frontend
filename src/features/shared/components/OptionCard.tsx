import {Link} from "react-router-dom";
import {UI_VARIANTS_MAP, type UIVariant} from "@/features/shared/utils/styleConfig";
import {ActionButton} from "@/features/shared/components/ActionButton";

interface OptionCardProps {
    title: string;
    description: string;
    to: string;
    buttonLabel: string;
    variant: UIVariant;
}

export function OptionCard({title, description, to, buttonLabel, variant}: OptionCardProps) {
    const config = UI_VARIANTS_MAP[variant];

    const variantBorderHover = config.borderColor || "hover:border-slate-700";
    const variantDotColor = config.bgColor || "bg-slate-500";

    return (
        <div
            className={`group rounded-xl border border-[#161f37] bg-linear-to-b from-[#080d20] to-[#040714] p-[clamp(1.3rem,2.2vw,2.2rem)] 
            shadow-2xl relative overflow-hidden flex flex-col justify-between transition-all duration-300 
            ring-1 ring-inset ring-[#161f35]/20 ${variantBorderHover} w-full`}
        >
            <div
                className={`absolute -top-20 -right-20 w-[clamp(220px,22vw,350px)] h-[clamp(220px,22vw,350px)] rounded-full ${config.glowColor} filter blur-3xl opacity-20 pointer-events-none transform origin-top-right transition-opacity duration-300`}/>

            <div
                className={`absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-${variant === 'neutral' ? 'slate-500' : variant}-500/30 to-transparent pointer-events-none z-10`}/>

            <div className="relative z-10 w-full space-y-4">

                <div className="flex items-center gap-2 select-none">
                    <span className={`w-2 h-2 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.2)] ${variantDotColor}`}/>
                    <span
                        className="text-[clamp(10px,0.55vw,11.5px)] font-sans font-black tracking-widest text-slate-500 uppercase">
                        Módulo • Activo
                    </span>
                </div>

                <h3 className="text-[clamp(1.15rem,1.4vw,1.55rem)] font-display font-black text-white select-text tracking-wide pt-0.5 leading-tight">
                    {title}
                </h3>

                <p className="text-[clamp(13.5px,0.8vw,14.5px)] text-slate-400 leading-relaxed font-sans font-medium select-text max-w-prose">
                    {description}
                </p>
            </div>

            <div className="relative mt-[clamp(2.5rem,3vw,4rem)] w-full sm:w-auto z-10 flex sm:justify-end">
                <Link to={to} className="w-full sm:w-auto block">
                    <ActionButton
                        variant={variant}
                        className="w-full sm:w-auto px-6 shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
                    >
                        {buttonLabel}
                    </ActionButton>
                </Link>
            </div>
        </div>
    );
}