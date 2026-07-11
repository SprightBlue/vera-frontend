import { type ComponentType } from "react";
import { type UIVariant } from "@/features/shared/utils/styleConfig.ts";
import { ActionButton } from "@/features/shared/components/ActionButton";

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

    const neonColors: Record<string, { line: string; glow: string }> = {
        info: { line: "from-blue-500/50 via-blue-500/20 to-transparent", glow: "bg-blue-500/10" },
        purple: { line: "from-purple-500/50 via-purple-500/20 to-transparent", glow: "bg-purple-500/10" }
    };
    const activeNeon = neonColors[buttonVariant] || neonColors.info;

    return (
        <div className="w-full bg-[#070b19] rounded-xl border border-[#161f37] flex flex-col md:flex-row items-stretch justify-between relative overflow-hidden shadow-2xl animate-fade-in group">

            <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r ${activeNeon.line} pointer-events-none`} />
            <div className={`absolute -bottom-10 left-10 w-72 h-20 rounded-full filter blur-2xl pointer-events-none ${activeNeon.glow}`} />

            <div className="flex-1 p-[clamp(1.2rem,2vw,2.5rem)] flex flex-col justify-center gap-[clamp(0.4rem,0.6vw,0.8rem)] relative z-10">
                <h3 className="text-[clamp(1.1rem,1.4vw,1.6rem)] font-display font-black tracking-wide text-white uppercase">
                    {title}
                </h3>
                <p className="text-[clamp(0.82rem,0.9vw,1rem)] font-sans text-slate-400 font-medium normal-case leading-relaxed">
                    {description}
                </p>
            </div>

            <div className="bg-[#0b122c] border-t md:border-t-0 md:border-l border-[#1c2848] px-[clamp(1.5rem,2.2vw,3rem)] py-5 md:py-0 flex items-center justify-center shrink-0 min-w-[clamp(230px,16vw,320px)] relative before:absolute before:inset-0 before:bg-linear-to-b before:from-white/1 before:to-transparent pointer-events-auto">
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 filter blur-[20px] ${activeNeon.glow} pointer-events-none`} />

                <div className="w-full relative z-10">
                    <ActionButton
                        variant={buttonVariant}
                        icon={Icon}
                        onClick={onClickAction}
                        className="w-full! h-[clamp(2.2rem,2.5vw,2.65rem)]! font-sans font-bold tracking-wider shadow-lg"
                    >
                        {buttonLabel}
                    </ActionButton>
                </div>
            </div>

        </div>
    );
}