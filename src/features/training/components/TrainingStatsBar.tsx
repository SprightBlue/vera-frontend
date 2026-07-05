import { CheckCircle, XCircle, Target, ShieldCheck } from "lucide-react";
import type { TrainingStatsDto } from "../api/training-api";

interface Props {
    stats: TrainingStatsDto;
    name: string;
}

export function TrainingStatsBar({ stats, name }: Props) {
    const items = [
        {
            icon: <Target size={20} className="text-blue-400" />,
            bg: "bg-blue-500/10 border-blue-500/20",
            label: "Entrenamientos completados",
            value: stats.completed,
        },
        {
            icon: <CheckCircle size={20} className="text-emerald-400" />,
            bg: "bg-emerald-500/10 border-emerald-500/20",
            label: "Respuestas correctas",
            value: `${stats.correct}/${stats.completed}`,
        },
        {
            icon: <ShieldCheck size={20} className="text-blue-400" />,
            bg: "bg-blue-500/10 border-blue-500/20",
            label: "Estafas detectadas",
            value: stats.detectedScams,
        },
        {
            icon: <XCircle size={20} className="text-amber-400" />,
            bg: "bg-amber-500/10 border-amber-500/20",
            label: "Señales aprendidas",
            value: `${stats.correctRate}%`,
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {items.map((item) => (
                <div key={item.label} className={`flex items-center gap-4 p-4 rounded-2xl border ${item.bg}`}>
                    <div className="shrink-0">{item.icon}</div>
                    <div>
                        <p className="text-2xl font-bold text-white">{item.value}</p>
                        <p className="text-sm text-slate-400 mt-0.5">{item.label}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}