import {type RiskConfig, SOURCE_LABELS} from "./alert-ui.ts";

interface DetectionSummaryCardProps {
    messageSource: string;
    createdAt: string;
    risk: RiskConfig;
}

function DetectionSummaryCard({ messageSource, createdAt, risk }: DetectionSummaryCardProps) {
    const detectedAt = new Date(createdAt).toLocaleString("es-AR", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <div className="p-6 rounded-2xl bg-[#070B1A] border border-[#182033] flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                Resumen de Detección
            </h2>
            <div className="flex flex-col gap-4 sm:gap-3">
                <div className="flex flex-row items-center justify-between gap-2">
                    <span className="text-slate-300 text-sm shrink-0">Nivel detectado</span>
                    <span className={`text-sm font-semibold px-2.5 py-0.5 rounded-full ${risk.badge}`}>
                        {risk.label}
                    </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                    <span className="text-slate-400 sm:text-slate-300 text-xs sm:text-sm shrink-0">Detectado</span>
                    <span className="text-slate-300 text-sm sm:text-right font-medium">
                        {detectedAt}
                    </span>
                </div>

                <div className="flex flex-row items-center justify-between gap-2">
                    <span className="text-slate-300 text-sm shrink-0">Origen</span>
                    <span className="text-slate-300 text-sm flex items-center gap-1.5 font-medium">
                        {SOURCE_LABELS[messageSource] ?? messageSource}
                    </span>
                </div>
            </div>
        </div>
    );
}
export default DetectionSummaryCard;