import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    ContactRound,
    History,
    Sparkles,
    Settings,
    LogOut,
    BookOpen,
    AlertTriangle,
    ShieldCheck,
    Brain,
    type LucideIcon
} from "lucide-react";
import logoVera from "@/assets/Isologo_Vera.png";
import logoVeraIcon from "@/assets/Isotipo_Vera.png";
import { useAuth } from "@/presentation/context/AuthContext";

interface NavItem {
    label: string;
    path: string;
    icon: LucideIcon;
    id?: string;
}

function Sidebar() {
    const location = useLocation();
    const { user } = useAuth();

    const menuItems: NavItem[] = [
        { label: "Principal", path: "/dashboard", icon: LayoutDashboard, id: "nav-dashboard" },
        ...(user?.role === 'CARER' ? [
            { label: "Personas", path: "/persons", icon: Users, id: "nav-personas" },
            { label: "Contactos", path: "/contacts", icon: ContactRound, id: "nav-contactos" },
            { label: "Funciones IA", path: "/ai-center", icon: Sparkles, id: "nav-ai-center" },
            { label: "Historial", path: "/monitoring-center", icon: History, id: "nav-monitoring-center" },
            { label: "Incidentes", path: "/incidents", icon: AlertTriangle, id: "nav-incidentes" },
            { label: "Entrenamiento", path: "/training", icon: Brain, id: "nav-entrenamiento" },
        ] : []),
        ...(user?.role === 'PROTECTED' ? [
            { label: "Cuidadores", path: "/my-carers", icon: ShieldCheck, id: "nav-mis-cuidadores" },
            { label: "Funciones IA", path: "/ai-center", icon: Sparkles, id: "nav-ai-functions" },
            { label: "Historial", path: "/analysis-list", icon: History, id: "nav-alerts" },
        ] : [])
    ];

    const bottomItems: NavItem[] = [
        { label: "Manual", path: "/manual", icon: BookOpen, id: "nav-manual" },
        { label: "Configuración", path: "/settings", icon: Settings, id: "nav-configuracion" },
        { label: "Salir", path: "/logout", icon: LogOut, id: "nav-salir" }
    ];

    const renderNavLink = (item: NavItem) => {
        const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);

        return (
            <Link
                key={item.path}
                to={item.path}
                id={item.id}
                title={item.label}
                className={`flex items-center justify-center lg:justify-start gap-3.5 px-4 py-[clamp(0.6rem,0.75vw,0.8rem)] rounded-lg transition-all duration-300 text-[clamp(0.78rem,0.82vw,0.88rem)] font-display font-black border relative group select-none active:scale-[0.98] z-10 overflow-hidden ${
                    isActive
                        ? "bg-blue-500/10 text-white border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.12)] ring-1 ring-inset ring-blue-500/20"
                        : "text-slate-400 border-transparent hover:border-blue-500/20 hover:bg-[#080d20]/60 hover:text-white"
                }`}
            >
                <div className={`absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent to-transparent pointer-events-none transition-all duration-300 ${
                    isActive ? "via-blue-400/40" : "via-transparent group-hover:via-blue-400/25"
                }`} />

                <div className={`absolute -top-10 -right-10 w-24 h-24 rounded-full filter blur-[22px] pointer-events-none transform origin-top-right transition-all duration-500 ease-out z-0 ${
                    isActive
                        ? "opacity-30 scale-110 bg-blue-500"
                        : "opacity-0 scale-75 bg-blue-500 group-hover:opacity-20 group-hover:scale-110"
                }`} />

                {isActive && (
                    <span className="absolute left-0 top-0 bottom-0 w-0.75 bg-blue-500 z-10 shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
                )}

                <item.icon
                    size={15}
                    className={`shrink-0 transition-colors duration-200 relative z-10 ${
                        isActive ? "text-blue-400 drop-shadow-[0_0_6px_rgba(96,165,250,0.5)]" : "text-slate-500 group-hover:text-blue-400"
                    }`}
                />
                <span className="hidden lg:inline truncate relative z-10">{item.label}</span>
            </Link>
        );
    };

    return (
        <aside className="fixed left-0 top-0 h-screen bg-linear-to-b from-[#080d20] via-[#040714] to-[#010206] border-r border-[#1c2646]/50 flex flex-col z-50 transition-all duration-300 w-20 lg:w-56 select-none shadow-2xl overflow-hidden">

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-500/5 rounded-full filter blur-[90px] pointer-events-none z-0" />

            <div className="shrink-0 h-[clamp(4.5rem,5vw,5.6rem)] flex items-center justify-center lg:justify-start px-5 lg:px-6 border-b border-[#22315c]/20 relative overflow-hidden z-10">
                <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-slate-500/10 to-transparent pointer-events-none" />
                <img
                    src={logoVeraIcon}
                    alt="Vera"
                    className="w-8 h-auto object-contain lg:hidden filter brightness-110 drop-shadow-[0_0_8px_rgba(59,130,246,0.2)]"
                />
                <img
                    src={logoVera}
                    alt="Vera"
                    className="hidden lg:block w-[75%] max-w-32 min-w-10 h-auto object-contain filter brightness-110 drop-shadow-[0_0_8px_rgba(59,130,246,0.15)]"
                />
            </div>

            <nav className="flex-1 flex flex-col gap-1.5 p-[clamp(0.5rem,0.6vw,1rem)] overflow-y-auto no-scrollbar relative z-10">
                {menuItems.map(renderNavLink)}
            </nav>

            <div className="shrink-0 flex flex-col gap-1.5 p-[clamp(0.5rem,0.6vw,1rem)] border-t border-[#22315c]/15 relative z-10">
                {bottomItems.map(renderNavLink)}
            </div>
        </aside>
    );
}

export default Sidebar;