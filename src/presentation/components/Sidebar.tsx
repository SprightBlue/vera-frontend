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
            { label: "Historial", path: "/alerts", icon: History, id: "nav-alerts" },
            { label: "Incidentes", path: "/incidents", icon: AlertTriangle, id: "nav-incidentes" },
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
                className={`flex items-center justify-center lg:justify-start gap-3.5 px-4 py-[clamp(0.55rem,0.75vw,0.75rem)] rounded-xl transition-all duration-200 text-[clamp(0.8rem,0.85vw,0.95rem)] font-medium border relative group ${
                    isActive
                        ? "bg-linear-to-r from-[#131b35] to-[#070B1A] text-white border-[#182033] shadow-md shadow-black/20"
                        : "text-slate-400 border-transparent hover:bg-[#131b35]/40 hover:text-slate-100"
                }`}
            >
                {isActive && (
                    <span className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-blue-500 rounded-r-md" />
                )}

                <item.icon
                    size={16}
                    className={`shrink-0 transition-colors duration-200 ${
                        isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"
                    }`}
                />
                <span className="hidden lg:inline truncate">{item.label}</span>
            </Link>
        );
    };

    return (
        <aside className="fixed left-0 top-0 h-screen bg-linear-to-b from-[#0a0f24] to-[#070B1A] border-r border-[#182033] flex flex-col z-50 transition-all duration-300 w-20 lg:w-56 select-none">

            <div className="shrink-0 h-[clamp(4.5rem,5vw,5.6rem)] flex items-center justify-center lg:justify-start px-4 lg:px-6 border-b border-[#182033]">
                <img
                    src={logoVeraIcon}
                    alt="Vera"
                    className="w-8 h-auto object-contain lg:hidden filter brightness-110"
                />
                <img
                    src={logoVera}
                    alt="Vera"
                    className="hidden lg:block w-[75%] max-w-32 min-w-10 h-auto object-contain filter brightness-110"
                />
            </div>

            <nav className="flex-1 flex flex-col gap-1 p-[clamp(0.4rem,0.6vw,1rem)] overflow-y-auto no-scrollbar">
                {menuItems.map(renderNavLink)}
            </nav>

            <div className="shrink-0 flex flex-col gap-1 p-[clamp(0.4rem,0.6vw,1rem)] border-t border-[#182033]">
                {bottomItems.map(renderNavLink)}
            </div>
        </aside>
    );
}

export default Sidebar;