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
                className={`flex items-center justify-center lg:justify-start gap-3.5 px-4 py-[clamp(0.6rem,0.75vw,0.8rem)] rounded-lg transition-all duration-150 text-[clamp(0.78rem,0.82vw,0.88rem)] font-black tracking-widest uppercase border relative group select-none active:scale-[0.98] z-10 ${
                    isActive
                        ? "bg-linear-to-b from-[#101735] to-[#070B1A] text-white border-[#182033]/80 shadow-lg shadow-black/30 ring-1 ring-inset ring-blue-500/10"
                        : "text-slate-400 border-transparent hover:bg-[#131b35]/30 hover:text-slate-200"
                }`}
            >
                {isActive && (
                    <span className="absolute left-0 top-0 bottom-0 w-0.75 bg-blue-500" />
                )}

                <item.icon
                    size={15}
                    className={`shrink-0 transition-colors duration-200 ${
                        isActive ? "text-blue-400 drop-shadow-[0_0_6px_rgba(96,165,250,0.4)]" : "text-slate-500 group-hover:text-slate-300"
                    }`}
                />
                <span className="hidden lg:inline truncate">{item.label}</span>
            </Link>
        );
    };

    return (
        <aside className="fixed left-0 top-0 h-screen bg-linear-to-b from-[#0a0f24] to-[#050814] border-r border-[#182033]/80 flex flex-col z-50 transition-all duration-300 w-20 lg:w-56 select-none shadow-2xl overflow-hidden">

            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-500/10 rounded-full filter blur-[90px] opacity-[0.08] pointer-events-none z-0" />

            <div className="shrink-0 h-[clamp(4.5rem,5vw,5.6rem)] flex items-center justify-center lg:justify-start px-5 lg:px-6 border-b border-[#182033]/80 relative overflow-hidden z-10">
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

            <div className="shrink-0 flex flex-col gap-1.5 p-[clamp(0.5rem,0.6vw,1rem)] border-t border-[#182033]/80 bg-[#050814]/40 relative z-10">
                {bottomItems.map(renderNavLink)}
            </div>
        </aside>
    );
}

export default Sidebar;