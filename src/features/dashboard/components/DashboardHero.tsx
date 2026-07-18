import { UserPlus } from "lucide-react";
import { ActionButton } from "@/features/shared/components/ActionButton";
import IsotipoVera from "@/assets/Isotipo_Vera.png";

interface DashboardHeroProps {
    onAddProtectedClick: () => void;
}

export function DashboardHero({ onAddProtectedClick }: DashboardHeroProps) {
    return (
        <div
            className="w-full flex flex-col items-center justify-center text-center relative overflow-hidden animate-fade-in
            px-[clamp(1rem,2.5vw,2rem)] py-[clamp(2.5rem,5vw,4.5rem)] select-none bg-transparent"
        >
            {/* Brillo de marca elástico de fondo */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(200px,22vw,320px)] h-[clamp(200px,22vw,320px)] bg-blue-600/5 rounded-full filter blur-[60px] pointer-events-none"
            />

            <div className="max-w-xl w-full flex flex-col items-center relative z-10">

                {/* Contenedor del Isotipo con blur dinámico */}
                <div className="relative mb-[clamp(1.2rem,2.2vw,2rem)] flex items-center justify-center">
                    <div
                        className="absolute w-[clamp(150px,16vw,220px)] h-[clamp(150px,16vw,220px)] bg-blue-500/5 rounded-full filter blur-2xl pointer-events-none"
                    />

                    <img
                        src={IsotipoVera}
                        alt="Vera Icono"
                        className="h-[clamp(5.5rem,8vw,7.5rem)] w-auto object-contain relative z-10 filter drop-shadow-[0_12px_25px_rgba(13,110,253,0.15)] pointer-events-none"
                    />
                </div>

                {/* Encabezado fluido con clases globales */}
                <h2 className="heading-lg text-white mb-3 select-text normal-case">
                    Te damos la bienvenida a Vera
                </h2>

                {/* Texto descriptivo adaptativo */}
                <p className="body-text max-w-md mx-auto mb-[clamp(1.8rem,3vw,2.2rem)] select-text">
                    Tu espacio de seguridad ya está listo. Para empezar a proteger a tus seres queridos o verificar tus
                    mensajes, agregá a tu primer contacto de confianza.
                </p>

                {/* Contenedor del Botón con Brackets Decorativos y el ID para el tour */}
                <div id="add-protected-btn" className="relative p-1">
                    <div
                        className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-blue-500/20 pointer-events-none"
                    />
                    <div
                        className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-blue-500/20 pointer-events-none"
                    />
                    <div
                        className="absolute -bottom-1 -left-1 w-2 h-2 border-b border-l border-blue-500/20 pointer-events-none"
                    />
                    <div
                        className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-blue-500/20 pointer-events-none"
                    />

                    <ActionButton
                        variant="info"
                        icon={UserPlus}
                        onClick={onAddProtectedClick}
                        className="w-full sm:w-auto shadow-xl shadow-blue-950/40 relative z-10 text-[clamp(12px,0.7vw,13px)] h-10.5"
                    >
                        Agregar primer contacto
                    </ActionButton>
                </div>

            </div>
        </div>
    );
}