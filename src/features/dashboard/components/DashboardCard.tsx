import { ActionButton } from "@/features/shared/components/ActionButton.tsx";
import { UI_VARIANTS_MAP, type UIVariant } from "@/features/shared/utils/styleConfig.ts";
import type { ReactNode } from "react";

interface DashboardCardProps {
    tagLabel: string;
    title: string;
    timestampLabel: string;
    actionLabel: string;
    variant: UIVariant;
    onActionClick: () => void;
    avatarNode?: ReactNode;
}

export function DashboardCard({
                                  tagLabel,
                                  title,
                                  timestampLabel,
                                  actionLabel,
                                  variant,
                                  onActionClick,
                                  avatarNode
                              }: DashboardCardProps) {
    const theme = UI_VARIANTS_MAP[variant];

    return (
        <div className="group rounded-xl border border-[#161f37] bg-linear-to-b from-[#080d20] to-[#040714] p-[clamp(1.1rem,1.5vw,1.8rem)] shadow-2xl relative overflow-hidden flex flex-col sm:flex-row items-stretch justify-between gap-5 transition-all duration-300 ring-1 ring-inset ring-[#161f35]/20 w-full">

            <div className={`absolute -top-12 -right-12 w-[clamp(200px,20vw,350px)] h-[clamp(200px,20vw,350px)] rounded-full filter blur-[75px] opacity-10 pointer-events-none ${theme.glowColor}`} />

            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-slate-500/10 to-transparent pointer-events-none" />

            <div className="flex flex-col justify-center min-w-0 flex-1 relative z-10 gap-2">
                <span className={`text-[clamp(0.75rem,0.8vw,0.86rem)] font-sans font-semibold leading-relaxed tracking-wider uppercase select-none ${theme.textColor}`}>
                    {tagLabel}
                </span>

                <div className="flex items-center gap-3 w-full">
                    {avatarNode && <div className="shrink-0">{avatarNode}</div>}

                    <h3 className="text-[clamp(0.95rem,1.1vw,1.25rem)] font-display font-black text-white line-clamp-2 tracking-wide flex-1">
                        {title}
                    </h3>
                </div>
            </div>

            <div className="flex flex-col items-start sm:items-end justify-between gap-4 shrink-0 w-full sm:w-auto border-t sm:border-t-0 border-[#182033]/40 pt-3 sm:pt-0 relative z-10">
                <span className="text-[clamp(0.72rem,0.76vw,0.82rem)] font-sans font-bold text-slate-500 leading-relaxed tracking-wider sm:text-right uppercase mt-1 sm:mt-0">
                    {timestampLabel}
                </span>

                <ActionButton
                    variant={variant}
                    onClick={onActionClick}
                    className="w-full sm:w-40 h-9 font-sans font-bold tracking-wider uppercase"
                >
                    {actionLabel}
                </ActionButton>
            </div>
        </div>
    );
}