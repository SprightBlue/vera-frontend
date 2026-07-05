import { CheckCircle2, XCircle } from "lucide-react";
import type { RecentSessionSummary } from "../api/training-api";

const TYPE_LABEL: Record<string, string> = {
    WHATSAPP: "WhatsApp",
    SMS: "SMS",
    EMAIL: "Email",
};

const TYPE_BADGE: Record<string, string> = {
    WHATSAPP: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    SMS: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    EMAIL: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

interface Props {
    sessions: RecentSessionSummary[];
}

export function RecentActivityPanel({ sessions }: Props) {
    if (sessions.length === 0) {
        return (
            <p className="text-slate-500 text-base py-6 text-center">
                Todavía no hay actividad registrada.
            </p>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            {sessions.map((s) => (
                <div
                    key={s.sessionId}
                    className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-[#070B1A] border border-[#182033]"
                >
                    <div className="flex items-center gap-3 min-w-0">
                        {s.correct ? (
                            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                        ) : (
                            <XCircle size={16} className="text-red-400 shrink-0" />
                        )}
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-200 truncate">
                                {s.scenarioTitle}
                            </p>
                            <p className="text-sm text-slate-500">
                                {s.completedAt
                                    ? new Date(s.completedAt).toLocaleDateString("es-AR", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })
                                    : "—"}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${TYPE_BADGE[s.scenarioType] ?? ""}`}>
                            {TYPE_LABEL[s.scenarioType] ?? s.scenarioType}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${ s.correct ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
                            {s.correct ? "¡Bien hecho!" : "Error"}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}