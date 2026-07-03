import { Search, MessageSquareText } from "lucide-react";
import { Link } from "react-router-dom";
import Sidebar from "@/presentation/components/Sidebar";
import Header from "@/presentation/components/Header";
import { useAuth } from "@/presentation/context/AuthContext";

function AICenterPage() {
    const { user } = useAuth();

    return (
        <div className="flex h-screen w-full bg-[#050816] overflow-hidden">
            <Sidebar />

            <main className="flex-1 flex flex-col h-screen pl-20 xl:pl-56 transition-all duration-300">
                <div className="flex-none">
                    <Header
                        userName={user?.fullName}
                        title="Centro de Inteligencia Artificial"
                    />
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto">
                    <div className="h-full flex flex-col items-center justify-center py-10 px-8 gap-12">

                        <div className="max-w-3xl text-center shrink-0">
                            <h2 className="text-[clamp(1rem,1.5vw,1.5rem)] text-slate-400">
                                Explora nuestras herramientas de inteligencia artificial para analizar riesgos y obtener asistencia en tiempo real. Diseñadas para protegerte y brindarte información valiosa.
                            </h2>
                        </div>

                        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-10 justify-items-center">

                            <Link to="/analysis" className="group relative w-full max-w-md h-[clamp(24rem,35vh,30rem)] p-10 rounded-3xl bg-[#070B1A] border border-[#182033] hover:border-blue-500/50 hover:scale-[1.02] transition-all duration-300 shadow-xl flex flex-col justify-between items-center text-center">
                                <div className="absolute inset-0 bg-linear-to-b from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

                                <div className="relative flex flex-col items-center pt-2">
                                    {/* Ícono solo con su margen inferior */}
                                    <div className="mb-8">
                                        <Search className="text-blue-500 w-12 h-12 stroke-[1.5]" />
                                    </div>
                                    <h2 className="text-[clamp(1.5rem,2vw,2rem)] font-semibold text-slate-200 mb-4">Analizador</h2>
                                    <p className="text-[clamp(1rem,1.2vw,1.3rem)] text-slate-400 leading-relaxed">Detectá riesgos en textos, enlaces o multimedia con nuestra IA avanzada.</p>
                                </div>

                                <div className="relative">
                                    <span className="inline-block text-white font-semibold text-[clamp(1rem,1.2vw,1.2rem)] bg-linear-to-r from-blue-600 to-blue-700 px-8 py-4 rounded-xl shadow-lg">
                                        Analizar Ahora
                                    </span>
                                </div>
                            </Link>

                            <Link to="/chat" className="group relative w-full max-w-md h-[clamp(24rem,35vh,30rem)] p-10 rounded-3xl bg-[#070B1A] border border-[#182033] hover:border-blue-500/50 hover:scale-[1.02] transition-all duration-300 shadow-xl flex flex-col justify-between items-center text-center">
                                <div className="absolute inset-0 bg-linear-to-b from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

                                <div className="relative flex flex-col items-center pt-2">
                                    <div className="mb-8">
                                        <MessageSquareText className="text-blue-500 w-12 h-12 stroke-[1.5]" />
                                    </div>
                                    <h2 className="text-[clamp(1.5rem,2vw,2rem)] font-semibold text-slate-200 mb-4">Asistente</h2>
                                    <p className="text-[clamp(1rem,1.2vw,1.3rem)] text-slate-400 leading-relaxed">Conversá con nuestro Asistente IA para resolver dudas en tiempo real.</p>
                                </div>

                                <div className="relative">
                                    <span className="inline-block text-white font-semibold text-[clamp(1rem,1.2vw,1.2rem)] bg-linear-to-r from-blue-600 to-blue-700 px-8 py-4 rounded-xl shadow-lg">
                                        Iniciar Chat
                                    </span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default AICenterPage;