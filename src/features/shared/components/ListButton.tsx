import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
    to: string;
    label?: string;
}

export function ListButton({ to, label = "Volver al Historial" }: BackButtonProps) {
    const navigate = useNavigate();

    return (
        <div className="flex items-center">
            <button
                onClick={() => navigate(to)}
                className="relative overflow-hidden flex items-center gap-2.5 px-4 py-2 bg-linear-to-b from-[#0a0f24] to-[#060a17]
                hover:from-[#101735] hover:to-[#0a0f24] border border-[#182033]/80 rounded-lg text-[10px] font-sans font-bold
                text-[#94a3b8] hover:text-white tracking-wider uppercase shadow-lg shadow-black/20 ring-1
                ring-inset ring-[#161f35]/40 transition-all duration-150 active:scale-[0.96] cursor-pointer group select-none"
            >
                <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-slate-500/10 to-transparent pointer-events-none" />

                <ArrowLeft size={12} className="transform group-hover:-translate-x-0.5 transition-transform text-slate-400 group-hover:text-white" />

                <span className="relative z-10">{label}</span>
            </button>
        </div>
    );
}