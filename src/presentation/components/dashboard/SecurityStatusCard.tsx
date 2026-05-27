import React from 'react';
import { ShieldCheck, ShieldAlert, ShieldAlert as ShieldWarning, Clock, ChevronRight } from 'lucide-react';

type StatusType = 'stable' | 'warning' | 'danger';

interface SecurityStatusCardProps {
    name: string;
    status: StatusType;
    message: string;
    lastCheck: string;
}

const statusConfig = {
    stable: {
        icon: ShieldCheck,
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20',
        label: 'Estable'
    },
    warning: {
        icon: ShieldWarning,
        color: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20',
        label: 'Atención'
    },
    danger: {
        icon: ShieldAlert,
        color: 'text-rose-400',
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/20',
        label: 'Peligro'
    }
};

const SecurityStatusCard: React.FC<SecurityStatusCardProps> = ({ name, status, message, lastCheck }) => {
    const config = statusConfig[status];
    const Icon = config.icon;

    return (
        <div className="relative group overflow-hidden bg-[#0a0d17] border border-slate-800 rounded-3xl p-6 transition-all hover:border-slate-700 hover:shadow-2xl hover:shadow-black/20">
            {/* Glow decorativo de fondo */}
            <div className={`absolute -top-10 -right-10 w-40 h-40 ${config.bg} rounded-full blur-3xl opacity-50`} />

            <div className="relative flex flex-col h-full justify-between">
                {/* Header de la Card */}
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mb-1">Protegido</p>
                        <h3 className="text-xl font-semibold text-white">Estado de {name}</h3>
                    </div>
                    <div className={`p-2 rounded-xl ${config.bg} ${config.border} ${config.color}`}>
                        <Icon size={24} />
                    </div>
                </div>

                {/* Contenido principal */}
                <div className="mt-6 mb-8">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.color}`}>
                        <span className={`w-2 h-2 rounded-full ${config.color.replace('text', 'bg')}`} />
                        Nivel: {config.label}
                    </div>
                    <p className="mt-4 text-slate-300 text-sm leading-relaxed">
                        {message}
                    </p>
                </div>

                {/* Footer de la Card */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                    <div className="flex items-center gap-2 text-slate-500 text-xs">
                        <Clock size={14} />
                        <span>Revisado {lastCheck}</span>
                    </div>
                    <button className="flex items-center gap-1 text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors">
                        Ver detalles <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SecurityStatusCard;