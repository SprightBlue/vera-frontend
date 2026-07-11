import { useNavigate } from "react-router-dom";
import { LoadingScreen } from "@/features/shared/components/LoadingScreen";
import { RetryScreen } from "@/features/shared/components/RetryScreen";
import { EmptyState } from "@/features/shared/components/EmptyState";
import { ItemCard } from "@/features/shared/components/ItemCard";
import { type DashboardResponse } from "@/features/dashboard/api/dashboardApi";
import { RISK_LABELS_ES } from "@/features/shared/utils/typeConfig";

import { MetricsCard } from "@/features/dashboard/components/MetricsCard.tsx";
import { DashboardCard } from "@/features/dashboard/components/DashboardCard.tsx";
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

    const renderContactAvatar = () => {
        if (!latestTrustContact) {
            return (
                <div className="w-9 h-9 rounded-full bg-[#0b122c] border border-dashed border-[#1c2848] text-slate-500 font-sans font-bold text-xs flex items-center justify-center">
                    --
                </div>
            );
        }

        if (latestTrustContact.oppositeUserImage) {
            return (
                <img
                    src={latestTrustContact.oppositeUserImage}
                    alt={latestTrustContact.oppositeUserFullName}
                    className="w-9 h-9 rounded-full object-cover border border-[#1c2848] shadow-[0_0_10px_rgba(59,130,246,0.1)]"
                />
            );
        }

        const initials = latestTrustContact.oppositeUserFullName
            .split(" ")
            .map(n => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();

        return (
            <div className="w-9 h-9 rounded-full bg-[#0b122c] border border-[#1c2848] text-blue-400 font-sans font-bold text-xs flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.1)]">
                {initials}
            </div>
        );
    };

    return (
        <div className="w-full flex flex-col gap-6 animate-fade-in">

            <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-[clamp(1.2rem,2vw,2.5rem)] select-none border-b border-[#182033]/60 pb-3">
                <div className="xl:col-span-5">
                    <h2 className="text-[clamp(11px,0.72vw,13px)] font-sans font-bold text-white uppercase tracking-[0.18em]">
                        Actividad reciente
                    </h2>
                </div>
                <div className="xl:col-span-7 hidden xl:block">
                    <h2 className="text-[clamp(11px,0.72vw,13px)] font-sans font-bold text-white uppercase tracking-[0.18em]">
                        {isCarer ? "Últimas alertas recibidas" : "Últimos análisis realizados"}
                    </h2>
                </div>
            </div>

            <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-[clamp(1.2rem,2vw,2.5rem)] items-start">

                <div className="xl:col-span-5 flex flex-col gap-4 w-full">
                    <div className="xl:hidden border-b border-[#182033]/30 pb-2 mb-1">
                        <h2 className="text-[11px] font-display font-bold text-white uppercase tracking-[0.15em]">
                            Actividad reciente
                        </h2>
                    </div>

                    <MetricsCard
                        analysisCount={data.analysisCountSince}
                        alertsCount={data.alertsCountSince}
                        resolvedCount={data.resolvedAlertsCountSince}
                    />

                    {latestUpdatedChat ? (
                        <DashboardCard
                            tagLabel="Última Consulta con la IA"
                            title={latestUpdatedChat.title}
                            timestampLabel={latestUpdatedChat.updatedAt}
                            actionLabel="Abrir el chat"
                            variant="purple"
                            onActionClick={() => navigate(latestUpdatedChat.id ? `/chat?currentChatId=${latestUpdatedChat.id}` : "/chat")}
                        />
                    ) : (
                        <EmptyCard
                            title="Sin charts iniciados"
                            description="No registramos ninguna interacción en el chat IA."
                        />
                    )}

                    {latestTrustContact ? (
                        <DashboardCard
                            tagLabel="Último contacto agregado"
                            title={latestTrustContact.oppositeUserFullName}
                            timestampLabel={latestTrustContact.createdAt}
                            actionLabel="Ver Perfil"
                            variant="info"
                            onActionClick={() => navigate("/contacts")}
                            avatarNode={renderContactAvatar()}
                        />
                    ) : (
                        <EmptyCard
                            title="Sin contactos vinculados"
                            description="No se encontraron registros de contactos asignados a tu cuenta."
                        />
                    )}
                </div>

                <div className="xl:col-span-7 flex flex-col gap-4 w-full">
                    <div className="xl:hidden border-b border-[#182033]/30 pb-2 mb-1">
                        <h2 className="text-[11px] font-sans font-bold text-white uppercase tracking-[0.15em]">
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
                                        actionVariant="info"
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