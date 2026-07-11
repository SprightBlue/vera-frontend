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
        info: { line: "from-blue-500/50 via-blue-500/20 to-transparent", glow: "bg-blue-500/20" },
        purple: { line: "from-purple-500/50 via-purple-500/20 to-transparent", glow: "bg-purple-500/20" }
    };
    const activeNeon = neonColors[buttonVariant] || neonColors.info;

    return (
        <div className="w-full bg-[#070b19] rounded-xl border border-[#161f37] flex flex-col md:flex-row items-stretch justify-between relative overflow-hidden shadow-2xl animate-fade-in group">

            <div className={`absolute bottom-0 left-0 right-0 h-px bg-linear-to-r ${activeNeon.line} pointer-events-none z-20`} />

            <div className={`absolute -bottom-16 left-0 right-0 w-full h-24 rounded-full filter blur-3xl pointer-events-none opacity-60 ${activeNeon.glow} z-10`} />

            <div className="flex-1 p-[clamp(1.2rem,2vw,2.5rem)] flex flex-col justify-center gap-[clamp(0.4rem,0.6vw,0.8rem)] relative z-10">
                <h3 className="text-[clamp(1.1rem,1.4vw,1.6rem)] font-display font-black tracking-wide text-white uppercase">
                    {title}
                </h3>
                <p className="text-[clamp(0.82rem,0.9vw,1rem)] font-sans text-slate-400 font-medium normal-case leading-relaxed max-w-4xl">
                    {description}
                </p>
            </div>

            <div className="p-[clamp(1.2rem,2vw,2.5rem)] flex items-center justify-center shrink-0 w-full md:w-auto min-w-[clamp(220px,15vw,290px)] relative z-10">
                <div className="w-full relative">
                    <ActionButton
                        variant={buttonVariant}
                        icon={Icon}
                        onClick={onClickAction}
                        className="w-full! h-[clamp(2.2rem,2.5vw,2.65rem)]! font-sans font-bold tracking-wider shadow-lg transition-transform duration-150 active:scale-[0.98]"
                    >
                        {buttonLabel}
                    </ActionButton>
                </div>
            </div>

        </div>
    );
}