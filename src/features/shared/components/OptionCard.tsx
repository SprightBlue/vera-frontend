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
            className={`group rounded-xl border border-[#161f37]/80 bg-[#080d20]/50 p-[clamp(1.1rem,1.5vw,1.8rem)] 
            shadow-xl relative overflow-hidden flex flex-col justify-between transition-all duration-300 
            ring-1 ring-inset ring-[#161f35]/20 hover:bg-[#0c1430]/60 hover:border-[#222f50] 
            hover:shadow-[0_0_30px_rgba(0,0,0,0.3)] w-full`}
        >
            <div className={`absolute -top-12 -right-12 w-[clamp(200px,20vw,350px)] h-[clamp(200px,20vw,350px)] rounded-full ${config.glowColor} filter blur-[80px] opacity-5 pointer-events-none transform origin-top-right transition-all duration-500 ease-out group-hover:opacity-15 group-hover:scale-125`} />

            <div className={`absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent to-transparent pointer-events-none transition-all duration-300 z-10 group-hover:${config.laserColor}/35`} />

            <div className="relative z-10 w-full space-y-2.5">
                <div className="flex items-center gap-1.5 select-none">
                    <span className={`w-1.5 h-1.5 rounded-full ${config.glowColor} opacity-60 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_8px_currentColor]`} />
                    <span className="text-[10px] font-sans font-bold tracking-widest text-slate-500 uppercase group-hover:text-slate-400 transition-colors">
                        Módulo Disponible
                    </span>
                </div>

                <h3 className="text-[clamp(1rem,1.15vw,1.3rem)] font-display font-black uppercase text-white select-text tracking-wide pt-0.5">
                    {title}
                </h3>
                <p className="text-[clamp(0.78rem,0.82vw,0.88rem)] text-slate-400 leading-relaxed font-medium select-text max-w-prose">
                    {description}
                </p>
            </div>

            <div className="relative mt-[clamp(1.8rem,2.2vw,2.8rem)] w-full sm:w-auto z-10 flex sm:justify-end">
                <Link to={to} className="w-full sm:w-auto block">
                    <ActionButton
                        variant={variant}
                        className="w-full sm:w-40 h-10 rounded-lg transition-all duration-150 active:scale-[0.96]"
                    >
                        {buttonLabel}
                    </ActionButton>
                </Link>
            </div>
        </div>
    );
}