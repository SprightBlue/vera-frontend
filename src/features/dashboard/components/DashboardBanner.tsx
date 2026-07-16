import {type ComponentType} from "react";
import {UI_VARIANTS_MAP, type UIVariant} from "@/features/shared/utils/styleConfig";
import {ActionButton} from "@/features/shared/components/ActionButton";

interface DashboardBannerProps {
    title: string;
    description: string;
    buttonLabel: string;
    buttonIcon: ComponentType<{ className?: string }>;
    buttonVariant: UIVariant;
    onClickAction: () => void;
}

export function DashboardBanner({
                                    title,
                                    description,
                                    buttonLabel,
                                    buttonIcon: Icon,
                                    buttonVariant,
                                    onClickAction
                                }: DashboardBannerProps) {

    const config = UI_VARIANTS_MAP[buttonVariant];
    const variantBorderHover = config.borderColor || "hover:border-slate-700";
    const variantDotColor = config.bgColor || "bg-slate-500";

    return (
        <div
            className={`group rounded-xl border border-[#161f37] bg-linear-to-b from-[#080d20] to-[#040714] 
            p-[clamp(1.3rem,2.2vw,2.2rem)] shadow-2xl relative overflow-hidden flex flex-col md:flex-row 
            items-stretch justify-between ring-1 ring-inset ring-[#161f35]/20 ${variantBorderHover} w-full`}
        >
            <div
                className={`absolute -top-20 -right-20 w-[clamp(250px,25vw,400px)] h-[clamp(250px,25vw,400px)] rounded-full ${config.glowColor} filter blur-3xl opacity-20 pointer-events-none`}
            />

            <div
                className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-blue-500/10 to-transparent pointer-events-none z-10"
            />

            <div className="flex-1 flex flex-col justify-center gap-3 relative z-10">
                <div className="flex items-center gap-2 select-none">
                    <span className={`w-2 h-2 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.2)] ${variantDotColor}`}/>
                    <span
                        className="text-[clamp(10px,0.55vw,11.5px)] font-sans font-black tracking-widest text-slate-500 uppercase">
                        Acción • Disponible
                    </span>
                </div>

                <h3 className="text-[clamp(1.2rem,1.5vw,1.85rem)] font-display font-black tracking-wide text-white uppercase select-text leading-tight">
                    {title}
                </h3>

                <p className="text-[clamp(13.5px,0.8vw,14.5px)] text-slate-400 leading-relaxed font-sans font-medium max-w-3xl select-text">
                    {description}
                </p>
            </div>

            <div
                className="mt-6 md:mt-0 p-1 flex items-center justify-center shrink-0 w-full md:w-auto min-w-[clamp(200px,14vw,280px)] relative z-10">
                <div className="w-full">
                    <ActionButton
                        variant={buttonVariant}
                        icon={Icon}
                        onClick={onClickAction}
                        className="w-full! h-[clamp(2.3rem,2.6vw,2.8rem)]! font-sans font-black tracking-wider uppercase rounded-md shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
                    >
                        {buttonLabel}
                    </ActionButton>
                </div>
            </div>

        </div>
    );
}