import { Link, useLocation } from "react-router-dom";
import { type LucideIcon } from "lucide-react";

export interface NavItem {
    label: string;
    path: string;
    icon: LucideIcon;
    id?: string;
}

interface SidebarLinkProps {
    item: NavItem;
}

export function SidebarLink({ item }: SidebarLinkProps) {
    const location = useLocation();
    const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);

    return (
        <Link
            to={item.path}
            id={item.id}
            title={item.label}
            className={`flex items-center justify-center lg:justify-start gap-[clamp(0.5rem,0.8vw,0.88rem)] px-[clamp(0.5rem,0.8vw,1rem)] py-[clamp(0.65rem,0.8vw,0.85rem)] rounded-lg transition-all duration-300 text-[clamp(10px,0.58vw,11px)] font-display font-black tracking-wider uppercase border relative group select-none active:scale-[0.97] z-10 overflow-hidden ${
                isActive
                    ? "bg-linear-to-b from-[#0e1630] to-[#060a18] text-white border-[#22356b] shadow-[0_4px_20px_rgba(0,0,0,0.35)] ring-1 ring-inset ring-blue-500/20"
                    : "text-slate-400 border-transparent hover:border-[#161f37] hover:bg-linear-to-b hover:from-[#080d20]/50 hover:to-[#040714]/30 hover:text-slate-200"
            }`}
        >
            <div className={`absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent to-transparent pointer-events-none transition-all duration-500 z-20 ${
                isActive ? "via-blue-400/40" : "via-transparent group-hover:via-slate-500/20"
            }`} />

            <div className={`absolute -top-6 -right-6 w-16 h-16 rounded-full filter blur-md pointer-events-none transform origin-top-right transition-all duration-500 ease-out z-0 ${
                isActive
                    ? "opacity-20 scale-125 bg-blue-500"
                    : "opacity-0 scale-75 bg-slate-500 group-hover:opacity-10 group-hover:scale-110"
            }`} />

            <span className={`absolute left-0 top-1 bottom-1 w-0.75 rounded-r transition-all duration-300 z-20 ${
                isActive ? "bg-blue-500 shadow-[0_0_12px_#3b82f6]" : "bg-transparent group-hover:bg-slate-700"
            }`} />

            <item.icon
                size={14}
                className={`shrink-0 transition-all duration-300 relative z-10 ${
                    isActive ? "text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)] scale-105" : "text-slate-500 group-hover:text-slate-300 group-hover:scale-105"
                }`}
            />

            <span className="hidden lg:inline truncate relative z-10 transition-colors duration-300">
                {item.label}
            </span>
        </Link>
    );
}