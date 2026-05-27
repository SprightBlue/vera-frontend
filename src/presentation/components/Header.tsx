import { Bell } from "lucide-react";

interface HeaderProps {
    userName?: string;
    userRole?: string;
}

function Header({ userName = "Usuario", userRole = "Protector" }: HeaderProps) {
    return (
        <header
            className="
                sticky top-0 z-30
                flex items-center justify-between
                w-full
                px-8 py-5
                bg-[#050816]/80 backdrop-blur-md
                border-b border-white/5
            "
        >
            {/* Bienvenida */}
            <div className="flex flex-col">
                <h2 className="text-xl font-medium text-white tracking-tight flex items-center gap-2">
                    Bienvenido, {userName} <span className="text-xl"></span>
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                    Aquí tienes el resumen del bienestar de tus protegidos.
                </p>
            </div>

            {/* Acciones */}
            <div className="flex items-center gap-6">
                <button className="relative p-2 text-slate-400 hover:text-white transition-all duration-200 rounded-full hover:bg-white/5">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full ring-2 ring-[#050816]" />
                </button>

                <div className="flex items-center gap-3 border-l border-white/5 pl-6">
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-semibold text-white">{userName}</span>
                        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-medium">
                            {userRole}
                        </span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-blue-400 font-bold text-sm shadow-lg shadow-black/20">
                        {userName.charAt(0).toUpperCase()}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;