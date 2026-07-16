import type {ReactNode} from "react";
import {useNavigate} from "react-router-dom";
import {type DashboardResponse} from "@/features/dashboard/api/dashboardApi";
import {UI_VARIANTS_MAP} from "@/features/shared/utils/styleConfig";
import {ActionButton} from "@/features/shared/components/ActionButton";
import {MessageSquare, User, Mail, Phone} from "lucide-react";

interface DashboardColumnProps {
    data: DashboardResponse;
}

export function DashboardColumn({data}: DashboardColumnProps) {
    const navigate = useNavigate();
    const {latestUpdatedChat, latestTrustContact} = data;

    const infoTheme = UI_VARIANTS_MAP['info'];
    const dangerTheme = UI_VARIANTS_MAP['danger'];
    const successTheme = UI_VARIANTS_MAP['success'];

    const renderContactAvatar = (): ReactNode => {
        if (!latestTrustContact) {
            return (
                <div
                    className="w-16 h-16 rounded-full bg-[#0b122c] text-slate-500 font-sans font-bold text-sm flex items-center justify-center shrink-0">
                    --
                </div>
            );
        }

        if (latestTrustContact.oppositeUserImage) {
            return (
                <img
                    src={latestTrustContact.oppositeUserImage}
                    alt={latestTrustContact.oppositeUserFullName}
                    className="w-16 h-16 rounded-full object-cover shrink-0"
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
                className="w-16 h-16 rounded-full bg-[#0b122c] text-blue-400 font-sans font-extrabold text-sm flex items-center justify-center shrink-0">
                {initials}
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-4 w-full">
            <div
                className="xl:hidden relative pb-2.5 mb-1 flex items-center gap-2 text-[clamp(10px,0.58vw,11px)] uppercase tracking-widest text-slate-500 font-display font-extrabold select-none">
                <span>Actividad reciente</span>
                <div
                    className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-slate-500/10 to-transparent pointer-events-none"/>
            </div>

            <div
                className="relative w-full overflow-hidden rounded-xl bg-transparent px-[clamp(0.2rem,1vw,1rem)] py-[clamp(1rem,2vw,1.8rem)] select-none">

                <div
                    className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-size-[3.5rem_3.5rem] mask-[radial-gradient(ellipse_at_center,black_20%,transparent_70%)] opacity-55 pointer-events-none z-0"
                />

                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-blue-500/3 rounded-full filter blur-[120px] pointer-events-none z-0"
                />

                <div className="flex flex-col gap-8 w-full relative z-10">

                    <div className="flex flex-col gap-4 w-full">
                        <div className="flex flex-col gap-0.5 w-full pb-1">
                            <h3 className="text-[clamp(13px,0.85vw,15px)] font-display font-black uppercase text-white tracking-wide select-text mt-1">
                                Resumen de la última semana
                            </h3>
                        </div>

                        <div className="grid grid-cols-3 w-full">
                            <div
                                className="relative p-2 flex flex-col items-center justify-center text-center select-text">
                                <div className="flex flex-col items-center justify-center gap-2 w-full">
                                    <div className="flex items-center gap-1.5 justify-center">
                                        <span className="relative flex h-1.5 w-1.5 shrink-0">
                                            <span
                                                className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"/>
                                            <span
                                                className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"/>
                                        </span>
                                        <span
                                            className={`text-[9px] font-display font-extrabold tracking-widest uppercase ${infoTheme.textColor}`}>
                                            Análisis
                                        </span>
                                    </div>
                                    <span
                                        className="text-[clamp(1.3rem,1.8vw,2.2rem)] font-sans font-black text-white leading-none mt-0.5">
                                        {data.analysisCountSince}
                                    </span>
                                </div>
                            </div>

                            <div
                                className="relative p-2 flex flex-col items-center justify-center text-center select-text">
                                <div className="flex flex-col items-center justify-center gap-2 w-full">
                                    <div className="flex items-center gap-1.5 justify-center">
                                        <span className="relative flex h-1.5 w-1.5 shrink-0">
                                            <span
                                                className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"/>
                                            <span
                                                className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"/>
                                        </span>
                                        <span
                                            className={`text-[9px] font-display font-extrabold tracking-widest uppercase ${dangerTheme.textColor}`}>
                                            Alertas
                                        </span>
                                    </div>
                                    <span
                                        className="text-[clamp(1.3rem,1.8vw,2.2rem)] font-sans font-black text-white leading-none mt-0.5">
                                        {data.alertsCountSince}
                                    </span>
                                </div>
                            </div>

                            <div
                                className="relative p-2 flex flex-col items-center justify-center text-center select-text">
                                <div className="flex flex-col items-center justify-center gap-2 w-full">
                                    <div className="flex items-center gap-1.5 justify-center">
                                        <span className="relative flex h-1.5 w-1.5 shrink-0">
                                            <span
                                                className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"/>
                                            <span
                                                className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"/>
                                        </span>
                                        <span
                                            className={`text-[9px] font-display font-extrabold tracking-widest uppercase ${successTheme.textColor}`}>
                                            Resueltas
                                        </span>
                                    </div>
                                    <span
                                        className="text-[clamp(1.3rem,1.8vw,2.2rem)] font-sans font-black text-white leading-none mt-0.5">
                                        {data.resolvedAlertsCountSince}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-linear-to-r from-transparent via-slate-800/45 to-transparent"/>

                    <div className="flex flex-col gap-3.5 w-full">
                        <div className="flex items-center justify-between w-full pb-1">
                            <span
                                className="text-[clamp(10px,0.58vw,11px)] font-display font-extrabold text-slate-500 tracking-widest uppercase select-text leading-none">
                                Último Chat Utilizado
                            </span>
                            {latestUpdatedChat && (
                                <span
                                    className="text-[9px] font-display font-extrabold text-slate-500 tracking-widest uppercase select-text">
                                    {latestUpdatedChat.updatedAt}
                                </span>
                            )}
                        </div>

                        {latestUpdatedChat ? (
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
                                <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                                    <h3 className="text-[clamp(13px,0.85vw,15px)] font-display font-black text-white line-clamp-2 tracking-wide uppercase select-text leading-snug">
                                        {latestUpdatedChat.title}
                                    </h3>
                                </div>
                                <ActionButton
                                    variant="info"
                                    icon={MessageSquare}
                                    onClick={() => navigate(latestUpdatedChat.id ? `/chat?currentChatId=${latestUpdatedChat.id}` : "/chat")}
                                    className="w-full md:w-36 h-8.5 font-sans font-black tracking-wider uppercase rounded-md shadow-[0_4px_15px_rgba(0,0,0,0.4)] text-[10px]"
                                >
                                    Abrir Chat
                                </ActionButton>
                            </div>
                        ) : (
                            <p className="text-[12.5px] text-slate-400 font-sans font-semibold leading-relaxed tracking-wide">
                                No tenés chats registrados recientemente
                            </p>
                        )}
                    </div>

                    <div className="h-px bg-linear-to-r from-transparent via-slate-800/45 to-transparent"/>

                    <div className="flex flex-col gap-4 w-full">
                        <div className="flex items-center justify-between w-full pb-1">
                            <span
                                className="text-[clamp(10px,0.58vw,11px)] font-display font-extrabold text-slate-500 tracking-widest uppercase select-text leading-none">
                                Último contacto agregado
                            </span>
                            {latestTrustContact && (
                                <span
                                    className="text-[9px] font-display font-extrabold text-slate-500 tracking-widest uppercase select-text">
                                    {latestTrustContact.createdAt}
                                </span>
                            )}
                        </div>

                        {latestTrustContact ? (
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 w-full">
                                <div className="flex items-center gap-4.5 min-w-0 flex-1">
                                    {renderContactAvatar()}
                                    <div className="flex flex-col gap-1 min-w-0 flex-1 select-text">
                                        <h3 className="text-[clamp(14px,0.9vw,16px)] font-display font-black text-white line-clamp-1 tracking-wide uppercase leading-tight">
                                            {latestTrustContact.oppositeUserFullName}
                                        </h3>
                                        <div
                                            className="flex flex-col gap-1 text-[11.5px] md:text-xs text-slate-300 font-sans font-medium tracking-wide">
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0"/>
                                                <span className="truncate">{latestTrustContact.oppositeUserEmail}</span>
                                            </div>
                                            {latestTrustContact.oppositeUserPhone && (
                                                <div className="flex items-center gap-2 text-slate-400">
                                                    <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0"/>
                                                    <span
                                                        className="truncate">{latestTrustContact.oppositeUserPhone}</span>
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
                                        className="w-full md:w-36 h-8.5 font-sans font-black tracking-wider uppercase rounded-md shadow-[0_4px_15px_rgba(0,0,0,0.4)] text-[10px]"
                                    >
                                        Ver Perfil
                                    </ActionButton>
                                )}
                            </div>
                        ) : (
                            <p className="text-[12.5px] text-slate-400 font-sans font-semibold leading-relaxed tracking-wide">
                                No registrás contactos de confianza agregados
                            </p>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}