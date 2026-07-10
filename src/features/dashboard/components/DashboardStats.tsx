// src/features/dashboard/components/DashboardStats.tsx
import { useNavigate } from "react-router-dom";
import { Activity, UserCheck, ShieldAlert, Users, Radio } from "lucide-react";
import { LoadingScreen } from "@/features/shared/components/LoadingScreen";
import { RetryScreen } from "@/features/shared/components/RetryScreen";
import { EmptyState } from "@/features/shared/components/EmptyState";
import { ItemCard } from "@/features/shared/components/ItemCard";
import { TelemetryCounter } from "@/features/shared/components/TelemetryCounter";
import { LiveStatusWidget } from "@/features/shared/components/LiveStatusWidget";
import { type DashboardResponse } from "../api/dashboardApi";

interface DashboardStatsProps {
    loading: boolean;
    error: boolean;
    data: DashboardResponse | null;
    retry: () => void;
    role: "CARER" | "PROTECTED";
    hasProtected: boolean;
}

export function DashboardStats({ loading, error, data, retry, role, hasProtected }: DashboardStatsProps) {
    const navigate = useNavigate();

    if (loading) return <LoadingScreen />;
    if (error) return <RetryScreen onRetry={retry} />;
    if (!data) return null;
    if (role === "CARER" && !hasProtected) return null;

    const isCarer = role === "CARER";
    const latestConnectedUser = data.top3ConnectedUsers?.[0];
    const latestResolvedAlert = data.top3ResolvedAlerts?.[0];

    return (
        <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-[clamp(1.2rem,2vw,2.5rem)] items-start animate-fade-in">

            {/* COLUMNA IZQUIERDA: CONTADORES Y EVENTOS (xl:col-span-5) */}
            <div className="xl:col-span-5 flex flex-col gap-[clamp(1rem,1.5vw,1.5rem)] w-full">
                <span className="text-[clamp(10px,0.55vw,11px)] font-black tracking-widest text-slate-500 uppercase border-b border-[#182033]/60 pb-2 flex items-center gap-2">
                    <Radio size={12} className="text-blue-500 animate-pulse" />
                    Módulos y Telemetría Activa
                </span>

                {/* Grid de Contadores Reutilizables */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
                    {isCarer ? (
                        <>
                            <TelemetryCounter
                                label="Alertas Activas (24h)"
                                value={data.alertsInLast24Hours ?? 0}
                                variant="danger"
                                icon={ShieldAlert}
                            />
                            <TelemetryCounter
                                label="Miembros Protegidos"
                                value={data.connectedUsersCount ?? 0}
                                variant="info"
                                icon={Users}
                            />
                        </>
                    ) : (
                        <>
                            <TelemetryCounter
                                label="Análisis IA (24h)"
                                value={data.analysisInLast24Hours ?? 0}
                                variant="info"
                                icon={Activity}
                            />
                            <TelemetryCounter
                                label="Casos Protegidos (24h)"
                                value={data.resolvedAlertsInLast24Hours ?? 0}
                                variant="success"
                                icon={UserCheck}
                            />
                        </>
                    )}
                </div>

                {/* Widget de Monitoreo de Estado en Vivo */}
                {isCarer ? (
                    <LiveStatusWidget
                        type="USER"
                        title={latestConnectedUser?.protectedFullName || "Sin telemetría"}
                        subtitle={latestConnectedUser?.isConnected ? (latestConnectedUser.locationText || "Dispositivo en patrullaje") : "Dispositivo fuera de alcance"}
                        isConnected={latestConnectedUser?.isConnected ?? false}
                    />
                ) : (
                    <LiveStatusWidget
                        type="RESOLVED"
                        title={latestResolvedAlert?.title || "Perímetro Asegurado"}
                        subtitle={latestResolvedAlert ? "Resuelto de forma segura por VERA" : "No se registraron amenazas recientes"}
                        timestamp="Reciente"
                    />
                )}
            </div>

            {/* COLUMNA DERECHA: HISTORIAL DE INCIDENTES (xl:col-span-7) */}
            <div className="xl:col-span-7 flex flex-col gap-[clamp(1rem,1.5vw,1.5rem)] w-full">
                <span className="text-[clamp(10px,0.55vw,11px)] font-black tracking-widest text-slate-500 uppercase border-b border-[#182033]/60 pb-2">
                    {isCarer ? "Incidentes Críticos en Curso" : "Últimas Auditorías de Comportamiento"}
                </span>

                <div className="flex flex-col gap-4">
                    {isCarer ? (
                        data.top3Alerts && data.top3Alerts.length > 0 ? (
                            data.top3Alerts.map((alert) => (
                                <ItemCard
                                    key={alert.id}
                                    title={alert.title}
                                    subtitle={alert.protectedFullName}
                                    description={alert.description || "Se detectaron anomalías críticas que requieren atención."}
                                    timestamp="En Curso"
                                    primaryVariant="danger"
                                    badges={[
                                        { label: "Emergencia", variant: "danger" },
                                        { label: "En Progreso", variant: "warning" }
                                    ]}
                                    onActionClick={() => navigate(`/alerts/${alert.id}`)}
                                    actionLabel="Atender"
                                />
                            ))
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
                                        description={analysis.contentSummary || "Auditoría conductual procesada."}
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