import { Plus, UserPlus } from "lucide-react";

interface EmptyStateCardProps {
    onAddClick?: () => void;
}

function EmptyStateCard({ onAddClick }: EmptyStateCardProps) {
    return (
        <div className="flex flex-col items-center justify-center w-full p-12 mt-8 border border-slate-800 rounded-3xl bg-[#0a0d17]/50 backdrop-blur-sm">
            
            {/* Contenedor del icono con efecto glow sutil */}
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full" />
                <div className="relative flex items-center justify-center w-20 h-20 bg-[#0f1425] border border-slate-700 rounded-2xl text-blue-400">
                    <UserPlus size={40} strokeWidth={1.5} />
                </div>
            </div>

            {/* Textos */}
            <div className="max-w-md text-center">
                <h3 className="text-2xl font-semibold text-white tracking-tight">
                    Todavía no tienes personas protegidas
                </h3>
                <p className="mt-3 text-slate-400 leading-relaxed">
                    Añadí un protegido para comenzar a monitorear su bienestar y seguridad digital.
                </p>
            </div>

            {/* Botón con hover effect premium */}
            <button
                onClick={onAddClick}
                className="
                    mt-8
                    group
                    flex items-center gap-2
                    px-6 py-3
                    bg-blue-600 hover:bg-blue-500
                    text-white font-medium
                    rounded-xl
                    transition-all duration-300
                    shadow-lg shadow-blue-900/20
                    hover:shadow-blue-600/30
                    active:scale-[0.98]
                "
            >
                <Plus size={20} />
                <span>Añadir protegido</span>
            </button>
        </div>
    );
}

export default EmptyStateCard;