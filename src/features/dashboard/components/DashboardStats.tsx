import {useNavigate} from "react-router-dom";
import {ItemCard} from "@/features/shared/components/ItemCard";
import {EmptyCard} from "@/features/dashboard/components/EmptyCard";
import {EmptyScreen} from "@/features/shared/components/EmptyScreen";
import {type DashboardResponse} from "@/features/dashboard/api/dashboardApi";
import {RISK_LABELS_ES} from "@/features/shared/utils/typeConfig";

import {MetricsCard} from "@/features/dashboard/components/MetricsCard";
import {DashboardCard} from "@/features/dashboard/components/DashboardCard";

interface DashboardStatsProps {
    data: DashboardResponse;
    role: "CARER" | "PROTECTED";
    fullname: string;
}

export function DashboardStats({data, role, fullname}: DashboardStatsProps) {
    const navigate = useNavigate();

    const isCarer = role === "CARER";
    const {latestUpdatedChat, latestTrustContact} = data;

    const renderContactAvatar = () => {
        if (!latestTrustContact) {
            return (
                <div
                    className="w-9 h-9 rounded-full bg-[#0b122c] border border-dashed border-[#1c2848] text-slate-500 font-sans font-bold text-xs flex items-center justify-center">
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
            <div
                className="w-9 h-9 rounded-full bg-[#0b122c] border border-[#1c2848] text-blue-400 font-sans font-bold text-xs flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.1)]">
                {initials}
            </div>
        );
    };

    return (
        <div className="w-full flex flex-col gap-6 animate-fade-in">

            <div
                className="w-full grid-cols-1 xl:grid-cols-12 gap-[clamp(1.2rem,2vw,2.5rem)] select-none hidden xl:grid">

                <div
                    className="xl:col-span-5 relative pb-3.5 flex items-center gap-2 text-[clamp(10px,0.58vw,11px)] uppercase tracking-widest text-slate-500 font-display font-extrabold">
                    <span>Actividad reciente</span>
                    <div
                        className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-slate-500/10 to-transparent pointer-events-none"/>
                </div>

                <div
                    className="xl:col-span-7 relative pb-3.5 flex items-center gap-2 text-[clamp(10px,0.58vw,11px)] uppercase tracking-widest text-slate-500 font-display font-extrabold">
                    {isCarer ? (
                        <>
                            <span>Últimas alertas recibidas</span>
                        </>
                    ) : (
                        <>
                            <span>Últimos análisis realizados</span>
                        </>
                    )}
                    <div
                        className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-slate-500/10 to-transparent pointer-events-none"/>
                </div>
            </div>

            <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-[clamp(1.2rem,2vw,2.5rem)] items-center">

                <div className="xl:col-span-5 flex flex-col gap-4 w-full">

                    <div
                        className="xl:hidden relative pb-2.5 mb-1 flex items-center gap-2 text-[clamp(10px,0.58vw,11px)] uppercase tracking-widest text-slate-500 font-display font-extrabold select-none">
                        <span>Actividad reciente</span>
                        <div
                            className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-slate-500/10 to-transparent pointer-events-none"/>
                    </div>

                    <MetricsCard
                        analysisCount={data.analysisCountSince}
                        alertsCount={data.alertsCountSince}
                        resolvedCount={data.resolvedAlertsCountSince}
                    />

                    {latestUpdatedChat ? (
                        <DashboardCard
                            tagLabel="Último Chat Actualizado"
                            title={latestUpdatedChat.title}
                            timestampLabel={latestUpdatedChat.updatedAt}
                            actionLabel="Abrir el chat"
                            variant="info"
                            onActionClick={() => navigate(latestUpdatedChat.id ? `/chat?currentChatId=${latestUpdatedChat.id}` : "/chat")}
                        />
                    ) : (
                        <EmptyCard label="No tenés chats registrados recientemente"/>
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
                        <EmptyCard label="No registrás contactos de confianza agregados"/>
                    )}
                </div>

                <div className="xl:col-span-7 flex flex-col gap-4 w-full">

                    <div
                        className="xl:hidden relative pb-2.5 mb-1 flex items-center gap-2 text-[clamp(10px,0.58vw,11px)] uppercase tracking-widest text-slate-500 font-display font-extrabold select-none">
                        {isCarer ? (
                            <>
                                <span>Últimas alertas recibidas</span>
                            </>
                        ) : (
                            <>
                                <span>Últimos análisis realizados</span>
                            </>
                        )}
                        <div
                            className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-slate-500/10 to-transparent pointer-events-none"/>
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
                                            {label: `Riesgo ${RISK_LABELS_ES[level]}`, variant: cardVariant},
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
                            <EmptyScreen label="NO SE ENCONTRARON ALERTAS REGISTRADAS"/>
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
                                        badges={[{label: `Riesgo ${RISK_LABELS_ES[level]}`, variant: cardVariant}]}
                                        onActionClick={() => navigate(`/analysis/${analysis.id}`)}
                                        actionLabel="Ver Detalles"
                                    />
                                );
                            })
                        ) : (
                            <EmptyScreen label="NO SE ENCONTRARON ANÁLISIS REGISTRADOS"/>
                        )
                    )}
                </div>
            </div>

        </div>
    );
}