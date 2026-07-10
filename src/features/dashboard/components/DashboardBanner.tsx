// src/features/dashboard/components/DashboardBanner.tsx
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

    // Colores de neón puros para la línea divisoria e iluminación reflectiva
    const neonColors: Record<string, { line: string; glow: string }> = {
        info: { line: "from-blue-500/50 via-blue-500/20 to-transparent", glow: "bg-blue-500/10" },
        purple: { line: "from-purple-500/50 via-purple-500/20 to-transparent", glow: "bg-purple-500/10" }
    };
    const activeNeon = neonColors[buttonVariant] || neonColors.info;

    return (
        <div className="w-full bg-[#070b19] rounded-xl border border-[#161f37] flex flex-col md:flex-row items-stretch justify-between relative overflow-hidden shadow-2xl animate-fade-in group">

            {/* TOQUE DISTINTIVO 1: Arco de luz de neón continuo que corta el fondo */}
            <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-linear-to-r ${activeNeon.line} pointer-events-none`} />
            <div className={`absolute -bottom-10 left-10 w-72 h-20 rounded-full filter blur-[40px] pointer-events-none ${activeNeon.glow}`} />

            {/* Bloque Izquierdo: Contenido super limpio */}
            <div className="flex-1 p-[clamp(1rem,1.5vw,1.5rem)] flex flex-col justify-center gap-1 relative z-10">
                <h3 className="text-[clamp(1.05rem,1.2vw,1.3rem)] font-black tracking-wide text-white uppercase">
                    {title}
                </h3>
                <p className="text-[clamp(0.8rem,0.85vw,0.9rem)] text-slate-400 font-medium normal-case tracking-normal">
                    {description}
                </p>
            </div>

            {/* TOQUE DISTINTIVO 2: Cápsula de control asimétrica para el botón (Efecto Módulo Acoplado) */}
            <div className="bg-[#0b122c] border-t md:border-t-0 md:border-l border-[#1c2848] px-6 py-4 md:py-0 flex items-center justify-center shrink-0 min-w-[220px] relative before:absolute before:inset-0 before:bg-linear-to-b before:from-white/[0.01] before:to-transparent pointer-events-auto">
                {/* Glow sutil exclusivo para la zona del botón */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 filter blur-[20px] ${activeNeon.glow} pointer-events-none`} />

                <div className="w-full relative z-10">
                    <ActionButton
                        variant={buttonVariant}
                        icon={Icon}
                        onClick={onClickAction}
                        className="!w-full !h-10 text-[10px] tracking-widest font-black shadow-lg"
                    >
                        {buttonLabel}
                    </ActionButton>
                </div>
            </div>

        </div>
    );
}