import { type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { type DashboardResponse } from "@/features/dashboard/api/dashboardApi";
import { UI_VARIANTS_MAP } from "@/features/shared/utils/styleConfig";
import { ActionButton } from "@/features/shared/components/ActionButton";
import { MessageSquare, User, Mail, Phone } from "lucide-react";

interface DashboardColumnProps {
    data: DashboardResponse;
}

export function DashboardColumn({ data }: DashboardColumnProps) {
    const navigate = useNavigate();
    const { latestUpdatedChat, latestTrustContact } = data;

    const infoTheme = UI_VARIANTS_MAP['info'];
    const dangerTheme = UI_VARIANTS_MAP['danger'];
    const successTheme = UI_VARIANTS_MAP['success'];

    const renderContactAvatar = (): ReactNode => {
        if (!latestTrustContact) {
            return (
                <div className="w-[clamp(2.5rem,4vw,3rem)] h-[clamp(2.5rem,4vw,3rem)] rounded-full bg-[#0b122c] text-slate-500 font-semibold text-sm flex items-center justify-center shrink-0">
                    --
                </div>
            );
        }

        if (latestTrustContact.oppositeUserImage) {
            return (
                <img
                    src={latestTrustContact.oppositeUserImage}
                    alt={latestTrustContact.oppositeUserFullName}
                    className="w-[clamp(2.5rem,4vw,3rem)] h-[clamp(2.5rem,4vw,3rem)] rounded-full object-cover shrink-0"
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
            <div className="w-[clamp(2.5rem,4vw,3rem)] h-[clamp(2.5rem,4vw,3rem)] rounded-full bg-[#0b122c] text-blue-400 font-bold text-sm flex items-center justify-center shrink-0">
                {initials}
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-4 w-full" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
            <div className="xl:hidden relative pb-2.5 mb-1 flex items-center gap-2 text-[clamp(11px,0.65vw,13px)] font-semibold text-gray-500 normal-case tracking-wide select-none">
                <span>Actividad reciente</span>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-white/5 pointer-events-none" />
            </div>

            <div className="relative w-full overflow-hidden rounded-xl bg-transparent py-1 select-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-blue-500/2 rounded-full filter blur-[120px] pointer-events-none z-0" />

                <div className="flex flex-col gap-[clamp(1.2rem,2vw,2rem)] w-full relative z-10">

                    {/* Sección Resumen Semanal */}
                    <div className="flex flex-col gap-3.5 w-full">
                        <div className="flex flex-col gap-0.5 w-full pb-1">
                            <h3 className="heading-md normal-case text-white">
                                Resumen de la última semana
                            </h3>
                        </div>

                        <div className="grid grid-cols-3 w-full border border-white/5 bg-[#080d20]/40 rounded-xl p-[clamp(0.8rem,1.5vw,1.2rem)] gap-2">
                            {/* Card Item: Análisis */}
                            <div className="flex flex-col items-center justify-center text-center select-text">
                                <div className="flex items-center gap-1.5 justify-center">
                                    <span className="relative flex h-1.5 w-1.5 shrink-0">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                                    </span>
                                    <span className={`text-[clamp(10px,0.6vw,12px)] font-semibold tracking-wide normal-case ${infoTheme.textColor}`}>
                                        Análisis
                                    </span>
                                </div>
                                <span className="text-[clamp(1.3rem,2vw,1.8rem)] font-bold text-white mt-1">
                                    {data.analysisCountSince}
                                </span>
                            </div>

                            {/* Card Item: Alertas */}
                            <div className="flex flex-col items-center justify-center text-center select-text">
                                <div className="flex items-center gap-1.5 justify-center">
                                    <span className="relative flex h-1.5 w-1.5 shrink-0">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                                    </span>
                                    <span className={`text-[clamp(10px,0.6vw,12px)] font-semibold tracking-wide normal-case ${dangerTheme.textColor}`}>
                                        Alertas
                                    </span>
                                </div>
                                <span className="text-[clamp(1.3rem,2vw,1.8rem)] font-bold text-white mt-1">
                                    {data.alertsCountSince}
                                </span>
                            </div>

                            {/* Card Item: Resueltas */}
                            <div className="flex flex-col items-center justify-center text-center select-text">
                                <div className="flex items-center gap-1.5 justify-center">
                                    <span className="relative flex h-1.5 w-1.5 shrink-0">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                    </span>
                                    <span className={`text-[clamp(10px,0.6vw,12px)] font-semibold tracking-wide normal-case ${successTheme.textColor}`}>
                                        Resueltas
                                    </span>
                                </div>
                                <span className="text-[clamp(1.3rem,2vw,1.8rem)] font-bold text-white mt-1">
                                    {data.resolvedAlertsCountSince}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-white/5" />

                    {/* Sección Último Chat */}
                    <div className="flex flex-col gap-3 w-full">
                        <div className="flex items-between justify-between w-full pb-1">
                            <span className="text-[clamp(11px,0.6vw,12px)] font-semibold text-gray-500 tracking-wide normal-case select-text">
                                Último chat utilizado
                            </span>
                            {latestUpdatedChat && (
                                <span className="text-[11px] font-medium text-gray-500 normal-case select-text">
                                    {latestUpdatedChat.updatedAt}
                                </span>
                            )}
                        </div>

                        {latestUpdatedChat ? (
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full border border-white/5 bg-[#040714]/40 rounded-xl p-[clamp(0.8rem,1.5vw,1.2rem)]">
                                <div className="flex flex-col min-w-0 flex-1">
                                    <h4 className="text-[clamp(13px,0.8vw,14.5px)] font-semibold text-white line-clamp-1 tracking-wide normal-case select-text">
                                        {latestUpdatedChat.title}
                                    </h4>
                                </div>
                                <ActionButton
                                    variant="info"
                                    icon={MessageSquare}
                                    onClick={() => navigate(latestUpdatedChat.id ? `/chat?currentChatId=${latestUpdatedChat.id}` : "/chat")}
                                    className="sm:w-32 h-[clamp(2.1rem,2.4vw,2.4rem)] text-xs"
                                >
                                    Abrir Chat
                                </ActionButton>
                            </div>
                        ) : (
                            <p className="body-text select-text">
                                No tenés chats registrados recientemente
                            </p>
                        )}
                    </div>

                    <div className="h-px bg-white/5" />

                    {/* Sección Último Contacto */}
                    <div className="flex flex-col gap-3 w-full">
                        <div className="flex items-center justify-between w-full pb-1">
                            <span className="text-[clamp(11px,0.6vw,12px)] font-semibold text-gray-500 tracking-wide normal-case select-text">
                                Último contacto agregado
                            </span>
                            {latestTrustContact && (
                                <span className="text-[11px] font-medium text-gray-500 normal-case select-text">
                                    {latestTrustContact.createdAt}
                                </span>
                            )}
                        </div>

                        {latestTrustContact ? (
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 w-full border border-white/5 bg-[#040714]/40 rounded-xl p-[clamp(0.8rem,1.5vw,1.2rem)]">
                                <div className="flex items-center gap-[clamp(0.8rem,1.5vw,1.2rem)] min-w-0 flex-1">
                                    {renderContactAvatar()}
                                    <div className="flex flex-col gap-0.5 min-w-0 flex-1 select-text">
                                        <div className="flex items-center gap-2 text-[clamp(13px,0.85vw,15px)] font-semibold text-slate-200 normal-case">
                                            <User size={14} className="text-slate-500 shrink-0" />
                                            <span className="truncate">{latestTrustContact.oppositeUserFullName}</span>
                                        </div>

                                        <div className="flex flex-col gap-0.5 text-[clamp(11px,0.7vw,13px)] text-slate-400">
                                            <div className="flex items-center gap-2">
                                                <Mail size={14} className="text-slate-500 shrink-0" />
                                                <span className="lowercase truncate">{latestTrustContact.oppositeUserEmail}</span>
                                            </div>
                                            {latestTrustContact.oppositeUserPhone && (
                                                <div className="flex items-center gap-2">
                                                    <Phone size={14} className="text-slate-500 shrink-0" />
                                                    <span className="truncate">{latestTrustContact.oppositeUserPhone}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {latestTrustContact.oppositeUserRole === "PROTECTED" && (
                                    <ActionButton
                                        variant="info"
                                        icon={User}
                                        onClick={() => navigate(`/persons/${latestTrustContact.id}`)}
                                        className="lg:w-32 h-[clamp(2.1rem,2.4vw,2.4rem)] text-xs"
                                    >
                                        Ver Perfil
                                    </ActionButton>
                                )}
                            </div>
                        ) : (
                            <p className="body-text select-text">
                                No registrás contactos de confianza agregados
                            </p>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}