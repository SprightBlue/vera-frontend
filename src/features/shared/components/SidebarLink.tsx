import { Link, useLocation } from "react-router-dom";
import { type LucideIcon } from "lucide-react";

export interface NavItem {
    label: string;
    path: string;
    icon: LucideIcon;
    id?: string;
    isDanger?: boolean;
}

interface SidebarLinkProps {
    item: NavItem;
}

export function SidebarLink({ item }: SidebarLinkProps) {
    const location = useLocation();
    const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
    const isDanger = item.isDanger || item.path === "/logout";

    return (
        <Link
            to={item.path}
            id={item.id}
            className={`
                flex items-center gap-3 px-3 h-10 rounded-xl transition-all duration-200 group relative
                justify-center lg:justify-start select-none active:scale-[0.98] overflow-hidden z-10
                ${isActive
                ? isDanger
                    ? "bg-red-500/10 text-red-400 border border-red-500/20 shadow-[0_0_12px_rgba(239,68,68,0.05)] font-semibold"
                    : "bg-[#0D6EFD]/10 text-[#0D6EFD] border border-[#0D6EFD]/20 shadow-[0_0_12px_rgba(13,110,253,0.05)] font-semibold"
                : isDanger
                    ? "text-gray-400 border border-transparent hover:text-red-400 hover:bg-red-500/5 hover:border-red-500/10 font-medium"
                    : "text-gray-400 border border-transparent hover:text-white hover:bg-white/5 font-medium"
            }
            `}
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
            {/* Línea sutil superior brillante */}
            <div
                className={`absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent to-transparent pointer-events-none transition-all duration-500 z-20 ${
                    isActive
                        ? isDanger ? "via-red-500/30" : "via-blue-400/40"
                        : isDanger ? "group-hover:via-red-500/20" : "group-hover:via-white/10"
                }`}
            />

            {/* Efecto Glow circular en la esquina */}
            <div
                className={`absolute -top-6 -right-6 w-16 h-16 rounded-full filter blur-md pointer-events-none transform origin-top-right transition-all duration-500 ease-out z-0 ${
                    isActive
                        ? isDanger ? "opacity-10 scale-125 bg-red-500" : "opacity-10 scale-125 bg-blue-500"
                        : isDanger
                            ? "opacity-0 scale-75 bg-red-500 group-hover:opacity-5 group-hover:scale-110"
                            : "opacity-0 scale-75 bg-blue-500 group-hover:opacity-5 group-hover:scale-110"
                }`}
            />

            {/* Indicador visual izquierdo */}
            <span className={`absolute left-0 top-2 bottom-2 w-1 rounded-r transition-all duration-300 z-20 ${
                isActive
                    ? isDanger ? "bg-red-500" : "bg-[#0D6EFD]"
                    : "bg-transparent " + (isDanger ? "group-hover:bg-red-500/50" : "group-hover:bg-white/20")
            }`} />

            {/* Icono */}
            <span className="shrink-0 transition-all duration-200 relative z-10">
                <item.icon
                    className={`w-4 h-4 transition-all duration-200 ${
                        isActive
                            ? isDanger
                                ? "text-red-400 scale-105 drop-shadow-[0_0_6px_rgba(239,68,68,0.4)]"
                                : "text-[#0D6EFD] scale-105 drop-shadow-[0_0_6px_rgba(13,110,253,0.4)]"
                            : isDanger
                                ? "text-gray-500 group-hover:text-red-400"
                                : "text-gray-400 group-hover:text-white"
                    }`}
                />
            </span>

            {/* TEXTO EN FORMATO NORMAL (No Mayúsculas) */}
            <span className="hidden lg:block text-sm normal-case tracking-wide truncate relative z-10 transition-colors duration-200">
                {item.label}
            </span>

            {/* Tooltip flotante para la versión Mobile/Colapsada */}
            <span className={`lg:hidden absolute left-full ml-4 px-2 py-1 text-xs rounded-md 
                opacity-0 scale-95 pointer-events-none transition-all duration-150 group-hover:opacity-100 group-hover:scale-100 
                border font-medium whitespace-nowrap shadow-xl z-50 normal-case
                ${isDanger
                ? "bg-[#1A0B0B] text-red-400 border-red-500/20"
                : "bg-[#12141C] text-white border-white/5"
            }`}
            >
                {item.label}
            </span>
        </Link>
    );
}