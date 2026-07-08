import { Link } from "react-router-dom";
import Sidebar from "@/presentation/components/Sidebar";
import Header from "@/presentation/components/Header";
import { useAuth } from "@/presentation/context/AuthContext";

function AICenterPage() {
    const { user } = useAuth();

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#050816] font-sans antialiased text-slate-100 select-none">
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden transition-all duration-300 ml-20 lg:ml-56">

                <Header
                    userName={user?.fullName}
                    title="Funciones IA"
                />

                <main className="flex-1 overflow-y-auto no-scrollbar px-[clamp(1rem,2vw,3rem)] py-[clamp(1.2rem,2vw,2.5rem)] flex flex-col justify-between">
                    <div className="mx-auto max-w-480 w-full flex-1 flex flex-col gap-[clamp(1.2rem,1.8vw,2rem)] animate-fade-in">

                        <div className="border-b border-[#182033]/40 pb-4 w-full select-text">
                            <h2 className="text-[clamp(0.75rem,0.8vw,0.86rem)] text-slate-400 leading-relaxed font-medium max-w-4xl">
                                Explorá nuestras herramientas inteligentes para examinar posibles riesgos y recibir ayuda personalizada. Están diseñadas para ayudarte a detectar engaños y proteger tus datos.
                            </h2>
                        </div>

                        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-[clamp(1rem,1.2vw,1.5rem)] items-stretch">

                            <div className="group rounded-2xl border-y border-r bg-linear-to-b from-[#0a0f24] to-[#070B1A] border-l-4 border-blue-500/70 p-[clamp(0.9rem,1.3vw,1.5rem)] shadow-xl relative overflow-hidden flex flex-col justify-between transition-all duration-200">
                                <div className="absolute top-0 right-0 w-[clamp(180px,18vw,320px)] h-[clamp(180px,18vw,320px)] rounded-full bg-blue-500 filter blur-[80px] opacity-5 pointer-events-none" />

                                <div className="relative z-10 w-full">
                                    <h3 className="text-[clamp(0.95rem,1.1vw,1.2rem)] font-bold tracking-tight text-white select-text mb-2">
                                        Analizador Inteligente
                                    </h3>
                                    <p className="text-[clamp(0.75rem,0.8vw,0.86rem)] text-slate-400 leading-relaxed font-medium select-text">
                                        Escaneá mensajes sospechosos, enlaces dudosos o archivos sospechosos. Nuestra inteligencia artificial revisará el contenido al instante para decirte si se trata de una estafa o un peligro.
                                    </p>
                                </div>

                                <div className="relative mt-[clamp(1.5rem,2vw,2.5rem)] w-full sm:w-auto z-10">
                                    <Link
                                        to="/analysis"
                                        className="inline-flex items-center justify-center w-full sm:w-36 h-9 text-white font-bold text-[clamp(10px,0.6vw,12px)] tracking-wider uppercase bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/10 transition-all duration-150 active:scale-[0.97]"
                                    >
                                        Analizar Ahora
                                    </Link>
                                </div>
                            </div>

                            <div className="group rounded-2xl border-y border-r bg-linear-to-b from-[#0a0f24] to-[#070B1A] border-l-4 border-indigo-500/70 p-[clamp(0.9rem,1.3vw,1.5rem)] shadow-xl relative overflow-hidden flex flex-col justify-between transition-all duration-200">
                                <div className="absolute top-0 right-0 w-[clamp(180px,18vw,320px)] h-[clamp(180px,18vw,320px)] rounded-full bg-indigo-500 filter blur-[80px] opacity-5 pointer-events-none" />

                                <div className="relative z-10 w-full">
                                    <h3 className="text-[clamp(0.95rem,1.1vw,1.2rem)] font-bold tracking-tight text-white select-text mb-2">
                                        Asistente Virtual
                                    </h3>
                                    <p className="text-[clamp(0.75rem,0.8vw,0.86rem)] text-slate-400 leading-relaxed font-medium select-text">
                                        Chateá en tiempo real con nuestro asistente especializado en seguridad. Hacele preguntas para resolver dudas sobre tus reportes, aclarar sospechas de fraude o saber cómo actuar ante una amenaza.
                                    </p>
                                </div>

                                <div className="relative mt-[clamp(1.5rem,2vw,2.5rem)] w-full sm:w-auto z-10">
                                    <Link
                                        to="/chat"
                                        className="inline-flex items-center justify-center w-full sm:w-36 h-9 text-white font-bold text-[clamp(10px,0.6vw,12px)] tracking-wider uppercase bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/10 transition-all duration-150 active:scale-[0.97]"
                                    >
                                        Iniciar Chat
                                    </Link>
                                </div>
                            </div>

                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default AICenterPage;