import {UserPlus} from "lucide-react";
import {ActionButton} from "@/features/shared/components/ActionButton";
import IsotipoVera from "@/assets/Isotipo_Vera.png";

interface DashboardHeroProps {
    onAddProtectedClick: () => void;
}

export function DashboardHero({onAddProtectedClick}: DashboardHeroProps) {
    return (
        <div
            className="w-full flex flex-col items-center justify-center text-center relative overflow-hidden animate-fade-in px-6 py-12 select-none bg-transparent">

            <div
                className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-size-[3.5rem_3.5rem] mask-[radial-gradient(circle_at_center,white_45%,transparent_85%)] opacity-40 pointer-events-none"/>

            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(180px,25vw,300px)] h-[clamp(180px,25vw,300px)] bg-blue-600/5 rounded-full filter blur-[60px] pointer-events-none"/>

            <div className="max-w-xl w-full flex flex-col items-center relative z-10">

                <div className="relative mb-[clamp(1.2rem,1.8vw,2.2rem)] flex items-center justify-center">
                    <div
                        className="absolute w-[clamp(10rem,14vw,16rem)] h-[clamp(10rem,14vw,16rem)] bg-blue-500/5 rounded-full filter blur-2xl pointer-events-none"/>

                    <img
                        src={IsotipoVera}
                        alt="Vera Icono"
                        className="h-[clamp(7rem,10vw,11rem)] w-auto object-contain relative z-10 filter drop-shadow-[0_12px_25px_rgba(59,130,246,0.12)] pointer-events-none"
                    />
                </div>

                <h2 className="text-[clamp(1.5rem,2.4vw,2.1rem)] font-display font-black text-white tracking-wide uppercase leading-tight mb-3 select-text">
                    Te damos la bienvenida a Vera
                </h2>

                <p className="text-[clamp(0.85rem,1vw,1.05rem)] font-sans text-slate-400 font-medium leading-relaxed max-w-md mx-auto mb-8 select-text">
                    Tu espacio de seguridad ya está listo. Para empezar a proteger a tus seres queridos o verificar tus
                    mensajes, agregá a tu primer contacto de confianza.
                </p>

                <div className="relative p-1">
                    <div
                        className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-blue-500/30 pointer-events-none"/>
                    <div
                        className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-blue-500/30 pointer-events-none"/>
                    <div
                        className="absolute -bottom-1 -left-1 w-2 h-2 border-b border-l border-blue-500/30 pointer-events-none"/>
                    <div
                        className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-blue-500/30 pointer-events-none"/>

                    <ActionButton
                        variant="info"
                        icon={UserPlus}
                        onClick={onAddProtectedClick}
                        className="w-full sm:w-auto h-[clamp(2.4rem,2.8vw,3rem)]! px-[clamp(1.6rem,2.2vw,2.6rem)] shadow-xl shadow-blue-950/40 relative z-10 font-sans font-black tracking-wider uppercase"
                    >
                        Agregar primer contacto
                    </ActionButton>
                </div>

            </div>
        </div>
    );
}