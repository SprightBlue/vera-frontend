import {ActionButton} from "@/features/shared/components/ActionButton";
import {type UIVariant} from "@/features/shared/utils/styleConfig";
import type {ReactNode} from "react";

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

    return (
        <div
            className="group rounded-xl border border-slate-800/80 bg-linear-to-b from-[#0f172a] to-[#020617] p-[clamp(1.1rem,1.5vw,1.8rem)] shadow-2xl relative overflow-hidden flex flex-col sm:flex-row items-stretch justify-between gap-5 transition-all duration-300 ring-1 ring-inset ring-slate-700/10 w-full">

            <div
                className="absolute -top-16 -right-16 w-[clamp(200px,20vw,350px)] h-[clamp(200px,20vw,350px)] rounded-full bg-slate-500 filter blur-3xl opacity-10 pointer-events-none"/>

            <div
                className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-slate-500/10 to-transparent pointer-events-none"/>

            <div className="flex flex-col justify-between min-w-0 flex-1 relative z-10 gap-3.5 items-start">

                <span
                    className="text-[clamp(10px,0.58vw,11px)] font-display font-extrabold text-slate-500 tracking-widest uppercase select-text leading-none">
                    {tagLabel}
                </span>

                <div className="flex items-center gap-3 w-full">
                    {avatarNode && <div className="shrink-0 relative z-10">{avatarNode}</div>}

                    <h3 className="text-[clamp(13.5px,0.9vw,16px)] font-display font-black text-white line-clamp-2 tracking-wide flex-1 uppercase select-text leading-snug">
                        {title}
                    </h3>
                </div>
            </div>

            <div
                className="flex flex-col items-start sm:items-end justify-between gap-4 shrink-0 w-full sm:w-auto border-t sm:border-t-0 border-slate-800/60 pt-4 sm:pt-0 relative z-10">

                <span
                    className="text-[clamp(10px,0.58vw,11px)] font-display font-extrabold text-slate-500 tracking-widest uppercase sm:text-right select-text">
                    {timestampLabel}
                </span>

                <ActionButton
                    variant={variant}
                    onClick={onActionClick}
                    className="w-full sm:w-40 h-9 font-sans font-black tracking-wider uppercase rounded-md shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
                >
                    {actionLabel}
                </ActionButton>
            </div>
        </div>
    );
}