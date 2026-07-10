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
            className={`group rounded-r-xl rounded-l-none border-2 border-transparent border-l-4 ${config.borderLeft} 
            bg-linear-to-b from-[#0a0f24] to-[#060a17] p-[clamp(1.1rem,1.5vw,1.8rem)] shadow-2xl relative overflow-hidden 
            flex flex-col justify-between transition-all duration-300 ring-1 ring-inset ring-[#161f35]/40 hover:ring-[#222f50]/60 ${config.hoverBorders}`}
        >
            <div className={`absolute -top-12 -right-12 w-[clamp(200px,20vw,350px)] h-[clamp(200px,20vw,350px)] rounded-full ${config.glowColor} filter blur-[75px] opacity-5 pointer-events-none transform origin-top-right transition-all duration-500 ease-out group-hover:opacity-20 group-hover:scale-125`} />

            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-slate-500/10 to-transparent pointer-events-none" />

            <div className="relative z-10 w-full space-y-2.5">
                <h3 className="text-[clamp(1rem,1.15vw,1.3rem)] font-black tracking-wide text-white uppercase select-text group-hover:text-slate-100 transition-colors">
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
                        className="w-full sm:w-40 h-10 rounded-lg font-black tracking-widest uppercase transition-transform duration-150 active:scale-[0.96]"
                    >
                        {buttonLabel}
                    </ActionButton>
                </Link>
            </div>
        </div>
    );
}