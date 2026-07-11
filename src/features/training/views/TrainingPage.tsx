import { useState } from "react";
import Sidebar from "@/presentation/components/Sidebar";
import Header from "@/presentation/components/Header";
import { useAuth } from "@/presentation/context/AuthContext";
import { useTraining } from "../hooks/useTraining";
import { TrainingStatsBar } from "../components/TrainingStatsBar";
import { ProgressChart } from "../components/ProgressChart";
import { RecentActivityPanel } from "../components/RecentActivityPanel";
import { AssignTrainingModal } from "../components/AssignTrainingModal";
import { ScenarioCard } from "../components/ScenarioCard";
import { Send, TrendingUp, Activity, BookOpen, Inbox } from "lucide-react";
import toast from "react-hot-toast";
import {PersonAvatar} from "@/presentation/components/common/PersonAvatar.tsx";
import {ActionButton} from "@/features/shared/components/ActionButton.tsx";

export default function TrainingPage() {
    const { user } = useAuth();
    const { persons, selectedPersonId, selectedPerson, selectPerson, progress, scenarios, loading, assigning, error, handleAssign,} = useTraining();

    const [showAssignModal, setShowAssignModal] = useState(false);

    const handleAssignWithToast = async (scenarioId: string) => {
        try {
            await handleAssign(scenarioId);
            toast.success("Entrenamiento asignado correctamente");
        } catch {
            toast.error("No se pudo asignar el entrenamiento");
        }
    };

    const firstName = selectedPerson?.fullName?.split(" ")[0] ?? "tu protegido";

    return (
        <div className="flex min-h-screen bg-[#050816]">
            <Sidebar />

            <main className="flex-1 flex flex-col min-w-0 ml-[79.2px] xl:ml-[224px]">
                <Header
                    userName={user?.fullName ?? "Usuario"}
                    title="Entrenamiento Educacional"
                    subtitle="Seguí el progreso de tus protegidos y asigná escenarios de práctica"
                />

                <div className="p-6 flex-1">

                    {/* Filtro por protegido */}
                    {persons.length > 0 && (
                        <div className="mb-6">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                                Filtrar por protegido
                            </p>
                            <div className="flex gap-2 flex-wrap">
                                {persons.map((p) => (
                                    <button
                                        key={p.id}
                                        onClick={() => selectPerson(p.id)}
                                        className={`flex items-center gap-2.5 pl-2 pr-4 py-2 rounded-xl border text-sm font-medium transition-all cursor-pointer ${selectedPersonId === p.id   ? "bg-blue-600/10 border-blue-500/30 text-white" : "bg-[#0d1222] border-[#182033] text-slate-400 hover:text-white hover:border-[#2a3550]"}`}
                                    >
                                        <PersonAvatar fullName={p.fullName} image={p.image} size="xs" />
                                        {p.fullName}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="p-4 mb-6 rounded-xl bg-red-950/30 border border-red-900 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="animate-pulse space-y-4">
                            <div className="grid grid-cols-4 gap-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="h-24 bg-[#0d1222] rounded-2xl border border-[#182033]" />
                                ))}
                            </div>
                            <div className="h-64 bg-[#0d1222] rounded-2xl border border-[#182033]" />
                        </div>
                    ) : !progress ? (
                        <div className="flex flex-col items-center justify-center pt-24 gap-4 text-center">
                            <div className="p-5 rounded-full bg-[#0d1222] border border-[#182033]">
                                <Inbox size={36} className="text-slate-600" />
                            </div>
                            <div>
                                <h3 className="text-slate-200 font-semibold text-xl">
                                    Sin datos de entrenamiento
                                </h3>
                                <p className="text-slate-500 text-base max-w-sm mx-auto mt-1">
                                    {firstName} todavía no completó ningún entrenamiento. Podés asignarle uno para empezar.
                                </p>
                            </div>
                            <ActionButton variant="info" icon={Send} onClick={() => setShowAssignModal(true)}>
                                Asignar primer entrenamiento
                            </ActionButton>
                        </div>
                    ) : (
                        <div className="space-y-6">

                            {/* Botón de asignar entrenamiento */}
                            <div className="flex items-center justify-between">
                                <h2 className="text-base font-semibold text-slate-300">
                                    Así va el entrenamiento de{" "}
                                    <span className="text-white">{firstName}</span>
                                </h2>
                                <ActionButton variant="info" icon={Send} onClick={() => setShowAssignModal(true)}>
                                    Enviar entrenamiento
                                </ActionButton>
                            </div>

                            {/* Stats */}
                            <TrainingStatsBar stats={progress.stats} name={firstName} />

                            {/* Banner promocional + Gráfico */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                                {/* Banner */}
                                <div className="relative overflow-hidden bg-gradient-to-br from-blue-900/40 to-indigo-900/30 border border-blue-500/20 rounded-2xl p-6 flex flex-col justify-between min-h-[180px]">
                                    <div className="absolute right-0 top-0 h-full w-32 opacity-10">
                                        <BookOpen size={120} className="text-blue-300 absolute right-2 top-4" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white leading-snug">
                                            Aprender jugando te hace más fuerte contra las estafas digitales
                                        </h3>
                                        <p className="text-sm text-slate-400 mt-6 leading-relaxed max-w-xs">
                                            Escenarios reales, decisiones importantes y consejos de VERA para estar siempre un paso adelante.
                                        </p>
                                    </div>
                                    <ActionButton variant="info" onClick={() => setShowAssignModal(true)} className="mt-4 self-start">
                                        Ver cómo funciona →
                                    </ActionButton>
                                </div>

                                {/* Gráfico de progreso */}
                                <div className="bg-[#0d1222] border border-[#182033] rounded-2xl p-5">
                                    <div className="flex items-center gap-2 mb-4">
                                        <TrendingUp size={15} className="text-blue-400" />
                                        <h3 className="text-base font-semibold text-slate-200">
                                            Progreso de {firstName}
                                        </h3>
                                    </div>
                                    <ProgressChart data={progress.dailyProgress} />
                                    <p className="text-xs text-slate-500 mt-2 text-right">
                                        Tasa de respuestas correctas por día
                                    </p>
                                </div>
                            </div>

                            {/* Actividad reciente + Misiones recomendadas */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                                {/* Actividad reciente */}
                                <div className="bg-[#0d1222] border border-[#182033] rounded-2xl p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <Activity size={15} className="text-blue-400" />
                                            <h3 className="text-base font-semibold text-slate-200">
                                                Actividad reciente
                                            </h3>
                                        </div>
                                    </div>
                                    <RecentActivityPanel sessions={progress.recentSessions} />
                                </div>

                                {/* Misiones recomendadas */}
                                <div className="bg-[#0d1222] border border-[#182033] rounded-2xl p-5">
                                    <div className="flex items-center gap-2 mb-4">
                                        <BookOpen size={15} className="text-amber-400" />
                                        <div>
                                            <h3 className="text-base font-semibold text-slate-200 inline">
                                                Misiones recomendadas{" "}
                                            </h3>
                                            <span className="text-sm font-bold text-white">
                                                para {firstName}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-500 mb-4">
                                        Nuevos escenarios para seguir aprendiendo
                                    </p>
                                    <div className="grid grid-cols-1 gap-3">
                                        {scenarios.slice(0, 3).map((s) => (
                                            <ScenarioCard
                                                key={s.id}
                                                scenario={s}
                                                onAssign={handleAssignWithToast}
                                                assigning={assigning}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {showAssignModal && (
                <AssignTrainingModal
                    scenarios={scenarios}
                    onAssign={handleAssignWithToast}
                    onClose={() => setShowAssignModal(false)}
                    assigning={assigning}
                />
            )}
        </div>
    );
}