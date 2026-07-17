import { UI_VARIANTS_MAP, UI_TOGGLE_STYLES, type UIVariant } from '@/features/shared/utils/styleConfig';
import { ActionButton } from "@/features/shared/components/ActionButton";
import { ArrowRight } from "lucide-react";

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
        <div
            className="group rounded-xl border border-white/5 bg-linear-to-b from-[#080d20] to-[#040714]
            p-[clamp(1.1rem,1.8vw,1.8rem)] shadow-2xl relative overflow-hidden flex flex-col sm:flex-row items-stretch
            justify-between gap-[clamp(1rem,1.5vw,1.5rem)] transition-all duration-200 ring-1 ring-inset ring-white/5 w-full"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
            {/* Brillo sutil de fondo según variante con tamaño fluido */}
            <div
                className={`absolute -top-16 -right-16 w-[clamp(180px,18vw,280px)] h-[clamp(180px,18vw,280px)] rounded-full filter blur-3xl opacity-10 pointer-events-none ${config.glowColor}`}
            />

            {/* Contenido Izquierdo */}
            <div className="flex flex-col justify-between min-w-0 flex-1 relative z-10 gap-2.5">
                <div className="flex flex-col gap-0.5 w-full">
                    {subtitle && (
                        <span className="text-[clamp(11px,0.65vw,12.5px)] font-semibold text-gray-400 normal-case tracking-wide select-text">
                            {subtitle}
                        </span>
                    )}
                    <h3
                        className="text-[clamp(14px,0.9vw,16px)] font-bold text-white line-clamp-2 select-text tracking-wide w-full normal-case"
                        style={{ fontFamily: "'Montserrat', system-ui, sans-serif" }}
                    >
                        {title}
                    </h3>
                </div>
                <p className="body-text line-clamp-2 pr-2 select-text w-full">
                    {description}
                </p>
            </div>

            {/* Contenido Derecho / Acciones */}
            <div
                className="flex flex-col items-start sm:items-end justify-between gap-3.5 shrink-0 w-full sm:w-auto
                border-t sm:border-t-0 border-white/5 pt-3.5 sm:pt-0 relative z-10"
            >
                <span className="text-[clamp(11px,0.65vw,12.5px)] font-medium text-gray-400 normal-case sm:text-right select-text">
                    {timestamp}
                </span>

                {/* Contenedor de Badges */}
                <div className="flex items-center gap-1.5 flex-wrap">
                    {badges.map((b, idx) => {
                        const styleConfig = UI_VARIANTS_MAP[b.variant];
                        const activeToggleStyle = UI_TOGGLE_STYLES[b.variant] || "";
                        return (
                            <span
                                key={idx}
                                className={`px-2.5 h-5.5 flex items-center rounded-lg border text-[clamp(10px,0.55vw,11px)] font-semibold 
                                tracking-wide normal-case shrink-0 shadow-sm relative overflow-hidden text-white 
                                ring-1 ring-inset ring-white/5 select-none ${activeToggleStyle}`}
                            >
                                <div
                                    className={`absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-transparent to-transparent z-10 ${styleConfig.laserColor ? `via-${styleConfig.laserColor}/30` : 'via-white/25'}`}
                                />
                                <div
                                    className={`absolute -top-3 -right-3 w-8 h-8 rounded-full filter blur-sm opacity-20 pointer-events-none transform origin-top-right z-0 ${styleConfig.glowColor}`}
                                />
                                <span className="relative z-10">{b.label}</span>
                            </span>
                        );
                    })}
                </div>

                <ActionButton
                    variant={actionVariant}
                    icon={ArrowRight}
                    onClick={onActionClick}
                    className="sm:w-[clamp(120px,10vw,150px)] h-[clamp(2.1rem,2.4vw,2.4rem)] text-xs"
                >
                    {actionLabel}
                </ActionButton>
            </div>
        </div>
    );
}