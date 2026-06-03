import { AlertTriangle, X, Mail, CheckCircle2 } from "lucide-react";
import { type RiskAlertResponse } from "../api/riskAlerts";
import { getRiskColor } from "../utils/alertUtils";

interface AlertDetailModalProps {
    alert: RiskAlertResponse;
    animateIn: boolean;
    onClose: () => void;
    onSolve: (id: string) => void;
}

export function AlertDetailModal({ alert, animateIn, onClose, onSolve }: AlertDetailModalProps) {
    return (
        <div
            className={`fixed inset-0 z-9999 flex justify-center items-center p-4 transition-all duration-300 ease-out bg-black/0 backdrop-blur-none
                ${animateIn ? 'bg-black/85 backdrop-blur-md' : 'pointer-events-none'}
            `}
        >
            <div
                className={`w-full max-w-xl rounded-xl border border-slate-800 bg-slate-900 p-5 sm:p-6 text-slate-200 shadow-2xl relative flex flex-col gap-5 max-h-[90vh] my-auto overflow-hidden
                    transition-all duration-300 ease-out transform
                    ${animateIn ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}
                `}
            >
                <div className="flex items-start justify-between border-b border-white/5 pb-4 shrink-0">
                    <div className="flex items-center gap-3 min-w-0">
                        <AlertTriangle className="text-red-500 h-6 w-6 shrink-0" />
                        <div className="min-w-0">
                            <h3 className="text-base sm:text-lg font-bold text-white truncate">Detalle de Amenaza Detectada</h3>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 cursor-pointer shrink-0">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex flex-col gap-4 text-sm overflow-y-auto pr-1 grow">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950 p-4 rounded-lg border border-white/5">
                        <div>
                            <span className="text-xs text-slate-500 font-medium uppercase">Nombre de Usuario</span>
                            <p className="font-semibold text-white text-base mt-0.5 truncate">{alert.protectedUserName}</p>
                        </div>
                        <div className="sm:text-right">
                            <span className="text-xs text-slate-500 font-medium uppercase block mb-1">Nivel de Riesgo</span>
                            <span className={`inline-block text-xs px-2.5 py-1 rounded-full border font-extrabold ${getRiskColor(alert.riskLevel)}`}>
                                {alert.riskLevel}
                            </span>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-semibold text-slate-400 uppercase mb-1">Mensaje Analizado</h4>
                        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 italic text-slate-300 wrap-break-word text-xs sm:text-sm max-h-30 overflow-y-auto">
                            "{alert.messageContent}"
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-semibold text-slate-400 uppercase mb-1">Patrones Identificados</h4>
                        <p className="text-slate-300 pl-3 border-l-2 border-red-500/40 text-xs sm:text-sm">{alert.suspiciousPatterns || "Sin patrones explícitos."}</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/5 shrink-0">
                    <button
                        onClick={() => onSolve(alert.alertId)}
                        className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 font-semibold text-white transition cursor-pointer text-sm"
                    >
                        <CheckCircle2 className="w-4 h-4" />
                        Marcar como Resuelto
                    </button>
                </div>
            </div>
        </div>
    );
}