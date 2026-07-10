import Sidebar from "@/presentation/components/Sidebar";
import Header from "@/presentation/components/Header";
import { useAuth } from "@/presentation/context/AuthContext";
import { OptionCard } from "@/features/shared/components/OptionCard";

export function MonitoringCenterPage() {
    const { user } = useAuth();

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#050814] font-sans antialiased text-slate-100 select-none">
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden transition-all duration-300 ml-20 lg:ml-56 relative">
                <Header userName={user?.fullName} title="Historial" />

                <main className="flex-1 overflow-y-auto no-scrollbar px-[clamp(1.2rem,2.5vw,3rem)] py-[clamp(1.5rem,2.5vw,2.5rem)] flex flex-col justify-between relative z-10">
                    <div className="mx-auto max-w-7xl w-full flex-1 flex flex-col gap-[clamp(1.5rem,2vw,2.5rem)] animate-fade-in">

                        <div className="border-b border-[#182033]/60 pb-5 w-full select-text relative">
                            <span className="text-[10px] font-black tracking-widest text-amber-500 uppercase block mb-1">
                                Tu Cuaderno de Notas y Avisos
                            </span>
                            <h2 className="text-[clamp(0.8rem,0.85vw,0.92rem)] text-slate-400 leading-relaxed font-medium max-w-4xl tracking-wide">
                                Este es tu registro personal. Desde acá podés volver a mirar todas las cosas que mandaste a revisar antes y ver los avisos automáticos de seguridad que el sistema detectó para protegerte.
                            </h2>
                        </div>

                        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-[clamp(1.2rem,1.5vw,1.8rem)] items-stretch">
                            <OptionCard
                                title="Historial de Análisis"
                                description="Entrá acá para ver una lista de todos los textos, enlaces o cadenas que revisaste antes. Podés volver a ver los resultados y los consejos de seguridad guardados."
                                to="/analysis-list"
                                buttonLabel="Ver mis Revisiones"
                                variant="info"
                            />

                            <OptionCard
                                title="Historial de Alertas"
                                description="Revisá los avisos automáticos de seguridad. Te muestra si el sistema detectó algún peligro en tus aplicaciones conectadas y cuáles ya se solucionaron para tu tranquilidad."
                                to="/alerts"
                                buttonLabel="Ver mis Alertas"
                                variant="warning"
                            />
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}