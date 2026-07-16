import {Link, useLocation} from "react-router-dom";
import {type LucideIcon} from "lucide-react";

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

export function SidebarLink({item}: SidebarLinkProps) {
    const location = useLocation();
    const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);

    const isDanger = item.isDanger || item.path === "/logout";

    return (
        <Link
            to={item.path}
            id={item.id}
            title={item.label}
            className={`flex items-center justify-center lg:justify-start gap-[clamp(0.5rem,0.8vw,0.88rem)] px-[clamp(0.75rem,1vw,1.2rem)] py-[clamp(0.65rem,0.8vw,0.85rem)] rounded-lg text-[clamp(10px,0.58vw,11px)] font-display font-black tracking-wider uppercase border relative group select-none active:scale-[0.97] transition-all duration-300 z-10 overflow-hidden outline-hidden ${
                isActive
                    ? isDanger
                        ? "bg-linear-to-b from-red-950/20 to-red-950/10 text-red-400 border-red-900/40 shadow-[0_4px_20px_rgba(239,68,68,0.15)] ring-1 ring-inset ring-red-500/10"
                        : "bg-linear-to-b from-[#0e1630] to-[#060a18] text-white border-[#22356b] shadow-[0_4px_20px_rgba(0,0,0,0.35)] ring-1 ring-inset ring-blue-500/20"
                    : isDanger
                        ? "text-slate-400 border-transparent hover:border-red-950/40 hover:bg-linear-to-b hover:from-red-950/10 hover:to-red-950/5 hover:text-red-400"
                        : "text-slate-400 border-transparent hover:border-[#161f37] hover:bg-linear-to-b hover:from-[#080d20]/50 hover:to-[#040714]/30 hover:text-slate-200"
            }`}
        >
            <div
                className={`absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent to-transparent pointer-events-none transition-all duration-500 z-20 ${
                    isActive
                        ? isDanger ? "via-red-500/30" : "via-blue-400/40"
                        : isDanger ? "group-hover:via-red-500/20" : "group-hover:via-slate-500/20"
                }`}/>

            <div
                className={`absolute -top-6 -right-6 w-16 h-16 rounded-full filter blur-md pointer-events-none transform origin-top-right transition-all duration-500 ease-out z-0 ${
                    isActive
                        ? isDanger
                            ? "opacity-15 scale-125 bg-red-500"
                            : "opacity-20 scale-125 bg-blue-500"
                        : isDanger
                            ? "opacity-0 scale-75 bg-red-500 group-hover:opacity-10 group-hover:scale-110"
                            : "opacity-0 scale-75 bg-blue-500 group-hover:opacity-10 group-hover:scale-110"
                }`}/>

            <span className={`absolute left-0 top-1.5 bottom-1.5 w-0.75 rounded-r transition-all duration-300 z-20 ${
                isActive
                    ? isDanger
                        ? "bg-red-500 shadow-[0_0_12px_#ef4444]"
                        : "bg-blue-500 shadow-[0_0_12px_#3b82f6]"
                    : "bg-transparent " + (isDanger ? "group-hover:bg-red-500 group-hover:shadow-[0_0_12px_#ef4444]" : "group-hover:bg-blue-500 group-hover:shadow-[0_0_12px_#3b82f6]")
            }`}/>

            <span className="shrink-0 transition-all duration-300 relative z-10">
                <item.icon
                    className={`w-3.5 h-3.5 transition-all duration-300 ${
                        isActive
                            ? isDanger
                                ? "text-red-400 scale-105 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                                : "text-blue-400 scale-105 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]"
                            : isDanger
                                ? "text-slate-500 group-hover:text-red-400 group-hover:scale-105 group-hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                                : "text-slate-500 group-hover:text-blue-400 group-hover:scale-105 group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                    }`}
                />
            </span>

            <span className="hidden lg:inline truncate relative z-10 transition-colors duration-300">
                {item.label}
            </span>
        </Link>
    );
}