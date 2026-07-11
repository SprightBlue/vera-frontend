import { UserPlus } from 'lucide-react';
import { ActionButton } from "@/features/shared/components/ActionButton";
import IsotipoVera from '@/assets/Isotipo_Vera.png';

interface DashboardHeroProps {
    onAddProtectedClick: () => void;
}

export function DashboardHero({ onAddProtectedClick }: DashboardHeroProps) {
    return (
        <div className="w-full flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-160px)] text-center relative overflow-hidden animate-fade-in px-6 py-4 select-none">

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(450px,55vw,800px)] h-[clamp(450px,55vw,800px)] bg-blue-600/5 rounded-full filter blur-[140px] pointer-events-none animate-pulse" />

            <div className="max-w-2xl w-full flex flex-col items-center relative z-10">

                <div className="relative mb-3 group flex items-center justify-center">
                    <div className="absolute w-[clamp(20rem,28vw,34rem)] h-[clamp(20rem,28vw,34rem)] bg-linear-to-tr from-blue-500/20 via-cyan-400/15 to-transparent rounded-full filter blur-[80px] pointer-events-none" />

                    <div className="absolute w-[clamp(14rem,20vw,24rem)] h-[clamp(14rem,20vw,24rem)] bg-cyan-400/10 rounded-full filter blur-[50px] animate-pulse pointer-events-none" />

                    <div className="absolute w-[clamp(10rem,15vw,18rem)] h-[clamp(10rem,15vw,18rem)] bg-white/2 rounded-full filter blur-xl pointer-events-none" />

                    <img
                        src={IsotipoVera}
                        alt="Vera Icono"
                        className="h-[clamp(10rem,15vw,16rem)] w-auto object-contain relative z-10 filter drop-shadow-[0_20px_45px_rgba(59,130,246,0.3)] pointer-events-none"
                    />
                </div>

                <h2 className="text-[clamp(1.7rem,3vw,2.6rem)] font-display font-black text-white tracking-wide uppercase leading-tight mb-4 select-text">
                    Te damos la bienvenida a Vera
                </h2>

                <p className="text-[clamp(0.95rem,1.15vw,1.2rem)] font-sans text-slate-400 font-medium leading-relaxed max-w-md mx-auto mb-9 select-text">
                    Tu espacio de supervisión inteligente está listo. Para comenzar a usar el panel, vinculá tu primer contacto de confianza.
                </p>

                <ActionButton
                    variant="info"
                    icon={UserPlus}
                    onClick={onAddProtectedClick}
                    className="w-full sm:w-auto h-[clamp(2.75rem,3.2vw,3.5rem)] px-[clamp(1.8rem,2.5vw,3rem)] shadow-xl shadow-blue-600/20 hover:shadow-blue-500/30 relative z-10"
                >
                    Agregar primer contacto
                </ActionButton>

            </div>
        </div>
    );
}