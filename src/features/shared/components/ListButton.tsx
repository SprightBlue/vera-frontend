import {useNavigate} from "react-router-dom";
import {List} from "lucide-react";
import {UI_VARIANTS_MAP} from "@/features/shared/utils/styleConfig";

interface BackButtonProps {
    to: string;
    label?: string;
}

export function ListButton({to, label = "Ir al Historial"}: BackButtonProps) {
    const navigate = useNavigate();
    const styleConfig = UI_VARIANTS_MAP.neutral;

    return (
        <div className="flex items-center">
            <button
                onClick={() => navigate(to)}
                className="relative overflow-hidden flex items-center gap-2.5 px-4 py-2 rounded-lg
                text-[clamp(10px,0.55vw,11px)] font-sans font-bold tracking-wider uppercase shadow-md
                bg-[#0a0f1d] border border-[#161f37] hover:border-[#223156] text-slate-400 hover:text-slate-200
                transition-all duration-300 active:scale-[0.97] cursor-pointer group select-none"
            >
                <div className={`absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent to-transparent pointer-events-none transition-all duration-300 z-10 
                    via-transparent group-hover:${styleConfig.laserColor}/20`}
                />

                <div className={`absolute -top-5 -right-5 w-12 h-12 rounded-full filter blur-md pointer-events-none transform origin-top-right transition-all duration-500 ease-out z-0 
                    opacity-0 scale-75 ${styleConfig.glowColor} group-hover:opacity-10 group-hover:scale-125`}
                />

                <List
                    size={12}
                    className="text-current relative z-10 transition-colors duration-300 shrink-0"
                />

                <span className="relative z-10 transition-colors duration-300">{label}</span>
            </button>
        </div>
    );
}