import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { UI_TOGGLE_INACTIVE, UI_VARIANTS_MAP } from "@/features/shared/utils/styleConfig";

interface BackButtonProps {
    to: string;
    label?: string;
}

export function ListButton({ to, label = "Volver al Historial" }: BackButtonProps) {
    const navigate = useNavigate();

    const styleConfig = UI_VARIANTS_MAP.neutral;

    return (
        <div className="flex items-center">
            <button
                onClick={() => navigate(to)}
                className={`relative overflow-hidden flex items-center gap-2.5 px-4 py-2 rounded-lg text-[10px] 
                font-sans font-bold tracking-wider uppercase shadow-md transition-all duration-300 
                active:scale-[0.96] cursor-pointer group select-none ${UI_TOGGLE_INACTIVE}`}
            >
                <div className={`absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent to-transparent pointer-events-none transition-all duration-300 z-10 
                    via-transparent group-hover:${styleConfig.laserColor}/20`}
                />

                <div className={`absolute -top-5 -right-5 w-12 h-12 rounded-full filter blur-md pointer-events-none transform origin-top-right transition-all duration-500 ease-out z-0 
                    opacity-0 scale-75 ${styleConfig.glowColor} group-hover:opacity-15 group-hover:scale-125`}
                />

                <ArrowLeft
                    size={12}
                    className="text-slate-400 group-hover:text-white relative z-10"
                />

                <span className="relative z-10">{label}</span>
            </button>
        </div>
    );
}