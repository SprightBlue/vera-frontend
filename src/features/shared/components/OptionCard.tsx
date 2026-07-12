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

    return (
        <div
            className={`group rounded-xl border border-[#161f37] bg-linear-to-b from-[#080d20] to-[#040714] p-[clamp(1.2rem,2vw,2rem)] 
            shadow-2xl relative overflow-hidden flex flex-col justify-between transition-all duration-200 
            ring-1 ring-inset ring-[#161f35]/20 hover:border-[#222f50] w-full`}
        >
            <div className={`absolute -top-16 -right-16 w-[clamp(180px,18vw,300px)] h-[clamp(180px,18vw,300px)] rounded-full ${config.glowColor} filter blur-3xl opacity-10 pointer-events-none transform origin-top-right`} />

            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-slate-500/10 to-transparent pointer-events-none" />

            <div className="relative z-10 w-full space-y-3">
                <div className="flex items-center gap-2 select-none">
                    <span className={`w-1.5 h-1.5 rounded-full ${config.glowColor}`} />
                    <span className="text-[clamp(10px,0.55vw,11px)] font-sans font-bold tracking-wider text-slate-500 uppercase">
                        Módulo Disponible
                    </span>
                </div>

                <h3 className="text-[clamp(1.1rem,1.3vw,1.4rem)] font-display font-extrabold uppercase text-white select-text tracking-wide pt-0.5">
                    {title}
                </h3>
                <p className="text-[clamp(13px,0.8vw,14px)] text-slate-400 leading-relaxed font-sans font-medium select-text max-w-prose">
                    {description}
                </p>
            </div>

            <div className="relative mt-[clamp(2rem,2.5vw,3.5rem)] w-full sm:w-auto z-10 flex sm:justify-end">
                <Link to={to} className="w-full sm:w-auto block">
                    <ActionButton variant={variant}>
                        {buttonLabel}
                    </ActionButton>
                </Link>
            </div>
        </div>
    );
}