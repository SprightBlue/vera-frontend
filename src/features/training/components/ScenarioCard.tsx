import { MessageSquare, Mail, MessageCircle, Play } from "lucide-react";
import type { TrainingScenarioDto } from "../api/training-api";

const TYPE_CONFIG = {
    WHATSAPP: {
        label: "WhatsApp",
        icon: <MessageCircle size={16} />,
        color: "text-emerald-400",
        bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    SMS: {
        label: "SMS",
        icon: <MessageSquare size={16} />,
        color: "text-blue-400",
        bg: "bg-blue-500/10 border-blue-500/20",
    },
    EMAIL: {
        label: "Email",
        icon: <Mail size={16} />,
        color: "text-amber-400",
        bg: "bg-amber-500/10 border-amber-500/20",
    },
};

const DIFFICULTY_LABEL: Record<string, string> = {
    BEGINNER: "Nivel 1",
    INTERMEDIATE: "Nivel 2",
    ADVANCED: "Nivel 3",
};

interface Props {
    scenario: TrainingScenarioDto;
    onAssign: (scenarioId: string) => void;
    assigning: boolean;
}

export function ScenarioCard({ scenario, onAssign, assigning }: Props) {
    const cfg = TYPE_CONFIG[scenario.scenarioType] ?? TYPE_CONFIG.SMS;

    return (
        <div className="bg-[#070B1A] border border-[#182033] rounded-2xl p-4 flex flex-col gap-3 hover:border-blue-500/30 transition-all">
            <div className="flex items-start justify-between gap-2">
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-sm font-medium ${cfg.bg} ${cfg.color}`}>
                    {cfg.icon}
                    {cfg.label}
                </div>
                <span className="text-xs text-slate-500 font-medium">
                    {DIFFICULTY_LABEL[scenario.difficulty] ?? scenario.difficulty}
                </span>
            </div>

            <div>
                <h4 className="text-base font-semibold text-slate-100 mb-1">{scenario.title}</h4>
                <p className="text-sm text-slate-400 line-clamp-2">{scenario.messageBody}</p>
            </div>

            <button
                onClick={() => onAssign(scenario.id)}
                disabled={assigning}
                className="mt-auto flex items-center justify-center gap-2 px-3 py-2 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 rounded-xl text-sm font-semibold text-blue-300 transition-all cursor-pointer disabled:opacity-50"
            >
                <Play size={12} />
                Asignar entrenamiento
            </button>
        </div>
    );
}