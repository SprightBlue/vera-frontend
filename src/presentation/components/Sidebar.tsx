import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    ContactRound,
    ShieldAlert,
    TextSearch,
    Settings,
    LogOut,
    BookOpen
} from "lucide-react";

import logoVera from "../../assets/Isologo_Vera.png";

function Sidebar() {
    const location = useLocation();

    const menuItems = [
        { label: "Panel Principal", path: "/dashboard", icon: LayoutDashboard },
        { label: "Personas que cuido", path: "/persons", icon: Users, id: "nav-personas" },
        { label: "Contactos", path: "/contacts", icon: ContactRound, id: "nav-contactos" },
        { label: "Analisis", path: "/analysis", icon: TextSearch, id: "nav-analisis" },
        { label: "Alertas", path: "/alerts", icon: ShieldAlert, id: "nav-alertas" }
    ];

    const bottomItems = [
        { label: "Manual de Uso", path: "/manual", icon: BookOpen, id: "nav-manual" },
        { label: "Configuración", path: "/settings", icon: Settings },
        { label: "Cerrar Sesión", path: "/logout", icon: LogOut }
    ];

    return (
        <aside className="
            fixed
            left-0
            top-0
            w-[260px]
            h-screen
            bg-[#070B1A]
            border-r
            border-[#182033]
            flex
            flex-col
            p-6
            z-50
        ">
            {/* Logo */}
           <div className="-mt-10 mb-2 pl-4">
    <img
        src={logoVera}
        alt="Vera Logo"
        className="w-[135px] h-auto object-contain opacity-95"
    />
</div>

            {/* Menú principal */}
            <div className="flex flex-col gap-2 flex-1">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            id={item.id}
                            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 text-[14px] font-medium cursor-pointer ${
                                isActive
                                    ? "bg-blue-600/10 border border-blue-500/20 text-white"
                                    : "text-slate-400 hover:bg-[#0f1425] hover:text-white"
                            }`}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </div>

            {/* Menú inferior */}
            <div className="flex flex-col gap-2 pt-6 border-t border-[#182033]">
                {bottomItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        id={item.id}
                        className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-slate-400 hover:bg-[#0f1425] hover:text-white transition-all text-[14px] font-medium cursor-pointer"
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </Link>
                ))}
            </div>
        </aside>
    );
}

export default Sidebar;