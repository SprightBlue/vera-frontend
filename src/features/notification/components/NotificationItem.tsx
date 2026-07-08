import { X as XIcon, ArrowRight, CheckCircle, Trash2 } from "lucide-react";
import { type AppNotification } from "@/features/notification/api/notificationsApi.ts";
import { getNotificationConfig } from "@/features/notification/utils/notificationConfig";

interface ItemProps {
    notif: AppNotification;
    onAction: (notif: AppNotification, action: 'ACCEPT' | 'REJECT' | 'DELETE') => void;
    onSelect: (notif: AppNotification) => void;
}

export function NotificationItem({ notif, onAction, onSelect }: ItemProps) {
    const config = getNotificationConfig(notif.type);

    const invitationId = notif.payload && typeof notif.payload === 'object'
        ? (notif.payload as Record<string, string | number>).id
        : null;

    return (
        <div className={`group rounded-2xl border-y border-r border-l-4 bg-linear-to-b from-[#0a0f24] to-[#070B1A] ${config.permanentBorder} ${config.borderLeft} p-[clamp(0.8rem,1.1vw,1.4rem)] shadow-xl relative overflow-hidden flex flex-col gap-3.5 transition-all duration-150`}>

            <div className={`absolute top-0 right-0 w-[clamp(120px,14vw,280px)] h-[clamp(120px,14vw,280px)] rounded-full filter blur-[70px] opacity-10 pointer-events-none ${config.glowColor}`} />

            <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onAction(notif, 'DELETE'); }}
                className="absolute top-0 right-0 w-[clamp(1.6rem,2vw,2.5rem)] h-[clamp(1.6rem,2vw,2.5rem)] flex items-center justify-center text-slate-500 hover:bg-red-500 hover:text-white active:bg-red-600 transition-colors duration-100 rounded-tr-2xl rounded-bl-md cursor-pointer z-30 select-none"
                title="Eliminar notificación"
            >
                <XIcon className="w-[clamp(10px,0.65vw,14px)] h-[clamp(10px,0.65vw,14px)]" strokeWidth={2.5} />
            </button>

            <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4 relative z-10 w-full pr-6 sm:pr-8">

                <div className="flex flex-col gap-1 min-w-0 flex-1 w-full">
                    <h3 className="text-[clamp(0.85rem,0.95vw,1.15rem)] font-bold tracking-tight text-white select-text truncate">
                        {notif.title}
                    </h3>
                    <p className="text-[clamp(0.72rem,0.76vw,0.9rem)] text-slate-400 leading-relaxed font-medium select-text line-clamp-2 pr-1">
                        {notif.message}
                    </p>
                </div>

                <div className="flex items-start shrink-0 gap-3 select-none pl-0 sm:pl-4 border-l-0 sm:border-l border-slate-800/40 w-full sm:w-auto justify-between sm:justify-end h-full">
                    <div className="flex flex-col items-start sm:items-end gap-1.5 text-left sm:text-right">
                        <span className="text-[clamp(0.7rem,0.72vw,0.85rem)] font-medium text-slate-500 mt-0.5 whitespace-nowrap">
                            {notif.createdAt}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[clamp(7.5px,0.5vw,10px)] font-black uppercase tracking-wider border shrink-0 ${config.bgColor} ${config.borderColor} ${config.textColor}`}>
                            {config.label}
                        </span>
                    </div>
                </div>
            </div>

            {(notif.type === 'ALERT' || (notif.type === 'INVITATION' && invitationId)) && (
                <div className="w-full flex items-center justify-end gap-2 border-t border-[#182033]/60 pt-3 relative z-10">
                    {notif.type === 'INVITATION' && invitationId && (
                        <>
                            <button
                                type="button"
                                onClick={() => onAction(notif, 'ACCEPT')}
                                className="h-[clamp(1.6rem,2vw,2.4rem)] flex items-center justify-center gap-1.5 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[clamp(8.5px,0.55vw,11px)] uppercase tracking-wider transition-all duration-150 shadow-lg shadow-emerald-600/10 cursor-pointer active:scale-[0.97]"
                            >
                                <CheckCircle className="h-[clamp(11px,0.7vw,15px)] w-[clamp(11px,0.7vw,15px)]" />
                                <span>Aceptar</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => onAction(notif, 'REJECT')}
                                className="h-[clamp(1.6rem,2vw,2.4rem)] flex items-center justify-center gap-1.5 px-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-[clamp(8.5px,0.55vw,11px)] uppercase tracking-wider transition-all duration-150 shadow-lg shadow-red-600/10 cursor-pointer active:scale-[0.97]"
                            >
                                <Trash2 className="h-[clamp(11px,0.7vw,15px)] w-[clamp(11px,0.7vw,15px)]" />
                                <span>Rechazar</span>
                            </button>
                        </>
                    )}

                    {notif.type === 'ALERT' && (
                        <button
                            type="button"
                            onClick={() => onSelect(notif)}
                            className="w-full sm:w-auto h-[clamp(1.6rem,2vw,2.4rem)] flex items-center justify-center gap-1.5 px-3.5 rounded-xl border border-[#182033] bg-[#0a0f24]/60 text-[#94a3b8] hover:text-white text-[clamp(9px,0.58vw,11.5px)] font-bold uppercase tracking-widest cursor-pointer group/btn transition-all duration-150 active:scale-[0.98]"
                        >
                            <span>Ver Detalles</span>
                            <ArrowRight className="w-[clamp(11px,0.7vw,15px)] h-[clamp(11px,0.7vw,15px)] transform group-hover/btn:translate-x-0.5 transition-transform text-slate-400 group-hover/btn:text-white" />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default NotificationItem;