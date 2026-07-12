import Sidebar from "@/features/shared/components/Sidebar";
import Header from "@/features/shared/components/Header";
import { useAuth } from "@/presentation/context/AuthContext";
import { OptionCard } from "@/features/shared/components/OptionCard";

export function AiCenterView() {
    const { user } = useAuth();

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#050814] font-sans antialiased text-slate-100 select-none">
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden transition-all duration-300 ml-20 lg:ml-56 relative">
                <Header userName={user?.fullName} title="Funciones IA" />

                <main className="flex-1 overflow-y-auto no-scrollbar px-[clamp(1.5rem,3vw,3.5rem)] py-[clamp(1.5rem,2.5vw,3rem)] flex flex-col justify-between relative z-10">
                    <div className="mx-auto max-w-7xl w-full flex-1 flex flex-col gap-[clamp(1.5rem,2.5vw,3rem)] animate-fade-in">

                        <div className="relative pb-6 w-full select-text">
                            <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#161f37]/90 to-transparent pointer-events-none" />

                            <h2 className="text-[clamp(13px,0.8vw,15px)] text-slate-400 leading-relaxed font-sans font-medium max-w-4xl tracking-wide">
                                Acá vas a encontrar ayuda al instante para revisar cualquier mensaje dudoso que te llegue. Estas herramientas están hechas para cuidarte de engaños y proteger tus cosas de forma muy simple.
                            </h2>
                        </div>

                        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-[clamp(1.2rem,1.8vw,2.2rem)] items-stretch">
                            <OptionCard
                                title="Analizador Inteligente"
                                description="¿Te llegó un mensaje raro, un enlace sospechoso o una foto extraña? Pegalo acá. Nuestro sistema lo revisa rápido y te dice si es seguro abrirlo o si se trata de una estafa."
                                to="/analysis"
                                buttonLabel="Analizar Mensaje"
                                variant="info"
                            />

                            <OptionCard
                                title="Asistente Virtual"
                                description="Un chat directo para hablar con un ayudante digital experto en seguridad. Podés hacerle preguntas comunes, sacarte dudas sobre llamadas raras o aprender cómo evitar fraudes."
                                to="/chat"
                                buttonLabel="Abrir el Chat"
                                variant="purple"
                            />
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}