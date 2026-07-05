import { X, Send } from "lucide-react";
import { useState } from "react";
import type { TrainingScenarioDto } from "../api/training-api";
import { ScenarioCard } from "./ScenarioCard";

interface Props {
    scenarios: TrainingScenarioDto[];
    onAssign: (scenarioId: string) => Promise<void>;
    onClose: () => void;
    assigning: boolean;
}

export function AssignTrainingModal({ scenarios, onAssign, onClose, assigning }: Props) {
    const [filter, setFilter] = useState<"ALL" | "WHATSAPP" | "SMS" | "EMAIL">("ALL");

    const filtered = filter === "ALL" ? scenarios : scenarios.filter((s) => s.scenarioType === filter);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[#0c1020] border border-[#182033] rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#182033]">
                    <div>
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Send size={16} className="text-blue-400" />
                            Enviar entrenamiento
                        </h3>
                        <p className="text-sm text-slate-400 mt-0.5">
                            Elegí un escenario para asignarle a tu protegido
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-all cursor-pointer"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="flex gap-2 px-6 py-3 border-b border-[#182033]">
                    {(["ALL", "WHATSAPP", "SMS", "EMAIL"] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                                filter === f
                                    ? "bg-blue-600/20 border-blue-500/40 text-blue-300"
                                    : "bg-transparent border-[#182033] text-slate-500 hover:text-slate-300"
                            }`}
                        >
                            {f === "ALL" ? "Todos" : f}
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filtered.map((s) => (
                        <ScenarioCard
                            key={s.id}
                            scenario={s}
                            onAssign={async (id) => { await onAssign(id); onClose();}}
                            assigning={assigning}
                        />
                    ))}
                    {filtered.length === 0 && (
                        <p className="text-slate-500 text-sm col-span-2 text-center py-8">
                            No hay escenarios disponibles.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}