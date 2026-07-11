import { X as XIcon } from "lucide-react";
import { type AppNotification } from "@/features/notification/api/notificationsApi.ts";
import { NOTIFICATION_MAP, type NotificationType } from "@/features/shared/utils/typeConfig";
import { UI_VARIANTS_MAP } from "@/features/shared/utils/styleConfig";
import { ActionButton } from "@/features/shared/components/ActionButton";

interface ItemProps {
    notif: AppNotification;
    onAction: (notif: AppNotification, action: 'ACCEPT' | 'REJECT' | 'DELETE') => void;
    onSelect: (notif: AppNotification) => void;
}

export function NotificationItem({ notif, onAction, onSelect }: ItemProps) {
    const notifType = notif.type as NotificationType;
    const notifConfig = NOTIFICATION_MAP[notifType] || { variant: 'neutral' as const };
    const theme = UI_VARIANTS_MAP[notifConfig.variant];

    const invitationId = notif.payload && typeof notif.payload === 'object'
        ? (notif.payload as Record<string, string | number>).id
        : null;

    const hasActions = notifType === 'ALERT' || (notifType === 'INVITATION' && invitationId);

    return (
        <div className="group rounded-xl border border-[#222f50] bg-[#0c1430]/60 p-[clamp(0.75rem,1.1vw,1.2rem)] shadow-[0_0_30px_rgba(0,0,0,0.3)] relative overflow-hidden flex flex-col gap-2.5 transition-all duration-300 ring-1 ring-inset ring-[#161f35]/20 w-full">

            <div className={`absolute -top-12 -right-12 w-[clamp(160px,16vw,280px)] h-[clamp(160px,16vw,280px)] rounded-full ${theme.glowColor} filter blur-[70px] opacity-15 scale-125 pointer-events-none`} />

            <div className={`absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-${theme.laserColor || 'blue-500'}/35 to-transparent pointer-events-none z-10`} />

            <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onAction(notif, 'DELETE'); }}
                className="absolute top-2.5 right-2.5 p-1.5 rounded-lg border border-[#232e4c] bg-[#141b30] text-slate-300 hover:text-red-400 hover:border-red-500/40 hover:bg-red-950/30 hover:shadow-[0_0_12px_rgba(239,68,68,0.25)] transition-all duration-300 cursor-pointer z-30 select-none overflow-hidden group/close"
                title="Eliminar"
            >
                <XIcon className="w-2.5 h-2.5 relative z-10 transition-transform group-hover/close:scale-110" strokeWidth={2.5} />
            </button>

            <div className="relative z-10 w-full flex flex-col gap-1 pr-7">
                <span className="text-[clamp(0.72rem,0.76vw,0.82rem)] font-sans font-bold text-slate-500 leading-relaxed tracking-wider select-text uppercase">
                    {notif.createdAt}
                </span>

                <h3 className="text-[clamp(0.88rem,1vw,1.1rem)] font-display font-black text-white uppercase tracking-wide pt-0.5 select-text line-clamp-1">
                    {notif.title}
                </h3>

                <p className="text-[clamp(0.74rem,0.78vw,0.84rem)] text-slate-400 leading-normal font-medium select-text line-clamp-2">
                    {notif.message}
                </p>
            </div>

            {hasActions && (
                <div className="relative mt-1.5 w-full z-10 flex flex-wrap gap-2 pt-2.5 border-t border-[#182033]/40">
                    {notifType === 'INVITATION' && invitationId && (
                        <>
                            <ActionButton
                                variant="success"
                                onClick={() => onAction(notif, 'ACCEPT')}
                                className="w-full sm:w-28 h-8 text-[10px] font-sans font-bold tracking-wider uppercase"
                            >
                                Aceptar
                            </ActionButton>
                            <ActionButton
                                variant="danger"
                                onClick={() => onAction(notif, 'REJECT')}
                                className="w-full sm:w-28 h-8 text-[10px] font-sans font-bold tracking-wider uppercase"
                            >
                                Rechazar
                            </ActionButton>
                        </>
                    )}

                    {notifType === 'ALERT' && (
                        <ActionButton
                            variant={notifConfig.variant}
                            onClick={() => onSelect(notif)}
                            className="w-full sm:w-36 h-8 text-[10px] font-sans font-bold tracking-wider uppercase rounded-lg transition-all duration-150 active:scale-[0.96]"
                        >
                            Ver Detalles
                        </ActionButton>
                    )}
                </div>
            )}
        </div>
    );
}