// src/features/dashboard/components/DashboardHero.tsx
import { ShieldCheck, UserPlus } from 'lucide-react';

interface DashboardHeroProps {
    onAddProtectedClick: () => void;
}

export function DashboardHero({ onAddProtectedClick }: DashboardHeroProps) {
    return (
        <div className="w-full flex-1 flex items-center justify-center py-10 animate-fade-in">
            <div className="w-full max-w-2xl bg-linear-to-b from-[#0a0f24] to-[#060a17] border border-[#182033]/80 rounded-2xl p-[clamp(2rem,4vw,3.5rem)] text-center relative overflow-hidden ring-1 ring-inset ring-white/[0.02] shadow-2xl">
                {/* Glow Central Inmersivo */}
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-blue-500/10 rounded-full filter blur-[90px] pointer-events-none animate-pulse" />

                <div className="flex justify-center mb-5 relative z-10">
                    <div className="w-14 h-14 bg-blue-500/5 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 shadow-inner">
                        <ShieldCheck size={26} className="stroke-[1.5]" />
                    </div>
                </div>

                <h2 className="text-[clamp(1.5rem,2.5vw,2rem)] font-black text-white tracking-wide uppercase mb-3 relative z-10">
                    Todavía no tienes protegidos
                </h2>
                <p className="text-[clamp(0.85rem,1vw,1rem)] text-slate-400 font-medium leading-relaxed max-w-md mx-auto mb-8 relative z-10">
                    Comienza vinculando cuentas protegidas para analizar mensajes en tiempo real, detectar amenazas externas y recibir alertas críticas.
                </p>

                <button
                    onClick={onAddProtectedClick}
                    className="inline-flex items-center gap-2 px-6 h-12 bg-blue-600 border border-blue-500 hover:bg-blue-500 text-xs font-black text-white tracking-widest uppercase rounded-lg shadow-lg shadow-blue-600/20 transition-all duration-150 active:scale-[0.97] cursor-pointer relative z-10"
                >
                    <UserPlus size={14} className="stroke-[2.5]" />
                    <span>Añadir protegido</span>
                </button>
            </div>
        </div>
    );
}