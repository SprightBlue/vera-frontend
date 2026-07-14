import {SidebarClose, SidebarOpen} from "lucide-react";

interface SidebarToggleButtonProps {
    isOpen: boolean;
    onClick: () => void;
    title?: string;
    className?: string;
}

export function SidebarToggleButton({isOpen, onClick, title, className = ""}: SidebarToggleButtonProps) {
    const Icon = isOpen ? SidebarClose : SidebarOpen;

    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex items-center justify-center w-9 h-9 rounded-xl border border-[#161f37] bg-[#0a0f24]/80 hover:border-[#223156] text-slate-400 hover:text-slate-200 backdrop-blur-md transition-all duration-300 select-none cursor-pointer z-40 shadow-2xl active:scale-[0.95] group/toggle overflow-hidden relative shrink-0 ${className}`}
            title={title || (isOpen ? "Ocultar historial" : "Mostrar historial")}
        >
            <div
                className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-blue-500/30 to-transparent pointer-events-none transition-all duration-500 z-20 group-hover/toggle:via-blue-400/50"/>

            <div
                className="absolute -top-4 -right-4 w-8 h-8 rounded-full filter blur-md pointer-events-none transform origin-top-right transition-all duration-500 ease-out z-0 bg-blue-500 opacity-0 group-hover/toggle:opacity-15 group-hover/toggle:scale-125"/>

            <Icon className="w-3.5 h-3.5 relative z-10 transition-transform duration-300 group-hover/toggle:scale-105"
                  strokeWidth={2.5}/>
        </button>
    );
}