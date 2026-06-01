import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    ContactRound,
    ShieldAlert,
    TextSearch,
    Settings,
    LogOut
} from "lucide-react";

import logoVera from "../../assets/Isologo_Vera.png";

function Sidebar() {
    const location = useLocation();

    const menuItems = [
        { label: "Panel Principal", path: "/dashboard", icon: LayoutDashboard },
        { label: "Personas que cuido", path: "/people", icon: Users },
        { label: "Contactos", path: "/contacts", icon: ContactRound },
        { label: "Analisis", path: "/analysis", icon: TextSearch },
        { label: "Alertas", path: "/alerts", icon: ShieldAlert }
    ];

    const bottomItems = [
        { label: "Configuración", path: "/settings", icon: Settings },
        { label: "Cerrar Sesión", path: "/logout", icon: LogOut }
    ];

    return (
        <aside className="w-[260px] min-h-screen bg-[#070B1A] border-r border-[#182033] flex flex-col p-6">
            
            {/* LOGO: Ajustado para no ser invasivo */}
            <div className="mb-12 px-2">
                <img 
                    src={logoVera} 
                    alt="Vera Logo" 
                    className="w-[90px] h-auto object-contain opacity-90" 
                />
            </div>

            {/* MENÚ SUPERIOR: Más espaciado vertical */}
            <div className="flex flex-col gap-2 flex-1">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 text-[14px] font-medium ${
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

            {/* MENÚ INFERIOR */}
            <div className="flex flex-col gap-2 pt-6 border-t border-[#182033]">
                {bottomItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-slate-400 hover:bg-[#0f1425] hover:text-white transition-all text-[14px] font-medium"
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