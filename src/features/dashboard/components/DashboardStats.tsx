import { useNavigate } from "react-router-dom";
import { Activity, UserCheck, ShieldAlert, Radio, MessageSquare, Shield, ArrowUpRight } from "lucide-react";
import { LoadingScreen } from "@/features/shared/components/LoadingScreen";
import { RetryScreen } from "@/features/shared/components/RetryScreen";
import { EmptyState } from "@/features/shared/components/EmptyState";
import { ItemCard } from "@/features/shared/components/ItemCard";
import { ActionButton } from "@/features/shared/components/ActionButton"; // Tu componente personalizado
import { type DashboardResponse } from "../api/dashboardApi";

interface DashboardStatsProps {
    loading: boolean;
    error: boolean;
    data: DashboardResponse | null;
    refetch: () => void;
    role: "CARER" | "PROTECTED";
    hasProtected: boolean;
}

export function DashboardStats({ loading, error, data, refetch, role, hasProtected }: DashboardStatsProps) {
    const navigate = useNavigate();

    if (loading) return <LoadingScreen />;
    if (error) return <RetryScreen onRetry={refetch} />;
    if (!data) return null;
    if (role === "CARER" && !hasProtected) return null;

    const isCarer = role === "CARER";
    const { latestUpdatedChat, latestTrustContact } = data;

    return (
        <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-[clamp(1.2rem,2vw,2.5rem)] items-start animate-fade-in">

            {/* =========================================================================
                COLUMNA IZQUIERDA: TERMINAL DE TELEMETRÍA Y CONSOLA DE ESTADOS (xl:col-span-5)
               ========================================================================= */}
            <div className="xl:col-span-5 flex flex-col gap-[clamp(1rem,1.5vw,1.5rem)] w-full">
                <span className="text-[clamp(10px,0.55vw,11px)] font-black tracking-widest text-slate-500 uppercase border-b border-[#182033]/60 pb-2 flex items-center gap-2 select-none">
                    <Radio size={12} className="text-blue-500 animate-pulse" />
                    Consola de Monitoreo Semanal
                </span>

                {/* --- TARJETA 1: MÉTRICAS Y CONTADORES UNIFICADOS --- */}
                <div className="w-full bg-[#070b19] border border-[#161f37] rounded-xl p-[clamp(1rem,1.4vw,1.5rem)] relative overflow-hidden shadow-2xl group">
                    <div className="absolute top-0 left-0 w-[2px] h-full bg-linear-to-b from-blue-500/40 to-transparent" />

                    <h4 className="text-[clamp(9px,0.5vw,10px)] font-black tracking-widest text-blue-400 uppercase mb-4">
                        // CORE_METRICS_TELEMETRY
                    </h4>

                    <div className="grid grid-cols-2 gap-4">
                        {isCarer ? (
                            <>
                                <div className="bg-[#0b122c] border border-[#1c2848] rounded-lg p-3 ring-1 ring-inset ring-white/[0.02]">
                                    <span className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1 flex items-center gap-1">
                                        <ShieldAlert size={12} className="text-red-500" /> Amenazas
                                    </span>
                                    <span className="text-[clamp(1.5rem,2.2vw,2.5rem)] font-black text-white leading-none">
                                        {data.alertsCountSince}
                                    </span>
                                </div>
                                <div className="bg-[#0b122c] border border-[#1c2848] rounded-lg p-3 ring-1 ring-inset ring-white/[0.02]">
                                    <span className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1 flex items-center gap-1">
                                        <UserCheck size={12} className="text-emerald-500" /> Resueltas
                                    </span>
                                    <span className="text-[clamp(1.5rem,2.2vw,2.5rem)] font-black text-white leading-none">
                                        {data.resolvedAlertsCountSince}
                                    </span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="bg-[#0b122c] border border-[#1c2848] rounded-lg p-3 ring-1 ring-inset ring-white/[0.02]">
                                    <span className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1 flex items-center gap-1">
                                        <Activity size={12} className="text-cyan-500" /> Análisis
                                    </span>
                                    <span className="text-[clamp(1.5rem,2.2vw,2.5rem)] font-black text-white leading-none">
                                        {data.analysisCountSince}
                                    </span>
                                </div>
                                <div className="bg-[#0b122c] border border-[#1c2848] rounded-lg p-3 ring-1 ring-inset ring-white/[0.02]">
                                    <span className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1 flex items-center gap-1">
                                        <ShieldAlert size={12} className="text-red-500" /> Riesgos
                                    </span>
                                    <span className="text-[clamp(1.5rem,2.2vw,2.5rem)] font-black text-white leading-none">
                                        {data.alertsCountSince}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* --- TARJETA 2: ÚLTIMO CHAT CON INTELIGENCIA ARTIFICIAL --- */}
                <div className="w-full bg-[#070b19] border border-[#161f37] rounded-xl p-[clamp(1rem,1.4vw,1.5rem)] relative overflow-hidden shadow-2xl flex flex-col justify-between min-h-[140px]">
                    <div className="absolute top-0 left-0 w-[2px] h-full bg-linear-to-b from-purple-500/40 to-transparent" />

                    <div>
                        <h4 className="text-[clamp(9px,0.5vw,10px)] font-black tracking-widest text-purple-400 uppercase mb-3 flex items-center gap-1.5">
                            <MessageSquare size={11} /> // INTEGRACIÓN_NEURAL_IA
                        </h4>

                        {latestUpdatedChat ? (
                            <div className="mb-4">
                                <p className="text-[clamp(0.85rem,0.9vw,1rem)] font-extrabold text-white line-clamp-1 uppercase tracking-tight">
                                    {latestUpdatedChat.title || "Consulta General Segura"}
                                </p>
                                <span className="text-[10px] text-slate-400 font-medium">
                                    Última transmisión: {latestUpdatedChat.updatedAt}
                                </span>
                            </div>
                        ) : (
                            <p className="text-[clamp(0.78rem,0.85vw,0.9rem)] text-slate-500 font-semibold mb-4 uppercase tracking-normal">
                                No se registran sesiones de comunicación de IA esta semana.
                            </p>
                        )}
                    </div>

                    <div className="w-full flex justify-end border-t border-[#161f37]/50 pt-3">
                        <ActionButton
                            variant="purple"
                            icon={ArrowUpRight}
                            onClick={() => navigate("/ai-center")}
                        >
                            Abrir Consola
                        </ActionButton>
                    </div>
                </div>

                {/* --- TARJETA 3: ÚLTIMO CONTACTO DE CONFIANZA ASIGNADO --- */}
                <div className="w-full bg-[#070b19] border border-[#161f37] rounded-xl p-[clamp(1rem,1.4vw,1.5rem)] relative overflow-hidden shadow-2xl flex flex-col justify-between min-h-[140px]">
                    <div className="absolute top-0 left-0 w-[2px] h-full bg-linear-to-b from-emerald-500/40 to-transparent" />

                    <div>
                        <h4 className="text-[clamp(9px,0.5vw,10px)] font-black tracking-widest text-emerald-400 uppercase mb-3 flex items-center gap-1.5">
                            <Shield size={11} /> // ENLACE_DE_CONFIANZA_VÍNCULO
                        </h4>

                        {latestTrustContact ? (
                            <div className="mb-4 flex flex-col gap-0.5">
                                <p className="text-[clamp(0.85rem,0.9vw,1rem)] font-extrabold text-white uppercase tracking-tight">
                                    {latestTrustContact.oppositeUserFullName}
                                </p>
                                <p className="text-[11px] text-slate-400 font-medium font-mono lowercase">
                                    {latestTrustContact.oppositeUserEmail}
                                </p>
                                <span className="inline-flex mt-1 w-max px-2 py-0.5 rounded-sm text-[8px] font-black tracking-widest bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 uppercase">
                                    Nivel: {latestTrustContact.oppositeUserRole}
                                </span>
                            </div>
                        ) : (
                            <p className="text-[clamp(0.78rem,0.85vw,0.9rem)] text-slate-500 font-semibold mb-4 uppercase tracking-normal">
                                Ningún nodo o enlace de seguridad ha sido emparejado aún.
                            </p>
                        )}
                    </div>

                    <div className="w-full flex justify-end border-t border-[#161f37]/50 pt-3">
                        <ActionButton
                            variant="info"
                            icon={ArrowUpRight}
                            onClick={() => navigate("/contacts")}
                        >
                            Ver Enlaces
                        </ActionButton>
                    </div>
                </div>
            </div>

            {/* =========================================================================
                COLUMNA DERECHA: HISTORIAL E HISTÓRICO DE AUDITORÍAS (xl:col-span-7)
               ========================================================================= */}
            <div className="xl:col-span-7 flex flex-col gap-[clamp(1rem,1.5vw,1.5rem)] w-full">
                <span className="text-[clamp(10px,0.55vw,11px)] font-black tracking-widest text-slate-500 uppercase border-b border-[#182033]/60 pb-2 select-none">
                    {isCarer ? "Incidentes Críticos Detectados" : "Últimas Evaluaciones de Comportamiento Semántico"}
                </span>

                <div className="flex flex-col gap-4">
                    {isCarer ? (
                        data.top3Alerts && data.top3Alerts.length > 0 ? (
                            data.top3Alerts.map((alert) => {
                                const level = alert.riskLevel || "LOW";
                                const cardVariant = level === "HIGH" ? "danger" : level === "MEDIUM" ? "warning" : "success";
                                return (
                                    <ItemCard
                                        key={alert.id}
                                        title={alert.title}
                                        subtitle={alert.protectedFullName || "Usuario Protegido"}
                                        description={alert.contentSummary || "Se detectaron anomalías estructurales en el mensaje analizado."}
                                        timestamp={alert.createdAt || "En Curso"}
                                        primaryVariant={cardVariant}
                                        badges={[
                                            { label: `Riesgo ${level}`, variant: cardVariant },
                                            { label: alert.isResolved ? "Cerrado" : "Abierto", variant: alert.isResolved ? "success" : "warning" }
                                        ]}
                                        onActionClick={() => navigate(`/alerts/${alert.id}`)}
                                        actionLabel="Atender"
                                    />
                                );
                            })
                        ) : (
                            <EmptyState label="PERÍMETRO SEGURO • SIN ALERTAS VIGENTES" />
                        )
                    ) : (
                        data.top3Analysis && data.top3Analysis.length > 0 ? (
                            data.top3Analysis.map((analysis) => {
                                const level = analysis.riskLevel || "LOW";
                                const cardVariant = level === "HIGH" ? "danger" : level === "MEDIUM" ? "warning" : "success";
                                return (
                                    <ItemCard
                                        key={analysis.id}
                                        title={analysis.title || "Evaluación de Mensajes"}
                                        subtitle="Análisis Clínico Semántico"
                                        description={analysis.contentSummary || "Auditoría conductual procesada por el motor VERA."}
                                        timestamp={analysis.createdAt || "Reciente"}
                                        primaryVariant={cardVariant}
                                        badges={[{ label: `Riesgo ${level}`, variant: cardVariant }]}
                                        onActionClick={() => navigate(`/analysis/${analysis.id}`)}
                                        actionLabel="Ver Detalles"
                                    />
                                );
                            })
                        ) : (
                            <EmptyState label="HISTORIAL CLÍNICO VACÍO" />
                        )
                    )}
                </div>
            </div>

        </div>
    );
}