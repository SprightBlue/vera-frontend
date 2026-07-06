import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/presentation/context/AuthContext";
import Sidebar from "@/presentation/components/Sidebar";
import Header from "@/presentation/components/Header";
import { useAlertDetail } from "@/features/alerts/hooks/useAlertDetail";
import { getRiskConfig } from '@/features/analysis/utils/riskConfig';
import {
    ArrowLeft,
    CheckCircle,
    Trash2,
    Loader2,
    RefreshCw,
    FileText,
    Globe,
    Clock,
    Tag
} from "lucide-react";

function AlertDetail() {
    const { alertId } = useParams<{ alertId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { detail, loading, error, retry, markAsResolved, removeAlert } = useAlertDetail(alertId!);
    const [actionLoading, setActionLoading] = useState<boolean>(false);

    const config = detail ? getRiskConfig(detail.riskLevel) : null;
    const percentage = detail?.riskPercentage ?? 0;
    const isHighRisk = detail?.riskLevel?.toUpperCase() === 'HIGH' || detail?.riskLevel?.toUpperCase() === 'ALTO';

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#050816] text-slate-100 font-sans antialiased select-none">
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden transition-all duration-300 ml-20 lg:ml-56">
                <Header userName={user?.fullName} title="Detalle de Alerta" />

                <main className="flex-1 overflow-y-auto no-scrollbar px-[clamp(1rem,2vw,3rem)] py-[clamp(1rem,1.8vw,2.5rem)] flex flex-col justify-between">
                    <div className="mx-auto max-w-480 w-full flex-1 flex flex-col gap-[clamp(1.2rem,1.8vw,2rem)] animate-fade-in">

                        <div className="flex items-center">
                            <button
                                onClick={() => navigate('/alerts')}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#182033] bg-[#0a0f24]/60 text-[#94a3b8] hover:text-white text-[10px] font-bold uppercase tracking-widest cursor-pointer group transition-all duration-150 active:scale-[0.98]"
                            >
                                <ArrowLeft size={12} className="transform group-hover:-translate-x-0.5 transition-transform text-slate-400 group-hover:text-white" />
                                <span>Volver al listado</span>
                            </button>
                        </div>

                        {loading ? (
                            <div className="w-full flex-1 flex flex-col items-center justify-center py-36 select-none animate-fade-in">
                                <Loader2 size={22} className="text-blue-500 animate-spin stroke-[1.5] mb-2" />
                                <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase animate-pulse">
                                    Cargando
                                </span>
                            </div>
                        ) : error ? (
                            <div className="w-full flex-1 flex items-center justify-center py-24 select-none animate-fade-in">
                                <button
                                    onClick={retry}
                                    className="flex items-center gap-2 text-[11px] font-bold text-slate-400 hover:text-slate-200 tracking-widest uppercase transition-colors cursor-pointer group"
                                >
                                    <RefreshCw size={12} className="stroke-[2.5] text-slate-500 group-hover:text-slate-200 transition-colors" />
                                    <span>Reintentar</span>
                                </button>
                            </div>
                        ) : detail && config ? (
                            <>
                                <div className={`rounded-2xl border-y border-r border-[#182033] bg-linear-to-b from-[#0a0f24] to-[#070B1A] p-[clamp(0.9rem,1.3vw,1.5rem)] shadow-xl relative overflow-hidden ${config.borderColor} border-l-4`}>
                                    <div className={`absolute top-0 right-0 w-[clamp(180px,18vw,320px)] h-[clamp(180px,18vw,320px)] rounded-full filter blur-[80px] opacity-10 pointer-events-none ${
                                        isHighRisk ? 'bg-red-500' : percentage >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                                    }`} />

                                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative z-10">
                                        <div className="space-y-1 min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="text-[clamp(0.95rem,1.1vw,1.2rem)] font-bold tracking-tight text-white truncate max-w-sm sm:max-w-md select-text">
                                                    {detail.title || 'Contenido Analizado'}
                                                </h3>
                                                <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider border shrink-0 ${config.bgColor} ${config.borderColor} ${config.textColor}`}>
                                                    {config.label} {percentage}%
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full md:w-auto shrink-0">
                                            <button
                                                onClick={async () => { setActionLoading(true); await markAsResolved(); setActionLoading(false); }}
                                                disabled={detail.isResolved || actionLoading}
                                                className={`w-full md:w-32 h-9 flex items-center justify-center gap-1.5 px-3.5 rounded-xl font-bold text-[clamp(0.72rem,0.78vw,0.82rem)] tracking-tight transition-all duration-150 active:scale-[0.97] ${
                                                    detail.isResolved
                                                        ? "bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 cursor-not-allowed"
                                                        : "bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/10 cursor-pointer"
                                                }`}
                                            >
                                                {actionLoading ? (
                                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                ) : (
                                                    <CheckCircle className="h-3.5 w-3.5" />
                                                )}
                                                <span>{detail.isResolved ? "Resuelta" : "Pendiente"}</span>
                                            </button>

                                            <button
                                                onClick={async () => { if(window.confirm("¿Desea purgar este informe forense de forma permanente?")) { await removeAlert(); navigate('/alerts'); }}}
                                                className="w-full md:w-32 h-9 flex items-center justify-center gap-1.5 px-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-[clamp(0.72rem,0.78vw,0.82rem)] tracking-tight transition-all duration-150 shadow-lg shadow-red-600/10 active:scale-[0.97] cursor-pointer"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                                <span>Eliminar</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="w-full h-1 bg-slate-800/40 rounded-full mt-4 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ${
                                                isHighRisk ? 'bg-red-500' : percentage >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                                            }`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 bg-[#070B1A]/40 border border-[#182033]/60 rounded-xl px-4 py-2.5 text-[clamp(0.7rem,0.75vw,0.8rem)] text-slate-400 select-none">
                                    <div className="flex items-center gap-1.5">
                                        <Globe size={12} className="text-slate-500" />
                                        <span>Dónde: <strong className="text-slate-200 font-semibold select-text">{detail.source || 'No especificado'}</strong></span>
                                    </div>
                                    <div className="w-1 h-1 bg-slate-700 rounded-full shrink-0" />
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={12} className="text-slate-500" />
                                        <span>Cuándo: <strong className="text-slate-200 font-semibold select-text">{detail.createdAt}</strong></span>
                                    </div>
                                    <div className="w-1 h-1 bg-slate-700 rounded-full shrink-0" />
                                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                        <Tag size={12} className="text-slate-500 shrink-0" />
                                        <span className="truncate">
                                            Categoría: <strong className="text-blue-400 font-bold ml-0.5 select-text">{detail.riskType || 'General'}</strong>
                                        </span>
                                    </div>
                                </div>

                                <div className="w-full space-y-[clamp(1rem,1.2vw,1.5rem)]">
                                    <div className="bg-[#070B1A]/40 border border-[#182033]/60 rounded-2xl p-[clamp(0.9rem,1.3vw,1.5rem)] space-y-2">
                                        <div className="flex items-center gap-2 text-slate-400 font-bold text-[9px] uppercase tracking-widest select-none">
                                            <FileText className="h-3.5 w-3.5 text-blue-400" />
                                            <h4>Resumen analítico del Contenido</h4>
                                        </div>
                                        <p className="text-[clamp(0.75rem,0.8vw,0.86rem)] text-slate-400 leading-relaxed font-medium select-text">
                                            {detail.contentSummary || 'No se pudo generar un resumen conceptual.'}
                                        </p>
                                    </div>

                                    <div className="space-y-2 flex flex-col">
                                        <h4 className="text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 text-red-400/90 select-none">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Patrones Sospechosos Detectados
                                        </h4>
                                        <div className="bg-[#070B1A]/20 border-l-2 border-red-500/50 p-[clamp(0.9rem,1.3vw,1.5rem)] flex-1">
                                            <p className="text-[clamp(0.75rem,0.8vw,0.86rem)] text-slate-300 leading-relaxed font-medium whitespace-pre-line select-text">
                                                {detail.suspiciousPatterns || 'Sin patrones de riesgo explícitos identificados.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : null}

                    </div>
                </main>
            </div>
        </div>
    );
}

export default AlertDetail;