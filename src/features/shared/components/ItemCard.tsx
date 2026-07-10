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
}

export function ItemCard({
                             title,
                             subtitle,
                             description,
                             timestamp,
                             primaryVariant,
                             badges,
                             onActionClick,
                             actionLabel = "Ver Detalles"
                         }: ItemCardProps) {
    const config = UI_VARIANTS_MAP[primaryVariant];

    return (
        <div
            className={`group rounded-r-xl rounded-l-none border-2 border-transparent border-l-4 ${config.borderLeft} 
            bg-linear-to-b from-[#0a0f24] to-[#060a17] p-[clamp(1.1rem,1.5vw,1.8rem)] shadow-2xl relative overflow-hidden 
            flex flex-col sm:flex-row items-stretch justify-between gap-5 transition-all duration-300 ring-1 ring-inset ring-[#161f35]/40 hover:ring-[#222f50]/60 ${config.hoverBorders}`}
        >
            <div className={`absolute -top-12 -right-12 w-[clamp(200px,20vw,350px)] h-[clamp(200px,20vw,350px)] rounded-full filter blur-[75px] opacity-10 pointer-events-none transform origin-top-right transition-all duration-500 ease-out group-hover:opacity-20 group-hover:scale-125 ${config.glowColor}`} />

            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-slate-500/10 to-transparent pointer-events-none" />

            <div className="flex flex-col justify-between min-w-0 flex-1 relative z-10 gap-2.5">
                <div className="flex flex-col gap-1">
                    {subtitle && (
                        <span className="text-[clamp(0.75rem,0.8vw,0.86rem)] font-bold text-slate-400 leading-relaxed tracking-wide select-text uppercase">
                            {subtitle}
                        </span>
                    )}
                    <h3 className="text-[clamp(1rem,1.15vw,1.3rem)] font-black tracking-wide text-white truncate max-w-70 sm:max-w-xs md:max-w-md select-text uppercase group-hover:text-slate-100 transition-colors">
                        {title}
                    </h3>
                </div>
                <p className="text-[clamp(0.78rem,0.82vw,0.88rem)] text-slate-400 leading-relaxed line-clamp-2 pr-2 select-text font-medium max-w-prose">
                    {description}
                </p>
            </div>

            <div className="flex flex-col items-start sm:items-end justify-between gap-4 shrink-0 w-full sm:w-auto border-t sm:border-t-0 border-[#182033]/40 pt-3 sm:pt-0 relative z-10">
                <span className="text-[clamp(0.72rem,0.76vw,0.82rem)] font-bold text-slate-500 leading-relaxed tracking-wider sm:text-right select-text mt-1 sm:mt-0 uppercase">
                    {timestamp}
                </span>

                <div className="flex items-center gap-1.5">
                    {badges.map((b, idx) => {
                        const badgeStyle = UI_VARIANTS_MAP[b.variant];
                        return (
                            <span
                                key={idx}
                                className={`px-2.5 py-0.5 rounded-sm text-[clamp(9px,0.55vw,11px)] font-black tracking-widest uppercase border shrink-0 bg-opacity-40 transition-all duration-200 hover:bg-opacity-60 ${badgeStyle.bgColor} ${badgeStyle.borderColor} ${badgeStyle.textColor}`}
                            >
                                {b.label}
                            </span>
                        );
                    })}
                </div>

                <ActionButton
                    variant={primaryVariant}
                    onClick={onActionClick}
                    className="w-full sm:w-40 h-9 font-black tracking-widest uppercase"
                >
                    {actionLabel}
                </ActionButton>
            </div>
        </div>
    );
}