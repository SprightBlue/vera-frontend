import { type ComponentType } from "react";
import { UI_VARIANTS_MAP, type UIVariant } from "@/features/shared/utils/styleConfig";
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

    const config = UI_VARIANTS_MAP[buttonVariant];
    const variantBorderHover = config.borderColor || "hover:border-slate-700";
    const variantDotColor = config.bgColor || "bg-slate-500";

    return (
        <div
            className={`group rounded-xl border border-white/5 bg-linear-to-b from-[#080d20] to-[#040714] 
            p-[clamp(1.2rem,2.2vw,2.2rem)] shadow-2xl relative overflow-hidden flex flex-col md:flex-row 
            items-start md:items-center justify-between gap-5 ring-1 ring-inset ring-white/5 ${variantBorderHover} w-full`}
        >
            {/* Brillo decorativo fluido */}
            <div
                className={`absolute -top-20 -right-20 w-[clamp(240px,25vw,360px)] h-[clamp(240px,25vw,360px)] rounded-full ${config.glowColor} filter blur-3xl opacity-20 pointer-events-none`}
            />

            <div
                className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-[#0D6EFD]/10 to-transparent pointer-events-none z-10"
            />

            <div className="flex-1 flex flex-col justify-center gap-2 relative z-10 w-full min-w-0">
                <div className="flex items-center gap-2 select-none">
                    <span className={`w-2 h-2 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.2)] ${variantDotColor}`}/>
                    <span
                        className="text-[clamp(10px,0.6vw,12px)] font-semibold text-gray-500 normal-case tracking-wide"
                        style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                    >
                        Acción • Disponible
                    </span>
                </div>

                {/* Encabezado fluido usando la clase heading-md nativa */}
                <h3 className="heading-md select-text normal-case text-white w-full break-words">
                    {title}
                </h3>

                {/* Texto descriptivo usando la clase body-text nativa */}
                <p className="body-text max-w-3xl select-text w-full break-words">
                    {description}
                </p>
            </div>

            {/* Contenedor del Botón Fluido */}
            <div
                className="mt-2 md:mt-0 flex items-center justify-center shrink-0 w-full md:w-auto min-w-[clamp(180px,15vw,240px)] relative z-10">
                {/* ID condicional que sólo se aplica si el botón contiene "Agregar" (así evitamos el ID en otros banners) */}
                <div
                    id={buttonLabel.toLowerCase().includes("agregar") ? "add-protected-btn" : undefined}
                    className="w-full"
                >
                    <ActionButton
                        variant={buttonVariant}
                        icon={Icon}
                        onClick={onClickAction}
                        className="w-full! shadow-[0_4px_20px_rgba(0,0,0,0.4)] text-[clamp(12px,0.7vw,13px)] h-10.5"
                    >
                        {buttonLabel}
                    </ActionButton>
                </div>
            </div>

        </div>
    );
}