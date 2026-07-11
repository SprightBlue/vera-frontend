import { useNavigate } from "react-router-dom";
import { LoadingScreen } from "@/features/shared/components/LoadingScreen";
import { RetryScreen } from "@/features/shared/components/RetryScreen";
import { EmptyState } from "@/features/shared/components/EmptyState";
import { ItemCard } from "@/features/shared/components/ItemCard";
import { type DashboardResponse } from "@/features/dashboard/api/dashboardApi";
import { RISK_LABELS_ES } from "@/features/shared/utils/typeConfig";

import { MetricsCard } from "@/features/shared/components/MetricsCard";
import { ChatCard } from "@/features/shared/components/ChatCard";
import { ContactCard } from "@/features/shared/components/ContactCard";
import { EmptyCard } from "@/features/shared/components/EmptyCard";

interface DashboardStatsProps {
    loading: boolean;
    error: boolean;
    data: DashboardResponse | null;
    refetch: () => void;
    role: "CARER" | "PROTECTED";
    hasProtected: boolean;
    fullname: string;
}

export function DashboardStats({ loading, error, data, refetch, role, hasProtected, fullname }: DashboardStatsProps) {
    const navigate = useNavigate();

    if (loading) return <LoadingScreen />;
    if (error) return <RetryScreen onRetry={refetch} />;
    if (!data) return null;
    if (role === "CARER" && !hasProtected) return null;

    const isCarer = role === "CARER";
    const { latestUpdatedChat, latestTrustContact } = data;

    return (
        <div className="w-full flex flex-col gap-6 animate-fade-in">

            <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-[clamp(1.2rem,2vw,2.5rem)] select-none border-b border-[#182033]/60 pb-3">
                <div className="xl:col-span-5">
                    <h2 className="text-[clamp(11px,0.72vw,13px)] font-display font-black text-white uppercase tracking-[0.18em]">
                        Actividad reciente
                    </h2>
                </div>

                <div className="xl:col-span-7 hidden xl:block">
                    <h2 className="text-[clamp(11px,0.72vw,13px)] font-display font-black text-white uppercase tracking-[0.18em]">
                        {isCarer ? "Últimas alertas recibidas" : "Últimos análisis realizados"}
                    </h2>
                </div>
            </div>

            <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-[clamp(1.2rem,2vw,2.5rem)] items-start">

                <div className="xl:col-span-5 flex flex-col gap-4 w-full">
                    <div className="xl:hidden border-b border-[#182033]/30 pb-2 mb-1">
                        <h2 className="text-[11px] font-display font-black text-white uppercase tracking-[0.15em]">
                            Actividad reciente
                        </h2>
                    </div>

                    <MetricsCard
                        analysisCount={data.analysisCountSince}
                        alertsCount={data.alertsCountSince}
                        resolvedCount={data.resolvedAlertsCountSince}
                    />

                    {latestUpdatedChat ? (
                        <ChatCard latestChat={latestUpdatedChat} />
                    ) : (
                        <EmptyCard
                            title="Sin charts iniciados"
                            description="No registramos ninguna interacción en el chat IA."
                        />
                    )}

                    {latestTrustContact ? (
                        <ContactCard trustContact={latestTrustContact} />
                    ) : (
                        <EmptyCard
                            title="Sin contactos vinculados"
                            description="No se encontraron registros de contactos asignados a tu cuenta."
                        />
                    )}
                </div>

                <div className="xl:col-span-7 flex flex-col gap-4 w-full">
                    <div className="xl:hidden border-b border-[#182033]/30 pb-2 mb-1">
                        <h2 className="text-[11px] font-display font-black text-white uppercase tracking-[0.15em]">
                            {isCarer ? "Últimas alertas recibidas" : "Últimos análisis realizados"}
                        </h2>
                    </div>

                    {isCarer ? (
                        data.top3Alerts && data.top3Alerts.length > 0 ? (
                            data.top3Alerts.map((alert) => {
                                const level = alert.riskLevel || "LOW";
                                const cardVariant = level === "HIGH" ? "danger" : level === "MEDIUM" ? "warning" : "success";

                                return (
                                    <ItemCard
                                        key={alert.id}
                                        title={alert.title}
                                        subtitle={alert.protectedFullName || "Familiar Protegido"}
                                        description={alert.contentSummary || "El sistema detectó un mensaje inusual."}
                                        timestamp={alert.createdAt || "Ahora mismo"}
                                        primaryVariant={cardVariant}
                                        badges={[
                                            { label: `Riesgo ${RISK_LABELS_ES[level]}`, variant: cardVariant },
                                            { label: alert.isResolved ? "Resuelta" : "Pendiente", variant: alert.isResolved ? "success" : "warning" }
                                        ]}
                                        onActionClick={() => navigate(`/alerts/${alert.id}`)}
                                        actionLabel="Ver Detalles"
                                    />
                                );
                            })
                        ) : (
                            <EmptyState label="¡Todo está perfecto! No hay alertas urgentes en este momento." />
                        )
                    ) : (
                        data.top3Analysis && data.top3Analysis.length > 0 ? (
                            data.top3Analysis.map((analysis) => {
                                const level = analysis.riskLevel || "LOW";
                                const cardVariant = level === "HIGH" ? "danger" : level === "MEDIUM" ? "warning" : "success";
                                return (
                                    <ItemCard
                                        key={analysis.id}
                                        title={analysis.title || "Revisión preventiva"}
                                        subtitle={fullname}
                                        description={analysis.contentSummary || "Consejos y análisis automáticos para garantizar tus interacciones cotidianas."}
                                        timestamp={analysis.createdAt || "Hace poco"}
                                        primaryVariant={cardVariant}
                                        badges={[{ label: `Riesgo ${RISK_LABELS_ES[level]}`, variant: cardVariant }]}
                                        onActionClick={() => navigate(`/analysis/${analysis.id}`)}
                                        actionLabel="Ver Detalles"
                                    />
                                );
                            })
                        ) : (
                            <EmptyState label="Tu historial de análisis se encuentra limpio." />
                        )
                    )}
                </div>
            </div>

        </div>
    );
}