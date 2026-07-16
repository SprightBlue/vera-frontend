import {Link} from "react-router-dom";
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
    Brain
} from "lucide-react";
import logoVera from "@/assets/Isologo_Vera.png";
import logoVeraIcon from "@/assets/Isotipo_Vera.png";
import {useAuth} from "@/presentation/context/AuthContext";
import {SidebarLink, type NavItem} from "@/features/shared/components/SidebarLink";

export function Sidebar() {
    const {user} = useAuth();

    const menuItems: NavItem[] = [
        {label: "Principal", path: "/dashboard", icon: LayoutDashboard, id: "nav-dashboard"},
        ...(user?.role === 'CARER' ? [
            {label: "Personas", path: "/persons", icon: Users, id: "nav-personas"},
            {label: "Contactos", path: "/contacts", icon: ContactRound, id: "nav-contactos"},
            {label: "Funciones IA", path: "/ai-center", icon: Sparkles, id: "nav-ai-center"},
            {label: "Historial", path: "/monitoring-center", icon: History, id: "nav-monitoring-center"},
            {label: "Incidentes", path: "/incidents", icon: AlertTriangle, id: "nav-incidentes"},
            {label: "Entrenamiento", path: "/training", icon: Brain, id: "nav-entrenamiento"},
        ] : []),
        ...(user?.role === 'PROTECTED' ? [
            {label: "Cuidadores", path: "/my-carers", icon: ShieldCheck, id: "nav-mis-cuidadores"},
            {label: "Funciones IA", path: "/ai-center", icon: Sparkles, id: "nav-ai-functions"},
            {label: "Historial", path: "/analysis-list", icon: History, id: "nav-alerts"},
        ] : [])
    ];

    const bottomItems: NavItem[] = [
        {label: "Manual", path: "/manual", icon: BookOpen, id: "nav-manual"},
        {label: "Configuración", path: "/settings", icon: Settings, id: "nav-configuracion"},
        {label: "Salir", path: "/logout", icon: LogOut, id: "nav-salir"}
    ];

    return (
        <aside className="fixed left-0 top-0 h-screen bg-linear-to-b from-[#0f172a] via-[#050814] to-[#010204]
        border-r border-slate-800/80 flex flex-col z-50 transition-all duration-300
        w-[clamp(4.5rem,6.5vw,5rem)] lg:w-[clamp(13rem,15vw,15.5rem)] select-none shadow-2xl overflow-hidden">

            <div
                className="absolute -top-12 left-1/2 -translate-x-1/2 w-56 h-56 bg-blue-500/10 rounded-full filter blur-[80px] pointer-events-none z-0"
            />

            <div
                className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-56 h-56 bg-indigo-500/5 rounded-full filter blur-[80px] pointer-events-none z-0"
            />

            <div
                className="shrink-0 h-[clamp(4.5rem,5vw,5.6rem)] flex items-center justify-center lg:justify-start px-[clamp(0.6rem,1vw,1.5rem)] relative overflow-hidden z-10">
                <div
                    className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-slate-500/10 to-transparent pointer-events-none"/>

                <Link
                    to="/dashboard"
                    title="Ir a Principal"
                    className="flex items-center justify-center lg:justify-start w-full cursor-pointer transition-all duration-200 ease-out hover:opacity-90 active:scale-[0.99]"
                >
                    <img
                        src={logoVeraIcon}
                        alt="Vera"
                        className="w-7 h-auto object-contain lg:hidden filter brightness-110 drop-shadow-[0_0_8px_rgba(59,130,246,0.25)]"
                    />
                    <img
                        src={logoVera}
                        alt="Vera"
                        className="hidden lg:block w-[75%] max-w-32 min-w-10 h-auto object-contain filter brightness-110 drop-shadow-[0_0_8px_rgba(59,130,246,0.15)]"
                    />
                </Link>
            </div>

            <div className="px-[clamp(0.4rem,0.6vw,1rem)] flex-none relative z-10">
                <div
                    className="h-px bg-linear-to-r from-transparent via-slate-500/10 to-transparent pointer-events-none"/>
            </div>

            <nav
                className="flex-1 flex flex-col gap-2 p-[clamp(0.4rem,0.6vw,1rem)] overflow-y-auto no-scrollbar relative z-10">
                {menuItems.map((item) => (
                    <SidebarLink key={item.path} item={item}/>
                ))}
            </nav>

            <div className="px-[clamp(0.4rem,0.6vw,1rem)] flex-none relative z-10">
                <div
                    className="h-px bg-linear-to-r from-transparent via-slate-500/10 to-transparent pointer-events-none"/>
            </div>

            <div className="shrink-0 flex flex-col gap-2 p-[clamp(0.4rem,0.6vw,1rem)] relative z-10">
                {bottomItems.map((item) => (
                    <SidebarLink key={item.path} item={item}/>
                ))}
            </div>
        </aside>
    );
}

export default Sidebar;