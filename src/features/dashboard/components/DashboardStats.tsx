import { useNavigate } from "react-router-dom";
import { ItemCard } from "@/features/shared/components/ItemCard";
import { EmptyScreen } from "@/features/shared/components/EmptyScreen";
import { type DashboardResponse } from "@/features/dashboard/api/dashboardApi";
import { RISK_LABELS_ES } from "@/features/shared/utils/typeConfig";
import { DashboardColumn } from "@/features/dashboard/components/DashboardColumn";

interface DashboardStatsProps {
    data: DashboardResponse;
    role: "CARER" | "PROTECTED";
    fullname: string;
}

export function DashboardStats({ data, role, fullname }: DashboardStatsProps) {
    const navigate = useNavigate();
    const isCarer = role === "CARER";

    return (
        <div className="w-full flex flex-col gap-[clamp(1rem,1.8vw,2rem)] animate-fade-in">

            {/* Encabezados visibles en pantallas grandes con gap fluido y Montserrat */}
            <div className="w-full grid-cols-1 xl:grid-cols-12 gap-[clamp(1.2rem,2vw,2.5rem)] hidden xl:grid">
                <div
                    className="xl:col-span-5 relative pb-3.5 flex items-center gap-2 text-[clamp(0.75rem,1.2vw,0.85rem)] font-semibold text-gray-500 normal-case tracking-wide"
                    style={{ fontFamily: "'Montserrat', system-ui, sans-serif" }}
                >
                    <span>Actividad reciente</span>
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-white/5 pointer-events-none" />
                </div>

                <div
                    className="xl:col-span-7 relative pb-3.5 flex items-center gap-2 text-[clamp(0.75rem,1.2vw,0.85rem)] font-semibold text-gray-500 normal-case tracking-wide"
                    style={{ fontFamily: "'Montserrat', system-ui, sans-serif" }}
                >
                    {isCarer ? (
                        <span>Últimas alertas recibidas</span>
                    ) : (
                        <span>Últimos análisis realizados</span>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-white/5 pointer-events-none" />
                </div>
            </div>

            {/* Grid principal fluido */}
            <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-[clamp(1.2rem,2vw,2.5rem)] items-start">
                <div className="xl:col-span-5 w-full">
                    <DashboardColumn data={data} />
                </div>

                <div className="xl:col-span-7 flex flex-col gap-[clamp(0.8rem,1.5vw,1.2rem)] w-full">
                    {/* Encabezado visible solo en móviles con Montserrat */}
                    <div
                        className="xl:hidden relative pb-2.5 mb-1 flex items-center gap-2 text-[clamp(0.75rem,1.2vw,0.85rem)] font-semibold text-gray-500 normal-case tracking-wide"
                        style={{ fontFamily: "'Montserrat', system-ui, sans-serif" }}
                    >
                        {isCarer ? (
                            <span>Últimas alertas recibidas</span>
                        ) : (
                            <span>Últimos análisis realizados</span>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/5 pointer-events-none" />
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
                                        subtitle={alert.trustContact?.oppositeUserFullName || "Familiar Protegido"}
                                        description={alert.contentSummary || "El sistema detectó un mensaje inusual."}
                                        timestamp={alert.createdAt || "Ahora mismo"}
                                        primaryVariant={cardVariant}
                                        badges={[
                                            { label: `Riesgo ${RISK_LABELS_ES[level]}`, variant: cardVariant },
                                            {
                                                label: alert.isResolved ? "Resuelta" : "Pendiente",
                                                variant: alert.isResolved ? "success" : "warning"
                                            }
                                        ]}
                                        onActionClick={() => navigate(`/alerts/${alert.id}`)}
                                        actionVariant="info"
                                        actionLabel="Ver Detalles"
                                    />
                                );
                            })
                        ) : (
                            <EmptyScreen label="No se encontraron alertas registradas" />
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
                            <EmptyScreen label="No se encontraron análisis registrados" />
                        )
                    )}
                </div>
            </div>

        </div>
    );
}