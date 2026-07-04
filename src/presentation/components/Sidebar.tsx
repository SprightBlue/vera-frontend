import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, ContactRound, ShieldAlert, Sparkles, Settings, LogOut, BookOpen, AlertTriangle, ShieldCheck, Brain, type LucideIcon } from "lucide-react";
import logoVera from "@/assets/Isologo_Vera.png";
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
            { label: "Centro IA", path: "/ai-center", icon: Sparkles, id: "nav-ai-center" },
            { label: "Alertas", path: "/alerts", icon: ShieldAlert, id: "nav-alertas" },
            { label: "Incidentes", path: "/incidents", icon: AlertTriangle, id: "nav-incidentes" },
            { label: "Entrenamiento", path: "/training", icon: Brain, id: "nav-entrenamiento" },
        ] : []),
        ...(user?.role === 'PROTECTED' ? [
            { label: "Cuidadores", path: "/my-carers", icon: ShieldCheck, id: "nav-mis-cuidadores" },
            { label: "Centro IA", path: "/ai-center", icon: Sparkles, id: "nav-ai-center" },
            { label: "Alertas", path: "/alerts", icon: ShieldAlert, id: "nav-alertas" },
            { label: "Incidentes", path: "/incidents", icon: AlertTriangle, id: "nav-incidentes" },
        ] : [])
    ];

    const bottomItems: NavItem[] = [
        { label: "Manual", path: "/manual", icon: BookOpen, id: "nav-manual" },
        { label: "Configuración", path: "/settings", icon: Settings, id: "nav-configuracion" },
        { label: "Salir", path: "/logout", icon: LogOut, id: "nav-salir" }
    ];

    const renderNavLink = (item: NavItem) => {
        const isActive = location.pathname === item.path;
        return (
            <Link
                key={item.path}
                to={item.path}
                id={item.id}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 text-[clamp(0.85rem,1vw,0.95rem)] font-medium border ${
                    isActive
                        ? "bg-[#070B1A] text-blue-500 border-blue-500/20 shadow-sm"
                        : "text-slate-400 border-transparent hover:bg-[#070B1A]/50 hover:text-white"
                }`}
            >
                <item.icon size="1.25rem" className="shrink-0" />
                <span className="hidden xl:inline truncate">{item.label}</span>
            </Link>
        );
    };

    return (
        <aside className="fixed left-0 top-0 h-screen bg-[#0c1020] border-r border-[#161f38] flex flex-col z-50 transition-all duration-300 w-20 xl:w-56">
            <div className="shrink-0 h-[5.6rem] flex items-center justify-center xl:justify-start px-6 border-b border-[#161f38]">
                <img src={logoVera} alt="Vera" className="w-[70%] max-w-34 min-w-10 h-auto object-contain" />
            </div>

            <nav className="flex-1 flex flex-col gap-1.5 p-4">
                {menuItems.map(renderNavLink)}
            </nav>

            <div className="shrink-0 flex flex-col gap-1.5 p-4 border-t border-[#161f38]">
                {bottomItems.map(renderNavLink)}
            </div>
        </aside>
    );
}

export default Sidebar;