import { UI_VARIANTS_MAP, type UIVariant } from '@/features/shared/utils/styleConfig';
import { ActionButton } from "@/features/shared/components/ActionButton";

interface BadgeConfig {
    label: string;
    variant: UIVariant;
}

interface ItemCardProps {
    title: string;
    subtitle?: string;
    description: string;
    timestamp: string;
    primaryVariant: UIVariant;
    badges: BadgeConfig[];
    onActionClick: () => void;
    actionLabel?: string;
    actionVariant?: UIVariant;
}

export function ItemCard({
                             title,
                             subtitle,
                             description,
                             timestamp,
                             primaryVariant,
                             actionVariant = "info",
                             badges,
                             onActionClick,
                             actionLabel = "Ver Detalles"
                         }: ItemCardProps) {
    const config = UI_VARIANTS_MAP[primaryVariant];

    return (
        <div className="group rounded-xl border border-[#161f37] bg-linear-to-b from-[#080d20] to-[#040714] p-[clamp(1.2rem,1.8vw,2rem)] shadow-2xl relative overflow-hidden flex flex-col sm:flex-row items-stretch justify-between gap-5 transition-all duration-200 ring-1 ring-inset ring-[#161f35]/20 w-full">

            <div className={`absolute -top-16 -right-16 w-[clamp(180px,18vw,300px)] h-[clamp(180px,18vw,300px)] rounded-full filter blur-3xl opacity-10 pointer-events-none ${config.glowColor}`} />

            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-slate-500/10 to-transparent pointer-events-none" />

            <div className="flex flex-col justify-between min-w-0 flex-1 relative z-10 gap-3">
                <div className="flex flex-col gap-1 w-full">
                    {subtitle && (
                        <span className="text-[clamp(11px,0.65vw,13px)] font-sans font-bold text-slate-400 leading-relaxed tracking-wider select-text uppercase">
                            {subtitle}
                        </span>
                    )}
                    <h3 className="text-[clamp(14px,1vw,17px)] font-display font-extrabold text-white line-clamp-2 select-text tracking-wide w-full uppercase">
                        {title}
                    </h3>
                </div>
                <p className="text-[clamp(13px,0.8vw,14px)] text-slate-400 leading-relaxed line-clamp-2 pr-2 select-text font-sans font-medium w-full">
                    {description}
                </p>
            </div>

            <div className="flex flex-col items-start sm:items-end justify-between gap-4 shrink-0 w-full sm:w-auto border-t sm:border-t-0 border-[#161f37] pt-4 sm:pt-0 relative z-10">

                <span className="text-[clamp(11px,0.65vw,13px)] font-display font-bold text-slate-500 leading-none tracking-wider sm:text-right select-text uppercase">
                    {timestamp}
                </span>

                <div className="flex items-center gap-1.5 flex-wrap">
                    {badges.map((b, idx) => {
                        const badgeStyle = UI_VARIANTS_MAP[b.variant];
                        return (
                            <span
                                key={idx}
                                className={`px-2.5 h-5 flex items-center rounded-md text-[clamp(10px,0.55vw,11px)] font-sans font-bold tracking-wider uppercase border shrink-0 bg-opacity-20 ${badgeStyle.bgColor} ${badgeStyle.borderColor} ${badgeStyle.textColor}`}
                            >
                                {b.label}
                            </span>
                        );
                    })}
                </div>

                <ActionButton
                    variant={actionVariant}
                    onClick={onActionClick}
                >
                    {actionLabel}
                </ActionButton>
            </div>
        </div>
    );
}