import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Trash2, AlertTriangle, Shield, Clock, FileText, User } from "lucide-react";

import { useAuth } from "../../../presentation/context/AuthContext";
import Sidebar from "../../../presentation/components/Sidebar";
import Header from "../../../presentation/components/Header";
import { useAlertDetail } from "../hooks/useAlertDetail";
import { AlertActionModal } from "../components/AlertActionModal";
import { getRiskConfig } from "../../analysis/utils/riskConfig";

export function AlertDetail() {
    const { alertId } = useParams<{ alertId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const { detail, loading, error, loadDetail, markAsResolved, removeAlert } = useAlertDetail(alertId!);

    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        type: 'RESOLVE' | 'DELETE'
    }>({ isOpen: false, type: 'RESOLVE' });

    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    useEffect(() => {
        if (alertId) void loadDetail();
    }, [loadDetail, alertId]);

    const riskConfig = getRiskConfig(detail?.riskLevel ?? undefined);

    const handleConfirm = async (): Promise<void> => {
        setIsProcessing(true);
        try {
            if (modalConfig.type === 'RESOLVE') {
                await markAsResolved();
                await loadDetail();
            } else {
                await removeAlert();
                navigate('/alerts');
                return;
            }
        } catch (err) {
            console.error("Error al ejecutar acción:", err);
        } finally {
            setIsProcessing(false);
            setModalConfig(prev => ({ ...prev, isOpen: false }));
        }
    };

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#050816] text-slate-100 font-inter">
            <aside className="hidden md:block md:w-64 shrink-0 border-r border-slate-800/50 bg-[#050816]">
                <Sidebar />
            </aside>

            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
                <Header
                    userName={user?.fullName ?? "Usuario"}
                    title="Detalle de Alerta"
                    subtitle="Análisis forense y gestión de amenazas"
                />

                <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-5xl w-full">
                        {loading ? (
                            <div className="animate-pulse space-y-6">
                                <div className="h-8 bg-slate-800/50 rounded-lg w-1/3" />
                                <div className="h-64 bg-slate-800/50 rounded-2xl" />
                            </div>
                        ) : error ? (
                            <div className="text-red-400 p-8 text-center bg-red-950/20 rounded-2xl border border-red-900/30">{error}</div>
                        ) : detail ? (
                            <>
                                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
                                    <button onClick={() => navigate('/alerts')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium cursor-pointer">
                                        <ArrowLeft size={16} /> Volver al listado
                                    </button>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setModalConfig({ isOpen: true, type: 'RESOLVE' })}
                                            disabled={detail.isResolved}
                                            className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                                                detail.isResolved ? "bg-slate-800/50 text-slate-500 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20"
                                            }`}
                                        >
                                            <CheckCircle size={16} /> {detail.isResolved ? "Resuelta" : "Marcar como Resuelta"}
                                        </button>
                                        <button
                                            onClick={() => setModalConfig({ isOpen: true, type: 'DELETE' })}
                                            className="px-4 py-2 bg-slate-900 border border-slate-800 text-red-400 hover:bg-red-950/30 rounded-xl text-sm font-bold flex items-center gap-2 transition-all cursor-pointer"
                                        >
                                            <Trash2 size={16} /> Eliminar
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="lg:col-span-2 flex flex-col gap-6">
                                        <div className="p-6 bg-[#070B1A] border border-slate-800 rounded-2xl">
                                            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-800/50">
                                                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-400">
                                                    <User size={16} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Usuario Protegido</p>
                                                    <h2 className="text-sm font-bold text-white">{detail.protectedFullName}</h2>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-start mb-4">
                                                <h1 className="text-xl font-bold text-white flex items-center gap-3">
                                                    <FileText className="text-blue-500" /> {detail.title}
                                                </h1>
                                                <span className="px-2.5 py-0.5 bg-blue-900/20 border border-blue-900/50 text-blue-400 text-[10px] font-bold uppercase rounded-md tracking-wider">
                                                    {detail.riskType}
                                                </span>
                                            </div>
                                            <p className="text-slate-400 text-sm leading-relaxed">{detail.contentSummary}</p>
                                        </div>

                                        <div className="p-6 bg-[#070B1A] border border-slate-800 rounded-2xl">
                                            <h3 className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-widest">Patrones Sospechosos</h3>
                                            <p className="text-slate-300 text-sm leading-relaxed">{detail.suspiciousPatterns}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-6">
                                        <div className="p-6 bg-[#070B1A] border border-slate-800 rounded-2xl">
                                            <div className={`flex items-center gap-2 mb-4 ${riskConfig.textColor}`}>
                                                <AlertTriangle size={18} />
                                                <span className="font-bold text-sm">{riskConfig.label}</span>
                                            </div>
                                            <div className={`text-4xl font-black mb-3 ${riskConfig.textColor}`}>
                                                {detail.riskPercentage}%
                                            </div>
                                            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full transition-all duration-1000"
                                                    style={{
                                                        width: `${detail.riskPercentage}%`,
                                                        backgroundColor: riskConfig.textColor.replace('text-', '') === 'green-400' ? '#4ade80' :
                                                            riskConfig.textColor.replace('text-', '') === 'yellow-400' ? '#facc15' :
                                                                riskConfig.textColor.replace('text-', '') === 'red-400' ? '#f87171' : '#64748b'
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="p-6 bg-[#070B1A] border border-slate-800 rounded-2xl flex-1">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3 text-sm text-slate-300">
                                                    <Shield className="text-blue-500" size={18} />
                                                    <span>Origen: {detail.source ?? "Desconocido"}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-sm text-slate-300">
                                                    <Clock className="text-indigo-500" size={18} />
                                                    <span>Creada: {new Date(detail.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            {detail.isResolved && detail.resolvedAt && (
                                                <div className="mt-6 pt-4 border-t border-slate-800 text-emerald-400 text-xs font-bold">
                                                    Resuelta el: {new Date(detail.resolvedAt).toLocaleString()}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : null}
                    </div>
                </main>
            </div>

            <AlertActionModal
                isOpen={modalConfig.isOpen}
                title={modalConfig.type === 'RESOLVE' ? "¿Marcar como resuelta?" : "¿Eliminar alerta?"}
                message={modalConfig.type === 'RESOLVE'
                    ? "Esta acción moverá la alerta al historial de resueltas."
                    : "Esta acción es irreversible y borrará el registro de forma permanente."}
                type={modalConfig.type}
                isProcessing={isProcessing}
                onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                onConfirm={handleConfirm}
            />
        </div>
    );
}