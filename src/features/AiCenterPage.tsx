import { Search, MessageSquareText} from "lucide-react";
import { Link } from "react-router-dom";
import Sidebar from "../presentation/components/Sidebar";
import Header from "../presentation/components/Header";
import { useAuth } from "../presentation/context/AuthContext";

export function AICenterPage() {
    const { user } = useAuth();

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#050816]">
            <Sidebar />
            <div className="flex-1 flex flex-col h-full ml-65">
                <Header
                    userName={user?.fullName}
                    title="Centro de Inteligencia"
                    subtitle="Seleccioná una herramienta para comenzar"
                />

                <div className="flex-1 flex items-center justify-center p-8">
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
                        {/* Tarjeta Analizador */}
                        <Link to="/analysis" className="group p-8 rounded-3xl bg-[#070B1A] border border-[#182033] hover:border-blue-500/50 transition-all flex flex-col items-center text-center shadow-2xl">
                            <div className="w-20 h-20 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                                <Search className="text-blue-500" size={40} />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-3">Analizador de Contenido</h2>
                            <p className="text-slate-400 mb-6">Detectá riesgos en textos, enlaces o contenido multimedia sospechosos con nuestra IA avanzada.</p>
                            <span className="text-blue-400 font-semibold text-sm border border-blue-500/20 px-4 py-2 rounded-xl">Analizar Ahora</span>
                        </Link>

                        {/* Tarjeta Chat */}
                        <Link to="/chat" className="group p-8 rounded-3xl bg-[#070B1A] border border-[#182033] hover:border-indigo-500/50 transition-all flex flex-col items-center text-center shadow-2xl">
                            <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                                <MessageSquareText className="text-indigo-500" size={40} />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-3">Asistente Inteligente</h2>
                            <p className="text-slate-400 mb-6">Conversá con VERA para resolver dudas de seguridad en tiempo real.</p>
                            <span className="text-indigo-400 font-semibold text-sm border border-indigo-500/20 px-4 py-2 rounded-xl">Iniciar Chat</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}