import {type ComponentType} from "react";
import {type UIVariant} from "@/features/shared/utils/styleConfig";
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
                                    onClickAction
                                }: DashboardBannerProps) {

    return (
        <div
            className="w-full bg-linear-to-b from-[#0e1630] to-[#060a18] rounded-xl border border-[#22356b] flex flex-col md:flex-row items-stretch justify-between relative overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.45)] ring-1 ring-inset ring-blue-500/20">

            <div
                className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-blue-400/40 to-transparent pointer-events-none z-20"/>

            <div
                className="absolute -bottom-16 left-0 right-0 w-full h-24 rounded-full filter blur-3xl pointer-events-none opacity-20 bg-blue-500/35 z-10"/>

            <div
                className="absolute -top-12 -right-12 w-[clamp(280px,22vw,450px)] h-[clamp(280px,22vw,450px)] rounded-full bg-blue-500/10 filter blur-3xl pointer-events-none z-0"/>

            <div className="flex-1 p-[clamp(1.4rem,2.2vw,2.8rem)] flex flex-col justify-center gap-2 relative z-10">
                <h3 className="text-[clamp(1.2rem,1.5vw,1.85rem)] font-display font-black tracking-wide text-white uppercase select-text leading-tight">
                    {title}
                </h3>

                <p className="text-[clamp(0.85rem,0.92vw,1.05rem)] font-sans text-slate-300 font-medium normal-case leading-relaxed max-w-4xl select-text">
                    {description}
                </p>
            </div>

            <div
                className="p-[clamp(1.4rem,2.2vw,2.8rem)] flex items-center justify-center shrink-0 w-full md:w-auto min-w-[clamp(240px,16vw,310px)] relative z-10">
                <div className="w-full relative">
                    <ActionButton
                        variant="info"
                        icon={Icon}
                        onClick={onClickAction}
                        className="w-full! h-[clamp(2.3rem,2.6vw,2.8rem)]! font-sans font-black tracking-wider uppercase rounded-md shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
                    >
                        {buttonLabel}
                    </ActionButton>
                </div>
            </div>

        </div>
    );
}